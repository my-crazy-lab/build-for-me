/**
 * Saved Searches Component for Reviewly Application
 * 
 * Management interface for saved search queries with usage statistics
 * and quick access functionality.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React from 'react';
import type { SavedSearch } from '../../pages/SearchPage';
import './SavedSearches.css';

interface SavedSearchesProps {
  savedSearches: SavedSearch[];
  onLoadSearch: (search: SavedSearch) => void;
  onDeleteSearch: (searchId: string) => void;
  onClose: () => void;
}

const SavedSearches: React.FC<SavedSearchesProps> = ({
  savedSearches,
  onLoadSearch,
  onDeleteSearch,
  onClose,
}) => {
  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  // Get search summary
  const getSearchSummary = (search: SavedSearch) => {
    const { query } = search;
    const parts = [];
    
    if (query.query) parts.push(`"${query.query}"`);
    if (query.type !== 'all') parts.push(`in ${query.type}`);
    
    const activeFilters = [
      ...query.filters.status,
      ...query.filters.categories,
      ...query.filters.tags,
      ...query.filters.authors,
      ...query.filters.priority,
    ];
    
    if (activeFilters.length > 0) {
      parts.push(`${activeFilters.length} filter${activeFilters.length > 1 ? 's' : ''}`);
    }
    
    return parts.join(' • ') || 'All items';
  };

  if (savedSearches.length === 0) {
    return (
      <div className="saved-searches-panel">
        <div className="panel-header">
          <h3>Saved Searches</h3>
          <button className="btn btn-ghost btn-small" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="empty-saved-searches">
          <div className="empty-icon">📁</div>
          <h4>No saved searches</h4>
          <p>Save your frequently used searches for quick access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-searches-panel">
      <div className="panel-header">
        <h3>Saved Searches</h3>
        <button className="btn btn-ghost btn-small" onClick={onClose}>
          ✕
        </button>
      </div>
      
      <div className="saved-searches-list">
        {savedSearches
          .sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime())
          .map(search => (
            <div key={search.id} className="saved-search-item">
              <div className="search-info" onClick={() => onLoadSearch(search)}>
                <div className="search-header">
                  <h4 className="search-name">{search.name}</h4>
                  <div className="search-stats">
                    <span className="use-count">{search.useCount} uses</span>
                  </div>
                </div>
                
                <p className="search-summary">{getSearchSummary(search)}</p>
                
                <div className="search-meta">
                  <span className="created-date">
                    Created {formatDate(search.createdAt)}
                  </span>
                  <span className="last-used">
                    Last used {formatRelativeTime(search.lastUsed)}
                  </span>
                </div>
              </div>
              
              <div className="search-actions">
                <button
                  className="btn btn-ghost btn-small"
                  onClick={() => onLoadSearch(search)}
                  title="Load search"
                >
                  🔍
                </button>
                <button
                  className="btn btn-ghost btn-small"
                  onClick={() => onDeleteSearch(search.id)}
                  title="Delete search"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SavedSearches;
