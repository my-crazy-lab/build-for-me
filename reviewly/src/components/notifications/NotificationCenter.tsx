/**
 * Notification Center Component for Reviewly Application
 * 
 * Comprehensive notification display with filtering, grouping,
 * and interactive management features.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import { 
  getPriorityIcon, 
  getCategoryIcon, 
  groupNotificationsByDate,
  formatTimeRemaining
} from '../../utils/notifications';
import type { NotificationCategory } from '../../utils/notifications';
import './NotificationCenter.css';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  compact?: boolean;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  compact = false
}) => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    getNotificationsByCategory
  } = useNotifications();

  const [filter, setFilter] = useState<'all' | 'unread' | NotificationCategory>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');

  // Filter and sort notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Apply category/status filter
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.read);
    } else if (filter !== 'all') {
      filtered = getNotificationsByCategory(filter as NotificationCategory);
    }

    // Sort notifications
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.timestamp.getTime() - a.timestamp.getTime();
        case 'oldest':
          return a.timestamp.getTime() - b.timestamp.getTime();
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });

    return filtered;
  }, [notifications, filter, sortBy, getNotificationsByCategory]);

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    return groupNotificationsByDate(filteredNotifications);
  }, [filteredNotifications]);

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      onClose();
    }
  };

  const formatRelativeTime = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (!isOpen) return null;

  return (
    <div className="notification-center-overlay" onClick={onClose}>
      <div 
        className={`notification-center ${compact ? 'compact' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="notification-header">
          <div className="header-title">
            <h3>🔔 Notifications</h3>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </div>
          
          <div className="header-actions">
            {unreadCount > 0 && (
              <button
                className="btn btn-text btn-small"
                onClick={markAllAsRead}
              >
                Mark all read
              </button>
            )}
            
            <button
              className="btn btn-text btn-small"
              onClick={clearAllNotifications}
            >
              Clear all
            </button>
            
            <button
              className="close-button"
              onClick={onClose}
              aria-label="Close notifications"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="notification-filters">
          <div className="filter-group">
            <label>Filter:</label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value as any)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="reviews">Reviews</option>
              <option value="feedback">Feedback</option>
              <option value="goals">Goals</option>
              <option value="achievements">Achievements</option>
              <option value="team">Team</option>
              <option value="system">System</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Sort:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="filter-select"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h4>No notifications</h4>
              <p>
                {filter === 'unread' 
                  ? "You're all caught up! No unread notifications."
                  : "No notifications to show."}
              </p>
            </div>
          ) : (
            Object.entries(groupedNotifications).map(([date, dayNotifications]) => (
              <div key={date} className="notification-group">
                <div className="group-header">
                  <span className="group-date">
                    {new Date(date).toDateString() === new Date().toDateString() 
                      ? 'Today' 
                      : new Date(date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                  </span>
                </div>
                
                <div className="group-notifications">
                  {dayNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-item ${!notification.read ? 'unread' : ''} ${notification.priority}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="notification-content">
                        <div className="notification-header-item">
                          <div className="notification-icons">
                            <span className="category-icon">
                              {getCategoryIcon(notification.category)}
                            </span>
                            <span className="priority-icon">
                              {getPriorityIcon(notification.priority)}
                            </span>
                          </div>
                          
                          <div className="notification-meta">
                            <span className="notification-time">
                              {formatRelativeTime(notification.timestamp)}
                            </span>
                            {!notification.read && (
                              <span className="unread-indicator">●</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="notification-body">
                          <h4 className="notification-title">
                            {notification.title}
                          </h4>
                          <p className="notification-message">
                            {notification.message}
                          </p>
                          
                          {notification.actionLabel && (
                            <div className="notification-action">
                              <span className="action-label">
                                {notification.actionLabel} →
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <button
                        className="remove-notification"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        aria-label="Remove notification"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {!compact && (
          <div className="notification-footer">
            <button
              className="btn btn-outline btn-medium"
              onClick={() => {
                navigate('/notifications');
                onClose();
              }}
            >
              View All Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
