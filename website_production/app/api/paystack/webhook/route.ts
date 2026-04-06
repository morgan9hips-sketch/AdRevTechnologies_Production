import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/database'
import {
  TEST_PAYMENT_THRESHOLD_KOBO,
  getAccessWindow,
} from '@/lib/paystack-constants'
import {
  EARLY_ACCESS_ANNUAL_OFFER,
  getPaystackWebhookSecret,
  isLockedEarlyAccessTransaction,
  verifyPaystackSignature,
} from '@/lib/paystack'

const PAYSTACK_WEBHOOK_SECRET = getPaystackWebhookSecret()

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-paystack-signature') || ''

    if (!PAYSTACK_WEBHOOK_SECRET) {
      console.error('Paystack webhook: secret is not configured')
      return new NextResponse('Webhook secret not configured', { status: 500 })
    }

    if (!verifyPaystackSignature(body, signature, PAYSTACK_WEBHOOK_SECRET)) {
      console.error('Paystack webhook: invalid signature')
      return new NextResponse('Invalid signature', { status: 400 })
    }

    const event = JSON.parse(body) as {
      event: string
      data: {
        status: string
        reference: string
        amount: number
        currency: string
        customer: { email: string }
        metadata: { name?: string; [key: string]: unknown }
      }
    }

    if (event.event !== 'charge.success' || event.data.status !== 'success') {
      return new NextResponse('OK', { status: 200 })
    }

    if (!isLockedEarlyAccessTransaction(event.data)) {
      console.warn(
        'Paystack webhook: ignored transaction outside locked Early Access offer',
      )
      return new NextResponse('OK', { status: 200 })
    }

    const txn = event.data
    const email = txn.customer.email
    const name =
      (txn.metadata?.customerName as string) ||
      (txn.metadata?.name as string) ||
      ''
    const amount = EARLY_ACCESS_ANNUAL_OFFER.amountMinor
    const currency = EARLY_ACCESS_ANNUAL_OFFER.currency
    const reference = txn.reference
    const is_test = amount <= TEST_PAYMENT_THRESHOLD_KOBO
    const tier =
      (txn.metadata?.requestedTier as string) ||
      EARLY_ACCESS_ANNUAL_OFFER.planName
    const billingPeriod = EARLY_ACCESS_ANNUAL_OFFER.billingPeriod
    const accessWindow = getAccessWindow(tier)

    if (!supabaseAdmin) {
      console.error('Paystack webhook: supabaseAdmin is null')
      // Return 200 to prevent Paystack from retrying — Supabase is a backup
      return new NextResponse('OK', { status: 200 })
    }

    // Persist the transaction inside the webhook request so the write is not lost
    // if the serverless function exits immediately after returning 200.
    try {
      const { error } = await supabaseAdmin.from('founding_members').upsert(
        [
          {
            name,
            email,
            paystack_reference: reference,
            amount,
            currency,
            status: 'active',
            is_test,
            tier,
            billing_period: billingPeriod,
            access_window: accessWindow,
          },
        ],
        { onConflict: 'email' },
      )

      if (error) {
        console.error('Paystack webhook: founding_members upsert error', error)
      }

      const { error: waitlistError } = await supabaseAdmin
        .from('waitlist')
        .update({ status: 'converted' })
        .eq('email', email)
        .eq('status', 'pending')

      if (waitlistError) {
        console.error('Paystack webhook: waitlist update error', waitlistError)
      }
    } catch (err) {
      console.error('Paystack webhook: persistence error', err)
    }

    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('Paystack webhook unexpected error:', error)
    // Return 200 to prevent retries for parse errors
    return new NextResponse('OK', { status: 200 })
  }
}
