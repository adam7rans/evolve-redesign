'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from "@/components/ui/button";

export default function PaymentConfirmationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log('Session found:', session.user.id);
        // Mark the user as having paid
        const { data, error } = await supabase
          .from('user_profiles')
          .upsert({ user_id: session.user.id, has_paid: true })
          .select();

        if (error) {
          console.error('Error updating user profile:', error);
        } else {
          console.log('User profile updated:', data);
        }
        setIsLoading(false);
      } else {
        console.log('No session found, redirecting to login');
        router.push('/login');
      }
    };

    checkSession();
  }, [router]);

  const handleGoToDashboard = () => {
    router.push('/dashboard?welcome=true');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Payment Successful</h1>
        <p className="mb-4 text-gray-600 dark:text-gray-400">Your payment was successful! A receipt has been sent to your email address.</p>
        <Button onClick={handleGoToDashboard}>Go to Dashboard</Button>
      </div>
    </div>
  );
}