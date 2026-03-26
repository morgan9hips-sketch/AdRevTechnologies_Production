import { PrismaClient, Tenant } from '@prisma/client';
import crypto from 'crypto';
import { logger, logBusinessEvent } from '../utils/logger';
import {
  CreateTenantData,
  UpdateTenantData,
  TenantWithBilling,
  TenantFull,
  CreateApiKeyData,
  TenantAnalytics,
} from '../types/tenant';

const prisma = new PrismaClient();

/**
 * Create a new tenant
 */
export const createTenant = async (data: CreateTenantData): Promise<Tenant> => {
  // Validate subdomain format (lowercase alphanumeric and hyphens only)
  const subdomainRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
  if (!subdomainRegex.test(data.subdomain)) {
    throw new Error('Invalid subdomain format. Use lowercase letters, numbers, and hyphens only.');
  }

  // Check if subdomain is already taken
  const existingTenant = await prisma.tenant.findUnique({
    where: { subdomain: data.subdomain },
  });

  if (existingTenant) {
    throw new Error('Subdomain is already taken');
  }

  // Check custom domain if provided
  if (data.customDomain) {
    const existingCustomDomain = await prisma.tenant.findUnique({
      where: { customDomain: data.customDomain },
    });

    if (existingCustomDomain) {
      throw new Error('Custom domain is already in use');
    }
  }

  const tenant = await prisma.tenant.create({
    data: {
      name: data.name,
      subdomain: data.subdomain,
      customDomain: data.customDomain,
      brandColors: data.brandColors ? JSON.parse(JSON.stringify(data.brandColors)) : null,
      logo: data.logo,
      appName: data.appName || 'Cash for Ads',
      adRevenueSplit: data.adRevenueSplit || 0.9,
      payoutMinimum: data.payoutMinimum || 1000,
      subscriptionTier: data.subscriptionTier || 'free',
      status: 'active',
      isActive: true,
    },
  });

  logBusinessEvent('tenant_created', {
    tenantId: tenant.id,
    subdomain: tenant.subdomain,
    name: tenant.name,
  });

  logger.info(`Tenant created: ${tenant.name} (${tenant.subdomain})`);

  return tenant;
};

/**
 * Get tenant by ID
 */
export const getTenantById = async (tenantId: string): Promise<Tenant | null> => {
  return prisma.tenant.findUnique({
    where: { id: tenantId },
  });
};

/**
 * Get tenant by subdomain
 */
export const getTenantBySubdomain = async (subdomain: string): Promise<Tenant | null> => {
  return prisma.tenant.findUnique({
    where: { subdomain },
  });
};

/**
 * Get tenant by custom domain
 */
export const getTenantByCustomDomain = async (domain: string): Promise<Tenant | null> => {
  return prisma.tenant.findUnique({
    where: { customDomain: domain },
  });
};

/**
 * Get tenant with billing information
 */
export const getTenantWithBilling = async (tenantId: string): Promise<TenantWithBilling | null> => {
  return prisma.tenant.findUnique({
    where: { id: tenantId },
    include: { billing: true },
  });
};

/**
 * Get tenant with all related data
 */
export const getTenantFull = async (tenantId: string): Promise<TenantFull | null> => {
  return prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      billing: true,
      apiKeys: {
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
};

/**
 * Update tenant
 */
export const updateTenant = async (tenantId: string, data: UpdateTenantData): Promise<Tenant> => {
  // Check custom domain uniqueness if being updated
  if (data.customDomain) {
    const existingCustomDomain = await prisma.tenant.findFirst({
      where: {
        customDomain: data.customDomain,
        NOT: { id: tenantId },
      },
    });

    if (existingCustomDomain) {
      throw new Error('Custom domain is already in use');
    }
  }

  const tenant = await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      ...data,
      brandColors: data.brandColors ? JSON.parse(JSON.stringify(data.brandColors)) : undefined,
    },
  });

  logBusinessEvent('tenant_updated', {
    tenantId: tenant.id,
    updates: Object.keys(data),
  });

  logger.info(`Tenant updated: ${tenant.name} (${tenant.id})`);

  return tenant;
};

/**
 * Delete tenant (soft delete by setting status to cancelled)
 */
export const deleteTenant = async (tenantId: string): Promise<Tenant> => {
  const tenant = await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      status: 'cancelled',
      isActive: false,
    },
  });

  logBusinessEvent('tenant_deleted', {
    tenantId: tenant.id,
    name: tenant.name,
  });

  logger.info(`Tenant deleted: ${tenant.name} (${tenant.id})`);

  return tenant;
};

