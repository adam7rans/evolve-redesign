import React from 'react';
import { Source_Code_Pro } from 'next/font/google';
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from '@/contexts/AuthContext';
import { NoiseProvider } from '@/contexts/NoiseContext';
import { AppHeader } from '@/components/shared/AppHeader';
import { FloatingNav } from '@/components/ui/floating-nav';
import { NoisePattern } from '@/components/ui/noise-pattern';
import Footer from '@/components/shared/Footer';

const sourceCodePro = Source_Code_Pro({ 
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

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

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sourceCodePro.className} font-sans flex flex-col min-h-screen`}>
        <Providers>
          <NoiseProvider>
            <AuthProvider>
              <AppHeader />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
              <FloatingNav />
              <NoisePattern />
            </AuthProvider>
          </NoiseProvider>
        </Providers>
      </body>
    </html>
  );
}
