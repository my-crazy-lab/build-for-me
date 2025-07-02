/**
 * Simple Theme Toggle Component for Reviewly Application
 * 
 * A simplified theme toggle that works without complex animations or enum imports.
 * Provides basic dark/light mode switching functionality.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState } from 'react';
import { useTheme } from '../../contexts/SimpleThemeContext';
import './SimpleThemeToggle.css';

interface SimpleThemeToggleProps {
  variant?: 'button' | 'dropdown';
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  className?: string;
}

const SimpleThemeToggle: React.FC<SimpleThemeToggleProps> = ({
  variant = 'button',
  size = 'medium',
  showLabel = false,
  className = '',
}) => {
  const { mode, isDark, setThemeMode, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const themeOptions = [
    { mode: 'light' as const, icon: '☀️', label: 'Light' },
    { mode: 'dark' as const, icon: '🌙', label: 'Dark' },
    { mode: 'auto' as const, icon: '🔄', label: 'Auto' },
  ];

  const currentTheme = themeOptions.find(option => option.mode === mode) || themeOptions[0];

  // Handle theme change
  const handleThemeChange = (newMode: 'light' | 'dark' | 'auto') => {
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

  // Render button variant
  if (variant === 'button') {
    return (
      <div className={`simple-theme-toggle-container ${className}`}>
        <button
          className={`simple-theme-toggle-button ${size} ${isDark ? 'dark' : 'light'}`}
          onClick={handleToggle}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
          title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        >
          <span className="theme-icon">
            {currentTheme.icon}
          </span>
          
          {showLabel && (
            <span className="theme-label">
              {currentTheme.label}
            </span>
          )}
        </button>
      </div>
    );
  }

  // Render dropdown variant
  return (
    <div className={`simple-theme-dropdown-container ${className}`}>
      <button
        className={`simple-theme-dropdown-trigger ${size}`}
        onClick={handleToggle}
        aria-label="Theme options"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <span className="current-theme-icon">{currentTheme.icon}</span>
        {showLabel && <span className="current-theme-label">{currentTheme.label}</span>}
        <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>
          ▼
        </span>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div
            className="dropdown-backdrop"
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Menu */}
          <div className="simple-theme-dropdown-menu">
            {themeOptions.map((option) => (
              <button
                key={option.mode}
                className={`theme-option ${mode === option.mode ? 'active' : ''}`}
                onClick={() => handleThemeChange(option.mode)}
              >
                <span className="option-icon">{option.icon}</span>
                <span className="option-label">{option.label}</span>
                {mode === option.mode && (
                  <span className="option-check">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SimpleThemeToggle;
