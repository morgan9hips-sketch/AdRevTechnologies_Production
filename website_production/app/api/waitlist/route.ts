import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/database'

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
      console.error('Waitlist duplicate check error:', selectError)
      return NextResponse.json(
        { error: 'Failed to join the waitlist. Please try again.' },
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
      console.error('Supabase insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to join the waitlist. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Successfully joined the waitlist.' },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    console.error('Waitlist unhandled error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
