'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { useSearchParams } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

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
  const [isFormValid, setIsFormValid] = useState(false);
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    
    // Password should be at least 6 characters long
    const isPasswordValid = password.length >= 6;

    setIsFormValid(isEmailValid && isPasswordValid);
  }, [email, password]);

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

  const handleOAuthSignUp = async (provider: 'google' | 'apple') => {
    setError(null);
    const interval = searchParams.get('interval');
    const planId = searchParams.get('planId');

    console.log(`SignUpForm handle${provider.charAt(0).toUpperCase() + provider.slice(1)}SignUp - Params:`, { planId, interval });

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/checkout?step=payment`,
        queryParams: {
          prompt: 'select_account',
        },
      },
    });
    if (error) {
      console.error(`SignUpForm handle${provider.charAt(0).toUpperCase() + provider.slice(1)}SignUp - Error:`, error.message);
      setError(error.message);
    } else {
      console.log(`SignUpForm handle${provider.charAt(0).toUpperCase() + provider.slice(1)}SignUp - Successful OAuth initiation`);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
      <div className="flex flex-col space-y-4">
        <Button 
          onClick={() => handleOAuthSignUp('google')} 
          className="w-full bg-transparent hover:bg-black text-white border border-white transition-all duration-200"
        >
          <FcGoogle className="w-5 h-5 mr-2" />
          Connect with Google
        </Button>
        <Button 
          onClick={() => handleOAuthSignUp('apple')} 
          className="w-full bg-transparent hover:bg-black text-white border border-white transition-all duration-200"
        >
          <FaApple className="w-5 h-5 mr-2" />
          Connect with Apple
        </Button>
      </div>
      <div className="relative flex items-center justify-center">
        <span className="px-2 text-gray-400 text-sm">
          or
        </span>
      </div>
      <form onSubmit={handleEmailSignUp} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <Button 
          type="submit" 
          className={`w-full text-white transition-colors duration-200 ${
            isFormValid 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-gray-600 cursor-not-allowed'
          }`}
          disabled={!isFormValid}
          style={{ cursor: isFormValid ? 'pointer' : 'not-allowed' }}
        >
          Sign Up
        </Button>
      </form>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}
