/**
 * Love Journey - Time Capsule Page
 *
 * Create and manage time capsules with messages, photos, and videos
 * to be opened at future dates. Perfect for anniversaries and milestones.
 *
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Calendar, Lock, Unlock, Plus, Gift, Heart,
  Image, Video, FileText, Music, Star, Timer,
  Send, Package, Archive, Eye, EyeOff, Download, Share
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const TimeCapsule = () => {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('all'); // all, locked, unlocked, scheduled
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  // Mock time capsule data
  const mockCapsules = [
    {
      id: 1,
      title: "Our First Anniversary",
      description: "A special message for our first year together",
      createdDate: "2024-06-14T10:00:00Z",
      unlockDate: "2025-06-14T10:00:00Z",
      isLocked: true,
      type: "anniversary",
      priority: "high",
      contents: [
        {
          type: "text",
          content: "My dearest love, if you're reading this, we've made it to our first anniversary! I'm writing this on the day we decided to start this journey together...",
          title: "Anniversary Letter"
        },
        {
          type: "image",
          content: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
          title: "Our First Date Photo"
        },
        {
          type: "video",
          content: "https://example.com/first-date-video.mp4",
          title: "First Date Video Message"
        }
      ],
      tags: ["anniversary", "love", "milestone"],
      createdBy: "both",
      recipients: ["both"],
      isSpecial: true,
      countdown: true
    },
    {
      id: 2,
      title: "Christmas 2025 Wishes",
      description: "Our hopes and dreams for next Christmas",
      createdDate: "2024-12-25T09:00:00Z",
      unlockDate: "2025-12-25T09:00:00Z",
      isLocked: true,
      type: "holiday",
      priority: "medium",
      contents: [
        {
          type: "text",
          content: "This Christmas was magical, and we're excited to see what next year brings...",
          title: "Christmas Wishes"
        },
        {
          type: "image",
          content: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=300&fit=crop",
          title: "Christmas Morning 2024"
        }
      ],
      tags: ["christmas", "holiday", "wishes"],
      createdBy: "both",
      recipients: ["both"],
      isSpecial: false,
      countdown: true
    },
    {
      id: 3,
      title: "Moving Day Memories",
      description: "Capturing the chaos and excitement of our first home",
      createdDate: "2024-03-15T14:30:00Z",
      unlockDate: "2024-12-15T14:30:00Z",
      isLocked: false,
      type: "milestone",
      priority: "medium",
      contents: [
        {
          type: "text",
          content: "Today we got the keys to our first place together! It's small but it's ours...",
          title: "Moving Day Journal"
        },
        {
          type: "image",
          content: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
          title: "Empty Apartment"
        }
      ],
      tags: ["home", "milestone", "memories"],
      createdBy: "self",
      recipients: ["both"],
      isSpecial: false,
      countdown: false,
      unlockedDate: "2024-12-15T14:30:00Z"
    },
    {
      id: 4,
      title: "Future Dreams",
      description: "Our 5-year plan and biggest dreams",
      createdDate: "2024-01-01T00:00:00Z",
      unlockDate: "2029-01-01T00:00:00Z",
      isLocked: true,
      type: "future",
      priority: "high",
      contents: [
        {
          type: "text",
          content: "In 5 years, we hope to have...",
          title: "Our 5-Year Dreams"
        }
      ],
      tags: ["future", "dreams", "goals"],
      createdBy: "both",
      recipients: ["both"],
      isSpecial: true,
      countdown: true
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setCapsules(mockCapsules);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredCapsules = capsules.filter(capsule => {
    if (viewMode === 'locked') return capsule.isLocked;
    if (viewMode === 'unlocked') return !capsule.isLocked;
    if (viewMode === 'scheduled') return capsule.isLocked && new Date(capsule.unlockDate) > new Date();
    return true;
  });

  const getTimeUntilUnlock = (unlockDate) => {
    const now = new Date();
    const unlock = new Date(unlockDate);
    const diff = unlock - now;

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getCapsuleStats = () => {
    const total = capsules.length;
    const locked = capsules.filter(c => c.isLocked).length;
    const unlocked = capsules.filter(c => !c.isLocked).length;
    const readyToUnlock = capsules.filter(c => c.isLocked && new Date(c.unlockDate) <= new Date()).length;

    return { total, locked, unlocked, readyToUnlock };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type) => {
    const icons = {
      anniversary: Heart,
      holiday: Gift,
      milestone: Star,
      future: Clock,
      surprise: Package
    };
    return icons[type] || Archive;
  };

  const getTypeColor = (type) => {
    const colors = {
      anniversary: 'error',
      holiday: 'success',
      milestone: 'warning',
      future: 'info',
      surprise: 'primary'
    };
    return colors[type] || 'default';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner
          size="lg"
          variant="pulse"
          text="Loading your time capsules..."
        />
      </div>
    );
  }

  const stats = getCapsuleStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Time Capsules
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Messages and memories for your future selves
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowCreateModal(true)}
          >
            Create Capsule
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Archive className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Capsules
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Locked
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.locked}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Unlock className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Unlocked
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.unlocked}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Ready to Open
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.readyToUnlock}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Card>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter:
          </span>
          {[
            { id: 'all', label: 'All Capsules', count: stats.total },
            { id: 'locked', label: 'Locked', count: stats.locked },
            { id: 'unlocked', label: 'Unlocked', count: stats.unlocked },
            { id: 'scheduled', label: 'Scheduled', count: stats.locked }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setViewMode(filter.id)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                viewMode === filter.id
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </Card>

      {/* Capsules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCapsules.map((capsule, index) => (
          <CapsuleCard
            key={capsule.id}
            capsule={capsule}
            index={index}
            getTimeUntilUnlock={getTimeUntilUnlock}
            getTypeIcon={getTypeIcon}
            getTypeColor={getTypeColor}
            formatDate={formatDate}
            onView={() => setSelectedCapsule(capsule)}
            onUnlock={() => {
              setSelectedCapsule(capsule);
              setShowUnlockModal(true);
            }}
          />
        ))}
      </div>

      {filteredCapsules.length === 0 && (
        <div className="text-center py-12">
          <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No time capsules found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first time capsule to preserve memories for the future.
          </p>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowCreateModal(true)}
          >
            Create Your First Capsule
          </Button>
        </div>
      )}

      {/* Create Capsule Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Time Capsule"
        size="xl"
      >
        <CreateCapsuleForm
          onClose={() => setShowCreateModal(false)}
          onSave={(newCapsule) => {
            setCapsules([...capsules, { ...newCapsule, id: Date.now() }]);
            setShowCreateModal(false);
          }}
        />
      </Modal>

      {/* Capsule Detail Modal */}
      {selectedCapsule && !showUnlockModal && (
        <CapsuleDetailModal
          capsule={selectedCapsule}
          onClose={() => setSelectedCapsule(null)}
          formatDate={formatDate}
          getTypeIcon={getTypeIcon}
          getTypeColor={getTypeColor}
        />
      )}

      {/* Unlock Modal */}
      {showUnlockModal && selectedCapsule && (
        <UnlockCapsuleModal
          capsule={selectedCapsule}
          onClose={() => {
            setShowUnlockModal(false);
            setSelectedCapsule(null);
          }}
          onUnlock={() => {
            // Update capsule to unlocked
            setCapsules(capsules.map(c =>
              c.id === selectedCapsule.id
                ? { ...c, isLocked: false, unlockedDate: new Date().toISOString() }
                : c
            ));
            setShowUnlockModal(false);
            setSelectedCapsule(null);
          }}
        />
      )}
    </div>
  );
};

