/**
 * Career Path Visualization - Loading Spinner Component
 * 
 * This component provides various loading spinner animations for different
 * loading states throughout the application.
 * 
 * @fileoverview Loading spinner component with multiple variants
 * @author Career Path Visualization Team
 * @version 1.0.0
 * 
 * MAINTAINER NOTES:
 * - Multiple spinner variants for different use cases
 * - Configurable size, color, and animation speed
 * - Accessible with proper ARIA labels
 * - Smooth animations using Framer Motion
 * - Responsive design for different screen sizes
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, RotateCw } from 'lucide-react';

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Size options for the loading spinner
 */
export type SpinnerSize = 'small' | 'medium' | 'large' | 'extra-large';

/**
 * Variant options for different spinner styles
 */
export type SpinnerVariant = 'default' | 'dots' | 'pulse' | 'bars' | 'ring';

/**
 * Props for the LoadingSpinner component
 */
export interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: SpinnerSize;
  /** Visual variant of the spinner */
  variant?: SpinnerVariant;
  /** Custom color (CSS color value) */
  color?: string;
  /** Loading message to display */
  message?: string;
  /** Whether to show the message */
  showMessage?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Animation speed multiplier */
  speed?: number;
  /** Whether to center the spinner */
  centered?: boolean;
}

// ============================================================================
// SIZE CONFIGURATIONS
// ============================================================================

/**
 * Size configuration mapping
 */
const sizeConfig = {
  small: {
    spinner: 16,
    container: 'w-4 h-4',
    text: 'text-xs',
    gap: 'gap-2'
  },
  medium: {
    spinner: 24,
    container: 'w-6 h-6',
    text: 'text-sm',
    gap: 'gap-3'
  },
  large: {
    spinner: 32,
    container: 'w-8 h-8',
    text: 'text-base',
    gap: 'gap-4'
  },
  'extra-large': {
    spinner: 48,
    container: 'w-12 h-12',
    text: 'text-lg',
    gap: 'gap-4'
  }
};

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

/**
 * Rotation animation for spinners
 */
const rotateAnimation = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

/**
 * Pulse animation variant
 */
const pulseAnimation = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

/**
 * Dots animation variants
 */
const dotsAnimation = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

/**
 * Bars animation variants
 */
const barsAnimation = {
  animate: {
    scaleY: [1, 2, 1],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// ============================================================================
// SPINNER VARIANTS
// ============================================================================

/**
 * Default spinner with rotating icon
 */
const DefaultSpinner: React.FC<{ size: number; color: string; speed: number }> = ({ 
  size, 
  color, 
  speed 
}) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{
      duration: 1 / speed,
      repeat: Infinity,
      ease: "linear"
    }}
  >
    <Loader2 size={size} className={color} />
  </motion.div>
);

/**
 * Dots spinner with bouncing dots
 */
const DotsSpinner: React.FC<{ size: number; color: string; speed: number }> = ({ 
  size, 
  color, 
  speed 
}) => {
  const dotSize = size / 4;
  const gap = size / 8;

  return (
    <div className="flex items-center justify-center" style={{ gap }}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`rounded-full ${color.replace('text-', 'bg-')}`}
          style={{ width: dotSize, height: dotSize }}
          animate={{
            y: [0, -size / 3, 0],
            transition: {
              duration: 0.6 / speed,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.1
            }
          }}
        />
      ))}
    </div>
  );
};

/**
 * Pulse spinner with scaling circle
 */
const PulseSpinner: React.FC<{ size: number; color: string; speed: number }> = ({ 
  size, 
  color, 
  speed 
}) => (
  <motion.div
    className={`rounded-full border-2 ${color.replace('text-', 'border-')}`}
    style={{ width: size, height: size }}
    animate={{
      scale: [1, 1.3, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5 / speed,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }}
  />
);

/**
 * Bars spinner with animated bars
 */
const BarsSpinner: React.FC<{ size: number; color: string; speed: number }> = ({ 
  size, 
  color, 
  speed 
}) => {
  const barWidth = size / 6;
  const barHeight = size;
  const gap = size / 8;

  return (
    <div className="flex items-end justify-center" style={{ gap, height: size }}>
      {[0, 1, 2, 3].map((index) => (
        <motion.div
          key={index}
          className={`${color.replace('text-', 'bg-')} rounded-sm`}
          style={{ width: barWidth, height: barHeight / 2 }}
          animate={{
            scaleY: [0.5, 1.5, 0.5],
            transition: {
              duration: 0.8 / speed,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.1
            }
          }}
        />
      ))}
    </div>
  );
};

/**
 * Ring spinner with rotating ring
 */
const RingSpinner: React.FC<{ size: number; color: string; speed: number }> = ({ 
  size, 
  color, 
  speed 
}) => (
  <motion.div
    className={`rounded-full border-2 border-transparent ${color.replace('text-', 'border-t-')}`}
    style={{ width: size, height: size }}
    animate={{
      rotate: 360,
      transition: {
        duration: 1 / speed,
        repeat: Infinity,
        ease: "linear"
      }
    }}
  />
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Loading spinner component with multiple variants and customization options
 * 
 * @param props - Component props
 * @returns JSX element representing the loading spinner
 */
export function LoadingSpinner({
  size = 'medium',
  variant = 'default',
  color = 'text-blue-600',
  message = 'Loading...',
  showMessage = false,
  className = '',
  speed = 1,
  centered = false
}: LoadingSpinnerProps): JSX.Element {
  const config = sizeConfig[size];
  const spinnerSize = config.spinner;

  // ============================================================================
  // RENDER SPINNER VARIANT
  // ============================================================================

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return <DotsSpinner size={spinnerSize} color={color} speed={speed} />;
      case 'pulse':
        return <PulseSpinner size={spinnerSize} color={color} speed={speed} />;
      case 'bars':
        return <BarsSpinner size={spinnerSize} color={color} speed={speed} />;
      case 'ring':
        return <RingSpinner size={spinnerSize} color={color} speed={speed} />;
      case 'default':
      default:
        return <DefaultSpinner size={spinnerSize} color={color} speed={speed} />;
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  const containerClasses = `
    flex items-center
    ${centered ? 'justify-center' : ''}
    ${showMessage ? `flex-col ${config.gap}` : ''}
    ${className}
  `;

  return (
    <div className={containerClasses} role="status" aria-label={message}>
      {/* Spinner */}
      <div className={config.container}>
        {renderSpinner()}
      </div>

      {/* Loading Message */}
      {showMessage && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`${config.text} ${color} font-medium`}
        >
          {message}
        </motion.p>
      )}

      {/* Screen reader text */}
      <span className="sr-only">{message}</span>
    </div>
  );
}

// ============================================================================
// PRESET COMPONENTS
// ============================================================================

/**
 * Small loading spinner for inline use
 */
export const SmallSpinner: React.FC<Partial<LoadingSpinnerProps>> = (props) => (
  <LoadingSpinner size="small" {...props} />
);

/**
 * Large loading spinner for full-page loading
 */
export const LargeSpinner: React.FC<Partial<LoadingSpinnerProps>> = (props) => (
  <LoadingSpinner 
    size="large" 
    showMessage={true} 
    centered={true} 
    {...props} 
  />
);

/**
 * Page loading spinner with overlay
 */
export const PageLoader: React.FC<{ message?: string }> = ({ 
  message = "Loading page..." 
}) => (
  <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
    <LoadingSpinner
      size="extra-large"
      variant="ring"
      message={message}
      showMessage={true}
      centered={true}
    />
  </div>
);
