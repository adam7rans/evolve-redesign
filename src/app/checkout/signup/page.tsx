'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SignUpForm from './sign-up-form';
import ProgressBar from '../progress-bar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClientComponentClient();

  const planId = searchParams.get('planId');
  const interval = searchParams.get('interval');

  useEffect(() => {
    console.log('SignUpPage useEffect - Initial render');
    console.log('SignUpPage useEffect - Params:', { planId, interval });

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('SignUpPage checkUser - User data:', user);
      setUser(user);
      if (user) {
        console.log('SignUpPage checkUser - User found, redirecting to payment');
        router.push(`/checkout/payment?planId=${planId}&interval=${interval}`);
      }
    };

    checkUser();
  }, [supabase, router, planId, interval]);

  const handleSignUp = async (newUser: User) => {
    console.log('SignUpPage handleSignUp - New user signed up:', newUser);
    setUser(newUser);
    console.log('SignUpPage handleSignUp - Redirecting to payment');
    router.push(`/checkout/payment?planId=${planId}&interval=${interval}`);
  };

  if (user) {
    return <div>Redirecting to payment...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <ProgressBar />
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <SignUpForm onSignUp={handleSignUp} />
    </div>
  );
}