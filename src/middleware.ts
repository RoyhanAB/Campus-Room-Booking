import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'session';

// Routes yang bisa diakses tanpa login
const publicRoutes = ['/login', '/landing'];

// Routes khusus admin
const adminRoutes = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets, API routes, _next
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/image') ||
    pathname.includes('.') // files like .svg, .ico, .png
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  let session: { user_id: string; role: string; user_name: string } | null = null;

  if (sessionCookie?.value) {
    try {
      session = JSON.parse(sessionCookie.value);
    } catch {
      session = null;
    }
  }

  const isLoggedIn = !!session;
  const isPublicRoute = publicRoutes.some((route) => pathname === route);
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // 1. Belum login → redirect ke /landing (kecuali sudah di route publik)
  if (!isLoggedIn && !isPublicRoute) {
    const landingUrl = new URL('/landing', request.url);
    return NextResponse.redirect(landingUrl);
  }

  // 2. Sudah login tapi akses /login → redirect ke halaman sesuai role
  if (isLoggedIn && isPublicRoute) {
    if (session!.role === 'admin_fakultas') {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 3. User biasa coba akses /admin → redirect ke /
  if (isLoggedIn && isAdminRoute && session!.role !== 'admin_fakultas') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 4. Admin coba akses halaman user → redirect ke /admin
  if (isLoggedIn && !isAdminRoute && !isPublicRoute && session!.role === 'admin_fakultas') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
