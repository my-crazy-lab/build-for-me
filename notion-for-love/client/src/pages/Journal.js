/**
 * Love Journey - Couple's Journal Page
 * 
 * Shared journaling space for couples with prompts, reflections,
 * gratitude entries, and collaborative writing features.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Plus, Heart, Star, Calendar, User,
  Edit, Trash2, Share, Download, Filter, Search,
  MessageCircle, Lightbulb, Smile, Coffee, Moon
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterAuthor, setFilterAuthor] = useState('all');

  // Journal entry types with prompts
  const entryTypes = {
    gratitude: {
      name: 'Gratitude',
      icon: Heart,
      color: 'bg-red-500',
      prompts: [
        "What are you most grateful for about your partner today?",
        "What small gesture from your partner made you smile recently?",
        "What quality in your partner do you appreciate most?",
        "What memory with your partner brings you the most joy?"
      ]
    },
    reflection: {
      name: 'Reflection',
      icon: Lightbulb,
      color: 'bg-yellow-500',
      prompts: [
        "How have you grown as a couple this week?",
        "What challenge did you overcome together recently?",
        "What did you learn about your partner today?",
        "How did you support each other this week?"
      ]
    },
    daily: {
      name: 'Daily Life',
      icon: Coffee,
      color: 'bg-blue-500',
      prompts: [
        "What was the highlight of your day together?",
        "What made you both laugh today?",
        "What ordinary moment felt special today?",
        "How did you connect with each other today?"
      ]
    },
    dreams: {
      name: 'Dreams & Goals',
      icon: Star,
      color: 'bg-purple-500',
      prompts: [
        "What dream are you both working towards?",
        "Where do you see yourselves in 5 years?",
        "What adventure do you want to go on together?",
        "What goal did you make progress on today?"
      ]
    },
    evening: {
      name: 'Evening Thoughts',
      icon: Moon,
      color: 'bg-indigo-500',
      prompts: [
        "What are you looking forward to tomorrow?",
        "What was your favorite moment together today?",
        "What are you grateful for as you end this day?",
        "How did your partner make you feel loved today?"
      ]
    },
    free: {
      name: 'Free Writing',
      icon: Edit,
      color: 'bg-gray-500',
      prompts: [
        "Write about anything on your mind...",
        "Share a random thought or feeling...",
        "What's something you want to remember?",
        "Express whatever is in your heart..."
      ]
    }
  };

  // Mock journal entries
  const mockEntries = [
    {
      id: 1,
      type: 'gratitude',
      title: 'Grateful for Your Support',
      content: 'Today I\'m incredibly grateful for how you supported me during my presentation. You helped me practice, gave me confidence, and celebrated with me afterward. Your belief in me means everything. I love how we\'re a team in everything we do.',
      author: 'self',
      date: '2024-12-25T20:30:00Z',
      mood: 'happy',
      tags: ['support', 'work', 'teamwork'],
      isShared: true,
      reactions: [
        { author: 'partner', emoji: '❤️', timestamp: '2024-12-25T21:00:00Z' },
        { author: 'partner', emoji: '🥰', timestamp: '2024-12-25T21:01:00Z' }
      ],
      comments: [
        {
          id: 1,
          author: 'partner',
          content: 'You did amazing! I\'m so proud of you. We really are the best team ❤️',
          timestamp: '2024-12-25T21:05:00Z'
        }
      ]
    },
    {
      id: 2,
      type: 'daily',
      title: 'Perfect Sunday Morning',
      content: 'Woke up to the smell of pancakes and found you in the kitchen, dancing to our favorite song while cooking. These simple moments are what I treasure most. We spent the morning talking over coffee, planning our week, and just enjoying each other\'s company.',
      author: 'partner',
      date: '2024-12-22T10:15:00Z',
      mood: 'content',
      tags: ['morning', 'cooking', 'music'],
      isShared: true,
      reactions: [
        { author: 'self', emoji: '☕', timestamp: '2024-12-22T11:00:00Z' },
        { author: 'self', emoji: '💕', timestamp: '2024-12-22T11:01:00Z' }
      ],
      comments: []
    },
    {
      id: 3,
      type: 'reflection',
      title: 'Growing Through Challenges',
      content: 'This week we faced some stress with work and family obligations, but I noticed how we\'ve gotten better at communicating through difficult times. Instead of getting frustrated with each other, we talked openly about our feelings and found solutions together.',
      author: 'self',
      date: '2024-12-20T19:45:00Z',
      mood: 'thoughtful',
      tags: ['communication', 'growth', 'challenges'],
      isShared: true,
      reactions: [
        { author: 'partner', emoji: '💪', timestamp: '2024-12-20T20:00:00Z' }
      ],
      comments: [
        {
          id: 1,
          author: 'partner',
          content: 'I\'ve noticed this too! We\'re definitely getting stronger together.',
          timestamp: '2024-12-20T20:15:00Z'
        }
      ]
    },
    {
      id: 4,
      type: 'dreams',
      title: 'Our Future Home',
      content: 'Spent the evening looking at houses online and dreaming about our future home. I love how we both get excited about the same things - a big kitchen for cooking together, a cozy reading nook, and a garden where we can grow our own vegetables.',
      author: 'partner',
      date: '2024-12-18T21:20:00Z',
      mood: 'excited',
      tags: ['future', 'home', 'dreams'],
      isShared: true,
      reactions: [
        { author: 'self', emoji: '🏠', timestamp: '2024-12-18T22:00:00Z' },
        { author: 'self', emoji: '🌱', timestamp: '2024-12-18T22:01:00Z' }
      ],
      comments: []
    },
    {
      id: 5,
      type: 'evening',
      title: 'Peaceful End to the Day',
      content: 'As I write this, you\'re reading beside me, and I feel so content. Today was busy, but we made time for each other. Our evening walk, dinner together, and now this quiet moment - it\'s perfect. Looking forward to tomorrow\'s adventures with you.',
      author: 'self',
      date: '2024-12-15T22:30:00Z',
      mood: 'peaceful',
      tags: ['evening', 'contentment', 'togetherness'],
      isShared: true,
      reactions: [
        { author: 'partner', emoji: '🌙', timestamp: '2024-12-15T23:00:00Z' }
      ],
      comments: []
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setEntries(mockEntries);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredEntries = entries.filter(entry => {
    if (filterType !== 'all' && entry.type !== filterType) return false;
    if (filterAuthor !== 'all' && entry.author !== filterAuthor) return false;
    if (searchQuery && !entry.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !entry.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    return true;
  });

  const getJournalStats = () => {
    const total = entries.length;
    const thisWeek = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    }).length;
    const myEntries = entries.filter(entry => entry.author === 'self').length;
    const partnerEntries = entries.filter(entry => entry.author === 'partner').length;

    return { total, thisWeek, myEntries, partnerEntries };
  };

  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      happy: '😊',
      excited: '🤩',
      content: '😌',
      peaceful: '😇',
      thoughtful: '🤔',
      grateful: '🙏',
      loving: '🥰',
      sad: '😢',
      worried: '😟',
      frustrated: '😤'
    };
    return moodEmojis[mood] || '😊';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
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
          text="Loading your shared journal..." 
        />
      </div>
    );
  }

  const stats = getJournalStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Couple's Journal
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Share your thoughts, dreams, and daily moments together
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAddModal(true)}
          >
            New Entry
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Entries
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
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                This Week
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.thisWeek}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                My Entries
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.myEntries}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Partner's Entries
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.partnerEntries}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Type:
              </span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Types</option>
                {Object.entries(entryTypes).map(([key, type]) => (
                  <option key={key} value={key}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Author:
              </span>
              <select
                value={filterAuthor}
                onChange={(e) => setFilterAuthor(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">Both</option>
                <option value="self">Me</option>
                <option value="partner">Partner</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Journal Entries */}
      <div className="space-y-6">
        {filteredEntries.map((entry, index) => (
          <JournalEntryCard
            key={entry.id}
            entry={entry}
            index={index}
            entryTypes={entryTypes}
            getMoodEmoji={getMoodEmoji}
            formatDate={formatDate}
            formatTime={formatTime}
            onClick={() => setSelectedEntry(entry)}
          />
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No entries found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery || filterType !== 'all' || filterAuthor !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Start your journaling journey together by creating your first entry.'
            }
          </p>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAddModal(true)}
          >
            Create First Entry
          </Button>
        </div>
      )}

      {/* Add Entry Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="New Journal Entry"
        size="lg"
      >
        <JournalEntryForm
          entryTypes={entryTypes}
          onClose={() => setShowAddModal(false)}
          onSave={(newEntry) => {
            setEntries([{ ...newEntry, id: Date.now() }, ...entries]);
            setShowAddModal(false);
          }}
        />
      </Modal>

      {/* Entry Detail Modal */}
      {selectedEntry && (
        <JournalEntryDetailModal
          entry={selectedEntry}
          entryTypes={entryTypes}
          getMoodEmoji={getMoodEmoji}
          formatDate={formatDate}
          formatTime={formatTime}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </div>
  );
};

