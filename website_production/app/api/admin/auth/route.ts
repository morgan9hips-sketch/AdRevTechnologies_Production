import { NextRequest, NextResponse } from 'next/server'
import { createHash, timingSafeEqual } from 'crypto'

const ADMIN_SECRET = process.env.ADMIN_SECRET || ''

/** Derives a stable session token from the secret — never stored in the cookie raw */
function deriveSessionToken(secret: string): string {
  return createHash('sha256').update(secret + ':admin-session').digest('hex')
}

export async function POST(request: NextRequest) {
  if (!ADMIN_SECRET) {
    return NextResponse.json({ error: 'Admin access not configured.' }, { status: 503 })
  }

  let body: { password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const supplied = body.password || ''
  let passwordMatch = false
  try {
    // Constant-time comparison to prevent timing attacks
    const a = Buffer.from(supplied)
    const b = Buffer.from(ADMIN_SECRET)
    if (a.length === b.length) {
      passwordMatch = timingSafeEqual(a, b)
    }
  } catch {
    passwordMatch = false
  }

  if (!passwordMatch) {
    return NextResponse.json({ error: 'Invalid password.' }, { status: 401 })
  }

  const sessionToken = deriveSessionToken(ADMIN_SECRET)
  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_auth', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/admin',
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('admin_auth')
  return response
}

