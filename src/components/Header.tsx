'use client';  // Add this line at the top of the file

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <header className="flex h-24 w-full shrink-0 items-center px-4 md:px-6 bg-white dark:bg-gray-900 text-black dark:text-white">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Image
          src="/icons/logo.svg"
          alt="Companion Logo"
          width={32}
          height={32}
          className="rounded-full dark:invert"
        />
        <span className="text-xl font-medium">Companion</span>
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
          <button onClick={handleLogin} className="px-4 py-2 rounded bg-black text-white dark:bg-white dark:text-black">
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
