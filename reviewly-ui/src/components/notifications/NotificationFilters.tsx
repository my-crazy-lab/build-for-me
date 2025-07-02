/**
 * Notification Filters Component for Reviewly Application
 * 
 * Filter controls for notifications with type, priority, status, and date filters.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React from 'react';
import type { NotificationFilters as NotificationFiltersType } from '../../pages/NotificationsPage';
import './NotificationFilters.css';

interface NotificationFiltersProps {
  filters: NotificationFiltersType;
  onFiltersChange: (filters: NotificationFiltersType) => void;
  onMarkAllAsRead: () => void;
  onClearArchived: () => void;
  stats: {
    total: number;
    unread: number;
    read: number;
    archived: number;
    urgent: number;
  };
}

const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  filters,
  onFiltersChange,
  onMarkAllAsRead,
  onClearArchived,
  stats,
}) => {
  // Handle filter changes
  const handleFilterChange = (key: keyof NotificationFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  // Handle array filter toggles
  const handleArrayFilterToggle = (key: 'types' | 'priorities', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    handleFilterChange(key, newArray);
  };

  // Clear all filters
  const handleClearFilters = () => {
    onFiltersChange({
      types: [],
      priorities: [],
      status: 'all',
      dateRange: {},
    });
  };

  // Available filter options
  const typeOptions = [
    { value: 'review_deadline', label: 'Review Deadlines', icon: '📝' },
    { value: 'feedback_request', label: 'Feedback Requests', icon: '💬' },
    { value: 'goal_update', label: 'Goal Updates', icon: '🎯' },
    { value: 'system_alert', label: 'System Alerts', icon: '🔔' },
    { value: 'reminder', label: 'Reminders', icon: '⏰' },
    { value: 'achievement', label: 'Achievements', icon: '🏆' },
  ];

  const priorityOptions = [
    { value: 'urgent', label: 'Urgent', icon: '🚨', color: 'danger' },
    { value: 'high', label: 'High', icon: '🔴', color: 'warning' },
    { value: 'medium', label: 'Medium', icon: '🟡', color: 'info' },
    { value: 'low', label: 'Low', icon: '🟢', color: 'success' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All', count: stats.total },
    { value: 'unread', label: 'Unread', count: stats.unread },
    { value: 'read', label: 'Read', count: stats.read },
    { value: 'archived', label: 'Archived', count: stats.archived },
  ];

  return (
    <div className="notification-filters">
      <div className="filters-header">
        <h3>Filters</h3>
        <div className="filters-actions">
          <button
            className="btn btn-outline btn-small"
            onClick={handleClearFilters}
          >
            Clear All
          </button>
          {stats.unread > 0 && (
            <button
              className="btn btn-primary btn-small"
              onClick={onMarkAllAsRead}
            >
              Mark All Read ({stats.unread})
            </button>
          )}
          {stats.archived > 0 && (
            <button
              className="btn btn-secondary btn-small"
              onClick={onClearArchived}
            >
              Clear Archived ({stats.archived})
            </button>
          )}
        </div>
      </div>

      <div className="filters-content">
        {/* Status Filter */}
        <div className="filter-group">
          <h4>Status</h4>
          <div className="status-buttons">
            {statusOptions.map(option => (
              <button
                key={option.value}
                className={`status-btn ${filters.status === option.value ? 'active' : ''}`}
                onClick={() => handleFilterChange('status', option.value)}
              >
                <span className="status-label">{option.label}</span>
                <span className="status-count">{option.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div className="filter-group">
          <h4>Types</h4>
          <div className="filter-options">
            {typeOptions.map(type => (
              <label key={type.value} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.types.includes(type.value)}
                  onChange={() => handleArrayFilterToggle('types', type.value)}
                />
                <span className="option-icon">{type.icon}</span>
                <span className="option-label">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div className="filter-group">
          <h4>Priority</h4>
          <div className="filter-options">
            {priorityOptions.map(priority => (
              <label key={priority.value} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.priorities.includes(priority.value)}
                  onChange={() => handleArrayFilterToggle('priorities', priority.value)}
                />
                <span className="option-icon">{priority.icon}</span>
                <span className={`option-label ${priority.color}`}>{priority.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="filter-group">
          <h4>Date Range</h4>
          <div className="date-range-inputs">
            <div className="date-input">
              <label>From:</label>
              <input
                type="date"
                value={filters.dateRange.start?.toISOString().split('T')[0] || ''}
                onChange={(e) => handleFilterChange('dateRange', {
                  ...filters.dateRange,
                  start: e.target.value ? new Date(e.target.value) : undefined
                })}
              />
            </div>
            <div className="date-input">
              <label>To:</label>
              <input
                type="date"
                value={filters.dateRange.end?.toISOString().split('T')[0] || ''}
                onChange={(e) => handleFilterChange('dateRange', {
                  ...filters.dateRange,
                  end: e.target.value ? new Date(e.target.value) : undefined
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationFilters;
