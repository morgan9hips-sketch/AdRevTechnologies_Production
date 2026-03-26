import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger, logBusinessEvent } from '../utils/logger';
import { updatePayoutStatus } from '../services/payments/paypalAdapter';
import { handleStripeWebhook } from '../services/stripeService';
import crypto from 'crypto';
import Stripe from 'stripe';

const prisma = new PrismaClient();
export const webhookRouter = express.Router();

// PayPal webhook signature verification
const verifyPayPalWebhook = (req: Request): boolean => {
  // TODO: Implement proper PayPal webhook signature verification
  // This is a critical security feature required for production
  // See: https://developer.paypal.com/api/rest/webhooks/rest/

  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    logger.warn('PayPal webhook ID not configured');
    // Only allow in development mode when webhook ID is not configured
    if (process.env.NODE_ENV === 'development') {
      logger.warn('Development mode: Webhook signature verification bypassed');
      return true;
    }
    return false;
  }

  // In production, always verify webhook signature
  // Implementation should use PayPal SDK's webhook verification
  // For now, return false in production to prevent accepting unverified webhooks
  if (process.env.NODE_ENV === 'production') {
    logger.error('Webhook signature verification not yet implemented - rejecting webhook');
    // TODO: Implement actual verification before production use
    return false;
  }

  return true; // Development/testing mode
};

/**
 * PayPal webhook handler for payout events
 */
webhookRouter.post(
  '/paypal',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response) => {
    try {
      // Verify webhook signature
      if (!verifyPayPalWebhook(req)) {
        logger.warn('Invalid PayPal webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }

      const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const eventType = event.event_type;

      logger.info('Received PayPal webhook', {
        eventType,
        eventId: event.id,
      });

      // Handle different webhook event types
      switch (eventType) {
        case 'PAYMENT.PAYOUTSBATCH.SUCCESS':
          await handlePayoutBatchSuccess(event);
          break;

        case 'PAYMENT.PAYOUTSBATCH.DENIED':
          await handlePayoutBatchDenied(event);
          break;

        case 'PAYMENT.PAYOUTS-ITEM.SUCCEEDED':
          await handlePayoutItemSuccess(event);
          break;

        case 'PAYMENT.PAYOUTS-ITEM.FAILED':
          await handlePayoutItemFailed(event);
          break;

        case 'PAYMENT.PAYOUTS-ITEM.DENIED':
          await handlePayoutItemDenied(event);
          break;

        case 'PAYMENT.PAYOUTS-ITEM.CANCELED':
          await handlePayoutItemCanceled(event);
          break;

        default:
          logger.debug('Unhandled PayPal webhook event type', { eventType });
      }

      // Always return 200 to acknowledge receipt
      res.status(200).json({ received: true });
    } catch (error) {
      logger.error('Error processing PayPal webhook', error);
      // Still return 200 to prevent retries for unrecoverable errors
      res.status(200).json({ received: true, error: 'Processing error' });
    }
  }
);

// Webhook event handlers
async function handlePayoutBatchSuccess(event: any) {
  const payoutBatchId = event.resource.payout_batch_id;

  const batch = await prisma.payoutBatch.findFirst({
    where: { paypalBatchId: payoutBatchId },
  });

  if (batch) {
    await prisma.payoutBatch.update({
      where: { id: batch.id },
      data: {
        status: 'SUCCESS',
        processedAt: new Date(),
      },
    });

    logBusinessEvent('payout_batch_success', {
      batchId: batch.id,
      payoutBatchId,
    });
  }
}

async function handlePayoutBatchDenied(event: any) {
  const payoutBatchId = event.resource.payout_batch_id;

  const batch = await prisma.payoutBatch.findFirst({
    where: { paypalBatchId: payoutBatchId },
  });

  if (batch) {
    await prisma.payoutBatch.update({
      where: { id: batch.id },
      data: {
        status: 'DENIED',
      },
    });

    logBusinessEvent('payout_batch_denied', {
      batchId: batch.id,
      payoutBatchId,
    });
  }
}

async function handlePayoutItemSuccess(event: any) {
  const payoutItemId = event.resource.payout_item_id;
  const transactionId = event.resource.transaction_id;

  const item = await prisma.payoutItem.findFirst({
    where: { paypalItemId: payoutItemId },
  });

  if (item) {
    await prisma.payoutItem.update({
      where: { id: item.id },
      data: {
        status: 'SUCCESS',
        transactionId,
        processedAt: new Date(),
      },
    });

    logBusinessEvent('payout_item_success', {
      itemId: item.id,
      payoutItemId,
      transactionId,
    });
  }
}

async function handlePayoutItemFailed(event: any) {
  const payoutItemId = event.resource.payout_item_id;
  const errors = event.resource.errors || [];

  const item = await prisma.payoutItem.findFirst({
    where: { paypalItemId: payoutItemId },
  });

  if (item) {
    await prisma.payoutItem.update({
      where: { id: item.id },
      data: {
        status: 'FAILED',
        errorMessage: errors.length > 0 ? JSON.stringify(errors) : 'Unknown error',
      },
    });

    logBusinessEvent('payout_item_failed', {
      itemId: item.id,
      payoutItemId,
      errors,
    });
  }
}

async function handlePayoutItemDenied(event: any) {
  const payoutItemId = event.resource.payout_item_id;

  const item = await prisma.payoutItem.findFirst({
    where: { paypalItemId: payoutItemId },
  });

  if (item) {
    await prisma.payoutItem.update({
      where: { id: item.id },
      data: {
        status: 'DENIED',
      },
    });

    logBusinessEvent('payout_item_denied', {
      itemId: item.id,
      payoutItemId,
    });
  }
}

async function handlePayoutItemCanceled(event: any) {
  const payoutItemId = event.resource.payout_item_id;

  const item = await prisma.payoutItem.findFirst({
    where: { paypalItemId: payoutItemId },
  });

  if (item) {
    await prisma.payoutItem.update({
      where: { id: item.id },
      data: {
        status: 'CANCELED',
      },
    });

    logBusinessEvent('payout_item_canceled', {
      itemId: item.id,
      payoutItemId,
    });
  }
}

/**
 * Stripe webhook handler for subscription events
 */
webhookRouter.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response) => {
    try {
      const sig = req.headers['stripe-signature'] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!webhookSecret) {
        logger.error('Stripe webhook secret not configured');
        return res.status(500).json({ error: 'Webhook not configured' });
      }

      // Only verify signature if Stripe is configured
      const stripe = process.env.STRIPE_SECRET_KEY
        ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-10-29.clover' })
        : null;

      if (!stripe) {
        logger.error('Stripe is not configured');
        return res.status(500).json({ error: 'Stripe not configured' });
      }

      let event: Stripe.Event;

      try {
        const rawBody = req.body.toString('utf8');
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
      } catch (err: any) {
        logger.error('Stripe webhook signature verification failed', { error: err.message });
        return res.status(400).json({ error: 'Invalid signature' });
      }

      logger.info('Received Stripe webhook', {
        eventType: event.type,
        eventId: event.id,
      });

      // Handle the webhook event
      await handleStripeWebhook(event);

      res.status(200).json({ received: true });
    } catch (error) {
      logger.error('Error processing Stripe webhook', error);
      // Return 200 to prevent retries for unrecoverable errors
      res.status(200).json({ received: true, error: 'Processing error' });
    }
  }
);

