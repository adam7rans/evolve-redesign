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

async function updateUserPaymentStatus(userId: string) {
  console.log('Updating user payment status for:', userId);
  const response = await fetch('/api/update-payment-status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    console.error('Failed to update payment status:', response.status, response.statusText);
    throw new Error('Failed to update payment status');
  }
  console.log('User payment status updated successfully');
}

function PaymentMethodContent({ user, selectedPlan }: PaymentMethodProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Payment submission started');

    if (!stripe || !elements || !user || !selectedPlan) {
      console.log('Missing required data:', { stripe, elements, user, selectedPlan });
      return;
    }

    setProcessing(true);

    try {
      console.log('Submitting payment details');
      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error('Submit error:', submitError);
        throw submitError;
      }

      console.log('Creating payment intent');
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          amount: selectedPlan.price * 100,
        }),
      });

      const { clientSecret } = await response.json();
      console.log('Client secret received:', !!clientSecret);

      if (!clientSecret) {
        throw new Error('Failed to create PaymentIntent');
      }

      console.log('Confirming payment');
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard?payment_success=true`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        console.error('Confirm error:', confirmError);
        throw confirmError;
      }

      console.log('Payment intent status:', paymentIntent.status);
      if (paymentIntent.status === 'succeeded') {
        console.log('Updating user payment status');
        await updateUserPaymentStatus(user.id);
        window.location.href = '/dashboard?payment_success=true';
      } else {
        throw new Error('Payment not successful');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
      setProcessing(false);
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
  const [stripeElement, setStripeElement] = useState<JSX.Element | null>(null);

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
              amount: selectedPlan.price * 100, // Convert to cents
            }),
          });
          if (!response.ok) {
            throw new Error('Failed to fetch client secret');
          }
          const data = await response.json();
          setClientSecret(data.clientSecret);
        } catch (error) {
          console.error('Error fetching client secret:', error);
        }
      }
    };

    fetchClientSecret();
  }, [user, selectedPlan]);

  useEffect(() => {
    if (clientSecret) {
      setStripeElement(
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentMethodContent user={user} selectedPlan={selectedPlan} />
        </Elements>
      );
    }
  }, [clientSecret, user, selectedPlan]);

  if (!user) {
    return <div>Please sign in to continue with payment.</div>;
  }

  if (!clientSecret) {
    return <div>Loading payment method...</div>;
  }

  return stripeElement ? stripeElement : <div>Loading payment method...</div>;
}