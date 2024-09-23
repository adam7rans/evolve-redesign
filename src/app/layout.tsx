'use client';

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import localFont from "next/font/local";
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import "./globals.css";

// Dynamically import client-side providers and components
const ThemeProvider = dynamic(() => import('@/contexts/ThemeContext').then(mod => mod.ThemeProvider), { ssr: false });
const AuthProvider = dynamic(() => import('@/contexts/AuthContext').then(mod => mod.AuthProvider), { ssr: false });
const AppHeader = dynamic(() => import('@/components/AppHeader').then(mod => mod.AppHeader), { ssr: false });
const MarketingHeader = dynamic(() => import('@/components/MarketingHeader').then(mod => mod.MarketingHeader), { ssr: false });
const Sidebar = dynamic(() => import('@/app/dashboard/Sidebar').then(mod => mod.Sidebar), { ssr: false });
const SessionProvider = dynamic(() => import('next-auth/react').then(mod => mod.SessionProvider), { ssr: false });

const inter = Inter({ subsets: ['latin'] });

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthenticatedRoute = pathname?.startsWith('/dashboard') || pathname?.startsWith('/profile');
  const isRootRoute = pathname === '/';

  return (
    <html lang="en">
      <body className={`${inter.className} ${geistSans.variable} ${geistMono.variable} bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark`}>
        <SessionProvider>
          <ThemeProvider>
            <AuthProvider>
              {!isRootRoute && (isAuthenticatedRoute ? <AppHeader /> : <MarketingHeader />)}
              <div className="flex">
                {isAuthenticatedRoute && <Sidebar />}
                <main className={`flex-1 ${isAuthenticatedRoute ? 'ml-[70px]' : ''}`}>
                  {children}
                </main>
              </div>
            </AuthProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}