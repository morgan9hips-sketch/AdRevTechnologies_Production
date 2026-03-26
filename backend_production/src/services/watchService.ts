import { PrismaClient } from '@prisma/client';
import { creditUserForWatch } from './ledgerService';
import {
  generateUniqueWatchKey,
  validateWatchAttempt,
  validateWatchConfirmation,
} from './antiFraudService';
import { BadgeService } from './badgeService';
import { StatsService } from './statsService';
import { logger, logBusinessEvent } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Create a watch event with anti-fraud checks
 */
export const recordWatchEvent = async (
  adId: number,
  userId: number,
  watchedSeconds: number,
  ip: string,
  userAgent?: string,
  deviceId?: string
) => {
  const ad = await prisma.ad.findUnique({ where: { id: adId } });
  if (!ad) throw new Error('Ad not found');
  if (!ad.active) throw new Error('Ad not available');

  // Generate device ID if not provided (fallback)
  const effectiveDeviceId = deviceId || `user_${userId}_${ip}`;

  // Run anti-fraud validation
  const validation = await validateWatchAttempt(userId, adId, effectiveDeviceId, ip, userAgent);
  if (!validation.allowed) {
    throw new Error(validation.reason || 'Watch not allowed');
  }

  // Generate unique watch key
  const uniqueWatchKey = generateUniqueWatchKey();

  // Create watch event
  const event = await prisma.watchEvent.create({
    data: {
      adId,
      userId,
      watchedSeconds,
      ip,
      userAgent,
      deviceId: effectiveDeviceId,
      uniqueWatchKey,
      status: 'pending',
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: userId,
      action: 'watch_recorded',
      payload: { adId, watchedSeconds, ip, uniqueWatchKey, fraudScore: validation.fraudScore },
    },
  });

  logBusinessEvent('watch_initiated', {
    userId,
    adId,
    watchEventId: event.id,
    fraudScore: validation.fraudScore,
  });

  return { ...event, fraudScore: validation.fraudScore };
};

/**
 * Confirm watch and credit user
 */
export const confirmWatch = async (
  uniqueWatchKey: string,
  userId: number,
  networkEventId?: number,
  deviceId?: string,
  ip?: string
) => {
  // Validate confirmation
  const validation = await validateWatchConfirmation(userId, uniqueWatchKey, deviceId, ip);
  if (!validation.valid || !validation.watchEvent) {
    throw new Error(validation.reason || 'Invalid confirmation');
  }

  const ev = validation.watchEvent;
  const ad = await prisma.ad.findUnique({ where: { id: ev.adId } });
  if (!ad) throw new Error('Ad not found');

  // Calculate reward based on watch completion
  const completionRate = Math.min(ev.watchedSeconds / ad.durationSeconds, 1);
  const grossReward = Math.floor(ad.rewardAmount * completionRate);

  await prisma.$transaction(async (tx) => {
    // Use ledger service to credit user (with platform fee deduction)
    await creditUserForWatch(userId, grossReward, ev.id);

    // Update watch event status
    await tx.watchEvent.update({
      where: { id: ev.id },
      data: {
        status: 'confirmed',
        confirmedAt: new Date(),
        networkEventId,
      },
    });

    await tx.auditLog.create({
      data: {
        actorId: userId,
        action: 'watch_confirmed',
        payload: { eventId: ev.id, grossReward, networkEventId },
      },
    });
  });

  logBusinessEvent('watch_confirmed', {
    userId,
    watchEventId: ev.id,
    adId: ev.adId,
    grossReward,
  });

  // Track stats for gamification
  try {
    await StatsService.trackDailyStats(userId, 1, grossReward);
  } catch (error) {
    logger.error('Error tracking daily stats:', error);
    // Don't fail the watch if stats tracking fails
  }

  // Check and award badges
  try {
    const newBadges = await BadgeService.checkAndAwardBadges(userId);
    if (newBadges.length > 0) {
      logger.info(`New badges awarded to user ${userId}:`, newBadges);
    }
  } catch (error) {
    logger.error('Error checking badges:', error);
    // Don't fail the watch if badge checking fails
  }

  // Update user tier
  try {
    await BadgeService.updateUserTier(userId);
  } catch (error) {
    logger.error('Error updating user tier:', error);
    // Don't fail the watch if tier update fails
  }

  // Get updated wallet balance
  const wallet = await prisma.wallet.findUnique({ where: { userId } });

  return {
    success: true,
    grossReward,
    balanceCents: wallet?.balanceCents || 0,
  };
};
