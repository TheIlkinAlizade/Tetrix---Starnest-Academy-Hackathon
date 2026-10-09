import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F8F6F2",
        canvas: "#F8F6F2",
        ink: "#241D35",
        muted: "#777184",
        line: "#E9E5EF",
        accent: { DEFAULT: "#7658DF", dark: "#6041CA", soft: "#EDE7FA" },
        lilac: "#EDE7FA",
        sage: "#D7E9DC",
        warn: { DEFAULT: "#986A22", soft: "#FFF4DF", line: "#F0DDB5" },
        good: { DEFAULT: "#36724B", soft: "#D7E9DC" },
        bad: { DEFAULT: "#B94B53", soft: "#FCEBED" },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Manrope", "Inter", "ui-sans-serif", "sans-serif"],
      },
      boxShadow: { card: "0 2px 10px rgba(36,29,53,.035)", soft: "0 12px 32px rgba(36,29,53,.07)" },
      borderRadius: { '2xl': '1.25rem' },
    },
  },
  plugins: [],
};
export default config;
