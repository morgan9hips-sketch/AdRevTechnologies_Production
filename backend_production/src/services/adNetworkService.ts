import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { logger, logBusinessEvent } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Verify HMAC signature for webhook
 */
export const verifyWebhookSignature = (
  payload: string,
  signature: string,
  secret: string
): boolean => {
  const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
};

/**
 * Process ad network webhook event
 */
export const processAdNetworkEvent = async (
  network: string,
  eventType: string,
  networkEventId: string,
  payload: any
): Promise<{ success: boolean; message?: string }> => {
  try {
    // Check if event already processed (idempotency)
    const existing = await prisma.adNetworkEvent.findUnique({
      where: { eventId: networkEventId },
    });

    if (existing) {
      logger.info('Ad network event already processed', {
        network,
        eventId: networkEventId,
      });
      return { success: true, message: 'Event already processed' };
    }

    // Extract data from payload (varies by network)
    const adId = extractAdId(payload, network);
    const revenueCents = extractRevenue(payload, network);
    const userId = extractUserId(payload, network);

    // Create ad network event
    const event = await prisma.adNetworkEvent.create({
      data: {
        adId,
        network,
        eventType,
        eventId: networkEventId,
        revenueCents,
        rawPayload: payload,
      },
    });

    logBusinessEvent('ad_network_event_received', {
      network,
      eventType,
      eventId: networkEventId,
      adId,
      revenueCents,
    });

    // If this is a reward event, try to match with pending watch event
    if (eventType === 'reward' || eventType === 'conversion') {
      await reconcileWatchEvent(event.id, userId, adId, networkEventId);
    }

    return { success: true };
  } catch (error: any) {
    logger.error('Error processing ad network event', error);
    return { success: false, message: error.message };
  }
};

/**
 * Reconcile ad network event with watch event
 */
async function reconcileWatchEvent(
  networkEventId: number,
  userId: number | null,
  adId: number | null,
  externalEventId: string
): Promise<void> {
  if (!userId || !adId) {
    logger.warn('Cannot reconcile watch event - missing userId or adId', {
      networkEventId,
      externalEventId,
    });
    return;
  }

  // Find pending watch event for this user and ad
  const watchEvent = await prisma.watchEvent.findFirst({
    where: {
      userId,
      adId,
      status: 'pending',
      createdAt: {
        // Only match recent events (within last hour)
        gte: new Date(Date.now() - 60 * 60 * 1000),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (watchEvent) {
    // Update watch event with network event reference
    await prisma.watchEvent.update({
      where: { id: watchEvent.id },
      data: {
        networkEventId,
        status: 'confirmed',
        confirmedAt: new Date(),
      },
    });

    logger.info('Reconciled watch event with ad network event', {
      watchEventId: watchEvent.id,
      networkEventId,
      userId,
      adId,
    });

    logBusinessEvent('watch_event_reconciled', {
      watchEventId: watchEvent.id,
      networkEventId,
      userId,
      adId,
    });
  } else {
    logger.warn('No matching watch event found for reconciliation', {
      networkEventId,
      userId,
      adId,
      externalEventId,
    });
  }
}

/**
 * Extract ad ID from payload based on network
 */
function extractAdId(payload: any, network: string): number | null {
  // Each network has different payload structure
  // This is a simplified version - customize per network

  switch (network.toLowerCase()) {
    case 'admob':
      return payload.adUnitId ? parseInt(payload.adUnitId) : null;
    case 'unity':
    case 'unity ads':
      return payload.placementId ? parseInt(payload.placementId) : null;
    case 'ironsource':
      return payload.instanceId ? parseInt(payload.instanceId) : null;
    default:
      return payload.adId ? parseInt(payload.adId) : null;
  }
}

/**
 * Extract revenue from payload based on network
 */
function extractRevenue(payload: any, network: string): number {
  // Revenue is typically in dollars, convert to cents
  let revenue = 0;

  switch (network.toLowerCase()) {
    case 'admob':
      revenue = payload.estimatedEarnings?.valueMicros
        ? payload.estimatedEarnings.valueMicros / 10000 // micros to cents
        : 0;
      break;
    case 'unity':
    case 'unity ads':
      revenue = payload.revenue ? Math.floor(payload.revenue * 100) : 0;
      break;
    case 'ironsource':
      revenue = payload.revenue ? Math.floor(payload.revenue * 100) : 0;
      break;
    default:
      revenue = payload.revenue ? Math.floor(payload.revenue * 100) : 0;
      break;
  }

  return Math.max(0, revenue);
}

/**
 * Extract user ID from payload based on network
 */
function extractUserId(payload: any, network: string): number | null {
  // User ID extraction varies by network

  const userIdStr =
    payload.userId || payload.user_id || payload.customUserId || payload.customData?.userId;

  return userIdStr ? parseInt(userIdStr) : null;
}

/**
 * Supported ad networks
 */
export const SUPPORTED_NETWORKS = [
  'AdMob',
  'Unity Ads',
  'ironSource',
  'AppLovin',
  'Vungle',
  'AdColony',
  'Chartboost',
  'Custom',
];

/**
 * Get network webhook secret from environment
 */
export const getNetworkSecret = (network: string): string | null => {
  const envKey = `WEBHOOK_SECRET_${network.toUpperCase().replace(/\s+/g, '_')}`;
  return process.env[envKey] || process.env.WEBHOOK_SECRET_DEFAULT || null;
};
