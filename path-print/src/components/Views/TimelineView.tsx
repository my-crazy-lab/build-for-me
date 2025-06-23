/**
 * Career Path Visualization - Timeline View Component
 * 
 * This component displays career milestones in a chronological timeline format
 * with interactive elements and smooth animations.
 * 
 * @fileoverview Timeline visualization component
 * @author Career Path Visualization Team
 * @version 1.0.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';
import type { CareerData, Milestone } from '../../types';
import { useAppContext } from '../Layout/AppLayout';

// ============================================================================
// INTERFACES
// ============================================================================

interface TimelineViewProps {
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
  initial: { opacity: 0, x: -50 },
  animate: {
    opacity: 1,
    x: 0,
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
 * Format date range for display
 */
function formatDateRange(start: string, end: string | null): string {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : null;
  
  const formatOptions: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short' 
  };
  
  const startFormatted = startDate.toLocaleDateString('en-US', formatOptions);
  const endFormatted = endDate 
    ? endDate.toLocaleDateString('en-US', formatOptions)
    : 'Present';
    
  return `${startFormatted} - ${endFormatted}`;
}

/**
 * Get milestone type color
 */
function getMilestoneColor(type: string): string {
  const colors = {
    job: 'bg-blue-500',
    promotion: 'bg-green-500',
    education: 'bg-purple-500',
    side_project: 'bg-orange-500',
    certification: 'bg-yellow-500',
    achievement: 'bg-red-500'
  };
  return colors[type as keyof typeof colors] || 'bg-gray-500';
}

// ============================================================================
// MILESTONE CARD COMPONENT
// ============================================================================

interface MilestoneCardProps {
  milestone: Milestone;
  index: number;
}

function MilestoneCard({ milestone, index }: MilestoneCardProps): JSX.Element {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      variants={itemVariants}
      className={`flex items-start mb-12 relative ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* Content Card */}
      <div className={`w-5/12 ${isEven ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {milestone.title}
            </h3>
            <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold">
              {milestone.organization}
            </p>
          </div>

          {/* Date and Location */}
          <div className="mb-4 space-y-2">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Calendar size={16} className="mr-2" />
              <span className="text-sm">
                {formatDateRange(milestone.dateRange.start, milestone.dateRange.end)}
              </span>
            </div>
            {milestone.location && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPin size={16} className="mr-2" />
                <span className="text-sm">{milestone.location}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm leading-relaxed">
            {milestone.description}
          </p>

          {/* Highlights */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">
              Key Achievements:
            </h4>
            <ul className="space-y-1">
              {milestone.highlights.slice(0, 3).map((highlight, idx) => (
                <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {milestone.skills.slice(0, 4).map((skill) => (
              <span
                key={skill.id}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
              >
                {skill.name}
              </span>
            ))}
            {milestone.skills.length > 4 && (
              <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                +{milestone.skills.length - 4} more
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Timeline Node */}
      <div className="w-2/12 flex justify-center relative">
        <div className="relative flex flex-col items-center">
          {/* Node */}
          <motion.div
            whileHover={{ scale: 1.2 }}
            className={`relative z-20 w-8 h-8 rounded-full ${getMilestoneColor(milestone.type)} border-4 border-white dark:border-gray-900 shadow-lg mt-6`}
          >
            {/* Inner dot */}
            <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
              <div className={`w-2 h-2 rounded-full ${getMilestoneColor(milestone.type)}`}></div>
            </div>

            {/* Pulse animation for current position */}
            {!milestone.dateRange.end && (
              <motion.div
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.7, 0, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`absolute inset-0 rounded-full ${getMilestoneColor(milestone.type)} opacity-30`}
              />
            )}
          </motion.div>

          {/* Connection line to content */}
          <div className={`absolute top-10 w-16 h-0.5 bg-gray-300 dark:bg-gray-600 ${isEven ? 'left-8' : 'right-8'}`}></div>
        </div>
      </div>

      {/* Empty space for alternating layout */}
      <div className="w-5/12"></div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Timeline view component
 */
export function TimelineView({ className = '' }: TimelineViewProps): JSX.Element {
  const { careerData } = useAppContext();

  if (!careerData) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <Clock size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No career data available</p>
        </div>
      </div>
    );
  }

  // Sort milestones by start date
  const sortedMilestones = [...careerData.milestones].sort((a, b) => 
    new Date(a.dateRange.start).getTime() - new Date(b.dateRange.start).getTime()
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={`max-w-6xl mx-auto ${className}`}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Career Timeline
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Explore your professional journey through time. Each milestone represents 
          a significant step in your career development.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative min-h-screen">
        {/* Main Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-200 via-blue-400 to-blue-600 dark:from-blue-800 dark:via-blue-600 dark:to-blue-400 top-0 bottom-0 z-0"></div>

        {/* Timeline Start Marker */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 z-10">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg"></div>
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            Career Start
          </div>
        </div>

        {/* Timeline Items */}
        <div className="relative z-10 pt-16">
          {sortedMilestones.map((milestone, index) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              index={index}
            />
          ))}
        </div>

        {/* Timeline End Marker */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 z-10">
          <div className="w-4 h-4 bg-green-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg"></div>
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            Present
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <motion.div
        variants={itemVariants}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {careerData.milestones.length}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Total Milestones</div>
        </div>
        
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
            {careerData.skills.length}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Skills Developed</div>
        </div>
        
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            {(() => {
              const firstMilestone = sortedMilestones[0];
              const lastMilestone = sortedMilestones[sortedMilestones.length - 1];
              if (!firstMilestone || !lastMilestone) return 0;
              
              const start = new Date(firstMilestone.dateRange.start);
              const end = lastMilestone.dateRange.end 
                ? new Date(lastMilestone.dateRange.end)
                : new Date();
              
              return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365));
            })()}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Years of Experience</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
