'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('Login error:', error.message);
    } else {
      console.log('Logged in:', data);
      router.push('/dashboard'); // Redirect to dashboard or home page
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google OAuth login logic here
    console.log('Google login');
  };

  const handleFacebookLogin = () => {
    // Implement Facebook OAuth login logic here
    console.log('Facebook login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">Login</h1>
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
        <button type="submit" className="w-full p-2 mb-4 bg-black text-white dark:bg-white dark:text-black rounded hover:bg-gray-800 dark:hover:bg-gray-200">
          Log In
        </button>
      </form>
      <div className="flex flex-col w-full max-w-md">
        <button onClick={handleGoogleLogin} className="w-full p-2 mb-4 bg-white text-black border border-black rounded hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-white dark:hover:bg-gray-700">
          Login with Google
        </button>
        <button onClick={handleFacebookLogin} className="w-full p-2 mb-4 bg-white text-black border border-black rounded hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-white dark:hover:bg-gray-700">
          Login with Facebook
        </button>
        <p className="text-center mt-4 text-black dark:text-white">
          Don&apos;t have an account? <Link href="/register" className="text-blue-500 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}