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
import { milestonesService } from '../services';
import { showToast, handleApiError, handleApiSuccess } from '../utils/toast';

const Timeline = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('timeline'); // timeline, grid
  const [sortOrder, setSortOrder] = useState('desc'); // desc, asc
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [editingMilestone, setEditingMilestone] = useState(null);



  // Load milestones from API
  const loadMilestones = async () => {
    try {
      setLoading(true);
      const response = await milestonesService.getMilestones();
      if (response.success) {
        setMilestones(response.data);
      } else {
        handleApiError({ message: response.error });
      }
    } catch (error) {
      console.error('Error loading milestones:', error);
      handleApiError(error, 'Failed to load milestones');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit milestone
  const handleEditMilestone = (milestone) => {
    setEditingMilestone(milestone);
    setShowEditModal(true);
    setSelectedMilestone(null);
  };

  // Handle delete milestone
  const handleDeleteMilestone = async (milestoneId) => {
    if (!window.confirm('Are you sure you want to delete this milestone? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await milestonesService.deleteMilestone(milestoneId);
      if (response.success) {
        handleApiSuccess('Milestone deleted successfully');
        loadMilestones(); // Refresh the list
        setSelectedMilestone(null);
      } else {
        handleApiError({ message: response.error });
      }
    } catch (error) {
      console.error('Error deleting milestone:', error);
      handleApiError(error, 'Failed to delete milestone');
    }
  };

  const categories = [
    { id: 'all', label: 'All Milestones', count: milestones.length },
    { id: 'anniversary', label: 'Anniversaries', count: milestones.filter(m => m.category === 'anniversary').length },
    { id: 'milestone', label: 'Milestones', count: milestones.filter(m => m.category === 'milestone').length },
    { id: 'travel', label: 'Travel', count: milestones.filter(m => m.category === 'travel').length },
    { id: 'first-date', label: 'First Dates', count: milestones.filter(m => m.category === 'first-date').length }
  ];

  useEffect(() => {
    loadMilestones();
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
        <MilestoneForm
          onClose={() => setShowAddModal(false)}
          onSave={async (milestoneData) => {
            try {
              const response = await milestonesService.createMilestone(milestoneData);
              if (response.success) {
                handleApiSuccess('Milestone created successfully');
                loadMilestones(); // Refresh the list
                setShowAddModal(false);
              } else {
                handleApiError({ message: response.error });
              }
            } catch (error) {
              console.error('Error creating milestone:', error);
              handleApiError(error, 'Failed to create milestone');
            }
          }}
        />
      </Modal>

      {/* Edit Milestone Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingMilestone(null);
        }}
        title="Edit Milestone"
        size="lg"
      >
        <MilestoneForm
          milestone={editingMilestone}
          onClose={() => {
            setShowEditModal(false);
            setEditingMilestone(null);
          }}
          onSave={async (milestoneData) => {
            try {
              const response = await milestonesService.updateMilestone(editingMilestone._id, milestoneData);
              if (response.success) {
                handleApiSuccess('Milestone updated successfully');
                loadMilestones(); // Refresh the list
                setShowEditModal(false);
                setEditingMilestone(null);
              } else {
                handleApiError({ message: response.error });
              }
            } catch (error) {
              console.error('Error updating milestone:', error);
              handleApiError(error, 'Failed to update milestone');
            }
          }}
        />
      </Modal>

      {/* Milestone Detail Modal */}
      {selectedMilestone && (
        <MilestoneDetailModal
          milestone={selectedMilestone}
          onClose={() => setSelectedMilestone(null)}
          onEdit={() => handleEditMilestone(selectedMilestone)}
          onDelete={() => handleDeleteMilestone(selectedMilestone._id)}
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
const MilestoneDetailModal = ({ milestone, onClose, onEdit, onDelete, getEmotionColor, formatDate }) => {
  const dateInfo = formatDate(milestone.date);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={milestone.title}
      size="xl"
      actions={
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="danger" onClick={onDelete}>
            Delete
          </Button>
        </div>
      }
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

// Milestone Form Component
const MilestoneForm = ({ milestone, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: milestone?.title || '',
    description: milestone?.description || '',
    date: milestone?.date ? new Date(milestone.date).toISOString().split('T')[0] : '',
    location: milestone?.location || '',
    category: milestone?.category || 'other',
    emotions: milestone?.emotions || [],
    tags: milestone?.tags ? milestone.tags.join(', ') : '',
    notes: milestone?.notes || '',
    isPrivate: milestone?.isPrivate || false,
    isFavorite: milestone?.isFavorite || false
  });

  const [loading, setLoading] = useState(false);
  const isEditing = !!milestone;

  const categories = [
    { value: 'first-meeting', label: 'First Meeting' },
    { value: 'first-date', label: 'First Date' },
    { value: 'relationship-official', label: 'Relationship Official' },
    { value: 'first-kiss', label: 'First Kiss' },
    { value: 'moving-in', label: 'Moving In Together' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'wedding', label: 'Wedding' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'travel', label: 'Travel' },
    { value: 'achievement', label: 'Achievement' },
    { value: 'celebration', label: 'Celebration' },
    { value: 'other', label: 'Other' }
  ];

  const emotionOptions = [
    'happy', 'excited', 'grateful', 'loved', 'peaceful', 'proud',
    'surprised', 'nostalgic', 'content', 'joyful', 'romantic', 'blessed'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;

    setLoading(true);
    try {
      const milestoneData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        date: new Date(formData.date).toISOString()
      };

      await onSave(milestoneData);
    } catch (error) {
      console.error('Error submitting milestone:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEmotion = (emotion) => {
    setFormData(prev => ({
      ...prev,
      emotions: prev.emotions.includes(emotion)
        ? prev.emotions.filter(e => e !== emotion)
        : [...prev.emotions, emotion]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Our first date"
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
        <Input
          label="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Central Park, NYC"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Tell the story of this special moment..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Emotions
        </label>
        <div className="flex flex-wrap gap-2">
          {emotionOptions.map(emotion => (
            <button
              key={emotion}
              type="button"
              onClick={() => toggleEmotion(emotion)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                formData.emotions.includes(emotion)
                  ? 'bg-primary-100 text-primary-700 border-primary-300 dark:bg-primary-900 dark:text-primary-300'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
              } border`}
            >
              {emotion}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Tags"
        value={formData.tags}
        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        placeholder="romantic, special, memorable (comma separated)"
        helperText="Add tags to help organize and find this milestone later"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any additional thoughts or memories about this moment..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isFavorite}
            onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Mark as favorite</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isPrivate}
            onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Keep private</span>
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Milestone' : 'Create Milestone')}
        </Button>
      </div>
    </form>
  );
};

export default Timeline;
