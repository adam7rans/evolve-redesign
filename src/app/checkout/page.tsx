'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CheckoutClient from './CheckoutClient';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState('plan');

  useEffect(() => {
    const currentStep = searchParams.get('step');
    if (currentStep && ['plan', 'signup', 'payment'].includes(currentStep)) {
      setStep(currentStep);
    } else {
      router.push('/checkout?step=plan');
    }
  }, [searchParams, router]);

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4 text-center">Checkout</h1>
      <CheckoutClient currentStep={step} />
    </div>
  );
}