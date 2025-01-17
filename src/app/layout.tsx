'use client';

import React from 'react';
import { Source_Code_Pro, Roboto_Mono } from 'next/font/google';
import { usePathname } from 'next/navigation';
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NoiseProvider } from '@/contexts/NoiseContext';
import { AppHeader } from '@/components/shared/AppHeader';
import { PrelaunchHeader } from '@/components/shared/PrelaunchHeader';
import { FloatingNav } from '@/components/ui/floating-nav';
import { NoisePattern } from '@/components/ui/noise-pattern';
import Footer from '@/components/shared/Footer';

const sourceCodePro = Source_Code_Pro({ 
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isExperimentsRoute = pathname?.startsWith('/experiments');
  const isGradientRoute = pathname === '/experiments/gradient';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sourceCodePro.className} ${robotoMono.variable} font-sans flex flex-col min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NoiseProvider>
            {!isExperimentsRoute && (
              <>
                <PrelaunchHeader />
                <AppHeader />
              </>
            )}
            <main className="flex-grow">
              {children}
            </main>
            {!isGradientRoute && (
              <>
                <Footer />
                <FloatingNav />
                <NoisePattern />
              </>
            )}
          </NoiseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
