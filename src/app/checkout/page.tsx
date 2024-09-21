'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from '@/components/Spinner';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import GoogleAccountInfo from '@/components/GoogleAccountInfo';
import { PaymentRequestButtonElement } from '@stripe/react-stripe-js';

// Define the GoogleUser interface
interface GoogleUser {
  name: string;
  email: string;
  picture: string;
}

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        setClientSecret(data.clientSecret);
      })
      .catch((err) => {
        console.error("Error:", err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!clientSecret) {
    return <div>Loading...</div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  );
}

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const supabase = createClientComponentClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const [confirmedUser, setConfirmedUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    if (searchParams) {
      const googleData = searchParams.get('googleData');
      const error = searchParams.get('error');
      if (googleData) {
        try {
          const parsedData = JSON.parse(decodeURIComponent(googleData));
          setGoogleUser(parsedData);
        } catch (error) {
          console.error('Error parsing Google user data:', error);
          setMessage({ type: 'error', content: 'Error processing Google account information.' });
        }
      } else if (error) {
        setMessage({ type: 'error', content: 'Google sign-in was cancelled or failed. Please try again.' });
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setConfirmedUser({ email: session.user.email! });
      }
    };

    checkSession();
  }, []);

  const handleEmailRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setMessage({ type: 'success', content: 'Registration successful! Please check your email to verify your account.' });
      setConfirmedUser({ email });
    } catch (error: any) {
      console.error('Error during registration:', error);
      setMessage({ type: 'error', content: error.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegistration = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'email profile',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Error during Google sign-in:', error);
      setMessage({ type: 'error', content: 'Google sign-in failed. Please try again.' });
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsLoading(true);
    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-confirmation`,
        },
      });

      if (result.error) {
        throw result.error;
      }
    } catch (error: any) {
      setMessage({ type: 'error', content: error.message || 'Payment failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start justify-center p-4 bg-white dark:bg-gray-900">
      {message.content && (
        <div className={`w-full max-w-md p-2 mb-4 rounded ${
          message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message.content}
        </div>
      )}
      
      {/* Left Column */}
      <div className="w-full md:w-1/2 max-w-md mb-8 md:mb-0 md:mr-8">
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Sign Up</h2>
        
        {googleUser ? (
          <GoogleAccountInfo user={googleUser} />
        ) : confirmedUser ? (
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-black">Signed up with email:</p>
            <p className="font-semibold text-black">{confirmedUser.email}</p>
          </div>
        ) : (
          <>
            <Button onClick={handleGoogleRegistration} className="w-full mb-4 bg-white text-black border border-gray-300 hover:bg-gray-100">
              Connect with Google
            </Button>

            <div className="my-4 text-center text-gray-500">or</div>

            <form onSubmit={handleEmailRegistration} className="w-full">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mb-4 border rounded text-black"
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mb-4 border rounded text-black"
                required
              />
              <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                {isLoading ? <Spinner /> : 'Sign Up with Email'}
              </Button>
            </form>
          </>
        )}
      </div>

      {/* Right Column */}
      <div className="w-full md:w-1/2 max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Payment</h2>
        <form onSubmit={handlePayment} className="w-full">
          <PaymentElement 
            className="mb-4"
            options={{
              paymentMethodOrder: ['paypal', 'card', 'link'],
            }}
          />
          <Button
            type="submit"
            className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={!stripe || isLoading || (!googleUser && !confirmedUser)}
          >
            {isLoading ? <Spinner /> : 'Pay'}
          </Button>
        </form>
      </div>
    </div>
  );
}