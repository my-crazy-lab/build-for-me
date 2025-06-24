/**
 * Notification Context for Reviewly Application
 * 
 * React context for managing notifications, preferences, and
 * real-time notification updates across the application.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { 
  Notification, 
  NotificationPreferences, 
  NotificationType,
  NotificationCategory 
} from '../utils/notifications';
import { 
  createNotification, 
  shouldShowNotification, 
  DEFAULT_NOTIFICATION_PREFERENCES,
  scheduleReviewReminders
} from '../utils/notifications';

interface NotificationContextType {
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  
  // Actions
  addNotification: (
    type: NotificationType,
    variables?: Record<string, string>,
    overrides?: Partial<Notification>
  ) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  
  // Preferences
  preferences: NotificationPreferences;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void;
  
  // Utility
  getNotificationsByCategory: (category: NotificationCategory) => Notification[];
  getUnreadNotifications: () => Notification[];
  
  // Scheduling
  scheduleReminder: (
    type: NotificationType,
    scheduledFor: Date,
    variables?: Record<string, string>
  ) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: React.ReactNode;
  userId: string;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  userId
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    ...DEFAULT_NOTIFICATION_PREFERENCES,
    userId
  });

  // Load notifications and preferences from localStorage
  useEffect(() => {
    const loadStoredData = () => {
      try {
        // Load notifications
        const storedNotifications = localStorage.getItem(`notifications-${userId}`);
        if (storedNotifications) {
          const parsed = JSON.parse(storedNotifications);
          const notifications = parsed.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp),
            expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined
          }));
          
          // Filter out expired notifications
          const validNotifications = notifications.filter((n: Notification) => 
            !n.expiresAt || n.expiresAt > new Date()
          );
          
          setNotifications(validNotifications);
        }
        
        // Load preferences
        const storedPreferences = localStorage.getItem(`notification-preferences-${userId}`);
        if (storedPreferences) {
          setPreferences(JSON.parse(storedPreferences));
        }
      } catch (error) {
        console.error('Failed to load notification data:', error);
      }
    };

    loadStoredData();
  }, [userId]);

  // Save notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`notifications-${userId}`, JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }, [notifications, userId]);

  // Save preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`notification-preferences-${userId}`, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
    }
  }, [preferences, userId]);

  // Listen for custom notification events
  useEffect(() => {
    const handleNewNotification = (event: CustomEvent) => {
      const notification = event.detail as Notification;
      if (shouldShowNotification(notification, preferences)) {
        setNotifications(prev => [notification, ...prev]);
      }
    };

    window.addEventListener('newNotification', handleNewNotification as EventListener);
    
    return () => {
      window.removeEventListener('newNotification', handleNewNotification as EventListener);
    };
  }, [preferences]);

  // Generate mock notifications for demo
  useEffect(() => {
    const generateMockNotifications = () => {
      const mockNotifications: Notification[] = [
        createNotification('review_deadline', userId, {
          reviewType: 'Self Review',
          timeRemaining: '2 days'
        }, {
          actionUrl: '/self-review',
          timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
        }),
        
        createNotification('feedback_received', userId, {
          sender: 'Sarah Johnson'
        }, {
          actionUrl: '/feedback',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
        }),
        
        createNotification('milestone_achieved', userId, {
          milestoneTitle: 'Complete 10 Self Reviews'
        }, {
          actionUrl: '/achievements',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
        }),
        
        createNotification('goal_deadline', userId, {
          goalTitle: 'Learn Advanced React Patterns',
          timeRemaining: '5 days'
        }, {
          actionUrl: '/goals',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
        }),
        
        createNotification('skill_progress', userId, {
          skillName: 'JavaScript',
          progressAmount: '0.5 points'
        }, {
          actionUrl: '/analytics',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // 3 days ago
        })
      ];
      
      setNotifications(mockNotifications);
    };

    // Only generate mock data if no notifications exist
    if (notifications.length === 0) {
      generateMockNotifications();
    }
  }, [userId]); // Only run when userId changes

  const addNotification = useCallback((
    type: NotificationType,
    variables: Record<string, string> = {},
    overrides: Partial<Notification> = {}
  ) => {
    const notification = createNotification(type, userId, variables, overrides);
    
    if (shouldShowNotification(notification, preferences)) {
      setNotifications(prev => [notification, ...prev]);
      
      // Show browser notification if supported and enabled
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          tag: notification.id
        });
      }
    }
  }, [userId, preferences]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const updatePreferences = useCallback((newPreferences: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  }, []);

  const getNotificationsByCategory = useCallback((category: NotificationCategory) => {
    return notifications.filter(notification => notification.category === category);
  }, [notifications]);

  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(notification => !notification.read);
  }, [notifications]);

  const scheduleReminder = useCallback((
    type: NotificationType,
    scheduledFor: Date,
    variables: Record<string, string> = {}
  ) => {
    const delay = scheduledFor.getTime() - Date.now();
    
    if (delay > 0) {
      setTimeout(() => {
        addNotification(type, variables);
      }, delay);
    }
  }, [addNotification]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Auto-schedule review reminders (demo)
  useEffect(() => {
    const scheduleDemo = () => {
      const reviewDeadline = new Date();
      reviewDeadline.setDate(reviewDeadline.getDate() + 7); // 1 week from now
      
      scheduleReviewReminders(userId, reviewDeadline, 'Quarterly Review');
    };

    // Schedule demo reminders only once
    const hasScheduled = localStorage.getItem(`demo-reminders-${userId}`);
    if (!hasScheduled) {
      scheduleDemo();
      localStorage.setItem(`demo-reminders-${userId}`, 'true');
    }
  }, [userId]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    preferences,
    updatePreferences,
    getNotificationsByCategory,
    getUnreadNotifications,
    scheduleReminder,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
