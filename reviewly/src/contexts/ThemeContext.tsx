/**
 * Theme Context for Reviewly Application
 * 
 * This context provides theme management throughout the application including
 * dark/light mode switching, neumorphism styling, and consistent design tokens.
 * It handles theme persistence, system preference detection, and smooth transitions.
 * 
 * Features:
 * - Dark/Light/Auto theme modes
 * - Neumorphism design system
 * - Persistent theme preferences
 * - System preference detection
 * - Smooth theme transitions
 * - CSS custom properties
 * - Responsive design tokens
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { ThemeConfig, ColorPalette } from '../types';
import { ThemeMode } from '../types';

// Theme state interface
interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  config: ThemeConfig;
  isTransitioning: boolean;
}

// Theme actions
type ThemeAction =
  | { type: 'SET_THEME_MODE'; payload: ThemeMode }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_SYSTEM_PREFERENCE'; payload: boolean }
  | { type: 'START_TRANSITION' }
  | { type: 'END_TRANSITION' }
  | { type: 'UPDATE_CONFIG'; payload: Partial<ThemeConfig> };

// Theme context interface
interface ThemeContextType extends ThemeState {
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  updateConfig: (config: Partial<ThemeConfig>) => void;
}

// Light theme color palette - Classic Design
const lightColors: ColorPalette = {
  primary: '#2563eb',      // Classic blue
  secondary: '#7c3aed',    // Classic purple
  success: '#059669',      // Classic green
  warning: '#d97706',      // Classic orange
  error: '#dc2626',        // Classic red
  info: '#0284c7',         // Classic sky blue
  background: '#ffffff',   // Pure white
  surface: '#f8fafc',      // Light gray
  text: '#111827',         // Dark gray
  textSecondary: '#6b7280', // Medium gray
  border: '#d1d5db',       // Light border
  shadow: 'rgba(0, 0, 0, 0.1)',
};

// Dark theme color palette - Classic Design
const darkColors: ColorPalette = {
  primary: '#3b82f6',      // Bright blue
  secondary: '#8b5cf6',    // Bright purple
  success: '#10b981',      // Bright green
  warning: '#f59e0b',      // Bright amber
  error: '#ef4444',        // Bright red
  info: '#06b6d4',         // Bright cyan
  background: '#111827',   // Dark gray
  surface: '#1f2937',      // Lighter dark gray
  text: '#f9fafb',         // Light gray
  textSecondary: '#d1d5db', // Medium light gray
  border: '#374151',       // Dark border
  shadow: 'rgba(0, 0, 0, 0.25)',
};

// Default theme configuration
const createThemeConfig = (isDark: boolean): ThemeConfig => ({
  mode: isDark ? ThemeMode.DARK : ThemeMode.LIGHT,
  colors: isDark ? darkColors : lightColors,
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      bold: 700,
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    full: '9999px',
  },
  shadows: {
    sm: isDark 
      ? '0 1px 2px 0 rgba(0, 0, 0, 0.3)' 
      : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: isDark 
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)' 
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: isDark 
      ? '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)' 
      : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: isDark 
      ? '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)' 
      : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
});

// Initial state
const getInitialState = (): ThemeState => {
  const savedMode = localStorage.getItem('reviewly_theme_mode') as ThemeMode;
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  let mode: ThemeMode = savedMode || ThemeMode.AUTO;
  let isDark: boolean;

  if (mode === ThemeMode.AUTO) {
    isDark = systemPrefersDark;
  } else {
    isDark = mode === ThemeMode.DARK;
  }

  return {
    mode,
    isDark,
    config: createThemeConfig(isDark),
    isTransitioning: false,
  };
};

// Theme reducer
const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'SET_THEME_MODE': {
      const mode = action.payload;
      let isDark: boolean;

      if (mode === ThemeMode.AUTO) {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        isDark = mode === ThemeMode.DARK;
      }

      return {
        ...state,
        mode,
        isDark,
        config: createThemeConfig(isDark),
      };
    }
    case 'TOGGLE_THEME': {
      const newMode = state.isDark ? ThemeMode.LIGHT : ThemeMode.DARK;
      return {
        ...state,
        mode: newMode,
        isDark: newMode === ThemeMode.DARK,
        config: createThemeConfig(newMode === ThemeMode.DARK),
      };
    }
    case 'SET_SYSTEM_PREFERENCE': {
      if (state.mode === ThemeMode.AUTO) {
        const isDark = action.payload;
        return {
          ...state,
          isDark,
          config: createThemeConfig(isDark),
        };
      }
      return state;
    }
    case 'START_TRANSITION':
      return {
        ...state,
        isTransitioning: true,
      };
    case 'END_TRANSITION':
      return {
        ...state,
        isTransitioning: false,
      };
    case 'UPDATE_CONFIG':
      return {
        ...state,
        config: {
          ...state.config,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Storage key
const STORAGE_KEY = 'reviewly_theme_mode';

// Theme provider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, getInitialState());

  // Apply CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    const { colors, typography, spacing, borderRadius, shadows } = state.config;

    // Color properties
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-success', colors.success);
    root.style.setProperty('--color-warning', colors.warning);
    root.style.setProperty('--color-error', colors.error);
    root.style.setProperty('--color-info', colors.info);
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-surface', colors.surface);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-text-secondary', colors.textSecondary);
    root.style.setProperty('--color-border', colors.border);
    root.style.setProperty('--color-shadow', colors.shadow);

    // Typography properties
    root.style.setProperty('--font-family', typography.fontFamily);
    root.style.setProperty('--font-size-xs', typography.fontSize.xs);
    root.style.setProperty('--font-size-sm', typography.fontSize.sm);
    root.style.setProperty('--font-size-md', typography.fontSize.md);
    root.style.setProperty('--font-size-lg', typography.fontSize.lg);
    root.style.setProperty('--font-size-xl', typography.fontSize.xl);
    root.style.setProperty('--font-weight-light', typography.fontWeight.light.toString());
    root.style.setProperty('--font-weight-normal', typography.fontWeight.normal.toString());
    root.style.setProperty('--font-weight-medium', typography.fontWeight.medium.toString());
    root.style.setProperty('--font-weight-bold', typography.fontWeight.bold.toString());

    // Spacing properties
    root.style.setProperty('--spacing-xs', spacing.xs);
    root.style.setProperty('--spacing-sm', spacing.sm);
    root.style.setProperty('--spacing-md', spacing.md);
    root.style.setProperty('--spacing-lg', spacing.lg);
    root.style.setProperty('--spacing-xl', spacing.xl);

    // Border radius properties
    root.style.setProperty('--border-radius-sm', borderRadius.sm);
    root.style.setProperty('--border-radius-md', borderRadius.md);
    root.style.setProperty('--border-radius-lg', borderRadius.lg);
    root.style.setProperty('--border-radius-full', borderRadius.full);

    // Shadow properties
    root.style.setProperty('--shadow-sm', shadows.sm);
    root.style.setProperty('--shadow-md', shadows.md);
    root.style.setProperty('--shadow-lg', shadows.lg);
    root.style.setProperty('--shadow-xl', shadows.xl);

    // Neumorphism shadows
    const neuLight = state.isDark 
      ? 'inset 5px 5px 10px #0a0f1a, inset -5px -5px 10px #1e3a5f'
      : 'inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff';
    
    const neuDark = state.isDark 
      ? '5px 5px 10px #0a0f1a, -5px -5px 10px #1e3a5f'
      : '5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff';

    root.style.setProperty('--neu-shadow-light', neuLight);
    root.style.setProperty('--neu-shadow-dark', neuDark);

    // Set data attribute for theme
    root.setAttribute('data-theme', state.isDark ? 'dark' : 'light');
    
    // Update body class
    document.body.className = state.isDark ? 'theme-dark' : 'theme-light';
  }, [state.config, state.isDark]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      dispatch({ type: 'SET_SYSTEM_PREFERENCE', payload: e.matches });
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Set theme mode
  const setThemeMode = (mode: ThemeMode): void => {
    dispatch({ type: 'START_TRANSITION' });
    
    setTimeout(() => {
      dispatch({ type: 'SET_THEME_MODE', payload: mode });
      localStorage.setItem(STORAGE_KEY, mode);
      
      setTimeout(() => {
        dispatch({ type: 'END_TRANSITION' });
      }, 150);
    }, 50);
  };

  // Toggle theme
  const toggleTheme = (): void => {
    dispatch({ type: 'START_TRANSITION' });
    
    setTimeout(() => {
      dispatch({ type: 'TOGGLE_THEME' });
      const newMode = state.isDark ? ThemeMode.LIGHT : ThemeMode.DARK;
      localStorage.setItem(STORAGE_KEY, newMode);
      
      setTimeout(() => {
        dispatch({ type: 'END_TRANSITION' });
      }, 150);
    }, 50);
  };

  // Update config
  const updateConfig = (config: Partial<ThemeConfig>): void => {
    dispatch({ type: 'UPDATE_CONFIG', payload: config });
  };

  const contextValue: ThemeContextType = {
    ...state,
    setThemeMode,
    toggleTheme,
    updateConfig,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
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

// Hook for getting theme-aware styles
export const useThemeStyles = () => {
  const { config, isDark } = useTheme();

  const getNeumorphismStyle = (pressed = false) => ({
    background: config.colors.surface,
    boxShadow: pressed 
      ? `inset 5px 5px 10px ${isDark ? '#0a0f1a' : '#d1d9e6'}, inset -5px -5px 10px ${isDark ? '#1e3a5f' : '#ffffff'}`
      : `5px 5px 10px ${isDark ? '#0a0f1a' : '#d1d9e6'}, -5px -5px 10px ${isDark ? '#1e3a5f' : '#ffffff'}`,
    border: `1px solid ${config.colors.border}`,
    borderRadius: config.borderRadius.lg,
  });

  const getGlassStyle = (opacity = 0.1) => ({
    background: `rgba(${isDark ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
    backdropFilter: 'blur(10px)',
    border: `1px solid rgba(${isDark ? '255, 255, 255' : '0, 0, 0'}, 0.2)`,
    borderRadius: config.borderRadius.lg,
  });

  return {
    config,
    isDark,
    getNeumorphismStyle,
    getGlassStyle,
  };
};

export default ThemeContext;
