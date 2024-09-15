'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement email/password login logic here
    console.log('Email login:', email, password);
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
      </div>
    </div>
  );
}