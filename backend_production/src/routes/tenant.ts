import { Request, Response } from 'express';
import {
  createTenant,
  getTenantById,
  getTenantFull,
  updateTenant,
  deleteTenant,
  listTenants,
  createApiKey,
  revokeApiKey,
  getTenantAnalytics,
} from '../services/tenantService';
import {
  createStripeCustomer,
  createSubscription,
  cancelSubscription,
  getSubscriptionStatus,
  SUBSCRIPTION_PLANS,
} from '../services/stripeService';
import { logger } from '../utils/logger';
import { getTenantContext } from '../middleware/tenant';

/**
 * @swagger
 * /api/admin/tenants:
 *   post:
 *     summary: Create a new tenant (Platform Admin only)
 *     tags: [Admin - Tenants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - subdomain
 *             properties:
 *               name:
 *                 type: string
 *               subdomain:
 *                 type: string
 *               customDomain:
 *                 type: string
 *               brandColors:
 *                 type: object
 *               logo:
 *                 type: string
 *               appName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tenant created successfully
 */
export const createTenantHandler = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const tenant = await createTenant(data);

    return res.status(201).json({
      success: true,
      data: tenant,
    });
  } catch (error: any) {
    logger.error('Error creating tenant:', error);
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to create tenant',
    });
  }
};

/**
 * @swagger
 * /api/admin/tenants:
 *   get:
 *     summary: List all tenants (Platform Admin only)
 *     tags: [Admin - Tenants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tenants
 */
export const listTenantsHandler = async (req: Request, res: Response) => {
  try {
    const { status, subscriptionTier, isActive } = req.query;

    const filters: any = {};
    if (status) filters.status = status as string;
    if (subscriptionTier) filters.subscriptionTier = subscriptionTier as string;
    if (isActive !== undefined) filters.isActive = isActive === 'true';

    const tenants = await listTenants(filters);

    return res.json({
      success: true,
      data: tenants,
    });
  } catch (error: any) {
    logger.error('Error listing tenants:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to list tenants',
    });
  }
};

/**
 * @swagger
 * /api/admin/tenants/{tenantId}:
 *   get:
 *     summary: Get tenant details (Platform Admin only)
 *     tags: [Admin - Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tenant details
 */
export const getTenantHandler = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;

    const tenant = await getTenantFull(tenantId);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        error: 'Tenant not found',
      });
    }

    return res.json({
      success: true,
      data: tenant,
    });
  } catch (error: any) {
    logger.error('Error getting tenant:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get tenant',
    });
  }
};

/**
 * @swagger
 * /api/admin/tenants/{tenantId}:
 *   put:
 *     summary: Update tenant (Platform Admin only)
 *     tags: [Admin - Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Tenant updated successfully
 */
export const updateTenantHandler = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;
    const data = req.body;

    const tenant = await updateTenant(tenantId, data);

    return res.json({
      success: true,
      data: tenant,
    });
  } catch (error: any) {
    logger.error('Error updating tenant:', error);
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to update tenant',
    });
  }
};

/**
 * @swagger
 * /api/admin/tenants/{tenantId}:
 *   delete:
 *     summary: Delete tenant (Platform Admin only)
 *     tags: [Admin - Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tenant deleted successfully
 */
export const deleteTenantHandler = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;

    const tenant = await deleteTenant(tenantId);

    return res.json({
      success: true,
      data: tenant,
    });
  } catch (error: any) {
    logger.error('Error deleting tenant:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete tenant',
    });
  }
};

/**
 * @swagger
 * /api/tenant/current:
 *   get:
 *     summary: Get current tenant information
 *     tags: [Tenant]
 *     responses:
 *       200:
 *         description: Current tenant details
 */
export const getCurrentTenantHandler = async (req: Request, res: Response) => {
  try {
    const tenantContext = getTenantContext(req);

    if (!tenantContext) {
      return res.status(404).json({
        success: false,
        error: 'No tenant context found',
      });
    }

    return res.json({
      success: true,
      data: tenantContext.tenant,
    });
  } catch (error: any) {
    logger.error('Error getting current tenant:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get tenant',
    });
  }
};

