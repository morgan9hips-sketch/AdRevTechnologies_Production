import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

const PRICES_USD: Record<string, Record<string, number>> = {
  starter:    { monthly: 149,   annual: 1341 },
  business:   { monthly: 349,   annual: 3141 },
  enterprise: { monthly: 899,   annual: 8091 },
}

// Simple in-memory exchange rate cache (5-minute TTL)
let cachedZarRate: number | null = null
let cacheExpiry = 0

async function fetchZarRate(): Promise<number> {
  const FALLBACK_RATE = 18.5
  const now = Date.now()
  if (cachedZarRate !== null && now < cacheExpiry) {
    return cachedZarRate
  }
  try {
    const rateRes = await fetch('https://open.er-api.com/v6/latest/USD')
    if (rateRes.ok) {
      const rateData = await rateRes.json() as { rates?: Record<string, number> }
      if (rateData.rates?.ZAR && rateData.rates.ZAR > 0) {
        cachedZarRate = rateData.rates.ZAR
        cacheExpiry = now + 5 * 60 * 1000
        return cachedZarRate
      }
    }
  } catch {
    // fall through to return fallback
  }
  return FALLBACK_RATE
}

function buildSignature(params: Record<string, string>, passphrase?: string): string {
  const sorted = Object.keys(params)
    .sort()
    .filter((k) => params[k] !== '')
    .map((k) => `${k}=${encodeURIComponent(params[k]).replace(/%20/g, '+')}`)
    .join('&')

  // PayFast's documented signature algorithm requires MD5 over the query string.
  // This is a message authentication code per PayFast API spec — not a password hash.
  // See: https://developers.payfast.co.za/docs#step_4_generate_signature
  const withPassphrase = passphrase ? `${sorted}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, '+')}` : sorted
  return createHash('md5').update(withPassphrase).digest('hex') // lgtm[js/insufficient-password-hash]
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
    }

    const { tier, billingPeriod, name, email } = body as {
      tier: string
      billingPeriod: string
      name: string
      email: string
    }

    if (!tier || !billingPeriod || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const tierLower = tier.toLowerCase()
    const periodLower = billingPeriod.toLowerCase()

    if (!PRICES_USD[tierLower] || !PRICES_USD[tierLower][periodLower]) {
      return NextResponse.json({ error: 'Invalid tier or billing period.' }, { status: 400 })
    }

    const usdAmount = PRICES_USD[tierLower][periodLower]

    // Fetch live USD→ZAR exchange rate (cached for 5 minutes, falls back to 18.5 if unavailable)
    const zarRate = await fetchZarRate()

    const zarAmount = (usdAmount * zarRate).toFixed(2)

    const merchantId = process.env.PAYFAST_MERCHANT_ID || ''
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY || ''
    const passphrase = process.env.PAYFAST_PASSPHRASE || undefined
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
    const sandbox = process.env.PAYFAST_SANDBOX === 'true'
    const payfastUrl = sandbox
      ? 'https://sandbox.payfast.co.za/eng/process'
      : 'https://www.payfast.co.za/eng/process'

    // Split name into first/last
    const nameParts = name.trim().split(/\s+/)
    const nameFirst = nameParts[0] || name.trim()
    const nameLast = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''

    const tierLabel = tierLower.charAt(0).toUpperCase() + tierLower.slice(1)
    const periodLabel = periodLower === 'annual' ? 'Annual' : 'Monthly'
    const itemName = `Ad Rev Technologies — ${tierLabel} Founding Member (${periodLabel})`

    const params: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${siteUrl}/founding-member/success?tier=${tierLower}&period=${periodLower}`,
      cancel_url: `${siteUrl}/pricing`,
      notify_url: `${siteUrl}/api/payfast/notify`,
      name_first: nameFirst,
      name_last: nameLast,
      email_address: email,
      amount: zarAmount,
      item_name: itemName,
      custom_str1: tierLower,
      custom_str2: periodLower,
      custom_str3: String(usdAmount),
    }

    // Remove empty values before signing
    const signatureParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== '')
    )
    const signature = buildSignature(signatureParams, passphrase)
    params.signature = signature

    return NextResponse.json({ url: payfastUrl, fields: params })
  } catch (error) {
    console.error('PayFast checkout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
