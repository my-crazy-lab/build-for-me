/**
 * Love Journey - Dashboard Widget Component
 * 
 * Reusable widget component for the dashboard with drag-and-drop support,
 * resize handles, and customizable content areas.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Maximize2, Minimize2, Settings, X } from 'lucide-react';
import { clsx } from 'clsx';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Tooltip from '../ui/Tooltip';

const DashboardWidget = ({
  id,
  title,
  children,
  size = 'md',
  isDragging = false,
  onRemove,
  onResize,
  onSettings,
  className = '',
  ...props
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const sizes = {
    sm: 'col-span-1 row-span-1',
    md: 'col-span-2 row-span-2',
    lg: 'col-span-3 row-span-2',
    xl: 'col-span-4 row-span-3',
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    if (onResize) {
      onResize(id, isExpanded ? size : 'xl');
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(id);
    }
    setShowMenu(false);
  };

  const handleSettings = () => {
    if (onSettings) {
      onSettings(id);
    }
    setShowMenu(false);
  };

  return (
    <motion.div
      layout
      className={clsx(
        'relative group',
        sizes[isExpanded ? 'xl' : size],
        isDragging && 'z-50 rotate-3 scale-105',
        className
      )}
      whileHover={{ scale: isDragging ? 1.05 : 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      {...props}
    >
      <Card
        className={clsx(
          'h-full transition-all duration-200',
          isDragging && 'shadow-2xl ring-2 ring-primary-500 ring-opacity-50',
          'hover:shadow-lg'
        )}
        padding="none"
      >
        {/* Widget Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            {/* Drag Handle */}
            <div className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-2 h-4 flex flex-col justify-between">
                <div className="w-full h-0.5 bg-gray-400 rounded"></div>
                <div className="w-full h-0.5 bg-gray-400 rounded"></div>
                <div className="w-full h-0.5 bg-gray-400 rounded"></div>
              </div>
            </div>
            
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
          </div>

          {/* Widget Actions */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Tooltip content={isExpanded ? 'Minimize' : 'Expand'}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExpand}
                leftIcon={isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              />
            </Tooltip>

            <div className="relative">
              <Tooltip content="Widget options">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMenu(!showMenu)}
                  leftIcon={<MoreVertical className="w-3 h-3" />}
                />
              </Tooltip>

              {/* Dropdown Menu */}
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                >
                  <div className="py-1">
                    <button
                      onClick={handleSettings}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings className="w-3 h-3 mr-2" />
                      Settings
                    </button>
                    <button
                      onClick={handleRemove}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <X className="w-3 h-3 mr-2" />
                      Remove
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Widget Content */}
        <div className="p-4 h-full overflow-auto">
          {children}
        </div>
      </Card>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </motion.div>
  );
};

export default DashboardWidget;
