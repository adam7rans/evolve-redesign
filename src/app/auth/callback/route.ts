import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');

  if (error) {
    // Handle case where user denied permission
    return NextResponse.redirect(`${requestUrl.origin}/checkout?error=${error}`);
  }

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);

    const { data: { user } } = await supabase.auth.getUser();

    if (user && user.user_metadata) {
      const googleData = encodeURIComponent(JSON.stringify({
        name: user.user_metadata.full_name,
        email: user.email,
        picture: user.user_metadata.avatar_url
      }));
      return NextResponse.redirect(`${requestUrl.origin}/checkout?googleData=${googleData}`);
    }
  }

  // If something goes wrong, redirect to the checkout page without data
  return NextResponse.redirect(`${requestUrl.origin}/checkout`);
}