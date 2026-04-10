import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/database'
import { contactEmail } from '@/lib/site-content'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || contactEmail
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || 'noreply@adrevtechnologies.com'

const waitlistSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name is too long'),
  email: z
    .string()
    .email('Invalid email address')
    .max(500, 'Email is too long'),
  company_name: z
    .string()
    .min(1, 'Company name is required')
    .max(300, 'Company name is too long'),
  role: z.string().min(1, 'Role is required').max(200, 'Role is too long'),
  website: z
    .string()
    .max(500)
    .refine(
      (val) => val === '' || /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(val),
      { message: 'Please enter a valid URL (e.g. https://yourcompany.com)' },
    )
    .optional()
    .default(''),
  platform_type: z.enum(
    [
      'platform_operator',
      'digital_agency',
      'ecommerce',
      'gaming',
      'fintech',
      'sports_betting',
      'telecoms',
      'loyalty',
      'other',
    ],
    {
      error: 'Please select a platform type',
    },
  ),
  monthly_active_users: z.enum(
    [
      'under_10k',
      '10k_50k',
      '50k_250k',
      '250k_1m',
      'over_1m',
      '0_500k',
      '500k_1_5m',
      '1_5m_3m',
      '3m_plus',
    ],
    {
      error: 'Please select your monthly active users range',
    },
  ),
  interested_tier: z.enum(
    [
      'starter',
      'business',
      'enterprise',
      'founding_partner_0_500k',
      'growth_500k_1_5m',
      'scale_1_5m_3m',
      'custom_3m_plus',
    ],
    {
      error: 'Please select a tier',
    },
  ),
  message: z
    .string()
    .max(1000, 'Message must be under 1000 characters')
    .optional()
    .default(''),
  how_did_you_hear: z
    .enum(['search', 'social_media', 'referral', 'conference', 'other'])
    .optional(),
})

type WaitlistData = z.infer<typeof waitlistSchema>

type WaitlistInsertPayload = {
  name: string
  email: string
  company_name: string
  role: string
  website: string | null
  platform_type: WaitlistData['platform_type'] | null
  monthly_active_users: WaitlistData['monthly_active_users'] | null
  interested_tier: WaitlistData['interested_tier'] | null
  message: string | null
  how_did_you_hear: WaitlistData['how_did_you_hear'] | null
  status: 'pending'
}

const LEGACY_PLATFORM_TYPES = new Set([
  'ecommerce',
  'gaming',
  'fintech',
  'sports_betting',
  'telecoms',
  'loyalty',
  'other',
])

const LEGACY_MONTHLY_ACTIVE_USERS = new Set([
  'under_10k',
  '10k_50k',
  '50k_250k',
  '250k_1m',
  'over_1m',
])

const LEGACY_INTERESTED_TIERS = new Set(['starter', 'business', 'enterprise'])

function buildCompatibilityMessage(data: WaitlistData) {
  const submittedValues: string[] = []

  if (!LEGACY_PLATFORM_TYPES.has(data.platform_type)) {
    submittedValues.push(`platform_type=${data.platform_type}`)
  }

  if (!LEGACY_MONTHLY_ACTIVE_USERS.has(data.monthly_active_users)) {
    submittedValues.push(`monthly_active_users=${data.monthly_active_users}`)
  }

  if (!LEGACY_INTERESTED_TIERS.has(data.interested_tier)) {
    submittedValues.push(`interested_tier=${data.interested_tier}`)
  }

  if (submittedValues.length === 0) {
    return data.message || null
  }

  const compatibilityNote = `[submitted-values ${submittedValues.join('; ')}]`
  const baseMessage = data.message?.trim() || ''
  const combinedMessage = `${baseMessage}${baseMessage ? '\n\n' : ''}${compatibilityNote}`

  return combinedMessage.slice(0, 1000)
}

function buildWaitlistInsertPayload(
  data: WaitlistData,
  useLegacyCompatibleValues = false,
): WaitlistInsertPayload {
  if (!useLegacyCompatibleValues) {
    return {
      name: data.name,
      email: data.email,
      company_name: data.company_name,
      role: data.role,
      website: data.website || null,
      platform_type: data.platform_type,
      monthly_active_users: data.monthly_active_users,
      interested_tier: data.interested_tier,
      message: data.message || null,
      how_did_you_hear: data.how_did_you_hear ?? null,
      status: 'pending',
    }
  }

  return {
    name: data.name,
    email: data.email,
    company_name: data.company_name,
    role: data.role,
    website: data.website || null,
    platform_type: LEGACY_PLATFORM_TYPES.has(data.platform_type)
      ? data.platform_type
      : null,
    monthly_active_users: LEGACY_MONTHLY_ACTIVE_USERS.has(
      data.monthly_active_users,
    )
      ? data.monthly_active_users
      : null,
    interested_tier: LEGACY_INTERESTED_TIERS.has(data.interested_tier)
      ? data.interested_tier
      : null,
    message: buildCompatibilityMessage(data),
    how_did_you_hear: data.how_did_you_hear ?? null,
    status: 'pending',
  }
}

