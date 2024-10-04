'use client';

import { useState } from 'react';
import PlanSelection from './checkout/plan-selection';
import { useRouter } from 'next/navigation';

interface HomePageClientProps {
  plans: any[]; // You might want to define a more specific type here
  initialSelectedPlan: { priceId: string, interval: 'month' | 'year' } | null;
}

export default function HomePageClient({ plans, initialSelectedPlan }: HomePageClientProps) {
  const [selectedPlan, setSelectedPlan] = useState(initialSelectedPlan);
  const router = useRouter();

  const handleSelectPlan = (priceId: string, interval: 'month' | 'year') => {
    setSelectedPlan({ priceId, interval });
    // Set the cookie
    document.cookie = `selectedPlan=${JSON.stringify({ priceId, interval })}; path=/; max-age=604800`; // expires in 7 days
    router.push('/checkout/signup');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-8">Your personal magickal apprentice</h1>
        <h2 className="text-2xl font-thin text-black dark:text-white mb-8">A set of tools that help you to work with the forces of the universe to create the life you want</h2>
        <PlanSelection 
          plans={plans} 
          selectedPlan={selectedPlan?.priceId || null} 
          billingInterval={selectedPlan?.interval || 'month'}
          onSelectPlan={handleSelectPlan}
        />
      </main>
    </div>
  );
}
