/**
 * Love Journey - Sidebar Component
 * 
 * Navigation sidebar with collapsible design, beautiful icons,
 * and smooth animations. Includes user profile and theme toggle.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Heart, Home, BarChart3, Target, Calendar, Image, Smile,
  Clock, MessageCircle, Shield, TreePine, Settings, Search
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import ThemeToggle from '../ui/ThemeToggle';
import Tooltip from '../ui/Tooltip';

const Sidebar = ({ isOpen, isCollapsed, onClose, onToggleCollapse }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Timeline', href: '/timeline', icon: BarChart3 },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Planning', href: '/planning', icon: Calendar },
    { name: 'Memories', href: '/memories', icon: Image },
    { name: 'Emotions', href: '/emotions', icon: Smile },
    { name: 'Time Capsule', href: '/time-capsule', icon: Clock },
    { name: 'Check-ins', href: '/checkins', icon: MessageCircle },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Private Vault', href: '/vault', icon: Shield },
    { name: 'Growth Tracker', href: '/growth', icon: TreePine },
  ];

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo and brand */}
      <div className={clsx(
        'flex items-center px-4 py-6 border-b border-gray-200 dark:border-gray-700',
        isCollapsed ? 'justify-center' : 'justify-between'
      )}>
        <div className="flex items-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex items-center justify-center w-8 h-8 bg-primary-500 rounded-lg"
          >
            <Heart className="w-5 h-5 text-white fill-current" />
          </motion.div>
          
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-3 overflow-hidden"
              >
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Love Journey
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* User profile */}
      <div className={clsx(
        'px-4 py-4 border-b border-gray-200 dark:border-gray-700',
        isCollapsed ? 'flex justify-center' : ''
      )}>
        {isCollapsed ? (
          <Tooltip content={user?.name || 'User'} placement="right">
            <Avatar
              src={user?.avatar}
              name={user?.name}
              size="md"
              showStatus
              status="online"
            />
          </Tooltip>
        ) : (
          <div className="flex items-center">
            <Avatar
              src={user?.avatar}
              name={user?.name}
              size="md"
              showStatus
              status="online"
            />
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          const navItem = (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                clsx(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200',
                  isActive
                    ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white',
                  isCollapsed ? 'justify-center' : ''
                )
              }
            >
              <Icon
                className={clsx(
                  'flex-shrink-0 w-5 h-5',
                  isActive
                    ? 'text-primary-500'
                    : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300',
                  !isCollapsed && 'mr-3'
                )}
              />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );

          return isCollapsed ? (
            <Tooltip key={item.name} content={item.name} placement="right">
              {navItem}
            </Tooltip>
          ) : (
            navItem
          );
        })}
      </nav>

      {/* Footer */}
      <div className={clsx(
        'px-4 py-4 border-t border-gray-200 dark:border-gray-700 space-y-3',
        isCollapsed ? 'flex flex-col items-center' : ''
      )}>
        {/* Theme toggle */}
        <div className={clsx('flex', isCollapsed ? 'justify-center' : 'justify-between items-center')}>
          {!isCollapsed && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Theme
            </span>
          )}
          <ThemeToggle size="sm" />
        </div>

        {/* Settings link */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            clsx(
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200',
              isActive
                ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white',
              isCollapsed ? 'justify-center' : ''
            )
          }
        >
          <Settings
            className={clsx(
              'flex-shrink-0 w-5 h-5',
              'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300',
              !isCollapsed && 'mr-3'
            )}
          />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div
        className={clsx(
          'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300',
          isCollapsed ? 'lg:w-16' : 'lg:w-64'
        )}
      >
        <SidebarContent />
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 lg:hidden"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
