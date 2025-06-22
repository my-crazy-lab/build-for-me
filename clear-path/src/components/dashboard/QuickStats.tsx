import React from 'react';
import { Target, TrendingUp, Clock, CheckCircle, AlertTriangle, Pause } from 'lucide-react';
import type { DashboardStats } from '../../types';

interface QuickStatsProps {
  stats: DashboardStats;
}

export default function QuickStats({ stats }: QuickStatsProps) {
  const statCards = [
    {
      title: 'Total Goals',
      value: stats.totalGoals,
      icon: Target,
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      textColor: 'text-blue-900 dark:text-blue-100',
    },
    {
      title: 'Active Goals',
      value: stats.activeGoals,
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
      textColor: 'text-green-900 dark:text-green-100',
    },
    {
      title: 'Completed',
      value: stats.completedGoals,
      icon: CheckCircle,
      color: 'purple',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      textColor: 'text-purple-900 dark:text-purple-100',
    },
    {
      title: 'Hours Spent',
      value: `${stats.totalHoursSpent.toFixed(1)}h`,
      icon: Clock,
      color: 'orange',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400',
      textColor: 'text-orange-900 dark:text-orange-100',
    },
  ];

  const alertCards = [
    {
      title: 'Upcoming Deadlines',
      value: stats.upcomingDeadlines.length,
      icon: AlertTriangle,
      color: 'yellow',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      textColor: 'text-yellow-900 dark:text-yellow-100',
      show: stats.upcomingDeadlines.length > 0,
    },
    {
      title: 'Overloaded',
      value: stats.overloadedGoals.length,
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-600 dark:text-red-400',
      textColor: 'text-red-900 dark:text-red-100',
      show: stats.overloadedGoals.length > 0,
    },
    {
      title: 'Neglected',
      value: stats.neglectedGoals.length,
      icon: Pause,
      color: 'gray',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
      iconColor: 'text-gray-600 dark:text-gray-400',
      textColor: 'text-gray-900 dark:text-gray-100',
      show: stats.neglectedGoals.length > 0,
    },
  ];

  const visibleAlertCards = alertCards.filter(card => card.show);

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${stat.textColor} opacity-75`}>
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${stat.textColor} mt-1`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-white/50 dark:bg-gray-800/50`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Overall Progress
          </h3>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.averageProgress.toFixed(1)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${stats.averageProgress}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Average completion across all goals</span>
          <span>
            {stats.averageProgress >= 80 ? '🎉 Excellent!' :
             stats.averageProgress >= 60 ? '👍 Good progress' :
             stats.averageProgress >= 40 ? '⚡ Keep going' :
             '🚀 Just getting started'}
          </span>
        </div>
      </div>

      {/* Alert Cards */}
      {visibleAlertCards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {visibleAlertCards.map((alert, index) => {
            const Icon = alert.icon;
            return (
              <div
                key={index}
                className={`${alert.bgColor} rounded-xl p-4 border border-gray-200 dark:border-gray-700`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-white/50 dark:bg-gray-800/50`}>
                    <Icon className={`h-5 w-5 ${alert.iconColor}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${alert.textColor}`}>
                      {alert.title}
                    </p>
                    <p className={`text-lg font-bold ${alert.textColor}`}>
                      {alert.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
