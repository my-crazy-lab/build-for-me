/**
 * Love Journey - Memory Highlights Widget
 * 
 * Dashboard widget showcasing recent and favorite memories in a beautiful
 * grid layout with hover effects and quick actions.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image, Play, Plus, ArrowRight, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { memoriesService } from '../../../services';
import DashboardWidget from '../DashboardWidget';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';

const MemoryHighlightsWidget = ({ id, onRemove, onResize, onSettings }) => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('recent');
  const [memories, setMemories] = useState({ recent: [], favorites: [] });
  const [loading, setLoading] = useState(true);

  // Load memories from API
  useEffect(() => {
    const loadMemories = async () => {
      try {
        setLoading(true);
        const [recentResponse, favoritesResponse] = await Promise.all([
          memoriesService.getMemories({ limit: 4 }),
          memoriesService.getMemories({ isFavorite: true, limit: 4 })
        ]);

        setMemories({
          recent: recentResponse.success ? recentResponse.data : [],
          favorites: favoritesResponse.success ? favoritesResponse.data : []
        });
      } catch (error) {
        console.error('Error loading memories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMemories();
  }, []);

  const currentMemories = memories[selectedTab];

  const tabs = [
    { id: 'recent', label: 'Recent', count: memories.recent.length },
    { id: 'favorites', label: 'Favorites', count: memories.favorites.length }
  ];

  return (
    <DashboardWidget
      id={id}
      title="Memory Highlights"
      onRemove={onRemove}
      onResize={onResize}
      onSettings={onSettings}
      size="md"
    >
      <div className="space-y-4">
        {/* Header with Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  selectedTab === tab.id
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/memories')}
            >
              Add
            </Button>
            <Link to="/memories">
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                View All
              </Button>
            </Link>
          </div>
        </div>

        {/* Memory Grid */}
        <div className="grid grid-cols-2 gap-3">
          {currentMemories.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative group cursor-pointer"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={memory.url}
                  alt={memory.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {memory.type === 'video' ? (
                      <Play className="w-8 h-8 text-white" />
                    ) : (
                      <Image className="w-8 h-8 text-white" />
                    )}
                  </div>
                </div>

                {/* Type Badge */}
                {memory.type === 'video' && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="default" size="sm">
                      <Play className="w-3 h-3 mr-1" />
                      Video
                    </Badge>
                  </div>
                )}

                {/* Favorite Badge */}
                {memory.isFavorite && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-warning-500 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 text-white fill-current" />
                    </div>
                  </div>
                )}
              </div>

              {/* Memory Info */}
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {memory.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {memory.date}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Image className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">
                {memories.recent.length} memories this month
              </span>
            </div>
            <Link 
              to="/memories" 
              className="text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 font-medium"
            >
              Browse all →
            </Link>
          </div>
        </div>
      </div>
    </DashboardWidget>
  );
};

export default MemoryHighlightsWidget;