/**
 * @swagger
 * /api/tenant/analytics:
 *   get:
 *     summary: Get analytics for current tenant
 *     tags: [Tenant]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tenant analytics
 */
export const getTenantAnalyticsHandler = async (req: Request, res: Response) => {
  try {
    const tenantContext = getTenantContext(req);

    if (!tenantContext) {
      return res.status(400).json({
        success: false,
        error: 'Tenant context required',
      });
    }

    // Default to last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const analytics = await getTenantAnalytics(tenantContext.tenantId, startDate, endDate);

    return res.json({
      success: true,
      data: analytics,
    });
  } catch (error: any) {
    logger.error('Error getting tenant analytics:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get analytics',
    });
  }
};

/**
 * @swagger
 * /api/tenant/api-keys:
 *   post:
 *     summary: Create API key for current tenant (Tenant Admin)
 *     tags: [Tenant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - scopes
 *             properties:
 *               name:
 *                 type: string
 *               scopes:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: API key created
 */
export const createApiKeyHandler = async (req: Request, res: Response) => {
  try {
    const tenantContext = getTenantContext(req);

    if (!tenantContext) {
      return res.status(400).json({
        success: false,
        error: 'Tenant context required',
      });
    }

    const { name, scopes, rateLimit, expiresAt } = req.body;

    const result = await createApiKey({
      tenantId: tenantContext.tenantId,
      name,
      scopes,
      rateLimit,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });

    return res.status(201).json({
      success: true,
      data: {
        apiKey: result.key, // Only shown once!
        record: result.record,
      },
      message: 'API key created. Save it securely - it will not be shown again.',
    });
  } catch (error: any) {
    logger.error('Error creating API key:', error);
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to create API key',
    });
  }
};

/**
 * @swagger
 * /api/tenant/subscription:
 *   get:
 *     summary: Get subscription status for current tenant
 *     tags: [Tenant]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription status
 */
export const getSubscriptionHandler = async (req: Request, res: Response) => {
  try {
    const tenantContext = getTenantContext(req);

    if (!tenantContext) {
      return res.status(400).json({
        success: false,
        error: 'Tenant context required',
      });
    }

    const subscription = await getSubscriptionStatus(tenantContext.tenantId);

    return res.json({
      success: true,
      data: subscription,
      plans: SUBSCRIPTION_PLANS,
    });
  } catch (error: any) {
    logger.error('Error getting subscription:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get subscription',
    });
  }
};

/**
 * @swagger
 * /api/tenant/subscription:
 *   post:
 *     summary: Create or update subscription for current tenant
 *     tags: [Tenant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planId
 *               - paymentMethodId
 *             properties:
 *               planId:
 *                 type: string
 *               paymentMethodId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subscription created
 */
export const createSubscriptionHandler = async (req: Request, res: Response) => {
  try {
    const tenantContext = getTenantContext(req);

    if (!tenantContext) {
      return res.status(400).json({
        success: false,
        error: 'Tenant context required',
      });
    }

    const { planId, paymentMethodId } = req.body;

    const subscription = await createSubscription(tenantContext.tenantId, planId, paymentMethodId);

    return res.status(201).json({
      success: true,
      data: subscription,
    });
  } catch (error: any) {
    logger.error('Error creating subscription:', error);
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to create subscription',
    });
  }
};

/**
 * @swagger
 * /api/tenant/subscription:
 *   delete:
 *     summary: Cancel subscription for current tenant
 *     tags: [Tenant]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription cancelled
 */
export const cancelSubscriptionHandler = async (req: Request, res: Response) => {
  try {
    const tenantContext = getTenantContext(req);

    if (!tenantContext) {
      return res.status(400).json({
        success: false,
        error: 'Tenant context required',
      });
    }

    await cancelSubscription(tenantContext.tenantId);

    return res.json({
      success: true,
      message: 'Subscription will be cancelled at the end of the billing period',
    });
  } catch (error: any) {
    logger.error('Error cancelling subscription:', error);
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to cancel subscription',
    });
  }
};
