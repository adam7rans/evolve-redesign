'use client';

import React from 'react';
import { Inter } from 'next/font/google';
import localFont from "next/font/local";
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import "./globals.css";

const ThemeProvider = dynamic(() => import('@/contexts/ThemeContext').then(mod => mod.ThemeProvider), { ssr: false });
const AuthProvider = dynamic(() => import('@/contexts/AuthContext').then(mod => mod.AuthProvider), { ssr: false });
const AppHeader = dynamic(() => import('@/components/AppHeader').then(mod => mod.AppHeader), { ssr: false });
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

  return (
    <html lang="en">
      <body className={`${inter.className} ${geistSans.variable} ${geistMono.variable} bg-white dark:bg-gray-900 text-black dark:text-white`}>
        <SessionProvider>
          <ThemeProvider>
            <AuthProvider>
              {isAuthenticatedRoute && <AppHeader />}
              <div className="flex">
                {isAuthenticatedRoute && <Sidebar />}
                <main className={`flex-1 ${isAuthenticatedRoute ? 'ml-[70px]' : ''}`}>{children}</main>
              </div>
            </AuthProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