function hasLegacyCompatibilityFallback(data: WaitlistData) {
  return (
    !LEGACY_PLATFORM_TYPES.has(data.platform_type) ||
    !LEGACY_MONTHLY_ACTIVE_USERS.has(data.monthly_active_users) ||
    !LEGACY_INTERESTED_TIERS.has(data.interested_tier)
  )
}

async function sendAdminNotification(data: WaitlistData) {
  if (!resend) return
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Contact Enquiry - ${data.company_name} (${data.interested_tier})`,
      html: `
        <h2>New Contact Enquiry</h2>
        <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
          <tr><td><strong>Name</strong></td><td>${data.name}</td></tr>
          <tr><td><strong>Email</strong></td><td>${data.email}</td></tr>
          <tr><td><strong>Company</strong></td><td>${data.company_name}</td></tr>
          <tr><td><strong>Role</strong></td><td>${data.role}</td></tr>
          <tr><td><strong>Website</strong></td><td>${data.website || '--'}</td></tr>
          <tr><td><strong>Platform Type</strong></td><td>${data.platform_type}</td></tr>
          <tr><td><strong>Monthly Active Users</strong></td><td>${data.monthly_active_users}</td></tr>
          <tr><td><strong>Interested Tier</strong></td><td>${data.interested_tier}</td></tr>
          <tr><td><strong>How Did They Hear</strong></td><td>${data.how_did_you_hear || '--'}</td></tr>
          <tr><td><strong>Message</strong></td><td>${data.message || '--'}</td></tr>
        </table>
      `,
    })
  } catch (err) {
    console.error('Admin notification email failed:', err)
  }
}

async function sendUserConfirmation(name: string, email: string) {
  if (!resend) return
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Your Ad Rev Technologies enquiry has been received',
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
          <h2 style="color:#3b82f6">Thanks, ${name}. We've received your enquiry.</h2>
          <p>Your message has been routed to the Ad Rev Technologies team. A member of our team will be in touch within <strong>24-48 hours</strong> to discuss access, pricing, or onboarding.</p>
          <p>In the meantime, feel free to explore our docs or reach out at <a href="mailto:${contactEmail}">${contactEmail}</a>.</p>
          <p style="margin-top:32px;color:#64748b;font-size:13px">- The Ad Rev Technologies Team</p>
        </div>
      `,
    })
  } catch (err) {
    console.error('User confirmation email failed:', err)
  }
}

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ count: 0 })
    }
    const { count, error } = await supabaseAdmin
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
    if (error) {
      console.error('Waitlist count error:', error)
      return NextResponse.json({ count: 0 })
    }
    return NextResponse.json({ count: count ?? 0 })
  } catch {
    return NextResponse.json({ count: 0 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      console.error(
        'Waitlist API: supabaseAdmin is null - NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars are not set',
      )
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 },
      )
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body.' },
        { status: 400 },
      )
    }

    const validatedData = waitlistSchema.parse(body)

    const { data: existing, error: selectError } = await supabaseAdmin
      .from('waitlist')
      .select('id')
      .eq('email', validatedData.email)
      .maybeSingle()

    if (selectError) {
      console.error(
        'Waitlist duplicate check error:',
        JSON.stringify(selectError),
      )
      return NextResponse.json(
        { error: 'Unable to submit your enquiry right now. Please try again shortly.' },
        { status: 500 },
      )
    }

    if (existing) {
      return NextResponse.json(
        { error: 'We already have an enquiry for this email address.' },
        { status: 400 },
      )
    }

    let { error: insertError } = await supabaseAdmin.from('waitlist').insert([
      buildWaitlistInsertPayload(validatedData),
    ])

    if (insertError && hasLegacyCompatibilityFallback(validatedData)) {
      const { error: fallbackInsertError } = await supabaseAdmin
        .from('waitlist')
        .insert([buildWaitlistInsertPayload(validatedData, true)])

      if (fallbackInsertError) {
        console.error(
          'Waitlist fallback insert error:',
          JSON.stringify(fallbackInsertError),
        )
        insertError = fallbackInsertError
      } else {
        console.warn(
          'Waitlist insert succeeded using legacy-compatible fallback payload',
        )
        insertError = null
      }
    }

    if (insertError) {
      console.error('Waitlist insert error:', JSON.stringify(insertError))
      return NextResponse.json(
        {
          error:
            'Unable to submit your enquiry right now. Please try again shortly or email admin@adrevtechnologies.com.',
        },
        { status: 500 },
      )
    }

    Promise.all([
      sendAdminNotification(validatedData),
      sendUserConfirmation(validatedData.name, validatedData.email),
    ]).catch(() => {})

    return NextResponse.json(
      { success: true, message: 'Enquiry submitted successfully.' },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 },
      )
    }
    console.error('Waitlist unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
