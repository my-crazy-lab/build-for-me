import React, { useMemo } from 'react';
import { 
  Target, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Calendar,
  Focus,
  BarChart3
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateDashboardStats, getTimeAllocationData, getProgressData, getRandomQuote } from '../../utils';
import TimeAllocationChart from './TimeAllocationChart';
import ProgressChart from './ProgressChart';
import GoalTimeline from './GoalTimeline';
import FocusMode from './FocusMode';
import QuickStats from './QuickStats';

export default function DashboardPage() {
  const { state } = useApp();
  const { goals, timeEntries, user } = state;

  const stats = useMemo(() => calculateDashboardStats(goals, timeEntries), [goals, timeEntries]);
  const timeAllocationData = useMemo(() => getTimeAllocationData(goals), [goals]);
  const progressData = useMemo(() => getProgressData(goals.filter(g => g.status === 'active')), [goals]);
  const motivationalQuote = useMemo(() => getRandomQuote(), []);

  const activeGoals = goals.filter(g => g.status === 'active');
  const recentGoals = goals
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white animate-slide-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 animate-slide-in-right">
              Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
            </h1>
            <p className="text-blue-100 mb-4 animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
              Here's your progress overview for today
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-md animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
              <p className="text-sm italic mb-2">"{motivationalQuote.text}"</p>
              <p className="text-xs text-blue-200">— {motivationalQuote.author}</p>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 animate-float">
              <Target className="h-12 w-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats stats={stats} />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Goal Progress
              </h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            {progressData.length > 0 ? (
              <ProgressChart data={progressData} />
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No active goals to display
                </p>
              </div>
            )}
          </div>

          {/* Time Allocation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Time Allocation by Category
              </h3>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            {timeAllocationData.length > 0 ? (
              <TimeAllocationChart data={timeAllocationData} />
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No time data to display
                </p>
              </div>
            )}
          </div>

          {/* Goal Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upcoming Deadlines
              </h3>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <GoalTimeline goals={goals} />
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Focus Mode */}
          <FocusMode />

          {/* Alerts & Warnings */}
          {(stats.overloadedGoals.length > 0 || stats.neglectedGoals.length > 0 || stats.upcomingDeadlines.length > 0) && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Alerts
                </h3>
              </div>
              <div className="space-y-3">
                {stats.upcomingDeadlines.length > 0 && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Upcoming Deadlines
                      </span>
                    </div>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      {stats.upcomingDeadlines.length} goal(s) due this week
                    </p>
                  </div>
                )}

                {stats.overloadedGoals.length > 0 && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center space-x-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800 dark:text-red-200">
                        Overloaded Schedule
                      </span>
                    </div>
                    <p className="text-xs text-red-700 dark:text-red-300">
                      {stats.overloadedGoals.length} goal(s) need attention
                    </p>
                  </div>
                )}

                {stats.neglectedGoals.length > 0 && (
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                        Neglected Goals
                      </span>
                    </div>
                    <p className="text-xs text-orange-700 dark:text-orange-300">
                      {stats.neglectedGoals.length} goal(s) haven't been worked on recently
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Goals
              </h3>
            </div>
            <div className="space-y-3">
              {recentGoals.length > 0 ? (
                recentGoals.map(goal => (
                  <div key={goal.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: goal.category.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {goal.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {goal.category.icon} {goal.category.name}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {goal.status === 'completed' && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        goal.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                        goal.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                        goal.status === 'paused' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                      }`}>
                        {goal.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No recent activity
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span className="text-sm font-medium">Create New Goal</span>
                </div>
              </button>
              <button className="w-full text-left p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Start Time Tracking</span>
                </div>
              </button>
              <button className="w-full text-left p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                <div className="flex items-center space-x-2">
                  <Focus className="h-4 w-4" />
                  <span className="text-sm font-medium">Enter Focus Mode</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
