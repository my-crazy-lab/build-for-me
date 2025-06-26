/**
 * Love Journey - Goals Page
 *
 * Comprehensive goals management with Kanban board, progress tracking,
 * and collaborative planning features for couples.
 *
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Plus, Filter, Search, Calendar, User,
  CheckCircle, Clock, AlertCircle, TrendingUp,
  MoreVertical, Edit, Trash2, Star, Flag
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Avatar from '../components/ui/Avatar';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { goalsService } from '../services';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban'); // kanban, list
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  // Load goals and categories from API
  const loadGoals = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        category: selectedCategory,
        search: searchQuery
      };

      const response = await goalsService.getGoals(filters);
      if (response.success) {
        setGoals(response.data);
      } else {
        setError(response.error);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
      setError('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await goalsService.getCategories();
      if (response.success) {
        setCategories(response.data.map(cat => ({
          id: cat._id,
          label: cat._id === 'all' ? 'All Goals' : cat._id.charAt(0).toUpperCase() + cat._id.slice(1),
          count: cat.count
        })));
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const statusColumns = [
    { id: 'active', label: 'Active', color: 'bg-blue-100 dark:bg-blue-900' },
    { id: 'paused', label: 'Paused', color: 'bg-yellow-100 dark:bg-yellow-900' },
    { id: 'completed', label: 'Completed', color: 'bg-green-100 dark:bg-green-900' }
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadGoals();
  }, [selectedCategory, searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredGoals = goals.filter(goal => {
    if (selectedCategory !== 'all' && goal.category !== selectedCategory) {
      return false;
    }
    if (searchQuery && !goal.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !goal.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !goal.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    return true;
  });

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'error',
      medium: 'warning',
      low: 'success'
    };
    return colors[priority] || 'default';
  };

  const getCategoryColor = (category) => {
    const colors = {
      financial: 'success',
      travel: 'warning',
      learning: 'info',
      health: 'secondary',
      romantic: 'primary'
    };
    return colors[category] || 'default';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-success-600 dark:text-success-400';
    if (progress >= 50) return 'text-warning-600 dark:text-warning-400';
    return 'text-primary-600 dark:text-primary-400';
  };

  const getDaysUntilTarget = (targetDate) => {
    if (!targetDate) return null;
    const now = new Date();
    const target = new Date(targetDate);
    const diffTime = target - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner
          size="lg"
          variant="dots"
          text="Loading your goals..."
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
            onClick={() => loadGoals()}
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
            Shared Goals
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filteredGoals.length} goals to achieve together
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAddModal(true)}
          >
            Add Goal
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Goals
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {goals.length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                In Progress
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {goals.filter(g => g.status === 'in-progress').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completed
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {goals.filter(g => g.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg Progress
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length)}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search goals..."
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
        </div>
      </Card>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {statusColumns.map((column) => (
          <div key={column.id} className="space-y-4">
            <div className={`p-4 rounded-lg ${column.color}`}>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {column.label}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {filteredGoals.filter(goal => goal.status === column.id).length} goals
              </p>
            </div>

            <div className="space-y-4">
              {filteredGoals
                .filter(goal => goal.status === column.id)
                .map((goal, index) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    index={index}
                    onGoalClick={setSelectedGoal}
                    getPriorityColor={getPriorityColor}
                    getCategoryColor={getCategoryColor}
                    getProgressColor={getProgressColor}
                    getDaysUntilTarget={getDaysUntilTarget}
                    formatDate={formatDate}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Goal Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create New Goal"
        size="lg"
      >
        <GoalForm
          onClose={() => setShowAddModal(false)}
          onSave={async (goalData) => {
            try {
              const response = await goalsService.createGoal(goalData);
              if (response.success) {
                // Refresh goals list
                const goalsResponse = await goalsService.getGoals();
                if (goalsResponse.success) {
                  setGoals(goalsResponse.data);
                }
                setShowAddModal(false);
              } else {
                console.error('Failed to create goal:', response.error);
                alert('Failed to create goal. Please try again.');
              }
            } catch (error) {
              console.error('Error creating goal:', error);
              alert('Failed to create goal. Please try again.');
            }
          }}
        />
      </Modal>

      {/* Goal Detail Modal */}
      {selectedGoal && (
        <GoalDetailModal
          goal={selectedGoal}
          onClose={() => setSelectedGoal(null)}
          getPriorityColor={getPriorityColor}
          getCategoryColor={getCategoryColor}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

// Goal Card Component
const GoalCard = ({
  goal,
  index,
  onGoalClick,
  getPriorityColor,
  getCategoryColor,
  getProgressColor,
  getDaysUntilTarget,
  formatDate
}) => {
  const daysUntilTarget = getDaysUntilTarget(goal.targetDate);
  const completedMilestones = goal.milestones ? goal.milestones.filter(m => m.isCompleted).length : 0;
  const totalMilestones = goal.milestones ? goal.milestones.length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        hover
        clickable
        onClick={() => onGoalClick(goal)}
        className="cursor-pointer"
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                {goal.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {goal.description}
              </p>
            </div>
            <div className="flex items-center space-x-1 ml-2">
              <Badge variant={getPriorityColor(goal.priority)} size="sm">
                {goal.priority}
              </Badge>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className={`font-semibold ${getProgressColor(goal.progress)}`}>
                {goal.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${
                  goal.progress >= 80 ? 'bg-success-500' :
                  goal.progress >= 50 ? 'bg-warning-500' : 'bg-primary-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${goal.progress}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
            </div>
          </div>

          {/* Milestones */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-success-500" />
              <span className="text-gray-600 dark:text-gray-400">
                {completedMilestones}/{totalMilestones} milestones
              </span>
            </div>
            <Badge variant={getCategoryColor(goal.category)} size="sm">
              {goal.category}
            </Badge>
          </div>

          {/* Target Date */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                Due {formatDate(goal.targetDate)}
              </span>
            </div>
            {daysUntilTarget > 0 && (
              <span className={`text-xs ${
                daysUntilTarget <= 7 ? 'text-error-600' :
                daysUntilTarget <= 30 ? 'text-warning-600' : 'text-gray-500'
              }`}>
                {daysUntilTarget} days left
              </span>
            )}
          </div>

          {/* Assigned Users */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Assigned to:</span>
              <div className="flex -space-x-1">
                {goal.assignedTo && goal.assignedTo.map((user, userIndex) => (
                  <Avatar
                    key={userIndex}
                    name={user.name || `User ${userIndex + 1}`}
                    src={user.avatar}
                    size="sm"
                    className="ring-2 ring-white dark:ring-gray-800"
                  />
                ))}
              </div>
            </div>
            {goal.status === 'completed' && (
              <div className="flex items-center space-x-1 text-success-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {goal.tags && goal.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {goal.tags.slice(0, 3).map((tag, tagIndex) => (
                <Badge key={tagIndex} variant="outline" size="sm">
                  #{tag}
                </Badge>
              ))}
              {goal.tags.length > 3 && (
                <Badge variant="outline" size="sm">
                  +{goal.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

// Goal Detail Modal Component
const GoalDetailModal = ({ goal, onClose, getPriorityColor, getCategoryColor, formatDate }) => {
  const completedMilestones = goal.milestones ? goal.milestones.filter(m => m.isCompleted).length : 0;
  const totalMilestones = goal.milestones ? goal.milestones.length : 0;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={goal.title}
      size="xl"
    >
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge variant={getPriorityColor(goal.priority)} size="sm">
              {goal.priority} priority
            </Badge>
            <Badge variant={getCategoryColor(goal.category)} size="sm">
              {goal.category}
            </Badge>
            {goal.status === 'completed' && (
              <Badge variant="success" size="sm">
                Completed
              </Badge>
            )}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Created {formatDate(goal.createdAt)}
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
          <p className="text-gray-600 dark:text-gray-300">{goal.description}</p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {goal.progress}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Overall Progress
              </div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600 dark:text-success-400">
                {completedMilestones}/{totalMilestones}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Milestones Done
              </div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning-600 dark:text-warning-400">
                {formatDate(goal.targetDate)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Target Date
              </div>
            </div>
          </Card>
        </div>

        {/* Financial Progress (if applicable) */}
        {goal.targetAmount && goal.currentAmount !== undefined && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Financial Progress</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  ${goal.currentAmount?.toLocaleString()} of ${goal.targetAmount?.toLocaleString()}
                </span>
                <span className="font-semibold text-success-600 dark:text-success-400">
                  {Math.round((goal.currentAmount / goal.targetAmount) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                <div
                  className="h-3 bg-success-500 rounded-full transition-all duration-500"
                  style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Milestones */}
        {goal.milestones && goal.milestones.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Milestones</h4>
            <div className="space-y-3">
              {goal.milestones.map((milestone, index) => (
                <div
                  key={milestone._id || index}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    milestone.isCompleted
                      ? 'bg-success-50 dark:bg-success-900/20'
                      : 'bg-gray-50 dark:bg-gray-700/50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    milestone.isCompleted
                      ? 'bg-success-500 text-white'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}>
                    {milestone.isCompleted && <CheckCircle className="w-3 h-3" />}
                  </div>
                  <div className="flex-1">
                    <h5 className={`font-medium ${
                      milestone.isCompleted
                        ? 'text-success-800 dark:text-success-200 line-through'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {milestone.title}
                    </h5>
                    {milestone.isCompleted && milestone.completedDate && (
                      <p className="text-sm text-success-600 dark:text-success-400">
                        Completed {formatDate(milestone.completedDate)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {goal.tags && goal.tags.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {goal.tags.map((tag, index) => (
                <Badge key={index} variant="outline" size="sm">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {goal.notes && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Notes</h4>
            <p className="text-gray-600 dark:text-gray-300 italic">"{goal.notes}"</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline">
            Edit Goal
          </Button>
          <Button variant="primary">
            Update Progress
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Goal Form Component
const GoalForm = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
    targetDate: '',
    tags: '',
    notes: '',
    milestones: [],
    isPrivate: false
  });

  const [currentMilestone, setCurrentMilestone] = useState({
    title: '',
    description: '',
    targetDate: ''
  });

  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'travel', label: 'Travel & Adventures' },
    { value: 'finance', label: 'Financial Goals' },
    { value: 'health', label: 'Health & Fitness' },
    { value: 'family', label: 'Family & Relationships' },
    { value: 'learning', label: 'Learning & Growth' },
    { value: 'career', label: 'Career & Professional' },
    { value: 'home', label: 'Home & Living' },
    { value: 'romantic', label: 'Romantic Goals' },
    { value: 'adventure', label: 'Adventures' },
    { value: 'spiritual', label: 'Spiritual & Personal' },
    { value: 'social', label: 'Social & Community' },
    { value: 'hobby', label: 'Hobbies & Interests' },
    { value: 'other', label: 'Other' }
  ];

  const priorities = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category) return;

    setLoading(true);
    try {
      const goalData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        targetDate: formData.targetDate ? new Date(formData.targetDate).toISOString() : undefined,
        milestones: formData.milestones.map(milestone => ({
          ...milestone,
          targetDate: milestone.targetDate ? new Date(milestone.targetDate).toISOString() : undefined
        }))
      };

      await onSave(goalData);
    } catch (error) {
      console.error('Error submitting goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMilestone = () => {
    if (!currentMilestone.title) return;

    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { ...currentMilestone, id: Date.now() }]
    }));

    setCurrentMilestone({
      title: '',
      description: '',
      targetDate: ''
    });
  };

  const removeMilestone = (id) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(milestone => milestone.id !== id)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Goal Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Save for our dream vacation"
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
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          >
            {priorities.map(priority => (
              <option key={priority.value} value={priority.value}>{priority.label}</option>
            ))}
          </select>
        </div>
        <Input
          label="Target Date"
          type="date"
          value={formData.targetDate}
          onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your goal and why it's important to you both..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <Input
        label="Tags"
        value={formData.tags}
        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        placeholder="vacation, savings, travel (comma separated)"
        helperText="Add tags to help organize and find this goal later"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any additional notes or details about this goal..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.isPrivate}
          onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Keep this goal private</span>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Goal'}
        </Button>
      </div>
    </form>
  );
};

export default Goals;
