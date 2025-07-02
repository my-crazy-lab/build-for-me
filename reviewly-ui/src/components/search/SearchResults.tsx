/**
 * Search Results Component for Reviewly Application
 * 
 * Display search results with sorting, pagination, and result highlighting.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SearchResult, SearchQuery, SearchSort } from '../../pages/SearchPage';
import './SearchResults.css';

interface SearchResultsProps {
  results: SearchResult[];
  query: SearchQuery;
  isLoading: boolean;
  onSortChange: (sort: SearchSort) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  query,
  isLoading,
  onSortChange,
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(results.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentResults = results.slice(startIndex, endIndex);

  // Get type icon
  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'review': return '📝';
      case 'feedback': return '💬';
      case 'goal': return '🎯';
      case 'template': return '📋';
      default: return '📄';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'success';
      case 'in-progress': return 'info';
      case 'pending': return 'warning';
      case 'draft': return 'secondary';
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      default: return 'neutral';
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Highlight search terms in text
  const highlightText = (text: string, highlights: string[]) => {
    if (!highlights.length) return text;
    
    let highlightedText = text;
    highlights.forEach(highlight => {
      const regex = new RegExp(`(${highlight})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    });
    
    return highlightedText;
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
  };

  // Handle sort change
  const handleSortChange = (field: SearchSort['field']) => {
    const newDirection = query.sort.field === field && query.sort.direction === 'desc' ? 'asc' : 'desc';
    onSortChange({ field, direction: newDirection });
  };

  if (isLoading) {
    return (
      <div className="search-results loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Searching...</p>
        </div>
      </div>
    );
  }

  if (!query.query.trim()) {
    return (
      <div className="search-results empty">
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>Start your search</h3>
          <p>Enter keywords to search across reviews, feedback, goals, and templates.</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="search-results empty">
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No results found</h3>
          <p>Try adjusting your search terms or filters to find what you're looking for.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results">
      {/* Results Header */}
      <div className="results-header">
        <div className="results-info">
          <h3>Search Results</h3>
          <p>
            Showing {startIndex + 1}-{Math.min(endIndex, results.length)} of {results.length} results
            {query.query && ` for "${query.query}"`}
          </p>
        </div>
        
        <div className="sort-controls">
          <label>Sort by:</label>
          <select
            value={`${query.sort.field}-${query.sort.direction}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-') as [SearchSort['field'], SearchSort['direction']];
              onSortChange({ field, direction });
            }}
          >
            <option value="relevance-desc">Relevance</option>
            <option value="date-desc">Date (Newest)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="rating-desc">Rating (Highest)</option>
            <option value="rating-asc">Rating (Lowest)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="author-asc">Author (A-Z)</option>
            <option value="author-desc">Author (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Results List */}
      <div className="results-list">
        {currentResults.map(result => (
          <div
            key={result.id}
            className="result-item"
            onClick={() => handleResultClick(result)}
          >
            <div className="result-header">
              <div className="result-type">
                <span className="type-icon">{getTypeIcon(result.type)}</span>
                <span className="type-label">{result.type}</span>
              </div>
              
              <div className="result-meta">
                <span className={`status-badge ${getStatusColor(result.status)}`}>
                  {result.status}
                </span>
                {result.rating && (
                  <span className="rating">
                    ⭐ {result.rating.toFixed(1)}
                  </span>
                )}
              </div>
            </div>

            <div className="result-content">
              <h4 
                className="result-title"
                dangerouslySetInnerHTML={{
                  __html: highlightText(result.title, result.highlights)
                }}
              />
              
              <p 
                className="result-excerpt"
                dangerouslySetInnerHTML={{
                  __html: highlightText(
                    result.content.length > 200 
                      ? result.content.substring(0, 200) + '...'
                      : result.content,
                    result.highlights
                  )
                }}
              />
              
              <div className="result-details">
                <span className="result-author">By {result.author}</span>
                <span className="result-date">{formatDate(result.date)}</span>
                <span className="result-category">{result.category}</span>
              </div>
              
              {result.tags.length > 0 && (
                <div className="result-tags">
                  {result.tags.map(tag => (
                    <span key={tag} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-outline btn-small"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`page-number ${page === currentPage ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            className="btn btn-outline btn-small"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
