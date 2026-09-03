import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          0: '#0A0A0B',
          1: '#111113',
          2: '#18181B',
          3: '#27272A',
          4: '#3F3F46',
        },
        accent: {
          DEFAULT: '#F59E0B',
          hover: '#FBBF24',
          muted: 'rgba(245, 158, 11, 0.1)',
        },
        info: {
          DEFAULT: '#3B82F6',
          muted: 'rgba(59, 130, 246, 0.1)',
        },
        success: { DEFAULT: '#10B981', muted: 'rgba(16, 185, 129, 0.1)' },
        warning: { DEFAULT: '#F59E0B', muted: 'rgba(245, 158, 11, 0.1)' },
        danger: { DEFAULT: '#F43F5E', muted: 'rgba(244, 63, 94, 0.1)' },
        // Compatibility aliases
        cinema: {
          black: '#0A0A0B',
          card: '#18181B',
          cardHover: '#27272A',
          surface: '#111113',
          border: '#27272A',
          borderHover: '#3F3F46',
          hover: '#27272A',
          muted: '#A1A1AA',
        },
        primary: {
          DEFAULT: '#F59E0B',
          hover: '#FBBF24',
          glow: 'rgba(245, 158, 11, 0.35)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'marquee': 'marquee 30s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'count-up': 'countUp 1s ease-out',
      },
      keyframes: {
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      boxShadow: {
        'amber-glow': '0 0 25px -5px rgba(245, 158, 11, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};

export default config;
