import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { supabaseAdmin } from '@/lib/database'

const ADMIN_SECRET = process.env.ADMIN_SECRET || ''

function deriveSessionToken(secret: string): string {
  return createHash('sha256').update(secret + ':admin-session').digest('hex')
}

function isAuthenticated(request: NextRequest): boolean {
  if (!ADMIN_SECRET) return false
  const cookie = request.cookies.get('admin_auth')
  return cookie?.value === deriveSessionToken(ADMIN_SECRET)
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
  }

  const { data, error } = await supabaseAdmin
    .from('founding_members')
    .select('id, founding_member_number, name, email, paystack_reference, amount, currency, status, is_test, tier, billing_period, access_window, created_at')
    .order('founding_member_number', { ascending: true })

  if (error) {
    console.error('Admin founding-members fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ members: data })
}
