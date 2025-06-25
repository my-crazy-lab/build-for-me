/**
 * Love Journey - Loading Spinner Component
 *
 * Beautiful loading spinner with multiple variants and romantic animations.
 * Includes heartbeat and pulse effects for enhanced user experience.
 *
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { clsx } from 'clsx';

const LoadingSpinner = ({
  size = 'md',
  variant = 'spinner',
  className = '',
  text,
  ...props
}) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const SpinnerVariant = () => (
    <div className={clsx(
      'animate-spin rounded-full border-2 border-primary-200 border-t-primary-500 dark:border-primary-800 dark:border-t-primary-400',
      sizes[size]
    )} />
  );

  const HeartVariant = () => (
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={clsx('text-primary-500', sizes[size])}
    >
      <Heart className="w-full h-full fill-current" />
    </motion.div>
  );

  const PulseVariant = () => (
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={clsx(
        'rounded-full bg-primary-500',
        sizes[size]
      )}
    />
  );

  const DotsVariant = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut"
          }}
          className={clsx(
            'rounded-full bg-primary-500',
            size === 'xs' ? 'w-1 h-1' :
            size === 'sm' ? 'w-1.5 h-1.5' :
            size === 'md' ? 'w-2 h-2' :
            size === 'lg' ? 'w-3 h-3' : 'w-4 h-4'
          )}
        />
      ))}
    </div>
  );

  const variants = {
    spinner: SpinnerVariant,
    heart: HeartVariant,
    pulse: PulseVariant,
    dots: DotsVariant,
  };

  const SelectedVariant = variants[variant] || SpinnerVariant;

  return (
    <div
      className={clsx('flex flex-col items-center justify-center', className)}
      {...props}
    >
      <SelectedVariant />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={clsx(
            'mt-2 text-gray-600 dark:text-gray-400 font-medium',
            textSizes[size]
          )}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
