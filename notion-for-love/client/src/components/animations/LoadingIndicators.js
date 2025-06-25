/**
 * Love Journey - Loading Indicators
 * 
 * Beautiful and themed loading indicators with heart animations
 * and romantic touches for the Love Journey application.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Loader, Coffee, Star, Calendar } from 'lucide-react';

// Heart Loading Animation
export const HeartLoader = ({ size = "md", color = "red" }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const colorClasses = {
    red: "text-red-500",
    pink: "text-pink-500",
    purple: "text-purple-500",
    primary: "text-primary-500"
  };

  return (
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 5, -5, 0]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`${sizeClasses[size]} ${colorClasses[color]}`}
    >
      <Heart className="w-full h-full fill-current" />
    </motion.div>
  );
};

// Floating Hearts
export const FloatingHearts = ({ count = 3 }) => {
  return (
    <div className="relative w-16 h-16">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-red-400"
          initial={{ opacity: 0, y: 20, x: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: [20, -20, -40],
            x: [0, Math.random() * 20 - 10, Math.random() * 40 - 20]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut"
          }}
          style={{
            left: `${20 + i * 15}%`,
            top: "50%"
          }}
        >
          <Heart className="w-4 h-4 fill-current" />
        </motion.div>
      ))}
    </div>
  );
};

// Pulse Loading
export const PulseLoader = ({ text = "Loading...", variant = "heart" }) => {
  const icons = {
    heart: Heart,
    star: Star,
    calendar: Calendar,
    coffee: Coffee
  };

  const Icon = icons[variant] || Heart;

  return (
    <div className="flex flex-col items-center space-y-4">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-12 h-12 text-primary-500"
      >
        <Icon className="w-full h-full" />
      </motion.div>
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="text-sm text-gray-600 dark:text-gray-400"
      >
        {text}
      </motion.p>
    </div>
  );
};

// Spinning Hearts
export const SpinningHearts = () => {
  return (
    <div className="relative w-16 h-16">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 text-red-400"
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.2
          }}
          style={{
            transformOrigin: "center"
          }}
        >
          <Heart 
            className="w-4 h-4 fill-current absolute"
            style={{
              top: `${10 + i * 5}px`,
              left: `${10 + i * 5}px`
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

// Love Wave
export const LoveWave = () => {
  return (
    <div className="flex items-center space-x-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-8 bg-gradient-to-t from-red-400 to-pink-500 rounded-full"
          animate={{
            scaleY: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Romantic Dots
export const RomanticDots = ({ color = "primary" }) => {
  const colors = {
    primary: "bg-primary-500",
    red: "bg-red-500",
    pink: "bg-pink-500",
    purple: "bg-purple-500"
  };

  return (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`w-3 h-3 rounded-full ${colors[color]}`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Progress Heart
export const ProgressHeart = ({ progress = 0 }) => {
  return (
    <div className="relative w-16 h-16">
      <Heart className="w-full h-full text-gray-300" />
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ clipPath: "inset(100% 0 0 0)" }}
        animate={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Heart className="w-full h-full text-red-500 fill-current" />
      </motion.div>
    </div>
  );
};

// Skeleton Card
export const SkeletonCard = ({ lines = 3 }) => {
  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="animate-pulse">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className="h-3 bg-gray-300 dark:bg-gray-600 rounded"
              style={{ width: `${Math.random() * 40 + 60}%` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Loading Overlay
export const LoadingOverlay = ({ 
  isVisible, 
  text = "Loading...", 
  variant = "heart",
  backdrop = true 
}) => {
  if (!isVisible) return null;

  const loaders = {
    heart: <HeartLoader size="lg" />,
    pulse: <PulseLoader text={text} />,
    floating: <FloatingHearts />,
    spinning: <SpinningHearts />,
    wave: <LoveWave />,
    dots: <RomanticDots />
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        backdrop ? 'bg-black bg-opacity-50' : ''
      }`}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl"
      >
        <div className="flex flex-col items-center space-y-4">
          {loaders[variant]}
          <p className="text-gray-600 dark:text-gray-400 text-center">
            {text}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Page Loading
export const PageLoader = ({ text = "Loading your love journey..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.2 
          }}
          className="mb-8"
        >
          <FloatingHearts count={5} />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Love Journey
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-gray-600 dark:text-gray-400 mb-8"
        >
          {text}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <LoveWave />
        </motion.div>
      </div>
    </div>
  );
};

// Button Loading State
export const ButtonLoader = ({ size = "sm" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
      className={`${sizeClasses[size]} border-2 border-white border-t-transparent rounded-full`}
    />
  );
};

// Content Placeholder
export const ContentPlaceholder = ({ type = "card", count = 3 }) => {
  const placeholders = {
    card: <SkeletonCard />,
    list: (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg animate-pulse">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    ),
    grid: (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {placeholders[type]}
    </motion.div>
  );
};

export default {
  HeartLoader,
  FloatingHearts,
  PulseLoader,
  SpinningHearts,
  LoveWave,
  RomanticDots,
  ProgressHeart,
  SkeletonCard,
  LoadingOverlay,
  PageLoader,
  ButtonLoader,
  ContentPlaceholder
};
