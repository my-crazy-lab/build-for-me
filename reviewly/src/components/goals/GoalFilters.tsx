/**
 * Goal Filters Component for Reviewly Application
 * 
 * Filter and search interface for goals with status, category,
 * priority filters and text search functionality.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React from 'react';
import './GoalFilters.css';

interface GoalFiltersState {
  status: string;
  category: string;
  priority: string;
  search: string;
}

interface GoalFiltersProps {
  filters: GoalFiltersState;
  onFiltersChange: (filters: GoalFiltersState) => void;
}

const GoalFilters: React.FC<GoalFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const handleFilterChange = (key: keyof GoalFiltersState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: 'all',
      category: 'all',
      priority: 'all',
      search: '',
    });
  };

  const hasActiveFilters = 
    filters.status !== 'all' ||
    filters.category !== 'all' ||
    filters.priority !== 'all' ||
    filters.search !== '';

  return (
    <div className="goal-filters">
      <div className="filters-header">
        <h3>Filter Goals</h3>
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
              placeholder="Search goals, descriptions, or tags..."
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

        {/* Status Filter */}
        <div className="filter-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="not-started">⏳ Not Started</option>
            <option value="in-progress">🚀 In Progress</option>
            <option value="completed">✅ Completed</option>
            <option value="blocked">🚫 Blocked</option>
            <option value="cancelled">❌ Cancelled</option>
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
            <option value="professional">💼 Professional</option>
            <option value="personal">🌟 Personal</option>
            <option value="skill">🎯 Skill Development</option>
            <option value="project">📊 Project</option>
            <option value="leadership">👑 Leadership</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="filter-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="critical">🔥 Critical</option>
            <option value="high">⚡ High</option>
            <option value="medium">📋 Medium</option>
            <option value="low">📝 Low</option>
          </select>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="quick-filters">
        <h4>Quick Filters</h4>
        <div className="quick-filter-buttons">
          <button
            className={`quick-filter-btn ${filters.status === 'in-progress' ? 'active' : ''}`}
            onClick={() => handleFilterChange('status', filters.status === 'in-progress' ? 'all' : 'in-progress')}
          >
            🚀 Active Goals
          </button>
          
          <button
            className={`quick-filter-btn ${filters.priority === 'high' || filters.priority === 'critical' ? 'active' : ''}`}
            onClick={() => {
              const isActive = filters.priority === 'high' || filters.priority === 'critical';
              handleFilterChange('priority', isActive ? 'all' : 'high');
            }}
          >
            ⚡ High Priority
          </button>
          
          <button
            className={`quick-filter-btn ${filters.category === 'skill' ? 'active' : ''}`}
            onClick={() => handleFilterChange('category', filters.category === 'skill' ? 'all' : 'skill')}
          >
            🎯 Skills
          </button>
          
          <button
            className="quick-filter-btn"
            onClick={() => {
              // Filter for overdue goals (this would need additional logic in the parent component)
              onFiltersChange({
                ...filters,
                status: 'in-progress', // Show in-progress goals that might be overdue
              });
            }}
          >
            ⚠️ Overdue
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
            
            {filters.status !== 'all' && (
              <span className="active-filter">
                Status: {filters.status}
                <button onClick={() => handleFilterChange('status', 'all')}>✕</button>
              </span>
            )}
            
            {filters.category !== 'all' && (
              <span className="active-filter">
                Category: {filters.category}
                <button onClick={() => handleFilterChange('category', 'all')}>✕</button>
              </span>
            )}
            
            {filters.priority !== 'all' && (
              <span className="active-filter">
                Priority: {filters.priority}
                <button onClick={() => handleFilterChange('priority', 'all')}>✕</button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalFilters;
