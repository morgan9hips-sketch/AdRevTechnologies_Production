import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/database'
import { createFoundingMemberActivationToken } from '@/lib/foundingMemberActivation'
import {
  TEST_PAYMENT_THRESHOLD_KOBO,
  getAccessWindow,
} from '@/lib/paystack-constants'
import {
  EARLY_ACCESS_ANNUAL_OFFER,
  isLockedEarlyAccessTransaction,
} from '@/lib/paystack'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || ''
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || 'noreply@adrevtechnologies.com'

function getAccountManagerMessage(tier: string): string {
  switch (tier.toLowerCase()) {
    case 'starter':
      return 'Your account manager will be in touch within 30–45 days with onboarding updates and platform access details.'
    case 'business':
      return 'Your dedicated account manager will be in touch within 45–60 days with onboarding updates and platform access details.'
    case 'enterprise':
      return 'Your dedicated account manager will be in touch within 60–90 days. You will receive regular updates and a custom onboarding plan.'
    default:
      return 'Your dedicated account manager will be in contact shortly and will provide you with regular updates on your onboarding progress.'
  }
}

async function sendConfirmationEmail(opts: {
  email: string
  name: string
  foundingMemberNumber: number
  amount: number
  currency: string
  tier: string | null
}) {
  if (!resend) {
    console.warn(
      'Paystack confirmation email skipped: RESEND_API_KEY is not configured',
    )
    return
  }

  const { email, name, foundingMemberNumber, amount, currency, tier } = opts
  const firstName = name.split(' ')[0] || name
  const amountFormatted =
    currency === 'ZAR'
      ? `R${(amount / 100).toFixed(2)}`
      : `$${(amount / 100).toFixed(2)} USD`

  const accessWindow = getAccessWindow(tier)
  const accountManagerMsg = getAccountManagerMessage(tier ?? 'starter')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Ad Rev Technologies</title>
</head>
<body style="margin:0;padding:0;background-color:#080d1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#080d1a;min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:18px;font-weight:700;color:#f1f5f9;letter-spacing:-0.5px;">
                Ad Rev Technologies
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#0f1629;border:1px solid #1e2d4a;border-radius:16px;padding:40px 36px;">
              <h1 style="margin:0 0 8px;font-size:28px;font-weight:800;color:#f1f5f9;line-height:1.2;">
                You're in.
              </h1>
              <p style="margin:0 0 32px;font-size:18px;font-weight:600;color:#00d4ff;">
                Welcome to Ad Rev Technologies, ${firstName}.
              </p>
              <div style="background-color:#f59e0b15;border:1px solid #f59e0b4d;border-radius:12px;padding:20px 24px;margin-bottom:32px;text-align:center;">
                <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#f59e0b;text-transform:uppercase;letter-spacing:1px;">
                  Founding Member
                </p>
                <p style="margin:0;font-size:36px;font-weight:800;color:#f59e0b;">
                  #${foundingMemberNumber}
                </p>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #1e2d4a;">
                    <span style="font-size:13px;color:#94a3b8;">Amount Paid</span>
                    <span style="float:right;font-size:13px;font-weight:600;color:#f1f5f9;">${amountFormatted}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;">
                    <span style="font-size:13px;color:#94a3b8;">Access Window</span>
                    <span style="float:right;font-size:13px;font-weight:600;color:#00d4ff;">${accessWindow}</span>
                  </td>
                </tr>
              </table>
              <div style="background-color:#00d4ff0d;border:1px solid #00d4ff33;border-radius:10px;padding:20px 24px;margin-bottom:32px;">
                <p style="margin:0;font-size:14px;color:#f1f5f9;line-height:1.6;">
                  ${accountManagerMsg}
                </p>
              </div>
              <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6;">
                Questions? Reach us directly at
                <a href="mailto:admin@adrevtechnologies.com" style="color:#00d4ff;text-decoration:none;">admin@adrevtechnologies.com</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#475569;">
                © ${new Date().getFullYear()} Ad Rev Technologies · All rights reserved
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `You're in — Welcome to Ad Rev Technologies, ${firstName}`,
      html,
    })
  } catch (err) {
    console.error('Paystack confirmation email failed:', err)
  }
}

