import { NextRequest, NextResponse } from 'next/server'

async function deriveSessionToken(secret: string): Promise<string> {
  const data = new TextEncoder().encode(secret + ':admin-session')
  const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname

  // Handle app subdomain
  if (hostname.startsWith('app.')) {
    // Rewrite to app pages
    return NextResponse.rewrite(new URL(`/app${pathname}`, request.url))
  }

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminSecret = process.env.ADMIN_SECRET
    if (!adminSecret) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    const cookie = request.cookies.get('admin_auth')
    const expectedToken = await deriveSessionToken(adminSecret)
    if (cookie?.value !== expectedToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Keep v1 platform routes detached from public production by default.
  // Access is only allowed when an explicit owner gate token is configured.
  if (pathname.startsWith('/platform')) {
    const ownerGateToken = process.env.V1_OWNER_GATE_TOKEN
    if (!ownerGateToken) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    const ownerCookie = request.cookies.get('v1_owner_gate')
    if (ownerCookie?.value !== ownerGateToken) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Handle main domain - continue normally
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
