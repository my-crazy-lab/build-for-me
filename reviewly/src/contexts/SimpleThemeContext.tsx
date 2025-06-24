/**
 * Simple Theme Context for Reviewly Application
 * 
 * A simplified version of the theme context that works without complex enum imports.
 * This provides basic dark/light mode functionality with CSS custom properties.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Simple theme types
type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Storage key
const STORAGE_KEY = 'reviewly_theme_mode';

// Theme provider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get initial theme mode
  const getInitialMode = (): ThemeMode => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode;
    return saved || 'auto';
  };

  const [mode, setMode] = useState<ThemeMode>(getInitialMode);
  const [isDark, setIsDark] = useState<boolean>(false);

  // Update isDark based on mode and system preference
  useEffect(() => {
    const updateIsDark = () => {
      if (mode === 'auto') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(systemPrefersDark);
      } else {
        setIsDark(mode === 'dark');
      }
    };

    updateIsDark();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (mode === 'auto') {
        updateIsDark();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.body.className = isDark ? 'theme-dark' : 'theme-light';
  }, [isDark]);

  // Set theme mode
  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  const value: ThemeContextType = {
    mode,
    isDark,
    setThemeMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
