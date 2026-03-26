/**
 * Rate Limiter Middleware
 * Progressive rate limiting with DDoS protection
 */

import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

/**
 * Create a rate limiter with custom configuration
 */
function createRateLimiter(
  windowMs: number,
  max: number,
  message: string,
  skipSuccessfulRequests: boolean = false
) {
  return rateLimit({
    windowMs,
    max,
    message: { success: false, error: message },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,
    handler: async (req: Request, res: Response) => {
      const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
      const userId = (req as any).userId;

      res.status(429).json({
        success: false,
        error: message,
        retryAfter: Math.ceil(windowMs / 1000),
      });
    },
  });
}

/**
 * Login rate limiter - 5 attempts per 15 minutes
 */
export const loginRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many login attempts. Please try again later.',
  true // Only count failed login attempts
);

/**
 * Signup rate limiter - 3 signups per hour
 */
export const signupRateLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  3, // 3 signups
  'Too many signup attempts. Please try again later.'
);

/**
 * Password reset rate limiter - 3 requests per hour
 */
export const passwordResetRateLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  3, // 3 requests
  'Too many password reset requests. Please try again later.'
);

/**
 * Email verification rate limiter - 5 attempts per 15 minutes
 */
export const emailVerifyRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many verification attempts. Please try again later.'
);

/**
 * General API rate limiter - 100 requests per 15 minutes
 */
export const generalRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests
  'Too many requests. Please slow down.'
);

/**
 * Authentication rate limiter - 5 requests per minute
 */
export const authRateLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  5, // 5 requests
  'Too many requests from this IP, please try again after a minute'
);

/**
 * OAuth rate limiter - 10 requests per 5 minutes
 */
export const oauthRateLimiter = createRateLimiter(
  5 * 60 * 1000, // 5 minutes
  10, // 10 requests
  'Too many OAuth requests, please try again later'
);

/**
 * Email resend rate limiter - 2 requests per 10 minutes
 */
export const emailResendRateLimiter = createRateLimiter(
  10 * 60 * 1000, // 10 minutes
  2, // 2 requests
  'Too many verification email requests, please try again later'
);
