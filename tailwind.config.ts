import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Univers Client (Bleu Royal Soft & Pro)
        client: {
          DEFAULT: "#1E40AF",   // Blue 800 - Identité majeure
          hover: "#1D4ED8",     // Blue 700 - Hover fluide
          dark: "#0F2F4E",      // Deep Navy - Titres
          light: "#EFF6FF",     // Blue 50 - Surface douce
        },
        
        // Univers Jobeur (Ambre/Jaune Chaleureux & Doux)
        jobber: {
          DEFAULT: "#EAB308",   // Yellow 500 - Chaleur sans éblouir
          hover: "#CA8A04",     // Yellow 600 - Hover interactif
          dark: "#854D0E",      // Yellow 800 - Texte contrasté accessible
          light: "#FEF9C3",     // Yellow 100 - Fond doux
          surface: "#FFFBEB",   // Amber 50 - Surface d'alerte pro
        },
        
        // Statuts & Confiance
        trust: {
          DEFAULT: "#059669",   // Emerald 600 - ProxyTrust certifié
          light: "#ECFDF5",     // Emerald 50 - Fond pastille
        },
        urgency: {
          DEFAULT: "#DC2626",   // Red 600 - Urgent < 2h
          light: "#FEF2F2",     // Red 50 - Fond tag urgence
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)",
        "soft-md": "0 4px 12px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -2px rgba(15, 23, 42, 0.03)",
        "soft-lg": "0 12px 24px -4px rgba(15, 23, 42, 0.06), 0 4px 8px -2px rgba(15, 23, 42, 0.02)",
      },
      transitionTimingFunction: {
        "soft-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        "150": "150ms",
        "200": "200ms",
      },
      borderRadius: {
        xl: "0.625rem",         // 10px
        "2xl": "0.875rem",       // 14px
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
