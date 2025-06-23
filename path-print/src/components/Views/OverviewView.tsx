/**
 * Career Path Visualization - Overview View Component
 * 
 * This component provides a comprehensive dashboard overview of the user's
 * career journey with key metrics and highlights.
 * 
 * @fileoverview Overview dashboard with career highlights and metrics
 * @author Career Path Visualization Team
 * @version 1.0.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Briefcase, 
  TrendingUp, 
  Target, 
  Calendar,
  MapPin,
  Award,
  Clock
} from 'lucide-react';
import type { CareerData } from '../../types';
import { useAppContext } from '../Layout/AppLayout';

// ============================================================================
// INTERFACES
// ============================================================================

interface OverviewViewProps {
  className?: string;
}

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate career duration in years
 */
function calculateCareerDuration(milestones: any[]): number {
  if (milestones.length === 0) return 0;
  
  const sortedMilestones = [...milestones].sort((a, b) => 
    new Date(a.dateRange.start).getTime() - new Date(b.dateRange.start).getTime()
  );
  
  const firstMilestone = sortedMilestones[0];
  const lastMilestone = sortedMilestones[sortedMilestones.length - 1];
  
  const start = new Date(firstMilestone.dateRange.start);
  const end = lastMilestone.dateRange.end 
    ? new Date(lastMilestone.dateRange.end)
    : new Date();
  
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365));
}

/**
 * Get current position from milestones
 */
function getCurrentPosition(milestones: any[]): any | null {
  return milestones.find(milestone => !milestone.dateRange.end) || 
         milestones[milestones.length - 1] || 
         null;
}

// ============================================================================
// PROFILE CARD COMPONENT
// ============================================================================

interface ProfileCardProps {
  profile: any;
  currentPosition: any;
  careerDuration: number;
}

function ProfileCard({ profile, currentPosition, careerDuration }: ProfileCardProps): JSX.Element {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white"
    >
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-16 h-16 rounded-full border-4 border-white/20"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-1">{profile.name}</h2>
          <p className="text-blue-100 text-lg mb-2">{profile.title}</p>
          <p className="text-blue-100 text-sm leading-relaxed mb-4">
            {profile.bio}
          </p>

          {/* Current Position */}
          {currentPosition && (
            <div className="bg-white/10 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2 mb-1">
                <Briefcase size={16} />
                <span className="font-semibold">Current Position</span>
              </div>
              <p className="text-sm">{currentPosition.title} at {currentPosition.organization}</p>
              {currentPosition.location && (
                <div className="flex items-center space-x-1 mt-1">
                  <MapPin size={12} />
                  <span className="text-xs">{currentPosition.location}</span>
                </div>
              )}
            </div>
          )}

          {/* Career Stats */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{careerDuration} years experience</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// STATS GRID COMPONENT
// ============================================================================

interface StatsGridProps {
  careerData: CareerData;
}

function StatsGrid({ careerData }: StatsGridProps): JSX.Element {
  const milestones = careerData.milestones || [];
  const skills = careerData.skills || [];
  const goals = careerData.goals || [];

  const stats = [
    {
      icon: Briefcase,
      label: 'Career Milestones',
      value: milestones.length,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: TrendingUp,
      label: 'Skills Tracked',
      value: skills.length,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: Award,
      label: 'Expert Skills',
      value: skills.filter(skill => skill.level >= 4).length,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      icon: Target,
      label: 'Active Goals',
      value: goals.filter(goal => goal.progress < 100).length,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          variants={itemVariants}
          className={`${stat.bgColor} rounded-lg p-4 text-center`}
        >
          <stat.icon size={32} className={`mx-auto ${stat.color} mb-2`} />
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================================
// RECENT MILESTONES COMPONENT
// ============================================================================

interface RecentMilestonesProps {
  milestones: any[];
}

function RecentMilestones({ milestones }: RecentMilestonesProps): JSX.Element {
  const recentMilestones = [...milestones]
    .sort((a, b) => new Date(b.dateRange.start).getTime() - new Date(a.dateRange.start).getTime())
    .slice(0, 3);

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Recent Milestones
      </h3>
      
      <div className="space-y-4">
        {recentMilestones.map((milestone) => (
          <div key={milestone.id} className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                {milestone.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {milestone.organization}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {new Date(milestone.dateRange.start).toLocaleDateString()} - {' '}
                {milestone.dateRange.end 
                  ? new Date(milestone.dateRange.end).toLocaleDateString()
                  : 'Present'
                }
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================================================
// UPCOMING GOALS COMPONENT
// ============================================================================

interface UpcomingGoalsProps {
  goals: any[];
}

function UpcomingGoals({ goals }: UpcomingGoalsProps): JSX.Element {
  const upcomingGoals = [...goals]
    .filter(goal => goal.progress < 100)
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
    .slice(0, 3);

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Upcoming Goals
      </h3>
      
      <div className="space-y-4">
        {upcomingGoals.map((goal) => {
          const daysUntil = Math.ceil(
            (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );
          
          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-start justify-between">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex-1">
                  {goal.title}
                </h4>
                <span className="text-xs text-gray-500 dark:text-gray-500 ml-2">
                  {daysUntil > 0 ? `${daysUntil} days` : 'Overdue'}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(goal.progress, 100)}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>{goal.progress}% complete</span>
                <span className={`px-2 py-1 rounded-full text-white ${
                  goal.priority === 'critical' ? 'bg-red-500' :
                  goal.priority === 'high' ? 'bg-orange-500' :
                  goal.priority === 'medium' ? 'bg-blue-500' : 'bg-gray-500'
                }`}>
                  {goal.priority}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Overview view component
 */
export function OverviewView({ className = '' }: OverviewViewProps): JSX.Element {
  const { careerData } = useAppContext();

  if (!careerData) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <User size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No career data available</p>
        </div>
      </div>
    );
  }

  const milestones = careerData.milestones || [];
  const currentPosition = getCurrentPosition(milestones);
  const careerDuration = calculateCareerDuration(milestones);

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={`max-w-7xl mx-auto space-y-6 ${className}`}
    >
      {/* Profile Card */}
      <ProfileCard
        profile={careerData.profile}
        currentPosition={currentPosition}
        careerDuration={careerDuration}
      />

      {/* Stats Grid */}
      <StatsGrid careerData={careerData} />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentMilestones milestones={milestones} />
        <UpcomingGoals goals={careerData.goals || []} />
      </div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          Explore Your Career
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Use the navigation menu to explore different views of your career journey:
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Clock size={24} className="mx-auto text-blue-500 mb-2" />
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Timeline</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Chronological view</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <MapPin size={24} className="mx-auto text-green-500 mb-2" />
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Career Map</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Interactive journey</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <TrendingUp size={24} className="mx-auto text-purple-500 mb-2" />
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Skills Radar</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Skill proficiency</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Target size={24} className="mx-auto text-orange-500 mb-2" />
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Progress</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Goals & metrics</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
