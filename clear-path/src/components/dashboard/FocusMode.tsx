import React, { useState } from 'react';
import { Focus, Play, Pause, Square, Clock } from 'lucide-react';
import { useApp, useFocusSession } from '../../context/AppContext';

export default function FocusMode() {
  const { state } = useApp();
  const { focusSession, startFocusSession, endFocusSession } = useFocusSession();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [showGoalSelection, setShowGoalSelection] = useState(false);

  const activeGoals = state.goals.filter(g => g.status === 'active');

  const handleStartFocus = () => {
    if (selectedGoals.length > 0) {
      startFocusSession(selectedGoals);
      setShowGoalSelection(false);
      setSelectedGoals([]);
    }
  };

  const handleEndFocus = () => {
    endFocusSession();
  };

  const toggleGoalSelection = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const focusedGoals = focusSession 
    ? state.goals.filter(g => focusSession.goalIds.includes(g.id))
    : [];

  const sessionDuration = focusSession 
    ? Math.floor((new Date().getTime() - focusSession.startTime.getTime()) / 1000 / 60)
    : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2 mb-4">
        <Focus className="h-5 w-5 text-purple-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Focus Mode
        </h3>
      </div>

      {!focusSession ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Select 1-3 goals to focus on and eliminate distractions.
          </p>

          {!showGoalSelection ? (
            <button
              onClick={() => setShowGoalSelection(true)}
              className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Play className="h-4 w-4" />
              <span>Start Focus Session</span>
            </button>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Goals (max 3):
                </h4>
                {activeGoals.slice(0, 5).map(goal => (
                  <label key={goal.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedGoals.includes(goal.id)}
                      onChange={() => toggleGoalSelection(goal.id)}
                      disabled={!selectedGoals.includes(goal.id) && selectedGoals.length >= 3}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="flex items-center space-x-2 flex-1">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: goal.category.color }}
                      />
                      <span className="text-sm text-gray-900 dark:text-white truncate">
                        {goal.title}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleStartFocus}
                  disabled={selectedGoals.length === 0}
                  className="flex-1 bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Start
                </button>
                <button
                  onClick={() => {
                    setShowGoalSelection(false);
                    setSelectedGoals([]);
                  }}
                  className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Focus session active
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Focused Goals:
            </h4>
            {focusedGoals.map(goal => (
              <div key={goal.id} className="flex items-center space-x-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: goal.category.color }}
                />
                <span className="text-sm text-gray-900 dark:text-white truncate">
                  {goal.title}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={handleEndFocus}
            className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Square className="h-4 w-4" />
            <span>End Focus Session</span>
          </button>
        </div>
      )}
    </div>
  );
}
