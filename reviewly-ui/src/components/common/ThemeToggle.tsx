/**
 * Theme Toggle Component for Reviewly Application
 * 
 * This component provides a beautiful, animated toggle for switching between
 * light, dark, and auto theme modes. It features smooth transitions, icons,
 * and accessibility support.
 * 
 * Features:
 * - Light/Dark/Auto theme modes
 * - Smooth animations
 * - Icon transitions
 * - Accessibility support
 * - Keyboard navigation
 * - Tooltip support
 * - Multiple variants
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeMode } from '../../types';
import './ThemeToggle.css';

interface ThemeToggleProps {
  variant?: 'button' | 'switch' | 'dropdown';
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  showTooltip?: boolean;
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'button',
  size = 'medium',
  showLabel = false,
  showTooltip = true,
  className = '',
}) => {
  const { mode, isDark, setThemeMode, toggleTheme, isTransitioning } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showTooltipState, setShowTooltipState] = useState(false);

  const themeOptions = [
    { mode: 'light' as ThemeMode, icon: '☀️', label: 'Light' },
    { mode: 'dark' as ThemeMode, icon: '🌙', label: 'Dark' },
    { mode: 'auto' as ThemeMode, icon: '🔄', label: 'Auto' },
  ];

  const currentTheme = themeOptions.find(option => option.mode === mode) || themeOptions[0];

  // Animation variants
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    transitioning: {
      rotate: 360,
      transition: { duration: 0.5, ease: "easeInOut" as const }
    },
  };

  const iconVariants = {
    initial: { rotate: 0, scale: 1 },
    animate: {
      rotate: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" as const }
    },
    exit: {
      rotate: 180,
      scale: 0,
      transition: { duration: 0.2, ease: "easeIn" as const }
    },
  };

  const dropdownVariants = {
    initial: { opacity: 0, y: -10, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" as const }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.15, ease: "easeIn" as const }
    },
  };

  const tooltipVariants = {
    initial: { opacity: 0, y: 5 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.5, duration: 0.2 }
    },
    exit: { 
      opacity: 0, 
      y: 5,
      transition: { duration: 0.15 }
    },
  };

  // Handle theme change
  const handleThemeChange = (newMode: ThemeMode) => {
    setThemeMode(newMode);
    setIsDropdownOpen(false);
  };

  // Handle toggle (for button variant)
  const handleToggle = () => {
    if (variant === 'button') {
      toggleTheme();
    } else {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    } else if (e.key === 'Escape' && isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };

  // Render button variant
  if (variant === 'button') {
    return (
      <div className={`theme-toggle-container ${className}`}>
        <motion.button
          className={`theme-toggle-button ${size} ${isDark ? 'dark' : 'light'}`}
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          animate={isTransitioning ? "transitioning" : "initial"}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => showTooltip && setShowTooltipState(true)}
          onMouseLeave={() => setShowTooltipState(false)}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
          disabled={isTransitioning}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={currentTheme.mode}
              className="theme-icon"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {currentTheme.icon}
            </motion.span>
          </AnimatePresence>
          
          {showLabel && (
            <span className="theme-label">
              {currentTheme.label}
            </span>
          )}
        </motion.button>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && showTooltipState && (
            <motion.div
              className="theme-tooltip"
              variants={tooltipVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              Switch to {isDark ? 'light' : 'dark'} theme
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Render switch variant
  if (variant === 'switch') {
    return (
      <div className={`theme-switch-container ${className}`}>
        <motion.div
          className={`theme-switch ${size} ${isDark ? 'dark' : 'light'}`}
          whileTap={{ scale: 0.95 }}
        >
          <input
            type="checkbox"
            checked={isDark}
            onChange={toggleTheme}
            className="theme-switch-input"
            aria-label="Toggle dark mode"
            disabled={isTransitioning}
          />
          <motion.div
            className="theme-switch-slider"
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <motion.div
              className="theme-switch-thumb"
              animate={{ x: isDark ? 24 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={isDark ? 'dark' : 'light'}
                  className="switch-icon"
                  variants={iconVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {isDark ? '🌙' : '☀️'}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {showLabel && (
          <span className="switch-label">
            {isDark ? 'Dark' : 'Light'} Mode
          </span>
        )}
      </div>
    );
  }

  // Render dropdown variant
  return (
    <div className={`theme-dropdown-container ${className}`}>
      <motion.button
        className={`theme-dropdown-trigger ${size}`}
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-label="Theme options"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <span className="current-theme-icon">{currentTheme.icon}</span>
        {showLabel && <span className="current-theme-label">{currentTheme.label}</span>}
        <motion.span
          className="dropdown-arrow"
          animate={{ rotate: isDropdownOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="dropdown-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDropdownOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              className="theme-dropdown-menu"
              variants={dropdownVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {themeOptions.map((option) => (
                <motion.button
                  key={option.mode}
                  className={`theme-option ${mode === option.mode ? 'active' : ''}`}
                  onClick={() => handleThemeChange(option.mode)}
                  whileHover={{ backgroundColor: 'var(--color-background)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="option-icon">{option.icon}</span>
                  <span className="option-label">{option.label}</span>
                  {mode === option.mode && (
                    <motion.span
                      className="option-check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggle;
