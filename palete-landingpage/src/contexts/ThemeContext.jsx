import { createContext, useContext, useEffect, useState } from 'react';

/**
 * Theme Context for managing application-wide theme state
 * Supports multiple themes with localStorage persistence and system theme detection
 * 
 * Available themes:
 * - earthy: Earthy Neutrals (default, user preference)
 * - light: Light Classic
 * - dark: Dark Modern
 * - pastel: Soft Pastel
 * - vibrant: Vibrant Color Pop
 * - mono: Monochrome Minimal
 * - auto: System theme detection
 */

const ThemeContext = createContext();

export const themes = {
  earthy: {
    id: 'earthy',
    name: 'Earthy Neutrals',
    description: 'Natural, warm tones',
    colors: {
      primary: '#A57B5B',
      secondary: '#6A7B53',
      background: '#F3EDE4',
      surface: '#E5D5C5',
      text: '#2D2D2D',
    },
    preview: ['#A57B5B', '#6A7B53', '#E5D5C5'],
  },
  light: {
    id: 'light',
    name: 'Light Classic',
    description: 'Clean, bright interface',
    colors: {
      primary: '#3B82F6',
      secondary: '#6B7280',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#111827',
    },
    preview: ['#3B82F6', '#6B7280', '#F9FAFB'],
  },
  dark: {
    id: 'dark',
    name: 'Dark Modern',
    description: 'Sleek, tech-focused',
    colors: {
      primary: '#8C7AA9',
      secondary: '#A78BFA',
      background: '#1a1a1a',
      surface: '#2d2d2d',
      text: '#ffffff',
    },
    preview: ['#8C7AA9', '#A78BFA', '#2d2d2d'],
  },
  pastel: {
    id: 'pastel',
    name: 'Soft Pastel',
    description: 'Gentle, friendly colors',
    colors: {
      primary: '#D6AEDD',
      secondary: '#5A4E7C',
      background: '#FFF2E6',
      surface: '#F3D7FF',
      text: '#2D2D2D',
    },
    preview: ['#D6AEDD', '#F3D7FF', '#FFF2E6'],
  },
  vibrant: {
    id: 'vibrant',
    name: 'Vibrant Pop',
    description: 'Bold, energetic colors',
    colors: {
      primary: '#FF6347',
      secondary: '#BF1922',
      background: '#FFD6B8',
      surface: '#B2E8C8',
      text: '#1a1a1a',
    },
    preview: ['#FF6347', '#BF1922', '#B2E8C8'],
  },
  mono: {
    id: 'mono',
    name: 'Monochrome',
    description: 'Minimal, focused design',
    colors: {
      primary: '#8D6B4B',
      secondary: '#666666',
      background: '#F9F6F0',
      surface: '#DDD6CE',
      text: '#2D2D2D',
    },
    preview: ['#8D6B4B', '#666666', '#DDD6CE'],
  },
  auto: {
    id: 'auto',
    name: 'System Auto',
    description: 'Follows system preference',
    colors: null, // Will be determined by system
    preview: ['#6B7280', '#9CA3AF', '#F3F4F6'],
  },
};

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('earthy'); // Default to user preference
  const [systemTheme, setSystemTheme] = useState('light');

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const themeToApply = currentTheme === 'auto' ? systemTheme : currentTheme;

    // Remove all theme classes
    document.documentElement.classList.remove(
      ...Object.keys(themes).map(theme => `theme-${theme}`)
    );

    // Add current theme class
    document.documentElement.classList.add(`theme-${themeToApply}`);

    // Update CSS variables dynamically
    const activeTheme = themes[themeToApply];
    if (activeTheme && activeTheme.colors) {
      const root = document.documentElement;
      root.style.setProperty('--primary-bg', activeTheme.colors.background);
      root.style.setProperty('--secondary-bg', activeTheme.colors.surface);
      root.style.setProperty('--text-primary', activeTheme.colors.text);
      root.style.setProperty('--text-secondary', activeTheme.colors.secondary);
      root.style.setProperty('--accent-color', activeTheme.colors.primary);
      root.style.setProperty('--border-color', activeTheme.colors.secondary);

      // Convert hex to RGB for Tailwind
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ?
          `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` :
          '0 0 0';
      };

      root.style.setProperty('--color-primary', hexToRgb(activeTheme.colors.background));
      root.style.setProperty('--color-secondary', hexToRgb(activeTheme.colors.surface));
      root.style.setProperty('--color-text-primary', hexToRgb(activeTheme.colors.text));
      root.style.setProperty('--color-text-secondary', hexToRgb(activeTheme.colors.secondary));
      root.style.setProperty('--color-accent', hexToRgb(activeTheme.colors.primary));
      root.style.setProperty('--color-border', hexToRgb(activeTheme.colors.secondary));
    }

    // Save to localStorage
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme, systemTheme]);

  const changeTheme = (themeId) => {
    if (themes[themeId]) {
      setCurrentTheme(themeId);
    }
  };

  const getActiveTheme = () => {
    return currentTheme === 'auto' ? themes[systemTheme] : themes[currentTheme];
  };

  const value = {
    currentTheme,
    themes,
    changeTheme,
    getActiveTheme,
    systemTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
