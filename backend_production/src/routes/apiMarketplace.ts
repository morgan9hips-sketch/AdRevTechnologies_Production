import { Router, Request, Response } from 'express';
import { z } from 'zod';
import {
  getApiAnalytics,
  getDeveloperAccount,
  upsertDeveloperAccount,
  calculateMonthlyBilling,
  PRICING_TIERS,
} from '../services/apiUsageService';
import { authenticate, adminAuth } from '../utils/auth';
import { logger } from '../utils/logger';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * Phase 3: API Marketplace Routes
 * Handles developer accounts, API analytics, and billing
 */

// Validation schemas
const createDeveloperAccountSchema = z.object({
  companyName: z.string().min(1).max(255),
  contactEmail: z.string().email(),
  billingTier: z.enum(['free', 'pro', 'enterprise']),
  apiQuota: z.number().int().optional(),
  overageAllowed: z.boolean().optional(),
});

const dateRangeSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

/**
 * GET /api/marketplace/pricing
 * Get pricing tiers information (public)
 */
router.get('/pricing', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      tiers: PRICING_TIERS,
      revenueShare: {
        platform: 70,
        tenant: 30,
      },
    },
  });
});

/**
 * POST /api/marketplace/developer-account
 * Create or update developer account (requires authentication)
 */
router.post('/developer-account', authenticate, async (req: Request, res: Response) => {
  try {
    const validatedData = createDeveloperAccountSchema.parse(req.body);
    const userId = (req as { userId?: number }).userId;

    // Get user's tenant
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tenantId: true },
    });

    if (!user?.tenantId) {
      res.status(400).json({
        success: false,
        error: 'User must be associated with a tenant',
      });
      return;
    }

    const devAccount = await upsertDeveloperAccount(user.tenantId, validatedData);

    logger.info('Developer account created/updated', {
      tenantId: user.tenantId,
      billingTier: validatedData.billingTier,
    });

    res.status(200).json({
      success: true,
      data: devAccount,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues,
      });
      return;
    }

    logger.error('Error creating developer account', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to create developer account',
    });
  }
});

/**
 * GET /api/marketplace/developer-account
 * Get current developer account details (requires authentication)
 */
router.get('/developer-account', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as { userId?: number }).userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tenantId: true },
    });

    if (!user?.tenantId) {
      res.status(400).json({
        success: false,
        error: 'User must be associated with a tenant',
      });
      return;
    }

    const devAccount = await getDeveloperAccount(user.tenantId);

    if (!devAccount) {
      res.status(404).json({
        success: false,
        error: 'Developer account not found',
      });
      return;
    }

    res.json({
      success: true,
      data: devAccount,
    });
  } catch (error) {
    logger.error('Error fetching developer account', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch developer account',
    });
  }
});

/**
 * GET /api/marketplace/analytics
 * Get API usage analytics (requires authentication)
 */
router.get('/analytics', authenticate, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = dateRangeSchema.parse(req.query);
    const userId = (req as { userId?: number }).userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tenantId: true },
    });

    if (!user?.tenantId) {
      res.status(400).json({
        success: false,
        error: 'User must be associated with a tenant',
      });
      return;
    }

    const analytics = await getApiAnalytics(user.tenantId, new Date(startDate), new Date(endDate));

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Invalid date range',
        details: error.issues,
      });
      return;
    }

    logger.error('Error fetching analytics', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
    });
  }
});

/**
 * GET /api/marketplace/billing/:month
 * Get billing for a specific month (requires authentication)
 */
