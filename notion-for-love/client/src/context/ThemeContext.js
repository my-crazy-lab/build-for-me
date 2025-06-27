/**
 * Love Journey - Theme Context
 *
 * Comprehensive theme management with dark/light mode support,
 * color scheme customization, and persistent preferences.
 *
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('system'); // 'light', 'dark', 'system'
  const [colorScheme, setColorScheme] = useState('earthy-neutrals');
  const [isDark, setIsDark] = useState(false);

  // Available color schemes
  const colorSchemes = {
    'earthy-neutrals': {
      name: 'Earthy Neutrals',
      description: 'Warm and natural tones',
      colors: {
        primary: '#A57B5B', // Terracotta
        secondary: '#6A7B53', // Olive Green
        neutral: '#E5D5C5', // Cream Beige
        accent: '#D4A574' // Warm Sand
      }
    },
    'romantic-pink': {
      name: 'Romantic Pink',
      description: 'Soft and romantic pink tones',
      colors: {
        primary: '#EC4899',
        secondary: '#F472B6',
        neutral: '#FDF2F8',
        accent: '#BE185D'
      }
    },
    'ocean-blue': {
      name: 'Ocean Blue',
      description: 'Calming ocean-inspired blues',
      colors: {
        primary: '#3B82F6',
        secondary: '#60A5FA',
        neutral: '#EFF6FF',
        accent: '#1D4ED8'
      }
    },
    'forest-green': {
      name: 'Forest Green',
      description: 'Natural forest greens',
      colors: {
        primary: '#22C55E',
        secondary: '#4ADE80',
        neutral: '#F0FDF4',
        accent: '#15803D'
      }
    },
    'sunset-orange': {
      name: 'Sunset Orange',
      description: 'Warm sunset oranges',
      colors: {
        primary: '#F97316',
        secondary: '#FB923C',
        neutral: '#FFF7ED',
        accent: '#C2410C'
      }
    }
  };

  // Check system preference
  const getSystemTheme = () => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('lovejourney_theme');
    const savedColorScheme = localStorage.getItem('lovejourney_color_scheme');

    if (savedTheme) {
      setTheme(savedTheme);
    }

    if (savedColorScheme && colorSchemes[savedColorScheme]) {
      setColorScheme(savedColorScheme);
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        setIsDark(mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Update isDark based on theme setting
  useEffect(() => {
    let dark = false;

    if (theme === 'dark') {
      dark = true;
    } else if (theme === 'light') {
      dark = false;
    } else if (theme === 'system') {
      dark = getSystemTheme() === 'dark';
    }

    setIsDark(dark);

    // Apply theme to document
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply color scheme to CSS variables
    const currentScheme = colorSchemes[colorScheme];
    if (currentScheme) {
      const root = document.documentElement;

      // Convert hex to RGB values for CSS variables
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      };

      // Apply primary color
      const primaryRgb = hexToRgb(currentScheme.colors.primary);
      if (primaryRgb) {
        root.style.setProperty('--color-primary', `${primaryRgb.r} ${primaryRgb.g} ${primaryRgb.b}`);
      }

      // Apply secondary color
      const secondaryRgb = hexToRgb(currentScheme.colors.secondary);
      if (secondaryRgb) {
        root.style.setProperty('--color-secondary', `${secondaryRgb.r} ${secondaryRgb.g} ${secondaryRgb.b}`);
      }

      // Apply neutral color
      const neutralRgb = hexToRgb(currentScheme.colors.neutral);
      if (neutralRgb) {
        root.style.setProperty('--color-neutral', `${neutralRgb.r} ${neutralRgb.g} ${neutralRgb.b}`);
      }

      // Apply accent color
      const accentRgb = hexToRgb(currentScheme.colors.accent);
      if (accentRgb) {
        root.style.setProperty('--color-accent', `${accentRgb.r} ${accentRgb.g} ${accentRgb.b}`);
      }
    }
  }, [theme, colorScheme, colorSchemes]);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('lovejourney_theme', newTheme);
  };

  const setThemeMode = (mode) => {
    setTheme(mode);
    localStorage.setItem('lovejourney_theme', mode);
  };

  const setColorSchemeMode = (scheme) => {
    if (colorSchemes[scheme]) {
      setColorScheme(scheme);
      localStorage.setItem('lovejourney_color_scheme', scheme);
    }
  };

  const getCurrentColorScheme = () => {
    return colorSchemes[colorScheme];
  };

  const value = {
    theme,
    colorScheme,
    isDark,
    colorSchemes,
    toggleTheme,
    setThemeMode,
    setColorSchemeMode,
    getCurrentColorScheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
