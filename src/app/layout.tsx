import React from 'react';
import { Inter } from 'next/font/google';
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from '@/contexts/AuthContext';
import { AppHeader } from '@/components/shared/AppHeader';
import { PrelaunchHeader } from '@/components/shared/PrelaunchHeader';
import Footer from '@/components/shared/Footer';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

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
  
  // Use getUser() instead of getSession()
  const { data: { user }, error } = await supabase.auth.getUser();

  let hasPaid = false;
  if (user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('has_paid')
      .eq('user_id', user.id)
      .single();
    hasPaid = profile?.has_paid || false;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              {user && hasPaid ? <AppHeader /> : <PrelaunchHeader />}
              <main className="flex-grow">
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
