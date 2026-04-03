import { NextRequest, NextResponse } from 'next/server'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || ''
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.adrevtechnologies.com'
const CALLBACK_URL = `${BASE_URL}/founding-member/success`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      email: string
      name: string
      amount: number
      currency: string
      metadata?: Record<string, unknown>
    }

    const { email, name, amount, currency, metadata } = body

    if (!email || !name || !amount || !currency) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!PAYSTACK_SECRET_KEY) {
      console.error('Paystack: PAYSTACK_SECRET_KEY is not set')
      return NextResponse.json({ error: 'Payment service unavailable' }, { status: 503 })
    }

    const tier = metadata?.tier ?? 'unknown'
    console.log(`Paystack initialize: tier=${tier} amount=${amount} currency=${currency} email=${email}`)

    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount,
        currency,
        callback_url: CALLBACK_URL,
        metadata: {
          ...metadata,
          name,
          cancel_action: 'https://www.adrevtechnologies.com',
        },
      }),
    })

    if (!paystackRes.ok) {
      const errData = await paystackRes.json().catch(() => ({}))
      console.error('Paystack initialize error:', errData)
      return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 502 })
    }

    const paystackData = await paystackRes.json() as {
      status: boolean
      data: { authorization_url: string; reference: string }
    }

    if (!paystackData.status) {
      return NextResponse.json({ error: 'Paystack initialization failed' }, { status: 502 })
    }

    return NextResponse.json({
      authorization_url: paystackData.data.authorization_url,
      reference: paystackData.data.reference,
    })
  } catch (error) {
    console.error('Paystack initialize unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
