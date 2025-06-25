/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Earthy Neutrals Palette
        primary: {
          50: '#faf8f6',
          100: '#f5f1ec',
          200: '#e8ddd0',
          300: '#dbc9b4',
          400: '#c8a882',
          500: '#A57B5B', // Terracotta
          600: '#956f52',
          700: '#7d5c44',
          800: '#654a37',
          900: '#523c2d',
        },
        secondary: {
          50: '#f6f7f4',
          100: '#edeee9',
          200: '#d2d5c8',
          300: '#b7bca7',
          400: '#818a65',
          500: '#6A7B53', // Olive Green
          600: '#5f6f4b',
          700: '#4f5c3e',
          800: '#3f4a32',
          900: '#333d29',
        },
        neutral: {
          50: '#fdfcfb',
          100: '#faf8f6',
          200: '#f0ebe3',
          300: '#E5D5C5', // Cream Beige
          400: '#d4c0a8',
          500: '#c3ab8b',
          600: '#b0967d',
          700: '#937e68',
          800: '#766553',
          900: '#615344',
        },
        accent: {
          50: '#fef7f0',
          100: '#fdeee1',
          200: '#f9d5be',
          300: '#f5bc9b',
          400: '#ed8a55',
          500: '#e5580f',
          600: '#ce4f0e',
          700: '#ac420c',
          800: '#8a3509',
          900: '#712b08',
        },
        // Semantic colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(165, 123, 91, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(165, 123, 91, 0.8)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      borderColor: {
        'border': 'hsl(var(--border))',
        DEFAULT: 'hsl(var(--border))',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
