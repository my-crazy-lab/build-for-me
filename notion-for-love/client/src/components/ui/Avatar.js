/**
 * Love Journey - Avatar Component
 * 
 * Reusable avatar component with fallback initials, status indicators,
 * and multiple sizes. Includes hover effects and accessibility.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const Avatar = ({
  src,
  alt,
  name,
  size = 'md',
  status,
  showStatus = false,
  className = '',
  onClick,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
  };

  const statusColors = {
    online: 'bg-success-500',
    offline: 'bg-gray-400',
    away: 'bg-warning-500',
    busy: 'bg-error-500',
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const baseClasses = 'relative inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium overflow-hidden';
  const clickableClasses = onClick ? 'cursor-pointer hover:opacity-80' : '';

  const avatarClasses = clsx(
    baseClasses,
    sizes[size],
    clickableClasses,
    className
  );

  return (
    <motion.div
      className={avatarClasses}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="select-none">
          {getInitials(name)}
        </span>
      )}

      {/* Status indicator */}
      {showStatus && status && (
        <motion.div
          className={clsx(
            'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-gray-800',
            statusSizes[size],
            statusColors[status]
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.div>
  );
};

// Avatar Group Component
const AvatarGroup = ({
  children,
  max = 3,
  size = 'md',
  className = '',
  ...props
}) => {
  const avatars = React.Children.toArray(children);
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  };

  const spacingClasses = {
    xs: '-space-x-1',
    sm: '-space-x-1.5',
    md: '-space-x-2',
    lg: '-space-x-2.5',
    xl: '-space-x-3',
    '2xl': '-space-x-4',
  };

  return (
    <div
      className={clsx('flex items-center', spacingClasses[size], className)}
      {...props}
    >
      {visibleAvatars.map((avatar, index) => (
        <div
          key={index}
          className="relative ring-2 ring-white dark:ring-gray-800 rounded-full"
          style={{ zIndex: visibleAvatars.length - index }}
        >
          {React.cloneElement(avatar, { size })}
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div
          className={clsx(
            'relative ring-2 ring-white dark:ring-gray-800 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium flex items-center justify-center',
            sizes[size]
          )}
          style={{ zIndex: 0 }}
        >
          <span className="text-xs">+{remainingCount}</span>
        </div>
      )}
    </div>
  );
};

// Attach sub-components to main Avatar component
Avatar.Group = AvatarGroup;

export default Avatar;
