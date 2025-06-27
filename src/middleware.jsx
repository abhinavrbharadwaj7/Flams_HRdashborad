import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // Check if it's a dashboard route (protected)
  if (pathname.startsWith('/dashboard')) {
    // In a real app, you'd check for a valid JWT token or session
    // For this demo, we'll just check for a simple auth flag in localStorage
    // Note: This is client-side only and not secure for production
    
    // Since middleware runs on the server, we can't access localStorage
    // In a real app, you'd check cookies or headers for authentication
    const authCookie = request.cookies.get('isAuthenticated');
    
    if (!authCookie) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // If accessing root and already authenticated, redirect to dashboard
  if (pathname === '/') {
    const authCookie = request.cookies.get('isAuthenticated');
    if (authCookie) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except api routes and static files
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};