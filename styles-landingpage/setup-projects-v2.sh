#!/bin/bash

# Array of project names with -2 suffix
projects=(
  "minimal-and-clean-2"
  "benefit-first-2"
  "case-study-and-ROI-focus-2"
  "live-preview-2"
  "founder-section-2"
  "short-cta-and-strong-button-2"
  "mobile-first-layout-2"
  "develop-centric-2"
)

# Base port number for v2 projects
base_port=4001

for i in "${!projects[@]}"; do
  project="${projects[$i]}"
  port=$((base_port + i))
  
  echo "Setting up $project on port $port..."
  
  # Create directories
  mkdir -p "$project/src"
  
  # Create package.json
  cat > "$project/package.json" << EOF
{
  "name": "${project}-landing",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "framer-motion": "^12.19.1",
    "lucide-react": "^0.523.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.29.0",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6",
    "@vitejs/plugin-react": "^4.5.2",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.29.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^16.2.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.17",
    "vite": "^7.0.0"
  }
}
EOF

  # Create vite config
  cat > "$project/vite.config.js" << EOF
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: $port,
    host: true
  }
})
EOF

  # Create tailwind config with extended theme
  cat > "$project/tailwind.config.js" << EOF
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        neon: {
          green: '#39ff14',
          pink: '#ff10f0',
          blue: '#1b03a3',
          cyan: '#00ffff',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glitch': 'glitch 0.3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #39ff14, 0 0 10px #39ff14, 0 0 15px #39ff14' },
          '100%': { boxShadow: '0 0 10px #39ff14, 0 0 20px #39ff14, 0 0 30px #39ff14' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
EOF

  # Create postcss config
  cat > "$project/postcss.config.js" << EOF
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

  # Create index.html
  cat > "$project/index.html" << EOF
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${project^} Landing</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOF

  # Create main.jsx
  cat > "$project/src/main.jsx" << EOF
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
EOF

  # Create index.css
  cat > "$project/src/index.css" << EOF
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: 'Inter', system-ui, sans-serif;
  }
}

@layer utilities {
  .glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .glass-dark {
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .text-glow {
    text-shadow: 0 0 10px currentColor;
  }
  
  .neon-border {
    box-shadow: 0 0 5px currentColor, inset 0 0 5px currentColor;
  }
}
EOF

  echo "✅ $project setup complete"
done

echo "🎉 All v2 projects setup complete!"
echo "Ports assigned: 4001-4008"
