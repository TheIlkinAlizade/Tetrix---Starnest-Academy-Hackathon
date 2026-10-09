import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F5F7F7",
        ink: "#0F1B1E",
        muted: "#64757B",
        line: "#E6EBEC",
        accent: { DEFAULT: "#0E8F9C", dark: "#0A6F7A", soft: "#E2F3F5" },
        warn: { DEFAULT: "#9A6A12", soft: "#FFF4DC", line: "#F3DFAE" },
        good: { DEFAULT: "#1B7F46", soft: "#E6F5EC" },
        bad: { DEFAULT: "#B3372F", soft: "#FCEBE9" },
      },
      fontFamily: {
        sans: ['"Segoe UI"', "system-ui", "-apple-system", "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"],
      },
      boxShadow: { card: "0 1px 2px rgba(15,27,30,.04), 0 6px 20px rgba(15,27,30,.04)" },
    },
  },
  plugins: [],
};
export default config;
