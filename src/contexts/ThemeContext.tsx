'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const themeCookie = document.cookie.split('; ').find(row => row.startsWith('theme='));
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    console.log('Theme cookie:', themeCookie ? themeCookie.split('=')[1] : 'not set');
    console.log('Stored theme:', storedTheme);
    console.log('Detected system theme preference:', prefersDark ? 'dark' : 'light');

    // Always use system preference
    const initialTheme: Theme = prefersDark ? 'dark' : 'light';
    console.log('Using system preference:', initialTheme);

    console.log('Initial theme set to:', initialTheme);
    setTheme(initialTheme);

    // Clear any existing user preference
    localStorage.removeItem('theme');
    document.cookie = 'theme=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    console.log('Applied theme:', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      // When user toggles, we store their preference
      localStorage.setItem('theme', newTheme);
      document.cookie = `theme=${newTheme}; path=/; max-age=31536000`; // Set the theme cookie with 1 year expiration
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}