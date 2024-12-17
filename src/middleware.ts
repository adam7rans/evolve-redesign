import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of routes that require payment, including sub-routes
const paidRoutes = [
  '/dashboard',
  '/settings',
  '/written',
  '/encrypted',
  '/transformer',
  '/rituals'
];

// Middleware function to handle authentication and payment status checks
export async function middleware(req: NextRequest) {
  console.log('Middleware called for path:', req.nextUrl.pathname);
  
  // Create a new response object
  const res = NextResponse.next();
  
  // For now, allow all non-paid routes
  const isAccessingPaidRoute = paidRoutes.some(route => 
    req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(`${route}/`)
  );

  if (isAccessingPaidRoute) {
    // Redirect paid routes to homepage for now
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

// Configuration for which routes the middleware should run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};