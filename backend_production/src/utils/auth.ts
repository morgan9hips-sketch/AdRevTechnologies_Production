import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { getTenantContext } from '../middleware/tenant';
import { jwtConfig } from '../config/security';
import { isValidJwtFormat } from './validation';
import { logSecurityEvent } from '../services/auditService';
import { logger } from './logger';

const prisma = new PrismaClient();

/**
 * Authenticate user with JWT token
 * Preserves existing functionality while adding enhanced security
 */
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'Missing auth' });

  const token = h.replace('Bearer ', '');

  // Validate token format
  if (!isValidJwtFormat(token)) {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  try {
    // Use configured JWT settings
    const payload: any = jwt.verify(token, jwtConfig.access.secret, {
      algorithms: [jwtConfig.access.algorithm],
      issuer: jwtConfig.access.issuer,
    });

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      await logSecurityEvent(
        'invalid_token_user',
        {
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          metadata: { userId: payload.userId },
        },
        false
      );
      return res.status(401).json({ error: 'Invalid user' });
    }

    // Multi-tenant: Verify user belongs to the current tenant context if present
    const tenantContext = getTenantContext(req);
    if (tenantContext && user.tenantId && user.tenantId !== tenantContext.tenantId) {
      await logSecurityEvent(
        'tenant_access_denied',
        {
          actorId: user.id,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          tenantId: tenantContext.tenantId,
        },
        false
      );
      return res.status(403).json({ error: 'User does not belong to this tenant' });
    }

    (req as any).user = user;
    (req as any).userId = user.id;
    next();
  } catch (err) {
    const ipAddress = req.ip || 'unknown';

    if (err instanceof jwt.TokenExpiredError) {
      logger.warn('Expired token used', { ipAddress });
      return res.status(401).json({ error: 'Token expired' });
    } else if (err instanceof jwt.JsonWebTokenError) {
      await logSecurityEvent(
        'invalid_token',
        {
          ipAddress,
          userAgent: req.headers['user-agent'],
          metadata: { error: err.message },
        },
        false
      );
      return res.status(401).json({ error: 'Invalid token' });
    }

    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * Admin authentication middleware
 * Preserves existing functionality
 */
export async function adminAuth(req: Request, res: Response, next: NextFunction) {
  await authenticate(req, res, async () => {
    const user = (req as any).user;
    if (!user.isAdmin) return res.status(403).json({ error: 'Admin only' });
    next();
  });
}

/**
 * Tenant admin authentication middleware
 * User must be admin AND belong to the current tenant
 */
export async function tenantAdminAuth(req: Request, res: Response, next: NextFunction) {
  await authenticate(req, res, async () => {
    const user = (req as any).user;
    const tenantContext = getTenantContext(req);

    if (!tenantContext) {
      return res.status(400).json({ error: 'Tenant context required' });
    }

    if (!user.isAdmin || user.tenantId !== tenantContext.tenantId) {
      return res.status(403).json({ error: 'Tenant admin access required' });
    }

    next();
  });
}
