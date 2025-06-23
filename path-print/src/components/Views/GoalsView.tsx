/**
 * Career Path Visualization - Goals View Component
 * 
 * This component provides a comprehensive goals management interface
 * for planning and tracking career objectives.
 * 
 * @fileoverview Goals planning and tracking interface
 * @author Career Path Visualization Team
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Plus, 
  Calendar, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  AlertCircle,
  Edit3,
  Trash2,
  Star
} from 'lucide-react';
import type { CareerData, Goal } from '../../types';
import { useAppContext } from '../Layout/AppLayout';

// ============================================================================
// INTERFACES
// ============================================================================

interface GoalsViewProps {
  className?: string;
}

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
}

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get priority color
 */
function getPriorityColor(priority: string): string {
  const colors = {
    low: 'bg-gray-500',
    medium: 'bg-blue-500',
    high: 'bg-orange-500',
    critical: 'bg-red-500'
  };
  return colors[priority as keyof typeof colors] || 'bg-gray-500';
}

/**
 * Get priority text color
 */
function getPriorityTextColor(priority: string): string {
  const colors = {
    low: 'text-gray-600',
    medium: 'text-blue-600',
    high: 'text-orange-600',
    critical: 'text-red-600'
  };
  return colors[priority as keyof typeof colors] || 'text-gray-600';
}

/**
 * Calculate days until target
 */
function getDaysUntilTarget(targetDate: string): number {
  const target = new Date(targetDate);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get status info for a goal
 */
function getGoalStatus(goal: Goal): { status: string; color: string; icon: React.ComponentType } {
  const daysUntil = getDaysUntilTarget(goal.targetDate);
  
  if (goal.progress >= 100) {
    return { status: 'Completed', color: 'text-green-600', icon: CheckCircle };
  } else if (daysUntil < 0) {
    return { status: 'Overdue', color: 'text-red-600', icon: AlertCircle };
  } else if (daysUntil <= 7) {
    return { status: 'Due Soon', color: 'text-orange-600', icon: Clock };
  } else {
    return { status: 'On Track', color: 'text-blue-600', icon: TrendingUp };
  }
}

// ============================================================================
// GOAL CARD COMPONENT
// ============================================================================

function GoalCard({ goal, onEdit, onDelete }: GoalCardProps): React.JSX.Element {
  const daysUntil = getDaysUntilTarget(goal.targetDate);
  const { status, color, icon: StatusIcon } = getGoalStatus(goal);
  const completedSteps = goal.steps?.filter(step => step.completed).length || 0;
  const totalSteps = goal.steps?.length || 0;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {goal.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getPriorityColor(goal.priority)}`}>
              {goal.priority}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            {goal.description}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(goal)}
            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Edit goal"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Delete goal"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Status and Date */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <StatusIcon size={16} className={color} />
          <span className={`text-sm font-medium ${color}`}>{status}</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 text-sm">
          <Calendar size={14} />
          <span>
            {daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` : 
             daysUntil === 0 ? 'Due today' :
             `${daysUntil} days left`}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{goal.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <motion.div
            className={`h-3 rounded-full ${
              goal.progress >= 100 ? 'bg-green-500' :
              daysUntil < 0 ? 'bg-red-500' :
              getPriorityColor(goal.priority)
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(goal.progress, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Steps Progress */}
      {goal.steps && goal.steps.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Steps</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {completedSteps}/{totalSteps} completed
            </span>
          </div>
          <div className="space-y-1">
            {goal.steps.slice(0, 3).map((step) => (
              <div key={step.id} className="flex items-center space-x-2 text-sm">
                <CheckCircle 
                  size={14} 
                  className={step.completed ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'} 
                />
                <span className={`${step.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                  {step.title}
                </span>
              </div>
            ))}
            {goal.steps.length > 3 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                +{goal.steps.length - 3} more steps
              </div>
            )}
          </div>
        </div>
      )}

      {/* Required Skills */}
      <div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Required Skills:
        </span>
        <div className="flex flex-wrap gap-2">
          {goal.requiredSkills.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
            >
              {skill}
            </span>
          ))}
          {goal.requiredSkills.length > 4 && (
            <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full text-xs">
              +{goal.requiredSkills.length - 4} more
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Goals view component
 */
export function GoalsView({ className = '' }: GoalsViewProps): React.JSX.Element {
  const { careerData } = useAppContext();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'overdue'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'deadline' | 'progress'>('priority');

  if (!careerData) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <Target size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No career data available</p>
        </div>
      </div>
    );
  }

  const goals = careerData.goals || [];

  // Filter goals
  const filteredGoals = goals.filter(goal => {
    const daysUntil = getDaysUntilTarget(goal.targetDate);
    switch (filter) {
      case 'active':
        return goal.progress < 100 && daysUntil >= 0;
      case 'completed':
        return goal.progress >= 100;
      case 'overdue':
        return goal.progress < 100 && daysUntil < 0;
      default:
        return true;
    }
  });

  // Sort goals
  const sortedGoals = [...filteredGoals].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
      case 'deadline':
        return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
      case 'progress':
        return b.progress - a.progress;
      default:
        return 0;
    }
  });

  const handleEditGoal = (goal: Goal) => {
    console.log('Edit goal:', goal.id);
    // TODO: Implement goal editing modal
  };

  const handleDeleteGoal = (goalId: string) => {
    console.log('Delete goal:', goalId);
    // TODO: Implement goal deletion
  };

  const handleAddGoal = () => {
    console.log('Add new goal');
    // TODO: Implement add goal modal
  };

  // Calculate statistics
  const completedGoals = goals.filter(goal => goal.progress >= 100).length;
  const overdueGoals = goals.filter(goal => {
    const daysUntil = getDaysUntilTarget(goal.targetDate);
    return goal.progress < 100 && daysUntil < 0;
  }).length;
  const avgProgress = goals.length > 0 
    ? goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length 
    : 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={`max-w-7xl mx-auto ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Goals & Planning
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your career objectives and plan your professional growth.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddGoal}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Goal</span>
        </motion.button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center border border-gray-200 dark:border-gray-700">
          <Target size={32} className="mx-auto text-blue-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{goals.length}</div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">Total Goals</div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center border border-gray-200 dark:border-gray-700">
          <CheckCircle size={32} className="mx-auto text-green-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{completedGoals}</div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">Completed</div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center border border-gray-200 dark:border-gray-700">
          <AlertCircle size={32} className="mx-auto text-red-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{overdueGoals}</div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">Overdue</div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center border border-gray-200 dark:border-gray-700">
          <TrendingUp size={32} className="mx-auto text-purple-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{avgProgress.toFixed(0)}%</div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">Avg Progress</div>
        </motion.div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
          {(['all', 'active', 'completed', 'overdue'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === filterOption
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'priority' | 'deadline' | 'progress')}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
          >
            <option value="priority">Priority</option>
            <option value="deadline">Deadline</option>
            <option value="progress">Progress</option>
          </select>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {sortedGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {sortedGoals.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="text-center py-12"
        >
          <Target size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No goals found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {filter === 'all' 
              ? "Start planning your career by adding your first goal."
              : `No goals match the "${filter}" filter.`
            }
          </p>
          {filter === 'all' && (
            <button
              onClick={handleAddGoal}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Goal
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
