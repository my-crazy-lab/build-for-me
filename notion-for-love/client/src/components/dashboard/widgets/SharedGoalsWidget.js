/**
 * Love Journey - Shared Goals Widget
 * 
 * Dashboard widget displaying active goals with progress tracking,
 * quick actions, and beautiful progress visualizations.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, ArrowRight, Calendar, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardWidget from '../DashboardWidget';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';

const SharedGoalsWidget = ({ id, onRemove, onResize, onSettings }) => {
  // Mock goals data
  const goals = [
    {
      id: 1,
      title: "Save for Dream House",
      description: "Save $50,000 for our future home down payment",
      progress: 68,
      targetDate: "2025-06-01",
      category: "financial",
      priority: "high",
      daysLeft: 158
    },
    {
      id: 2,
      title: "Plan European Honeymoon",
      description: "Research and book our 2-week European adventure",
      progress: 45,
      targetDate: "2025-03-15",
      category: "travel",
      priority: "medium",
      daysLeft: 80
    },
    {
      id: 3,
      title: "Learn Cooking Together",
      description: "Master 20 new recipes from different cuisines",
      progress: 85,
      targetDate: "2025-01-31",
      category: "learning",
      priority: "low",
      daysLeft: 37
    }
  ];

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

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'error',
      medium: 'warning',
      low: 'success'
    };
    return colors[priority] || 'default';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-success-600 dark:text-success-400';
    if (progress >= 50) return 'text-warning-600 dark:text-warning-400';
    return 'text-primary-600 dark:text-primary-400';
  };

  return (
    <DashboardWidget
      id={id}
      title="Shared Goals"
      onRemove={onRemove}
      onResize={onResize}
      onSettings={onSettings}
      size="lg"
    >
      <div className="space-y-4">
        {/* Header Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-secondary-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {goals.length} active goals
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Goal
            </Button>
            <Link to="/goals">
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

        {/* Goals List */}
        <div className="space-y-4">
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {goal.title}
                    </h4>
                    <Badge variant={getPriorityColor(goal.priority)} size="sm">
                      {goal.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {goal.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {goal.daysLeft} days left
                    </div>
                    <Badge variant={getCategoryColor(goal.category)} size="sm">
                      {goal.category}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getProgressColor(goal.progress)}`}>
                    {goal.progress}%
                  </div>
                  {goal.progress >= 80 && (
                    <CheckCircle className="w-4 h-4 text-success-500 ml-auto mt-1" />
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative">
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
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              2 goals due this month
            </span>
            <Link 
              to="/goals" 
              className="text-secondary-600 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300 font-medium"
            >
              Manage goals →
            </Link>
          </div>
        </div>
      </div>
    </DashboardWidget>
  );
};

export default SharedGoalsWidget;
