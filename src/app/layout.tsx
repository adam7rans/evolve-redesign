'use client';

import React from 'react';
import { Inter } from 'next/font/google';
import localFont from "next/font/local";
import dynamic from 'next/dynamic';
import "./globals.css";

const ThemeProvider = dynamic(() => import('@/contexts/ThemeContext').then(mod => mod.ThemeProvider), { ssr: false });
const AuthProvider = dynamic(() => import('@/contexts/AuthContext').then(mod => mod.AuthProvider), { ssr: false });
const Header = dynamic(() => import('@/components/Header').then(mod => mod.Header), { ssr: false });
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
  return (
    <html lang="en">
      <body className={`${inter.className} ${geistSans.variable} ${geistMono.variable} bg-white dark:bg-gray-900 text-black dark:text-white`}>
        <SessionProvider>
          <ThemeProvider>
            <AuthProvider>
              <Header />
              <div className="flex">
                <Sidebar />
                <main className="flex-1 ml-[70px]">{children}</main>
              </div>
            </AuthProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
