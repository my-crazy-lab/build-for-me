/**
 * Love Journey - Header Component
 * 
 * Application header with search, notifications, and user menu.
 * Includes responsive design and beautiful animations.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, Search, Bell, ChevronDown, LogOut, User, Settings,
  Heart, Plus, MessageCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Tooltip from '../ui/Tooltip';
import GlobalSearch from '../search/GlobalSearch';

const Header = ({ onToggleSidebar, onToggleSidebarCollapse, sidebarCollapsed }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setShowGlobalSearch(true);
  };

  const handleSearchClick = () => {
    setShowGlobalSearch(true);
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="lg:hidden"
              leftIcon={<Menu className="w-5 h-5" />}
            />

            {/* Desktop sidebar toggle */}
            <Tooltip content={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleSidebarCollapse}
                className="hidden lg:flex"
                leftIcon={<Menu className="w-5 h-5" />}
              />
            </Tooltip>

            {/* Search */}
            <div className="ml-4 flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={handleSearchClick}
                  onFocus={handleSearchClick}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm cursor-pointer"
                  placeholder="Search memories, goals, milestones..."
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Quick actions */}
            <div className="hidden md:flex items-center space-x-2">
              <Tooltip content="Add milestone">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                />
              </Tooltip>
              
              <Tooltip content="Quick check-in">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<MessageCircle className="w-4 h-4" />}
                />
              </Tooltip>
            </div>

            {/* Notifications */}
            <div className="relative">
              <Tooltip content="Notifications">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Bell className="w-5 h-5" />}
                />
              </Tooltip>
              {/* Notification badge */}
              <div className="absolute -top-1 -right-1">
                <Badge variant="error" size="sm">3</Badge>
              </div>
            </div>

            {/* Love points */}
            <div className="hidden sm:flex items-center space-x-1 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 rounded-full">
              <Heart className="w-4 h-4 text-primary-500 fill-current" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                1,247
              </span>
            </div>

            {/* User menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2"
              >
                <Avatar
                  src={user?.avatar}
                  name={user?.name}
                  size="sm"
                />
                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.name}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </Button>

              {/* User dropdown menu */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.1 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  >
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </p>
                      </div>
                      
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </button>
                      
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </button>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700">
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* Global Search Modal */}
      <GlobalSearch
        isOpen={showGlobalSearch}
        onClose={() => setShowGlobalSearch(false)}
      />
    </header>
  );
};

export default Header;
