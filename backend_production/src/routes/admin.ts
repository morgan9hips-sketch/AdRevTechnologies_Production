import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { retryFailedPayout, getFailedPayoutStats } from '../services/retryService';
import { Parser } from 'json2csv';

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({ include: { wallet: true } });
  res.json(users);
};

export const createAd = async (req: Request, res: Response) => {
  const { title, durationSeconds, rewardAmount, description, provider } = req.body;
  const ad = await prisma.ad.create({
    data: { title, durationSeconds, rewardAmount, description, provider },
  });
  res.json(ad);
};

export const getLedger = async (req: Request, res: Response) => {
  const schema = z.object({
    userId: z.string().optional(),
    type: z.string().optional(),
    limit: z.string().optional(),
  });

  const parsed = schema.safeParse(req.query);
  const params = parsed.success ? parsed.data : {};

  const where: any = {};
  if (params.userId) where.userId = parseInt(params.userId);
  if (params.type) where.type = params.type;

  const limit = params.limit ? parseInt(params.limit) : 100;

  const entries = await prisma.ledgerEntry.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  res.json(entries);
};

// GET /api/admin/ads
export const getAdminAds = async (req: Request, res: Response) => {
  try {
    const ads = await prisma.ad.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(ads);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/admin/payouts - List payout batches with filters
export const getAdminPayouts = async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      status: z.string().optional(),
      limit: z.string().optional(),
    });

    const parsed = schema.safeParse(req.query);
    const params = parsed.success ? parsed.data : {};

    const where: any = {};
    if (params.status) where.status = params.status;

    const limit = params.limit ? parseInt(params.limit) : 50;

    const payouts = await prisma.payoutBatch.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        payoutItems: {
          take: 5, // Just preview, full details via separate endpoint
        },
        _count: {
          select: { payoutItems: true },
        },
      },
      take: limit,
    });
    res.json(payouts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/admin/payouts/:batchId - Get payout batch details
export const getPayoutBatchDetails = async (req: Request, res: Response) => {
  try {
    const batchId = parseInt(req.params.batchId);

    if (isNaN(batchId)) {
      return res.status(400).json({ error: 'Invalid batch ID' });
    }

    const batch = await prisma.payoutBatch.findUnique({
      where: { id: batchId },
      include: {
        payoutItems: {
          include: {
            // Get user info for each item (note: need to join manually as no direct relation)
          },
        },
      },
    });

    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    // Enrich items with user data
    const enrichedItems = await Promise.all(
      batch.payoutItems.map(async (item) => {
        const user = await prisma.user.findUnique({
          where: { id: item.userId },
          select: { id: true, email: true, name: true },
        });
        return { ...item, user };
      })
    );

    res.json({ ...batch, payoutItems: enrichedItems });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/admin/payouts/:batchId/export - Export batch as CSV
export const exportPayoutBatchCSV = async (req: Request, res: Response) => {
  try {
    const batchId = parseInt(req.params.batchId);

    if (isNaN(batchId)) {
      return res.status(400).json({ error: 'Invalid batch ID' });
    }

    const batch = await prisma.payoutBatch.findUnique({
      where: { id: batchId },
      include: { payoutItems: true },
    });

    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    // Enrich items with user data
    const enrichedItems = await Promise.all(
      batch.payoutItems.map(async (item) => {
        const user = await prisma.user.findUnique({
          where: { id: item.userId },
          select: { email: true, name: true },
        });
        return {
          itemId: item.id,
          userId: item.userId,
          userName: user?.name || 'N/A',
          userEmail: user?.email || 'N/A',
          amountCents: item.amountCents,
          amountDollars: (item.amountCents / 100).toFixed(2),
          status: item.status,
          paypalItemId: item.paypalItemId || 'N/A',
          transactionId: item.transactionId || 'N/A',
          processedAt: item.processedAt?.toISOString() || 'N/A',
        };
      })
    );

    const parser = new Parser();
    const csv = parser.parse(enrichedItems);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=payout_batch_${batchId}.csv`);
    res.send(csv);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/admin/payouts/:batchId/retry
export const retryPayout = async (req: Request, res: Response) => {
  try {
    const batchId = parseInt(req.params.batchId);

    if (isNaN(batchId)) {
      return res.status(400).json({ error: 'Invalid batch ID' });
    }

    const result = await retryFailedPayout(batchId);

    if (result.success) {
      res.json({ message: result.message });
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/admin/payouts/failed-stats
export const getFailedStats = async (req: Request, res: Response) => {
  try {
    const stats = await getFailedPayoutStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/admin/fraud - List fraud flags
export const getFraudFlags = async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      status: z.string().optional(),
      entityType: z.string().optional(),
      minScore: z.string().optional(),
      limit: z.string().optional(),
    });

    const parsed = schema.safeParse(req.query);
    const params = parsed.success ? parsed.data : {};

    const where: any = {};
    if (params.status) where.status = params.status;
    if (params.entityType) where.entityType = params.entityType;
    if (params.minScore) where.score = { gte: parseInt(params.minScore) };

    const limit = params.limit ? parseInt(params.limit) : 100;

    const flags = await prisma.fraudFlag.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    res.json(flags);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/admin/fraud/:flagId/review - Review fraud flag
export const reviewFraudFlag = async (req: Request, res: Response) => {
  try {
    const flagId = parseInt(req.params.flagId);
    const adminUserId = (req as any).userId;

    const schema = z.object({
      status: z.enum(['confirmed', 'false_positive', 'reviewed']),
      notes: z.string().optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues });
    }

    await prisma.fraudFlag.update({
      where: { id: flagId },
      data: {
        status: parsed.data.status,
        reviewedBy: adminUserId,
        reviewedAt: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: adminUserId,
        action: 'fraud_flag_reviewed',
        payload: {
          flagId,
          status: parsed.data.status,
          notes: parsed.data.notes,
        },
      },
    });

    res.json({ success: true, message: 'Fraud flag reviewed' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
