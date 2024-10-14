'use client';

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { getCookie, deleteCookie } from 'cookies-next';

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
    const fetchPlanData = () => {
      const cookiePlan = getCookie('selectedPlan');
      if (cookiePlan) {
        try {
          const parsedPlan = JSON.parse(cookiePlan as string);
          setPlanData(parsedPlan);
        } catch (error) {
          console.error('Error parsing selectedPlan cookie:', error);
        }
      }
    };

    fetchPlanData();

    // Add an event listener for storage changes
    window.addEventListener('storage', fetchPlanData);

    return () => {
      window.removeEventListener('storage', fetchPlanData);
    };
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
    <div className="bg-slate-800 text-white p-4 rounded-lg w-full flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h3 className="text-lg font-semibold">{planData.name}</h3>
        <p>{planData.interval === 'month' ? 'Monthly' : 'Yearly'}</p>
        <p className="text-lg font-bold">${planData.price} per {planData.interval}</p>
      </div>
      <Button
        onClick={handleChangePlan}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Change Plan
      </Button>
    </div>
  );
}
