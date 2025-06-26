/**
 * Love Journey - Global Search Component
 * 
 * Advanced search functionality with filters, suggestions, and real-time results.
 * Searches across milestones, memories, goals, and other content.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Calendar, Image, Target, Heart,
  Clock, MessageCircle, X, Loader
} from 'lucide-react';
import { clsx } from 'clsx';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Input from '../ui/Input';
import { goalsService, memoriesService, milestonesService } from '../../services';

const GlobalSearch = ({ isOpen, onClose, className = '' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [recentSearches, setRecentSearches] = useState([
    'anniversary photos',
    'travel goals',
    'first date',
    'romantic milestones'
  ]);

  const searchInputRef = useRef(null);

  const filters = [
    { id: 'all', label: 'All', icon: Search },
    { id: 'milestones', label: 'Milestones', icon: Heart },
    { id: 'memories', label: 'Memories', icon: Image },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'checkins', label: 'Check-ins', icon: MessageCircle },
    { id: 'timecapsules', label: 'Time Capsules', icon: Clock },
  ];

  // Search across all data types
  const performSearch = async (searchQuery, filter) => {
    try {
      setLoading(true);
      const searchPromises = [];

      if (filter === 'all' || filter === 'goals') {
        searchPromises.push(
          goalsService.getGoals({ search: searchQuery }).then(response =>
            response.success ? response.data.map(item => ({ ...item, type: 'goal' })) : []
          )
        );
      }

      if (filter === 'all' || filter === 'memories') {
        searchPromises.push(
          memoriesService.getMemories({ search: searchQuery }).then(response =>
            response.success ? response.data.map(item => ({ ...item, type: 'memory' })) : []
          )
        );
      }

      if (filter === 'all' || filter === 'milestones') {
        searchPromises.push(
          milestonesService.getMilestones({ search: searchQuery }).then(response =>
            response.success ? response.data.map(item => ({ ...item, type: 'milestone' })) : []
          )
        );
      }

      const results = await Promise.all(searchPromises);
      const combinedResults = results.flat();

      setResults(combinedResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length > 2) {
      const timer = setTimeout(() => {
        performSearch(query, selectedFilter);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query, selectedFilter]);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    if (searchQuery && !recentSearches.includes(searchQuery)) {
      setRecentSearches(prev => [searchQuery, ...prev.slice(0, 3)]);
    }
  };

  const getTypeIcon = (type) => {
    const iconMap = {
      milestone: Heart,
      memory: Image,
      goal: Target,
      event: Calendar,
      checkin: MessageCircle,
      timecapsule: Clock,
    };
    return iconMap[type] || Search;
  };

  const getTypeColor = (type) => {
    const colorMap = {
      milestone: 'primary',
      memory: 'secondary',
      goal: 'success',
      event: 'warning',
      checkin: 'info',
      timecapsule: 'error',
    };
    return colorMap[type] || 'default';
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex min-h-full items-start justify-center p-4 pt-16">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        />

        {/* Search Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className={clsx(
            'relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-xl',
            className
          )}
        >
          {/* Search Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search your love journey..."
                  className="w-full pl-10 pr-4 py-3 border-0 bg-gray-50 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100"
                />
                {loading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader className="w-5 h-5 text-gray-400 animate-spin" />
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                leftIcon={<X className="w-4 h-4" />}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2 mt-4 overflow-x-auto">
              {filters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={clsx(
                      'flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
                      selectedFilter === filter.id
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Content */}
          <div className="max-h-96 overflow-y-auto">
            {query.length === 0 && (
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Recent Searches
                </h3>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="flex items-center w-full p-2 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Search className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {search}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query.length > 0 && results.length === 0 && !loading && (
              <div className="p-8 text-center">
                <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No results found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}

            {results.length > 0 && (
              <div className="p-4 space-y-3">
                {results.map((result) => {
                  const Icon = getTypeIcon(result.type);
                  return (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={clsx(
                          'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
                          `bg-${getTypeColor(result.type)}-100 dark:bg-${getTypeColor(result.type)}-900`
                        )}>
                          <Icon className={clsx(
                            'w-4 h-4',
                            `text-${getTypeColor(result.type)}-600 dark:text-${getTypeColor(result.type)}-400`
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {result.title}
                            </h4>
                            <Badge variant={getTypeColor(result.type)} size="sm">
                              {result.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {result.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2">
                              {result.tags.slice(0, 2).map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">
                              {new Date(result.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GlobalSearch;
