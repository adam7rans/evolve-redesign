import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/globals.css",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Source Code Pro', 'monospace'],
        mono: ['Source Code Pro', 'monospace'],
      },
      colors: {
        background: {
          light: '#ffffff',
          dark: '#0a0a0a',
        },
        foreground: {
          light: '#171717',
          dark: '#ededed',
        },
        primary: {
          light: '#3b82f6',
          dark: '#60a5fa',
        },
        secondary: {
          light: '#e5e7eb',
          dark: '#4b5563',
        },
        placeholder: {
          light: '#00000015',  // black with 8% opacity
          dark: '#ffffff15',   // white with 8% opacity
        },
        // New color palette
        palette: {
          blue: '#000AFF',
          pink: '#FE0164',
          black: '#000000',
          white: '#FFFFFF',
          purple: '#5C00FE',
          cyan: '#02FFC4',
          yellow: '#FEF12D',
          skyBlue: '#00B3FF',
          beige: '#FEF3B5',
          mint: '#B4FFED',
        },
      },
      backgroundImage: {
        'gradient-light': 'conic-gradient(from 0deg at 50% 50%, #FFEDF4, #FFFFF5, #FFEDF4)',
        'gradient-dark': 'conic-gradient(from 0deg at 50% 50%, #080823, #111111, #080823)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
