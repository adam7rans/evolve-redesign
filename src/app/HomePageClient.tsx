'use client';

import { useState } from 'react';
import PlanSelection from './checkout/PlanSelection';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { setCookie } from 'cookies-next';

interface PlanPrice {
  id: string;
  interval: 'month' | 'year';
  unit_amount: number;
}

interface Plan {
  id: string;
  name: string;
  prices: PlanPrice[];
  features: string[];
}

interface HomePageClientProps {
  plans: Plan[];
  initialSelectedPlan: { priceId: string; interval: 'month' | 'year' } | null;
}

export default function HomePageClient({ plans, initialSelectedPlan }: HomePageClientProps) {
  const [selectedPlan, setSelectedPlan] = useState(initialSelectedPlan);
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSelectPlan = (priceId: string, interval: 'month' | 'year') => {
    setSelectedPlan({ priceId, interval });
    const selectedPlan = plans.find(plan => plan.prices.some(price => price.id === priceId));
    if (selectedPlan) {
      const price = selectedPlan.prices.find(p => p.id === priceId);
      if (price) {
        const planData = {
          priceId,
          interval,
          name: selectedPlan.name,
          price: price.unit_amount / 100
        };
        setCookie('selectedPlan', JSON.stringify(planData), { path: '/', maxAge: 604800 }); // expires in 7 days
        
        // Trigger a storage event to notify other components
        window.dispatchEvent(new Event('storage'));
        
        router.push('/checkout?step=signup');
      } else {
        console.error('Selected price not found');
        // Handle the case where the price is not found
      }
    } else {
      console.error('Selected plan not found');
      // Handle the case where the plan is not found
    }
  };

  const handleEarlyAccessSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to save email for early access
    console.log('Early access sign up for:', email);
    // Reset email field after submission
    setEmail('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-start">
        <div className="min-h-[300px] w-full"></div>
        <h1 className="text-6xl font-normal text-black dark:text-white mb-8 max-w-xl mx-auto text-center ">Your personal magickal apprentice</h1>
        <h2 className="text-2xl font-thin text-black dark:text-white mb-8 max-w-xl mx-auto text-center">A set of tools that help you to work with the forces of the universe to create the life you want</h2>
        
        <div className="w-full max-w-md mb-32">
          <form onSubmit={handleEarlyAccessSignUp} className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email for early access"
              className="flex-grow px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              required
            />
            <Button type="submit">Get Early Access</Button>
          </form>
        </div>

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
