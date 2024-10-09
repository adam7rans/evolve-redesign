import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Ensure this is set to 'class'
  theme: {
    extend: {
      colors: {
        background: {
          light: '#ffffff', // Light mode background
          dark: '#0a0a0a',  // Dark mode background
        },
        foreground: {
          light: '#171717', // Light mode foreground
          dark: '#ededed',  // Dark mode foreground
        },
        primary: {
          light: '#3b82f6', // Example color for light mode
          dark: '#60a5fa',  // Example color for dark mode
        },
        secondary: {
          light: '#e5e7eb', // Example color for light mode
          dark: '#4b5563',  // Example color for dark mode
        },
      },
      backgroundImage: {
        'gradient-light': 'conic-gradient(from 0deg at 50% 50%, #FFEDF4, #FFFFF5, #FFEDF4)',
        'gradient-dark': 'conic-gradient(from 0deg at 50% 50%, #080823, #111111, #080823)',
      },
    },
  },
  plugins: [],
};

export default config;
