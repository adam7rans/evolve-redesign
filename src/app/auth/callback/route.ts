import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  // Log to file
  const logMessage = `Callback URL: ${requestUrl.href}\nTimestamp: ${new Date().toISOString()}\n\n`;
  fs.appendFileSync(path.join(process.cwd(), 'callback-log.txt'), logMessage);

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to the home page after successful authentication
  return NextResponse.redirect(new URL('/', requestUrl.origin));
} 