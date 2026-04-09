import { createHmac, timingSafeEqual } from 'crypto'

export const EARLY_ACCESS_ANNUAL_OFFER = Object.freeze({
  planSlug: 'prelaunch-early-access',
  planName: 'Prelaunch Early Access',
  amountUsd: 5988,
  amountMinor: 598800,
  currency: 'USD' as const,
  billingPeriod: 'annual' as const,
})

export const EARLY_ACCESS_ANNUAL_OFFERS = Object.freeze({
  founding_partner_0_500k: {
    planSlug: 'founding-partner-0-500k',
    planName: 'Founding Partner Early Access',
    amountUsd: 5988,
    amountMinor: 598800,
    currency: 'USD' as const,
    billingPeriod: 'annual' as const,
  },
  growth_500k_1_5m: {
    planSlug: 'growth-500k-1-5m',
    planName: 'Founding Partner Early Access',
    amountUsd: 6988,
    amountMinor: 698800,
    currency: 'USD' as const,
    billingPeriod: 'annual' as const,
  },
  scale_1_5m_3m: {
    planSlug: 'scale-1-5m-3m',
    planName: 'Founding Partner Early Access',
    amountUsd: 7988,
    amountMinor: 798800,
    currency: 'USD' as const,
    billingPeriod: 'annual' as const,
  },
} as const)

export const EARLY_ACCESS_ANNUAL_CHARGE = Object.freeze({
  amountMinor: 598800,
  currency: 'USD' as const,
})

type EarlyAccessOffer =
  (typeof EARLY_ACCESS_ANNUAL_OFFERS)[keyof typeof EARLY_ACCESS_ANNUAL_OFFERS]

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

export function resolveEarlyAccessAnnualOffer(requestedTier?: string | null) {
  if (!requestedTier) {
    return EARLY_ACCESS_ANNUAL_OFFERS.founding_partner_0_500k
  }

  return (
    EARLY_ACCESS_ANNUAL_OFFERS[
      requestedTier as keyof typeof EARLY_ACCESS_ANNUAL_OFFERS
    ] || EARLY_ACCESS_ANNUAL_OFFERS.founding_partner_0_500k
  )
}

export function buildEarlyAccessMetadata(input: {
  email: string
  name: string
  requestedTier?: string | null
}) {
  const offer = resolveEarlyAccessAnnualOffer(input.requestedTier)

  return {
    planSlug: offer.planSlug,
    requestedTier: input.requestedTier || 'founding_partner_0_500k',
    billingPeriod: offer.billingPeriod,
    amountUsd: offer.amountUsd,
    amountMinor: offer.amountMinor,
    currency: offer.currency,
    lockedServerSide: true,
    customerEmail: input.email,
    customerName: input.name,
  }
}

export function isLockedEarlyAccessTransaction(
  transaction: PaystackTransactionLike,
) {
  return getLockedEarlyAccessTransactionOffer(transaction) !== null
}

export function getLockedEarlyAccessTransactionOffer(
  transaction: PaystackTransactionLike,
): EarlyAccessOffer | null {
  const metadata = (transaction.metadata ?? null) as PaystackMetadata | null
  const planSlug =
    typeof metadata?.planSlug === 'string' ? metadata.planSlug : null

  const offer =
    Object.values(EARLY_ACCESS_ANNUAL_OFFERS).find(
      (candidate) => candidate.planSlug === planSlug,
    ) || null

  if (!offer) {
    return null
  }

  return transaction.amount === offer.amountMinor &&
    transaction.currency === offer.currency &&
    metadata?.billingPeriod === offer.billingPeriod &&
    metadata?.amountUsd === offer.amountUsd &&
    metadata?.amountMinor === offer.amountMinor &&
    metadata?.currency === offer.currency &&
    metadata?.lockedServerSide === true
    ? offer
    : null
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

export function getPaystackWebhookSecret() {
  return (
    process.env.PAYSTACK_WEBHOOK_SECRET ||
    process.env.PAYSTACK_SECRET_KEY ||
    process.env.PAYSTACK_SECRET ||
    ''
  )
}
