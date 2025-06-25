/**
 * Love Journey - Animation System
 * 
 * Comprehensive animation utilities and components using Framer Motion
 * for smooth transitions, hover effects, and micro-interactions.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import { motion } from 'framer-motion';

// Animation Variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

export const slideInFromBottom = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 100 }
};

export const slideInFromTop = {
  initial: { opacity: 0, y: -100 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -100 }
};

export const rotateIn = {
  initial: { opacity: 0, rotate: -180 },
  animate: { opacity: 1, rotate: 0 },
  exit: { opacity: 0, rotate: 180 }
};

export const bounceIn = {
  initial: { opacity: 0, scale: 0.3 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  },
  exit: { opacity: 0, scale: 0.3 }
};

export const heartBeat = {
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

export const float = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
};

export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

export const shimmer = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Stagger Animation Variants
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

// Page Transition Variants
export const pageTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3, ease: "easeInOut" }
};

export const modalTransition = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 20 },
  transition: { duration: 0.2, ease: "easeOut" }
};

// Hover Effects
export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 }
};

export const hoverLift = {
  whileHover: { y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" },
  whileTap: { y: 0 }
};

export const hoverGlow = {
  whileHover: { 
    boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
    transition: { duration: 0.2 }
  }
};

export const hoverRotate = {
  whileHover: { rotate: 5 },
  whileTap: { rotate: -5 }
};

// Loading Animations
export const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export const dotsVariants = {
  animate: {
    transition: {
      staggerChildren: 0.2,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

export const dotVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  }
};

export const progressBarVariants = {
  initial: { width: 0 },
  animate: { width: "100%" },
  transition: { duration: 2, ease: "easeInOut" }
};

// Animated Components
export const AnimatedCard = ({ children, variant = fadeInUp, delay = 0, ...props }) => (
  <motion.div
    variants={variant}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ delay, duration: 0.3 }}
    {...props}
  >
    {children}
  </motion.div>
);

export const AnimatedButton = ({ children, ...props }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
    {...props}
  >
    {children}
  </motion.button>
);

export const AnimatedIcon = ({ children, animation = pulse, ...props }) => (
  <motion.div
    variants={animation}
    animate="animate"
    {...props}
  >
    {children}
  </motion.div>
);

export const AnimatedList = ({ children, ...props }) => (
  <motion.div
    variants={staggerContainer}
    initial="initial"
    animate="animate"
    {...props}
  >
    {children}
  </motion.div>
);

export const AnimatedListItem = ({ children, index = 0, ...props }) => (
  <motion.div
    variants={staggerItem}
    transition={{ delay: index * 0.1 }}
    {...props}
  >
    {children}
  </motion.div>
);

export const AnimatedPage = ({ children, ...props }) => (
  <motion.div
    variants={pageTransition}
    initial="initial"
    animate="animate"
    exit="exit"
    {...props}
  >
    {children}
  </motion.div>
);

export const AnimatedModal = ({ children, isOpen, ...props }) => (
  <motion.div
    variants={modalTransition}
    initial="initial"
    animate={isOpen ? "animate" : "exit"}
    {...props}
  >
    {children}
  </motion.div>
);

// Loading Components
export const LoadingSpinner = ({ size = "md", color = "primary" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  const colorClasses = {
    primary: "border-primary-500",
    secondary: "border-secondary-500",
    white: "border-white",
    gray: "border-gray-500"
  };

  return (
    <motion.div
      variants={spinnerVariants}
      animate="animate"
      className={`${sizeClasses[size]} border-2 ${colorClasses[color]} border-t-transparent rounded-full`}
    />
  );
};

export const LoadingDots = ({ color = "primary" }) => {
  const colorClasses = {
    primary: "bg-primary-500",
    secondary: "bg-secondary-500",
    white: "bg-white",
    gray: "bg-gray-500"
  };

  return (
    <motion.div
      variants={dotsVariants}
      animate="animate"
      className="flex space-x-1"
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          variants={dotVariants}
          className={`w-2 h-2 rounded-full ${colorClasses[color]}`}
        />
      ))}
    </motion.div>
  );
};

export const LoadingProgress = ({ progress = 0, color = "primary" }) => {
  const colorClasses = {
    primary: "bg-primary-500",
    secondary: "bg-secondary-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500"
  };

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <motion.div
        className={`h-2 rounded-full ${colorClasses[color]}`}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
};

// Skeleton Loading
export const SkeletonLoader = ({ className = "", ...props }) => (
  <motion.div
    className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`}
    style={{
      background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
      backgroundSize: "200% 100%"
    }}
    variants={shimmer}
    animate="animate"
    {...props}
  />
);

// Transition Utilities
export const createStaggerTransition = (staggerDelay = 0.1) => ({
  animate: {
    transition: {
      staggerChildren: staggerDelay
    }
  }
});

export const createDelayedTransition = (delay = 0) => ({
  transition: { delay }
});

export const createSpringTransition = (stiffness = 300, damping = 20) => ({
  transition: {
    type: "spring",
    stiffness,
    damping
  }
});

// Animation Hooks
export const useAnimationSequence = (animations, delay = 1000) => {
  const [currentAnimation, setCurrentAnimation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimation((prev) => (prev + 1) % animations.length);
    }, delay);

    return () => clearInterval(interval);
  }, [animations.length, delay]);

  return animations[currentAnimation];
};

export default {
  // Variants
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  slideInFromBottom,
  slideInFromTop,
  rotateIn,
  bounceIn,
  heartBeat,
  float,
  pulse,
  shimmer,
  staggerContainer,
  staggerItem,
  pageTransition,
  modalTransition,
  hoverScale,
  hoverLift,
  hoverGlow,
  hoverRotate,
  
  // Components
  AnimatedCard,
  AnimatedButton,
  AnimatedIcon,
  AnimatedList,
  AnimatedListItem,
  AnimatedPage,
  AnimatedModal,
  LoadingSpinner,
  LoadingDots,
  LoadingProgress,
  SkeletonLoader,
  
  // Utilities
  createStaggerTransition,
  createDelayedTransition,
  createSpringTransition,
  useAnimationSequence
};