async function sendOnboardingWelcomeEmail(opts: {
  email: string
  name: string
  foundingMemberNumber: number
  tier: string | null
  accessWindow: string
  activationUrl: string
}) {
  if (!resend) {
    console.warn(
      'Paystack onboarding email skipped: RESEND_API_KEY is not configured',
    )
    return
  }

  const {
    email,
    name,
    foundingMemberNumber,
    tier,
    accessWindow,
    activationUrl,
  } = opts
  const firstName = name.split(' ')[0] || name
  const tierLabel = tier || 'Founding Member'
  const accountManagerMsg = getAccountManagerMessage(tierLabel)

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Onboarding Starts Now</title>
</head>
<body style="margin:0;padding:0;background-color:#080d1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#080d1a;min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:18px;font-weight:700;color:#f1f5f9;letter-spacing:-0.5px;">Ad Rev Technologies</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#0f1629;border:1px solid #1e2d4a;border-radius:16px;padding:40px 36px;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#00d4ff;text-transform:uppercase;letter-spacing:1.5px;">Onboarding Welcome</p>
              <h1 style="margin:0 0 16px;font-size:30px;font-weight:800;color:#f1f5f9;line-height:1.2;">Welcome aboard, ${firstName}.</h1>
              <p style="margin:0 0 28px;font-size:16px;line-height:1.7;color:#cbd5e1;">
                You are now officially a client of Ad Rev Technologies. Your ${tierLabel} access has been secured and your onboarding process starts now.
              </p>

              <div style="background-color:#f59e0b15;border:1px solid #f59e0b4d;border-radius:12px;padding:18px 22px;margin-bottom:28px;">
                <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#f59e0b;text-transform:uppercase;letter-spacing:1px;">Client Record</p>
                <p style="margin:0;font-size:24px;font-weight:800;color:#f8fafc;">Founding Member #${foundingMemberNumber}</p>
              </div>

              <div style="margin-bottom:28px;">
                <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#f1f5f9;">What happens next</p>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 10px;">
                  <tr>
                    <td style="width:28px;vertical-align:top;"><span style="display:inline-block;width:22px;height:22px;line-height:22px;text-align:center;border-radius:999px;background:#1d4ed8;color:#fff;font-size:12px;font-weight:700;">1</span></td>
                    <td style="font-size:14px;line-height:1.6;color:#cbd5e1;">Your account manager will review your purchase and contact you with onboarding updates.</td>
                  </tr>
                  <tr>
                    <td style="width:28px;vertical-align:top;"><span style="display:inline-block;width:22px;height:22px;line-height:22px;text-align:center;border-radius:999px;background:#1d4ed8;color:#fff;font-size:12px;font-weight:700;">2</span></td>
                    <td style="font-size:14px;line-height:1.6;color:#cbd5e1;">We will confirm your integration requirements, commercial setup, and onboarding schedule.</td>
                  </tr>
                  <tr>
                    <td style="width:28px;vertical-align:top;"><span style="display:inline-block;width:22px;height:22px;line-height:22px;text-align:center;border-radius:999px;background:#1d4ed8;color:#fff;font-size:12px;font-weight:700;">3</span></td>
                    <td style="font-size:14px;line-height:1.6;color:#cbd5e1;">Verify this email now so we can use it for client activation and onboarding communications.</td>
                  </tr>
                </table>
              </div>

              <div style="margin-bottom:28px;text-align:center;">
                <a href="${activationUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 24px;border-radius:10px;">Verify your client email</a>
                <p style="margin:12px 0 0;font-size:12px;color:#94a3b8;line-height:1.6;">Your onboarding access window remains <strong style="color:#f1f5f9;">${accessWindow}</strong>. This verification step confirms email ownership before account activation.</p>
              </div>

              <div style="background-color:#00d4ff0d;border:1px solid #00d4ff33;border-radius:10px;padding:20px 24px;margin-bottom:28px;">
                <p style="margin:0;font-size:14px;color:#f1f5f9;line-height:1.7;">${accountManagerMsg}</p>
              </div>

              <p style="margin:0 0 8px;font-size:14px;color:#94a3b8;line-height:1.6;">If you need anything immediately, reply to this email or contact <a href="mailto:admin@adrevtechnologies.com" style="color:#00d4ff;text-decoration:none;">admin@adrevtechnologies.com</a>.</p>
            </td>
          </tr>
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#475569;">© ${new Date().getFullYear()} Ad Rev Technologies · All rights reserved</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Welcome to Ad Rev Technologies — onboarding begins now, ${firstName}`,
      html,
    })
  } catch (err) {
    console.error('Paystack onboarding email failed:', err)
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')

    if (!reference) {
      return NextResponse.json(
        { error: 'Missing reference parameter' },
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

    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      },
    )

    if (!paystackRes.ok) {
      const errData = await paystackRes.json().catch(() => ({}))
      console.error('Paystack verify error:', errData)
      return NextResponse.json(
        { error: 'Failed to verify payment' },
        { status: 502 },
      )
    }

    const paystackData = (await paystackRes.json()) as {
      status: boolean
      data: {
        status: string
        reference: string
        amount: number
        currency: string
        customer: { email: string }
        metadata: { name?: string; [key: string]: unknown }
      }
    }

    if (!paystackData.status || paystackData.data.status !== 'success') {
      return NextResponse.json(
        { error: 'Payment not successful' },
        { status: 402 },
      )
    }

    if (!isLockedEarlyAccessTransaction(paystackData.data)) {
      return NextResponse.json(
        {
          error:
            'Transaction does not match the locked Early Access annual offer',
        },
        { status: 409 },
      )
    }

    const txn = paystackData.data
    const email = txn.customer.email
    const name =
      (txn.metadata?.customerName as string) ||
      (txn.metadata?.name as string) ||
      ''
    const amount = EARLY_ACCESS_ANNUAL_OFFER.amountMinor
    const currency = EARLY_ACCESS_ANNUAL_OFFER.currency
    const is_test = amount <= TEST_PAYMENT_THRESHOLD_KOBO
    const tier =
      (txn.metadata?.requestedTier as string) ||
      EARLY_ACCESS_ANNUAL_OFFER.planName
    const billingPeriod = EARLY_ACCESS_ANNUAL_OFFER.billingPeriod
    const accessWindow = getAccessWindow(tier)

    if (!supabaseAdmin) {
      console.error('Paystack verify: supabaseAdmin is null')
      return NextResponse.json(
        { error: 'Database unavailable' },
        { status: 503 },
      )
    }

    const { data: existingMember, error: existingMemberLookupError } =
      await supabaseAdmin
        .from('founding_members')
        .select('founding_member_number, paystack_reference, status')
        .eq('email', email)
        .maybeSingle()

    if (existingMemberLookupError) {
      console.error(
        'Paystack verify: existing founding member lookup error',
        existingMemberLookupError,
      )
    }

    // Upsert founding member record (idempotent on email).
    // founding_member_number is GENERATED BY DEFAULT AS IDENTITY — DB assigns it on insert,
    // and it is preserved (not overwritten) on conflict update.
    const { error: upsertError } = await supabaseAdmin
      .from('founding_members')
      .upsert(
        [
          {
            name,
            email,
            paystack_reference: reference,
            amount,
            currency,
            status: existingMember?.status === 'verified' ? 'verified' : 'active',
            is_test,
            tier,
            billing_period: billingPeriod,
            access_window: accessWindow,
          },
        ],
        { onConflict: 'email' },
      )

    if (upsertError) {
      console.error(
        'Paystack verify: founding_members upsert error',
        upsertError,
      )
    }

    // Update waitlist status if email matches (fire-and-forget)
    supabaseAdmin
      .from('waitlist')
      .update({ status: 'converted' })
      .eq('email', email)
      .eq('status', 'pending')
      .then(({ error }) => {
        if (error)
          console.error('Paystack verify: waitlist update error', error)
      })

    // Retrieve founding member number assigned by DB
    const { data: memberData } = await supabaseAdmin
      .from('founding_members')
      .select('founding_member_number')
      .eq('email', email)
      .single()

    const actualMemberNumber = memberData?.founding_member_number ?? 1

    // Await the email send so the serverless request does not exit before Resend finishes.
    await sendConfirmationEmail({
      email,
      name,
      foundingMemberNumber: actualMemberNumber,
      amount,
      currency,
      tier,
    })

    if (
      existingMember?.status !== 'verified' &&
      existingMember?.paystack_reference !== reference
    ) {
      const activationToken = createFoundingMemberActivationToken(
        {
          email,
          reference,
          issuedAt: Date.now(),
        },
        PAYSTACK_SECRET_KEY,
      )

      const activationUrl = `${request.nextUrl.origin}/api/founding-member/activate?token=${encodeURIComponent(activationToken)}`

      await sendOnboardingWelcomeEmail({
        email,
        name,
        foundingMemberNumber: actualMemberNumber,
        tier,
        accessWindow,
        activationUrl,
      })
    }

    return NextResponse.json({
      success: true,
      reference,
      email,
      name,
      amount,
      currency,
      is_test,
      founding_member_number: actualMemberNumber,
    })
  } catch (error) {
    console.error('Paystack verify unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
