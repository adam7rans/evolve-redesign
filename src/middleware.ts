import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

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
  // Create a new response object
  const res = NextResponse.next();
  
  // Initialize Supabase client for server-side operations
  const supabase = createMiddlewareClient({ req, res });

  // Retrieve the current session from Supabase
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if the current path starts with any of the paid routes
  const isAccessingPaidRoute = paidRoutes.some(route => 
    req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(`${route}/`)
  );

  if (session) {
    // If a session exists, check the user's payment status
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('has_paid')
      .eq('user_id', session.user.id)
      .single();

    // Determine if the user has paid, defaulting to false if no data is found
    const hasPaid = profile?.has_paid ?? false;

    // If the user hasn't paid and is trying to access a paid route, redirect to checkout
    if (!hasPaid && isAccessingPaidRoute) {
      return NextResponse.redirect(new URL('/checkout', req.url));
    } else if (hasPaid && !isAccessingPaidRoute && req.nextUrl.pathname !== '/dashboard') {
      // IF hasSession && hasPaid AND the user is trying to access other routes besides isAccessingPaidRoute THEN redirect to /dashboard
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  } else {
    // If no session and user tries to access a paid route, redirect to login
    if (isAccessingPaidRoute) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // If all checks pass, continue with the request
  return res;
}

// Configuration for which routes the middleware should run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};