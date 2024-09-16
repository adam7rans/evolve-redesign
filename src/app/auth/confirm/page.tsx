'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ConfirmPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    const confirmEmail = async () => {
      const log = (message: string) => {
        console.log(message);
        setStatus(message);
      };

      log('Confirm page loaded');
      
      const hash = window.location.hash.substring(1);
      log('Full hash: ' + hash);

      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      log(`Access Token: ${accessToken ? 'Present' : 'Missing'}, Refresh Token: ${refreshToken ? 'Present' : 'Missing'}`);

      if (accessToken && refreshToken) {
        log('Setting session...');
        try {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Error setting session:', error);
            log(`Error: ${error.message}`);
            setTimeout(() => router.push('/login'), 2000);
          } else {
            log('Session set successfully. Redirecting to dashboard...');
            setTimeout(() => router.push('/dashboard?welcome=true'), 2000);
          }
        } catch (error) {
          console.error('Unexpected error:', error);
          log('Unexpected error occurred');
          setTimeout(() => router.push('/login'), 2000);
        }
      } else {
        log('No access token or refresh token found. Redirecting to login...');
        setTimeout(() => router.push('/login'), 2000);
      }
    };

    confirmEmail();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <p className="text-black dark:text-white mb-4">Confirming your email...</p>
      <p className="text-black dark:text-white">{status}</p>
    </div>
  );
}