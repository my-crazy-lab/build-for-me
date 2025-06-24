/**
 * Notification Bell Component for Reviewly Application
 * 
 * Interactive notification bell with badge counter and
 * dropdown notification center integration.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationCenter from './NotificationCenter';
import './NotificationBell.css';

interface NotificationBellProps {
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  compact?: boolean;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  size = 'medium',
  showLabel = false,
  compact = false
}) => {
  const { unreadCount, notifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);
  const previousCountRef = useRef(unreadCount);

  // Animate bell when new notifications arrive
  useEffect(() => {
    if (unreadCount > previousCountRef.current) {
      setHasNewNotification(true);
      
      // Reset animation after it completes
      const timer = setTimeout(() => {
        setHasNewNotification(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
    
    previousCountRef.current = unreadCount;
  }, [unreadCount]);

  // Close notification center when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Get the most recent high-priority notification for preview
  const latestHighPriorityNotification = notifications
    .filter(n => !n.read && (n.priority === 'high' || n.priority === 'urgent'))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

  const handleBellClick = () => {
    setIsOpen(!isOpen);
  };

  const getBellIcon = () => {
    if (hasNewNotification) {
      return '🔔'; // Animated bell
    }
    return unreadCount > 0 ? '🔔' : '🔕';
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'small';
      case 'large': return 'large';
      default: return 'medium';
    }
  };

  return (
    <div className="notification-bell-container">
      <button
        ref={bellRef}
        className={`notification-bell ${getSizeClass()} ${hasNewNotification ? 'animate' : ''} ${isOpen ? 'active' : ''}`}
        onClick={handleBellClick}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        title={unreadCount > 0 ? `${unreadCount} unread notifications` : 'No new notifications'}
      >
        <span className="bell-icon">{getBellIcon()}</span>
        
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        
        {showLabel && (
          <span className="bell-label">
            Notifications
          </span>
        )}
      </button>

      {/* Quick preview tooltip for high-priority notifications */}
      {latestHighPriorityNotification && !isOpen && (
        <div className="notification-preview">
          <div className="preview-content">
            <div className="preview-header">
              <span className="preview-priority">
                {latestHighPriorityNotification.priority === 'urgent' ? '🚨' : '🔴'}
              </span>
              <span className="preview-title">
                {latestHighPriorityNotification.title}
              </span>
            </div>
            <p className="preview-message">
              {latestHighPriorityNotification.message.length > 60
                ? `${latestHighPriorityNotification.message.substring(0, 60)}...`
                : latestHighPriorityNotification.message}
            </p>
          </div>
          <div className="preview-arrow"></div>
        </div>
      )}

      {/* Notification Center */}
      <NotificationCenter
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        compact={compact}
      />
    </div>
  );
};

export default NotificationBell;
