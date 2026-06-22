import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: 'var(--bg-base)',
        elevated: 'var(--bg-elevated)',
        'elevated-2': 'var(--bg-elevated-2)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        'accent-red': 'var(--accent-red)',
        'accent-blue': 'var(--accent-blue)',
        'accent-blue-glow': 'var(--accent-blue-glow)',
        'accent-line': 'var(--accent-line)',
        success: 'var(--success)',
        error: 'var(--error)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Anton', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
    screens: {
      'xs': '360px',
      'sm': '480px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  },
  plugins: [],
} satisfies Config
