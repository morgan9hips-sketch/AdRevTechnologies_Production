import { NextRequest, NextResponse } from 'next/server'
import {
  buildEarlyAccessMetadata,
  resolveEarlyAccessAnnualOffer,
} from '@/lib/paystack'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || ''
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.adrevtechnologies.com'
const CALLBACK_URL =
  process.env.PAYSTACK_CALLBACK_URL || `${BASE_URL}/founding-member/success`

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email: string
      name: string
      requestedTier?: string | null
    }

    const { email, name, requestedTier } = body
    const offer = resolveEarlyAccessAnnualOffer(requestedTier)

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    if (!PAYSTACK_SECRET_KEY) {
      console.error('Paystack: PAYSTACK_SECRET_KEY is not set')
      return NextResponse.json(
        { error: 'Payment service unavailable' },
        { status: 503 },
      )
    }

    console.log(
      `Paystack initialize: tier=${requestedTier ?? 'founding_partner_0_500k'} amount=${offer.amountMinor} currency=${offer.currency} email=${email}`,
    )

    const paystackRes = await fetch(
      'https://api.paystack.co/transaction/initialize',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: offer.amountMinor,
          currency: offer.currency,
          callback_url: CALLBACK_URL,
          metadata: {
            ...buildEarlyAccessMetadata({ email, name, requestedTier }),
            cancel_action: 'https://www.adrevtechnologies.com',
          },
        }),
      },
    )

    if (!paystackRes.ok) {
      const errData = await paystackRes.json().catch(() => ({}))
      console.error('Paystack initialize error:', errData)
      return NextResponse.json(
        { error: 'Failed to initialize payment' },
        { status: 502 },
      )
    }

    const paystackData = (await paystackRes.json()) as {
      status: boolean
      data: { authorization_url: string; reference: string }
    }

    if (!paystackData.status) {
      return NextResponse.json(
        { error: 'Paystack initialization failed' },
        { status: 502 },
      )
    }

    return NextResponse.json({
      authorization_url: paystackData.data.authorization_url,
      authorizationUrl: paystackData.data.authorization_url,
      reference: paystackData.data.reference,
    })
  } catch (error) {
    console.error('Paystack initialize unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
