/**
 * Responsive Design Utilities for Reviewly Application
 * 
 * Utilities for handling responsive design, mobile detection,
 * touch interactions, and adaptive layouts.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

// Breakpoint definitions
export const breakpoints = {
  xs: 320,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1200,
  xxl: 1440,
} as const;

// Media query helpers
export const mediaQueries = {
  xs: `(max-width: ${breakpoints.xs}px)`,
  sm: `(max-width: ${breakpoints.sm}px)`,
  md: `(max-width: ${breakpoints.md}px)`,
  lg: `(max-width: ${breakpoints.lg}px)`,
  xl: `(max-width: ${breakpoints.xl}px)`,
  xxl: `(max-width: ${breakpoints.xxl}px)`,
  
  // Min-width queries
  smUp: `(min-width: ${breakpoints.sm + 1}px)`,
  mdUp: `(min-width: ${breakpoints.md + 1}px)`,
  lgUp: `(min-width: ${breakpoints.lg + 1}px)`,
  xlUp: `(min-width: ${breakpoints.xl + 1}px)`,
  xxlUp: `(min-width: ${breakpoints.xxl + 1}px)`,
  
  // Range queries
  smToMd: `(min-width: ${breakpoints.sm + 1}px) and (max-width: ${breakpoints.md}px)`,
  mdToLg: `(min-width: ${breakpoints.md + 1}px) and (max-width: ${breakpoints.lg}px)`,
  lgToXl: `(min-width: ${breakpoints.lg + 1}px) and (max-width: ${breakpoints.xl}px)`,
} as const;

// Device detection
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width <= breakpoints.sm) return 'mobile';
  if (width <= breakpoints.md) return 'tablet';
  return 'desktop';
};

// Touch device detection
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore
    navigator.msMaxTouchPoints > 0
  );
};

// Mobile browser detection
export const isMobileBrowser = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    'android', 'webos', 'iphone', 'ipad', 'ipod',
    'blackberry', 'windows phone', 'mobile'
  ];
  
  return mobileKeywords.some(keyword => userAgent.includes(keyword));
};

// Viewport utilities
export const getViewportSize = () => {
  if (typeof window === 'undefined') {
    return { width: 1024, height: 768 };
  }
  
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

// Safe area utilities for mobile devices
export const getSafeAreaInsets = () => {
  if (typeof window === 'undefined' || typeof CSS === 'undefined') {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }
  
  const computedStyle = getComputedStyle(document.documentElement);
  
  return {
    top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0'),
    right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)') || '0'),
    bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
    left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)') || '0'),
  };
};

// Responsive font size calculator
export const getResponsiveFontSize = (
  baseSize: number,
  minSize: number = baseSize * 0.8,
  maxSize: number = baseSize * 1.2
): string => {
  const viewport = getViewportSize();
  const minViewport = breakpoints.sm;
  const maxViewport = breakpoints.xl;
  
  if (viewport.width <= minViewport) return `${minSize}px`;
  if (viewport.width >= maxViewport) return `${maxSize}px`;
  
  const ratio = (viewport.width - minViewport) / (maxViewport - minViewport);
  const fontSize = minSize + (maxSize - minSize) * ratio;
  
  return `${Math.round(fontSize)}px`;
};

// Touch-friendly sizing
export const getTouchFriendlySize = (baseSize: number): number => {
  const minTouchSize = 44; // iOS HIG minimum
  return Math.max(baseSize, minTouchSize);
};

// Responsive spacing calculator
export const getResponsiveSpacing = (
  baseSpacing: number,
  scaleFactor: number = 0.75
): { mobile: number; tablet: number; desktop: number } => {
  return {
    mobile: Math.round(baseSpacing * scaleFactor),
    tablet: Math.round(baseSpacing * (scaleFactor + 0.125)),
    desktop: baseSpacing,
  };
};

// Grid column calculator
export const getResponsiveColumns = (
  items: number,
  minItemWidth: number = 250
): { mobile: number; tablet: number; desktop: number } => {
  const viewport = getViewportSize();
  
  const calculateColumns = (width: number) => {
    const availableWidth = width - 32; // Account for padding
    return Math.max(1, Math.floor(availableWidth / minItemWidth));
  };
  
  return {
    mobile: Math.min(items, calculateColumns(breakpoints.sm)),
    tablet: Math.min(items, calculateColumns(breakpoints.md)),
    desktop: Math.min(items, calculateColumns(breakpoints.xl)),
  };
};

// Orientation detection
export const getOrientation = (): 'portrait' | 'landscape' => {
  if (typeof window === 'undefined') return 'landscape';
  
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
};

// Scroll utilities
export const getScrollbarWidth = (): number => {
  if (typeof document === 'undefined') return 0;
  
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  // @ts-ignore - msOverflowStyle is IE-specific
  outer.style.msOverflowStyle = 'scrollbar';
  document.body.appendChild(outer);
  
  const inner = document.createElement('div');
  outer.appendChild(inner);
  
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  
  outer.parentNode?.removeChild(outer);
  
  return scrollbarWidth;
};

// Performance utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Responsive image utilities
export const getResponsiveImageSrc = (
  baseSrc: string,
  sizes: { mobile?: string; tablet?: string; desktop?: string } = {}
): string => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'mobile':
      return sizes.mobile || baseSrc;
    case 'tablet':
      return sizes.tablet || sizes.mobile || baseSrc;
    case 'desktop':
      return sizes.desktop || sizes.tablet || baseSrc;
    default:
      return baseSrc;
  }
};

// CSS custom properties for responsive design
export const setCSSCustomProperties = () => {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  const viewport = getViewportSize();
  const deviceType = getDeviceType();
  const safeArea = getSafeAreaInsets();
  
  // Set viewport dimensions
  root.style.setProperty('--viewport-width', `${viewport.width}px`);
  root.style.setProperty('--viewport-height', `${viewport.height}px`);
  
  // Set device type
  root.style.setProperty('--device-type', deviceType);
  
  // Set safe area insets
  root.style.setProperty('--safe-area-top', `${safeArea.top}px`);
  root.style.setProperty('--safe-area-right', `${safeArea.right}px`);
  root.style.setProperty('--safe-area-bottom', `${safeArea.bottom}px`);
  root.style.setProperty('--safe-area-left', `${safeArea.left}px`);
  
  // Set responsive spacing
  const spacing = getResponsiveSpacing(16);
  root.style.setProperty('--spacing-mobile', `${spacing.mobile}px`);
  root.style.setProperty('--spacing-tablet', `${spacing.tablet}px`);
  root.style.setProperty('--spacing-desktop', `${spacing.desktop}px`);
  
  // Set touch-friendly sizes
  root.style.setProperty('--touch-target-size', `${getTouchFriendlySize(40)}px`);
  
  // Set scrollbar width
  root.style.setProperty('--scrollbar-width', `${getScrollbarWidth()}px`);
};

// Initialize responsive utilities
export const initResponsiveUtils = () => {
  if (typeof window === 'undefined') return;
  
  // Set initial CSS properties
  setCSSCustomProperties();
  
  // Update on resize
  const handleResize = debounce(() => {
    setCSSCustomProperties();
  }, 100);
  
  // Update on orientation change
  const handleOrientationChange = debounce(() => {
    setCSSCustomProperties();
  }, 100);
  
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleOrientationChange);
  
  // Cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleOrientationChange);
  };
};
