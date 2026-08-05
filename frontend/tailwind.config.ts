import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fdf2f7",
          100: "#fce7f1",
          300: "#f5a8cb",
          500: "#e0559f",
          600: "#c93d85",
          700: "#a52d69",
        },
        leaf: {
          500: "#4c9a6a",
          600: "#3a7d53",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
