'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Spinner from '@/components/Spinner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', content: '' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', content: '' });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);
    if (error) {
      setMessage({ type: 'error', content: error.message });
    } else {
      setMessage({ type: 'success', content: 'Login successful!' });
      router.push('/dashboard');
    }
  };

  const handleGoogleLogin = async () => {
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
      setMessage({ type: 'error', content: 'Google login failed. Please try again.' });
    } else {
      setMessage({ type: 'success', content: 'Redirecting to Google login...' });
    }
  };

  const handleFacebookLogin = () => {
    // Implement Facebook OAuth login logic here
    console.log('Facebook login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">Login</h1>
      {message.content && (
        <div className={`w-full max-w-md p-2 mb-4 rounded ${
          message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message.content}
        </div>
      )}
      <form onSubmit={handleEmailLogin} className="w-full max-w-md">
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
          {isLoading ? <Spinner /> : 'Log In'}
        </button>
      </form>
      <div className="flex flex-col w-full max-w-md">
        <button onClick={handleGoogleLogin} className="w-full p-2 mb-4 bg-white text-black border border-black rounded hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-white dark:hover:bg-gray-700" disabled={isLoading}>
          {isLoading ? <Spinner /> : 'Login with Google'}
        </button>
        <button onClick={handleFacebookLogin} className="w-full p-2 mb-4 bg-white text-black border border-black rounded hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-white dark:hover:bg-gray-700">
          Login with Facebook
        </button>
        <p className="text-center mt-4 text-black dark:text-white">
          Don&apos;t have an account? <Link href="/register" className="text-blue-500 hover:underline">Register here</Link>
        </p>
      </div>
      {isLoading && <p className="mt-4 text-black dark:text-white">Loading...</p>}
    </div>
  );
}