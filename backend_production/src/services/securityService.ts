/**
 * Security Service
 * Real-time security monitoring and threat detection
 */

import { PrismaClient } from '@prisma/client';
import { logSuspiciousActivity } from './auditService';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// In-memory cache for tracking suspicious activity
// In production, use Redis for distributed systems
const suspiciousActivityCache = new Map<string, { count: number; firstSeen: Date }>();
const CACHE_CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour

// Cleanup cache periodically
setInterval(() => {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;

  for (const [key, value] of suspiciousActivityCache.entries()) {
    if (value.firstSeen.getTime() < oneHourAgo) {
      suspiciousActivityCache.delete(key);
    }
  }
}, CACHE_CLEANUP_INTERVAL);

/**
 * Detect brute force login attempts
 */
export async function detectBruteForce(
  identifier: string,
  ipAddress: string,
  threshold: number = 10
): Promise<boolean> {
  const key = `brute_force:${identifier}:${ipAddress}`;
  const cached = suspiciousActivityCache.get(key);

  if (cached) {
    cached.count++;

    if (cached.count >= threshold) {
      await logSuspiciousActivity(
        'brute_force_detected',
        { identifier, attempts: cached.count },
        ipAddress
      );
      return true;
    }
  } else {
    suspiciousActivityCache.set(key, { count: 1, firstSeen: new Date() });
  }

  return false;
}

/**
 * Detect account enumeration attempts
 */
export async function detectAccountEnumeration(
  ipAddress: string,
  threshold: number = 20
): Promise<boolean> {
  const windowStart = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes

  const emailAttempts = await prisma.loginAttempt.count({
    where: {
      ipAddress,
      successful: false,
      createdAt: {
        gte: windowStart,
      },
    },
  });

  if (emailAttempts >= threshold) {
    await logSuspiciousActivity('account_enumeration', { attempts: emailAttempts }, ipAddress);
    return true;
  }

  return false;
}

/**
 * Detect credential stuffing attacks
 */
export async function detectCredentialStuffing(
  ipAddress: string,
  threshold: number = 5
): Promise<boolean> {
  const windowStart = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes

  // Count failed login attempts from different emails
  const attempts = await prisma.loginAttempt.groupBy({
    by: ['email'],
    where: {
      ipAddress,
      successful: false,
      createdAt: {
        gte: windowStart,
      },
    },
  });

  if (attempts.length >= threshold) {
    await logSuspiciousActivity(
      'credential_stuffing',
      { uniqueEmails: attempts.length },
      ipAddress
    );
    return true;
  }

  return false;
}

/**
 * Detect suspicious device fingerprint changes
 */
export async function detectDeviceFingerprintAnomaly(
  userId: number,
  deviceId: string,
  ipAddress: string
): Promise<boolean> {
  // Check if user has logged in from this device before
  const existingFingerprint = await prisma.deviceFingerprint.findFirst({
    where: {
      userId,
      deviceId,
    },
  });

  if (!existingFingerprint) {
    // New device - check if user has other devices
    const deviceCount = await prisma.deviceFingerprint.count({
      where: { userId },
    });

    // Alert if user suddenly adds many devices
    if (deviceCount >= 5) {
      await logSuspiciousActivity(
        'multiple_devices',
        { deviceCount, newDevice: deviceId },
        ipAddress,
        userId
      );
      return true;
    }
  }

  return false;
}

/**
 * Detect impossible travel (geographic anomaly)
 */
export async function detectImpossibleTravel(userId: number, currentIp: string): Promise<boolean> {
  // Get the user's email first
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!user?.email) {
    return false;
  }

  // Get the last successful login
  const recentAttempt = await prisma.loginAttempt.findFirst({
    where: {
      email: user.email,
      successful: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (recentAttempt) {
    const timeDiff = Date.now() - recentAttempt.createdAt.getTime();

    // If login from different IP within 1 hour, flag as suspicious
    // In production, use geolocation to calculate actual distance
    if (timeDiff < 60 * 60 * 1000 && recentAttempt.ipAddress !== currentIp) {
      await logSuspiciousActivity(
        'impossible_travel',
        {
          previousIp: recentAttempt.ipAddress,
          currentIp,
          timeDiffMinutes: Math.floor(timeDiff / 60000),
        },
        currentIp,
        userId
      );
      return true;
    }
  }

  return false;
}

/**
 * Calculate lockout duration with exponential backoff
 */
export function calculateLockoutDuration(attempts: number): number {
  const baseMs = 15 * 60 * 1000; // 15 minutes base
  const maxMs = 24 * 60 * 60 * 1000; // 24 hours max

  // Cap the exponent to prevent overflow (2^20 is already ~1M)
  const safeExponent = Math.min(Math.max(0, attempts - 5), 20);
  const duration = baseMs * Math.pow(2, safeExponent);

  return Math.min(duration, maxMs);
}

/**
 * Validate OAuth redirect URI
 */
export function validateRedirectUri(uri: string, allowedUris: string[]): boolean {
  try {
    const providedUrl = new URL(uri);

    return allowedUris.some((allowed) => {
      const allowedUrl = new URL(allowed);
      return (
        allowedUrl.origin === providedUrl.origin &&
        providedUrl.pathname.startsWith(allowedUrl.pathname)
      );
    });
  } catch {
    return false;
  }
}

/**
 * Check if IP is in blocklist
 */
export async function isIpBlocked(ipAddress: string): Promise<boolean> {
  // In production, integrate with IP reputation services
  // For now, check in-memory cache
  const key = `blocked:${ipAddress}`;
  const cached = suspiciousActivityCache.get(key);

  if (cached && Date.now() - cached.firstSeen.getTime() < 60 * 60 * 1000) {
    return true;
  }

  return false;
}

/**
 * Block an IP address temporarily
 */
export function blockIp(ipAddress: string, durationMs: number = 60 * 60 * 1000): void {
  const key = `blocked:${ipAddress}`;
  suspiciousActivityCache.set(key, { count: 1, firstSeen: new Date() });

  // Auto-unblock after duration
  setTimeout(() => {
    suspiciousActivityCache.delete(key);
  }, durationMs);

  logger.warn('IP blocked', { ipAddress, durationMs });
}

/**
 * GDPR data deletion (anonymize user data)
 */
export async function gdprDataDeletion(userId: number): Promise<void> {
  await prisma.$transaction([
    // Anonymize audit logs
    prisma.auditLog.updateMany({
      where: { actorId: userId },
      data: { actorId: null, payload: {} },
    }),
    // Soft delete user with data retention for legal requirements
    prisma.user.update({
      where: { id: userId },
      data: {
        email: `deleted_${Date.now()}@deleted.local`,
        password: '',
        name: 'Deleted User',
        emailVerified: false,
      },
    }),
  ]);

  logger.info('GDPR data deletion completed', { userId });
}
