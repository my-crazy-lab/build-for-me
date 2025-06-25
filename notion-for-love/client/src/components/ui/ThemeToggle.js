/**
 * Love Journey - Theme Toggle Component
 * 
 * Beautiful theme toggle component that switches between light and dark modes
 * with smooth animations and visual feedback.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { clsx } from 'clsx';

const ThemeToggle = ({ size = 'md', className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const sizes = {
    sm: {
      container: 'w-12 h-6',
      toggle: 'w-5 h-5',
      icon: 'w-3 h-3',
    },
    md: {
      container: 'w-14 h-7',
      toggle: 'w-6 h-6',
      icon: 'w-4 h-4',
    },
    lg: {
      container: 'w-16 h-8',
      toggle: 'w-7 h-7',
      icon: 'w-5 h-5',
    },
  };

  const sizeConfig = sizes[size];

  return (
    <motion.button
      className={clsx(
        'relative inline-flex items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        isDark 
          ? 'bg-primary-600 hover:bg-primary-700' 
          : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600',
        sizeConfig.container,
        className
      )}
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Background gradient */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          background: isDark
            ? 'linear-gradient(45deg, #1e293b, #334155)'
            : 'linear-gradient(45deg, #fbbf24, #f59e0b)',
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Toggle circle */}
      <motion.div
        className={clsx(
          'relative inline-block rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out flex items-center justify-center',
          sizeConfig.toggle
        )}
        animate={{
          x: isDark ? '100%' : '0%',
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {/* Icon */}
        <motion.div
          initial={false}
          animate={{
            scale: 1,
            rotate: isDark ? 360 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? (
            <Moon 
              className={clsx(
                'text-primary-600',
                sizeConfig.icon
              )} 
            />
          ) : (
            <Sun 
              className={clsx(
                'text-yellow-500',
                sizeConfig.icon
              )} 
            />
          )}
        </motion.div>
      </motion.div>

      {/* Background icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1">
        <motion.div
          animate={{
            opacity: isDark ? 0 : 1,
            scale: isDark ? 0.8 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <Sun className={clsx('text-yellow-600', sizeConfig.icon)} />
        </motion.div>
        <motion.div
          animate={{
            opacity: isDark ? 1 : 0,
            scale: isDark ? 1 : 0.8,
          }}
          transition={{ duration: 0.2 }}
        >
          <Moon className={clsx('text-blue-200', sizeConfig.icon)} />
        </motion.div>
      </div>
    </motion.button>
  );
};

export default ThemeToggle;
