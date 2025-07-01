import { useState, useEffect } from 'react';
import { debounce } from '../utils/performance';

/**
 * useResponsive Hook
 * 
 * Custom hook for responsive design utilities:
 * - Screen size detection
 * - Breakpoint matching
 * - Mobile/desktop detection
 * - Orientation change handling
 */

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function useResponsive() {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  const [orientation, setOrientation] = useState(
    typeof window !== 'undefined' 
      ? window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      : 'landscape'
  );

  useEffect(() => {
    const handleResize = debounce(() => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      setScreenSize({ width: newWidth, height: newHeight });
      setOrientation(newWidth > newHeight ? 'landscape' : 'portrait');
    }, 150);

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Breakpoint utilities
  const isMobile = screenSize.width < breakpoints.md;
  const isTablet = screenSize.width >= breakpoints.md && screenSize.width < breakpoints.lg;
  const isDesktop = screenSize.width >= breakpoints.lg;
  
  const isSmallScreen = screenSize.width < breakpoints.sm;
  const isMediumScreen = screenSize.width >= breakpoints.sm && screenSize.width < breakpoints.lg;
  const isLargeScreen = screenSize.width >= breakpoints.lg;

  // Specific breakpoint checks
  const isAbove = (breakpoint) => screenSize.width >= breakpoints[breakpoint];
  const isBelow = (breakpoint) => screenSize.width < breakpoints[breakpoint];
  const isBetween = (min, max) => 
    screenSize.width >= breakpoints[min] && screenSize.width < breakpoints[max];

  return {
    screenSize,
    orientation,
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    isAbove,
    isBelow,
    isBetween,
    breakpoints,
  };
}

/**
 * useIntersectionObserver Hook
 * 
 * Hook for handling intersection observer with performance optimizations
 */
export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  const observe = (element) => {
    if (!element || !window.IntersectionObserver) {
      setIsIntersecting(true);
      setHasIntersected(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  };

  return { isIntersecting, hasIntersected, observe };
}

/**
 * usePreferredColorScheme Hook
 * 
 * Hook for detecting user's preferred color scheme
 */
export function usePreferredColorScheme() {
  const [preferredScheme, setPreferredScheme] = useState(
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : 'light'
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setPreferredScheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return preferredScheme;
}
