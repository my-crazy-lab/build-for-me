/**
 * Loading Spinner Component
 * 
 * A reusable loading spinner with different sizes and styles.
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  className = '',
  text = null,
  fullScreen = false 
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  // Color classes
  const colorClasses = {
    primary: 'border-primary-600',
    secondary: 'border-secondary-600',
    white: 'border-white',
    gray: 'border-gray-600',
  };

  // Text size classes
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const spinnerClasses = clsx(
    'border-2 border-t-transparent rounded-full',
    sizeClasses[size],
    colorClasses[color],
    className
  );

  const textClasses = clsx(
    'mt-2 text-gray-600 dark:text-gray-400',
    textSizeClasses[size]
  );

  const spinner = (
    <motion.div
      className={spinnerClasses}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );

  const content = (
    <div className="flex flex-col items-center justify-center">
      {spinner}
      {text && <p className={textClasses}>{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
