import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: "#020410",
          900: "#060818",
          800: "#0a0f1e",
          700: "#0d1528",
          600: "#111e35",
        },
        palace: {
          bg: "#0b1628",
          border: "#1a3a5c",
          hover: "#1e4570",
          glow: "#2563eb",
        },
        gold: {
          DEFAULT: "#d4a843",
          bright: "#f0c755",
          dim: "#8a6a20",
        },
        star: {
          major: "#f0c755",
          minor: "#7dd3fc",
          sha: "#f87171",
          lucky: "#6ee7b7",
        },
        hua: {
          lu: "#4ade80",
          quan: "#60a5fa",
          ke: "#facc15",
          ji: "#f87171",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
      },
      animation: {
        "star-twinkle": "twinkle 3s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "float-up": "floatUp 0.6s ease-out forwards",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "0.3", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(212,168,67,0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(212,168,67,0.8)" },
        },
        floatUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "cosmic-gradient":
          "radial-gradient(ellipse at center, #0d1528 0%, #060818 60%, #020410 100%)",
        "palace-gradient":
          "linear-gradient(135deg, #0b1628 0%, #0f1e3a 100%)",
        "gold-gradient":
          "linear-gradient(135deg, #d4a843 0%, #f0c755 50%, #d4a843 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
