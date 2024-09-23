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
      },
    },
  },
  plugins: [],
};

export default config;
