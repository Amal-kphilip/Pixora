import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0B0D",
        foreground: "#F7F6F3",
        brand: {
          bg: "#0B0B0D",
          accent: "#FF6A2B",
          accentGlow: "rgba(255, 106, 43, 0.15)",
          card: "#121216",
          cardHover: "#181820",
          muted: "rgba(255, 255, 255, 0.6)",
          border: "rgba(255, 255, 255, 0.08)",
          borderHover: "rgba(255, 255, 255, 0.15)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      boxShadow: {
        accent: "0 0 20px rgba(255, 106, 43, 0.2)",
        "accent-strong": "0 0 35px rgba(255, 106, 43, 0.4)",
      },
      transitionTimingFunction: {
        "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
export default config;

