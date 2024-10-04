'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"; 
import { setCookie, getCookie } from 'cookies-next';
import { usePathname, useSearchParams } from 'next/navigation';

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

interface PlanSelectionProps {
  plans: Plan[];
  selectedPlan: string | null;
  billingInterval: 'month' | 'year';
  onSelectPlan: (planId: string, interval: 'month' | 'year') => void;
}

export default function PlanSelection({ plans, selectedPlan: initialSelectedPlan, billingInterval: initialBillingInterval, onSelectPlan }: PlanSelectionProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [selectedPlanState, setSelectedPlanState] = useState<string | null>(initialSelectedPlan);
  const [billingIntervalState, setBillingIntervalState] = useState<'month' | 'year'>(initialBillingInterval);
  const [isYearly, setIsYearly] = useState(initialBillingInterval === 'year');

  useEffect(() => {
    const handleRouteChange = () => {
      const cookiePlanId = getCookie('selectedPlanId') as string | undefined;
      const cookieInterval = getCookie('selectedInterval') as 'month' | 'year' | undefined;

      if (cookiePlanId) {
        setSelectedPlanState(cookiePlanId);
      }
      if (cookieInterval) {
        setBillingIntervalState(cookieInterval);
        setIsYearly(cookieInterval === 'year');
      }
    };

    // Call the function once on mount and whenever the route changes
    handleRouteChange();
  }, [pathname, searchParams]);

  useEffect(() => {
    setIsYearly(billingIntervalState === 'year');
  }, [billingIntervalState]);

  const handleIntervalChange = (checked: boolean) => {
    setIsYearly(checked);
    const newInterval = checked ? 'year' : 'month';
    setBillingIntervalState(newInterval);
    
    // Find the current plan and update its interval
    const currentPlan = plans.find(p => p.prices.some(price => price.id === selectedPlanState));
    if (currentPlan) {
      const newPrice = currentPlan.prices.find(p => p.interval === newInterval);
      if (newPrice) {
        onSelectPlan(newPrice.id, newInterval);
      }
    }
  };

  const handleSelectPlan = (priceId: string, interval: 'month' | 'year') => {
    // Set the cookie
    setCookie('selectedPlanId', priceId);
    setCookie('selectedInterval', interval);

    // Wait for a short time to ensure the cookie is set
    setTimeout(() => {
      onSelectPlan(priceId, interval);
      window.location.href = '/checkout/signup';
    }, 100);
  };

  console.log('PlanSelection plans:', plans);
  console.log('PlanSelection selectedPlan:', selectedPlanState);

  return (
    <div>
      <div className="flex justify-center items-center space-x-4 mb-8">
        <Button
          onClick={() => handleIntervalChange(false)}
          variant={isYearly ? "outline" : "default"}
          className={`w-32 ${!isYearly ? 'bg-blue-500 text-white' : ''}`}
        >
          Monthly
        </Button>
        <Button
          onClick={() => handleIntervalChange(true)}
          variant={isYearly ? "default" : "outline"}
          className={`w-32 ${isYearly ? 'bg-blue-500 text-white' : ''}`}
        >
          Yearly
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.length === 0 ? (
          <p>No plans available</p>
        ) : (
          plans.map((plan) => {
            console.log('Rendering plan:', plan);
            const price = plan.prices.find(p => p.interval === (isYearly ? 'year' : 'month'));
            if (!price) {
              console.log('No price found for interval:', (isYearly ? 'year' : 'month'));
              return null;
            }
            const isSelected = selectedPlanState === price.id;
            return (
              <div 
                key={plan.id} 
                className={`border rounded-lg p-4 transition-all duration-300 ${
                  isSelected 
                    ? 'border-blue-500 bg-slate-800 text-white' 
                    : 'border-gray-700 hover:border-blue-500 bg-slate-900'
                }`}
              >
                <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                <p className="text-2xl font-bold mb-4">${price.unit_amount / 100}/{(isYearly ? 'year' : 'month')}</p>
                <ul className="mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center mb-2">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSelectPlan(price.id, price.interval)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Subscribe
                </Button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}