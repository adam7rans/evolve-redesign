'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ProgressBar from '../progress-bar';
import GoogleAccountInfo from '../GoogleAccountInfo';
import PaymentMethod from './payment-method';

export default function PaymentPage() {
  const [user, setUser] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  const selectedPlanId = searchParams.get('planId') || '';
  const interval = searchParams.get('interval') || '';

  console.log('PaymentPage: selectedPlanId:', selectedPlanId);
  console.log('PaymentPage: interval:', interval);

  useEffect(() => {
    console.log('PaymentPage useEffect - Initial render');
    
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('PaymentPage fetchUser - User data:', user);
      if (user) {
        setUser(user);
      } else {
        console.log('PaymentPage fetchUser - No user, redirecting to login');
        router.push('/login');
      }
    };

    const fetchClientSecret = async () => {
      console.log('PaymentPage fetchClientSecret - Params:', { selectedPlanId, interval });
      if (selectedPlanId && interval) {
        // TODO: Implement API call to fetch client secret using selectedPlanId and interval
        console.log('Fetching client secret for:', { selectedPlanId, interval });
        // setClientSecret(response.clientSecret);
      } else {
        console.error('Missing planId or interval');
        console.log('PaymentPage fetchClientSecret - Redirecting to checkout');
        router.push('/checkout');
      }
    };

    fetchUser();
    fetchClientSecret();
  }, [router, supabase, selectedPlanId, interval]);

  const handleChooseAnotherAccount = () => {
    router.push('/login');
  };

  if (!selectedPlanId || !interval) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <ProgressBar />
        
        <div className="mt-8 space-y-8">
          {user && (
            <GoogleAccountInfo 
              user={{
                name: user.user_metadata?.full_name || 'User',
                email: user.email || '',
                picture: user.user_metadata?.avatar_url || ''
              }}
              onChooseAnotherAccount={handleChooseAnotherAccount}
            />
          )}

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Selected Plan</h2>
            <p>Plan ID: {selectedPlanId}</p>
            <p>Interval: {interval}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
            <PaymentMethod 
              user={user}
              clientSecret={clientSecret}
              selectedPlanId={selectedPlanId}
            />
          </div>
        </div>
      </main>
    </div>
  );
}