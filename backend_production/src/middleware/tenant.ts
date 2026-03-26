import { Request, Response, NextFunction } from 'express';
import { getTenantBySubdomain, getTenantByCustomDomain } from '../services/tenantService';
import { TenantContext } from '../types/tenant';
import { logger } from '../utils/logger';

/**
 * Extract subdomain from hostname
 * e.g., "acme.cashforads.com" -> "acme"
 */
const extractSubdomain = (hostname: string): string | null => {
  // Handle localhost and IP addresses (no tenant context)
  if (hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+/.test(hostname)) {
    return null;
  }

  const parts = hostname.split('.');

  // Need at least 3 parts for subdomain: subdomain.domain.tld
  if (parts.length < 3) {
    return null;
  }

  // Return the first part as subdomain
  return parts[0];
};

/**
 * Middleware to extract and inject tenant context into requests
 * Works with both subdomains and custom domains
 */
export const tenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hostname = req.hostname || req.headers.host?.split(':')[0] || '';

    // First, try to find tenant by custom domain
    let tenant = await getTenantByCustomDomain(hostname);

    // If no custom domain match, try subdomain
    if (!tenant) {
      const subdomain = extractSubdomain(hostname);

      if (subdomain) {
        tenant = await getTenantBySubdomain(subdomain);
      }
    }

    // If tenant found, inject context
    if (tenant && tenant.isActive && tenant.status === 'active') {
      const tenantContext: TenantContext = {
        tenantId: tenant.id,
        tenant,
        subdomain: tenant.subdomain,
        customDomain: tenant.customDomain || undefined,
      };

      (req as any).tenantContext = tenantContext;

      logger.debug(`Tenant context set: ${tenant.subdomain} (${tenant.id})`);
    } else if (tenant) {
      // Tenant exists but is inactive or not active
      logger.warn(`Inactive tenant attempted access: ${tenant.subdomain} (${tenant.id})`);
      return res.status(403).json({
        error: 'Tenant is not active',
        message: 'This tenant account has been suspended or cancelled',
      });
    }

    // Continue even if no tenant found (backward compatibility for single-tenant mode)
    next();
  } catch (error) {
    logger.error('Error in tenant middleware:', error);
    // Continue without tenant context on error
    next();
  }
};

/**
 * Middleware to require tenant context
 * Use this for routes that must have tenant context
 */
export const requireTenant = (req: Request, res: Response, next: NextFunction) => {
  const tenantContext = (req as any).tenantContext;

  if (!tenantContext) {
    return res.status(400).json({
      error: 'Tenant required',
      message: 'This endpoint requires a valid tenant context',
    });
  }

  next();
};

/**
 * Middleware to optionally extract tenant from API key
 * Used for B2B API access
 */
export const apiKeyAuth = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    return res.status(401).json({
      error: 'Missing API key',
      message: 'X-API-Key header is required',
    });
  }

  try {
    const { verifyApiKey } = await import('../services/tenantService');
    const result = await verifyApiKey(apiKey);

    if (!result) {
      return res.status(401).json({
        error: 'Invalid API key',
        message: 'The provided API key is invalid or expired',
      });
    }

    // Get tenant and inject context
    const { getTenantById } = await import('../services/tenantService');
    const tenant = await getTenantById(result.tenantId);

    if (!tenant || !tenant.isActive) {
      return res.status(403).json({
        error: 'Tenant inactive',
        message: 'The tenant associated with this API key is not active',
      });
    }

    const tenantContext: TenantContext = {
      tenantId: tenant.id,
      tenant,
      subdomain: tenant.subdomain,
      customDomain: tenant.customDomain || undefined,
    };

    (req as any).tenantContext = tenantContext;
    (req as any).apiScopes = result.scopes;

    next();
  } catch (error) {
    logger.error('Error in API key auth middleware:', error);
    return res.status(500).json({
      error: 'Authentication error',
      message: 'Failed to authenticate API key',
    });
  }
};

/**
 * Helper to get tenant context from request
 */
export const getTenantContext = (req: Request): TenantContext | null => {
  return (req as any).tenantContext || null;
};
