/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '375px',    // Small phones
      'sm': '640px',    // Large phones
      'md': '768px',    // Tablets
      'lg': '1024px',   // Laptops
      'xl': '1280px',   // Desktops
      '2xl': '1536px',  // Large desktops
    },
    extend: {
      colors: {
        // Dark theme backgrounds
        dark: {
          900: '#0a0a0a',
          800: '#121212',
          700: '#1a1a1a',
          600: '#2a2a2a',
          500: '#3a3a3a',
        },
        // Vibrant primary (Electric Blue)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb', // Bright blue
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#1e293b',
        },
        // Purple accent
        purple: {
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
        },
        // Neon green (for income/positive)
        neon: {
          green: '#00ff88',
          yellow: '#ffeb3b',
          blue: '#00d4ff',
        },
        // Success (Green)
        success: {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        // Danger (Coral/Red)
        danger: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
        // Warning (Orange/Yellow)
        warning: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        // Info (Cyan)
        info: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1', fontWeight: '800' }],
        'h1': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['clamp(1.25rem, 2.5vw, 1.875rem)', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['clamp(1.125rem, 2vw, 1.25rem)', { lineHeight: '1.6' }],
        'body': ['clamp(1rem, 1.5vw, 1.125rem)', { lineHeight: '1.6' }],
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
