'use client';  // Add this line at the top of the file

import React from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import FullLogo from '@/components/icons/sourceLogo';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

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
          <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
            {theme === 'dark' ? "🌞" : "🌙"}
          </button>
          <button 
            onClick={handleLogin} 
            className="px-4 py-2 rounded bg-transparent text-black border border-black hover:bg-black hover:text-white dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black transition-colors"
          >
            Log In
          </button>
          <button className="px-4 py-2 rounded bg-black text-white dark:bg-white dark:text-black">
            Sign Up
          </button>
        </div>
      </nav>
    </header>
  );
}
