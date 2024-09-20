'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function DashboardPageContent() {
  const [showWelcome, setShowWelcome] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const welcome = searchParams.get('welcome');
    if (welcome === 'true') {
      setShowWelcome(true);
      router.replace('/dashboard');
    }

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      }
    };

    checkUser();

    // Remove hash from URL without reloading
    if (window.location.hash) {
      router.replace('/dashboard');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4">
      {showWelcome && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
          <p className="font-bold">Welcome!</p>
          <p>You've successfully registered and confirmed your email.</p>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Dashboard</h1>
      {/* Add your dashboard content here */}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardPageContent />
    </Suspense>
  );
}