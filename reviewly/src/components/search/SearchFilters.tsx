/**
 * Search Filters Component for Reviewly Application
 * 
 * Advanced filtering interface for search results with date ranges,
 * categories, tags, and other criteria.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState } from 'react';
import type { SearchFilters as SearchFiltersType } from '../../pages/SearchPage';
import './SearchFilters.css';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  onSaveSearch: (name: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onSaveSearch,
}) => {
  const [saveSearchName, setSaveSearchName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Handle filter changes
  const handleFilterChange = (key: keyof SearchFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  // Handle array filter toggles
  const handleArrayFilterToggle = (key: keyof SearchFiltersType, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    handleFilterChange(key, newArray);
  };

  // Clear all filters
  const handleClearFilters = () => {
    onFiltersChange({
      dateRange: {},
      status: [],
      categories: [],
      tags: [],
      authors: [],
      ratings: {},
      priority: [],
    });
  };

  // Save search
  const handleSaveSearch = () => {
    if (saveSearchName.trim()) {
      onSaveSearch(saveSearchName.trim());
      setSaveSearchName('');
      setShowSaveDialog(false);
    }
  };

  // Available filter options
  const statusOptions = [
    'completed', 'in-progress', 'pending', 'draft', 'active', 'inactive'
  ];

  const categoryOptions = [
    'Self Review', 'Peer Review', 'Manager Review', 'Goal Setting',
    'Technical Skills', 'Leadership', 'Communication', 'Feedback'
  ];

  const tagOptions = [
    'javascript', 'react', 'leadership', 'collaboration', 'technical',
    'frontend', 'backend', 'design', 'project-management', 'learning'
  ];

  const authorOptions = [
    'John Doe', 'Sarah Johnson', 'Mike Chen', 'Emily Davis', 'Admin'
  ];

  const priorityOptions = [
    'low', 'medium', 'high', 'critical'
  ];

  return (
    <div className="search-filters">
      <div className="filters-header">
        <h3>Advanced Filters</h3>
        <div className="filters-actions">
          <button
            className="btn btn-outline btn-small"
            onClick={handleClearFilters}
          >
            Clear All
          </button>
          <button
            className="btn btn-primary btn-small"
            onClick={() => setShowSaveDialog(true)}
          >
            Save Search
          </button>
        </div>
      </div>

      <div className="filters-content">
        {/* Date Range */}
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

        {/* Status */}
        <div className="filter-group">
          <h4>Status</h4>
          <div className="filter-options">
            {statusOptions.map(status => (
              <label key={status} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.status.includes(status)}
                  onChange={() => handleArrayFilterToggle('status', status)}
                />
                <span className="option-label">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="filter-group">
          <h4>Categories</h4>
          <div className="filter-options">
            {categoryOptions.map(category => (
              <label key={category} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => handleArrayFilterToggle('categories', category)}
                />
                <span className="option-label">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="filter-group">
          <h4>Tags</h4>
          <div className="filter-options">
            {tagOptions.map(tag => (
              <label key={tag} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.tags.includes(tag)}
                  onChange={() => handleArrayFilterToggle('tags', tag)}
                />
                <span className="option-label">#{tag}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Authors */}
        <div className="filter-group">
          <h4>Authors</h4>
          <div className="filter-options">
            {authorOptions.map(author => (
              <label key={author} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.authors.includes(author)}
                  onChange={() => handleArrayFilterToggle('authors', author)}
                />
                <span className="option-label">{author}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating Range */}
        <div className="filter-group">
          <h4>Rating Range</h4>
          <div className="rating-range">
            <div className="range-input">
              <label>Min:</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={filters.ratings.min || ''}
                onChange={(e) => handleFilterChange('ratings', {
                  ...filters.ratings,
                  min: e.target.value ? parseFloat(e.target.value) : undefined
                })}
                placeholder="1.0"
              />
            </div>
            <div className="range-input">
              <label>Max:</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={filters.ratings.max || ''}
                onChange={(e) => handleFilterChange('ratings', {
                  ...filters.ratings,
                  max: e.target.value ? parseFloat(e.target.value) : undefined
                })}
                placeholder="5.0"
              />
            </div>
          </div>
        </div>

        {/* Priority */}
        <div className="filter-group">
          <h4>Priority</h4>
          <div className="filter-options">
            {priorityOptions.map(priority => (
              <label key={priority} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.priority.includes(priority)}
                  onChange={() => handleArrayFilterToggle('priority', priority)}
                />
                <span className="option-label">{priority}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <div className="save-search-dialog">
          <div className="dialog-content">
            <h4>Save Search</h4>
            <input
              type="text"
              value={saveSearchName}
              onChange={(e) => setSaveSearchName(e.target.value)}
              placeholder="Enter search name..."
              className="save-search-input"
              onKeyPress={(e) => e.key === 'Enter' && handleSaveSearch()}
            />
            <div className="dialog-actions">
              <button
                className="btn btn-outline btn-small"
                onClick={() => setShowSaveDialog(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary btn-small"
                onClick={handleSaveSearch}
                disabled={!saveSearchName.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
