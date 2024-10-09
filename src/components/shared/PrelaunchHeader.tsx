'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import CodexLogo from '@/components/icons/CodexLogo';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ThemeToggle } from '@/components/ThemeToggle';

export function PrelaunchHeader() {
  const [user, setUser] = useState<any>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
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

  const handleEarlyAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the early access request
    console.log('Early access requested for:', email);
    // You might want to send this to your backend or handle it accordingly
  };

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
        <form onSubmit={handleEarlyAccess} className="flex items-center gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="px-3 py-2 rounded bg-transparent text-black border border-black dark:text-white dark:border-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Early Access
          </button>
        </form>
      </div>
    </header>
  );
}
