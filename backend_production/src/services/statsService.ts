import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Stats Service - tracks user activity statistics
 */
export class StatsService {
  /**
   * Track daily stats for a user
   */
  static async trackDailyStats(userId: number, adsWatched: number, earningsCents: number) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get or create today's stat record
      const existingStat = await prisma.userStat.findUnique({
        where: {
          userId_date: {
            userId,
            date: today,
          },
        },
      });

      if (existingStat) {
        // Update existing record
        await prisma.userStat.update({
          where: {
            userId_date: {
              userId,
              date: today,
            },
          },
          data: {
            adsWatched: existingStat.adsWatched + adsWatched,
            earningsCents: existingStat.earningsCents + earningsCents,
          },
        });
      } else {
        // Calculate login streak
        const loginStreak = await this.calculateLoginStreak(userId);

        // Create new record
        await prisma.userStat.create({
          data: {
            userId,
            date: today,
            adsWatched,
            earningsCents,
            loginStreak,
          },
        });
      }

      logger.debug(`Stats tracked for user ${userId}: ${adsWatched} ads, ${earningsCents} cents`);
    } catch (error) {
      logger.error('Error tracking daily stats:', error);
      throw error;
    }
  }

  /**
   * Calculate current login streak for a user
   */
  static async calculateLoginStreak(userId: number): Promise<number> {
    try {
      const stats = await prisma.userStat.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 100, // Look back up to 100 days
      });

      if (stats.length === 0) {
        return 1; // First day
      }

      let streak = 1; // At least today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if there's a stat for yesterday
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // If most recent stat is from yesterday, calculate streak
      const mostRecentDate = new Date(stats[0].date);
      mostRecentDate.setHours(0, 0, 0, 0);

      if (mostRecentDate.getTime() === yesterday.getTime()) {
        // Continue from previous streak
        streak = stats[0].loginStreak + 1;
      } else if (mostRecentDate.getTime() === today.getTime()) {
        // Already logged in today
        streak = stats[0].loginStreak;
      } else {
        // Streak broken, start fresh
        streak = 1;
      }

      return streak;
    } catch (error) {
      logger.error('Error calculating login streak:', error);
      return 1;
    }
  }

  /**
   * Get user stats for a date range
   */
  static async getUserStats(userId: number, startDate: Date, endDate: Date) {
    try {
      const stats = await prisma.userStat.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { date: 'asc' },
      });

      return stats;
    } catch (error) {
      logger.error('Error getting user stats:', error);
      throw error;
    }
  }

  /**
   * Get earnings over time for charts
   */
  static async getEarningsOverTime(
    userId: number,
    period: 'day' | 'week' | 'month' = 'day',
    limit: number = 30
  ) {
    try {
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      let startDate = new Date();
      if (period === 'day') {
        startDate.setDate(startDate.getDate() - limit);
      } else if (period === 'week') {
        startDate.setDate(startDate.getDate() - limit * 7);
      } else if (period === 'month') {
        startDate.setMonth(startDate.getMonth() - limit);
      }
      startDate.setHours(0, 0, 0, 0);

      const stats = await this.getUserStats(userId, startDate, endDate);

      return stats.map((stat) => ({
        date: stat.date,
        earningsCents: stat.earningsCents,
        adsWatched: stat.adsWatched,
      }));
    } catch (error) {
      logger.error('Error getting earnings over time:', error);
      throw error;
    }
  }

  /**
   * Get user activity summary
   */
  static async getUserActivitySummary(userId: number) {
    try {
      // Get all-time stats
      const totalAdsWatched = await prisma.watchEvent.count({
        where: {
          userId,
          status: 'confirmed',
        },
      });

      const ledgerEntries = await prisma.ledgerEntry.findMany({
        where: {
          userId,
          type: { in: ['credit', 'watch'] },
        },
      });

      const totalEarnings = ledgerEntries.reduce((sum, entry) => sum + entry.amountCents, 0);

      // Get current streak
      const latestStat = await prisma.userStat.findFirst({
        where: { userId },
        orderBy: { date: 'desc' },
      });

      const currentStreak = latestStat?.loginStreak || 0;

      // Get today's stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayStat = await prisma.userStat.findUnique({
        where: {
          userId_date: {
            userId,
            date: today,
          },
        },
      });

      return {
        totalAdsWatched,
        totalEarnings,
        currentStreak,
        todayAdsWatched: todayStat?.adsWatched || 0,
        todayEarnings: todayStat?.earningsCents || 0,
      };
    } catch (error) {
      logger.error('Error getting user activity summary:', error);
      throw error;
    }
  }
}