router.get('/billing/:month', authenticate, async (req: Request, res: Response) => {
  try {
    const { month } = req.params;
    const monthDate = new Date(month);

    if (isNaN(monthDate.getTime())) {
      res.status(400).json({
        success: false,
        error: 'Invalid month format. Use YYYY-MM format.',
      });
      return;
    }

    const userId = (req as { userId?: number }).userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tenantId: true },
    });

    if (!user?.tenantId) {
      res.status(400).json({
        success: false,
        error: 'User must be associated with a tenant',
      });
      return;
    }

    const billing = await calculateMonthlyBilling(user.tenantId, monthDate);

    res.json({
      success: true,
      data: billing,
    });
  } catch (error) {
    logger.error('Error fetching billing', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch billing',
    });
  }
});

/**
 * GET /api/marketplace/usage-history
 * Get API usage history (requires authentication)
 */
router.get('/usage-history', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as { userId?: number }).userId;
    const limit = parseInt(req.query.limit as string) || 100;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tenantId: true },
    });

    if (!user?.tenantId) {
      res.status(400).json({
        success: false,
        error: 'User must be associated with a tenant',
      });
      return;
    }

    const calls = await prisma.apiCall.findMany({
      where: { tenantId: user.tenantId },
      orderBy: { timestamp: 'desc' },
      take: limit,
      select: {
        id: true,
        endpoint: true,
        method: true,
        statusCode: true,
        responseTime: true,
        timestamp: true,
      },
    });

    res.json({
      success: true,
      data: calls,
    });
  } catch (error) {
    logger.error('Error fetching usage history', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch usage history',
    });
  }
});

/**
 * ADMIN ROUTES
 */

/**
 * GET /api/admin/marketplace/revenue-streams
 * Get overall API marketplace revenue (admin only)
 */
router.get('/admin/revenue-streams', adminAuth, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        month: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        },
      };
    }

    const billingRecords = await prisma.apiUsageBilling.findMany({
      where: dateFilter,
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            subdomain: true,
          },
        },
      },
      orderBy: { month: 'desc' },
    });

    const totalRevenue = billingRecords.reduce((sum, record) => sum + record.totalRevenueCents, 0);
    const totalCalls = billingRecords.reduce((sum, record) => sum + record.totalCalls, 0);

    res.json({
      success: true,
      data: {
        totalRevenueCents: totalRevenue,
        totalCalls,
        records: billingRecords,
      },
    });
  } catch (error) {
    logger.error('Error fetching revenue streams', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch revenue streams',
    });
  }
});

/**
 * GET /api/admin/marketplace/cross-tenant-analytics
 * Get cross-tenant API usage analytics (admin only)
 */
router.get('/admin/cross-tenant-analytics', adminAuth, async (req: Request, res: Response) => {
  try {
    const tenantStats = await prisma.apiCall.groupBy({
      by: ['tenantId'],
      _count: {
        id: true,
      },
      _avg: {
        responseTime: true,
      },
    });

    const enrichedStats = await Promise.all(
      tenantStats.map(async (stat) => {
        const tenant = await prisma.tenant.findUnique({
          where: { id: stat.tenantId },
          select: { name: true, subdomain: true },
        });

        const devAccount = await prisma.developerAccount.findUnique({
          where: { tenantId: stat.tenantId },
          select: { billingTier: true },
        });

        return {
          tenantId: stat.tenantId,
          tenantName: tenant?.name,
          subdomain: tenant?.subdomain,
          billingTier: devAccount?.billingTier || 'free',
          totalCalls: stat._count.id,
          avgResponseTime: Math.round(stat._avg.responseTime || 0),
        };
      })
    );

    res.json({
      success: true,
      data: enrichedStats,
    });
  } catch (error) {
    logger.error('Error fetching cross-tenant analytics', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cross-tenant analytics',
    });
  }
});

/**
 * GET /api/admin/marketplace/developer-accounts
 * List all developer accounts (admin only)
 */
router.get('/admin/developer-accounts', adminAuth, async (req: Request, res: Response) => {
  try {
    const accounts = await prisma.developerAccount.findMany({
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            subdomain: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: accounts,
    });
  } catch (error) {
    logger.error('Error fetching developer accounts', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch developer accounts',
    });
  }
});

export default router;
