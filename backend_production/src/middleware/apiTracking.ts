import { Request, Response, NextFunction } from 'express';
import { recordApiCall, checkQuotaExceeded } from '../services/apiUsageService';
import { logger } from '../utils/logger';

/**
 * Phase 3: API Usage Tracking Middleware
 * Tracks all API calls for billing and analytics
 */

// Extended Request type to include API tracking data
export interface ApiTrackingRequest extends Request {
  apiKeyId?: string;
  tenantId?: string;
  startTime?: number;
}

/**
 * Middleware to track API usage
 * Should be applied after authentication middleware that sets apiKeyId and tenantId
 */
export const trackApiUsage = async (
  req: ApiTrackingRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Only track if API key is present (authenticated API requests)
  if (!req.apiKeyId || !req.tenantId) {
    return next();
  }

  // Check quota before processing request
  try {
    const quotaExceeded = await checkQuotaExceeded(req.tenantId);
    if (quotaExceeded) {
      res.status(429).json({
        success: false,
        error: 'API quota exceeded. Please upgrade your plan or contact support.',
      });
      return;
    }
  } catch (error) {
    logger.error('Error checking quota', { error, tenantId: req.tenantId });
    // Continue anyway - don't block request due to quota check failure
  }

  // Record start time for response time calculation
  req.startTime = Date.now();

  // Capture the original res.json to intercept response
  const originalJson = res.json.bind(res);

  // Override res.json to capture when response is sent
  res.json = function (body: unknown) {
    // Calculate response time
    const responseTime = req.startTime ? Date.now() - req.startTime : 0;

    // Record the API call asynchronously (don't block response)
    recordApiCall({
      apiKeyId: req.apiKeyId!,
      tenantId: req.tenantId!,
      endpoint: req.path,
      method: req.method,
      statusCode: res.statusCode,
      responseTime,
      ipAddress: req.ip || req.socket.remoteAddress,
      userAgent: req.get('user-agent'),
      metadata: {
        query: req.query,
        // Don't log body to avoid storing sensitive data
      },
    }).catch((error) => {
      logger.error('Failed to record API call', { error });
    });

    return originalJson(body);
  };

  next();
};

/**
 * Middleware to extract API key from request and validate
 * Sets apiKeyId and tenantId on request for tracking
 * ONLY checks X-API-Key header, not Authorization (which is for JWT tokens)
 */
export const extractApiKey = async (
  req: ApiTrackingRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // ONLY check X-API-Key header - Authorization header is for JWT tokens
  const apiKey = req.header('X-API-Key');

  if (!apiKey) {
    return next();
  }

  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    // Hash the API key to compare with stored hash
    // SHA-256 is appropriate for API keys as they are high-entropy tokens (not user passwords)
    // API keys should be randomly generated with sufficient entropy (e.g., 32+ bytes)
    const crypto = await import('crypto');
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: { keyHash },
      include: {
        tenant: {
          select: {
            id: true,
            status: true,
            isActive: true,
          },
        },
      },
    });

    if (!apiKeyRecord || !apiKeyRecord.isActive) {
      res.status(401).json({
        success: false,
        error: 'Invalid or inactive API key',
      });
      return;
    }

    // Check if API key is expired
    if (apiKeyRecord.expiresAt && apiKeyRecord.expiresAt < new Date()) {
      res.status(401).json({
        success: false,
        error: 'API key has expired',
      });
      return;
    }

    // Check if tenant is active
    if (!apiKeyRecord.tenant.isActive || apiKeyRecord.tenant.status !== 'active') {
      res.status(403).json({
        success: false,
        error: 'Tenant account is not active',
      });
      return;
    }

    // Set API key and tenant on request for tracking
    req.apiKeyId = apiKeyRecord.id;
    req.tenantId = apiKeyRecord.tenantId;

    await prisma.$disconnect();
    next();
  } catch (error) {
    logger.error('Error validating API key', { error });
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * Per-tenant rate limiting
 * More sophisticated than the global rate limiter
 */
export const rateLimitByTenant = (
  maxRequests: number = 1000,
  windowMs: number = 60 * 60 * 1000 // 1 hour
) => {
  const tenantRequests = new Map<string, { count: number; resetTime: number }>();

  return (req: ApiTrackingRequest, res: Response, next: NextFunction): void => {
    if (!req.tenantId) {
      return next();
    }

    const now = Date.now();
    const tenantData = tenantRequests.get(req.tenantId);

    if (!tenantData || now > tenantData.resetTime) {
      // Initialize or reset counter
      tenantRequests.set(req.tenantId, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    if (tenantData.count >= maxRequests) {
      res.status(429).json({
        success: false,
        error: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((tenantData.resetTime - now) / 1000),
      });
      return;
    }

    tenantData.count += 1;
    next();
  };
};