// Journal Entry Card Component
const JournalEntryCard = ({
  entry,
  index,
  entryTypes,
  getMoodEmoji,
  formatDate,
  formatTime,
  onClick
}) => {
  const entryType = entryTypes[entry.type];
  const TypeIcon = entryType?.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="cursor-pointer"
      onClick={() => onClick(entry)}
    >
      <Card hover className="relative">
        {/* Author Badge */}
        <div className="absolute top-4 right-4">
          <Badge variant={entry.author === 'self' ? 'primary' : 'secondary'} size="sm">
            {entry.author === 'self' ? 'You' : 'Partner'}
          </Badge>
        </div>

        <div className="flex items-start space-x-4">
          {/* Type Icon */}
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${entryType?.color}`}>
            {TypeIcon && <TypeIcon className="w-6 h-6 text-white" />}
          </div>

          <div className="flex-1 pr-16">
            {/* Header */}
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {entry.title}
              </h3>
              <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
            </div>

            {/* Content Preview */}
            <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">
              {entry.content}
            </p>

            {/* Meta Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{formatDate(entry.date)}</span>
                <span>{formatTime(entry.date)}</span>
                <Badge variant="outline" size="sm">
                  {entryType?.name}
                </Badge>
              </div>

              <div className="flex items-center space-x-2">
                {/* Reactions */}
                {entry.reactions && entry.reactions.length > 0 && (
                  <div className="flex items-center space-x-1">
                    {entry.reactions.slice(0, 3).map((reaction, reactionIndex) => (
                      <span key={reactionIndex} className="text-sm">
                        {reaction.emoji}
                      </span>
                    ))}
                    {entry.reactions.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{entry.reactions.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Comments */}
                {entry.comments && entry.comments.length > 0 && (
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <MessageCircle className="w-3 h-3" />
                    <span>{entry.comments.length}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {entry.tags.slice(0, 4).map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="outline" size="sm">
                    #{tag}
                  </Badge>
                ))}
                {entry.tags.length > 4 && (
                  <Badge variant="outline" size="sm">
                    +{entry.tags.length - 4}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Journal Entry Form Component
const JournalEntryForm = ({ entryTypes, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    type: 'gratitude',
    title: '',
    content: '',
    mood: 'happy',
    tags: '',
    isShared: true
  });

  const [selectedPrompt, setSelectedPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    const newEntry = {
      ...formData,
      author: 'self',
      date: new Date().toISOString(),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      reactions: [],
      comments: []
    };

    onSave(newEntry);
  };

  const handlePromptSelect = (prompt) => {
    setSelectedPrompt(prompt);
    if (!formData.content) {
      setFormData({ ...formData, content: prompt + '\n\n' });
    }
  };

  const currentType = entryTypes[formData.type];
  const TypeIcon = currentType?.icon;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Entry Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Entry Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(entryTypes).map(([key, type]) => {
            const Icon = type.icon;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFormData({ ...formData, type: key })}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  formData.type === key
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 ${type.color}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-medium">{type.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Writing Prompts */}
      {currentType && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Writing Prompts (Optional)
          </label>
          <div className="space-y-2">
            {currentType.prompts.map((prompt, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handlePromptSelect(prompt)}
                className="w-full text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start space-x-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{prompt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Title */}
      <Input
        label="Entry Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Give your entry a meaningful title..."
        required
      />

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Thoughts
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Share your thoughts, feelings, and experiences..."
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          required
        />
      </div>

      {/* Mood */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Current Mood
        </label>
        <select
          value={formData.mood}
          onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="happy">😊 Happy</option>
          <option value="excited">🤩 Excited</option>
          <option value="content">😌 Content</option>
          <option value="peaceful">😇 Peaceful</option>
          <option value="thoughtful">🤔 Thoughtful</option>
          <option value="grateful">🙏 Grateful</option>
          <option value="loving">🥰 Loving</option>
          <option value="sad">😢 Sad</option>
          <option value="worried">😟 Worried</option>
          <option value="frustrated">😤 Frustrated</option>
        </select>
      </div>

      {/* Tags */}
      <Input
        label="Tags (comma-separated)"
        value={formData.tags}
        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        placeholder="love, gratitude, adventure, growth"
        helperText="Add tags to help organize and find your entries"
      />

      {/* Share Option */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isShared"
          checked={formData.isShared}
          onChange={(e) => setFormData({ ...formData, isShared: e.target.checked })}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label htmlFor="isShared" className="text-sm text-gray-700 dark:text-gray-300">
          Share with partner
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save Entry
        </Button>
      </div>
    </form>
  );
};

// Journal Entry Detail Modal Component
const JournalEntryDetailModal = ({
  entry,
  entryTypes,
  getMoodEmoji,
  formatDate,
  formatTime,
  onClose
}) => {
  const [newComment, setNewComment] = useState('');
  const [selectedReaction, setSelectedReaction] = useState('');

  const entryType = entryTypes[entry.type];
  const TypeIcon = entryType?.icon;

  const handleAddReaction = (emoji) => {
    // In a real app, this would update the entry with the new reaction
    console.log('Adding reaction:', emoji);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // In a real app, this would add the comment to the entry
    console.log('Adding comment:', newComment);
    setNewComment('');
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={entry.title}
      size="lg"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${entryType?.color}`}>
              {TypeIcon && <TypeIcon className="w-5 h-5 text-white" />}
            </div>
            <div>
              <Badge variant={entry.author === 'self' ? 'primary' : 'secondary'} size="sm">
                {entry.author === 'self' ? 'You' : 'Partner'}
              </Badge>
              <Badge variant="outline" size="sm" className="ml-2">
                {entryType?.name}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
            <div className="text-right text-sm text-gray-500 dark:text-gray-400">
              <div>{formatDate(entry.date)}</div>
              <div>{formatTime(entry.date)}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {entry.content}
            </p>
          </div>
        </div>

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag, index) => (
                <Badge key={index} variant="outline" size="sm">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Reactions */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Reactions</h4>

          {/* Add Reaction */}
          <div className="flex items-center space-x-2 mb-3">
            {['❤️', '🥰', '😊', '👏', '🙌', '💕', '✨', '🔥'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleAddReaction(emoji)}
                className="text-xl hover:scale-110 transition-transform p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Existing Reactions */}
          {entry.reactions && entry.reactions.length > 0 && (
            <div className="space-y-2">
              {entry.reactions.map((reaction, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <span className="text-lg">{reaction.emoji}</span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {reaction.author === 'self' ? 'You' : 'Partner'}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {formatTime(reaction.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comments */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Comments</h4>

          {/* Add Comment */}
          <form onSubmit={handleAddComment} className="mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <Button type="submit" variant="primary" size="sm">
                Send
              </Button>
            </div>
          </form>

          {/* Existing Comments */}
          {entry.comments && entry.comments.length > 0 ? (
            <div className="space-y-3">
              {entry.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {comment.author === 'self' ? 'You' : 'Partner'}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatTime(comment.timestamp)}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm italic">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" leftIcon={<Share className="w-4 h-4" />}>
            Share
          </Button>
          {entry.author === 'self' && (
            <Button variant="outline" leftIcon={<Edit className="w-4 h-4" />}>
              Edit
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default Journal;
