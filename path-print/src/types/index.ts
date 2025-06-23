/**
 * Career Path Visualization - Type Definitions
 * 
 * This file contains all TypeScript type definitions for the career path visualization application.
 * These types ensure type safety across the entire application and provide clear contracts
 * for data structures, component props, and API interfaces.
 * 
 * @fileoverview Comprehensive type definitions for career milestones, skills, and visualization data
 * @author Career Path Visualization Team
 * @version 1.0.0
 * 
 * MAINTAINER NOTES:
 * - All types use strict TypeScript conventions with proper documentation
 * - Enums are used for fixed sets of values to ensure consistency
 * - Optional properties are clearly marked with '?' operator
 * - Complex types are broken down into smaller, reusable interfaces
 * - All types are exported for use throughout the application
 */

// ============================================================================
// CORE ENUMS
// ============================================================================

/**
 * Defines the different types of career milestones
 * Used to categorize and style milestones differently in the UI
 */
export enum MilestoneType {
  JOB = 'job',
  PROMOTION = 'promotion',
  EDUCATION = 'education',
  SIDE_PROJECT = 'side_project',
  CERTIFICATION = 'certification',
  ACHIEVEMENT = 'achievement'
}

/**
 * Skill proficiency levels for radar chart visualization
 * Numeric values allow for easy calculation and comparison
 */
export enum SkillLevel {
  BEGINNER = 1,
  INTERMEDIATE = 2,
  ADVANCED = 3,
  EXPERT = 4,
  MASTER = 5
}

/**
 * Available visualization modes for career data display
 */
export enum ViewMode {
  OVERVIEW = 'overview',
  TIMELINE = 'timeline',
  MAP = 'map',
  RADAR = 'radar',
  PROGRESS = 'progress',
  GOALS = 'goals',
  PROFILE = 'profile',
  EXPORT = 'export',
  SETTINGS = 'settings'
}

/**
 * Animation states for UI components
 */
export enum AnimationState {
  IDLE = 'idle',
  LOADING = 'loading',
  ANIMATING = 'animating',
  COMPLETE = 'complete'
}

// ============================================================================
// CORE DATA INTERFACES
// ============================================================================

/**
 * Represents a date range with optional end date for ongoing positions
 */
export interface DateRange {
  /** Start date in ISO 8601 format (YYYY-MM-DD) */
  start: string;
  /** End date in ISO 8601 format, null for current/ongoing positions */
  end: string | null;
  /** Human-readable description like "2 years 3 months" */
  duration?: string;
}

/**
 * Represents a skill with proficiency level and growth tracking
 */
export interface Skill {
  /** Unique identifier for the skill */
  id: string;
  /** Display name of the skill */
  name: string;
  /** Current proficiency level */
  level: SkillLevel;
  /** Category for grouping (e.g., "Programming", "Leadership") */
  category: string;
  /** Optional description or notes about the skill */
  description?: string;
  /** Historical proficiency levels for growth tracking */
  history?: Array<{
    date: string;
    level: SkillLevel;
  }>;
  /** Associated technologies, tools, or frameworks */
  tags?: string[];
}

/**
 * Represents a career milestone with comprehensive metadata
 */
export interface Milestone {
  /** Unique identifier for the milestone */
  id: string;
  /** Type of milestone for categorization and styling */
  type: MilestoneType;
  /** Job title, degree name, or project title */
  title: string;
  /** Company, institution, or organization name */
  organization: string;
  /** Time period for this milestone */
  dateRange: DateRange;
  /** Brief description of the role or achievement */
  description: string;
  /** Key accomplishments or highlights */
  highlights: string[];
  /** Skills gained or utilized during this milestone */
  skills: Skill[];
  /** Icon identifier for visual representation */
  icon: string;
  /** Location (city, state/country) */
  location?: string;
  /** Salary or compensation information (optional, for personal tracking) */
  compensation?: {
    amount: number;
    currency: string;
    type: 'hourly' | 'salary' | 'contract';
  };
  /** Links to relevant resources (portfolio, certificates, etc.) */
  links?: Array<{
    title: string;
    url: string;
    type: 'portfolio' | 'certificate' | 'article' | 'other';
  }>;
  /** Custom metadata for extensibility */
  metadata?: Record<string, unknown>;
}

/**
 * Represents a future career goal or planned milestone
 */
