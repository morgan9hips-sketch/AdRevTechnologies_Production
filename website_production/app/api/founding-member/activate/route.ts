import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/database'
import { verifyFoundingMemberActivationToken } from '@/lib/foundingMemberActivation'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || ''

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json(
      { error: 'Activation token is required.' },
      { status: 400 },
    )
  }

  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Activation is not configured.' },
      { status: 503 },
    )
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Database is not configured.' },
      { status: 503 },
    )
  }

  const payload = verifyFoundingMemberActivationToken(
    token,
    PAYSTACK_SECRET_KEY,
  )

  if (!payload) {
    return NextResponse.json(
      { error: 'Activation link is invalid or expired.' },
      { status: 400 },
    )
  }

  const { data: member, error: lookupError } = await supabaseAdmin
    .from('founding_members')
    .select('email, paystack_reference, status')
    .eq('email', payload.email)
    .single()

  if (lookupError || !member) {
    return NextResponse.json(
      { error: 'Client record not found.' },
      { status: 404 },
    )
  }

  if (member.paystack_reference !== payload.reference) {
    return NextResponse.json(
      { error: 'Activation link does not match this purchase.' },
      { status: 409 },
    )
  }

  if (member.status !== 'verified') {
    const { error: updateError } = await supabaseAdmin
      .from('founding_members')
      .update({ status: 'verified' })
      .eq('email', payload.email)

    if (updateError) {
      console.error('Founding member activation update error:', updateError)
      return NextResponse.json(
        { error: 'Unable to activate client email.' },
        { status: 500 },
      )
    }
  }

  return NextResponse.redirect(
    new URL(
      `/founding-member/success?reference=${encodeURIComponent(payload.reference)}`,
      request.url,
    ),
  )
}
