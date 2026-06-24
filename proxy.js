import { NextResponse } from 'next/server';

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('session');

  const PUBLIC_ROUTES = ['/', '/login', '/customer', '/_next', '/images', '/favicon.ico', '/api/menu', '/api/auth'];

  const isPublic = PUBLIC_ROUTES.some(route => pathname.startsWith(route) || pathname === route);

  if (isPublic) {
    if (pathname === '/login' && session) {
      try {
        const user = JSON.parse(session.value);
        return NextResponse.redirect(new URL(user.role === 'kasir' ? '/kasir' : '/admin', request.url));
      } catch {}
    }
    return NextResponse.next();
  }

  if (!session) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const user = JSON.parse(session.value);
    if (pathname.startsWith('/kasir') && user.role !== 'kasir') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if ((pathname.startsWith('/admin') || pathname.startsWith('/api')) && !['admin', 'developer'].includes(user.role)) {
      if (user.role === 'kasir') return NextResponse.redirect(new URL('/kasir', request.url));
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
