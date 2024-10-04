'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme as useNextThemes } from 'next-themes';
import type { ThemeProviderProps as NextThemeProviderProps } from 'next-themes/dist/types';

interface ThemeContextType {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
  resolvedTheme: string | undefined;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  toggleTheme: () => {},
  resolvedTheme: 'light',
});

interface ThemeProviderProps extends NextThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <NextThemesProvider {...props}>
      <ThemeContextContent>{children}</ThemeContextContent>
    </NextThemesProvider>
  );
};

const ThemeContextContent = ({ children }: { children: ReactNode }) => {
  const { theme, setTheme, systemTheme, resolvedTheme } = useNextThemes();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme(systemTheme === 'dark' ? 'light' : 'dark');
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, resolvedTheme: mounted ? resolvedTheme : undefined }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
