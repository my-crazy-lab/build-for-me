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
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { goalsService } from '../../../services';
import DashboardWidget from '../DashboardWidget';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';

const SharedGoalsWidget = ({ id, onRemove, onResize, onSettings }) => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load goals from API
  useEffect(() => {
    const loadGoals = async () => {
      try {
        setLoading(true);
        const response = await goalsService.getGoals({ limit: 3 });
        if (response.success) {
          setGoals(response.data);
        }
      } catch (error) {
        console.error('Error loading goals:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGoals();
  }, []);

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
              {loading ? 'Loading...' : `${goals.length} active goals`}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/goals')}
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
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading goals...</p>
            </div>
          ) : goals.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No goals yet</p>
              <p className="text-xs text-gray-400">Create your first goal to get started</p>
            </div>
          ) : (
            goals.map((goal, index) => (
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
          ))
          )}
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
