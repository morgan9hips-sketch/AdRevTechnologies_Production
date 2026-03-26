import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PLATFORM_FEE_PERCENTAGE = parseFloat(process.env.PLATFORM_FEE_PERCENTAGE || '0.1'); // 10% platform fee
const PLATFORM_ACCOUNT_ID = 0; // Special user ID for platform

export const creditUserForWatch = async (
  userId: number,
  grossAmountCents: number,
  referenceId: number,
  tenantId?: string,
  customRevenueSplit?: number
) => {
  // Calculate platform fee (use tenant's revenue split if provided, otherwise default 10%)
  const platformFeePercentage = customRevenueSplit
    ? 1 - customRevenueSplit
    : PLATFORM_FEE_PERCENTAGE;
  const platformFeeCents = Math.floor(grossAmountCents * platformFeePercentage);
  const netAmountCents = grossAmountCents - platformFeeCents;
  const tenantRevenueCents = tenantId ? Math.floor(grossAmountCents * platformFeePercentage) : 0;

  await prisma.$transaction(async (tx) => {
    // Update user wallet with net amount (after platform fee)
    const wallet = await tx.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new Error('Wallet not found');

    const newBalance = wallet.balanceCents + netAmountCents;

    await tx.wallet.update({
      where: { userId },
      data: { balanceCents: newBalance },
    });

    // Create ledger entry for user credit
    await tx.ledgerEntry.create({
      data: {
        userId,
        amountCents: netAmountCents,
        balanceAfter: newBalance,
        type: 'credit',
        reference: `watch_${referenceId}`,
        feeCents: platformFeeCents,
        tenantId: tenantId || null,
        metadata: {
          eventType: 'watch',
          eventId: referenceId,
          grossAmount: grossAmountCents,
          platformFee: platformFeeCents,
          tenantId: tenantId || null,
        },
      },
    });

    // Create ledger entry for platform fee
    await tx.ledgerEntry.create({
      data: {
        userId: PLATFORM_ACCOUNT_ID,
        amountCents: platformFeeCents,
        balanceAfter: null, // Platform doesn't track balance
        type: 'platform_fee',
        reference: `watch_${referenceId}`,
        feeCents: 0,
        tenantId: tenantId || null,
        metadata: {
          sourceUserId: userId,
          eventType: 'watch',
          eventId: referenceId,
          tenantId: tenantId || null,
        },
      },
    });

    // Multi-tenant: Create ledger entry for tenant revenue if applicable
    if (tenantId && tenantRevenueCents > 0) {
      await tx.ledgerEntry.create({
        data: {
          userId: null, // Tenant revenue, not user-specific
          amountCents: tenantRevenueCents,
          balanceAfter: null,
          type: 'tenant_revenue',
          reference: `watch_${referenceId}`,
          feeCents: 0,
          tenantId,
          metadata: {
            sourceUserId: userId,
            eventType: 'watch',
            eventId: referenceId,
            tenantId,
          },
        },
      });
    }

    // Audit log
    await tx.auditLog.create({
      data: {
        actorId: userId,
        action: 'watch_credited',
        tenantId: tenantId || null,
        payload: {
          userId,
          grossAmountCents,
          platformFeeCents,
          netAmountCents,
          referenceId,
          newBalance,
          tenantId: tenantId || null,
        },
      },
    });
  });

  return { netAmountCents, platformFeeCents };
};

export const debitUserForPayout = async (
  userId: number,
  amountCents: number,
  payoutItemId: number,
  tenantId?: string
) => {
  await prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new Error('Wallet not found');
    if (wallet.balanceCents < amountCents) {
      throw new Error('Insufficient balance');
    }

    const newBalance = wallet.balanceCents - amountCents;

    await tx.wallet.update({
      where: { userId },
      data: { balanceCents: newBalance },
    });

    await tx.ledgerEntry.create({
      data: {
        userId,
        amountCents: -amountCents,
        balanceAfter: newBalance,
        type: 'debit',
        reference: `payout_${payoutItemId}`,
        feeCents: 0,
        tenantId: tenantId || null,
        metadata: {
          eventType: 'payout',
          payoutItemId,
          tenantId: tenantId || null,
        },
      },
    });

    await tx.auditLog.create({
      data: {
        actorId: userId,
        action: 'payout_debited',
        tenantId: tenantId || null,
        payload: { userId, amountCents, payoutItemId, newBalance, tenantId: tenantId || null },
      },
    });
  });
};

/**
 * Reverse a payout debit (e.g., if payout failed)
 */
export const reversePayout = async (
  userId: number,
  amountCents: number,
  payoutItemId: number,
  reason: string,
  tenantId?: string
) => {
  await prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new Error('Wallet not found');

    const newBalance = wallet.balanceCents + amountCents;

    await tx.wallet.update({
      where: { userId },
      data: { balanceCents: newBalance },
    });

    await tx.ledgerEntry.create({
      data: {
        userId,
        amountCents,
        balanceAfter: newBalance,
        type: 'refund',
        reference: `payout_reversal_${payoutItemId}`,
        feeCents: 0,
        tenantId: tenantId || null,
        metadata: {
          eventType: 'payout_reversal',
          payoutItemId,
          reason,
          tenantId: tenantId || null,
        },
      },
    });

    await tx.auditLog.create({
      data: {
        actorId: userId,
        action: 'payout_reversed',
        tenantId: tenantId || null,
        payload: {
          userId,
          amountCents,
          payoutItemId,
          reason,
          newBalance,
          tenantId: tenantId || null,
        },
      },
    });
  });
};
