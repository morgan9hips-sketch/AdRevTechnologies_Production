import express from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export const healthRouter = express.Router();

// Basic health check
healthRouter.get('/', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Detailed health check
healthRouter.get('/detailed', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    checks: {
      database: 'unknown',
      memory: 'ok',
    },
  };

  // Check database connection
  try {
    await prisma.$queryRaw`SELECT 1`;
    health.checks.database = 'ok';
  } catch (error) {
    health.checks.database = 'error';
    health.status = 'degraded';
    logger.error('Database health check failed', error);
  }

  // Check memory usage
  const memUsage = process.memoryUsage();
  const memoryInfo = {
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
    rss: Math.round(memUsage.rss / 1024 / 1024),
  };

  // Warn if memory usage is high (> 80% of heap)
  if (memUsage.heapUsed / memUsage.heapTotal > 0.8) {
    health.checks.memory = 'warning';
    health.status = 'degraded';
  }

  res.status(health.status === 'ok' ? 200 : 503).json({
    ...health,
    memory: memoryInfo,
  });
});
