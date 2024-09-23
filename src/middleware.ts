import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  console.log('Middleware called for path:', req.nextUrl.pathname);
  
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log('Session found:', !!session);

  if (session) {
    try {
      const { data: profileData, error } = await supabase
        .from('user_profiles')
        .select('has_paid')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      console.log('User profile data:', profileData, 'Error:', error);

      if (error) {
        console.error('Error fetching user profile:', error);
        // Allow access if there's an error fetching the profile
        return res;
      }

      if (profileData && profileData.has_paid) {
        if (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/checkout') {
          console.log('Paid user redirected from login/checkout to dashboard');
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }
      } else {
        if (req.nextUrl.pathname === '/dashboard') {
          console.log('Unpaid user redirected from dashboard to checkout');
          return NextResponse.redirect(new URL('/checkout', req.url));
        }
      }
    } catch (error) {
      console.error('Unexpected error in middleware:', error);
      // Allow access if there's an unexpected error
      return res;
    }
  } else {
    if (req.nextUrl.pathname === '/dashboard') {
      console.log('Unauthenticated user redirected from dashboard to login');
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  console.log('Middleware allowing access to:', req.nextUrl.pathname);
  return res;
}

export const config = {
  matcher: ['/login', '/checkout', '/dashboard'],
};