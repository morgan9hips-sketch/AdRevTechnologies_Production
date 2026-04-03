// TEST TIER — REMOVE BEFORE FULL PUBLIC LAUNCH
// Transactions at or below this amount (in kobo) are flagged as test payments.
// R50 = 5000 kobo — covers the R20 test tier with headroom.
export const TEST_PAYMENT_THRESHOLD_KOBO = 5000

export function getAccessWindow(tier: string | null): string {
  switch (tier?.toLowerCase()) {
    case 'starter':    return '30–45 days'
    case 'business':   return '45–60 days'
    case 'enterprise': return '60–90 days'
    default:           return '30–45 days'
  }
}
