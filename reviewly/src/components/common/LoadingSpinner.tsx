/**
 * Loading Spinner Component for Reviewly Application
 * 
 * This component provides a beautiful, animated loading spinner with customizable
 * size, color, and message. It features smooth animations and supports different
 * variants for various use cases throughout the application.
 * 
 * Features:
 * - Multiple sizes (small, medium, large)
 * - Customizable colors
 * - Optional loading message
 * - Smooth animations
 * - Accessible design
 * - Responsive layout
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React from 'react';
import { motion } from 'framer-motion';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  message?: string;
  className?: string;
  overlay?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#667eea',
  message,
  className = '',
  overlay = false,
}) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large',
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear" as const,
      },
    },
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
  };

  const messageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.2, duration: 0.3 }
    },
  };

  const content = (
    <motion.div
      className={`loading-spinner-container ${sizeClasses[size]} ${className}`}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className="spinner"
        style={{ borderTopColor: color }}
        variants={spinnerVariants}
        animate="animate"
      />
      {message && (
        <motion.div
          className="loading-message"
          variants={messageVariants}
          initial="initial"
          animate="animate"
        >
          {message}
        </motion.div>
      )}
    </motion.div>
  );

  if (overlay) {
    return (
      <motion.div
        className="loading-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

// Specialized loading components for common use cases
export const PageLoader: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <LoadingSpinner size="large" message={message} overlay />
);

export const ButtonLoader: React.FC<{ color?: string }> = ({ color = '#ffffff' }) => (
  <LoadingSpinner size="small" color={color} />
);

export const InlineLoader: React.FC<{ message?: string }> = ({ message }) => (
  <LoadingSpinner size="small" message={message} />
);

// Loading skeleton component for content placeholders
interface LoadingSkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius = '0.25rem',
  className = '',
}) => {
  return (
    <div
      className={`loading-skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
      }}
    />
  );
};

// Loading card component for list items
export const LoadingCard: React.FC = () => (
  <div className="loading-card">
    <LoadingSkeleton height="3rem" borderRadius="0.5rem" className="mb-3" />
    <LoadingSkeleton height="1rem" width="80%" className="mb-2" />
    <LoadingSkeleton height="1rem" width="60%" className="mb-2" />
    <LoadingSkeleton height="1rem" width="40%" />
  </div>
);

// Loading table component
export const LoadingTable: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => (
  <div className="loading-table">
    {/* Header */}
    <div className="loading-table-header">
      {Array.from({ length: columns }).map((_, index) => (
        <LoadingSkeleton key={index} height="2rem" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="loading-table-row">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <LoadingSkeleton key={colIndex} height="1.5rem" />
        ))}
      </div>
    ))}
  </div>
);

// Loading dots component for subtle loading indicators
export const LoadingDots: React.FC<{ color?: string }> = ({ color = '#667eea' }) => {
  const dotVariants = {
    initial: { y: 0 },
    animate: {
      y: [-4, 0, -4],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <div className="loading-dots">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="loading-dot"
          style={{ backgroundColor: color }}
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: index * 0.1 }}
        />
      ))}
    </div>
  );
};

// Progress bar component
interface LoadingProgressProps {
  progress: number; // 0-100
  color?: string;
  backgroundColor?: string;
  height?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export const LoadingProgress: React.FC<LoadingProgressProps> = ({
  progress,
  color = '#667eea',
  backgroundColor = '#e5e7eb',
  height = '0.5rem',
  showPercentage = false,
  animated = true,
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="loading-progress-container">
      <div
        className="loading-progress-track"
        style={{ backgroundColor, height }}
      >
        <motion.div
          className="loading-progress-bar"
          style={{ backgroundColor, height }}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={animated ? { duration: 0.5, ease: "easeOut" as const } : { duration: 0 }}
        />
      </div>
      {showPercentage && (
        <div className="loading-progress-text">
          {Math.round(clampedProgress)}%
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
