'use client';

import React from "react";
import Link from "next/link";
import { useTheme } from '@/contexts/ThemeContext';
import FullLogo from '@/components/icons/sourceLogo';
import { useAuth } from '@/contexts/AuthContext';

export function AppHeader() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  return (
    <header className="flex h-24 w-full shrink-0 items-center px-4 md:px-6 bg-white dark:bg-gray-900 text-black dark:text-white">
      <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
        <FullLogo className="max-h-10 w-auto aspect-auto fill-current text-black dark:text-white" />
      </Link>
      <nav className="ml-auto flex items-center gap-6">
        <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">
          Dashboard
        </Link>
        <Link href="/profile" className="text-sm font-medium hover:underline underline-offset-4">
          Profile
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
            {theme === 'dark' ? "🌞" : "🌙"}
          </button>
        </div>
      </nav>
    </header>
  );
}