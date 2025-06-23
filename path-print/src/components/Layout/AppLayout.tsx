/**
 * Career Path Visualization - Main Application Layout
 * 
 * This component provides the main layout structure for the application,
 * including navigation, header, and content areas. It manages global state
 * and provides context for child components.
 * 
 * @fileoverview Main application layout with navigation and content areas
 * @author Career Path Visualization Team
 * @version 1.0.0
 * 
 * MAINTAINER NOTES:
 * - This is the root layout component that wraps all pages
 * - Manages global application state and theme
 * - Provides responsive design for mobile and desktop
 * - Includes error boundaries for graceful error handling
 * - Uses React Context for state management
 * - All animations use Framer Motion for consistency
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
 type CareerData, 
  ViewMode, 
  AnimationState,
  type ErrorInfo 
} from '../../types';
import { Navigation } from './Navigation';
import { Header } from './Header';
import { ErrorBoundary } from '../Common/ErrorBoundary';
import { LoadingSpinner } from '../Common/LoadingSpinner';

// ============================================================================
// CONTEXT DEFINITIONS
// ============================================================================

/**
 * Global application state interface
 */
interface AppState {
  /** Current career data */
  careerData: CareerData | null;
  /** Current view mode */
  currentView: ViewMode;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: ErrorInfo | null;
  /** Theme preference */
  theme: 'light' | 'dark' | 'auto';
  /** Animation state */
  animationState: AnimationState;
  /** Mobile menu state */
  isMobileMenuOpen: boolean;
}

/**
 * Application context actions
 */
interface AppActions {
  /** Set career data */
  setCareerData: (data: CareerData) => void;
  /** Change view mode */
  setCurrentView: (view: ViewMode) => void;
  /** Set loading state */
  setIsLoading: (loading: boolean) => void;
  /** Set error state */
  setError: (error: ErrorInfo | null) => void;
  /** Toggle theme */
  toggleTheme: () => void;
  /** Set animation state */
  setAnimationState: (state: AnimationState) => void;
  /** Toggle mobile menu */
  toggleMobileMenu: () => void;
}

/**
 * Combined app context type
 */
type AppContextType = AppState & AppActions;

/**
 * Application context
 */
const AppContext = createContext<AppContextType | null>(null);

/**
 * Hook to use application context
 */
export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppLayout');
  }
  return context;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

/**
 * Props for the AppLayout component
 */
export interface AppLayoutProps {
  /** Child components to render in the main content area */
  children: React.ReactNode;
  /** Initial career data (optional) */
  initialData?: CareerData;
  /** Initial view mode */
  initialView?: ViewMode;
  /** Custom CSS classes */
  className?: string;
}

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

/**
 * Animation variants for layout transitions
 */
const layoutVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

/**
 * Animation variants for mobile menu
 */
const mobileMenuVariants = {
  closed: {
    x: '-100%',
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  open: {
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Main application layout component
 * 
 * Provides the overall structure and state management for the application.
 * Includes responsive navigation, header, and content areas with smooth animations.
 * 
 * @param props - Component props
 * @returns JSX element representing the application layout
 */
export function AppLayout({
  children,
  initialData = null,
  initialView = ViewMode.TIMELINE,
  className = ''
}: AppLayoutProps): JSX.Element {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [appState, setAppState] = useState<AppState>({
    careerData: initialData,
    currentView: initialView,
    isLoading: false,
    error: null,
    theme: 'auto',
    animationState: AnimationState.IDLE,
    isMobileMenuOpen: false
  });

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const actions: AppActions = {
    setCareerData: (data: CareerData) => {
      setAppState(prev => ({ ...prev, careerData: data }));
    },

    setCurrentView: (view: ViewMode) => {
      setAppState(prev => ({ ...prev, currentView: view }));
    },

    setIsLoading: (loading: boolean) => {
      setAppState(prev => ({ ...prev, isLoading: loading }));
    },

    setError: (error: ErrorInfo | null) => {
      setAppState(prev => ({ ...prev, error }));
    },

    toggleTheme: () => {
      setAppState(prev => ({
        ...prev,
        theme: prev.theme === 'light' ? 'dark' : prev.theme === 'dark' ? 'auto' : 'light'
      }));
    },

    setAnimationState: (animationState: AnimationState) => {
      setAppState(prev => ({ ...prev, animationState }));
    },

    toggleMobileMenu: () => {
      setAppState(prev => ({ ...prev, isMobileMenuOpen: !prev.isMobileMenuOpen }));
    }
  };

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * Apply theme to document root
   */
  useEffect(() => {
    const root = document.documentElement;
    
    if (appState.theme === 'auto') {
      // Use system preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const applySystemTheme = () => {
        root.classList.toggle('dark', mediaQuery.matches);
      };
      
      applySystemTheme();
      mediaQuery.addEventListener('change', applySystemTheme);
      
      return () => mediaQuery.removeEventListener('change', applySystemTheme);
    } else {
      // Use explicit theme
      root.classList.toggle('dark', appState.theme === 'dark');
    }
  }, [appState.theme]);

  /**
   * Close mobile menu when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (appState.isMobileMenuOpen) {
        const target = event.target as Element;
        if (!target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
          actions.toggleMobileMenu();
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [appState.isMobileMenuOpen]);

  /**
   * Handle keyboard shortcuts
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape key closes mobile menu
      if (event.key === 'Escape' && appState.isMobileMenuOpen) {
        actions.toggleMobileMenu();
      }
      
      // Theme toggle with Ctrl/Cmd + Shift + T
      if (event.key === 'T' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
        event.preventDefault();
        actions.toggleTheme();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [appState.isMobileMenuOpen]);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const contextValue: AppContextType = {
    ...appState,
    ...actions
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <AppContext.Provider value={contextValue}>
      <ErrorBoundary>
        <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ${className}`}>
          {/* Header */}
          <Header />

          {/* Main Layout */}
          <div className="flex">
            {/* Desktop Navigation */}
            <aside className="hidden lg:block w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700">
              <Navigation />
            </aside>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
              {appState.isMobileMenuOpen && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={actions.toggleMobileMenu}
                  />
                  
                  {/* Mobile Menu */}
                  <motion.aside
                    variants={mobileMenuVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="mobile-menu fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-50 lg:hidden"
                  >
                    <Navigation />
                  </motion.aside>
                </>
              )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 min-h-screen">
              <motion.div
                variants={layoutVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="p-4 lg:p-8"
              >
                {/* Loading State */}
                <AnimatePresence>
                  {appState.isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-75 flex items-center justify-center z-30"
                    >
                      <LoadingSpinner size="large" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error State */}
                {appState.error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                  >
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                      Error: {appState.error.code}
                    </h3>
                    <p className="text-red-600 dark:text-red-300">
                      {appState.error.message}
                    </p>
                    <button
                      onClick={() => actions.setError(null)}
                      className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Dismiss
                    </button>
                  </motion.div>
                )}

                {/* Content */}
                {children}
              </motion.div>
            </main>
          </div>
        </div>
      </ErrorBoundary>
    </AppContext.Provider>
  );
}
