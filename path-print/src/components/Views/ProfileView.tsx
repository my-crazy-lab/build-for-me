/**
 * Career Path Visualization - Profile View Component
 * 
 * This component provides a comprehensive profile management interface
 * for viewing and editing personal and professional information.
 * 
 * @fileoverview Profile management and contact information
 * @author Career Path Visualization Team
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Globe, 
  Github, 
  Linkedin, 
  MapPin, 
  Edit3, 
  Save,
  X,
  Camera,
  Briefcase,
  Calendar,
  Award,
  TrendingUp
} from 'lucide-react';
import type { CareerData } from '../../types';
import { useAppContext } from '../Layout/AppLayout';

// ============================================================================
// INTERFACES
// ============================================================================

interface ProfileViewProps {
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
 * Calculate career statistics
 */
function calculateCareerStats(careerData: CareerData) {
  const milestones = careerData.milestones || [];
  const skills = careerData.skills || [];
  const goals = careerData.goals || [];

  // Calculate years of experience
  const sortedMilestones = [...milestones].sort((a, b) => 
    new Date(a.dateRange.start).getTime() - new Date(b.dateRange.start).getTime()
  );
  
  let yearsExperience = 0;
  if (sortedMilestones.length > 0) {
    const firstMilestone = sortedMilestones[0];
    const lastMilestone = sortedMilestones[sortedMilestones.length - 1];
    const start = new Date(firstMilestone.dateRange.start);
    const end = lastMilestone.dateRange.end 
      ? new Date(lastMilestone.dateRange.end)
      : new Date();
    yearsExperience = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365));
  }

  // Calculate skill distribution
  const skillsByCategory = skills.reduce((acc, skill) => {
    acc[skill.category] = (acc[skill.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate goal completion rate
  const completedGoals = goals.filter(goal => goal.progress >= 100).length;
  const goalCompletionRate = goals.length > 0 ? (completedGoals / goals.length) * 100 : 0;

  return {
    yearsExperience,
    totalMilestones: milestones.length,
    totalSkills: skills.length,
    expertSkills: skills.filter(skill => skill.level >= 4).length,
    skillsByCategory,
    totalGoals: goals.length,
    completedGoals,
    goalCompletionRate
  };
}

// ============================================================================
// CONTACT CARD COMPONENT
// ============================================================================

interface ContactCardProps {
  contact: any;
}

function ContactCard({ contact }: ContactCardProps): React.JSX.Element {
  const contactItems = [
    { icon: Mail, label: 'Email', value: contact?.email, href: `mailto:${contact?.email}` },
    { icon: Linkedin, label: 'LinkedIn', value: contact?.linkedin, href: contact?.linkedin },
    { icon: Github, label: 'GitHub', value: contact?.github, href: contact?.github },
    { icon: Globe, label: 'Website', value: contact?.website, href: contact?.website }
  ].filter(item => item.value);

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Contact Information
      </h3>
      
      <div className="space-y-3">
        {contactItems.map((item) => (
          <div key={item.label} className="flex items-center space-x-3">
            <item.icon size={18} className="text-gray-500 dark:text-gray-400" />
            <div className="flex-1">
              <div className="text-sm text-gray-600 dark:text-gray-400">{item.label}</div>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {item.value}
              </a>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================================================
// STATS CARD COMPONENT
// ============================================================================

interface StatsCardProps {
  stats: ReturnType<typeof calculateCareerStats>;
}

function StatsCard({ stats }: StatsCardProps): React.JSX.Element {
  const statItems = [
    { icon: Calendar, label: 'Years Experience', value: stats.yearsExperience, color: 'text-blue-500' },
    { icon: Briefcase, label: 'Career Milestones', value: stats.totalMilestones, color: 'text-green-500' },
    { icon: TrendingUp, label: 'Skills Tracked', value: stats.totalSkills, color: 'text-purple-500' },
    { icon: Award, label: 'Expert Skills', value: stats.expertSkills, color: 'text-orange-500' }
  ];

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Career Statistics
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item) => (
          <div key={item.label} className="text-center">
            <item.icon size={24} className={`mx-auto ${item.color} mb-2`} />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {item.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Goal Completion Rate */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Goal Completion Rate
          </span>
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {stats.goalCompletionRate.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-green-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${stats.goalCompletionRate}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Profile view component
 */
export function ProfileView({ className = '' }: ProfileViewProps): React.JSX.Element {
  const { careerData } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);

  if (!careerData) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <User size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No profile data available</p>
        </div>
      </div>
    );
  }

  const { profile } = careerData;
  const stats = calculateCareerStats(careerData);

  const handleEditProfile = () => {
    setIsEditing(true);
    // TODO: Implement profile editing
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // TODO: Implement profile saving
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // TODO: Reset form data
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={`max-w-4xl mx-auto ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your personal and professional information.
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveProfile}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save size={18} />
                <span>Save</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancelEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X size={18} />
                <span>Cancel</span>
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEditProfile}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit3 size={18} />
              <span>Edit Profile</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-8 text-white mb-8"
      >
        <div className="flex items-start space-x-6">
          {/* Avatar */}
          <div className="relative">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-24 h-24 rounded-full border-4 border-white/20"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                <User size={40} className="text-white" />
              </div>
            )}
            {isEditing && (
              <button className="absolute bottom-0 right-0 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <Camera size={16} />
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{profile.name}</h2>
            <p className="text-blue-100 text-xl mb-4">{profile.title}</p>
            <p className="text-blue-100 leading-relaxed">
              {profile.bio}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <ContactCard contact={profile.contact} />

        {/* Career Statistics */}
        <StatsCard stats={stats} />
      </div>

      {/* Skills by Category */}
      <motion.div
        variants={itemVariants}
        className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          Skills by Category
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(stats.skillsByCategory).map(([category, count]) => (
            <div key={category} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {count}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {category}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        variants={itemVariants}
        className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          Recent Activity
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Profile last updated</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {careerData.metadata?.lastUpdated || 'Recently'}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Data version</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {careerData.metadata?.version || '1.0.0'}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Data source</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {careerData.metadata?.dataSource || 'JSON'}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
