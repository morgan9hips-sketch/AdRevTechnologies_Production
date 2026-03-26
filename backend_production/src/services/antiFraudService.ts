import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { logger, logBusinessEvent } from '../utils/logger';

const prisma = new PrismaClient();

// Configuration
const DUPLICATE_WATCH_WINDOW_HOURS = parseInt(process.env.DUPLICATE_WATCH_WINDOW_HOURS || '24');
const MAX_WATCHES_PER_HOUR = parseInt(process.env.MAX_WATCHES_PER_HOUR || '10');
const FRAUD_SCORE_THRESHOLD = parseInt(process.env.FRAUD_SCORE_THRESHOLD || '75');

/**
 * Generate a unique watch key for anti-fraud tracking
 */
export const generateUniqueWatchKey = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Hash sensitive data for privacy-preserving storage
 */
export const hashData = (data: string): string => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Check if user has already watched this ad in the last 24 hours
 * Multi-tenant: Scoped to tenant if provided
 */
export const checkDuplicateWatch = async (
  userId: number,
  adId: number,
  tenantId?: string
): Promise<boolean> => {
  const windowStart = new Date(Date.now() - DUPLICATE_WATCH_WINDOW_HOURS * 60 * 60 * 1000);

  const recentWatch = await prisma.watchEvent.findFirst({
    where: {
      userId,
      adId,
      status: { in: ['confirmed', 'credited'] },
      confirmedAt: { gte: windowStart },
      ...(tenantId && { tenantId }),
    },
  });

  return recentWatch !== null;
};

/**
 * Check watch velocity - ensure user isn't watching too many ads per hour
 * Multi-tenant: Scoped to tenant if provided
 */
export const checkWatchVelocity = async (
  userId: number,
  tenantId?: string
): Promise<{ allowed: boolean; count: number }> => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const recentWatches = await prisma.watchEvent.count({
    where: {
      userId,
      status: { in: ['confirmed', 'credited'] },
      confirmedAt: { gte: oneHourAgo },
      ...(tenantId && { tenantId }),
    },
  });

  return {
    allowed: recentWatches < MAX_WATCHES_PER_HOUR,
    count: recentWatches,
  };
};

/**
 * Record or update device fingerprint
 * Multi-tenant: Associate with tenant if provided
 */
export const recordDeviceFingerprint = async (
  userId: number | null,
  deviceId: string,
  ip: string,
  userAgent?: string,
  tenantId?: string
): Promise<void> => {
  const ipHash = hashData(ip);
  const userAgentHash = userAgent ? hashData(userAgent) : undefined;

  const existing = await prisma.deviceFingerprint.findUnique({
    where: { deviceId },
  });

  if (existing) {
    await prisma.deviceFingerprint.update({
      where: { deviceId },
      data: {
        userId: userId || existing.userId,
        ipHash,
        userAgentHash,
        lastSeenAt: new Date(),
        ...(tenantId && { tenantId }),
      },
    });
  } else {
    await prisma.deviceFingerprint.create({
      data: {
        userId,
        deviceId,
        ipHash,
        userAgentHash,
        tenantId: tenantId || null,
      },
    });
  }
};

/**
 * Calculate fraud score based on various signals
 */
export const calculateFraudScore = async (
  userId: number,
  deviceId: string,
  ip: string
): Promise<number> => {
  let score = 0;
  const ipHash = hashData(ip);

  // Check for multiple devices from same IP
  const devicesFromIp = await prisma.deviceFingerprint.count({
    where: { ipHash },
  });
  if (devicesFromIp > 5) score += 30;
  else if (devicesFromIp > 3) score += 15;

  // Check for multiple users on same device
  const usersOnDevice = await prisma.deviceFingerprint.findMany({
    where: { deviceId },
    distinct: ['userId'],
  });
  if (usersOnDevice.length > 3) score += 25;
  else if (usersOnDevice.length > 1) score += 10;

  // Check watch velocity
  const velocity = await checkWatchVelocity(userId);
  if (velocity.count >= MAX_WATCHES_PER_HOUR) score += 20;
  else if (velocity.count >= MAX_WATCHES_PER_HOUR * 0.8) score += 10;

  // Check for rapid-fire watches (within 1 minute)
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  const veryRecentWatches = await prisma.watchEvent.count({
    where: {
      userId,
      createdAt: { gte: oneMinuteAgo },
    },
  });
  if (veryRecentWatches > 3) score += 30;

  return Math.min(score, 100);
};

