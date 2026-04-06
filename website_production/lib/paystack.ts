import { createHmac, timingSafeEqual } from 'crypto'

export const EARLY_ACCESS_ANNUAL_OFFER = Object.freeze({
  planSlug: 'prelaunch-early-access',
  planName: 'Prelaunch Early Access',
  amountUsd: 5988,
  amountMinor: 598800,
  currency: 'USD' as const,
  billingPeriod: 'annual' as const,
})

export const EARLY_ACCESS_ANNUAL_CHARGE = Object.freeze({
  amountMinor: 598800,
  currency: 'USD' as const,
})

type PaystackMetadata = {
  planSlug?: unknown
  billingPeriod?: unknown
  amountUsd?: unknown
  amountMinor?: unknown
  currency?: unknown
  lockedServerSide?: unknown
}

export type PaystackTransactionLike = {
  amount?: unknown
  currency?: unknown
  metadata?: unknown
}

export function buildEarlyAccessMetadata(input: {
  email: string
  name: string
  requestedTier?: string | null
}) {
  return {
    planSlug: EARLY_ACCESS_ANNUAL_OFFER.planSlug,
    requestedTier: input.requestedTier || EARLY_ACCESS_ANNUAL_OFFER.planName,
    billingPeriod: EARLY_ACCESS_ANNUAL_OFFER.billingPeriod,
    amountUsd: EARLY_ACCESS_ANNUAL_OFFER.amountUsd,
    amountMinor: EARLY_ACCESS_ANNUAL_CHARGE.amountMinor,
    currency: EARLY_ACCESS_ANNUAL_CHARGE.currency,
    lockedServerSide: true,
    customerEmail: input.email,
    customerName: input.name,
  }
}

export function isLockedEarlyAccessTransaction(
  transaction: PaystackTransactionLike,
) {
  const metadata = (transaction.metadata ?? null) as PaystackMetadata | null

  return (
    transaction.amount === EARLY_ACCESS_ANNUAL_CHARGE.amountMinor &&
    transaction.currency === EARLY_ACCESS_ANNUAL_CHARGE.currency &&
    metadata?.planSlug === EARLY_ACCESS_ANNUAL_OFFER.planSlug &&
    metadata?.billingPeriod === EARLY_ACCESS_ANNUAL_OFFER.billingPeriod &&
    metadata?.amountUsd === EARLY_ACCESS_ANNUAL_OFFER.amountUsd &&
    metadata?.amountMinor === EARLY_ACCESS_ANNUAL_CHARGE.amountMinor &&
    metadata?.currency === EARLY_ACCESS_ANNUAL_CHARGE.currency &&
    metadata?.lockedServerSide === true
  )
}

export function verifyPaystackSignature(
  rawBody: string,
  signature: string,
  secret: string,
) {
  const expected = createHmac('sha512', secret).update(rawBody).digest('hex')

  if (!signature || expected.length !== signature.length) {
    return false
  }

  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}
