/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Roboto', 'system-ui', 'sans-serif'],
        'serif': ['Merriweather', 'serif'],
      },
      colors: {
        corporate: {
          navy: '#1e3a8a',
          blue: '#3b82f6',
          gray: '#6b7280',
          lightgray: '#f3f4f6',
          darkgray: '#374151',
          gold: '#f59e0b',
        },
        professional: {
          primary: '#1e40af',
          secondary: '#64748b',
          accent: '#0ea5e9',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'subtle-bounce': 'subtleBounce 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        subtleBounce: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      },
      boxShadow: {
        'corporate': '0 4px 6px -1px rgba(30, 58, 138, 0.1), 0 2px 4px -1px rgba(30, 58, 138, 0.06)',
        'professional': '0 10px 15px -3px rgba(30, 64, 175, 0.1), 0 4px 6px -2px rgba(30, 64, 175, 0.05)',
      }
    },
  },
  plugins: [],
}
