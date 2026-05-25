// ============================================================
// tailwind.config.ts
// Tailwind CSS configuration for Narrative Pulse
// ============================================================

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-mono)", "JetBrains Mono", "Fira Code", "monospace"],
      },
      colors: {
        // Emerald accent palette (primary)
        accent: {
          DEFAULT: "#34d399",
          dim: "rgba(52,211,153,0.15)",
          glow: "rgba(52,211,153,0.25)",
        },
      },
      boxShadow: {
        "glow-emerald": "0 0 24px rgba(52,211,153,0.2)",
        "glow-red": "0 0 24px rgba(248,113,113,0.2)",
        "glow-blue": "0 0 24px rgba(96,165,250,0.2)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 4s linear infinite",
      },
      backgroundImage: {
        "grid-dark":
          "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "32px 32px",
      },
    },
  },
  plugins: [],
};

export default config;
