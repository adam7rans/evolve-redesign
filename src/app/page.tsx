'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MarketingHeader } from '@/components/MarketingHeader';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/dashboard');
      }
    };

    checkUser();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <MarketingHeader />
      <main className="flex-grow flex items-center justify-center">
        <h1 className="text-4xl font-bold text-black dark:text-white">Welcome to Our App</h1>
        {/* Add more content for your landing page here */}
      </main>
    </div>
  );
}
