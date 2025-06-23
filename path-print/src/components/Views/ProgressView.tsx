/**
 * Career Path Visualization - Progress View Component
 * 
 * This component displays skills and goals progress using animated progress bars
 * and achievement tracking.
 * 
 * @fileoverview Progress bars and achievement tracking visualization
 * @author Career Path Visualization Team
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Target, TrendingUp, Award, Calendar, CheckCircle } from 'lucide-react';
import type { CareerData, Skill, Goal } from '../../types';
import { useAppContext } from '../Layout/AppLayout';

// ============================================================================
// INTERFACES
// ============================================================================

interface ProgressViewProps {
  className?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get color for skill level
 */
function getSkillLevelColor(level: number): string {
  const colors = {
    1: 'bg-red-500',
    2: 'bg-orange-500',
    3: 'bg-yellow-500',
    4: 'bg-green-500',
    5: 'bg-blue-500'
  };
  return colors[level as keyof typeof colors] || 'bg-gray-500';
}

/**
 * Get color for goal priority
 */
function getGoalPriorityColor(priority: string): string {
  const colors = {
    low: 'bg-gray-500',
    medium: 'bg-blue-500',
    high: 'bg-orange-500',
    critical: 'bg-red-500'
  };
  return colors[priority as keyof typeof colors] || 'bg-gray-500';
}

/**
 * Calculate days until target date
 */
function getDaysUntilTarget(targetDate: string): number {
  const target = new Date(targetDate);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// ============================================================================
// SKILL PROGRESS COMPONENT
// ============================================================================

interface SkillProgressProps {
  skills: Skill[];
}

function SkillProgress({ skills }: SkillProgressProps): JSX.Element {
  const [sortBy, setSortBy] = useState<'name' | 'level' | 'category'>('level');
  
  const sortedSkills = [...skills].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'level':
        return b.level - a.level;
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  const levelLabels = ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Skills Progress
        </h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'level' | 'category')}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
        >
          <option value="level">Sort by Level</option>
          <option value="name">Sort by Name</option>
          <option value="category">Sort by Category</option>
        </select>
      </div>

      <div className="space-y-4">
        {sortedSkills.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {skill.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {skill.category}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {skill.level}/5
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {levelLabels[skill.level]}
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <motion.div
                  className={`h-3 rounded-full ${getSkillLevelColor(skill.level)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(skill.level / 5) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-white mix-blend-difference">
                  {((skill.level / 5) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// GOALS PROGRESS COMPONENT
// ============================================================================

interface GoalsProgressProps {
  goals: Goal[];
}

function GoalsProgress({ goals }: GoalsProgressProps): JSX.Element {
  const sortedGoals = [...goals].sort((a, b) => {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Goals Progress
      </h2>

      <div className="space-y-6">
        {sortedGoals.map((goal, index) => {
          const daysUntil = getDaysUntilTarget(goal.targetDate);
          const isOverdue = daysUntil < 0;
          const isCompleted = goal.progress >= 100;

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {goal.title}
                    </h3>
                    {isCompleted && (
                      <CheckCircle size={16} className="text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {goal.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>
                        {isOverdue ? `${Math.abs(daysUntil)} days overdue` : 
                         daysUntil === 0 ? 'Due today' :
                         `${daysUntil} days left`}
                      </span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-white text-xs ${getGoalPriorityColor(goal.priority)}`}>
                      {goal.priority}
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {goal.progress}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative mb-3">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <motion.div
                    className={`h-4 rounded-full ${
                      isCompleted ? 'bg-green-500' :
                      isOverdue ? 'bg-red-500' :
                      getGoalPriorityColor(goal.priority)
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(goal.progress, 100)}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </div>

              {/* Steps Progress */}
              {goal.steps && goal.steps.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Steps ({goal.steps.filter(step => step.completed).length}/{goal.steps.length} completed)
                  </h4>
                  <div className="space-y-1">
                    {goal.steps.map((step) => (
                      <div key={step.id} className="flex items-center space-x-2 text-sm">
                        <CheckCircle 
                          size={14} 
                          className={step.completed ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'} 
                        />
                        <span className={`${step.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                          {step.title}
                        </span>
                        {step.dueDate && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            (Due: {new Date(step.dueDate).toLocaleDateString()})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Progress view component
 */
export function ProgressView({ className = '' }: ProgressViewProps): JSX.Element {
  const { careerData } = useAppContext();

  if (!careerData) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No career data available</p>
        </div>
      </div>
    );
  }

  const skills = careerData.skills || [];
  const goals = careerData.goals || [];

  // Calculate statistics
  const avgSkillLevel = skills.length > 0 
    ? skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length 
    : 0;
  
  const completedGoals = goals.filter(goal => goal.progress >= 100).length;
  const avgGoalProgress = goals.length > 0
    ? goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length
    : 0;

  return (
    <div className={`max-w-7xl mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Progress Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Track your skill development and goal achievement progress with detailed metrics and visual indicators.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center"
        >
          <TrendingUp size={32} className="mx-auto text-blue-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {avgSkillLevel.toFixed(1)}/5
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">Avg Skill Level</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center"
        >
          <Award size={32} className="mx-auto text-green-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {skills.filter(skill => skill.level >= 4).length}
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">Expert Skills</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center"
        >
          <Target size={32} className="mx-auto text-purple-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {completedGoals}/{goals.length}
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">Goals Completed</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center"
        >
          <BarChart3 size={32} className="mx-auto text-orange-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {avgGoalProgress.toFixed(0)}%
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">Avg Goal Progress</div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skills Progress */}
        <SkillProgress skills={skills} />

        {/* Goals Progress */}
        <GoalsProgress goals={goals} />
      </div>
    </div>
  );
}
