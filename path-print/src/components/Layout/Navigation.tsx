/**
 * Career Path Visualization - Navigation Component
 * 
 * This component provides the main navigation interface for switching between
 * different visualization modes and accessing application features.
 * 
 * @fileoverview Navigation component with view mode switching and menu items
 * @author Career Path Visualization Team
 * @version 1.0.0
 * 
 * MAINTAINER NOTES:
 * - Navigation items are defined in a configuration array for easy maintenance
 * - Active states are managed through the global app context
 * - Icons use Lucide React for consistency
 * - Responsive design works on both desktop sidebar and mobile overlay
 * - Smooth animations for state transitions
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  MapPin,
  Activity,
  BarChart3,
  Target,
  Settings,
  Download,
  User,
  Home
} from 'lucide-react';
import { ViewMode } from '../../types';
import { useAppContext } from './AppLayout';

// ============================================================================
// NAVIGATION CONFIGURATION
// ============================================================================

/**
 * Navigation item interface
 */
interface NavigationItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Icon component */
  icon: React.ComponentType<{ size?: number; className?: string }>;
  /** View mode this item represents (if applicable) */
  viewMode?: ViewMode;
  /** Click handler (if not a view mode) */
  onClick?: () => void;
  /** Whether this item is a separator */
  isSeparator?: boolean;
  /** Badge text (optional) */
  badge?: string;
  /** Whether item is disabled */
  disabled?: boolean;
}

/**
 * Navigation configuration
 */
const navigationItems: NavigationItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: Home,
    viewMode: ViewMode.OVERVIEW
  },
  {
    id: 'separator-1',
    label: '',
    icon: Home, // Won't be used
    isSeparator: true
  },
  {
    id: 'timeline',
    label: 'Timeline View',
    icon: Clock,
    viewMode: ViewMode.TIMELINE
  },
  {
    id: 'map',
    label: 'Career Map',
    icon: MapPin,
    viewMode: ViewMode.MAP
  },
  {
    id: 'radar',
    label: 'Skills Radar',
    icon: Activity,
    viewMode: ViewMode.RADAR
  },
  {
    id: 'progress',
    label: 'Progress Bars',
    icon: BarChart3,
    viewMode: ViewMode.PROGRESS
  },
  {
    id: 'separator-2',
    label: '',
    icon: Home, // Won't be used
    isSeparator: true
  },
  {
    id: 'goals',
    label: 'Goals & Planning',
    icon: Target,
    viewMode: ViewMode.GOALS
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    viewMode: ViewMode.PROFILE
  },
  {
    id: 'separator-3',
    label: '',
    icon: Home, // Won't be used
    isSeparator: true
  },
  {
    id: 'export',
    label: 'Export & Share',
    icon: Download,
    viewMode: ViewMode.EXPORT
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    viewMode: ViewMode.SETTINGS
  }
];

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

/**
 * Animation variants for navigation items
 */
const itemVariants = {
  initial: {
    opacity: 0,
    x: -20
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  hover: {
    x: 4,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  }
};

/**
 * Animation variants for the navigation container
 */
const containerVariants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.4,
      staggerChildren: 0.05
    }
  }
};

// ============================================================================
// COMPONENT PROPS
// ============================================================================

/**
 * Props for the Navigation component
 */
export interface NavigationProps {
  /** Custom CSS classes */
  className?: string;
  /** Whether this is a mobile navigation */
  isMobile?: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Navigation component
 * 
 * Provides the main navigation interface with view mode switching,
 * feature access, and responsive design for both desktop and mobile.
 * 
 * @param props - Component props
 * @returns JSX element representing the navigation
 */
export function Navigation({
  className = '',
  isMobile = false
}: NavigationProps): React.JSX.Element {
  const { currentView, setCurrentView, toggleMobileMenu } = useAppContext();

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handle navigation item click
   */
  const handleItemClick = (item: NavigationItem) => {
    if (item.disabled) return;

    if (item.viewMode) {
      // Switch to the specified view mode
      setCurrentView(item.viewMode);
    } else if (item.onClick) {
      // Execute custom click handler
      item.onClick();
    }

    // Close mobile menu if this is mobile navigation
    if (isMobile) {
      toggleMobileMenu();
    }
  };

  /**
   * Check if a navigation item is currently active
   */
  const isItemActive = (item: NavigationItem): boolean => {
    return item.viewMode === currentView;
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  /**
   * Render a navigation item
   */
  const renderNavigationItem = (item: NavigationItem) => {
    if (item.isSeparator) {
      return (
        <motion.div
          key={item.id}
          variants={itemVariants}
          className="my-2 border-t border-gray-200 dark:border-gray-700"
        />
      );
    }

    const isActive = isItemActive(item);
    const Icon = item.icon;

    return (
      <motion.button
        key={item.id}
        variants={itemVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() => handleItemClick(item)}
        disabled={item.disabled}
        className={`
          w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200
          ${isActive 
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }
          ${item.disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-pointer'
          }
          group
        `}
      >
        {/* Icon */}
        <Icon 
          size={20} 
          className={`
            mr-3 transition-colors duration-200
            ${isActive 
              ? 'text-blue-600 dark:text-blue-400' 
              : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'
            }
          `}
        />

        {/* Label */}
        <span className={`
          flex-1 font-medium transition-colors duration-200
          ${isActive 
            ? 'text-blue-700 dark:text-blue-300' 
            : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100'
          }
        `}>
          {item.label}
        </span>

        {/* Badge */}
        {item.badge && (
          <span className="ml-2 px-2 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
            {item.badge}
          </span>
        )}

        {/* Active Indicator */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute right-0 w-1 h-8 bg-blue-500 rounded-l-full"
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          />
        )}
      </motion.button>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <motion.nav
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={`
        h-full flex flex-col
        ${isMobile ? 'pt-16' : 'pt-6'}
        ${className}
      `}
    >
      {/* Header */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Career Path
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Visualize your journey
        </p>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-2 space-y-1 relative">
        {navigationItems.map((item) => renderNavigationItem(item))}
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Career Path Visualization v1.0.0
        </p>
      </div>
    </motion.nav>
  );
}
