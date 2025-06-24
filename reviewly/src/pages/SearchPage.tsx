/**
 * Search Page Component for Reviewly Application
 * 
 * Advanced search functionality across reviews, feedback, goals, and templates
 * with filters, sorting, and saved searches.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/SimpleAuthContext';
import SearchFilters from '../components/search/SearchFilters';
import SearchResults from '../components/search/SearchResults';
import SavedSearches from '../components/search/SavedSearches';
import './SearchPage.css';

// Search interfaces
export interface SearchQuery {
  query: string;
  type: 'all' | 'reviews' | 'feedback' | 'goals' | 'templates';
  filters: SearchFilters;
  sort: SearchSort;
}

export interface SearchFilters {
  dateRange: {
    start?: Date;
    end?: Date;
  };
  status: string[];
  categories: string[];
  tags: string[];
  authors: string[];
  ratings: {
    min?: number;
    max?: number;
  };
  priority: string[];
}

export interface SearchSort {
  field: 'relevance' | 'date' | 'rating' | 'title' | 'author';
  direction: 'asc' | 'desc';
}

export interface SearchResult {
  id: string;
  type: 'review' | 'feedback' | 'goal' | 'template';
  title: string;
  content: string;
  author: string;
  date: Date;
  rating?: number;
  status: string;
  category: string;
  tags: string[];
  highlights: string[];
  url: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: SearchQuery;
  createdAt: Date;
  lastUsed: Date;
  useCount: number;
}

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    query: searchParams.get('q') || '',
    type: (searchParams.get('type') as SearchQuery['type']) || 'all',
    filters: {
      dateRange: {},
      status: [],
      categories: [],
      tags: [],
      authors: [],
      ratings: {},
      priority: [],
    },
    sort: {
      field: 'relevance',
      direction: 'desc',
    },
  });

  const [results, setResults] = useState<SearchResult[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSavedSearches, setShowSavedSearches] = useState(false);

  // Load saved searches
  useEffect(() => {
    const saved = localStorage.getItem(`reviewly_saved_searches_${user?.id}`);
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    }
  }, [user?.id]);

  // Perform search when query changes
  useEffect(() => {
    if (searchQuery.query.trim()) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  // Mock search function
  const performSearch = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'review',
          title: 'Q3 2024 Self Review',
          content: 'This quarter I focused on improving my JavaScript skills and leading the new dashboard project...',
          author: 'John Doe',
          date: new Date('2024-10-15'),
          rating: 4.2,
          status: 'completed',
          category: 'Self Review',
          tags: ['javascript', 'leadership', 'dashboard'],
          highlights: ['JavaScript skills', 'dashboard project'],
          url: '/reviews/1',
        },
        {
          id: '2',
          type: 'feedback',
          title: 'Peer Feedback from Sarah',
          content: 'John has shown excellent collaboration skills and technical expertise in our recent project...',
          author: 'Sarah Johnson',
          date: new Date('2024-11-20'),
          rating: 4.5,
          status: 'received',
          category: 'Peer Feedback',
          tags: ['collaboration', 'technical'],
          highlights: ['collaboration skills', 'technical expertise'],
          url: '/feedback/2',
        },
        {
          id: '3',
          type: 'goal',
          title: 'Master React Advanced Patterns',
          content: 'Learn and implement advanced React patterns including render props, higher-order components...',
          author: 'John Doe',
          date: new Date('2024-09-01'),
          status: 'in-progress',
          category: 'Technical Skills',
          tags: ['react', 'frontend', 'learning'],
          highlights: ['React patterns', 'higher-order components'],
          url: '/goals/3',
        },
        {
          id: '4',
          type: 'template',
          title: 'Engineering Self Review Template',
          content: 'Comprehensive template for engineering self-reviews including technical achievements...',
          author: 'Admin',
          date: new Date('2024-08-15'),
          status: 'active',
          category: 'Self Review',
          tags: ['engineering', 'template'],
          highlights: ['engineering self-reviews', 'technical achievements'],
          url: '/templates/4',
        },
      ];

      // Filter results based on search query and filters
      let filteredResults = mockResults.filter(result => {
        const matchesQuery = result.title.toLowerCase().includes(searchQuery.query.toLowerCase()) ||
                           result.content.toLowerCase().includes(searchQuery.query.toLowerCase()) ||
                           result.tags.some(tag => tag.toLowerCase().includes(searchQuery.query.toLowerCase()));
        
        const matchesType = searchQuery.type === 'all' || result.type === searchQuery.type;
        
        return matchesQuery && matchesType;
      });

      // Apply additional filters
      if (searchQuery.filters.categories.length > 0) {
        filteredResults = filteredResults.filter(result =>
          searchQuery.filters.categories.includes(result.category)
        );
      }

      if (searchQuery.filters.status.length > 0) {
        filteredResults = filteredResults.filter(result =>
          searchQuery.filters.status.includes(result.status)
        );
      }

      // Sort results
      filteredResults.sort((a, b) => {
        const { field, direction } = searchQuery.sort;
        let comparison = 0;

        switch (field) {
          case 'date':
            comparison = a.date.getTime() - b.date.getTime();
            break;
          case 'rating':
            comparison = (a.rating || 0) - (b.rating || 0);
            break;
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'author':
            comparison = a.author.localeCompare(b.author);
            break;
          default: // relevance
            comparison = 0;
        }

        return direction === 'desc' ? -comparison : comparison;
      });

      setResults(filteredResults);
      setIsLoading(false);
    }, 800);
  };

  // Update search params in URL
  const updateSearchParams = (newQuery: SearchQuery) => {
    const params = new URLSearchParams();
    if (newQuery.query) params.set('q', newQuery.query);
    if (newQuery.type !== 'all') params.set('type', newQuery.type);
    setSearchParams(params);
  };

  // Handle search query change
  const handleSearchChange = (newQuery: Partial<SearchQuery>) => {
    const updatedQuery = { ...searchQuery, ...newQuery };
    setSearchQuery(updatedQuery);
    updateSearchParams(updatedQuery);
  };

  // Save current search
  const handleSaveSearch = (name: string) => {
    const newSavedSearch: SavedSearch = {
      id: Date.now().toString(),
      name,
      query: searchQuery,
      createdAt: new Date(),
      lastUsed: new Date(),
      useCount: 1,
    };

    const updatedSavedSearches = [...savedSearches, newSavedSearch];
    setSavedSearches(updatedSavedSearches);
    localStorage.setItem(`reviewly_saved_searches_${user?.id}`, JSON.stringify(updatedSavedSearches));
  };

  // Load saved search
  const handleLoadSavedSearch = (savedSearch: SavedSearch) => {
    setSearchQuery(savedSearch.query);
    updateSearchParams(savedSearch.query);
    
    // Update usage stats
    const updatedSavedSearches = savedSearches.map(search =>
      search.id === savedSearch.id
        ? { ...search, lastUsed: new Date(), useCount: search.useCount + 1 }
        : search
    );
    setSavedSearches(updatedSavedSearches);
    localStorage.setItem(`reviewly_saved_searches_${user?.id}`, JSON.stringify(updatedSavedSearches));
  };

  // Delete saved search
  const handleDeleteSavedSearch = (searchId: string) => {
    const updatedSavedSearches = savedSearches.filter(search => search.id !== searchId);
    setSavedSearches(updatedSavedSearches);
    localStorage.setItem(`reviewly_saved_searches_${user?.id}`, JSON.stringify(updatedSavedSearches));
  };

  // Search statistics
  const searchStats = useMemo(() => {
    const typeCount = results.reduce((acc, result) => {
      acc[result.type] = (acc[result.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: results.length,
      byType: typeCount,
    };
  }, [results]);

  return (
    <div className="search-page">
      {/* Header */}
      <div className="page-header">
        <button
          className="btn btn-outline btn-medium back-button"
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </button>
        
        <div className="header-info">
          <h1>Search</h1>
          <p>Find reviews, feedback, goals, and templates</p>
        </div>
        
        <div className="header-actions">
          <button
            className="btn btn-secondary btn-medium"
            onClick={() => setShowSavedSearches(!showSavedSearches)}
          >
            📁 Saved Searches
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar-container">
        <div className="search-bar">
          <div className="search-input">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              value={searchQuery.query}
              onChange={(e) => handleSearchChange({ query: e.target.value })}
              placeholder="Search reviews, feedback, goals, and templates..."
              className="search-field"
            />
            {searchQuery.query && (
              <button
                className="clear-search"
                onClick={() => handleSearchChange({ query: '' })}
              >
                ✕
              </button>
            )}
          </div>
          
          <div className="search-controls">
            <select
              value={searchQuery.type}
              onChange={(e) => handleSearchChange({ type: e.target.value as SearchQuery['type'] })}
              className="type-selector"
            >
              <option value="all">All Types</option>
              <option value="reviews">Reviews</option>
              <option value="feedback">Feedback</option>
              <option value="goals">Goals</option>
              <option value="templates">Templates</option>
            </select>
            
            <button
              className={`btn btn-outline btn-medium ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              🔧 Filters
            </button>
          </div>
        </div>

        {/* Search Stats */}
        {searchQuery.query && (
          <div className="search-stats">
            <span className="results-count">
              {isLoading ? 'Searching...' : `${searchStats.total} results found`}
            </span>
            {searchStats.total > 0 && (
              <div className="type-breakdown">
                {Object.entries(searchStats.byType).map(([type, count]) => (
                  <span key={type} className="type-count">
                    {count} {type}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <SearchFilters
          filters={searchQuery.filters}
          onFiltersChange={(filters) => handleSearchChange({ filters })}
          onSaveSearch={handleSaveSearch}
        />
      )}

      {/* Saved Searches Panel */}
      {showSavedSearches && (
        <SavedSearches
          savedSearches={savedSearches}
          onLoadSearch={handleLoadSavedSearch}
          onDeleteSearch={handleDeleteSavedSearch}
          onClose={() => setShowSavedSearches(false)}
        />
      )}

      {/* Search Results */}
      <SearchResults
        results={results}
        query={searchQuery}
        isLoading={isLoading}
        onSortChange={(sort) => handleSearchChange({ sort })}
      />
    </div>
  );
};

export default SearchPage;
