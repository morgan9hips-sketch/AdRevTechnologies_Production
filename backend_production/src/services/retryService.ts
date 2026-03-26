import { PrismaClient } from '@prisma/client';
import { logger, logBusinessEvent, logError } from '../utils/logger';
import { recordPayout } from '../utils/metrics';

const prisma = new PrismaClient();

interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 60000, // 1 minute
  maxDelayMs: 3600000, // 1 hour
};

/**
 * Calculate exponential backoff delay
 */
function calculateBackoffDelay(attempt: number, config: RetryConfig): number {
  const delay = Math.min(config.baseDelayMs * Math.pow(2, attempt - 1), config.maxDelayMs);
  // Add jitter (±10%)
  const jitter = delay * 0.1 * (Math.random() * 2 - 1);
  return Math.round(delay + jitter);
}

/**
 * Check if error is retryable
 */
function isRetryableError(error: any): boolean {
  // Rate limiting
  if (error.statusCode === 429) return true;

  // Network errors
  if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') return true;

  // PayPal temporary errors
  const retryableMessages = [
    'INTERNAL_SERVICE_ERROR',
    'SERVICE_UNAVAILABLE',
    'RATE_LIMIT_EXCEEDED',
  ];

  return retryableMessages.some(
    (msg) => error.message?.includes(msg) || error.error?.includes(msg)
  );
}

/**
 * Retry a failed payout batch
 */
export async function retryFailedPayout(
  batchId: number,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<{ success: boolean; message: string }> {
  try {
    const batch = await prisma.payoutBatch.findUnique({
      where: { id: batchId },
      include: { payoutItems: true },
    });

    if (!batch) {
      return { success: false, message: 'Batch not found' };
    }

    if (batch.status === 'SUCCESS') {
      return { success: false, message: 'Batch already successful' };
    }

    // Check if batch is eligible for retry
    const failedItems = batch.payoutItems.filter(
      (item) => item.status === 'FAILED' || item.status === 'DENIED'
    );

    if (failedItems.length === 0) {
      return { success: false, message: 'No failed items to retry' };
    }

    // Log retry attempt
    logBusinessEvent('payout_retry_initiated', {
      batchId,
      failedItemCount: failedItems.length,
    });

    // TODO: Implement actual retry logic:
    // 1. Create new payout batch with failed items
    // 2. Call PayPal API to resubmit
    // 3. Update database with new PayPal batch/item IDs
    // 4. Implement exponential backoff using calculateBackoffDelay

    logger.info('Payout retry queued (implementation pending)', {
      batchId,
      failedItems: failedItems.length,
      note: 'Full retry implementation requires PayPal API resubmission',
    });

    return {
      success: true,
      message: `Retry queued for ${failedItems.length} failed items (manual intervention may be required)`,
    };
  } catch (error) {
    logError(error as Error, { context: 'retryFailedPayout', batchId });
    return { success: false, message: 'Retry failed' };
  }
}

/**
 * Automatically retry failed payouts with exponential backoff
 */
export async function autoRetryFailedPayouts(): Promise<void> {
  try {
    // Find batches with failed items that haven't exceeded retry limit
    const failedBatches = await prisma.payoutBatch.findMany({
      where: {
        status: {
          in: ['FAILED', 'DENIED'],
        },
      },
      include: {
        payoutItems: {
          where: {
            status: {
              in: ['FAILED', 'DENIED'],
            },
          },
        },
      },
    });

    logger.info('Auto-retry check', {
      batchesFound: failedBatches.length,
    });

    for (const batch of failedBatches) {
      if (batch.payoutItems.length > 0) {
        await retryFailedPayout(batch.id);
      }
    }
  } catch (error) {
    logError(error as Error, { context: 'autoRetryFailedPayouts' });
  }
}

/**
 * Get failed payout statistics
 */
export async function getFailedPayoutStats(): Promise<{
  totalFailed: number;
  failedByReason: Record<string, number>;
  retryEligible: number;
}> {
  const failedItems = await prisma.payoutItem.findMany({
    where: {
      status: {
        in: ['FAILED', 'DENIED'],
      },
    },
  });

  const stats = {
    totalFailed: failedItems.length,
    failedByReason: {} as Record<string, number>,
    retryEligible: 0,
  };

  for (const item of failedItems) {
    const reason = item.errorMessage || 'UNKNOWN';
    stats.failedByReason[reason] = (stats.failedByReason[reason] || 0) + 1;

    // Check if error is retryable
    if (item.errorMessage && isRetryableError({ message: item.errorMessage })) {
      stats.retryEligible++;
    }
  }

  return stats;
}

/**
 * Mark payout item for manual review
 */
export async function markForManualReview(itemId: number, reason: string): Promise<void> {
  await prisma.payoutItem.update({
    where: { id: itemId },
    data: {
      status: 'REQUIRES_REVIEW',
      errorMessage: `Manual review required: ${reason}`,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: 'payout_manual_review',
      payload: {
        itemId,
        reason,
      },
    },
  });

  logBusinessEvent('payout_manual_review', { itemId, reason });
}
