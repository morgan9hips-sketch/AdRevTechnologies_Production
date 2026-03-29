import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/database'

const waitlistSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name is too long'),
  email: z.string().email('Invalid email address').max(500, 'Email is too long'),
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
