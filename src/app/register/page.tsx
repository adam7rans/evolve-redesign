'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import Spinner from '@/components/Spinner';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', content: '' });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      setMessage({ type: 'success', content: 'Registration successful! Please check your email to verify your account.' });
    } catch (error: any) {
      console.error('Error during registration:', error);
      setMessage({ type: 'error', content: error.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    signIn('google', { callbackUrl: '/dashboard' });
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
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded text-black"
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded text-black"
          required
        />
        <Button type="submit" className="w-full p-2 mb-4 bg-black text-white dark:bg-white dark:text-black rounded hover:bg-gray-800 dark:hover:bg-gray-200" disabled={isLoading}>
          {isLoading ? <Spinner /> : 'Register with Email'}
        </Button>
      </form>

      <div className="flex flex-col w-full max-w-md">
        <Button onClick={handleGoogleRegister} className="w-full p-2 mb-4 bg-white text-black border border-black rounded hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-white dark:hover:bg-gray-700" disabled={isLoading}>
          {isLoading ? <Spinner /> : 'Register with Google'}
        </Button>
        
        <p className="text-center mt-4 text-black dark:text-white">
          Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Login here</Link>
        </p>
      </div>
      
      {isLoading && <p className="mt-4 text-black dark:text-white">Loading...</p>}
    </div>
  );
}