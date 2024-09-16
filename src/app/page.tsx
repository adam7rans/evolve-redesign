'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    console.log('Home page loaded');
    const hash = window.location.hash;
    console.log('Current hash:', hash);
    if (hash && hash.includes('access_token')) {
      console.log('Access token found, redirecting to /auth/confirm');
      router.push(`/auth/confirm${hash}`);
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <p className="text-black dark:text-white">Welcome to our application!</p>
    </div>
  );
}
