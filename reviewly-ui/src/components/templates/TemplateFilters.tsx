/**
 * Template Filters Component for Reviewly Application
 * 
 * Filter and search interface for templates with category, type,
 * status filters and text search functionality.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React from 'react';
import './TemplateFilters.css';

interface TemplateFiltersState {
  category: string;
  type: string;
  status: string;
  search: string;
}

interface TemplateFiltersProps {
  filters: TemplateFiltersState;
  onFiltersChange: (filters: TemplateFiltersState) => void;
}

const TemplateFilters: React.FC<TemplateFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const handleFilterChange = (key: keyof TemplateFiltersState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: 'all',
      type: 'all',
      status: 'all',
      search: '',
    });
  };

  const hasActiveFilters = 
    filters.category !== 'all' ||
    filters.type !== 'all' ||
    filters.status !== 'all' ||
    filters.search !== '';

  return (
    <div className="template-filters">
      <div className="filters-header">
        <h3>Filter Templates</h3>
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
              placeholder="Search templates, descriptions, or tags..."
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

        {/* Category Filter */}
        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="self-review">🪞 Self Review</option>
            <option value="peer-review">👥 Peer Review</option>
            <option value="manager-review">👔 Manager Review</option>
            <option value="goal-setting">🎯 Goal Setting</option>
            <option value="feedback">💬 Feedback</option>
            <option value="custom">📝 Custom</option>
          </select>
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
            <option value="company">🏢 Company-wide</option>
            <option value="department">🏬 Department</option>
            <option value="role">👤 Role-specific</option>
            <option value="personal">⭐ Personal</option>
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
            <option value="active">🟢 Active</option>
            <option value="inactive">🔴 Inactive</option>
            <option value="default">⭐ Default</option>
          </select>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="quick-filters">
        <h4>Quick Filters</h4>
        <div className="quick-filter-buttons">
          <button
            className={`quick-filter-btn ${filters.category === 'self-review' ? 'active' : ''}`}
            onClick={() => handleFilterChange('category', filters.category === 'self-review' ? 'all' : 'self-review')}
          >
            🪞 Self Reviews
          </button>
          
          <button
            className={`quick-filter-btn ${filters.status === 'default' ? 'active' : ''}`}
            onClick={() => handleFilterChange('status', filters.status === 'default' ? 'all' : 'default')}
          >
            ⭐ Default Templates
          </button>
          
          <button
            className={`quick-filter-btn ${filters.type === 'company' ? 'active' : ''}`}
            onClick={() => handleFilterChange('type', filters.type === 'company' ? 'all' : 'company')}
          >
            🏢 Company-wide
          </button>
          
          <button
            className={`quick-filter-btn ${filters.status === 'active' ? 'active' : ''}`}
            onClick={() => handleFilterChange('status', filters.status === 'active' ? 'all' : 'active')}
          >
            🟢 Active Only
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
            
            {filters.category !== 'all' && (
              <span className="active-filter">
                Category: {filters.category}
                <button onClick={() => handleFilterChange('category', 'all')}>✕</button>
              </span>
            )}
            
            {filters.type !== 'all' && (
              <span className="active-filter">
                Type: {filters.type}
                <button onClick={() => handleFilterChange('type', 'all')}>✕</button>
              </span>
            )}
            
            {filters.status !== 'all' && (
              <span className="active-filter">
                Status: {filters.status}
                <button onClick={() => handleFilterChange('status', 'all')}>✕</button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateFilters;
