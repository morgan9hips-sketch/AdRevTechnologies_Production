/**
 * Security Middleware
 * Comprehensive security headers and protections
 */

import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';
import { securityHeaders, corsOrigins } from '../config/security';
import { isIpBlocked } from '../services/securityService';
import { logger } from '../utils/logger';

/**
 * Security headers middleware using Helmet
 */
export const securityHeadersMiddleware = helmet({
  contentSecurityPolicy: {
    directives: securityHeaders.contentSecurityPolicy.directives,
  },
  hsts: {
    maxAge: securityHeaders.hsts.maxAge,
    includeSubDomains: securityHeaders.hsts.includeSubDomains,
    preload: securityHeaders.hsts.preload,
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  frameguard: { action: 'deny' },
});

/**
 * CORS configuration middleware
 */
export const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    if (corsOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      logger.warn('CORS origin blocked', { origin });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

/**
 * IP blocklist middleware
 */
export async function ipBlocklistMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';

  const blocked = await isIpBlocked(ipAddress);

  if (blocked) {
    logger.warn('Blocked IP attempted access', {
      ip: ipAddress,
      path: req.path,
      userAgent: req.get('User-Agent'),
    });

    res.status(403).json({
      success: false,
      error: 'Access denied',
    });
    return;
  }

  next();
}

/**
 * Request sanitization middleware
 */
export function sanitizeInput(req: Request, res: Response, next: NextFunction): void {
  // Remove null bytes from all inputs
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj.replace(/\0/g, '');
    }
    if (typeof obj === 'object' && obj !== null) {
      const sanitized = Array.isArray(obj) ? [] : {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          (sanitized as any)[key] = sanitize(obj[key]);
        }
      }
      return sanitized;
    }
    return obj;
  };

  // Sanitize body (this is mutable)
  if (req.body) {
    req.body = sanitize(req.body);
  }

  // Sanitize query - create new object instead of modifying read-only property
  if (req.query && Object.keys(req.query).length > 0) {
    try {
      const sanitizedQuery = sanitize(req.query);
      // Replace the query object with sanitized version
      Object.defineProperty(req, 'query', {
        value: sanitizedQuery,
        writable: true,
        configurable: true,
      });
    } catch (error) {
      // If we can't sanitize query, log and continue
      logger.warn('Failed to sanitize query parameters', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Sanitize params (this is usually mutable)
  if (req.params) {
    try {
      req.params = sanitize(req.params);
    } catch (error) {
      // If we can't sanitize params, log and continue
      logger.warn('Failed to sanitize path parameters', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  next();
}

/**
 * Content-Type validation middleware
 */
export function validateContentType(req: Request, res: Response, next: NextFunction): void {
  // Only validate for requests with body
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.get('Content-Type');

    if (!contentType || !contentType.includes('application/json')) {
      return res.status(415).json({
        success: false,
        error: 'Content-Type must be application/json',
      }) as any;
    }
  }

  next();
}

/**
 * Security headers for API responses
 */
export function apiSecurityHeaders(req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.removeHeader('X-Powered-By');

  next();
}

/**
 * Request size limiter middleware
 */
export function requestSizeLimiter(maxSize: string = '10mb') {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = req.get('Content-Length');

    if (contentLength) {
      const sizeInBytes = parseInt(contentLength, 10);
      const maxSizeBytes = parseSize(maxSize);

      if (sizeInBytes > maxSizeBytes) {
        return res.status(413).json({
          success: false,
          error: 'Request entity too large',
        }) as any;
      }
    }

    next();
  };
}

/**
 * Parse size string to bytes
 */
function parseSize(size: string): number {
  const units: Record<string, number> = {
    b: 1,
    kb: 1024,
    mb: 1024 * 1024,
    gb: 1024 * 1024 * 1024,
  };

  const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*([a-z]+)$/);

  if (!match) {
    return 10 * 1024 * 1024; // Default 10MB
  }

  const [, value, unit] = match;
  return parseFloat(value) * (units[unit] || 1);
}

/**
 * Slow down middleware for specific endpoints
 */
export function slowDown(delayMs: number = 1000) {
  return async (req: Request, res: Response, next: NextFunction) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    next();
  };
}

/**
 * Security event tracking middleware
 */
export function trackSecurityEvents(req: Request, res: Response, next: NextFunction): void {
  // Track security-relevant request metadata
  (req as any).securityContext = {
    ipAddress: req.ip || req.socket.remoteAddress,
    userAgent: req.get('User-Agent'),
    timestamp: new Date(),
    path: req.path,
    method: req.method,
  };

  next();
}
