/**
 * Notification List Component for Reviewly Application
 * 
 * Display and manage individual notifications with actions and status indicators.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '../../pages/NotificationsPage';
import './NotificationList.css';

interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  isLoading,
  onMarkAsRead,
  onMarkAsUnread,
  onArchive,
  onDelete,
}) => {
  const navigate = useNavigate();

  // Get notification type info
  const getTypeInfo = (type: Notification['type']) => {
    switch (type) {
      case 'review_deadline':
        return { icon: '📝', label: 'Review Deadline', color: 'warning' };
      case 'feedback_request':
        return { icon: '💬', label: 'Feedback Request', color: 'info' };
      case 'goal_update':
        return { icon: '🎯', label: 'Goal Update', color: 'success' };
      case 'system_alert':
        return { icon: '🔔', label: 'System Alert', color: 'neutral' };
      case 'reminder':
        return { icon: '⏰', label: 'Reminder', color: 'secondary' };
      case 'achievement':
        return { icon: '🏆', label: 'Achievement', color: 'success' };
      default:
        return { icon: '📄', label: 'Notification', color: 'neutral' };
    }
  };

  // Get priority info
  const getPriorityInfo = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent':
        return { icon: '🚨', color: 'danger' };
      case 'high':
        return { icon: '🔴', color: 'warning' };
      case 'medium':
        return { icon: '🟡', color: 'info' };
      case 'low':
        return { icon: '🟢', color: 'success' };
      default:
        return { icon: '⚪', color: 'neutral' };
    }
  };

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if unread
    if (notification.status === 'unread') {
      onMarkAsRead(notification.id);
    }

    // Navigate to action URL if available
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  if (isLoading) {
    return (
      <div className="notification-list loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="notification-list empty">
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No notifications</h3>
          <p>You're all caught up! Check back later for new updates.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-list">
      <div className="notifications-container">
        {notifications.map(notification => {
          const typeInfo = getTypeInfo(notification.type);
          const priorityInfo = getPriorityInfo(notification.priority);

          return (
            <div
              key={notification.id}
              className={`notification-item ${notification.status} ${priorityInfo.color}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notification-indicator">
                {notification.status === 'unread' && <div className="unread-dot" />}
              </div>

              <div className="notification-icon">
                <span className="type-icon">{typeInfo.icon}</span>
                {notification.priority === 'urgent' && (
                  <span className="priority-badge urgent">{priorityInfo.icon}</span>
                )}
              </div>

              <div className="notification-content">
                <div className="notification-header">
                  <div className="notification-meta">
                    <span className={`type-label ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                    <span className="time-ago">
                      {formatRelativeTime(notification.createdAt)}
                    </span>
                  </div>
                  
                  {notification.sender && (
                    <div className="sender-info">
                      <span className="sender-avatar">{notification.sender.avatar}</span>
                      <span className="sender-name">{notification.sender.name}</span>
                    </div>
                  )}
                </div>

                <h4 className="notification-title">{notification.title}</h4>
                <p className="notification-message">{notification.message}</p>

                {notification.metadata?.deadline && (
                  <div className="deadline-info">
                    <span className="deadline-icon">⏰</span>
                    <span className="deadline-text">
                      Due: {notification.metadata.deadline.toLocaleDateString()}
                    </span>
                  </div>
                )}

                {notification.actionText && (
                  <div className="notification-action">
                    <span className="action-text">{notification.actionText}</span>
                    <span className="action-arrow">→</span>
                  </div>
                )}
              </div>

              <div className="notification-actions">
                <div className="action-buttons">
                  {notification.status === 'unread' ? (
                    <button
                      className="btn btn-ghost btn-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsRead(notification.id);
                      }}
                      title="Mark as read"
                    >
                      ✓
                    </button>
                  ) : (
                    <button
                      className="btn btn-ghost btn-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsUnread(notification.id);
                      }}
                      title="Mark as unread"
                    >
                      ○
                    </button>
                  )}

                  {notification.status !== 'archived' && (
                    <button
                      className="btn btn-ghost btn-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onArchive(notification.id);
                      }}
                      title="Archive"
                    >
                      📁
                    </button>
                  )}

                  <button
                    className="btn btn-ghost btn-small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(notification.id);
                    }}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationList;
