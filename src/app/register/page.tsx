'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import Spinner from '@/components/Spinner';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to checkout with registration method
    router.push(`/checkout?method=email&email=${email}`);
  };

  const handleGoogleRegister = async () => {
    // Redirect to checkout with Google OAuth
    router.push('/checkout?method=google');
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-900">
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