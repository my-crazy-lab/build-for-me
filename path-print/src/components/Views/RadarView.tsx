/**
 * Career Path Visualization - Radar View Component
 * 
 * This component displays skills in a radar chart format showing
 * proficiency levels across different skill categories.
 * 
 * @fileoverview Skills radar chart visualization
 * @author Career Path Visualization Team
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, Award, Filter } from 'lucide-react';
import type { CareerData, Skill } from '../../types';
import { useAppContext } from '../Layout/AppLayout';

// ============================================================================
// INTERFACES
// ============================================================================

interface RadarViewProps {
  className?: string;
}

interface RadarPoint {
  skill: Skill;
  angle: number;
  x: number;
  y: number;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate radar chart points
 */
function generateRadarPoints(skills: Skill[], centerX: number, centerY: number, radius: number): RadarPoint[] {
  return skills.map((skill, index) => {
    const angle = (index / skills.length) * 2 * Math.PI - Math.PI / 2; // Start from top
    const distance = (skill.level / 5) * radius; // Scale by skill level
    
    return {
      skill,
      angle,
      x: centerX + Math.cos(angle) * distance,
      y: centerY + Math.sin(angle) * distance
    };
  });
}

/**
 * Get color for skill category
 */
function getCategoryColor(category: string): string {
  const colors = {
    'Programming': '#3B82F6',
    'Frontend': '#10B981',
    'Backend': '#F59E0B',
    'Cloud': '#8B5CF6',
    'DevOps': '#EF4444',
    'Leadership': '#06B6D4',
    'Architecture': '#84CC16',
    'Community': '#F97316'
  };
  return colors[category as keyof typeof colors] || '#6B7280';
}

// ============================================================================
// RADAR CHART COMPONENT
// ============================================================================

interface RadarChartProps {
  skills: Skill[];
  selectedCategory: string | null;
  onSkillHover: (skill: Skill | null) => void;
}

function RadarChart({ skills, selectedCategory, onSkillHover }: RadarChartProps): JSX.Element {
  const centerX = 200;
  const centerY = 200;
  const maxRadius = 150;
  
  const filteredSkills = selectedCategory 
    ? skills.filter(skill => skill.category === selectedCategory)
    : skills;
  
  const points = generateRadarPoints(filteredSkills, centerX, centerY, maxRadius);

  // Generate grid circles
  const gridLevels = [1, 2, 3, 4, 5];
  
  return (
    <div className="relative">
      <svg width="400" height="400" className="overflow-visible">
        {/* Grid circles */}
        {gridLevels.map((level) => (
          <circle
            key={level}
            cx={centerX}
            cy={centerY}
            r={(level / 5) * maxRadius}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-300 dark:text-gray-600"
            opacity="0.3"
          />
        ))}

        {/* Grid lines */}
        {filteredSkills.map((_, index) => {
          const angle = (index / filteredSkills.length) * 2 * Math.PI - Math.PI / 2;
          const endX = centerX + Math.cos(angle) * maxRadius;
          const endY = centerY + Math.sin(angle) * maxRadius;
          
          return (
            <line
              key={index}
              x1={centerX}
              y1={centerY}
              x2={endX}
              y2={endY}
              stroke="currentColor"
              strokeWidth="1"
              className="text-gray-300 dark:text-gray-600"
              opacity="0.3"
            />
          );
        })}

        {/* Skill area */}
        {points.length > 0 && (
          <motion.polygon
            points={points.map(p => `${p.x},${p.y}`).join(' ')}
            fill="url(#radarGradient)"
            stroke="#3B82F6"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        )}

        {/* Skill points */}
        {points.map((point, index) => (
          <motion.g key={point.skill.id}>
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill={getCategoryColor(point.skill.category)}
              stroke="white"
              strokeWidth="2"
              className="cursor-pointer"
              whileHover={{ scale: 1.5 }}
              onMouseEnter={() => onSkillHover(point.skill)}
              onMouseLeave={() => onSkillHover(null)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            />
            
            {/* Skill label */}
            <text
              x={centerX + Math.cos(point.angle) * (maxRadius + 20)}
              y={centerY + Math.sin(point.angle) * (maxRadius + 20)}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-medium fill-current text-gray-700 dark:text-gray-300"
            >
              {point.skill.name}
            </text>
          </motion.g>
        ))}

        {/* Level labels */}
        {gridLevels.map((level) => (
          <text
            key={level}
            x={centerX + 5}
            y={centerY - (level / 5) * maxRadius}
            className="text-xs fill-current text-gray-500 dark:text-gray-400"
          >
            {level}
          </text>
        ))}

        {/* Gradient definition */}
        <defs>
          <radialGradient id="radarGradient">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

// ============================================================================
// SKILL DETAIL COMPONENT
// ============================================================================

interface SkillDetailProps {
  skill: Skill | null;
}

function SkillDetail({ skill }: SkillDetailProps): JSX.Element {
  if (!skill) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 h-48 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Hover over a skill to see details</p>
      </div>
    );
  }

  const levelLabels = ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];

  return (
    <motion.div
      key={skill.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {skill.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {skill.category}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color: getCategoryColor(skill.category) }}>
            {skill.level}/5
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {levelLabels[skill.level]}
          </div>
        </div>
      </div>

      {skill.description && (
        <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm leading-relaxed">
          {skill.description}
        </p>
      )}

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>Proficiency</span>
          <span>{skill.level}/5</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full"
            style={{ backgroundColor: getCategoryColor(skill.category) }}
            initial={{ width: 0 }}
            animate={{ width: `${(skill.level / 5) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Tags */}
      {skill.tags && skill.tags.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Related Technologies:
          </h4>
          <div className="flex flex-wrap gap-2">
            {skill.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Radar view component
 */
export function RadarView({ className = '' }: RadarViewProps): JSX.Element {
  const { careerData } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);

  if (!careerData) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <Activity size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No career data available</p>
        </div>
      </div>
    );
  }

  const skills = careerData.skills || [];
  const categories = [...new Set(skills.map(skill => skill.category))];

  return (
    <div className={`max-w-7xl mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Skills Radar
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Visualize your skill proficiency across different categories. 
          The further from center, the higher your expertise level.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All Skills
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            style={{
              backgroundColor: selectedCategory === category ? getCategoryColor(category) : undefined
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <div className="flex justify-center">
          <RadarChart
            skills={skills}
            selectedCategory={selectedCategory}
            onSkillHover={setHoveredSkill}
          />
        </div>

        {/* Skill Detail */}
        <div>
          <SkillDetail skill={hoveredSkill} />
        </div>
      </div>

      {/* Skills Summary */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {skills.length}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Total Skills</div>
        </div>
        
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
            {skills.filter(skill => skill.level >= 4).length}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Expert Level</div>
        </div>
        
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            {categories.length}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Categories</div>
        </div>
      </div>
    </div>
  );
}
