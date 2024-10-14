'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { User } from '@supabase/supabase-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentMethodProps {
  user: User | null;
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
      redirect: 'if_required',
    });

    if (stripeError) {
      setError(stripeError.message || 'An unexpected error occurred.');
      setProcessing(false);
    } else {
      // Payment succeeded, redirect to dashboard
      window.location.href = `${window.location.origin}/dashboard`;
    }
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

export default function PaymentMethod({ user, selectedPlan }: PaymentMethodProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      if (user && selectedPlan) {
        try {
          const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              priceId: selectedPlan.priceId,
            }),
          });
          const data = await response.json();
          setClientSecret(data.clientSecret);
        } catch (error) {
          console.error('Error fetching client secret:', error);
        }
      }
    };

    fetchClientSecret();
  }, [user, selectedPlan]);

  if (!user) {
    return <div>Please sign in to continue with payment.</div>;
  }

  if (!clientSecret) {
    return <div>Loading payment method...</div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentMethodContent user={user} selectedPlan={selectedPlan} />
    </Elements>
  );
}
