/**
 * Session Management Service
 * Tracks and manages user sessions across devices
 */

import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

const SESSION_EXPIRY_DAYS = 30;
const MAX_SESSIONS_PER_USER = 5; // Limit concurrent sessions

interface SessionData {
  id: string;
  deviceName?: string | null;
  ipAddress?: string | null;
  location?: string | null;
  lastActivity: Date;
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
}

/**
 * Create a new session for a user
 */
export async function createSession(
  userId: number,
  deviceId?: string,
  deviceName?: string,
  ipAddress?: string,
  userAgent?: string
): Promise<string> {
  // Generate session token
  const sessionToken = crypto.randomBytes(64).toString('hex');

  // Calculate expiry
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

  // Check if user has too many sessions
  const activeSessions = await prisma.userSession.count({
    where: {
      userId,
      isActive: true,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  // If too many sessions, deactivate oldest ones
  if (activeSessions >= MAX_SESSIONS_PER_USER) {
    const oldestSessions = await prisma.userSession.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: {
        lastActivity: 'asc',
      },
      take: activeSessions - MAX_SESSIONS_PER_USER + 1,
    });

    await prisma.userSession.updateMany({
      where: {
        id: {
          in: oldestSessions.map((s) => s.id),
        },
      },
      data: {
        isActive: false,
      },
    });
  }

  // Get approximate location from IP (simplified)
  const location = ipAddress ? await getLocationFromIP(ipAddress) : undefined;

  // Create session
  await prisma.userSession.create({
    data: {
      userId,
      token: sessionToken,
      deviceId,
      deviceName: deviceName || parseDeviceName(userAgent),
      ipAddress,
      userAgent,
      location,
      expiresAt,
    },
  });

  return sessionToken;
}

/**
 * Get all active sessions for a user
 */
export async function getUserSessions(userId: number): Promise<SessionData[]> {
  const sessions = await prisma.userSession.findMany({
    where: {
      userId,
      isActive: true,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      lastActivity: 'desc',
    },
    select: {
      id: true,
      deviceName: true,
      ipAddress: true,
      location: true,
      lastActivity: true,
      createdAt: true,
      expiresAt: true,
      isActive: true,
    },
  });

  return sessions;
}

/**
 * Update session activity
 */
export async function updateSessionActivity(sessionToken: string): Promise<void> {
  await prisma.userSession.updateMany({
    where: {
      token: sessionToken,
      isActive: true,
    },
    data: {
      lastActivity: new Date(),
    },
  });
}

/**
 * Invalidate a specific session
 */
export async function invalidateSession(sessionId: string): Promise<void> {
  await prisma.userSession.update({
    where: {
      id: sessionId,
    },
    data: {
      isActive: false,
    },
  });
}

/**
 * Invalidate all sessions for a user
 */
export async function invalidateAllUserSessions(userId: number): Promise<void> {
  await prisma.userSession.updateMany({
    where: {
      userId,
      isActive: true,
    },
    data: {
      isActive: false,
    },
  });
}

/**
 * Verify a session token
 */
export async function verifySession(sessionToken: string): Promise<number | null> {
  const session = await prisma.userSession.findFirst({
    where: {
      token: sessionToken,
      isActive: true,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!session) {
    return null;
  }

  // Update last activity
  await updateSessionActivity(sessionToken);

  return session.userId;
}

/**
 * Clean up expired sessions
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const result = await prisma.userSession.deleteMany({
    where: {
      OR: [
        {
          expiresAt: {
            lt: new Date(),
          },
        },
        {
          isActive: false,
          lastActivity: {
            lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          },
        },
      ],
    },
  });

  return result.count;
}

/**
 * Parse device name from user agent
 */
function parseDeviceName(userAgent?: string): string | undefined {
  if (!userAgent) return undefined;

  // Simple parsing - can be enhanced with a library like ua-parser-js
  if (userAgent.includes('iPhone')) return 'iPhone';
  if (userAgent.includes('iPad')) return 'iPad';
  if (userAgent.includes('Android')) return 'Android Device';
  if (userAgent.includes('Windows')) return 'Windows PC';
  if (userAgent.includes('Mac')) return 'Mac';
  if (userAgent.includes('Linux')) return 'Linux PC';

  return 'Unknown Device';
}

/**
 * Get approximate location from IP address
 * In production, use a service like MaxMind GeoIP
 */
async function getLocationFromIP(ipAddress: string): Promise<string | undefined> {
  // Placeholder - in production, use a GeoIP service
  if (ipAddress.startsWith('192.168.') || ipAddress.startsWith('10.') || ipAddress === '::1') {
    return 'Local Network';
  }

  // Would integrate with a GeoIP service here
  return 'Unknown Location';
}
