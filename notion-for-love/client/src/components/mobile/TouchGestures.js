/**
 * Love Journey - Touch Gestures Component
 * 
 * Mobile-optimized touch gesture handling for swipe actions,
 * pull-to-refresh, and other mobile interactions.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';

// Swipeable Card Component
export const SwipeableCard = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  onSwipeUp, 
  onSwipeDown,
  threshold = 100,
  className = ""
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event, info) => {
    const { offset, velocity } = info;
    
    if (Math.abs(offset.x) > threshold || Math.abs(velocity.x) > 500) {
      if (offset.x > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (offset.x < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    } else if (Math.abs(offset.y) > threshold || Math.abs(velocity.y) > 500) {
      if (offset.y > 0 && onSwipeDown) {
        onSwipeDown();
      } else if (offset.y < 0 && onSwipeUp) {
        onSwipeUp();
      }
    }
    
    // Reset position
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={`touch-none ${className}`}
      style={{ x, y, rotate, opacity }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
};

// Pull to Refresh Component
export const PullToRefresh = ({ 
  children, 
  onRefresh, 
  threshold = 80,
  className = ""
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const y = useMotionValue(0);
  const containerRef = useRef(null);

  const handleDrag = (event, info) => {
    const { offset } = info;
    if (offset.y > 0 && containerRef.current?.scrollTop === 0) {
      setPullDistance(Math.min(offset.y, threshold * 1.5));
      y.set(Math.min(offset.y * 0.5, threshold));
    }
  };

  const handleDragEnd = async (event, info) => {
    const { offset } = info;
    
    if (offset.y > threshold && containerRef.current?.scrollTop === 0) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
        y.set(0);
      }
    } else {
      setPullDistance(0);
      y.set(0);
    }
  };

  const refreshProgress = Math.min(pullDistance / threshold, 1);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Pull to refresh indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center bg-primary-50 dark:bg-primary-900/20"
        style={{ 
          height: y,
          opacity: refreshProgress
        }}
      >
        <div className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
          <motion.div
            animate={isRefreshing ? { rotate: 360 } : {}}
            transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
          />
          <span className="text-sm font-medium">
            {isRefreshing ? 'Refreshing...' : refreshProgress >= 1 ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        ref={containerRef}
        style={{ y }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className="h-full overflow-y-auto"
      >
        {children}
      </motion.div>
    </div>
  );
};

// Swipe Navigation Component
export const SwipeNavigation = ({ 
  pages, 
  currentPage, 
  onPageChange,
  className = ""
}) => {
  const x = useMotionValue(0);
  const [dragStartX, setDragStartX] = useState(0);

  const handleDragStart = (event, info) => {
    setDragStartX(info.point.x);
  };

  const handleDragEnd = (event, info) => {
    const { offset, velocity } = info;
    const dragDistance = Math.abs(offset.x);
    const dragVelocity = Math.abs(velocity.x);

    if (dragDistance > 50 || dragVelocity > 500) {
      if (offset.x > 0 && currentPage > 0) {
        onPageChange(currentPage - 1);
      } else if (offset.x < 0 && currentPage < pages.length - 1) {
        onPageChange(currentPage + 1);
      }
    }

    x.set(0);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="flex"
        style={{ 
          x,
          width: `${pages.length * 100}%`
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={{ x: `-${currentPage * (100 / pages.length)}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {pages.map((page, index) => (
          <div
            key={index}
            className="flex-shrink-0"
            style={{ width: `${100 / pages.length}%` }}
          >
            {page}
          </div>
        ))}
      </motion.div>

      {/* Page indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {pages.map((_, index) => (
          <button
            key={index}
            onClick={() => onPageChange(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentPage
                ? 'bg-primary-500'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Long Press Component
export const LongPress = ({ 
  children, 
  onLongPress, 
  duration = 500,
  className = ""
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const timeoutRef = useRef(null);

  const handlePressStart = () => {
    setIsPressed(true);
    timeoutRef.current = setTimeout(() => {
      onLongPress();
      setIsPressed(false);
    }, duration);
  };

  const handlePressEnd = () => {
    setIsPressed(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      className={`touch-none ${className}`}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      animate={isPressed ? { scale: 0.95 } : { scale: 1 }}
      transition={{ duration: 0.1 }}
    >
      {children}
      {isPressed && (
        <motion.div
          className="absolute inset-0 bg-primary-500 bg-opacity-20 rounded-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: duration / 1000 }}
        />
      )}
    </motion.div>
  );
};

// Pinch to Zoom Component
export const PinchToZoom = ({ 
  children, 
  minZoom = 0.5, 
  maxZoom = 3,
  className = ""
}) => {
  const [scale, setScale] = useState(1);
  const [lastDistance, setLastDistance] = useState(0);

  const getDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (event) => {
    if (event.touches.length === 2) {
      setLastDistance(getDistance(event.touches));
    }
  };

  const handleTouchMove = (event) => {
    if (event.touches.length === 2) {
      event.preventDefault();
      const distance = getDistance(event.touches);
      const ratio = distance / lastDistance;
      const newScale = Math.min(Math.max(scale * ratio, minZoom), maxZoom);
      setScale(newScale);
      setLastDistance(distance);
    }
  };

  const handleDoubleClick = () => {
    setScale(scale === 1 ? 2 : 1);
  };

  return (
    <motion.div
      className={`touch-none ${className}`}
      style={{ scale }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onDoubleClick={handleDoubleClick}
      animate={{ scale }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
};

// Mobile Bottom Sheet
export const BottomSheet = ({ 
  isOpen, 
  onClose, 
  children,
  snapPoints = [0.3, 0.6, 0.9],
  className = ""
}) => {
  const [currentSnap, setCurrentSnap] = useState(0);
  const y = useMotionValue(0);

  const handleDragEnd = (event, info) => {
    const { offset, velocity } = info;
    const windowHeight = window.innerHeight;
    
    // Find closest snap point
    let closestSnap = currentSnap;
    let minDistance = Infinity;
    
    snapPoints.forEach((snap, index) => {
      const snapPosition = windowHeight * (1 - snap);
      const distance = Math.abs(snapPosition + offset.y - windowHeight);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestSnap = index;
      }
    });

    // Consider velocity for snap decision
    if (velocity.y > 500 && closestSnap > 0) {
      closestSnap = Math.max(0, closestSnap - 1);
    } else if (velocity.y < -500 && closestSnap < snapPoints.length - 1) {
      closestSnap = Math.min(snapPoints.length - 1, closestSnap + 1);
    }

    if (closestSnap === 0 && (offset.y > 100 || velocity.y > 300)) {
      onClose();
    } else {
      setCurrentSnap(closestSnap);
      y.set(0);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <motion.div
        className={`absolute left-0 right-0 bottom-0 bg-white dark:bg-gray-800 rounded-t-xl shadow-xl ${className}`}
        style={{ 
          y,
          height: `${snapPoints[currentSnap] * 100}%`
        }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default {
  SwipeableCard,
  PullToRefresh,
  SwipeNavigation,
  LongPress,
  PinchToZoom,
  BottomSheet
};
