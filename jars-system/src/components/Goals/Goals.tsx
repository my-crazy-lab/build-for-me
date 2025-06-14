import React, { useState } from 'react';
import { Plus, Target, Calendar, DollarSign, CheckCircle, Trash2 } from 'lucide-react';
import { useJars } from '../../context/JarsContext';
import { useAuth } from '../../context/AuthContext';
import { getJarInfo, formatCurrency } from '../../utils/jarCalculations';
import { type JarAllocations } from '../../types';

const Goals: React.FC = () => {
  const { goals, addGoal, updateGoal } = useJars();
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    jarId: 'longterm' as keyof JarAllocations,
    targetDate: '',
  });

  const jars = getJarInfo(user?.preferences.language);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.targetAmount || !formData.targetDate) {
      return;
    }

    addGoal({
      title: formData.title,
      description: formData.description,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: 0,
      jarId: formData.jarId,
      targetDate: new Date(formData.targetDate),
    });

    setFormData({
      title: '',
      description: '',
      targetAmount: '',
      jarId: 'longterm',
      targetDate: '',
    });
    setShowAddForm(false);
  };

  const handleToggleComplete = (goalId: string, isCompleted: boolean) => {
    updateGoal(goalId, { isCompleted: !isCompleted });
  };

  const activeGoals = goals.filter(goal => !goal.isCompleted);
  const completedGoals = goals.filter(goal => goal.isCompleted);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Financial Goals</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Set and track your financial objectives
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Goal
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="jar-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Active Goals
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {activeGoals.length}
              </p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="jar-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Completed
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {completedGoals.length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="jar-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Total Target
              </h3>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(activeGoals.reduce((sum, goal) => sum + goal.targetAmount, 0))}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Add Goal Form */}
      {showAddForm && (
        <div className="jar-card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Add New Goal
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Goal Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Emergency Fund, New Car, Vacation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Amount *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    className="input-field pl-10"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  JAR Category *
                </label>
                <select
                  value={formData.jarId}
                  onChange={(e) => setFormData({ ...formData, jarId: e.target.value as keyof JarAllocations })}
                  className="input-field"
                  required
                >
                  {jars.map((jar) => (
                    <option key={jar.id} value={jar.id}>
                      {jar.icon} {jar.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    required
                    value={formData.targetDate}
                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                    className="input-field pl-10"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                rows={3}
                placeholder="Describe your goal and why it's important to you..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Add Goal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div className="jar-card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Active Goals
          </h3>
          <div className="space-y-4">
            {activeGoals.map((goal) => {
              const jar = jars.find(j => j.id === goal.jarId);
              const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
              const daysLeft = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={goal.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{jar?.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {goal.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {jar?.name} • Target: {new Date(goal.targetDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleToggleComplete(goal.id, goal.isCompleted)}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {goal.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {goal.description}
                    </p>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress:</span>
                      <span className="font-medium">
                        {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{progress.toFixed(1)}% complete</span>
                      <span>
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="jar-card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Completed Goals
          </h3>
          <div className="space-y-3">
            {completedGoals.map((goal) => {
              const jar = jars.find(j => j.id === goal.jarId);
              
              return (
                <div key={goal.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {goal.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {jar?.name} • {formatCurrency(goal.targetAmount)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleComplete(goal.id, goal.isCompleted)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Reactivate
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="jar-card text-center py-12">
          <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No goals yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start by setting your first financial goal to stay motivated and track your progress.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            Create Your First Goal
          </button>
        </div>
      )}
    </div>
  );
};

export default Goals;
