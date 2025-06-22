import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock, Plus, Calendar } from 'lucide-react';
import { useApp, useGoals, useTimeTracking } from '../../context/AppContext';
import { formatDuration, getWeeklyTimeData } from '../../utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TimeTrackingPage() {
  const { state } = useApp();
  const { goals } = useGoals();
  const { timeEntries, addTimeEntry } = useTimeTracking();
  const [activeTimer, setActiveTimer] = useState<{
    goalId: string;
    startTime: Date;
    description: string;
  } | null>(null);
  const [timerDuration, setTimerDuration] = useState(0);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualEntry, setManualEntry] = useState({
    goalId: '',
    duration: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Update timer duration every second
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTimer) {
      interval = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now.getTime() - activeTimer.startTime.getTime()) / 1000);
        setTimerDuration(duration);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

  const activeGoals = goals.filter(g => g.status === 'active');
  const weeklyData = getWeeklyTimeData(timeEntries);

  const startTimer = (goalId: string) => {
    setActiveTimer({
      goalId,
      startTime: new Date(),
      description: '',
    });
    setTimerDuration(0);
  };

  const stopTimer = () => {
    if (activeTimer && timerDuration > 0) {
      const minutes = Math.floor(timerDuration / 60);
      addTimeEntry(activeTimer.goalId, minutes, activeTimer.description || 'Time tracking session');
    }
    setActiveTimer(null);
    setTimerDuration(0);
  };

  const handleManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualEntry.goalId && manualEntry.duration) {
      const minutes = parseInt(manualEntry.duration);
      addTimeEntry(manualEntry.goalId, minutes, manualEntry.description);
      setManualEntry({
        goalId: '',
        duration: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      setShowManualEntry(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const todayEntries = timeEntries.filter(entry => {
    const today = new Date();
    const entryDate = new Date(entry.date);
    return entryDate.toDateString() === today.toDateString();
  });

  const todayTotal = todayEntries.reduce((sum, entry) => sum + entry.duration, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Time Tracking</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track time spent on your goals
          </p>
        </div>
        <button
          onClick={() => setShowManualEntry(true)}
          className="mt-4 sm:mt-0 inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Manual Entry</span>
        </button>
      </div>

      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Today's Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatDuration(todayTotal)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sessions Today</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {todayEntries.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Play className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Timer</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeTimer ? formatTime(timerDuration) : '--:--:--'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timer Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Timer
          </h3>

          {!activeTimer ? (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Select a goal to start tracking time:
              </p>
              <div className="space-y-2">
                {activeGoals.slice(0, 5).map(goal => (
                  <button
                    key={goal.id}
                    onClick={() => startTimer(goal.id)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: goal.category.color }}
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {goal.title}
                      </span>
                    </div>
                    <Play className="h-4 w-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-mono font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {formatTime(timerDuration)}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Tracking: {goals.find(g => g.id === activeTimer.goalId)?.title}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={activeTimer.description}
                  onChange={(e) => setActiveTimer(prev => prev ? { ...prev, description: e.target.value } : null)}
                  placeholder="What are you working on?"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <button
                onClick={stopTimer}
                className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Square className="h-5 w-5" />
                <span>Stop Timer</span>
              </button>
            </div>
          )}
        </div>

        {/* Weekly Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            This Week's Activity
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--tw-bg-opacity)',
                    border: '1px solid var(--tw-border-opacity)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Time Entries
        </h3>
        <div className="space-y-3">
          {timeEntries.slice(0, 10).map(entry => {
            const goal = goals.find(g => g.id === entry.goalId);
            return (
              <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: goal?.category.color || '#gray' }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {goal?.title || 'Unknown Goal'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {entry.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDuration(entry.duration)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(entry.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Entry Modal */}
      {showManualEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Add Manual Time Entry
              </h3>
              <form onSubmit={handleManualEntry} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Goal
                  </label>
                  <select
                    value={manualEntry.goalId}
                    onChange={(e) => setManualEntry(prev => ({ ...prev, goalId: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select a goal</option>
                    {goals.map(goal => (
                      <option key={goal.id} value={goal.id}>
                        {goal.category.icon} {goal.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={manualEntry.duration}
                    onChange={(e) => setManualEntry(prev => ({ ...prev, duration: e.target.value }))}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={manualEntry.description}
                    onChange={(e) => setManualEntry(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="What did you work on?"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowManualEntry(false)}
                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
