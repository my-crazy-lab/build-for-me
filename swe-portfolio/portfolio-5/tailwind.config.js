/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'futuristic': ['Orbitron', 'monospace'],
        'modern': ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        interactive: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          accent: '#06b6d4',
          neon: '#00ffff',
          purple: '#a855f7',
          pink: '#ec4899',
          orange: '#f97316',
          green: '#10b981',
        },
        dark: {
          bg: '#0f0f23',
          card: '#1a1a2e',
          border: '#16213e',
          text: '#e2e8f0',
        }
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'float-3d': 'float-3d 6s ease-in-out infinite',
        'rotate-3d': 'rotate-3d 20s linear infinite',
        'morph': 'morph 8s ease-in-out infinite',
        'particle': 'particle 3s ease-in-out infinite',
        'hologram': 'hologram 4s ease-in-out infinite',
        'glitch': 'glitch 2s infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%': { 
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
            transform: 'scale(1)',
          },
          '100%': { 
            boxShadow: '0 0 40px rgba(99, 102, 241, 0.8), 0 0 60px rgba(139, 92, 246, 0.3)',
            transform: 'scale(1.05)',
          },
        },
        'float-3d': {
          '0%, 100%': { 
            transform: 'translateY(0px) rotateX(0deg) rotateY(0deg)',
          },
          '33%': { 
            transform: 'translateY(-20px) rotateX(10deg) rotateY(120deg)',
          },
          '66%': { 
            transform: 'translateY(-10px) rotateX(-10deg) rotateY(240deg)',
          },
        },
        'rotate-3d': {
          '0%': { transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)' },
          '100%': { transform: 'rotateX(360deg) rotateY(360deg) rotateZ(360deg)' },
        },
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
        particle: {
          '0%': { 
            transform: 'translateY(0px) scale(1)',
            opacity: '1',
          },
          '100%': { 
            transform: 'translateY(-100px) scale(0)',
            opacity: '0',
          },
        },
        hologram: {
          '0%, 100%': { 
            opacity: '0.8',
            transform: 'translateZ(0px)',
          },
          '50%': { 
            opacity: '1',
            transform: 'translateZ(20px)',
          },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
      },
      perspective: {
        '1000': '1000px',
        '2000': '2000px',
      },
      transformStyle: {
        '3d': 'preserve-3d',
      },
      backgroundImage: {
        'interactive-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
        'holographic': 'linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0, #ff0080)',
        'neural-network': 'radial-gradient(circle at 25% 25%, #6366f1 0%, transparent 50%), radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)',
      },
    },
  },
  plugins: [],
}
