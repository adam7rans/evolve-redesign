'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/lib/supabase';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const _router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    console.log('Attempting to sign up with email:', email);
    const { data, error: signUpError } = await signUp(email, password);

    if (signUpError) {
      console.error('Signup error:', signUpError);
      if (signUpError.message === 'User already exists') {
        setError('This email is already registered. Please try logging in.');
      } else {
        setError(`An error occurred during signup: ${signUpError.message}. Please try again or contact support.`);
      }
    } else if (data && data.user) {
      console.log('Signup initiated:', data.user);
      if (data.user.confirmation_sent_at) {
        setSuccessMessage('Registration successful! Please check your email to confirm your account.');
      } else {
        setSuccessMessage('Registration successful! You can now log in.');
      }
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } else {
      console.error('No user data returned from signUp');
      setError('An unexpected error occurred during signup. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">Register</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      <form onSubmit={handleRegister} className="w-full max-w-md">
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded text-black"
          required
        />
        <button type="submit" className="w-full p-2 mb-4 bg-black text-white dark:bg-white dark:text-black rounded hover:bg-gray-800 dark:hover:bg-gray-200">
          Register
        </button>
      </form>
      <p className="text-center mt-4 text-black dark:text-white">
        Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Login here</Link>
      </p>
    </div>
  );
}