/**
 * Create a fraud flag
 */
export const createFraudFlag = async (
  entityType: string,
  entityId: string,
  reason: string,
  score: number
): Promise<void> => {
  await prisma.fraudFlag.create({
    data: {
      entityType,
      entityId,
      reason,
      score,
      status: 'pending',
    },
  });

  logBusinessEvent('fraud_flag_created', {
    entityType,
    entityId,
    reason,
    score,
  });

  logger.warn('Fraud flag created', {
    entityType,
    entityId,
    reason,
    score,
  });
};

/**
 * Check if entity is flagged for fraud
 */
export const checkFraudFlags = async (
  entityType: string,
  entityId: string
): Promise<{ flagged: boolean; flags: any[] }> => {
  const flags = await prisma.fraudFlag.findMany({
    where: {
      entityType,
      entityId,
      status: { in: ['pending', 'confirmed'] },
    },
  });

  return {
    flagged: flags.length > 0,
    flags,
  };
};

/**
 * Validate watch attempt with anti-fraud checks
 */
export const validateWatchAttempt = async (
  userId: number,
  adId: number,
  deviceId: string,
  ip: string,
  userAgent?: string
): Promise<{ allowed: boolean; reason?: string; fraudScore?: number }> => {
  // Check for duplicate watch
  const isDuplicate = await checkDuplicateWatch(userId, adId);
  if (isDuplicate) {
    await createFraudFlag('user', userId.toString(), 'Duplicate watch attempt within 24h', 50);
    return { allowed: false, reason: 'Ad already watched in the last 24 hours' };
  }

  // Check velocity
  const velocity = await checkWatchVelocity(userId);
  if (!velocity.allowed) {
    await createFraudFlag(
      'user',
      userId.toString(),
      `Exceeded watch velocity: ${velocity.count} watches/hour`,
      40
    );
    return { allowed: false, reason: 'Too many watches per hour. Please try again later.' };
  }

  // Record device fingerprint
  await recordDeviceFingerprint(userId, deviceId, ip, userAgent);

  // Calculate fraud score
  const fraudScore = await calculateFraudScore(userId, deviceId, ip);

  // Check if user is already flagged
  const { flagged } = await checkFraudFlags('user', userId.toString());

  if (fraudScore >= FRAUD_SCORE_THRESHOLD) {
    await createFraudFlag('user', userId.toString(), `High fraud score: ${fraudScore}`, fraudScore);
    return { allowed: false, reason: 'Suspicious activity detected. Contact support.', fraudScore };
  }

  if (flagged) {
    return { allowed: false, reason: 'Account flagged for review. Contact support.' };
  }

  // Log if score is elevated but not threshold
  if (fraudScore >= 50) {
    logger.warn('Elevated fraud score detected', {
      userId,
      deviceId,
      fraudScore,
    });
  }

  return { allowed: true, fraudScore };
};

/**
 * Validate watch confirmation with uniqueWatchKey
 */
export const validateWatchConfirmation = async (
  userId: number,
  uniqueWatchKey: string,
  deviceId?: string,
  ip?: string
): Promise<{ valid: boolean; watchEvent?: any; reason?: string }> => {
  const watchEvent = await prisma.watchEvent.findUnique({
    where: { uniqueWatchKey },
  });

  if (!watchEvent) {
    return { valid: false, reason: 'Invalid watch key' };
  }

  if (watchEvent.userId !== userId) {
    await createFraudFlag(
      'watch',
      watchEvent.id.toString(),
      'User ID mismatch on confirmation',
      80
    );
    return { valid: false, reason: 'Invalid watch key' };
  }

  if (watchEvent.status !== 'pending') {
    return { valid: false, reason: 'Watch already processed' };
  }

  // Optional: Validate device ID and IP match (if provided)
  if (deviceId && watchEvent.deviceId && watchEvent.deviceId !== deviceId) {
    await createFraudFlag(
      'watch',
      watchEvent.id.toString(),
      'Device ID mismatch on confirmation',
      70
    );
    logger.warn('Device ID mismatch on watch confirmation', {
      watchEventId: watchEvent.id,
      originalDeviceId: watchEvent.deviceId,
      confirmDeviceId: deviceId,
    });
  }

  if (ip && watchEvent.ip && watchEvent.ip !== ip) {
    logger.warn('IP mismatch on watch confirmation', {
      watchEventId: watchEvent.id,
      originalIp: watchEvent.ip,
      confirmIp: ip,
    });
  }

  return { valid: true, watchEvent };
};
