'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Spinner from '@/components/Spinner';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', content: '' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', content: '' });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setIsLoading(false);
    if (error) {
      setMessage({ type: 'error', content: error.message });
    } else {
      setMessage({ type: 'success', content: 'Registration successful! Please check your email to confirm your account.' });
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    setMessage({ type: '', content: '' });
  
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  
    if (error) {
      setIsLoading(false);
      setMessage({ type: 'error', content: 'Google registration failed. Please try again.' });
      console.error('Google OAuth error:', error);
    } else {
      setMessage({ type: 'success', content: 'Redirecting to Google registration...' });
      // Don't set isLoading to false here, as we're redirecting to Google
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">Register</h1>
      {message.content && (
        <div className={`w-full max-w-md p-2 mb-4 rounded ${
          message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message.content}
        </div>
      )}
      <form onSubmit={handleEmailRegister} className="w-full max-w-md">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded text-black"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded text-black"
          required
        />
        <button type="submit" className="w-full p-2 mb-4 bg-black text-white dark:bg-white dark:text-black rounded hover:bg-gray-800 dark:hover:bg-gray-200" disabled={isLoading}>
          {isLoading ? <Spinner /> : 'Register'}
        </button>
      </form>
      <div className="flex flex-col w-full max-w-md">
        <button onClick={handleGoogleRegister} className="w-full p-2 mb-4 bg-white text-black border border-black rounded hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-white dark:hover:bg-gray-700" disabled={isLoading}>
          {isLoading ? <Spinner /> : 'Register with Google'}
        </button>
        <p className="text-center mt-4 text-black dark:text-white">
          Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Login here</Link>
        </p>
      </div>
      {isLoading && <p className="mt-4 text-black dark:text-white">Loading...</p>}
    </div>
  );
}