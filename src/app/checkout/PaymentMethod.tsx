'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { User } from '@supabase/supabase-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentMethodProps {
  user: User | null;
  clientSecret: string | null;
  selectedPlan: {
    priceId: string;
    interval: 'month' | 'year';
    name: string;
    price: number;
  } | null;
}

function PaymentMethodContent({ user, selectedPlan }: PaymentMethodProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
      },
    });

    if (stripeError) {
      setError(stripeError.message || 'An unexpected error occurred.');
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!stripe || processing}>
        {processing ? 'Processing...' : 'Pay now'}
      </button>
      {error && <div>{error}</div>}
    </form>
  );
}

export default function PaymentMethod({ user, clientSecret, selectedPlan }: PaymentMethodProps) {
  if (!user) {
    return <div>Please sign in to continue with payment.</div>;
  }

  if (!clientSecret) {
    return <div>Loading payment method...</div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentMethodContent user={user} clientSecret={clientSecret} selectedPlan={selectedPlan} />
    </Elements>
  );
}