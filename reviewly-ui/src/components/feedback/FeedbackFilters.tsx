/**
 * Feedback Filters Component for Reviewly Application
 * 
 * Filter and search interface for feedback with type, category,
 * status, and anonymity filters.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React from 'react';
import './FeedbackFilters.css';

interface FeedbackFiltersState {
  type: string;
  category: string;
  status: string;
  isAnonymous: string;
  search: string;
}

interface FeedbackFiltersProps {
  filters: FeedbackFiltersState;
  onFiltersChange: (filters: FeedbackFiltersState) => void;
}

const FeedbackFilters: React.FC<FeedbackFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const handleFilterChange = (key: keyof FeedbackFiltersState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      type: 'all',
      category: 'all',
      status: 'all',
      isAnonymous: 'all',
      search: '',
    });
  };

  const hasActiveFilters = 
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.status !== 'all' ||
    filters.isAnonymous !== 'all' ||
    filters.search !== '';

  return (
    <div className="feedback-filters">
      <div className="filters-header">
        <h3>Filter Feedback</h3>
        {hasActiveFilters && (
          <button
            className="btn btn-ghost btn-small"
            onClick={clearFilters}
          >
            Clear All
          </button>
        )}
      </div>

      <div className="filters-content">
        {/* Search */}
        <div className="filter-group">
          <label htmlFor="search">Search</label>
          <div className="search-input">
            <span className="search-icon">🔍</span>
            <input
              id="search"
              type="text"
              placeholder="Search feedback content, names, or tags..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            {filters.search && (
              <button
                className="clear-search"
                onClick={() => handleFilterChange('search', '')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Type Filter */}
        <div className="filter-group">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="peer">👥 Peer Feedback</option>
            <option value="manager">👔 Manager Feedback</option>
            <option value="direct-report">👤 Direct Report</option>
            <option value="self">🪞 Self Assessment</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="performance">📊 Performance</option>
            <option value="collaboration">🤝 Collaboration</option>
            <option value="leadership">👑 Leadership</option>
            <option value="communication">💬 Communication</option>
            <option value="technical">⚙️ Technical</option>
            <option value="general">📝 General</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="submitted">📤 Submitted</option>
            <option value="acknowledged">✅ Acknowledged</option>
            <option value="draft">📝 Draft</option>
          </select>
        </div>

        {/* Anonymous Filter */}
        <div className="filter-group">
          <label htmlFor="isAnonymous">Anonymity</label>
          <select
            id="isAnonymous"
            value={filters.isAnonymous}
            onChange={(e) => handleFilterChange('isAnonymous', e.target.value)}
          >
            <option value="all">All Feedback</option>
            <option value="true">🎭 Anonymous Only</option>
            <option value="false">👤 Named Only</option>
          </select>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="quick-filters">
        <h4>Quick Filters</h4>
        <div className="quick-filter-buttons">
          <button
            className={`quick-filter-btn ${filters.status === 'submitted' ? 'active' : ''}`}
            onClick={() => handleFilterChange('status', filters.status === 'submitted' ? 'all' : 'submitted')}
          >
            📤 Unread
          </button>
          
          <button
            className={`quick-filter-btn ${filters.isAnonymous === 'true' ? 'active' : ''}`}
            onClick={() => handleFilterChange('isAnonymous', filters.isAnonymous === 'true' ? 'all' : 'true')}
          >
            🎭 Anonymous
          </button>
          
          <button
            className={`quick-filter-btn ${filters.category === 'performance' ? 'active' : ''}`}
            onClick={() => handleFilterChange('category', filters.category === 'performance' ? 'all' : 'performance')}
          >
            📊 Performance
          </button>
          
          <button
            className={`quick-filter-btn ${filters.type === 'peer' ? 'active' : ''}`}
            onClick={() => handleFilterChange('type', filters.type === 'peer' ? 'all' : 'peer')}
          >
            👥 Peer Only
          </button>
        </div>
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="filter-summary">
          <h4>Active Filters:</h4>
          <div className="active-filters">
            {filters.search && (
              <span className="active-filter">
                Search: "{filters.search}"
                <button onClick={() => handleFilterChange('search', '')}>✕</button>
              </span>
            )}
            
            {filters.type !== 'all' && (
              <span className="active-filter">
                Type: {filters.type}
                <button onClick={() => handleFilterChange('type', 'all')}>✕</button>
              </span>
            )}
            
            {filters.category !== 'all' && (
              <span className="active-filter">
                Category: {filters.category}
                <button onClick={() => handleFilterChange('category', 'all')}>✕</button>
              </span>
            )}
            
            {filters.status !== 'all' && (
              <span className="active-filter">
                Status: {filters.status}
                <button onClick={() => handleFilterChange('status', 'all')}>✕</button>
              </span>
            )}
            
            {filters.isAnonymous !== 'all' && (
              <span className="active-filter">
                Anonymous: {filters.isAnonymous === 'true' ? 'Yes' : 'No'}
                <button onClick={() => handleFilterChange('isAnonymous', 'all')}>✕</button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackFilters;
