import React, { useState } from 'react';
import { Brain, Star, Target, TrendingUp, Calendar, Plus } from 'lucide-react';
import { useApp, useGoals } from '../../context/AppContext';
import { getRandomQuote, calculateProgress } from '../../utils';

export default function WeeklyReviewPage() {
  const { state } = useApp();
  const { goals } = useGoals();
  const [showNewReview, setShowNewReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    winOfTheWeek: '',
    challenges: '',
    nextWeekFocus: [] as string[],
    reflections: '',
  });

  const motivationalQuote = getRandomQuote();
  const activeGoals = goals.filter(g => g.status === 'active');
  const completedThisWeek = goals.filter(g => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return g.status === 'completed' && g.updatedAt > weekAgo;
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would save the review to your data store
    console.log('Saving weekly review:', reviewForm);
    setShowNewReview(false);
    setReviewForm({
      winOfTheWeek: '',
      challenges: '',
      nextWeekFocus: [],
      reflections: '',
    });
  };

  const addFocusGoal = (goalId: string) => {
    if (!reviewForm.nextWeekFocus.includes(goalId)) {
      setReviewForm(prev => ({
        ...prev,
        nextWeekFocus: [...prev.nextWeekFocus, goalId],
      }));
    }
  };

  const removeFocusGoal = (goalId: string) => {
    setReviewForm(prev => ({
      ...prev,
      nextWeekFocus: prev.nextWeekFocus.filter(id => id !== goalId),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Weekly Review</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Reflect on your progress and plan ahead
          </p>
        </div>
        <button
          onClick={() => setShowNewReview(true)}
          className="mt-4 sm:mt-0 inline-flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>New Review</span>
        </button>
      </div>

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-6 w-6" />
          <h3 className="text-lg font-semibold">Weekly Inspiration</h3>
        </div>
        <blockquote className="text-lg italic mb-2">
          "{motivationalQuote.text}"
        </blockquote>
        <cite className="text-purple-200">— {motivationalQuote.author}</cite>
      </div>

      {/* This Week's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Goals Completed
              </h3>
            </div>
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            {completedThisWeek.length}
          </div>
          <div className="space-y-2">
            {completedThisWeek.slice(0, 3).map(goal => (
              <div key={goal.id} className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: goal.category.color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {goal.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Average Progress
              </h3>
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {activeGoals.length > 0 
              ? Math.round(activeGoals.reduce((sum, goal) => sum + calculateProgress(goal), 0) / activeGoals.length)
              : 0}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Across {activeGoals.length} active goals
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Focus Score
              </h3>
            </div>
          </div>
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
            {Math.round(Math.random() * 40 + 60)} {/* Placeholder calculation */}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Based on consistency
          </div>
        </div>
      </div>

      {/* Goal Progress Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Goal Progress This Week
        </h3>
        <div className="space-y-4">
          {activeGoals.slice(0, 5).map(goal => {
            const progress = calculateProgress(goal);
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: goal.category.color }}
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {goal.title}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {progress.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: goal.category.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reflection Prompts */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Weekly Reflection Prompts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                🎉 What went well this week?
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Celebrate your wins, no matter how small. What progress are you proud of?
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                🎯 What would you do differently?
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Learning opportunities and areas for improvement in your approach.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
                🚀 What are your top 3 priorities for next week?
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Focus on the most important goals that will move you forward.
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
                💡 What did you learn about yourself?
              </h4>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Insights about your habits, preferences, and working style.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* New Review Modal */}
      {showNewReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Weekly Review
                </h3>
                <button
                  onClick={() => setShowNewReview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    🏆 Win of the Week
                  </label>
                  <textarea
                    value={reviewForm.winOfTheWeek}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, winOfTheWeek: e.target.value }))}
                    rows={3}
                    placeholder="What's your biggest accomplishment this week?"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    🤔 Challenges & Learnings
                  </label>
                  <textarea
                    value={reviewForm.challenges}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, challenges: e.target.value }))}
                    rows={3}
                    placeholder="What challenges did you face? What did you learn?"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    🎯 Next Week's Focus Goals
                  </label>
                  <div className="space-y-2 mb-3">
                    {reviewForm.nextWeekFocus.map(goalId => {
                      const goal = goals.find(g => g.id === goalId);
                      return goal ? (
                        <div key={goalId} className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: goal.category.color }}
                            />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {goal.title}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFocusGoal(goalId)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {activeGoals
                      .filter(goal => !reviewForm.nextWeekFocus.includes(goal.id))
                      .slice(0, 5)
                      .map(goal => (
                        <button
                          key={goal.id}
                          type="button"
                          onClick={() => addFocusGoal(goal.id)}
                          className="flex items-center space-x-2 p-2 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: goal.category.color }}
                          />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {goal.title}
                          </span>
                        </button>
                      ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    💭 Additional Reflections
                  </label>
                  <textarea
                    value={reviewForm.reflections}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, reflections: e.target.value }))}
                    rows={4}
                    placeholder="Any other thoughts, insights, or plans for next week?"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewReview(false)}
                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Save Review
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
