/**
 * Theme Context for Education Expense Dashboard
 * 
 * This context provides:
 * - Theme state management (light/dark/system)
 * - Theme persistence
 * - System theme detection
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Create context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to system
    const savedTheme = localStorage.getItem('education-expense-theme');
    return savedTheme || THEMES.SYSTEM;
  });

  // Update theme and persist to localStorage
  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('education-expense-theme', newTheme);
  };

  // Get effective theme (resolve system theme)
  const getEffectiveTheme = () => {
    if (theme === THEMES.SYSTEM) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? THEMES.DARK 
        : THEMES.LIGHT;
    }
    return theme;
  };

  // Listen for system theme changes
  useEffect(() => {
    if (theme === THEMES.SYSTEM) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        // Force re-render when system theme changes
        setTheme(THEMES.SYSTEM);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Toggle between light and dark (skip system)
  const toggleTheme = () => {
    const effectiveTheme = getEffectiveTheme();
    updateTheme(effectiveTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT);
  };

  // Check if current theme is dark
  const isDark = () => {
    return getEffectiveTheme() === THEMES.DARK;
  };

  // Check if current theme is light
  const isLight = () => {
    return getEffectiveTheme() === THEMES.LIGHT;
  };

  // Check if using system theme
  const isSystem = () => {
    return theme === THEMES.SYSTEM;
  };

  const value = {
    // Current theme setting
    theme,
    
    // Effective theme (resolved system theme)
    effectiveTheme: getEffectiveTheme(),
    
    // Actions
    setTheme: updateTheme,
    toggleTheme,
    
    // Utilities
    isDark,
    isLight,
    isSystem,
    
    // Constants
    themes: THEMES,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
