import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''

  // Handle app subdomain
  if (hostname.startsWith('app.')) {
    // Rewrite to app pages
    return NextResponse.rewrite(
      new URL(`/app${request.nextUrl.pathname}`, request.url)
    )
  }

  // Handle main domain - continue normally
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
