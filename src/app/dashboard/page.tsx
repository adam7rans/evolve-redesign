'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function DashboardPage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkUserAndWelcome = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const welcome = searchParams?.get('welcome');
      if (welcome === 'true') {
        setShowWelcome(true);
        // Remove the welcome parameter from the URL
        router.replace('/dashboard');
      }
    };

    checkUserAndWelcome();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4">
      {showWelcome && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
          <p className="font-bold">Welcome to your dashboard!</p>
          <p>You've successfully registered, confirmed your email, and purchased a subscription.</p>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Dashboard</h1>
      {/* Add your dashboard content here */}
    </div>
  );
}