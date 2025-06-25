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

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban'); // kanban, list
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  // Mock goals data
  const mockGoals = [
    {
      id: 1,
      title: "Save for Dream House",
      description: "Save $50,000 for our future home down payment. We want to find a cozy place with a garden where we can build our life together.",
      status: "in-progress",
      priority: "high",
      category: "financial",
      progress: 68,
      targetAmount: 50000,
      currentAmount: 34000,
      targetDate: "2025-06-01",
      assignedTo: ["user1", "user2"],
      createdBy: "user1",
      createdAt: "2024-01-01",
      milestones: [
        { id: 1, title: "Open savings account", completed: true, completedAt: "2024-01-15" },
        { id: 2, title: "Save first $10k", completed: true, completedAt: "2024-03-20" },
        { id: 3, title: "Reach $25k milestone", completed: true, completedAt: "2024-08-15" },
        { id: 4, title: "Find potential neighborhoods", completed: false },
        { id: 5, title: "Get pre-approved for mortgage", completed: false }
      ],
      tags: ["house", "savings", "future", "investment"],
      notes: "We've been really disciplined with our spending and are ahead of schedule!"
    },
    {
      id: 2,
      title: "Plan European Honeymoon",
      description: "Research and book our 2-week European adventure visiting Paris, Rome, and Barcelona.",
      status: "planning",
      priority: "medium",
      category: "travel",
      progress: 45,
      targetDate: "2025-03-15",
      assignedTo: ["user1"],
      createdBy: "user2",
      createdAt: "2024-10-01",
      milestones: [
        { id: 1, title: "Research destinations", completed: true, completedAt: "2024-10-15" },
        { id: 2, title: "Set budget", completed: true, completedAt: "2024-10-20" },
        { id: 3, title: "Book flights", completed: false },
        { id: 4, title: "Reserve hotels", completed: false },
        { id: 5, title: "Plan daily itineraries", completed: false }
      ],
      tags: ["honeymoon", "europe", "travel", "adventure"],
      notes: "So excited for this trip! Need to book flights soon for better prices."
    },
    {
      id: 3,
      title: "Learn Cooking Together",
      description: "Master 20 new recipes from different cuisines to expand our culinary skills and enjoy cooking dates.",
      status: "in-progress",
      priority: "low",
      category: "learning",
      progress: 85,
      targetDate: "2025-01-31",
      assignedTo: ["user1", "user2"],
      createdBy: "user1",
      createdAt: "2024-09-01",
      milestones: [
        { id: 1, title: "Learn 5 Italian recipes", completed: true, completedAt: "2024-09-30" },
        { id: 2, title: "Learn 5 Asian recipes", completed: true, completedAt: "2024-10-31" },
        { id: 3, title: "Learn 5 Mexican recipes", completed: true, completedAt: "2024-11-30" },
        { id: 4, title: "Learn 3 French recipes", completed: true, completedAt: "2024-12-15" },
        { id: 5, title: "Learn 2 dessert recipes", completed: false }
      ],
      tags: ["cooking", "learning", "together", "food"],
      notes: "We've become quite the cooking team! Just need to master some desserts."
    },
    {
      id: 4,
      title: "Start Fitness Journey",
      description: "Begin working out together 3 times per week to stay healthy and support each other's fitness goals.",
      status: "completed",
      priority: "medium",
      category: "health",
      progress: 100,
      targetDate: "2024-12-31",
      completedDate: "2024-12-20",
      assignedTo: ["user1", "user2"],
      createdBy: "user2",
      createdAt: "2024-06-01",
      milestones: [
        { id: 1, title: "Join gym together", completed: true, completedAt: "2024-06-15" },
        { id: 2, title: "Create workout schedule", completed: true, completedAt: "2024-06-20" },
        { id: 3, title: "Complete first month", completed: true, completedAt: "2024-07-15" },
        { id: 4, title: "Establish routine", completed: true, completedAt: "2024-09-01" },
        { id: 5, title: "Reach 6-month milestone", completed: true, completedAt: "2024-12-01" }
      ],
      tags: ["fitness", "health", "together", "routine"],
      notes: "We did it! Working out together has been amazing for our relationship."
    }
  ];

  const categories = [
    { id: 'all', label: 'All Goals', count: mockGoals.length },
    { id: 'financial', label: 'Financial', count: 1 },
    { id: 'travel', label: 'Travel', count: 1 },
    { id: 'learning', label: 'Learning', count: 1 },
    { id: 'health', label: 'Health', count: 1 }
  ];

  const statusColumns = [
    { id: 'planning', label: 'Planning', color: 'bg-blue-100 dark:bg-blue-900' },
    { id: 'in-progress', label: 'In Progress', color: 'bg-yellow-100 dark:bg-yellow-900' },
    { id: 'completed', label: 'Completed', color: 'bg-green-100 dark:bg-green-900' }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setGoals(mockGoals);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
    const now = new Date();
    const target = new Date(targetDate);
    const diffTime = target - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString) => {
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
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Set a new goal to achieve together and track your progress.
          </p>
          {/* Add goal form would go here */}
          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary">
              Create Goal
            </Button>
          </div>
        </div>
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
  const completedMilestones = goal.milestones.filter(m => m.completed).length;
  const totalMilestones = goal.milestones.length;

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
                {goal.assignedTo.map((userId, userIndex) => (
                  <Avatar
                    key={userIndex}
                    name={`User ${userId}`}
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
        </div>
      </Card>
    </motion.div>
  );
};

// Goal Detail Modal Component
const GoalDetailModal = ({ goal, onClose, getPriorityColor, getCategoryColor, formatDate }) => {
  const completedMilestones = goal.milestones.filter(m => m.completed).length;
  const totalMilestones = goal.milestones.length;

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
        {goal.targetAmount && (
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
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Milestones</h4>
          <div className="space-y-3">
            {goal.milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  milestone.completed
                    ? 'bg-success-50 dark:bg-success-900/20'
                    : 'bg-gray-50 dark:bg-gray-700/50'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  milestone.completed
                    ? 'bg-success-500 text-white'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  {milestone.completed && <CheckCircle className="w-3 h-3" />}
                </div>
                <div className="flex-1">
                  <h5 className={`font-medium ${
                    milestone.completed
                      ? 'text-success-800 dark:text-success-200 line-through'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {milestone.title}
                  </h5>
                  {milestone.completed && milestone.completedAt && (
                    <p className="text-sm text-success-600 dark:text-success-400">
                      Completed {formatDate(milestone.completedAt)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
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

export default Goals;
