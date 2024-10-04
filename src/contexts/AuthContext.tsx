'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

// Define the shape of our authentication context
interface AuthContextType {
  user: User | null;
  hasPaid: boolean | null;
  signOut: () => Promise<void>;
  checkPaymentStatus: (userId: string) => Promise<boolean>;
}

// Create the AuthContext with a default value
// This context will be used to share authentication state across components
export const AuthContext = createContext<AuthContextType>({
  user: null,
  hasPaid: null,
  signOut: async () => {},
  checkPaymentStatus: async () => false,
});

// AuthProvider component to wrap the app and provide authentication context
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // State to hold user and payment status
  const [user, setUser] = useState<User | null>(null);
  const [hasPaid, setHasPaid] = useState<boolean | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Function to check user session and payment status
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const paymentStatus = await checkPaymentStatus(session.user.id);
        setUser(session.user);
        setHasPaid(paymentStatus);
      } else {
        setUser(null);
        setHasPaid(false);
      }
    };

    checkUser();

    // Set up listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const paymentStatus = await checkPaymentStatus(session.user.id);
        setUser(session.user);
        setHasPaid(paymentStatus);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setHasPaid(false);
        router.push('/login');
      }
    });

    // Cleanup function to unsubscribe from auth listener
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, router]);

  // Function to handle user sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setHasPaid(null);
    router.push('/'); 
  };

  // Function to check user's payment status
  const checkPaymentStatus = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('has_paid')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error checking payment status:', error);
      return false;
    }
    
    return data?.has_paid ?? false;
  };

  // Provide the authentication context to child components
  return (
    <AuthContext.Provider value={{ user, hasPaid, signOut, checkPaymentStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}