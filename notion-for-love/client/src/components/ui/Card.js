/**
 * Love Journey - Card Component
 * 
 * Reusable card component with hover effects, variants, and flexible content.
 * Includes Framer Motion animations and responsive design.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  clickable = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200 ease-in-out';

  const variants = {
    default: 'shadow-sm',
    elevated: 'shadow-md',
    outlined: 'border-2 shadow-none',
    glass: 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-white/20 dark:border-gray-700/20',
    romantic: 'bg-gradient-to-br from-primary-50 to-neutral-50 dark:from-primary-900/20 dark:to-neutral-900/20 border-primary-200 dark:border-primary-700',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const hoverEffects = hover ? 'hover:shadow-lg hover:-translate-y-1' : '';
  const clickableEffects = clickable ? 'cursor-pointer hover:shadow-md' : '';

  const cardClasses = clsx(
    baseClasses,
    variants[variant],
    paddings[padding],
    hoverEffects,
    clickableEffects,
    className
  );

  const MotionCard = motion.div;

  return (
    <MotionCard
      className={cardClasses}
      onClick={onClick}
      whileHover={hover || clickable ? { y: -2 } : {}}
      whileTap={clickable ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      {...props}
    >
      {children}
    </MotionCard>
  );
};

// Card Header Component
const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div
      className={clsx('flex items-center justify-between mb-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Title Component
const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h3
      className={clsx('text-lg font-semibold text-gray-900 dark:text-gray-100', className)}
      {...props}
    >
      {children}
    </h3>
  );
};

// Card Description Component
const CardDescription = ({ children, className = '', ...props }) => {
  return (
    <p
      className={clsx('text-sm text-gray-600 dark:text-gray-400', className)}
      {...props}
    >
      {children}
    </p>
  );
};

// Card Content Component
const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div
      className={clsx('', className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Footer Component
const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div
      className={clsx('flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700', className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Attach sub-components to main Card component
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
