import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import rateLimit from 'express-rate-limit';

const prisma = new PrismaClient();

// Rate limiter for watch endpoints
export const watchRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute per IP
  message: 'Too many watch requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for admin endpoints
export const adminRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute per IP
  message: 'Too many admin requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for general authenticated endpoints
export const generalRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute per IP
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Check for duplicate watch events
export const preventDuplicateWatch = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).userId; // From auth middleware
  const adId = parseInt(req.params.id);

  if (!userId || !adId) {
    return next();
  }

  try {
    // Check if user has watched this ad in the last 24 hours
    const recentWatch = await prisma.watchEvent.findFirst({
      where: {
        userId,
        adId,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (recentWatch) {
      return res.status(429).json({
        error: 'You have already watched this ad recently. Please try again later.',
      });
    }

    next();
  } catch (error) {
    console.error('Error checking duplicate watch:', error);
    next(error);
  }
};

// Check for suspicious IP activity
export const checkSuspiciousActivity = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || (req.headers['x-forwarded-for'] as string) || 'unknown';

  try {
    // Check if this IP has too many watch events in the last hour
    const recentWatches = await prisma.watchEvent.count({
      where: {
        ip,
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000),
        },
      },
    });

    if (recentWatches > 20) {
      return res.status(429).json({
        error: 'Suspicious activity detected. Please contact support.',
      });
    }

    next();
  } catch (error) {
    console.error('Error checking suspicious activity:', error);
    next(error);
  }
};
