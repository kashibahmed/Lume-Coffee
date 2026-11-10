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
        brand: {
          blush: "#F9C6C6",
          peach: "#EFD6C5",
          olive: "#9C8E5E",
          "olive-dark": "#887D47",
          cream: "#FFF9F2",
          espresso: "#332C25",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        headline: ["var(--font-londrina)", "cursive", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 25s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-subtle": "pulseSubtle 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(0.98)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

