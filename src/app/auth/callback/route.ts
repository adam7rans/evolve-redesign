import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  console.log('Auth callback route called. Code present:', !!code);

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      console.log('Code exchange result:', { success: !!data, error: error?.message });

      if (error) throw error;

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('Get user result:', { success: !!user, error: userError?.message });

      if (userError) throw userError;

      if (user) {
        console.log('User found:', user.id);
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('has_paid')
          .eq('user_id', user.id)
          .single();

        console.log('Profile fetch result:', { success: !!profileData, error: profileError?.message });

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          // If profile doesn't exist, create one
          const { error: insertError } = await supabase
            .from('user_profiles')
            .insert({ user_id: user.id, has_paid: false });

          console.log('Profile creation result:', { success: !insertError, error: insertError?.message });

          if (insertError) {
            console.error('Error creating user profile:', insertError);
          }
          console.log('Redirecting new user to checkout');
          return NextResponse.redirect(requestUrl.origin + '/checkout');
        } else if (profileData && profileData.has_paid) {
          console.log('User has paid, redirecting to dashboard');
          return NextResponse.redirect(requestUrl.origin + '/dashboard');
        } else {
          console.log('Existing user hasn\'t paid, redirecting to checkout');
          return NextResponse.redirect(requestUrl.origin + '/checkout');
        }
      } else {
        console.error('No user found after successful authentication');
      }
    } catch (error) {
      console.error('Error in auth callback:', error);
    }
  }

  console.log('Redirecting to home page due to error or missing code');
  return NextResponse.redirect(requestUrl.origin);
}