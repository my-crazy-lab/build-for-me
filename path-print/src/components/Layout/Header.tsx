/**
 * Career Path Visualization - Header Component
 * 
 * This component provides the main header with branding, user information,
 * theme toggle, and mobile menu controls.
 * 
 * @fileoverview Header component with branding and controls
 * @author Career Path Visualization Team
 * @version 1.0.0
 * 
 * MAINTAINER NOTES:
 * - Header is responsive and adapts to mobile/desktop layouts
 * - Theme toggle provides visual feedback for current theme
 * - Mobile menu button only shows on smaller screens
 * - User profile section shows current user information
 * - All interactions use smooth animations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Monitor,
  User,
  ChevronDown,
  Settings,
  LogOut
} from 'lucide-react';
import { useAppContext } from './AppLayout';

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

/**
 * Animation variants for header elements
 */
const headerVariants = {
  initial: {
    y: -20,
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

/**
 * Animation variants for mobile menu button
 */
const menuButtonVariants = {
  closed: {
    rotate: 0
  },
  open: {
    rotate: 180,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

/**
 * Animation variants for theme toggle
 */
const themeToggleVariants = {
  initial: {
    scale: 0.8,
    opacity: 0
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
};

// ============================================================================
// COMPONENT PROPS
// ============================================================================

/**
 * Props for the Header component
 */
export interface HeaderProps {
  /** Custom CSS classes */
  className?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Header component
 * 
 * Provides the main application header with branding, user controls,
 * theme toggle, and mobile navigation controls.
 * 
 * @param props - Component props
 * @returns JSX element representing the header
 */
export function Header({ className = '' }: HeaderProps): JSX.Element {
  const { 
    careerData, 
    theme, 
    isMobileMenuOpen, 
    toggleTheme, 
    toggleMobileMenu 
  } = useAppContext();

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  /**
   * Get the appropriate theme icon
   */
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return Sun;
      case 'dark':
        return Moon;
      case 'auto':
      default:
        return Monitor;
    }
  };

  /**
   * Get theme label for accessibility
   */
  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Switch to dark theme';
      case 'dark':
        return 'Switch to auto theme';
      case 'auto':
      default:
        return 'Switch to light theme';
    }
  };

  /**
   * Render user profile section
   */
  const renderUserProfile = () => {
    if (!careerData?.profile) {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <User size={16} className="text-gray-600 dark:text-gray-300" />
          </div>
          <span className="hidden md:block text-sm text-gray-700 dark:text-gray-300">
            Guest User
          </span>
        </div>
      );
    }

    const { profile } = careerData;

    return (
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div className="relative">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
        </div>

        {/* User info */}
        <div className="hidden md:block">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {profile.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {profile.title}
          </p>
        </div>

        {/* Dropdown arrow */}
        <ChevronDown 
          size={16} 
          className="hidden md:block text-gray-400 dark:text-gray-500" 
        />
      </div>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  const ThemeIcon = getThemeIcon();

  return (
    <motion.header
      variants={headerVariants}
      initial="initial"
      animate="animate"
      className={`
        sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700
        backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95
        ${className}
      `}
    >
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <motion.button
              variants={menuButtonVariants}
              animate={isMobileMenuOpen ? "open" : "closed"}
              onClick={toggleMobileMenu}
              className="mobile-menu-button lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </motion.button>

            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CP</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Career Path
                </h1>
                <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
                  Visualization Dashboard
                </p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <motion.button
              variants={themeToggleVariants}
              initial="initial"
              animate="animate"
              whileTap="tap"
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={getThemeLabel()}
              title={getThemeLabel()}
            >
              <ThemeIcon size={18} />
            </motion.button>

            {/* User Profile */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="User menu"
              >
                {renderUserProfile()}
              </button>

              {/* User dropdown menu would go here */}
              {/* TODO: Implement dropdown menu with profile options */}
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar for loading states */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </div>
    </motion.header>
  );
}
