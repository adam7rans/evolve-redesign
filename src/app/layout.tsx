import React from 'react';
import { Inter } from 'next/font/google';
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from '@/contexts/AuthContext';
import { AppHeader } from '@/components/shared/AppHeader';
import { LaunchHeader } from '@/components/shared/LaunchHeader';
import { PrelaunchHeader } from '@/components/shared/PrelaunchHeader';
import Footer from '@/components/shared/Footer';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import AnimatedBackground from '@/components/animation/AnimateBackground';

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <AnimatedBackground />
            <div className="relative z-10 flex flex-col min-h-screen">
              {session ? <AppHeader /> : <PrelaunchHeader />}
              <main className="flex-grow w-full">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}