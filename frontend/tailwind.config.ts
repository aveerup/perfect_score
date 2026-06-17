import type { Config } from "tailwindcss";

// Note: Tailwind CSS v4 is primarily configured via CSS variables in globals.css.
// This file is included for compatibility and additional configuration if needed.

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#FAFAFA",
        "on-surface": "#000000",
        primary: "#000000",
        "on-primary": "#FAFAFA",
        secondary: "#737373",
        "secondary-container": "#F5F5F5",
        outline: "#D6D3D1",
        "outline-variant": "#E7E5E4",
        "surface-container": "#F5F5F5",
        "surface-container-low": "#FAFAFA",
        "surface-container-high": "#D6D3D1",
        "surface-container-lowest": "#FFFFFF",
        error: "#FF3B30",
        grape: {
          50: "#f5f3ff",
          100: "#ede9fe",
          400: "#c084fc",
          500: "#9333ea",
          600: "#7c2dbb",
          700: "#6b21a8",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        serif: ["var(--font-prata)"],
        heading: ["var(--font-joyme)"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "2rem",
      },
      spacing: {
        base: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
