import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get('flexgear_session')?.value;

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    // Only allow admin session tokens
    if (!sessionCookie || !sessionCookie.includes('_admin_')) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /account routes
  if (pathname.startsWith('/account')) {
    if (!sessionCookie) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
};
