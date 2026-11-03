import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF9F3",
        blush: "#FFE5EC",
        pink: "#FFC1D5",
        rose: "#FF8FAB",
        "deep-rose": "#C73E68",
        lavender: "#E0C9F0",
        gold: "#F0C979",
        ink: "#4A2E3A",
        sage: "#8FA88F",
      },
      fontFamily: {
        // Heading — Libre Baskerville
        pacifico: ["var(--font-librebaskerville)", "Georgia", "serif"],
        display: ["var(--font-librebaskerville)", "Georgia", "serif"],
        serif: ["var(--font-librebaskerville)", "Georgia", "serif"],
        // Body — Karla
        fredoka: ["var(--font-karla)", "system-ui", "sans-serif"],
        sans: ["var(--font-karla)", "system-ui", "sans-serif"],
        // Aksen — Bricolage Grotesque
        caveat: ["var(--font-bricolage)", "system-ui", "sans-serif"],
        hand: ["var(--font-bricolage)", "system-ui", "sans-serif"],
        playwrite: ["var(--font-bricolage)", "system-ui", "sans-serif"],
        script: ["var(--font-bricolage)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
