'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function ConfirmPageContent() {
  const [message, setMessage] = useState('Confirming your email...');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const confirmEmail = async () => {
      const access_token = searchParams.get('access_token');
      const _refresh_token = searchParams.get('refresh_token');
      const type = searchParams.get('type');

      if (access_token && type === 'signup') {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: access_token,
          type: 'signup',
        });

        if (error) {
          setMessage(`Error confirming email: ${error.message}`);
        } else {
          setMessage('Email confirmed successfully! Redirecting to login...');
          setTimeout(() => router.push('/login'), 2000);
        }
      } else {
        setMessage('Invalid confirmation link. Please try signing up again.');
      }
    };

    confirmEmail();
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">Email Confirmation</h1>
      <p className="text-center text-black dark:text-white">{message}</p>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmPageContent />
    </Suspense>
  );
}