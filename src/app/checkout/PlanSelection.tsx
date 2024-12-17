'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

// Define interfaces for the component's props and data structures
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

// Main component for plan selection
export default function PlanSelection({ plans, selectedPlan: initialSelectedPlan, billingInterval: initialBillingInterval, onSelectPlan }: PlanSelectionProps) {
  // Hooks for handling routing and navigation
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // State management for selected plan, billing interval, and yearly toggle
  const [selectedPlanState, setSelectedPlanState] = useState<string | null>(initialSelectedPlan);
  const [billingIntervalState, setBillingIntervalState] = useState<'month' | 'year'>(initialBillingInterval);
  const [isYearly, setIsYearly] = useState(initialBillingInterval === 'year');
  const [cookiePlanExists, setCookiePlanExists] = useState(false);
  const [selectedPlanFromCookie, setSelectedPlanFromCookie] = useState<string | null>(null);

  // Effect to handle route changes and update state from cookies
  useEffect(() => {
    const reset = searchParams.get('reset');
    if (reset === 'true') {
      // Reset all states
      setSelectedPlanState(null);
      setBillingIntervalState('month');
      setIsYearly(false);
      setCookiePlanExists(false);
      setSelectedPlanFromCookie(null);
      
      // Remove the reset parameter from the URL
      router.replace('/checkout?step=plan');
    } else {
      // Existing logic to load from cookie
      const cookiePlan = getCookie('selectedPlan');
      if (cookiePlan) {
        setCookiePlanExists(true);
        try {
          const parsedPlan = JSON.parse(cookiePlan as string);
          setSelectedPlanState(parsedPlan.priceId);
          setSelectedPlanFromCookie(parsedPlan.priceId);
          setBillingIntervalState(parsedPlan.interval);
          setIsYearly(parsedPlan.interval === 'year');
        } catch (error) {
          console.error('Error parsing selectedPlan cookie:', error);
        }
      } else {
        setCookiePlanExists(false);
        setSelectedPlanFromCookie(null);
      }
    }
  }, [pathname, searchParams, router]);

  // Effect to sync isYearly state with billingIntervalState
  useEffect(() => {
    setIsYearly(billingIntervalState === 'year');
  }, [billingIntervalState]);

  // Handler for changing billing interval
  const handleIntervalChange = (checked: boolean) => {
    setIsYearly(checked);
    const newInterval = checked ? 'year' : 'month';
    setBillingIntervalState(newInterval);
    setCookie('selectedInterval', newInterval);
  };

  // Handler for selecting a plan
  const handleSelectPlan = (planId: string, interval: 'month' | 'year') => {
    setSelectedPlanState(planId);
    setBillingIntervalState(interval);
    const selectedPlan = plans.find(plan => plan.prices.some(price => price.id === planId));
    if (selectedPlan) {
      const price = selectedPlan.prices.find(p => p.id === planId);
      setCookie('selectedPlan', JSON.stringify({
        priceId: planId,
        interval: interval,
        name: selectedPlan.name,
        price: price ? price.unit_amount / 100 : 0
      }));
      onSelectPlan(planId, interval);
      router.push('/checkout?step=signup');
    }
  };

  // Debugging logs
  // console.log('PlanSelection plans:', plans);
  // console.log('PlanSelection selectedPlan:', selectedPlanState);

  const getButtonLabel = (isSelected: boolean) => {
    if (!cookiePlanExists) return "Subscribe";
    return isSelected ? "Selected" : "Select";
  };

  return (
    <div>
      {/* Billing interval toggle buttons */}
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
      {/* Plan cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.length === 0 ? (
          <p>No plans available</p>
        ) : (
          plans.map((plan) => {
            const price = plan.prices.find(p => p.interval === (isYearly ? 'year' : 'month'));
            if (!price) {
              return null;
            }
            const isSelected = selectedPlanState === price.id || selectedPlanFromCookie === price.id;
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
                  className={`w-full ${
                    isSelected 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                  disabled={isSelected && cookiePlanExists}
                >
                  {getButtonLabel(isSelected)}
                </Button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