// Capsule Card Component
const CapsuleCard = ({
  capsule,
  index,
  getTimeUntilUnlock,
  getTypeIcon,
  getTypeColor,
  formatDate,
  onView,
  onUnlock
}) => {
  const TypeIcon = getTypeIcon(capsule.type);
  const timeUntilUnlock = getTimeUntilUnlock(capsule.unlockDate);
  const canUnlock = capsule.isLocked && new Date(capsule.unlockDate) <= new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        hover
        clickable
        onClick={onView}
        className={`cursor-pointer relative overflow-hidden ${
          capsule.isSpecial ? 'ring-2 ring-primary-200 dark:ring-primary-800' : ''
        }`}
      >
        {/* Special Badge */}
        {capsule.isSpecial && (
          <div className="absolute top-2 right-2">
            <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
              <Star className="w-3 h-3 text-white fill-current" />
            </div>
          </div>
        )}

        {/* Lock Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              capsule.isLocked ? 'bg-yellow-500' : 'bg-green-500'
            }`}>
              {capsule.isLocked ? (
                <Lock className="w-4 h-4 text-white" />
              ) : (
                <Unlock className="w-4 h-4 text-white" />
              )}
            </div>
            <Badge variant={getTypeColor(capsule.type)} size="sm">
              <TypeIcon className="w-3 h-3 mr-1" />
              {capsule.type}
            </Badge>
          </div>

          {canUnlock && (
            <Badge variant="error" size="sm">
              Ready!
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {capsule.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {capsule.description}
          </p>

          {/* Countdown */}
          {capsule.isLocked && timeUntilUnlock && (
            <div className="flex items-center space-x-2 text-sm">
              <Timer className="w-4 h-4 text-primary-500" />
              <span className="text-primary-600 dark:text-primary-400 font-medium">
                Opens in {timeUntilUnlock}
              </span>
            </div>
          )}

          {/* Unlock Date */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>
              {capsule.isLocked ? 'Opens' : 'Opened'}: {formatDate(capsule.unlockDate)}
            </span>
          </div>

          {/* Contents Preview */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {capsule.contents.length} items:
            </span>
            <div className="flex space-x-1">
              {capsule.contents.slice(0, 4).map((content, contentIndex) => {
                const ContentIcon = content.type === 'text' ? FileText :
                                  content.type === 'image' ? Image :
                                  content.type === 'video' ? Video : Music;
                return (
                  <ContentIcon key={contentIndex} className="w-3 h-3 text-gray-400" />
                );
              })}
              {capsule.contents.length > 4 && (
                <span className="text-xs text-gray-400">+{capsule.contents.length - 4}</span>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {capsule.tags.slice(0, 3).map((tag, tagIndex) => (
              <Badge key={tagIndex} variant="outline" size="sm">
                #{tag}
              </Badge>
            ))}
            {capsule.tags.length > 3 && (
              <Badge variant="outline" size="sm">
                +{capsule.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Action Button */}
        {canUnlock && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="primary"
              size="sm"
              fullWidth
              leftIcon={<Unlock className="w-4 h-4" />}
              onClick={(e) => {
                e.stopPropagation();
                onUnlock();
              }}
            >
              Unlock Now
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

// Create Capsule Form Component
const CreateCapsuleForm = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    unlockDate: '',
    type: 'milestone',
    priority: 'medium',
    contents: [],
    tags: '',
    recipients: ['both'],
    isSpecial: false,
    countdown: true
  });

  const [currentContent, setCurrentContent] = useState({
    type: 'text',
    title: '',
    content: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.unlockDate) return;

    const newCapsule = {
      ...formData,
      createdDate: new Date().toISOString(),
      isLocked: true,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdBy: 'self'
    };

    onSave(newCapsule);
  };

  const addContent = () => {
    if (!currentContent.title || !currentContent.content) return;

    setFormData({
      ...formData,
      contents: [...formData.contents, { ...currentContent, id: Date.now() }]
    });

    setCurrentContent({
      type: 'text',
      title: '',
      content: ''
    });
  };

  const removeContent = (index) => {
    setFormData({
      ...formData,
      contents: formData.contents.filter((_, i) => i !== index)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Capsule Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Our Anniversary Capsule"
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="anniversary">Anniversary</option>
            <option value="holiday">Holiday</option>
            <option value="milestone">Milestone</option>
            <option value="future">Future</option>
            <option value="surprise">Surprise</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="What's special about this time capsule?"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <Input
        label="Unlock Date"
        type="datetime-local"
        value={formData.unlockDate}
        onChange={(e) => setFormData({ ...formData, unlockDate: e.target.value })}
        required
        helperText="When should this capsule be opened?"
      />

      {/* Content Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Add Content
        </h4>

        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content Type
              </label>
              <select
                value={currentContent.type}
                onChange={(e) => setCurrentContent({ ...currentContent, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="text">Text Message</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
              </select>
            </div>
            <Input
              label="Content Title"
              value={currentContent.title}
              onChange={(e) => setCurrentContent({ ...currentContent, title: e.target.value })}
              placeholder="Give this content a title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content
            </label>
            {currentContent.type === 'text' ? (
              <textarea
                value={currentContent.content}
                onChange={(e) => setCurrentContent({ ...currentContent, content: e.target.value })}
                placeholder="Write your message here..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            ) : (
              <Input
                type="url"
                value={currentContent.content}
                onChange={(e) => setCurrentContent({ ...currentContent, content: e.target.value })}
                placeholder="Enter file URL or upload path"
              />
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addContent}
            disabled={!currentContent.title || !currentContent.content}
          >
            Add Content
          </Button>
        </div>

        {/* Added Content List */}
        {formData.contents.length > 0 && (
          <div className="mt-4">
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Added Content ({formData.contents.length})
            </h5>
            <div className="space-y-2">
              {formData.contents.map((content, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      {content.type === 'text' && <FileText className="w-4 h-4 text-primary-600" />}
                      {content.type === 'image' && <Image className="w-4 h-4 text-primary-600" />}
                      {content.type === 'video' && <Video className="w-4 h-4 text-primary-600" />}
                      {content.type === 'audio' && <Music className="w-4 h-4 text-primary-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{content.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{content.type}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeContent(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Input
        label="Tags (comma-separated)"
        value={formData.tags}
        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        placeholder="anniversary, love, special"
        helperText="Add tags to help organize your capsules"
      />

      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isSpecial}
            onChange={(e) => setFormData({ ...formData, isSpecial: e.target.checked })}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Mark as special</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.countdown}
            onChange={(e) => setFormData({ ...formData, countdown: e.target.checked })}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Show countdown</span>
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Create Capsule
        </Button>
      </div>
    </form>
  );
};

// Capsule Detail Modal Component
const CapsuleDetailModal = ({ capsule, onClose, formatDate, getTypeIcon, getTypeColor }) => {
  const TypeIcon = getTypeIcon(capsule.type);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={capsule.title}
      size="xl"
    >
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              capsule.isLocked ? 'bg-yellow-500' : 'bg-green-500'
            }`}>
              {capsule.isLocked ? (
                <Lock className="w-5 h-5 text-white" />
              ) : (
                <Unlock className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <Badge variant={getTypeColor(capsule.type)} size="sm">
                <TypeIcon className="w-3 h-3 mr-1" />
                {capsule.type}
              </Badge>
              {capsule.isSpecial && (
                <Badge variant="primary" size="sm" className="ml-2">
                  <Star className="w-3 h-3 mr-1" />
                  Special
                </Badge>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Created {formatDate(capsule.createdDate)}
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
          <p className="text-gray-600 dark:text-gray-300">{capsule.description}</p>
        </div>

        {/* Unlock Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <div className="text-center">
              <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                {capsule.isLocked ? 'Locked' : 'Unlocked'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Status
              </div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-lg font-bold text-secondary-600 dark:text-secondary-400">
                {formatDate(capsule.unlockDate)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {capsule.isLocked ? 'Opens' : 'Opened'}
              </div>
            </div>
          </Card>
        </div>

        {/* Contents */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Contents ({capsule.contents.length} items)
          </h4>

          {capsule.isLocked ? (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Contents are locked until {formatDate(capsule.unlockDate)}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {capsule.contents.map((content, index) => (
                <Card key={index}>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      {content.type === 'text' && <FileText className="w-5 h-5 text-primary-600" />}
                      {content.type === 'image' && <Image className="w-5 h-5 text-primary-600" />}
                      {content.type === 'video' && <Video className="w-5 h-5 text-primary-600" />}
                      {content.type === 'audio' && <Music className="w-5 h-5 text-primary-600" />}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                        {content.title}
                      </h5>
                      {content.type === 'text' ? (
                        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                          {content.content}
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {content.type === 'image' && (
                            <img
                              src={content.content}
                              alt={content.title}
                              className="max-w-full h-auto rounded-lg"
                            />
                          )}
                          <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                            Download
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {capsule.tags.map((tag, index) => (
              <Badge key={index} variant="outline" size="sm">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          {!capsule.isLocked && (
            <Button variant="outline" leftIcon={<Share className="w-4 h-4" />}>
              Share
            </Button>
          )}
          <Button variant="primary">
            Edit
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Unlock Capsule Modal Component
const UnlockCapsuleModal = ({ capsule, onClose, onUnlock }) => {
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleUnlock = async () => {
    setIsUnlocking(true);
    // Simulate unlock process
    await new Promise(resolve => setTimeout(resolve, 2000));
    onUnlock();
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Unlock Time Capsule"
      size="md"
    >
      <div className="space-y-6 text-center">
        <div className="text-6xl mb-4">🎁</div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {capsule.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            This time capsule is ready to be opened! Are you ready to see what's inside?
          </p>
        </div>

        <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
          <p className="text-sm text-primary-700 dark:text-primary-300">
            <strong>Created:</strong> {new Date(capsule.createdDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-primary-700 dark:text-primary-300">
            <strong>Contents:</strong> {capsule.contents.length} items waiting for you
          </p>
        </div>

        {isUnlocking ? (
          <div className="py-8">
            <LoadingSpinner size="lg" variant="heart" text="Unlocking your memories..." />
          </div>
        ) : (
          <div className="flex justify-center space-x-3">
            <Button variant="ghost" onClick={onClose}>
              Not Yet
            </Button>
            <Button
              variant="primary"
              leftIcon={<Unlock className="w-4 h-4" />}
              onClick={handleUnlock}
            >
              Unlock Now
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TimeCapsule;
