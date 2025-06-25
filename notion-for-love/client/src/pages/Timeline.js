/**
 * Love Journey - Timeline Page
 *
 * Interactive timeline displaying relationship milestones with filtering,
 * search, and beautiful visual presentation of the couple's journey.
 *
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Calendar, MapPin, Plus, Filter, Search,
  Grid, List, Star, Image, Video, Music, FileText,
  ChevronDown, SortAsc, SortDesc
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Timeline = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('timeline'); // timeline, grid
  const [sortOrder, setSortOrder] = useState('desc'); // desc, asc
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  // Mock milestone data
  const mockMilestones = [
    {
      id: 1,
      title: "First Anniversary Celebration",
      description: "Our amazing first anniversary dinner at the rooftop restaurant with the most beautiful city view. We talked about our dreams and future together.",
      date: "2024-12-20T19:00:00Z",
      location: "Skyline Rooftop Restaurant",
      category: "anniversary",
      emotions: ["loved", "grateful", "happy"],
      media: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop&crop=center",
          caption: "Anniversary dinner setup"
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=center",
          caption: "City view from our table"
        }
      ],
      tags: ["anniversary", "romantic", "dinner", "celebration"],
      isFavorite: true,
      notes: "This was such a perfect evening. The weather was perfect, the food was amazing, and most importantly, we felt so connected."
    },
    {
      id: 2,
      title: "Moved in Together",
      description: "Finally took the big step and moved into our first shared apartment. It feels like home already!",
      date: "2024-12-10T10:00:00Z",
      location: "Our New Home, 123 Love Street",
      category: "milestone",
      emotions: ["excited", "nervous", "hopeful"],
      media: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&crop=center",
          caption: "Our new living room"
        },
        {
          type: "video",
          url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center",
          caption: "Moving day chaos"
        }
      ],
      tags: ["moving", "home", "together", "new-chapter"],
      isFavorite: false,
      notes: "So many boxes, but so much excitement! Can't wait to make this place truly ours."
    },
    {
      id: 3,
      title: "First Trip to Paris",
      description: "Our romantic getaway to the City of Love. Every moment was magical, from the Eiffel Tower to the Seine river walks.",
      date: "2024-11-15T08:00:00Z",
      location: "Paris, France",
      category: "travel",
      emotions: ["amazed", "romantic", "adventurous"],
      media: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop&crop=center",
          caption: "Eiffel Tower at sunset"
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop&crop=center",
          caption: "Seine river walk"
        }
      ],
      tags: ["travel", "paris", "romantic", "adventure"],
      isFavorite: true,
      notes: "Paris truly is the city of love. Every corner had something beautiful to discover together."
    },
    {
      id: 4,
      title: "First Date",
      description: "The day that started it all. Coffee at the little café downtown that became 'our place'.",
      date: "2023-06-14T15:30:00Z",
      location: "Corner Café, Downtown",
      category: "first-date",
      emotions: ["nervous", "excited", "hopeful"],
      media: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop&crop=center",
          caption: "The café where it all began"
        }
      ],
      tags: ["first-date", "coffee", "beginning", "nervous"],
      isFavorite: true,
      notes: "I was so nervous I could barely drink my coffee, but somehow we talked for hours."
    }
  ];

  const categories = [
    { id: 'all', label: 'All Milestones', count: mockMilestones.length },
    { id: 'anniversary', label: 'Anniversaries', count: 1 },
    { id: 'milestone', label: 'Milestones', count: 1 },
    { id: 'travel', label: 'Travel', count: 1 },
    { id: 'first-date', label: 'First Dates', count: 1 }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setMilestones(mockMilestones);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredMilestones = milestones
    .filter(milestone => {
      if (selectedCategory !== 'all' && milestone.category !== selectedCategory) {
        return false;
      }
      if (searchQuery && !milestone.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !milestone.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !milestone.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const getEmotionColor = (emotion) => {
    const colors = {
      loved: 'primary',
      grateful: 'success',
      happy: 'warning',
      excited: 'secondary',
      nervous: 'info',
      hopeful: 'success',
      amazed: 'primary',
      romantic: 'error',
      adventurous: 'warning'
    };
    return colors[emotion] || 'default';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      anniversary: Heart,
      milestone: Star,
      travel: MapPin,
      'first-date': Heart
    };
    return icons[category] || Calendar;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      full: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      short: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner
          size="lg"
          variant="heart"
          text="Loading your love story..."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Our Love Timeline
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filteredMilestones.length} precious moments in your journey together
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAddModal(true)}
          >
            Add Milestone
          </Button>
        </div>
      </div>

      {/* Filters and Controls */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search milestones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Category:
            </span>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant={sortOrder === 'desc' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              leftIcon={sortOrder === 'desc' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
            >
              {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
            </Button>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
              <button
                onClick={() => setViewMode('timeline')}
                className={`p-2 ${viewMode === 'timeline' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Timeline Content */}
      {viewMode === 'timeline' ? (
        <TimelineView
          milestones={filteredMilestones}
          onMilestoneClick={setSelectedMilestone}
          getEmotionColor={getEmotionColor}
          getCategoryIcon={getCategoryIcon}
          formatDate={formatDate}
        />
      ) : (
        <GridView
          milestones={filteredMilestones}
          onMilestoneClick={setSelectedMilestone}
          getEmotionColor={getEmotionColor}
          getCategoryIcon={getCategoryIcon}
          formatDate={formatDate}
        />
      )}

      {/* Add Milestone Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Milestone"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Create a new milestone to capture this special moment in your journey together.
          </p>
          {/* Add milestone form would go here */}
          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary">
              Create Milestone
            </Button>
          </div>
        </div>
      </Modal>

      {/* Milestone Detail Modal */}
      {selectedMilestone && (
        <MilestoneDetailModal
          milestone={selectedMilestone}
          onClose={() => setSelectedMilestone(null)}
          getEmotionColor={getEmotionColor}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

// Timeline View Component
const TimelineView = ({ milestones, onMilestoneClick, getEmotionColor, getCategoryIcon, formatDate }) => {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-200 via-secondary-200 to-accent-200 dark:from-primary-800 dark:via-secondary-800 dark:to-accent-800"></div>

      <div className="space-y-8">
        {milestones.map((milestone, index) => {
          const CategoryIcon = getCategoryIcon(milestone.category);
          const dateInfo = formatDate(milestone.date);

          return (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start space-x-6"
            >
              {/* Timeline dot */}
              <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 border-4 border-primary-300 dark:border-primary-700 rounded-full shadow-lg">
                <CategoryIcon className="w-6 h-6 text-primary-500 fill-current" />
                {milestone.isFavorite && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-warning-500 rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-white fill-current" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-8">
                <Card
                  hover
                  clickable
                  onClick={() => onMilestoneClick(milestone)}
                  className="cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {milestone.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {dateInfo.full}
                        </div>
                        {milestone.location && (
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {milestone.location}
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Media Preview */}
                  {milestone.media && milestone.media.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                      {milestone.media.slice(0, 3).map((media, mediaIndex) => (
                        <div key={mediaIndex} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                          <img
                            src={media.url}
                            alt={media.caption}
                            className="w-full h-full object-cover"
                          />
                          {media.type === 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                <Video className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      {milestone.media.length > 3 && (
                        <div className="aspect-video rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            +{milestone.media.length - 3} more
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Emotions and Tags */}
                  <div className="flex flex-wrap items-center gap-2">
                    {milestone.emotions.map((emotion, emotionIndex) => (
                      <Badge
                        key={emotionIndex}
                        variant={getEmotionColor(emotion)}
                        size="sm"
                      >
                        {emotion}
                      </Badge>
                    ))}
                    {milestone.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="outline"
                        size="sm"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Grid View Component
const GridView = ({ milestones, onMilestoneClick, getEmotionColor, getCategoryIcon, formatDate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {milestones.map((milestone, index) => {
        const CategoryIcon = getCategoryIcon(milestone.category);
        const dateInfo = formatDate(milestone.date);

        return (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              hover
              clickable
              onClick={() => onMilestoneClick(milestone)}
              className="h-full cursor-pointer"
            >
              {/* Media Preview */}
              {milestone.media && milestone.media.length > 0 && (
                <div className="relative aspect-video rounded-t-lg overflow-hidden bg-gray-100 dark:bg-gray-700 -m-6 mb-4">
                  <img
                    src={milestone.media[0].url}
                    alt={milestone.media[0].caption}
                    className="w-full h-full object-cover"
                  />
                  {milestone.media[0].type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <Video className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}
                  {milestone.media.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      +{milestone.media.length - 1}
                    </div>
                  )}
                  {milestone.isFavorite && (
                    <div className="absolute top-2 left-2 w-6 h-6 bg-warning-500 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 text-white fill-current" />
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <CategoryIcon className="w-5 h-5 text-primary-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {milestone.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {milestone.description}
                </p>

                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{dateInfo.short}</span>
                  {milestone.location && (
                    <>
                      <span>•</span>
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{milestone.location}</span>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap gap-1">
                  {milestone.emotions.slice(0, 2).map((emotion, emotionIndex) => (
                    <Badge
                      key={emotionIndex}
                      variant={getEmotionColor(emotion)}
                      size="sm"
                    >
                      {emotion}
                    </Badge>
                  ))}
                  {milestone.emotions.length > 2 && (
                    <Badge variant="outline" size="sm">
                      +{milestone.emotions.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

// Milestone Detail Modal Component
const MilestoneDetailModal = ({ milestone, onClose, getEmotionColor, formatDate }) => {
  const dateInfo = formatDate(milestone.date);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={milestone.title}
      size="xl"
    >
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {dateInfo.full}
          </div>
          {milestone.location && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {milestone.location}
            </div>
          )}
          {milestone.isFavorite && (
            <div className="flex items-center text-warning-600">
              <Star className="w-4 h-4 mr-1 fill-current" />
              Favorite
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
          <p className="text-gray-600 dark:text-gray-300">{milestone.description}</p>
        </div>

        {/* Media Gallery */}
        {milestone.media && milestone.media.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Media</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {milestone.media.map((media, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={media.url}
                    alt={media.caption}
                    className="w-full h-full object-cover"
                  />
                  {media.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <Video className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                  {media.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
                      {media.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Emotions */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Emotions</h4>
          <div className="flex flex-wrap gap-2">
            {milestone.emotions.map((emotion, index) => (
              <Badge
                key={index}
                variant={getEmotionColor(emotion)}
                size="sm"
              >
                {emotion}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {milestone.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                size="sm"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Notes */}
        {milestone.notes && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Notes</h4>
            <p className="text-gray-600 dark:text-gray-300 italic">"{milestone.notes}"</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline">
            Edit
          </Button>
          <Button variant="primary">
            Share
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Timeline;
