/**
 * Love Journey - Notification System
 * 
 * Comprehensive notification system with real-time alerts,
 * reminders, and customizable notification preferences.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, BellOff, X, Check, Heart, Calendar,
  Gift, Star, MessageCircle, Clock, AlertCircle,
  Info, CheckCircle, XCircle, Settings
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { dashboardService } from '../../services';

// Notification Context
const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Notification Provider
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({
    enabled: true,
    sound: true,
    desktop: true,
    email: true,
    types: {
      milestones: true,
      reminders: true,
      checkins: true,
      anniversaries: true,
      goals: true,
      partner: true
    }
  });

  // Load notifications from API
  const loadNotifications = async () => {
    try {
      // For now, start with empty notifications since we don't have a notifications API yet
      // In the future, this would call a notifications service
      setNotifications([]);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
    }
  };

  useEffect(() => {
    // Load real notifications
    loadNotifications();
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'medium',
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show desktop notification if enabled
    if (settings.desktop && settings.enabled && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: newNotification.id
      });
    }
    
    return newNotification.id;
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const value = {
    notifications,
    settings,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    getUnreadCount,
    updateSettings
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Notification Bell Component
export const NotificationBell = ({ onOpen }) => {
  const { getUnreadCount, settings } = useNotifications();
  const unreadCount = getUnreadCount();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="relative"
      onClick={onOpen}
    >
      {settings.enabled ? (
        <Bell className="w-5 h-5" />
      ) : (
        <BellOff className="w-5 h-5" />
      )}
      {unreadCount > 0 && (
        <Badge
          variant="error"
          size="sm"
          className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center text-xs"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </Button>
  );
};

// Notification Panel Component
export const NotificationPanel = ({ isOpen, onClose }) => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    getUnreadCount
  } = useNotifications();

  const [filter, setFilter] = useState('all'); // all, unread, read
  const [showSettings, setShowSettings] = useState(false);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end pt-16 pr-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="w-96 max-h-[80vh] bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'unread', label: 'Unread' },
                { id: 'read', label: 'Read' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    filter === tab.id
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                  {tab.id === 'unread' && getUnreadCount() > 0 && (
                    <span className="ml-1 text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5">
                      {getUnreadCount()}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Actions */}
            {notifications.length > 0 && (
              <div className="flex items-center justify-between mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={getUnreadCount() === 0}
                >
                  Mark all read
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-red-600 hover:text-red-700"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <NotificationSettings onClose={() => setShowSettings(false)} />
          )}

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto max-h-96">
            {filteredNotifications.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    formatTime={formatTime}
                    getPriorityColor={getPriorityColor}
                    onMarkAsRead={markAsRead}
                    onRemove={removeNotification}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No notifications
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {filter === 'unread' 
                    ? "You're all caught up!"
                    : "You'll see notifications here when they arrive."
                  }
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Individual Notification Item
const NotificationItem = ({ 
  notification, 
  formatTime, 
  getPriorityColor, 
  onMarkAsRead, 
  onRemove 
}) => {
  const NotificationIcon = notification.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-l-4 ${getPriorityColor(notification.priority)} ${
        !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${notification.color}`}>
          <NotificationIcon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className={`text-sm font-medium ${
              !notification.read 
                ? 'text-gray-900 dark:text-white' 
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              {notification.title}
            </h4>
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {notification.message}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(notification.timestamp)}
            </span>
            <div className="flex items-center space-x-2">
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <Check className="w-3 h-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(notification.id)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Notification Settings Component
const NotificationSettings = ({ onClose }) => {
  const { settings, updateSettings } = useNotifications();

  const handleToggle = (key, value) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      updateSettings({
        [parent]: {
          ...settings[parent],
          [child]: value
        }
      });
    } else {
      updateSettings({ [key]: value });
    }
  };

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900 dark:text-white">
          Notification Settings
        </h4>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* General Settings */}
        <div>
          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            General
          </h5>
          <div className="space-y-2">
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Enable notifications
              </span>
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => handleToggle('enabled', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Sound alerts
              </span>
              <input
                type="checkbox"
                checked={settings.sound}
                onChange={(e) => handleToggle('sound', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Desktop notifications
              </span>
              <input
                type="checkbox"
                checked={settings.desktop}
                onChange={(e) => handleToggle('desktop', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Email notifications
              </span>
              <input
                type="checkbox"
                checked={settings.email}
                onChange={(e) => handleToggle('email', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
          </div>
        </div>

        {/* Notification Types */}
        <div>
          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notification Types
          </h5>
          <div className="space-y-2">
            {Object.entries(settings.types).map(([type, enabled]) => (
              <label key={type} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {type.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => handleToggle(`types.${type}`, e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Toast Notification Component
export const ToastNotification = ({ notification, onClose }) => {
  const NotificationIcon = notification.icon || Info;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, notification.duration || 5000);

    return () => clearTimeout(timer);
  }, [onClose, notification.duration]);

  const getToastColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <Card className="max-w-sm shadow-lg">
        <div className="flex items-start space-x-3 p-4">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getToastColor(notification.type)}`}>
            <NotificationIcon className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              {notification.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {notification.message}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

// Toast Container
export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Expose addToast globally
  useEffect(() => {
    window.showToast = addToast;
    return () => {
      delete window.showToast;
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            notification={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationPanel;