/**
 * Ad Network webhook handler
 * Receives postbacks from ad networks (AdMob, Unity, ironSource, etc.)
 */
webhookRouter.post('/adnetwork', express.json(), async (req: Request, res: Response) => {
  try {
    const { processAdNetworkEvent, verifyWebhookSignature, getNetworkSecret } = await import(
      '../services/adNetworkService'
    );

    // Extract network identifier from query param or header
    const networkRaw = (req.query.network as string) || req.headers['x-network'] || 'Unknown';
    const network = Array.isArray(networkRaw) ? networkRaw[0] : networkRaw;
    const eventType = req.body.eventType || req.body.event_type || req.body.type || 'unknown';
    const networkEventId =
      req.body.eventId || req.body.event_id || req.body.id || `evt_${Date.now()}`;

    logger.info('Received ad network webhook', {
      network,
      eventType,
      eventId: networkEventId,
    });

    // Verify HMAC signature if secret is configured
    const secret = getNetworkSecret(network);
    if (secret) {
      const signature = (req.headers['x-signature'] as string) || '';
      const rawBody = JSON.stringify(req.body);

      if (!verifyWebhookSignature(rawBody, signature, secret)) {
        logger.warn('Invalid ad network webhook signature', {
          network,
          eventId: networkEventId,
        });
        return res.status(401).json({ error: 'Invalid signature' });
      }
    } else if (process.env.NODE_ENV === 'production') {
      logger.error('Ad network webhook secret not configured in production', { network });
      return res.status(500).json({ error: 'Webhook not properly configured' });
    }

    // Process the event
    const result = await processAdNetworkEvent(network, eventType, networkEventId, req.body);

    if (result.success) {
      res.status(200).json({ received: true, message: result.message });
    } else {
      res.status(400).json({ received: false, error: result.message });
    }
  } catch (error) {
    logger.error('Error processing ad network webhook', error);
    // Return 200 to prevent retries for unrecoverable errors
    res.status(200).json({ received: true, error: 'Processing error' });
  }
});
