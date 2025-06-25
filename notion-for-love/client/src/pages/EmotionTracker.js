/**
 * Love Journey - Emotion Tracker Page
 *
 * Comprehensive emotion tracking system with mood logging,
 * analytics, trends visualization, and relationship insights.
 *
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, TrendingUp, Calendar, BarChart3, PieChart,
  Plus, Filter, Download, Share, Smile, Frown,
  Meh, Angry, Surprised, Worried, Sleepy, Star
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const EmotionTracker = () => {
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('daily'); // daily, weekly, monthly, yearly
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);

  // Emotion categories with emojis and colors
  const emotionCategories = {
    love: {
      name: 'Love & Affection',
      color: 'bg-pink-500',
      emotions: [
        { id: 'in-love', emoji: '😍', name: 'In Love', intensity: 5 },
        { id: 'affectionate', emoji: '🥰', name: 'Affectionate', intensity: 4 },
        { id: 'romantic', emoji: '😘', name: 'Romantic', intensity: 4 },
        { id: 'caring', emoji: '🤗', name: 'Caring', intensity: 3 },
        { id: 'warm', emoji: '☺️', name: 'Warm', intensity: 3 }
      ]
    },
    joy: {
      name: 'Joy & Happiness',
      color: 'bg-yellow-500',
      emotions: [
        { id: 'ecstatic', emoji: '🤩', name: 'Ecstatic', intensity: 5 },
        { id: 'joyful', emoji: '😄', name: 'Joyful', intensity: 4 },
        { id: 'happy', emoji: '😊', name: 'Happy', intensity: 4 },
        { id: 'content', emoji: '😌', name: 'Content', intensity: 3 },
        { id: 'pleased', emoji: '🙂', name: 'Pleased', intensity: 3 }
      ]
    },
    excitement: {
      name: 'Excitement & Energy',
      color: 'bg-orange-500',
      emotions: [
        { id: 'thrilled', emoji: '🤗', name: 'Thrilled', intensity: 5 },
        { id: 'excited', emoji: '😃', name: 'Excited', intensity: 4 },
        { id: 'energetic', emoji: '⚡', name: 'Energetic', intensity: 4 },
        { id: 'enthusiastic', emoji: '🙌', name: 'Enthusiastic', intensity: 3 },
        { id: 'motivated', emoji: '💪', name: 'Motivated', intensity: 3 }
      ]
    },
    peace: {
      name: 'Peace & Calm',
      color: 'bg-green-500',
      emotions: [
        { id: 'blissful', emoji: '😇', name: 'Blissful', intensity: 5 },
        { id: 'peaceful', emoji: '😌', name: 'Peaceful', intensity: 4 },
        { id: 'calm', emoji: '😊', name: 'Calm', intensity: 3 },
        { id: 'relaxed', emoji: '😎', name: 'Relaxed', intensity: 3 },
        { id: 'serene', emoji: '🧘', name: 'Serene', intensity: 4 }
      ]
    },
    sadness: {
      name: 'Sadness & Melancholy',
      color: 'bg-blue-500',
      emotions: [
        { id: 'heartbroken', emoji: '💔', name: 'Heartbroken', intensity: 5 },
        { id: 'sad', emoji: '😢', name: 'Sad', intensity: 4 },
        { id: 'melancholy', emoji: '😔', name: 'Melancholy', intensity: 3 },
        { id: 'disappointed', emoji: '😞', name: 'Disappointed', intensity: 3 },
        { id: 'lonely', emoji: '😪', name: 'Lonely', intensity: 4 }
      ]
    },
    stress: {
      name: 'Stress & Anxiety',
      color: 'bg-red-500',
      emotions: [
        { id: 'overwhelmed', emoji: '😵', name: 'Overwhelmed', intensity: 5 },
        { id: 'anxious', emoji: '😰', name: 'Anxious', intensity: 4 },
        { id: 'stressed', emoji: '😤', name: 'Stressed', intensity: 4 },
        { id: 'worried', emoji: '😟', name: 'Worried', intensity: 3 },
        { id: 'nervous', emoji: '😬', name: 'Nervous', intensity: 3 }
      ]
    }
  };

  // Mock emotion data
  const mockEmotions = [
    {
      id: 1,
      date: '2024-12-25',
      time: '09:30',
      category: 'love',
      emotion: 'in-love',
      intensity: 5,
      note: 'Woke up next to my amazing partner on Christmas morning. Feeling so grateful and in love! ❤️',
      tags: ['morning', 'christmas', 'grateful'],
      partner: 'both',
      triggers: ['quality-time', 'special-occasion']
    },
    {
      id: 2,
      date: '2024-12-24',
      time: '20:15',
      category: 'joy',
      emotion: 'joyful',
      intensity: 4,
      note: 'Christmas Eve dinner was perfect. We cooked together and laughed so much.',
      tags: ['cooking', 'laughter', 'christmas-eve'],
      partner: 'both',
      triggers: ['shared-activity', 'accomplishment']
    },
    {
      id: 3,
      date: '2024-12-23',
      time: '14:45',
      category: 'excitement',
      emotion: 'excited',
      intensity: 4,
      note: 'Gift shopping together was so fun! Can\'t wait to see their reaction tomorrow.',
      tags: ['shopping', 'gifts', 'anticipation'],
      partner: 'both',
      triggers: ['anticipation', 'giving']
    },
    {
      id: 4,
      date: '2024-12-22',
      time: '18:00',
      category: 'peace',
      emotion: 'calm',
      intensity: 3,
      note: 'Quiet evening at home, just cuddling and watching movies.',
      tags: ['home', 'movies', 'cuddling'],
      partner: 'both',
      triggers: ['physical-touch', 'relaxation']
    },
    {
      id: 5,
      date: '2024-12-21',
      time: '12:30',
      category: 'stress',
      emotion: 'worried',
      intensity: 3,
      note: 'Feeling a bit anxious about meeting their family for Christmas.',
      tags: ['family', 'anxiety', 'meeting'],
      partner: 'self',
      triggers: ['social-situation', 'uncertainty']
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setEmotions(mockEmotions);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getEmotionsByDate = (date) => {
    return emotions.filter(emotion => emotion.date === date);
  };

  const getEmotionStats = () => {
    const totalEmotions = emotions.length;
    const categoryStats = {};
    const intensityStats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    emotions.forEach(emotion => {
      // Category stats
      if (!categoryStats[emotion.category]) {
        categoryStats[emotion.category] = 0;
      }
      categoryStats[emotion.category]++;

      // Intensity stats
      intensityStats[emotion.intensity]++;
    });

    const averageIntensity = emotions.reduce((sum, emotion) => sum + emotion.intensity, 0) / totalEmotions || 0;

    return {
      total: totalEmotions,
      categories: categoryStats,
      intensities: intensityStats,
      averageIntensity: averageIntensity.toFixed(1)
    };
  };

  const getMoodTrend = () => {
    const last7Days = emotions
      .filter(emotion => {
        const emotionDate = new Date(emotion.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return emotionDate >= weekAgo;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return last7Days.map(emotion => ({
      date: emotion.date,
      intensity: emotion.intensity,
      emotion: emotion.emotion
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner
          size="lg"
          variant="heart"
          text="Loading your emotional journey..."
        />
      </div>
    );
  }

  const stats = getEmotionStats();
  const moodTrend = getMoodTrend();
  const todaysEmotions = getEmotionsByDate(selectedDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Emotion Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and understand your emotional journey together
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAddModal(true)}
          >
            Log Emotion
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Emotions
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
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg Intensity
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.averageIntensity}/5
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Smile className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Positive Emotions
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {((stats.categories.love || 0) + (stats.categories.joy || 0) + (stats.categories.excitement || 0) + (stats.categories.peace || 0))}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Days Tracked
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {new Set(emotions.map(e => e.date)).size}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Date Selector and Today's Emotions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Date Selector */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Select Date
          </h3>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            leftIcon={<Calendar className="w-4 h-4" />}
          />

          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quick Select
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  setSelectedDate(yesterday.toISOString().split('T')[0]);
                }}
              >
                Yesterday
              </Button>
            </div>
          </div>
        </Card>

        {/* Today's Emotions */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Emotions for {formatDate(selectedDate)}
              </h3>
              <Badge variant="primary" size="sm">
                {todaysEmotions.length} emotions
              </Badge>
            </div>

            {todaysEmotions.length > 0 ? (
              <div className="space-y-4">
                {todaysEmotions.map((emotion) => (
                  <EmotionCard
                    key={emotion.id}
                    emotion={emotion}
                    emotionCategories={emotionCategories}
                    formatTime={formatTime}
                    onClick={() => setSelectedEmotion(emotion)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Meh className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No emotions logged for this date
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setShowAddModal(true)}
                >
                  Log First Emotion
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Add Emotion Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Log New Emotion"
        size="lg"
      >
        <EmotionForm
          emotionCategories={emotionCategories}
          onClose={() => setShowAddModal(false)}
          onSave={(newEmotion) => {
            setEmotions([...emotions, { ...newEmotion, id: Date.now() }]);
            setShowAddModal(false);
          }}
        />
      </Modal>

      {/* Emotion Detail Modal */}
      {selectedEmotion && (
        <EmotionDetailModal
          emotion={selectedEmotion}
          emotionCategories={emotionCategories}
          onClose={() => setSelectedEmotion(null)}
          formatTime={formatTime}
        />
      )}
    </div>
  );
};

// Emotion Card Component
const EmotionCard = ({ emotion, emotionCategories, formatTime, onClick }) => {
  const category = emotionCategories[emotion.category];
  const emotionData = category?.emotions.find(e => e.id === emotion.emotion);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="cursor-pointer"
      onClick={() => onClick(emotion)}
    >
      <Card hover className="p-4">
        <div className="flex items-start space-x-4">
          <div className="text-3xl">{emotionData?.emoji}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {emotionData?.name}
              </h4>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" size="sm">
                  {formatTime(emotion.time)}
                </Badge>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < emotion.intensity
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {emotion.note}
            </p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex flex-wrap gap-1">
                {emotion.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" size="sm">
                    #{tag}
                  </Badge>
                ))}
                {emotion.tags.length > 3 && (
                  <Badge variant="outline" size="sm">
                    +{emotion.tags.length - 3}
                  </Badge>
                )}
              </div>
              <Badge variant={category?.color.includes('pink') ? 'primary' : 'secondary'} size="sm">
                {category?.name}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Emotion Form Component
const EmotionForm = ({ emotionCategories, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    category: '',
    emotion: '',
    intensity: 3,
    note: '',
    tags: '',
    partner: 'self',
    triggers: []
  });

  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.emotion) return;

    const newEmotion = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      triggers: formData.triggers
    };

    onSave(newEmotion);
  };

  const availableEmotions = selectedCategory ? emotionCategories[selectedCategory]?.emotions || [] : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
        <Input
          label="Time"
          type="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Emotion Category
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(emotionCategories).map(([key, category]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setSelectedCategory(key);
                setFormData({ ...formData, category: key, emotion: '' });
              }}
              className={`p-3 rounded-lg border text-left transition-colors ${
                selectedCategory === key
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className={`w-4 h-4 rounded-full ${category.color} mb-1`}></div>
              <div className="text-sm font-medium">{category.name}</div>
            </button>
          ))}
        </div>
      </div>

      {availableEmotions.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Specific Emotion
          </label>
          <div className="grid grid-cols-3 gap-2">
            {availableEmotions.map((emotion) => (
              <button
                key={emotion.id}
                type="button"
                onClick={() => setFormData({ ...formData, emotion: emotion.id, intensity: emotion.intensity })}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  formData.emotion === emotion.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-1">{emotion.emoji}</div>
                <div className="text-xs font-medium">{emotion.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Intensity: {formData.intensity}/5
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={formData.intensity}
          onChange={(e) => setFormData({ ...formData, intensity: parseInt(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notes
        </label>
        <textarea
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          placeholder="How are you feeling? What triggered this emotion?"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <Input
        label="Tags (comma-separated)"
        value={formData.tags}
        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        placeholder="happy, date-night, surprise"
        helperText="Add tags to help categorize this emotion"
      />

      <div className="flex justify-end space-x-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save Emotion
        </Button>
      </div>
    </form>
  );
};

// Emotion Detail Modal Component
const EmotionDetailModal = ({ emotion, emotionCategories, onClose, formatTime }) => {
  const category = emotionCategories[emotion.category];
  const emotionData = category?.emotions.find(e => e.id === emotion.emotion);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Emotion Details"
      size="lg"
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-2">{emotionData?.emoji}</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {emotionData?.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {new Date(emotion.date).toLocaleDateString()} at {formatTime(emotion.time)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {emotion.intensity}/5
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Intensity
              </div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-lg font-bold text-secondary-600 dark:text-secondary-400">
                {category?.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Category
              </div>
            </div>
          </Card>
        </div>

        {emotion.note && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Notes</h4>
            <p className="text-gray-600 dark:text-gray-300">{emotion.note}</p>
          </div>
        )}

        {emotion.tags && emotion.tags.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {emotion.tags.map((tag, index) => (
                <Badge key={index} variant="outline" size="sm">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline">
            Edit
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EmotionTracker;
