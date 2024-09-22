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
  const [user, setUser] = useState<{ email: string; provider: string } | null>(null);
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Check if the user has already paid
        const { data: userData } = await supabase
          .from('user_profiles')
          .select('has_paid')
          .eq('user_id', session.user.id)
          .single();
        
        if (userData && userData.has_paid) {
          router.push('/dashboard');
          return;
        }

        if (session.user.app_metadata.provider === 'google') {
          setGoogleUser({
            name: session.user.user_metadata.full_name,
            email: session.user.email!,
            picture: session.user.user_metadata.avatar_url
          });
        } else {
          setUser({ 
            email: session.user.email!, 
            provider: session.user.app_metadata.provider || 'email' 
          });
        }
      }
    };

    checkSession();

    // Remove hash from URL if present
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [router]);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: userData } = await supabase
          .from('user_profiles')
          .select('has_paid')
          .eq('user_id', session.user.id)
          .single();
        
        if (userData && userData.has_paid) {
          router.push('/dashboard');
        }
      }
    };

    checkPaymentStatus();
  }, []);

  const handleEmailSignUp = async (e: React.FormEvent) => {
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

      setMessage({ type: 'success', content: 'Sign up successful! Please check your email to verify your account.' });
    } catch (error: any) {
      console.error('Error during sign up:', error);
      setMessage({ type: 'error', content: error.message || 'Sign up failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/checkout`,
          scopes: 'email profile',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Error during Google sign up:', error);
      setMessage({ type: 'error', content: 'Google sign up failed. Please try again.' });
    }
  };

  const handleDisconnect = () => {
    supabase.auth.signOut().then(() => {
      setUser(null);
      setGoogleUser(null);
      setMessage({ type: '', content: '' });
    });
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
      // Payment successful, but we don't need to do anything here
      // as the user will be redirected to the payment confirmation page
    } catch (error: any) {
      setMessage({ type: 'error', content: error.message || 'Payment failed.' });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start justify-center p-4 bg-white dark:bg-gray-900">
      {/* Left Column */}
      <div className="w-full md:w-1/2 max-w-md mb-8 md:mb-0 md:mr-8">
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Sign Up</h2>
        
        {googleUser ? (
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <GoogleAccountInfo user={googleUser} />
            <button 
              onClick={handleDisconnect}
              className="text-blue-600 hover:text-blue-800 text-sm mt-2"
            >
              Choose a different Google account
            </button>
          </div>
        ) : user ? (
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p className="text-black">Signed up with email:</p>
            <p className="font-semibold text-black">{user.email}</p>
            <button 
              onClick={handleDisconnect}
              className="text-blue-600 hover:text-blue-800 text-sm mt-2"
            >
              Choose different email and password
            </button>
          </div>
        ) : (
          <>
            <Button onClick={handleGoogleSignUp} className="w-full mb-4 bg-white text-black border border-gray-300 hover:bg-gray-100">
              Sign Up with Google
            </Button>

            <div className="my-4 text-center text-gray-500">or</div>

            {message.content && (
              <div className={`w-full p-2 mb-4 rounded ${
                message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {message.content}
              </div>
            )}

            <form onSubmit={handleEmailSignUp} className="w-full">
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
              paymentMethodOrder: ['card', 'paypal'],
            }}
          />
          <Button
            type="submit"
            className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={!stripe || isLoading || (!user && !googleUser)}
          >
            {isLoading ? <Spinner /> : 'Pay'}
          </Button>
        </form>
      </div>
    </div>
  );
}