import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { logger, logBusinessEvent } from '../utils/logger';

const prisma = new PrismaClient();

// Initialize Stripe (will be null if not configured)
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-10-29.clover',
    })
  : null;

/**
 * Subscription plan configurations
 */
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    stripePriceId: null,
    features: ['Up to 100 users', 'Basic analytics', 'Community support'],
    limits: {
      maxUsers: 100,
      maxAds: 10,
      maxApiCalls: 1000,
    },
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 9900, // $99/month in cents
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID,
    features: [
      'Up to 1,000 users',
      'Advanced analytics',
      'Email support',
      'Custom branding',
      'API access',
    ],
    limits: {
      maxUsers: 1000,
      maxAds: 50,
      maxApiCalls: 10000,
    },
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    price: 29900, // $299/month in cents
    stripePriceId: process.env.STRIPE_GROWTH_PRICE_ID,
    features: [
      'Up to 10,000 users',
      'Premium analytics',
      'Priority support',
      'Custom branding',
      'API access',
      'Webhooks',
    ],
    limits: {
      maxUsers: 10000,
      maxAds: 200,
      maxApiCalls: 100000,
    },
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99900, // $999/month in cents
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      'Unlimited users',
      'Enterprise analytics',
      '24/7 support',
      'Custom branding',
      'Unlimited API access',
      'Webhooks',
      'Dedicated account manager',
    ],
    limits: {
      maxUsers: null,
      maxAds: null,
      maxApiCalls: null,
    },
  },
};

/**
 * Create Stripe customer for tenant
 */
export const createStripeCustomer = async (
  tenantId: string,
  email: string,
  name: string
): Promise<string> => {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      tenantId,
    },
  });

  // Update tenant billing record
  await prisma.tenantBilling.upsert({
    where: { tenantId },
    create: {
      tenantId,
      stripeCustomerId: customer.id,
      billingEmail: email,
      subscriptionStatus: 'inactive',
      currentPlan: 'free',
    },
    update: {
      stripeCustomerId: customer.id,
      billingEmail: email,
    },
  });

  logBusinessEvent('stripe_customer_created', {
    tenantId,
    customerId: customer.id,
  });

  logger.info(`Stripe customer created for tenant ${tenantId}: ${customer.id}`);

  return customer.id;
};

/**
 * Create subscription for tenant
 */
export const createSubscription = async (
  tenantId: string,
  planId: string,
  paymentMethodId: string
): Promise<Stripe.Subscription> => {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  const plan = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS];
  if (!plan || !plan.stripePriceId) {
    throw new Error('Invalid plan or plan not configured in Stripe');
  }

  // Get or create Stripe customer
  const billing = await prisma.tenantBilling.findUnique({
    where: { tenantId },
  });

  let customerId = billing?.stripeCustomerId;

  if (!customerId) {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      throw new Error('Tenant not found');
    }
    customerId = await createStripeCustomer(
      tenantId,
      `billing@${tenant.subdomain}.com`,
      tenant.name
    );
  }

  // Attach payment method to customer
  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });

  // Set as default payment method
  await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });

  // Create subscription
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: plan.stripePriceId }],
    metadata: {
      tenantId,
      planId,
    },
  });

  // Update billing record
  const subscriptionData = subscription as any; // Stripe types can be complex
  await prisma.tenantBilling.update({
    where: { tenantId },
    data: {
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      currentPlan: planId,
      planPrice: plan.price,
      subscriptionStartAt: new Date((subscriptionData.current_period_start || 0) * 1000),
      subscriptionEndAt: new Date((subscriptionData.current_period_end || 0) * 1000),
    },
  });

  // Update tenant subscription tier
  await prisma.tenant.update({
    where: { id: tenantId },
    data: { subscriptionTier: planId },
  });

  logBusinessEvent('subscription_created', {
    tenantId,
    subscriptionId: subscription.id,
    planId,
  });

  logger.info(`Subscription created for tenant ${tenantId}: ${planId}`);

  return subscription;
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async (tenantId: string): Promise<void> => {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  const billing = await prisma.tenantBilling.findUnique({
    where: { tenantId },
  });

  if (!billing?.stripeSubscriptionId) {
    throw new Error('No active subscription found');
  }

  // Cancel at period end
  const subscription = await stripe.subscriptions.update(billing.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  await prisma.tenantBilling.update({
    where: { tenantId },
    data: {
      subscriptionStatus: 'cancelled',
      cancelledAt: new Date(),
    },
  });

  logBusinessEvent('subscription_cancelled', {
    tenantId,
    subscriptionId: subscription.id,
  });

  logger.info(`Subscription cancelled for tenant ${tenantId}`);
};

/**
 * Handle Stripe webhook events
 */
export const handleStripeWebhook = async (event: Stripe.Event): Promise<void> => {
  logger.info(`Stripe webhook received: ${event.type}`);

  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const tenantId = subscription.metadata.tenantId;

      if (tenantId) {
        const subscriptionData = subscription as any;
        await prisma.tenantBilling.update({
          where: { tenantId },
          data: {
            subscriptionStatus: subscription.status,
            subscriptionEndAt: new Date((subscriptionData.current_period_end || 0) * 1000),
          },
        });

        // If subscription cancelled or ended, downgrade to free
        if (subscription.status === 'canceled') {
          await prisma.tenant.update({
            where: { id: tenantId },
            data: { subscriptionTier: 'free' },
          });
        }

        logBusinessEvent('subscription_updated', {
          tenantId,
          status: subscription.status,
        });
      }
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId =
        typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;

      if (customerId) {
        const billing = await prisma.tenantBilling.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (billing) {
          logBusinessEvent('payment_succeeded', {
            tenantId: billing.tenantId,
            amount: invoice.amount_paid,
          });
        }
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId =
        typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;

      if (customerId) {
        const billing = await prisma.tenantBilling.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (billing) {
          await prisma.tenantBilling.update({
            where: { tenantId: billing.tenantId },
            data: { subscriptionStatus: 'past_due' },
          });

          logBusinessEvent('payment_failed', {
            tenantId: billing.tenantId,
            amount: invoice.amount_due,
          });
        }
      }
      break;
    }

    default:
      logger.debug(`Unhandled webhook event: ${event.type}`);
  }
};

/**
 * Get subscription status for tenant
 */
export const getSubscriptionStatus = async (tenantId: string) => {
  const billing = await prisma.tenantBilling.findUnique({
    where: { tenantId },
  });

  if (!billing) {
    return null;
  }

  const plan = SUBSCRIPTION_PLANS[billing.currentPlan as keyof typeof SUBSCRIPTION_PLANS];

  return {
    ...billing,
    plan,
  };
};
