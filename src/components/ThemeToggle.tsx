'use client';

import { useTheme } from '@/contexts/ThemeContext';
import SunIcon from '/public/icons/sun.svg';
import MoonIcon from '/public/icons/moon.svg';

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? (
        <SunIcon className="w-5 h-5 text-white" />
      ) : (
        <MoonIcon className="w-5 h-5 text-black" />
      )}
    </button>
  );
}