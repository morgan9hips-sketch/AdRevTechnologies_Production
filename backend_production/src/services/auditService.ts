/**
 * Audit Service
 * Centralized audit logging for security events
 */

import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { maskEmail } from '../utils/encryption';

const prisma = new PrismaClient();

export interface AuditContext {
  actorId?: number;
  ipAddress?: string;
  userAgent?: string;
  tenantId?: string | null;
  metadata?: Record<string, any>;
}

/**
 * Log a security event to audit log
 */
export async function logSecurityEvent(
  action: string,
  context: AuditContext,
  success: boolean = true
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: context.actorId,
        action,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        tenantId: context.tenantId,
        payload: {
          success,
          timestamp: new Date().toISOString(),
          ...context.metadata,
        },
      },
    });

    // Also log to Winston for real-time monitoring
    const logLevel = success ? 'info' : 'warn';
    logger[logLevel]('Security event', {
      action,
      actorId: context.actorId,
      ipAddress: context.ipAddress,
      success,
      metadata: context.metadata,
    });
  } catch (error) {
    logger.error('Failed to create audit log', { error, action });
  }
}

/**
 * Log login attempt
 */
export async function logLogin(
  userId: number | undefined,
  email: string,
  success: boolean,
  ipAddress: string,
  userAgent?: string,
  reason?: string
): Promise<void> {
  await logSecurityEvent(
    success ? 'login_success' : 'login_failed',
    {
      actorId: userId,
      ipAddress,
      userAgent,
      metadata: {
        email: maskEmail(email),
        reason,
      },
    },
    success
  );
}

/**
 * Log social authentication attempt
 */
export async function logSocialAuth(
  provider: string,
  email: string,
  success: boolean,
  ipAddress: string,
  userAgent?: string,
  userId?: number
): Promise<void> {
  await logSecurityEvent(
    success ? 'social_auth_success' : 'social_auth_failed',
    {
      actorId: userId,
      ipAddress,
      userAgent,
      metadata: {
        provider,
        email: maskEmail(email),
      },
    },
    success
  );
}

/**
 * Log suspicious activity
 */
export async function logSuspiciousActivity(
  type: string,
  details: Record<string, any>,
  ipAddress: string,
  userId?: number
): Promise<void> {
  await logSecurityEvent(
    'suspicious_activity',
    {
      actorId: userId,
      ipAddress,
      metadata: {
        type,
        details,
        severity: 'high',
      },
    },
    false
  );

  // Also send alert for critical suspicious activities
  logger.warn('Suspicious activity detected', {
    type,
    userId,
    ipAddress,
    details,
  });
}

/**
 * Log password change
 */
export async function logPasswordChange(
  userId: number,
  ipAddress: string,
  userAgent?: string,
  forced: boolean = false
): Promise<void> {
  await logSecurityEvent('password_change', {
    actorId: userId,
    ipAddress,
    userAgent,
    metadata: {
      forced,
    },
  });
}

/**
 * Log account lockout
 */
export async function logAccountLockout(
  userId: number,
  email: string,
  ipAddress: string,
  failedAttempts: number,
  unlockAt: Date
): Promise<void> {
  await logSecurityEvent(
    'account_locked',
    {
      actorId: userId,
      ipAddress,
      metadata: {
        email: maskEmail(email),
        failedAttempts,
        unlockAt: unlockAt.toISOString(),
      },
    },
    false
  );
}

/**
 * Log rate limit violation
 */
export async function logRateLimitViolation(
  endpoint: string,
  ipAddress: string,
  userId?: number
): Promise<void> {
  await logSecurityEvent(
    'rate_limit_exceeded',
    {
      actorId: userId,
      ipAddress,
      metadata: {
        endpoint,
      },
    },
    false
  );
}

/**
 * Log token refresh
 */
export async function logTokenRefresh(
  userId: number,
  ipAddress: string,
  userAgent?: string,
  success: boolean = true
): Promise<void> {
  await logSecurityEvent(
    success ? 'token_refresh_success' : 'token_refresh_failed',
    {
      actorId: userId,
      ipAddress,
      userAgent,
    },
    success
  );
}

/**
 * Log data export (GDPR)
 */
export async function logDataExport(
  userId: number,
  ipAddress: string,
  userAgent?: string
): Promise<void> {
  await logSecurityEvent('data_export', {
    actorId: userId,
    ipAddress,
    userAgent,
    metadata: {
      gdpr: true,
    },
  });
}

/**
 * Log account deletion (GDPR)
 */
export async function logAccountDeletion(
  userId: number,
  email: string,
  ipAddress: string,
  userAgent?: string
): Promise<void> {
  await logSecurityEvent('account_deletion', {
    actorId: userId,
    ipAddress,
    userAgent,
    metadata: {
      email: maskEmail(email),
      gdpr: true,
    },
  });
}

/**
 * Clean up old audit logs (should be run periodically)
 */
export async function cleanupOldAuditLogs(retentionDays: number = 90): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

  const result = await prisma.auditLog.deleteMany({
    where: {
      createdAt: {
        lt: cutoffDate,
      },
    },
  });

  logger.info('Cleaned up old audit logs', {
    deleted: result.count,
    cutoffDate: cutoffDate.toISOString(),
  });

  return result.count;
}
