'use client';

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

interface SelectedPlanData {
  priceId: string;
  interval: 'month' | 'year';
  name: string;
  price: number;
}

interface SelectedPlanProps {
  onChangePlan: () => void;
}

export default function SelectedPlan({ onChangePlan }: SelectedPlanProps) {
  const router = useRouter();
  const [planData, setPlanData] = useState<SelectedPlanData | null>(null);

  useEffect(() => {
    const cookiePlan = getCookie('selectedPlan');
    if (cookiePlan) {
      try {
        const parsedPlan = JSON.parse(cookiePlan as string);
        setPlanData(parsedPlan);
      } catch (error) {
        console.error('Error parsing selectedPlan cookie:', error);
      }
    }
  }, []);

  const handleChangePlan = () => {
    // Delete the selectedPlan cookie
    deleteCookie('selectedPlan');
    
    // Clear the planData state
    setPlanData(null);

    // Call the onChangePlan prop
    onChangePlan();

    // Redirect to the plan selection page with a reset parameter
    router.push('/checkout?step=plan&reset=true');
  };

  if (!planData) {
    return null; // or a loading state
  }

  return (
    <div className="bg-slate-800 text-white p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">{planData.name}</h3>
      <p className="mb-2">{planData.interval === 'month' ? 'Monthly' : 'Yearly'} Plan</p>
      <p className="text-2xl font-bold mb-4">${planData.price} per {planData.interval}</p>
      <Button
        onClick={handleChangePlan}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        Change Plan
      </Button>
    </div>
  );
}