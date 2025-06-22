import React from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import type { Goal } from '../../types';
import { formatDate, getDaysUntilDeadline, isOverdue, isUpcoming } from '../../utils';

interface GoalTimelineProps {
  goals: Goal[];
}

export default function GoalTimeline({ goals }: GoalTimelineProps) {
  const goalsWithDeadlines = goals
    .filter(goal => goal.deadline)
    .sort((a, b) => a.deadline!.getTime() - b.deadline!.getTime());

  const upcomingGoals = goalsWithDeadlines.filter(goal => 
    goal.deadline && isUpcoming(goal.deadline, 30) // Next 30 days
  );

  const overdueGoals = goalsWithDeadlines.filter(goal => 
    goal.deadline && isOverdue(goal.deadline) && goal.status !== 'completed'
  );

  const completedGoals = goalsWithDeadlines.filter(goal => 
    goal.status === 'completed'
  );

  if (goalsWithDeadlines.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          No goals with deadlines set
        </p>
      </div>
    );
  }

  const TimelineItem = ({ goal, isOverdue: overdue, isCompleted }: { 
    goal: Goal; 
    isOverdue?: boolean; 
    isCompleted?: boolean; 
  }) => {
    const daysUntil = goal.deadline ? getDaysUntilDeadline(goal.deadline) : 0;
    
    return (
      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isCompleted 
            ? 'bg-green-100 dark:bg-green-900/20' 
            : overdue 
            ? 'bg-red-100 dark:bg-red-900/20' 
            : 'bg-blue-100 dark:bg-blue-900/20'
        }`}>
          {isCompleted ? (
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          ) : overdue ? (
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          ) : (
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {goal.title}
            </h4>
            <span 
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: goal.category.color }}
            />
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{goal.category.icon} {goal.category.name}</span>
            <span>•</span>
            <span className={`font-medium ${
              isCompleted 
                ? 'text-green-600 dark:text-green-400' 
                : overdue 
                ? 'text-red-600 dark:text-red-400' 
                : daysUntil <= 7 
                ? 'text-yellow-600 dark:text-yellow-400' 
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {isCompleted 
                ? 'Completed' 
                : overdue 
                ? `Overdue by ${Math.abs(daysUntil)} days`
                : daysUntil === 0 
                ? 'Due today' 
                : daysUntil === 1 
                ? 'Due tomorrow' 
                : `Due in ${daysUntil} days`
              }
            </span>
          </div>
          
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {formatDate(goal.deadline!)}
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            goal.priority === 'urgent' 
              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' 
              : goal.priority === 'high' 
              ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' 
              : goal.priority === 'medium' 
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' 
              : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
          }`}>
            {goal.priority}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overdue Goals */}
      {overdueGoals.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <h4 className="text-sm font-semibold text-red-700 dark:text-red-400">
              Overdue ({overdueGoals.length})
            </h4>
          </div>
          <div className="space-y-1">
            {overdueGoals.map(goal => (
              <TimelineItem key={goal.id} goal={goal} isOverdue={true} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Goals */}
      {upcomingGoals.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="h-4 w-4 text-blue-500" />
            <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400">
              Upcoming ({upcomingGoals.length})
            </h4>
          </div>
          <div className="space-y-1">
            {upcomingGoals.map(goal => (
              <TimelineItem key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      )}

      {/* Recently Completed */}
      {completedGoals.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <h4 className="text-sm font-semibold text-green-700 dark:text-green-400">
              Recently Completed ({completedGoals.slice(0, 3).length})
            </h4>
          </div>
          <div className="space-y-1">
            {completedGoals.slice(0, 3).map(goal => (
              <TimelineItem key={goal.id} goal={goal} isCompleted={true} />
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-red-600 dark:text-red-400">
              {overdueGoals.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Overdue
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {upcomingGoals.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Upcoming
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {completedGoals.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Completed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
