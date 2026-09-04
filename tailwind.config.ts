import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Concrete FlexGear Brand Palette
        cinema: {
          bg: "#090A0C",
          surface: "#111318",
          tertiary: "#181B20",
          card: "#1C2026",
          elevated: "#22272E",
          hover: "#292F37",
          border: "#2B3038",
          "border-strong": "#3A414B",
          text: "#F5F5F2",
          "text-secondary": "#B8BCC4",
          "text-muted": "#7E848E",
          "text-disabled": "#5D626B",
        },
        accent: {
          DEFAULT: "#F2B84B",
          hover: "#FFC766",
          soft: "rgba(242, 184, 75, 0.14)",
          border: "rgba(242, 184, 75, 0.35)",
        },
        lightsec: {
          bg: "#F4F3EF",
          surface: "#FFFFFF",
          text: "#121417",
          muted: "#5E636B",
          border: "#E2E0D8",
        },
        semantic: {
          success: "#32C48D",
          "success-soft": "rgba(50, 196, 141, 0.12)",
          warning: "#F2B84B",
          "warning-soft": "rgba(242, 184, 75, 0.12)",
          error: "#EF6262",
          "error-soft": "rgba(239, 98, 98, 0.12)",
          info: "#5FA8FF",
          "info-soft": "rgba(95, 168, 255, 0.12)",
        },
        // Backward compatibility mappings
        lenstiger: {
          DEFAULT: "#F2B84B",
          hover: "#FFC766",
          dark: "#090A0C",
          light: "#181B20",
          50: "#181B20",
          100: "#22272E",
          500: "#F2B84B",
          600: "#FFC766",
          700: "#D99E32",
          800: "#B88220",
          900: "#090A0C",
        },
        gold: {
          DEFAULT: "#F2B84B",
          hover: "#FFC766",
          500: "#F2B84B",
        },
        whatsapp: {
          DEFAULT: "#25D366",
          hover: "#20bd5a",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "16px",
        md: "12px",
        sm: "8px",
        xl: "20px",
      },
      boxShadow: {
        'cinema-sm': '0 2px 8px rgba(0,0,0,0.18)',
        'cinema-md': '0 8px 24px rgba(0,0,0,0.22)',
        'cinema-lg': '0 20px 50px rgba(0,0,0,0.30)',
        'cinema-glow': '0 0 40px rgba(242,184,75,0.08)',
        'cinema-accent': '0 0 25px rgba(242,184,75,0.20)',
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-manrope)", "sans-serif"],
        heading: ["var(--font-manrope)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      transitionTimingFunction: {
        'cinema': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
