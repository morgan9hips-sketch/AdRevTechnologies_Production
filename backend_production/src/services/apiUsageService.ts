import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Phase 3: API Usage Tracking Service
 * Handles tracking, billing, and analytics for API marketplace
 */

// Pricing tiers configuration
export const PRICING_TIERS = {
  free: {
    name: 'Free',
    quota: 1000,
    pricePerCall: 0, // Free tier has no per-call charge
    monthlyFee: 0,
  },
  pro: {
    name: 'Pro',
    quota: 100000,
    pricePerCall: 0.001, // $0.001 per call
    monthlyFee: 0, // Pay-as-you-go
  },
  enterprise: {
    name: 'Enterprise',
    quota: -1, // Unlimited
    pricePerCall: 0.005, // $0.005 per call (bulk discount)
    monthlyFee: 0, // Custom pricing
  },
};

// Revenue sharing configuration
const PLATFORM_REVENUE_SHARE = 0.7; // Platform gets 70%
const TENANT_REVENUE_SHARE = 0.3; // Tenant gets 30%

/**
 * Record an API call for tracking and billing
 */
export async function recordApiCall(data: {
  apiKeyId: string;
  tenantId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    await prisma.apiCall.create({
      data: {
        apiKeyId: data.apiKeyId,
        tenantId: data.tenantId,
        endpoint: data.endpoint,
        method: data.method,
        statusCode: data.statusCode,
        responseTime: data.responseTime,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        metadata: (data.metadata as any) || {},
      },
    });

    // Update API key usage count
    await prisma.apiKey.update({
      where: { id: data.apiKeyId },
      data: {
        usageCount: { increment: 1 },
        lastUsedAt: new Date(),
      },
    });

    // Update developer account current usage
    await incrementDeveloperUsage(data.tenantId);

    logger.info('API call recorded', {
      apiKeyId: data.apiKeyId.slice(0, 8) + '...', // Log only prefix for security
      tenantId: data.tenantId,
      endpoint: data.endpoint,
      statusCode: data.statusCode,
    });
  } catch (error) {
    logger.error('Failed to record API call', {
      error,
      apiKeyId: data.apiKeyId.slice(0, 8) + '...', // Log only prefix for security
      endpoint: data.endpoint,
    });
    // Don't throw - we don't want to fail the request if logging fails
  }
}

/**
 * Increment developer account usage counter
 */
async function incrementDeveloperUsage(tenantId: string): Promise<void> {
  try {
    const devAccount = await prisma.developerAccount.findUnique({
      where: { tenantId },
    });

    if (devAccount) {
      await prisma.developerAccount.update({
        where: { tenantId },
        data: { currentUsage: { increment: 1 } },
      });
    }
  } catch (error) {
    logger.error('Failed to increment developer usage', {
      error,
      tenantId: tenantId.slice(0, 8) + '...', // Log only prefix for security
    });
  }
}

/**
 * Check if tenant has exceeded their quota
 */
export async function checkQuotaExceeded(tenantId: string): Promise<boolean> {
  try {
    const devAccount = await prisma.developerAccount.findUnique({
      where: { tenantId },
    });

    if (!devAccount) {
      // No developer account means using default free tier
      return false;
    }

    // Enterprise tier has unlimited quota
    if (devAccount.apiQuota === -1) {
      return false;
    }

    // Check if current usage exceeds quota
    return devAccount.currentUsage >= devAccount.apiQuota;
  } catch (error) {
    logger.error('Failed to check quota', {
      error,
      tenantId: tenantId.slice(0, 8) + '...', // Log only prefix for security
    });
    return false; // Default to allowing the request
  }
}

/**
 * Get API usage analytics for a tenant
 */
export async function getApiAnalytics(
  tenantId: string,
  startDate: Date,
  endDate: Date
): Promise<{
  totalCalls: number;
  callsByEndpoint: Record<string, number>;
  callsByStatus: Record<string, number>;
  averageResponseTime: number;
}> {
  const calls = await prisma.apiCall.findMany({
    where: {
      tenantId,
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      endpoint: true,
      statusCode: true,
      responseTime: true,
    },
  });

  const callsByEndpoint: Record<string, number> = {};
  const callsByStatus: Record<string, number> = {};
  let totalResponseTime = 0;

  calls.forEach((call) => {
    // Count by endpoint
    callsByEndpoint[call.endpoint] = (callsByEndpoint[call.endpoint] || 0) + 1;

    // Count by status code range
    const statusRange = `${Math.floor(call.statusCode / 100)}xx`;
    callsByStatus[statusRange] = (callsByStatus[statusRange] || 0) + 1;

    // Sum response times
    totalResponseTime += call.responseTime;
  });

  return {
    totalCalls: calls.length,
    callsByEndpoint,
    callsByStatus,
    averageResponseTime: calls.length > 0 ? totalResponseTime / calls.length : 0,
  };
}