export interface Goal {
  /** Unique identifier for the goal */
  id: string;
  /** Goal title or objective */
  title: string;
  /** Detailed description of the goal */
  description: string;
  /** Target completion date */
  targetDate: string;
  /** Current progress percentage (0-100) */
  progress: number;
  /** Priority level for goal ordering */
  priority: 'low' | 'medium' | 'high' | 'critical';
  /** Skills required to achieve this goal */
  requiredSkills: string[];
  /** Suggested resources for achieving the goal */
  resources?: Array<{
    title: string;
    url: string;
    type: 'course' | 'book' | 'mentor' | 'tool' | 'other';
  }>;
  /** Milestones or steps to achieve this goal */
  steps?: Array<{
    id: string;
    title: string;
    completed: boolean;
    dueDate?: string;
  }>;
}

// ============================================================================
// VISUALIZATION INTERFACES
// ============================================================================

/**
 * Configuration for timeline visualization
 */
export interface TimelineConfig {
  /** Orientation of the timeline */
  orientation: 'horizontal' | 'vertical';
  /** Show date labels on timeline */
  showDates: boolean;
  /** Enable smooth scrolling animations */
  enableAnimations: boolean;
  /** Color scheme for timeline elements */
  colorScheme: 'light' | 'dark' | 'auto';
  /** Zoom level for timeline (0.5 - 2.0) */
  zoomLevel: number;
}

/**
 * Configuration for map visualization
 */
export interface MapConfig {
  /** Enable zoom and pan interactions */
  enableInteractions: boolean;
  /** Show connection lines between milestones */
  showConnections: boolean;
  /** Animation speed for node transitions */
  animationSpeed: 'slow' | 'medium' | 'fast';
  /** Layout algorithm for node positioning */
  layout: 'force' | 'hierarchical' | 'circular';
}

/**
 * Configuration for radar chart visualization
 */
export interface RadarConfig {
  /** Maximum value for radar chart scale */
  maxValue: number;
  /** Show skill level labels */
  showLabels: boolean;
  /** Enable hover interactions */
  enableHover: boolean;
  /** Color palette for skill categories */
  colorPalette: string[];
}

/**
 * Comprehensive career data structure
 */
export interface CareerData {
  /** Personal information */
  profile: {
    name: string;
    title: string;
    bio: string;
    avatar?: string;
    contact?: {
      email?: string;
      linkedin?: string;
      github?: string;
      website?: string;
    };
  };
  /** All career milestones */
  milestones: Milestone[];
  /** All skills with current proficiency */
  skills: Skill[];
  /** Future goals and objectives */
  goals: Goal[];
  /** Visualization preferences */
  preferences: {
    defaultView: ViewMode;
    timelineConfig: TimelineConfig;
    mapConfig: MapConfig;
    radarConfig: RadarConfig;
  };
  /** Metadata about the data */
  metadata: {
    version: string;
    lastUpdated: string;
    dataSource: 'yaml' | 'json';
  };
}

// ============================================================================
// COMPONENT PROP INTERFACES
// ============================================================================

/**
 * Props for milestone display components
 */
export interface MilestoneProps {
  milestone: Milestone;
  isSelected?: boolean;
  onSelect?: (milestone: Milestone) => void;
  animationDelay?: number;
  showDetails?: boolean;
}

/**
 * Props for skill visualization components
 */
export interface SkillProps {
  skill: Skill;
  showLevel?: boolean;
  showProgress?: boolean;
  interactive?: boolean;
  onSkillClick?: (skill: Skill) => void;
}

/**
 * Props for goal display components
 */
export interface GoalProps {
  goal: Goal;
  showProgress?: boolean;
  onGoalUpdate?: (goal: Goal) => void;
  compact?: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

/**
 * Error information structure
 */
export interface ErrorInfo {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

/**
 * Export configuration for sharing features
 */
export interface ExportConfig {
  format: 'pdf' | 'png' | 'svg' | 'json';
  includePersonalInfo: boolean;
  includeSkills: boolean;
  includeMilestones: boolean;
  includeGoals: boolean;
  theme: 'light' | 'dark';
  quality?: 'low' | 'medium' | 'high';
}

/**
 * Animation configuration for components
 */
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  repeat?: boolean;
  direction?: 'normal' | 'reverse' | 'alternate';
}
