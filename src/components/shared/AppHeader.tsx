'use client';

import React from "react";
import Link from "next/link";
import FullLogo from '@/components/icons/sourceLogo';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from '@/components/ThemeToggle';

export function AppHeader() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="flex h-24 w-full shrink-0 items-center px-4 md:px-6 text-black dark:text-white">
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
          <ThemeToggle />
          <Button onClick={handleSignOut} variant="outline" className="text-sm">
            Log Out
          </Button>
        </div>
      </nav>
    </header>
  );
}