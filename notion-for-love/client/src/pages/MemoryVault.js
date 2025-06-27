/**
 * Love Journey - Memory Vault Page
 *
 * Beautiful photo and video gallery with advanced filtering, search,
 * and organization features for couples' precious memories.
 *
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image, Video, Music, FileText, Plus, Filter, Search,
  Grid, List, Calendar, MapPin, Heart, Star, Download,
  Share, MoreVertical, Play, Pause, Volume2, VolumeX,
  ChevronLeft, ChevronRight, X, Upload
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { memoriesService } from '../services';
import { showToast, handleApiError, handleApiSuccess } from '../utils/toast';

const MemoryVault = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid, masonry, timeline
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [error, setError] = useState(null);



  const categories = [
    { id: 'all', label: 'All Categories', count: memories.length },
    { id: 'milestone', label: 'Milestones', count: memories.filter(m => m.category === 'milestone').length },
    { id: 'daily-life', label: 'Daily Life', count: memories.filter(m => m.category === 'daily-life').length },
    { id: 'travel', label: 'Travel', count: memories.filter(m => m.category === 'travel').length },
    { id: 'romantic', label: 'Romantic', count: memories.filter(m => m.category === 'romantic').length }
  ];

  const types = [
    { id: 'all', label: 'All Types', icon: Grid },
    { id: 'image', label: 'Photos', icon: Image },
    { id: 'video', label: 'Videos', icon: Video },
    { id: 'audio', label: 'Audio', icon: Music }
  ];

  // Load memories from API
  const loadMemories = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        category: selectedCategory,
        type: selectedType,
        search: searchQuery
      };

      const response = await memoriesService.getMemories(filters);
      if (response.success) {
        setMemories(response.data || []);
      } else {
        const errorMsg = response.error || 'Failed to load memories';
        setError(errorMsg);
        handleApiError({ message: errorMsg });
      }
    } catch (error) {
      console.error('Error loading memories:', error);
      const errorMsg = 'Failed to load memories';
      setError(errorMsg);
      handleApiError(error, errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemories();
  }, [selectedCategory, selectedType, searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredMemories = memories.filter(memory => {
    if (selectedCategory !== 'all' && memory.category !== selectedCategory) {
      return false;
    }
    if (selectedType !== 'all' && memory.type !== selectedType) {
      return false;
    }
    if (searchQuery && !memory.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !memory.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !memory.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    return true;
  }).sort((a, b) => new Date(b.dateTaken) - new Date(a.dateTaken));

  const getTypeIcon = (type) => {
    const icons = {
      image: Image,
      video: Video,
      audio: Music,
      document: FileText
    };
    return icons[type] || FileText;
  };

  const getCategoryColor = (category) => {
    const colors = {
      milestone: 'primary',
      'daily-life': 'secondary',
      travel: 'warning',
      romantic: 'error',
      celebration: 'success'
    };
    return colors[category] || 'default';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner
          size="lg"
          variant="pulse"
          text="Loading your precious memories..."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="p-6 text-center">
          <p className="text-error-600 dark:text-error-400 mb-4">{error}</p>
          <Button
            variant="primary"
            onClick={() => loadMemories()}
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Memory Vault
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filteredMemories.length} precious memories captured together
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            leftIcon={<Upload className="w-4 h-4" />}
            onClick={() => setShowUploadModal(true)}
          >
            Upload Memory
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Image className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Photos
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {memories.filter(m => m.type === 'image').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Videos
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {memories.filter(m => m.type === 'video').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Favorites
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {memories.filter(m => m.isFavorite).length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Highlights
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {memories.filter(m => m.isHighlight).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <div className="space-y-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Type Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Type:
              </span>
              <div className="flex flex-wrap gap-2">
                {types.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        selectedType === type.id
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>
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
                        ? 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900 dark:text-secondary-300'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category.label} ({category.count})
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode */}
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('masonry')}
                className={`p-2 ${viewMode === 'masonry' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Memory Grid */}
      {viewMode === 'grid' ? (
        <MemoryGrid
          memories={filteredMemories}
          onMemoryClick={setSelectedMemory}
          onLightboxOpen={setLightboxIndex}
          getTypeIcon={getTypeIcon}
          getCategoryColor={getCategoryColor}
          formatDuration={formatDuration}
          formatDate={formatDate}
        />
      ) : (
        <MemoryMasonry
          memories={filteredMemories}
          onMemoryClick={setSelectedMemory}
          onLightboxOpen={setLightboxIndex}
          getTypeIcon={getTypeIcon}
          getCategoryColor={getCategoryColor}
          formatDuration={formatDuration}
          formatDate={formatDate}
        />
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload New Memory"
        size="lg"
      >
        <MemoryUploadForm
          onClose={() => setShowUploadModal(false)}
          onSave={async (memoryData) => {
            try {
              const response = await memoriesService.createMemory(memoryData);
              if (response.success) {
                // Refresh memories list
                const memoriesResponse = await memoriesService.getMemories();
                if (memoriesResponse.success) {
                  setMemories(memoriesResponse.data);
                }
                setShowUploadModal(false);
              } else {
                console.error('Failed to create memory:', response.error);
                alert('Failed to upload memory. Please try again.');
              }
            } catch (error) {
              console.error('Error creating memory:', error);
              alert('Failed to upload memory. Please try again.');
            }
          }}
        />
      </Modal>

      {/* Memory Detail Modal */}
      {selectedMemory && (
        <MemoryDetailModal
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
          getCategoryColor={getCategoryColor}
          formatFileSize={formatFileSize}
          formatDuration={formatDuration}
          formatDate={formatDate}
        />
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <MemoryLightbox
          memories={filteredMemories.filter(m => m.type === 'image')}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
};

// Memory Grid Component
const MemoryGrid = ({
  memories,
  onMemoryClick,
  onLightboxOpen,
  getTypeIcon,
  getCategoryColor,
  formatDuration,
  formatDate
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {memories.map((memory, index) => {
        const TypeIcon = getTypeIcon(memory.type);

        return (
          <motion.div
            key={memory.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => memory.type === 'image' ? onLightboxOpen(index) : onMemoryClick(memory)}
          >
            <Card hover className="overflow-hidden">
              {/* Media Preview */}
              <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 -m-6 mb-4">
                <img
                  src={memory.thumbnailUrl}
                  alt={memory.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <TypeIcon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Type Badge */}
                <div className="absolute top-2 left-2">
                  <Badge variant="default" size="sm">
                    <TypeIcon className="w-3 h-3 mr-1" />
                    {memory.type}
                  </Badge>
                </div>

                {/* Duration for videos/audio */}
                {(memory.type === 'video' || memory.type === 'audio') && memory.duration && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(memory.duration)}
                  </div>
                )}

                {/* Favorite/Highlight badges */}
                <div className="absolute top-2 right-2 flex space-x-1">
                  {memory.isFavorite && (
                    <div className="w-6 h-6 bg-warning-500 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 text-white fill-current" />
                    </div>
                  )}
                  {memory.isHighlight && (
                    <div className="w-6 h-6 bg-error-500 rounded-full flex items-center justify-center">
                      <Heart className="w-3 h-3 text-white fill-current" />
                    </div>
                  )}
                </div>
              </div>

              {/* Memory Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {memory.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {memory.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(memory.dateTaken)}
                  </div>
                  <Badge variant={getCategoryColor(memory.category)} size="sm">
                    {memory.category}
                  </Badge>
                </div>

                {/* Reactions */}
                {memory.reactions && memory.reactions.length > 0 && (
                  <div className="flex items-center space-x-2">
                    {memory.reactions.map((reaction, reactionIndex) => (
                      <div key={reactionIndex} className="flex items-center space-x-1 text-xs text-gray-500">
                        <span>{reaction.type === 'love' ? '❤️' : reaction.type === 'wow' ? '😮' : '😂'}</span>
                        <span>{reaction.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

// Memory Masonry Component (Alternative layout)
const MemoryMasonry = ({
  memories,
  onMemoryClick,
  onLightboxOpen,
  getTypeIcon,
  getCategoryColor,
  formatDuration,
  formatDate
}) => {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
      {memories.map((memory, index) => {
        const TypeIcon = getTypeIcon(memory.type);

        return (
          <motion.div
            key={memory.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="break-inside-avoid group cursor-pointer"
            onClick={() => memory.type === 'image' ? onLightboxOpen(index) : onMemoryClick(memory)}
          >
            <Card hover className="overflow-hidden">
              {/* Media Preview */}
              <div className="relative bg-gray-100 dark:bg-gray-700 -m-6 mb-4">
                <img
                  src={memory.thumbnailUrl}
                  alt={memory.title}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <TypeIcon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-2 left-2">
                  <Badge variant="default" size="sm">
                    <TypeIcon className="w-3 h-3 mr-1" />
                    {memory.type}
                  </Badge>
                </div>

                <div className="absolute top-2 right-2 flex space-x-1">
                  {memory.isFavorite && (
                    <div className="w-6 h-6 bg-warning-500 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 text-white fill-current" />
                    </div>
                  )}
                  {memory.isHighlight && (
                    <div className="w-6 h-6 bg-error-500 rounded-full flex items-center justify-center">
                      <Heart className="w-3 h-3 text-white fill-current" />
                    </div>
                  )}
                </div>
              </div>

              {/* Memory Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {memory.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {memory.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(memory.dateTaken)}
                  </div>
                  <Badge variant={getCategoryColor(memory.category)} size="sm">
                    {memory.category}
                  </Badge>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {memory.tags.slice(0, 3).map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" size="sm">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

// Memory Detail Modal Component
const MemoryDetailModal = ({
  memory,
  onClose,
  getCategoryColor,
  formatFileSize,
  formatDuration,
  formatDate
}) => {
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={memory.title}
      size="xl"
    >
      <div className="space-y-6">
        {/* Media Display */}
        <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
          {memory.type === 'image' && (
            <img
              src={memory.url}
              alt={memory.title}
              className="w-full h-auto max-h-96 object-contain mx-auto"
            />
          )}
          {memory.type === 'video' && (
            <div className="relative aspect-video">
              <img
                src={memory.thumbnailUrl}
                alt={memory.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
              </div>
            </div>
          )}
          {memory.type === 'audio' && (
            <div className="p-8 text-center">
              <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Audio File</p>
              {memory.duration && (
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Duration: {formatDuration(memory.duration)}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Memory Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
              <p className="text-gray-600 dark:text-gray-300">{memory.description}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {formatDate(memory.dateTaken)}
                  </span>
                </div>
                {memory.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {memory.location}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Badge variant={getCategoryColor(memory.category)} size="sm">
                    {memory.category}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {memory.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" size="sm">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">File Info</h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div>Type: {memory.type}</div>
                <div>Size: {formatFileSize(memory.fileSize * 1024 * 1024)}</div>
                {memory.dimensions && (
                  <div>Dimensions: {memory.dimensions.width} × {memory.dimensions.height}</div>
                )}
                {memory.duration && (
                  <div>Duration: {formatDuration(memory.duration)}</div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Reactions</h4>
              <div className="flex items-center space-x-4">
                {memory.reactions && memory.reactions.length > 0 ? (
                  memory.reactions.map((reaction, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-lg">
                        {reaction.type === 'love' ? '❤️' :
                         reaction.type === 'wow' ? '😮' :
                         reaction.type === 'laugh' ? '😂' : '👍'}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {reaction.count}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No reactions yet</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Comments</h4>
              <div className="space-y-2">
                {memory.comments && memory.comments.length > 0 ? (
                  memory.comments.map((comment, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-gray-900 dark:text-white">
                          {comment.user}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(comment.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {comment.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No comments yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Download
          </Button>
          <Button variant="outline" leftIcon={<Share className="w-4 h-4" />}>
            Share
          </Button>
          <Button variant="primary">
            Edit
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Memory Lightbox Component
const MemoryLightbox = ({ memories, currentIndex, onClose, onNavigate }) => {
  const currentMemory = memories[currentIndex];

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : memories.length - 1;
    onNavigate(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex < memories.length - 1 ? currentIndex + 1 : 0;
    onNavigate(newIndex);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') onClose();
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full flex items-center justify-center text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Buttons */}
      {memories.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Image */}
      <div className="max-w-full max-h-full p-4">
        <img
          src={currentMemory.url}
          alt={currentMemory.title}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Image Info */}
      <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-1">{currentMemory.title}</h3>
        <p className="text-sm opacity-75 mb-2">{currentMemory.description}</p>
        <div className="flex items-center justify-between text-xs opacity-75">
          <span>{new Date(currentMemory.dateTaken).toLocaleDateString()}</span>
          <span>{currentIndex + 1} of {memories.length}</span>
        </div>
      </div>
    </motion.div>
  );
};

// Memory Upload Form Component
const MemoryUploadForm = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'image',
    category: 'special',
    dateTaken: '',
    location: '',
    tags: '',
    isPrivate: false,
    isFavorite: false,
    isHighlight: false
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'special', label: 'Special Moments' },
    { value: 'everyday', label: 'Everyday Life' },
    { value: 'travel', label: 'Travel & Adventures' },
    { value: 'celebration', label: 'Celebrations' },
    { value: 'family', label: 'Family & Friends' },
    { value: 'romantic', label: 'Romantic' },
    { value: 'achievement', label: 'Achievements' },
    { value: 'other', label: 'Other' }
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Auto-detect type based on file
      if (selectedFile.type.startsWith('image/')) {
        setFormData(prev => ({ ...prev, type: 'image' }));
      } else if (selectedFile.type.startsWith('video/')) {
        setFormData(prev => ({ ...prev, type: 'video' }));
      } else if (selectedFile.type.startsWith('audio/')) {
        setFormData(prev => ({ ...prev, type: 'audio' }));
      } else {
        setFormData(prev => ({ ...prev, type: 'document' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !file) return;

    setLoading(true);
    try {
      // Create FormData for file upload
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('type', formData.type);
      uploadData.append('category', formData.category);
      uploadData.append('dateTaken', formData.dateTaken || new Date().toISOString());
      uploadData.append('location', formData.location);
      uploadData.append('isPrivate', formData.isPrivate);
      uploadData.append('isFavorite', formData.isFavorite);
      uploadData.append('isHighlight', formData.isHighlight);

      if (formData.tags) {
        const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
        uploadData.append('tags', JSON.stringify(tags));
      }

      await onSave(uploadData);
    } catch (error) {
      console.error('Error submitting memory:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Our amazing day at the beach"
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

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          File Upload
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          required
        />
        {file && (
          <p className="text-sm text-gray-500 mt-1">
            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Date Taken"
          type="date"
          value={formData.dateTaken}
          onChange={(e) => setFormData({ ...formData, dateTaken: e.target.value })}
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
          placeholder="Tell the story behind this memory..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <Input
        label="Tags"
        value={formData.tags}
        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        placeholder="vacation, beach, sunset (comma separated)"
        helperText="Add tags to help organize and find this memory later"
      />

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
            checked={formData.isHighlight}
            onChange={(e) => setFormData({ ...formData, isHighlight: e.target.checked })}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Highlight memory</span>
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
        <Button variant="primary" type="submit" disabled={loading || !file}>
          {loading ? 'Uploading...' : 'Upload Memory'}
        </Button>
      </div>
    </form>
  );
};

export default MemoryVault;
