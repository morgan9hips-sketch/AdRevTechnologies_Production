import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/database'

const waitlistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
})

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database is not configured. Please contact support.' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const validatedData = waitlistSchema.parse(body)

    // Check for duplicate email
    const { data: existing } = await supabaseAdmin
      .from('waitlist')
      .select('id')
      .eq('email', validatedData.email)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'You are already on the waitlist.' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('waitlist')
      .insert([
        {
          name: validatedData.name,
          email: validatedData.email,
          status: 'pending',
        },
      ])

    if (error) {
      console.error('Supabase error:', error)
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
    console.error('Waitlist error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
