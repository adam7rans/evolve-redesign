'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import CodexLogo from '@/components/icons/CodexLogo';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ThemeToggle } from '@/components/ThemeToggle';

export function LaunchHeader() {
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

  if (user && hasPaid) {
    return null;
  }

  if (!mounted) {
    return <header className="h-24 w-full"></header>;
  }

  return (
    <header className="flex h-24 w-full shrink-0 items-center px-4 md:px-24 text-black dark:text-white">
      <nav className="flex items-center gap-6">
        <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
          Features
        </Link>
        <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
          Pricing
        </Link>
        <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
          About
        </Link>
      </nav>
      <div className="flex-grow flex justify-center">
        <Link href="/" className="flex items-center space-x-2">
          <CodexLogo className="max-h-10 w-auto aspect-auto fill-current text-black dark:text-white" />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
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
    </header>
  );
}