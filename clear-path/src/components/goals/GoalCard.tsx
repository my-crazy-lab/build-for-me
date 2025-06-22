import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Edit3, 
  Trash2, 
  Play, 
  Pause, 
  CheckCircle,
  AlertTriangle,
  MoreVertical,
  Target
} from 'lucide-react';
import type { Goal } from '../../types';
import { formatDate, calculateProgress, getDaysUntilDeadline, isOverdue } from '../../utils';
import { useGoals } from '../../context/AppContext';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onStartTimer?: (goalId: string) => void;
}

export default function GoalCard({ goal, onEdit, onStartTimer }: GoalCardProps) {
  const { updateGoal, deleteGoal } = useGoals();
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const progress = calculateProgress(goal);
  const daysUntilDeadline = goal.deadline ? getDaysUntilDeadline(goal.deadline) : null;
  const isOverdueGoal = goal.deadline ? isOverdue(goal.deadline) : false;

  const handleStatusChange = (newStatus: Goal['status']) => {
    updateGoal({ ...goal, status: newStatus });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setTimeout(() => {
      deleteGoal(goal.id);
    }, 500);
  };

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Goal['status']) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4 text-green-600" />;
      case 'paused': return <Pause className="h-4 w-4 text-yellow-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 card-hover animate-scale-in ${
      isDeleting ? 'opacity-50 scale-95' : ''
    } ${goal.status === 'completed' ? 'opacity-75' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: goal.category.color }}
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
              {goal.title}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {goal.category.icon} {goal.category.name}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(goal.priority)}`}>
                {goal.priority}
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    onEdit(goal);
                    setShowMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Goal</span>
                </button>
                
                {onStartTimer && goal.status === 'active' && (
                  <button
                    onClick={() => {
                      onStartTimer(goal.id);
                      setShowMenu(false);
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <Clock className="h-4 w-4" />
                    <span>Start Timer</span>
                  </button>
                )}

                <div className="border-t border-gray-200 dark:border-gray-600 my-1" />
                
                <button
                  onClick={() => {
                    handleDelete();
                    setShowMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Goal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {goal.description && (
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {goal.description}
        </p>
      )}

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {goal.spentHours.toFixed(1)}h
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            of {goal.estimatedHours}h
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {goal.subtasks.filter(t => t.completed).length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            of {goal.subtasks.length} tasks
          </div>
        </div>
      </div>

      {/* Deadline */}
      {goal.deadline && (
        <div className={`flex items-center space-x-2 mb-4 p-2 rounded-lg ${
          isOverdueGoal 
            ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' 
            : daysUntilDeadline !== null && daysUntilDeadline <= 7
            ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
            : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
        }`}>
          {isOverdueGoal ? (
            <AlertTriangle className="h-4 w-4" />
          ) : (
            <Calendar className="h-4 w-4" />
          )}
          <span className="text-sm">
            {isOverdueGoal 
              ? `Overdue by ${Math.abs(daysUntilDeadline!)} days`
              : daysUntilDeadline !== null && daysUntilDeadline <= 7
              ? `Due in ${daysUntilDeadline} days`
              : `Due ${formatDate(goal.deadline)}`
            }
          </span>
        </div>
      )}

      {/* Status Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon(goal.status)}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
            {goal.status}
          </span>
        </div>

        <div className="flex space-x-1">
          {goal.status !== 'active' && (
            <button
              onClick={() => handleStatusChange('active')}
              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
            >
              Activate
            </button>
          )}
          {goal.status === 'active' && (
            <button
              onClick={() => handleStatusChange('paused')}
              className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition-colors"
            >
              Pause
            </button>
          )}
          {goal.status !== 'completed' && (
            <button
              onClick={() => handleStatusChange('completed')}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            >
              Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