/**
 * Calculate billing for a tenant for a given month
 */
export async function calculateMonthlyBilling(
  tenantId: string,
  month: Date
): Promise<{
  totalCalls: number;
  totalRevenueCents: number;
  platformShare: number;
  tenantShare: number;
}> {
  const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59);

  const calls = await prisma.apiCall.count({
    where: {
      tenantId,
      timestamp: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  });

  // Get developer account to determine pricing tier
  const devAccount = await prisma.developerAccount.findUnique({
    where: { tenantId },
  });

  const tier = devAccount?.billingTier || 'free';
  const pricePerCall = PRICING_TIERS[tier as keyof typeof PRICING_TIERS]?.pricePerCall || 0;

  // Calculate total revenue in cents
  const totalRevenueCents = Math.round(calls * pricePerCall * 100);

  // Calculate revenue shares
  const platformShare = Math.round(totalRevenueCents * PLATFORM_REVENUE_SHARE);
  const tenantShare = Math.round(totalRevenueCents * TENANT_REVENUE_SHARE);

  return {
    totalCalls: calls,
    totalRevenueCents,
    platformShare,
    tenantShare,
  };
}

/**
 * Create or update monthly billing record
 */
export async function processMonthlyBilling(tenantId: string, month: Date): Promise<void> {
  const billing = await calculateMonthlyBilling(tenantId, month);

  const devAccount = await prisma.developerAccount.findUnique({
    where: { tenantId },
  });

  await prisma.apiUsageBilling.upsert({
    where: {
      tenantId_month: {
        tenantId,
        month: new Date(month.getFullYear(), month.getMonth(), 1),
      },
    },
    create: {
      tenantId,
      month: new Date(month.getFullYear(), month.getMonth(), 1),
      totalCalls: billing.totalCalls,
      totalRevenueCents: billing.totalRevenueCents,
      tierLimits: devAccount?.billingTier || 'free',
      billingStatus: 'pending',
    },
    update: {
      totalCalls: billing.totalCalls,
      totalRevenueCents: billing.totalRevenueCents,
      tierLimits: devAccount?.billingTier || 'free',
    },
  });

  logger.info('Monthly billing processed', {
    tenantId,
    month: month.toISOString(),
    ...billing,
  });
}

/**
 * Reset monthly quota for all developer accounts
 * Should be called at the start of each month
 */
export async function resetMonthlyQuotas(): Promise<void> {
  await prisma.developerAccount.updateMany({
    data: {
      currentUsage: 0,
      quotaResetAt: new Date(),
    },
  });

  logger.info('Monthly quotas reset for all developer accounts');
}

/**
 * Get developer account details
 */
export async function getDeveloperAccount(tenantId: string) {
  return prisma.developerAccount.findUnique({
    where: { tenantId },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          subdomain: true,
          subscriptionTier: true,
        },
      },
    },
  });
}

/**
 * Create or update developer account
 */
export async function upsertDeveloperAccount(
  tenantId: string,
  data: {
    companyName: string;
    contactEmail: string;
    billingTier: string;
    apiQuota?: number;
    overageAllowed?: boolean;
  }
) {
  const quota =
    data.apiQuota || PRICING_TIERS[data.billingTier as keyof typeof PRICING_TIERS]?.quota || 1000;

  return prisma.developerAccount.upsert({
    where: { tenantId },
    create: {
      tenantId,
      companyName: data.companyName,
      contactEmail: data.contactEmail,
      billingTier: data.billingTier,
      apiQuota: quota,
      overageAllowed: data.overageAllowed || false,
    },
    update: {
      companyName: data.companyName,
      contactEmail: data.contactEmail,
      billingTier: data.billingTier,
      apiQuota: quota,
      overageAllowed: data.overageAllowed,
    },
  });
}
