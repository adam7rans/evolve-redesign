'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { useSearchParams } from 'next/navigation';

interface SignUpFormProps {
  onSignUp: (user: User) => void;
  selectedPlan: {
    priceId: string;
    interval: 'month' | 'year';
    name: string;
    price: number;
  } | null;
}

export default function SignUpForm({ onSignUp }: SignUpFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams();

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else if (data.user) {
      onSignUp(data.user);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    const interval = searchParams.get('interval');
    const planId = searchParams.get('planId');

    console.log('SignUpForm handleGoogleSignUp - Params:', { planId, interval });

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/checkout/payment&planId=${planId}&interval=${interval}`,
        queryParams: {
          prompt: 'select_account',
        },
      },
    });
    if (error) {
      console.error('SignUpForm handleGoogleSignUp - Error:', error.message);
      setError(error.message);
    } else {
      console.log('SignUpForm handleGoogleSignUp - Successful OAuth initiation');
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleGoogleSignUp} className="w-full">
        Sign up with Google
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <form onSubmit={handleEmailSignUp} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}