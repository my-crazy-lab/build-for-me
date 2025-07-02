/**
 * Notifications Page Component for Reviewly Application
 * 
 * Comprehensive notification management system for review deadlines,
 * feedback requests, goal updates, and system alerts.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/SimpleAuthContext';
import NotificationList from '../components/notifications/NotificationList';
import NotificationFilters from '../components/notifications/NotificationFilters';
import NotificationSettings from '../components/notifications/NotificationSettings';
import './NotificationsPage.css';

// Notification interfaces
export interface Notification {
  id: string;
  type: 'review_deadline' | 'feedback_request' | 'goal_update' | 'system_alert' | 'reminder' | 'achievement';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'unread' | 'read' | 'archived';
  createdAt: Date;
  readAt?: Date;
  actionUrl?: string;
  actionText?: string;
  sender?: {
    name: string;
    avatar?: string;
  };
  metadata?: {
    reviewId?: string;
    goalId?: string;
    templateId?: string;
    deadline?: Date;
    [key: string]: any;
  };
}

export interface NotificationFilters {
  types: string[];
  priorities: string[];
  status: 'all' | 'unread' | 'read' | 'archived';
  dateRange: {
    start?: Date;
    end?: Date;
  };
}

export interface NotificationSettings {
  emailNotifications: {
    enabled: boolean;
    reviewDeadlines: boolean;
    feedbackRequests: boolean;
    goalUpdates: boolean;
    systemAlerts: boolean;
    weeklyDigest: boolean;
  };
  inAppNotifications: {
    enabled: boolean;
    showBadge: boolean;
    playSound: boolean;
    desktop: boolean;
  };
  frequency: {
    immediate: boolean;
    daily: boolean;
    weekly: boolean;
  };
}

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filters, setFilters] = useState<NotificationFilters>({
    types: [],
    priorities: [],
    status: 'all',
    dateRange: {},
  });
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: {
      enabled: true,
      reviewDeadlines: true,
      feedbackRequests: true,
      goalUpdates: false,
      systemAlerts: true,
      weeklyDigest: true,
    },
    inAppNotifications: {
      enabled: true,
      showBadge: true,
      playSound: false,
      desktop: true,
    },
    frequency: {
      immediate: true,
      daily: false,
      weekly: false,
    },
  });
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load notifications and settings
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Load notifications from localStorage
      const savedNotifications = localStorage.getItem(`reviewly_notifications_${user?.id}`);
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications);
        const notificationsWithDates = parsed.map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
          readAt: n.readAt ? new Date(n.readAt) : undefined,
          metadata: {
            ...n.metadata,
            deadline: n.metadata?.deadline ? new Date(n.metadata.deadline) : undefined,
          },
        }));
        setNotifications(notificationsWithDates);
      } else {
        // Generate mock notifications
        const mockNotifications: Notification[] = [
          {
            id: '1',
            type: 'review_deadline',
            title: 'Q4 Self Review Due Soon',
            message: 'Your Q4 self review is due in 3 days. Please complete it by December 31st.',
            priority: 'high',
            status: 'unread',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            actionUrl: '/self-review',
            actionText: 'Complete Review',
            metadata: {
              reviewId: 'review-123',
              deadline: new Date('2024-12-31'),
            },
          },
          {
            id: '2',
            type: 'feedback_request',
            title: 'Feedback Request from Sarah',
            message: 'Sarah Johnson has requested your feedback on her recent project work.',
            priority: 'medium',
            status: 'unread',
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
            sender: {
              name: 'Sarah Johnson',
              avatar: '👩‍💼',
            },
            actionUrl: '/feedback/give',
            actionText: 'Provide Feedback',
          },
          {
            id: '3',
            type: 'goal_update',
            title: 'Goal Progress Updated',
            message: 'Your goal "Master React Advanced Patterns" has been updated to 85% complete.',
            priority: 'low',
            status: 'read',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            readAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
            actionUrl: '/goals',
            actionText: 'View Goals',
            metadata: {
              goalId: 'goal-456',
            },
          },
          {
            id: '4',
            type: 'system_alert',
            title: 'New Template Available',
            message: 'A new "Engineering Leadership Review" template has been added to your organization.',
            priority: 'low',
            status: 'read',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            readAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            actionUrl: '/templates',
            actionText: 'View Templates',
          },
          {
            id: '5',
            type: 'achievement',
            title: 'Achievement Unlocked!',
            message: 'Congratulations! You\'ve completed 5 peer feedback requests this month.',
            priority: 'medium',
            status: 'read',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            readAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          },
          {
            id: '6',
            type: 'reminder',
            title: 'Weekly Check-in Reminder',
            message: 'Don\'t forget to update your weekly goals progress.',
            priority: 'low',
            status: 'archived',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
            readAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
            actionUrl: '/goals',
            actionText: 'Update Progress',
          },
        ];
        
        setNotifications(mockNotifications);
        localStorage.setItem(`reviewly_notifications_${user?.id}`, JSON.stringify(mockNotifications));
      }

      // Load settings from localStorage
      const savedSettings = localStorage.getItem(`reviewly_notification_settings_${user?.id}`);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }

      setIsLoading(false);
    };

    loadData();
  }, [user?.id]);

  // Save notifications to localStorage
  const saveNotifications = (updatedNotifications: Notification[]) => {
    setNotifications(updatedNotifications);
    localStorage.setItem(`reviewly_notifications_${user?.id}`, JSON.stringify(updatedNotifications));
  };

  // Save settings to localStorage
  const saveSettings = (updatedSettings: NotificationSettings) => {
    setSettings(updatedSettings);
    localStorage.setItem(`reviewly_notification_settings_${user?.id}`, JSON.stringify(updatedSettings));
  };

  // Mark notification as read
  const handleMarkAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, status: 'read' as const, readAt: new Date() }
        : notification
    );
    saveNotifications(updatedNotifications);
  };

  // Mark notification as unread
  const handleMarkAsUnread = (notificationId: string) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, status: 'unread' as const, readAt: undefined }
        : notification
    );
    saveNotifications(updatedNotifications);
  };

  // Archive notification
  const handleArchive = (notificationId: string) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, status: 'archived' as const }
        : notification
    );
    saveNotifications(updatedNotifications);
  };

  // Delete notification
  const handleDelete = (notificationId: string) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== notificationId);
    saveNotifications(updatedNotifications);
  };

  // Mark all as read
  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map(notification =>
      notification.status === 'unread'
        ? { ...notification, status: 'read' as const, readAt: new Date() }
        : notification
    );
    saveNotifications(updatedNotifications);
  };

  // Clear all archived
  const handleClearArchived = () => {
    const updatedNotifications = notifications.filter(notification => notification.status !== 'archived');
    saveNotifications(updatedNotifications);
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    // Status filter
    if (filters.status !== 'all' && notification.status !== filters.status) {
      return false;
    }

    // Type filter
    if (filters.types.length > 0 && !filters.types.includes(notification.type)) {
      return false;
    }

    // Priority filter
    if (filters.priorities.length > 0 && !filters.priorities.includes(notification.priority)) {
      return false;
    }

    // Date range filter
    if (filters.dateRange.start && notification.createdAt < filters.dateRange.start) {
      return false;
    }
    if (filters.dateRange.end && notification.createdAt > filters.dateRange.end) {
      return false;
    }

    return true;
  });

  // Calculate statistics
  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => n.status === 'unread').length,
    read: notifications.filter(n => n.status === 'read').length,
    archived: notifications.filter(n => n.status === 'archived').length,
    urgent: notifications.filter(n => n.priority === 'urgent' && n.status === 'unread').length,
  };

  return (
    <div className="notifications-page">
      {/* Header */}
      <div className="page-header">
        <button
          className="btn btn-outline btn-medium back-button"
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </button>
        
        <div className="header-info">
          <h1>Notifications</h1>
          <p>Stay updated with reviews, feedback, and important alerts</p>
        </div>
        
        <div className="header-actions">
          <button
            className="btn btn-secondary btn-medium"
            onClick={() => setShowSettings(!showSettings)}
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="notifications-stats">
        <div className="stat-card">
          <div className="stat-icon">📬</div>
          <div className="stat-content">
            <h3>Total</h3>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔔</div>
          <div className="stat-content">
            <h3>Unread</h3>
            <p className="stat-value">{stats.unread}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Read</h3>
            <p className="stat-value">{stats.read}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📁</div>
          <div className="stat-content">
            <h3>Archived</h3>
            <p className="stat-value">{stats.archived}</p>
          </div>
        </div>
        
        {stats.urgent > 0 && (
          <div className="stat-card urgent">
            <div className="stat-icon">🚨</div>
            <div className="stat-content">
              <h3>Urgent</h3>
              <p className="stat-value">{stats.urgent}</p>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <NotificationFilters
        filters={filters}
        onFiltersChange={setFilters}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearArchived={handleClearArchived}
        stats={stats}
      />

      {/* Settings Panel */}
      {showSettings && (
        <NotificationSettings
          settings={settings}
          onSettingsChange={saveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Notifications List */}
      <NotificationList
        notifications={filteredNotifications}
        isLoading={isLoading}
        onMarkAsRead={handleMarkAsRead}
        onMarkAsUnread={handleMarkAsUnread}
        onArchive={handleArchive}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default NotificationsPage;