/**
 * List all tenants with optional filters
 */
export const listTenants = async (filters?: {
  status?: string;
  subscriptionTier?: string;
  isActive?: boolean;
}): Promise<Tenant[]> => {
  return prisma.tenant.findMany({
    where: {
      ...(filters?.status && { status: filters.status }),
      ...(filters?.subscriptionTier && { subscriptionTier: filters.subscriptionTier }),
      ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
    },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Create API key for tenant
 */
export const createApiKey = async (
  data: CreateApiKeyData
): Promise<{ key: string; record: any }> => {
  // Generate API key (format: sk_live_<random>)
  const keySecret = crypto.randomBytes(32).toString('hex');
  const key = `sk_live_${keySecret}`;

  // Hash the key for storage
  const keyHash = crypto.createHash('sha256').update(key).digest('hex');

  // Store first 12 characters as prefix for identification
  const keyPrefix = key.substring(0, 12);

  const apiKey = await prisma.apiKey.create({
    data: {
      tenantId: data.tenantId,
      name: data.name,
      keyHash,
      keyPrefix,
      scopes: data.scopes,
      rateLimit: data.rateLimit || 1000,
      expiresAt: data.expiresAt,
      isActive: true,
    },
  });

  logBusinessEvent('api_key_created', {
    tenantId: data.tenantId,
    keyId: apiKey.id,
    name: data.name,
  });

  logger.info(`API key created for tenant ${data.tenantId}: ${data.name}`);

  // Return the actual key (only time it will be shown)
  return { key, record: apiKey };
};

/**
 * Verify API key and return tenant context
 */
export const verifyApiKey = async (
  apiKey: string
): Promise<{ tenantId: string; scopes: string[] } | null> => {
  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

  const record = await prisma.apiKey.findUnique({
    where: { keyHash },
    include: { tenant: true },
  });

  if (!record || !record.isActive || !record.tenant.isActive) {
    return null;
  }

  // Check expiration
  if (record.expiresAt && record.expiresAt < new Date()) {
    return null;
  }

  // Update usage count and last used timestamp
  await prisma.apiKey.update({
    where: { id: record.id },
    data: {
      usageCount: { increment: 1 },
      lastUsedAt: new Date(),
    },
  });

  return {
    tenantId: record.tenantId,
    scopes: record.scopes,
  };
};

/**
 * Revoke API key
 */
export const revokeApiKey = async (keyId: string): Promise<void> => {
  await prisma.apiKey.update({
    where: { id: keyId },
    data: { isActive: false },
  });

  logBusinessEvent('api_key_revoked', {
    keyId,
  });

  logger.info(`API key revoked: ${keyId}`);
};

/**
 * Get tenant analytics
 */
export const getTenantAnalytics = async (
  tenantId: string,
  startDate: Date,
  endDate: Date
): Promise<TenantAnalytics> => {
  // Get total and active users
  const totalUsers = await prisma.user.count({
    where: { tenantId },
  });

  const activeUsers = await prisma.user.count({
    where: {
      tenantId,
      updatedAt: { gte: startDate },
    },
  });

  // Get revenue from ledger entries
  const revenueEntries = await prisma.ledgerEntry.aggregate({
    where: {
      tenantId,
      type: 'tenant_revenue',
      createdAt: { gte: startDate, lte: endDate },
    },
    _sum: { amountCents: true },
  });

  const totalRevenue = revenueEntries._sum.amountCents || 0;

  // Get total payouts
  const payoutItems = await prisma.payoutItem.aggregate({
    where: {
      tenantId,
      status: 'success',
      createdAt: { gte: startDate, lte: endDate },
    },
    _sum: { amountCents: true },
  });

  const totalPayouts = payoutItems._sum.amountCents || 0;

  // Get ads watched
  const watchEvents = await prisma.watchEvent.count({
    where: {
      tenantId,
      status: { in: ['confirmed', 'credited'] },
      createdAt: { gte: startDate, lte: endDate },
    },
  });

  const avgRevenuePerUser = totalUsers > 0 ? totalRevenue / totalUsers : 0;

  return {
    tenantId,
    totalUsers,
    activeUsers,
    totalRevenue,
    totalPayouts,
    adsWatched: watchEvents,
    avgRevenuePerUser,
    period: {
      start: startDate,
      end: endDate,
    },
  };
};
