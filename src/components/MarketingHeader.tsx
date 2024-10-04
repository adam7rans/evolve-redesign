'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import FullLogo from '@/components/icons/sourceLogo';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function MarketingHeader() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  useEffect(() => {
    setMounted(true);
    const checkUserAndPaymentStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('has_paid')
          .eq('user_id', user.id)
          .single();
        setHasPaid(profile?.has_paid || false);
      }
    };

    checkUserAndPaymentStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('has_paid')
          .eq('user_id', session.user.id)
          .single();
        setHasPaid(profile?.has_paid || false);
      } else {
        setHasPaid(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const isCheckoutPage = pathname === '/checkout';

  // If user has paid, don't render the marketing header
  if (user && hasPaid) {
    return null;
  }

  const handleToggleTheme = () => {
    toggleTheme();
  };

  // Render a placeholder or loading state while mounting
  if (!mounted) {
    return <header className="h-24 w-full bg-white dark:bg-gray-900"></header>;
  }

  return (
    <header className="flex h-24 w-full shrink-0 items-center px-4 md:px-6 bg-white dark:bg-gray-900 text-black dark:text-white">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <FullLogo className="max-h-10 w-auto aspect-auto fill-current text-black dark:text-white" />
      </Link>
      <nav className="ml-auto hidden items-center gap-6 lg:flex">
        <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
          Features
        </Link>
        <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
          Pricing
        </Link>
        <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
          About
        </Link>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleToggleTheme} 
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
          >
            {resolvedTheme === 'dark' ? "🌞" : "🌙"}
          </button>
          {isCheckoutPage ? (
            <Link href="/login" className="px-4 py-2 rounded bg-transparent text-black border border-black hover:bg-black hover:text-white dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black transition-colors">
              Log In
            </Link>
          ) : (
            <>
              {!user && (
                <>
                  <Link href="/login" className="px-4 py-2 rounded bg-transparent text-black border border-black hover:bg-black hover:text-white dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black transition-colors">
                    Log In
                  </Link>
                  <Link href="/checkout" className="px-4 py-2 rounded bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                    Sign Up
                  </Link>
                </>
              )}
              {user && !hasPaid && (
                <Link href="/checkout" className="px-4 py-2 rounded bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                  Complete Sign Up
                </Link>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}