import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/database'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'contact@adrevtechnologies.com'
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@adrevtechnologies.com'

const waitlistSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name is too long'),
  email: z.string().email('Invalid email address').max(500, 'Email is too long'),
  company_name: z.string().min(1, 'Company name is required').max(300, 'Company name is too long'),
  role: z.string().min(1, 'Role is required').max(200, 'Role is too long'),
  website: z
    .string()
    .max(500)
    .refine(
      (val) => val === '' || /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(val),
      { message: 'Please enter a valid URL (e.g. https://yourcompany.com)' }
    )
    .optional()
    .default(''),
  platform_type: z.enum(['ecommerce', 'gaming', 'fintech', 'sports_betting', 'telecoms', 'loyalty', 'other'], {
    error: 'Please select a platform type',
  }),
  monthly_active_users: z.enum(['under_10k', '10k_50k', '50k_250k', '250k_1m', 'over_1m'], {
    error: 'Please select your monthly active users range',
  }),
  interested_tier: z.enum(['starter', 'business', 'enterprise'], {
    error: 'Please select a tier',
  }),
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

async function sendAdminNotification(data: WaitlistData) {
  if (!resend) return
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Waitlist Signup — ${data.company_name} (${data.interested_tier})`,
      html: `
        <h2>New Waitlist Signup</h2>
        <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
          <tr><td><strong>Name</strong></td><td>${data.name}</td></tr>
          <tr><td><strong>Email</strong></td><td>${data.email}</td></tr>
          <tr><td><strong>Company</strong></td><td>${data.company_name}</td></tr>
          <tr><td><strong>Role</strong></td><td>${data.role}</td></tr>
          <tr><td><strong>Website</strong></td><td>${data.website || '—'}</td></tr>
          <tr><td><strong>Platform Type</strong></td><td>${data.platform_type}</td></tr>
          <tr><td><strong>Monthly Active Users</strong></td><td>${data.monthly_active_users}</td></tr>
          <tr><td><strong>Interested Tier</strong></td><td>${data.interested_tier}</td></tr>
          <tr><td><strong>How Did They Hear</strong></td><td>${data.how_did_you_hear || '—'}</td></tr>
          <tr><td><strong>Message</strong></td><td>${data.message || '—'}</td></tr>
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
      subject: "You're on the Ad Rev Technologies waitlist",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
          <h2 style="color:#3b82f6">You're on the list, ${name}! 🎉</h2>
          <p>Thanks for joining the Ad Rev Technologies waitlist. We've received your details and a member of our team will be in touch within <strong>24–48 hours</strong> to get you set up.</p>
          <p>In the meantime, feel free to explore our docs or reach out at <a href="mailto:contact@adrevtechnologies.com">contact@adrevtechnologies.com</a>.</p>
          <p style="margin-top:32px;color:#64748b;font-size:13px">— The Ad Rev Technologies Team</p>
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
      console.error('Waitlist API: supabaseAdmin is null — NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars are not set')
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 }
      )
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
    }

    const validatedData = waitlistSchema.parse(body)

    // Check for duplicate email
    const { data: existing, error: selectError } = await supabaseAdmin
      .from('waitlist')
      .select('id')
      .eq('email', validatedData.email)
      .maybeSingle()

    if (selectError) {
      console.error('Waitlist duplicate check error:', JSON.stringify(selectError))
      return NextResponse.json(
        { error: `Database error: ${selectError.message}` },
        { status: 500 }
      )
    }

    if (existing) {
      return NextResponse.json(
        { error: 'You are already on the waitlist.' },
        { status: 400 }
      )
    }

    const { error: insertError } = await supabaseAdmin
      .from('waitlist')
      .insert([
        {
          name: validatedData.name,
          email: validatedData.email,
          company_name: validatedData.company_name,
          role: validatedData.role,
          website: validatedData.website || null,
          platform_type: validatedData.platform_type,
          monthly_active_users: validatedData.monthly_active_users,
          interested_tier: validatedData.interested_tier,
          message: validatedData.message || null,
          how_did_you_hear: validatedData.how_did_you_hear ?? null,
          status: 'pending',
        },
      ])

    if (insertError) {
      console.error('Waitlist insert error:', JSON.stringify(insertError))
      return NextResponse.json(
        { error: `Failed to join the waitlist: ${insertError.message}` },
        { status: 500 }
      )
    }

    // Send notifications fire-and-forget — failures do not affect the response
    Promise.all([
      sendAdminNotification(validatedData),
      sendUserConfirmation(validatedData.name, validatedData.email),
    ]).catch(() => {})

    return NextResponse.json(
      { success: true, message: 'Successfully joined the waitlist.' },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    console.error('Waitlist unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
