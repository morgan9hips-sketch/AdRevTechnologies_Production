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
    .from('waitlist')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Admin waitlist fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ entries: data })
}

export async function PATCH(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
  }

  let body: { id?: string; status?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const { id, status } = body
  if (!id || !status || !['pending', 'contacted', 'converted'].includes(status)) {
    return NextResponse.json({ error: 'Invalid id or status.' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('waitlist')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Admin waitlist update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
