import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  console.log('Auth callback route called');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);

    console.log('Code exchanged for session');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('User found:', user.id);
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('has_paid')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          // If profile doesn't exist, create one
          const { error: insertError } = await supabase
            .from('user_profiles')
            .insert({ user_id: user.id, has_paid: false });

          if (insertError) {
            console.error('Error creating user profile:', insertError);
          }
          // Redirect to checkout for new users
          return NextResponse.redirect(requestUrl.origin + '/checkout');
        } else if (profileData && profileData.has_paid) {
          console.log('User has paid, redirecting to dashboard');
          return NextResponse.redirect(requestUrl.origin + '/dashboard');
        }
      }
    } catch (error) {
      console.error('Error in auth callback:', error);
    }
  }

  console.log('Redirecting to:', next);
  return NextResponse.redirect(requestUrl.origin + next);
}