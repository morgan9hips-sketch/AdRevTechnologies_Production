import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/database'

/*
  SQL — run once in Supabase SQL editor to create the founding_members table:

  CREATE TABLE IF NOT EXISTS founding_members (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL,
    tier text NOT NULL,
    billing_period text NOT NULL,
    amount_usd numeric(10,2),
    amount_zar numeric(10,2),
    payfast_payment_id text,
    founding_member_number integer,
    created_at timestamptz DEFAULT now()
  );
*/

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@adrevtechnologies.com'

function buildSignature(params: Record<string, string>, passphrase?: string): string {
  const sorted = Object.keys(params)
    .sort()
    .filter((k) => k !== 'signature' && params[k] !== '')
    .map((k) => `${k}=${encodeURIComponent(params[k]).replace(/%20/g, '+')}`)
    .join('&')

  // PayFast's documented signature algorithm requires MD5 over the query string.
  // This is a message authentication code per PayFast API spec — not a password hash.
  // See: https://developers.payfast.co.za/docs#step_4_generate_signature
  const withPassphrase = passphrase
    ? `${sorted}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, '+')}`
    : sorted
  return createHash('md5').update(withPassphrase).digest('hex') // lgtm[js/insufficient-password-hash]
}

function getAccessWindow(tier: string): string {
  switch (tier.toLowerCase()) {
    case 'starter':    return '30–45 days'
    case 'business':   return '45–60 days'
    case 'enterprise': return '60–90 days'
    default:           return '30–90 days'
  }
}

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
  firstName: string
  tier: string
  billingPeriod: string
  foundingMemberNumber: number
}) {
  if (!resend) return

  const { email, firstName, tier, billingPeriod, foundingMemberNumber } = opts
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1)
  const periodLabel = billingPeriod === 'annual' ? 'Annual' : 'Monthly'
  const accessWindow = getAccessWindow(tier)
  const accountManagerMsg = getAccountManagerMessage(tier)

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
          <!-- Logo / brand -->
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:18px;font-weight:700;color:#f1f5f9;letter-spacing:-0.5px;">
                Ad Rev Technologies
              </p>
            </td>
          </tr>

          <!-- Headline -->
          <tr>
            <td style="background-color:#0f1629;border:1px solid #1e2d4a;border-radius:16px;padding:40px 36px;">
              <h1 style="margin:0 0 8px;font-size:28px;font-weight:800;color:#f1f5f9;line-height:1.2;">
                You're in.
              </h1>
              <p style="margin:0 0 32px;font-size:18px;font-weight:600;color:#00d4ff;">
                Welcome to Ad Rev Technologies, ${firstName}.
              </p>

              <!-- Founding Member badge -->
              <div style="background-color:#f59e0b15;border:1px solid #f59e0b4d;border-radius:12px;padding:20px 24px;margin-bottom:32px;text-align:center;">
                <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#f59e0b;text-transform:uppercase;letter-spacing:1px;">
                  Founding Member
                </p>
                <p style="margin:0;font-size:36px;font-weight:800;color:#f59e0b;">
                  #${foundingMemberNumber}
                </p>
              </div>

              <!-- Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #1e2d4a;">
                    <span style="font-size:13px;color:#94a3b8;">Tier</span>
                    <span style="float:right;font-size:13px;font-weight:600;color:#f1f5f9;">${tierLabel}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #1e2d4a;">
                    <span style="font-size:13px;color:#94a3b8;">Billing</span>
                    <span style="float:right;font-size:13px;font-weight:600;color:#f1f5f9;">${periodLabel}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;">
                    <span style="font-size:13px;color:#94a3b8;">Access Window</span>
                    <span style="float:right;font-size:13px;font-weight:600;color:#00d4ff;">${accessWindow}</span>
                  </td>
                </tr>
              </table>

              <!-- Account manager message -->
              <div style="background-color:#00d4ff0d;border:1px solid #00d4ff33;border-radius:10px;padding:20px 24px;margin-bottom:32px;">
                <p style="margin:0;font-size:14px;color:#f1f5f9;line-height:1.6;">
                  ${accountManagerMsg}
                </p>
              </div>

              <!-- Contact -->
              <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6;">
                Questions? Reach us directly at
                <a href="mailto:morgan@adrevtechnologies.com" style="color:#00d4ff;text-decoration:none;">morgan@adrevtechnologies.com</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
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
    console.error('PayFast confirmation email failed:', err)
  }
}

export async function POST(request: NextRequest) {
  try {
    const text = await request.text()
    const params: Record<string, string> = {}
    for (const pair of text.split('&')) {
      const idx = pair.indexOf('=')
      if (idx === -1) continue
      const key = decodeURIComponent(pair.slice(0, idx).replace(/\+/g, ' '))
      const val = decodeURIComponent(pair.slice(idx + 1).replace(/\+/g, ' '))
      params[key] = val
    }

    // Validate signature
    const passphrase = process.env.PAYFAST_PASSPHRASE || undefined
    const expectedSignature = buildSignature(params, passphrase)
    if (params.signature !== expectedSignature) {
      console.error('PayFast ITN: invalid signature', { received: params.signature, expected: expectedSignature })
      return new NextResponse('Invalid signature', { status: 400 })
    }

    // Only handle completed payments
    if (params.payment_status !== 'COMPLETE') {
      return new NextResponse('OK', { status: 200 })
    }

    if (!supabaseAdmin) {
      console.error('PayFast ITN: supabaseAdmin is null')
      return new NextResponse('Service unavailable', { status: 503 })
    }

    const email = params.email_address || ''
    const nameFirst = params.name_first || ''
    const nameLast = params.name_last || ''
    const fullName = [nameFirst, nameLast].filter(Boolean).join(' ')
    const amountZar = parseFloat(params.amount_gross || '0')
    const pfPaymentId = params.pf_payment_id || ''
    const tier = params.custom_str1 || ''
    const billingPeriod = params.custom_str2 || ''
    const amountUsd = parseFloat(params.custom_str3 || '0')

    // Get current count for founding_member_number
    const { count } = await supabaseAdmin
      .from('founding_members')
      .select('*', { count: 'exact', head: true })

    const foundingMemberNumber = (count ?? 0) + 1

    // Insert founding member record
    const { error: insertError } = await supabaseAdmin
      .from('founding_members')
      .insert([{
        name: fullName,
        email,
        tier,
        billing_period: billingPeriod,
        amount_usd: amountUsd,
        amount_zar: amountZar,
        payfast_payment_id: pfPaymentId,
        founding_member_number: foundingMemberNumber,
      }])

    if (insertError) {
      console.error('PayFast ITN: founding_members insert error', insertError)
    }

    // Update waitlist status if email matches
    const { error: waitlistError } = await supabaseAdmin
      .from('waitlist')
      .update({ status: 'converted' })
      .eq('email', email)
      .eq('status', 'pending')

    if (waitlistError) {
      console.error('PayFast ITN: waitlist update error', waitlistError)
    }

    // Send confirmation email (fire-and-forget)
    sendConfirmationEmail({
      email,
      firstName: nameFirst,
      tier,
      billingPeriod,
      foundingMemberNumber,
    }).catch(() => {})

    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('PayFast ITN unexpected error:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
