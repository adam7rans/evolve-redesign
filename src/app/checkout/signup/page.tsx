'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SignUpForm from './sign-up-form';
import ProgressBar from '../progress-bar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';

export default function SignUpPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<{ priceId: string, interval: 'month' | 'year' } | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        router.push('/checkout/payment');
      }
    };

    // Read the cookie
    const cookies = document.cookie.split(';');
    const selectedPlanCookie = cookies.find(cookie => cookie.trim().startsWith('selectedPlan='));
    if (selectedPlanCookie) {
      const planData = JSON.parse(selectedPlanCookie.split('=')[1]);
      setSelectedPlan(planData);
    }

    checkUser();
  }, [supabase, router]);

  const handleSignUp = async (newUser: User) => {
    console.log('SignUpPage handleSignUp - New user signed up:', newUser);
    setUser(newUser);
    console.log('SignUpPage handleSignUp - Redirecting to payment');
    router.push(`/checkout/payment`);
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