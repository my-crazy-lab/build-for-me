/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Earthy Neutrals (Primary theme based on user preference)
        earthy: {
          terracotta: '#A57B5B',
          olive: '#6A7B53',
          cream: '#E5D5C5',
          sand: '#D2BA8C',
          brown: '#8D6B4B',
          beige: '#C5B299',
          light: '#F3EDE4',
        },
        // Vibrant Pastels
        pastel: {
          mint: '#B2E8C8',
          lavender: '#F3D7FF',
          peach: '#FFD6B8',
          periwinkle: '#CCCCFF',
          sky: '#AEC6CF',
          mauve: '#D6AEDD',
          coral: '#FFB7B2',
          apricot: '#FFD3A6',
          lilac: '#C7CEEA',
          ivory: '#FFF2E6',
        },
        // Burning Red Accent
        accent: {
          red: '#BF1922',
          darkred: '#7E0000',
          tomato: '#FF6347',
        },
        // Butter Yellow
        butter: {
          light: '#FCE38A',
          medium: '#F9D976',
          warm: '#FFD97D',
        },
        // Aura Indigo
        indigo: {
          deep: '#5A4E7C',
          medium: '#8C7AA9',
          dark: '#3E2C66',
        },
        // Dill Green
        dill: {
          medium: '#91A57D',
          light: '#B7C9A7',
          dark: '#7C8F5E',
        },
        // Alpine Oat
        oat: {
          light: '#F9F6F0',
          medium: '#DDD6CE',
          dark: '#C7BCB4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
