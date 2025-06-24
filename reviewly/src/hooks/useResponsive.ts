/**
 * Responsive Design Hook for Reviewly Application
 * 
 * React hook for responsive design utilities, breakpoint detection,
 * and adaptive behavior based on screen size and device type.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import { useState, useEffect, useCallback } from 'react';
import {
  breakpoints,
  getDeviceType,
  getViewportSize,
  isTouchDevice,
  isMobileBrowser,
  getOrientation,
  debounce,
} from '../utils/responsive';

interface ResponsiveState {
  // Viewport information
  width: number;
  height: number;
  
  // Device type
  deviceType: 'mobile' | 'tablet' | 'desktop';
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  
  // Breakpoint checks
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  isXxl: boolean;
  
  // Device capabilities
  isTouch: boolean;
  isMobileBrowser: boolean;
  
  // Orientation
  orientation: 'portrait' | 'landscape';
  isPortrait: boolean;
  isLandscape: boolean;
}

export const useResponsive = (): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>(() => {
    const viewport = getViewportSize();
    const deviceType = getDeviceType();
    const orientation = getOrientation();
    
    return {
      width: viewport.width,
      height: viewport.height,
      
      deviceType,
      isMobile: deviceType === 'mobile',
      isTablet: deviceType === 'tablet',
      isDesktop: deviceType === 'desktop',
      
      isXs: viewport.width <= breakpoints.xs,
      isSm: viewport.width <= breakpoints.sm,
      isMd: viewport.width <= breakpoints.md,
      isLg: viewport.width <= breakpoints.lg,
      isXl: viewport.width <= breakpoints.xl,
      isXxl: viewport.width <= breakpoints.xxl,
      
      isTouch: isTouchDevice(),
      isMobileBrowser: isMobileBrowser(),
      
      orientation,
      isPortrait: orientation === 'portrait',
      isLandscape: orientation === 'landscape',
    };
  });

  const updateState = useCallback(() => {
    const viewport = getViewportSize();
    const deviceType = getDeviceType();
    const orientation = getOrientation();
    
    setState({
      width: viewport.width,
      height: viewport.height,
      
      deviceType,
      isMobile: deviceType === 'mobile',
      isTablet: deviceType === 'tablet',
      isDesktop: deviceType === 'desktop',
      
      isXs: viewport.width <= breakpoints.xs,
      isSm: viewport.width <= breakpoints.sm,
      isMd: viewport.width <= breakpoints.md,
      isLg: viewport.width <= breakpoints.lg,
      isXl: viewport.width <= breakpoints.xl,
      isXxl: viewport.width <= breakpoints.xxl,
      
      isTouch: isTouchDevice(),
      isMobileBrowser: isMobileBrowser(),
      
      orientation,
      isPortrait: orientation === 'portrait',
      isLandscape: orientation === 'landscape',
    });
  }, []);

  useEffect(() => {
    const debouncedUpdate = debounce(updateState, 100);
    
    window.addEventListener('resize', debouncedUpdate);
    window.addEventListener('orientationchange', debouncedUpdate);
    
    return () => {
      window.removeEventListener('resize', debouncedUpdate);
      window.removeEventListener('orientationchange', debouncedUpdate);
    };
  }, [updateState]);

  return state;
};

// Hook for specific breakpoint detection
export const useBreakpoint = (breakpoint: keyof typeof breakpoints): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoints[breakpoint]}px)`);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };
    
    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [breakpoint]);

  return matches;
};

// Hook for media query matching
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };
    
    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};

// Hook for responsive values
export const useResponsiveValue = <T>(values: {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  default: T;
}): T => {
  const { deviceType } = useResponsive();
  
  switch (deviceType) {
    case 'mobile':
      return values.mobile ?? values.default;
    case 'tablet':
      return values.tablet ?? values.mobile ?? values.default;
    case 'desktop':
      return values.desktop ?? values.tablet ?? values.default;
    default:
      return values.default;
  }
};

// Hook for responsive grid columns
export const useResponsiveColumns = (
  items: number,
  minItemWidth: number = 250
): number => {
  const { width } = useResponsive();
  
  const availableWidth = width - 32; // Account for padding
  const maxColumns = Math.floor(availableWidth / minItemWidth);
  
  return Math.max(1, Math.min(items, maxColumns));
};

// Hook for touch interactions
export const useTouchInteractions = () => {
  const { isTouch } = useResponsive();
  
  const getTouchEventHandlers = useCallback((
    onTouchStart?: (e: React.TouchEvent) => void,
    onTouchMove?: (e: React.TouchEvent) => void,
    onTouchEnd?: (e: React.TouchEvent) => void
  ) => {
    if (!isTouch) return {};
    
    return {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    };
  }, [isTouch]);
  
  const getSwipeHandlers = useCallback((
    onSwipeLeft?: () => void,
    onSwipeRight?: () => void,
    onSwipeUp?: () => void,
    onSwipeDown?: () => void,
    threshold: number = 50
  ) => {
    if (!isTouch) return {};
    
    let startX = 0;
    let startY = 0;
    
    const handleTouchStart = (e: React.TouchEvent) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > threshold) {
          if (deltaX > 0) {
            onSwipeRight?.();
          } else {
            onSwipeLeft?.();
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > threshold) {
          if (deltaY > 0) {
            onSwipeDown?.();
          } else {
            onSwipeUp?.();
          }
        }
      }
    };
    
    return {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
    };
  }, [isTouch]);
  
  return {
    isTouch,
    getTouchEventHandlers,
    getSwipeHandlers,
  };
};

// Hook for responsive font sizes
export const useResponsiveFontSize = (
  baseSize: number,
  minSize?: number,
  maxSize?: number
): string => {
  const { width } = useResponsive();
  
  const min = minSize ?? baseSize * 0.8;
  const max = maxSize ?? baseSize * 1.2;
  const minViewport = breakpoints.sm;
  const maxViewport = breakpoints.xl;
  
  if (width <= minViewport) return `${min}px`;
  if (width >= maxViewport) return `${max}px`;
  
  const ratio = (width - minViewport) / (maxViewport - minViewport);
  const fontSize = min + (max - min) * ratio;
  
  return `${Math.round(fontSize)}px`;
};

// Hook for safe area insets (for mobile devices with notches)
export const useSafeArea = () => {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });
  
  useEffect(() => {
    const updateSafeArea = () => {
      if (typeof CSS !== 'undefined' && CSS.supports('padding: env(safe-area-inset-top)')) {
        const computedStyle = getComputedStyle(document.documentElement);
        
        setSafeArea({
          top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0'),
          right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)') || '0'),
          bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
          left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)') || '0'),
        });
      }
    };
    
    updateSafeArea();
    
    const debouncedUpdate = debounce(updateSafeArea, 100);
    window.addEventListener('resize', debouncedUpdate);
    window.addEventListener('orientationchange', debouncedUpdate);
    
    return () => {
      window.removeEventListener('resize', debouncedUpdate);
      window.removeEventListener('orientationchange', debouncedUpdate);
    };
  }, []);
  
  return safeArea;
};
