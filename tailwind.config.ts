import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        game: {
          pink: '#ec4899',
          pinkDark: '#be185d',
          teal: '#06b6d4',
          tealBorder: '#22d3ee',
          amberCard: '#fffbeb',
          amberBorder: '#f59e0b',
          purpleBg: '#2e1065',
          cardBack: '#e11d48',
        },
      },
      fontFamily: {
        sans: ['Fredoka', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
