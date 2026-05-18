import { NextRequest, NextResponse } from 'next/server';
import { parseSessionCookie } from './lib/session-cookie';

const SESSION_COOKIE_NAME = 'session';
const publicRoutes = ['/login', '/landing'];
const adminRoutes = ['/admin'];
const adminRoles = ['admin_fakultas', 'super_admin'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/image') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const session = sessionCookie?.value ? parseSessionCookie(sessionCookie.value) : null;

  const isLoggedIn = !!session;
  const isPublicRoute = publicRoutes.some((route) => pathname === route);
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isAdminRole = session?.role ? adminRoles.includes(session.role) : false;

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/landing', request.url));
  }

  if (isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(new URL(isAdminRole ? '/admin' : '/', request.url));
  }

  if (isLoggedIn && isAdminRoute && !isAdminRole) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isLoggedIn && !isAdminRoute && !isPublicRoute && isAdminRole) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
