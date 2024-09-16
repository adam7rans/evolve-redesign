'use client';  // Add this line at the top of the file

import React from "react";
import Link from "next/link";
import { useTheme } from '@/contexts/ThemeContext';
import FullLogo from '@/components/icons/sourceLogo';
import { useAuth } from '@/contexts/AuthContext'; // We'll need to create this context

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth(); // Get the user from the AuthContext

  return (
    <header className="flex h-24 w-full shrink-0 items-center px-4 md:px-6 bg-white dark:bg-gray-900 text-black dark:text-white">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <FullLogo className="max-h-10 w-auto aspect-auto fill-current text-black dark:text-white" />
      </Link>
      {!user && (
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
            <Link href="/login" className="px-4 py-2 rounded bg-transparent text-black border border-black hover:bg-black hover:text-white dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black transition-colors">
              Log In
            </Link>
            <Link href="/register" className="px-4 py-2 rounded bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
              Sign Up
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
