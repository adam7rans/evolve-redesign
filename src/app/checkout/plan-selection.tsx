'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"; 
import { useRouter } from 'next/navigation';

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

export default function PlanSelection({ plans, selectedPlan, billingInterval, onSelectPlan }: PlanSelectionProps) {
  const [isYearly, setIsYearly] = useState(billingInterval === 'year');
  const router = useRouter();

  useEffect(() => {
    setIsYearly(billingInterval === 'year');
  }, [billingInterval]);

  const handleIntervalChange = (checked: boolean) => {
    setIsYearly(checked);
    if (selectedPlan) {
      const selectedPlanDetails = plans.find(p => p.prices.some(price => price.id === selectedPlan));
      if (selectedPlanDetails) {
        const newPrice = selectedPlanDetails.prices.find(p => p.interval === (checked ? 'year' : 'month'));
        if (newPrice) {
          onSelectPlan(newPrice.id, newPrice.interval);
        }
      }
    }
  };

  console.log('PlanSelection plans:', plans);
  console.log('PlanSelection selectedPlan:', selectedPlan);

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
            const isSelected = selectedPlan === price.id;
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
                  onClick={() => {
                    onSelectPlan(price.id, price.interval);
                    router.push(`/checkout/signup?planId=${price.id}&interval=${price.interval}`);
                  }}
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