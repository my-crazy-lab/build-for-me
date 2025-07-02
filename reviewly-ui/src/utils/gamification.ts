/**
 * Gamification System Utilities for Reviewly Application
 * 
 * Utilities for managing badges, achievements, goal suggestions,
 * progress tracking, and user motivation features.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

// Types for gamification system
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  criteria: BadgeCriteria;
  points: number;
  unlockedAt?: Date;
  progress?: number; // 0-100 percentage
}

export type BadgeCategory = 
  | 'reviews'
  | 'skills'
  | 'feedback'
  | 'collaboration'
  | 'leadership'
  | 'learning'
  | 'consistency'
  | 'special';

export interface BadgeCriteria {
  type: 'count' | 'streak' | 'rating' | 'time' | 'special';
  target: number;
  metric: string; // e.g., 'reviews_completed', 'skills_developed', 'feedback_received'
  timeframe?: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'all_time';
  conditions?: Record<string, any>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  points: number;
  requirements: AchievementRequirement[];
  rewards: AchievementReward[];
  unlockedAt?: Date;
  progress: number; // 0-100 percentage
}

export type AchievementCategory = 
  | 'performance'
  | 'growth'
  | 'collaboration'
  | 'innovation'
  | 'mentorship'
  | 'consistency'
  | 'milestone';

export interface AchievementRequirement {
  type: 'badge' | 'metric' | 'action' | 'time';
  target: string | number;
  description: string;
  completed: boolean;
}

export interface AchievementReward {
  type: 'points' | 'badge' | 'title' | 'feature';
  value: string | number;
  description: string;
}

export interface GoalSuggestion {
  id: string;
  title: string;
  description: string;
  category: 'skill' | 'performance' | 'collaboration' | 'leadership' | 'learning';
  priority: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string; // e.g., "2 weeks", "1 month"
  points: number;
  steps: GoalStep[];
  relatedBadges: string[];
  personalizedReason: string;
}

export interface GoalStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: Date;
}

export interface UserProgress {
  userId: string;
  totalPoints: number;
  level: number;
  experiencePoints: number;
  nextLevelXP: number;
  badges: Badge[];
  achievements: Achievement[];
  currentGoals: GoalSuggestion[];
  completedGoals: GoalSuggestion[];
  streaks: {
    currentReviewStreak: number;
    longestReviewStreak: number;
    currentSkillStreak: number;
    longestSkillStreak: number;
  };
  stats: {
    totalReviews: number;
    totalSkillsLearned: number;
    totalFeedbackGiven: number;
    totalFeedbackReceived: number;
    averageRating: number;
    daysActive: number;
  };
}

// Predefined badges
export const PREDEFINED_BADGES: Badge[] = [
  {
    id: 'first_review',
    name: 'First Steps',
    description: 'Complete your first self-review',
    icon: '🎯',
    category: 'reviews',
    rarity: 'common',
    criteria: {
      type: 'count',
      target: 1,
      metric: 'reviews_completed'
    },
    points: 10
  },
  {
    id: 'review_veteran',
    name: 'Review Veteran',
    description: 'Complete 10 self-reviews',
    icon: '📝',
    category: 'reviews',
    rarity: 'uncommon',
    criteria: {
      type: 'count',
      target: 10,
      metric: 'reviews_completed'
    },
    points: 50
  },
  {
    id: 'skill_explorer',
    name: 'Skill Explorer',
    description: 'Develop 5 different skills',
    icon: '🧭',
    category: 'skills',
    rarity: 'uncommon',
    criteria: {
      type: 'count',
      target: 5,
      metric: 'skills_developed'
    },
    points: 30
  },
  {
    id: 'feedback_champion',
    name: 'Feedback Champion',
    description: 'Give feedback to 20 colleagues',
    icon: '🤝',
    category: 'feedback',
    rarity: 'rare',
    criteria: {
      type: 'count',
      target: 20,
      metric: 'feedback_given'
    },
    points: 75
  },
  {
    id: 'consistency_king',
    name: 'Consistency King',
    description: 'Complete reviews for 30 consecutive days',
    icon: '👑',
    category: 'consistency',
    rarity: 'epic',
    criteria: {
      type: 'streak',
      target: 30,
      metric: 'daily_review_streak'
    },
    points: 150
  },
  {
    id: 'mentor_master',
    name: 'Mentor Master',
    description: 'Help 10 team members improve their skills',
    icon: '🎓',
    category: 'leadership',
    rarity: 'rare',
    criteria: {
      type: 'count',
      target: 10,
      metric: 'mentoring_sessions'
    },
    points: 100
  },
  {
    id: 'learning_machine',
    name: 'Learning Machine',
    description: 'Complete 50 hours of skill development',
    icon: '🤖',
    category: 'learning',
    rarity: 'epic',
    criteria: {
      type: 'count',
      target: 50,
      metric: 'learning_hours'
    },
    points: 200
  },
  {
    id: 'collaboration_star',
    name: 'Collaboration Star',
    description: 'Receive positive feedback from 15 different colleagues',
    icon: '⭐',
    category: 'collaboration',
    rarity: 'rare',
    criteria: {
      type: 'count',
      target: 15,
      metric: 'positive_feedback_sources'
    },
    points: 80
  }
];

// Predefined achievements
export const PREDEFINED_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'rising_star',
    name: 'Rising Star',
    description: 'Show exceptional growth in your first quarter',
    icon: '🌟',
    category: 'growth',
    tier: 'gold',
    points: 500,
    requirements: [
      {
        type: 'badge',
        target: 'first_review',
        description: 'Complete first review',
        completed: false
      },
      {
        type: 'metric',
        target: 4.0,
        description: 'Maintain 4.0+ average rating',
        completed: false
      },
      {
        type: 'badge',
        target: 'skill_explorer',
        description: 'Develop multiple skills',
        completed: false
      }
    ],
    rewards: [
      {
        type: 'points',
        value: 500,
        description: '500 bonus points'
      },
      {
        type: 'title',
        value: 'Rising Star',
        description: 'Special profile title'
      }
    ],
    progress: 0
  },
  {
    id: 'team_player',
    name: 'Ultimate Team Player',
    description: 'Excel in collaboration and teamwork',
    icon: '🤝',
    category: 'collaboration',
    tier: 'platinum',
    points: 750,
    requirements: [
      {
        type: 'badge',
        target: 'feedback_champion',
        description: 'Give extensive feedback',
        completed: false
      },
      {
        type: 'badge',
        target: 'collaboration_star',
        description: 'Receive positive feedback',
        completed: false
      },
      {
        type: 'metric',
        target: 10,
        description: 'Lead 10 collaborative projects',
        completed: false
      }
    ],
    rewards: [
      {
        type: 'points',
        value: 750,
        description: '750 bonus points'
      },
      {
        type: 'feature',
        value: 'priority_feedback',
        description: 'Priority feedback requests'
      }
    ],
    progress: 0
  }
];

// Utility functions
export const calculateLevel = (experiencePoints: number): number => {
  // Level formula: level = floor(sqrt(XP / 100))
  // Handle negative values by treating them as 0
  const xp = Math.max(0, experiencePoints);
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const calculateNextLevelXP = (currentLevel: number): number => {
  // XP needed for next level: (level^2) * 100
  return (currentLevel * currentLevel) * 100;
};

export const getRarityColor = (rarity: Badge['rarity']): string => {
  const colors = {
    common: '#9CA3AF',
    uncommon: '#10B981',
    rare: '#3B82F6',
    epic: '#8B5CF6',
    legendary: '#F59E0B'
  };
  return colors[rarity];
};

export const getTierColor = (tier: Achievement['tier']): string => {
  const colors = {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2',
    diamond: '#B9F2FF'
  };
  return colors[tier];
};

export const checkBadgeProgress = (
  badge: Badge,
  userStats: UserProgress['stats'],
  userStreaks: UserProgress['streaks']
): number => {
  const { criteria } = badge;
  let currentValue = 0;

  switch (criteria.metric) {
    case 'reviews_completed':
      currentValue = userStats.totalReviews;
      break;
    case 'skills_developed':
      currentValue = userStats.totalSkillsLearned;
      break;
    case 'feedback_given':
      currentValue = userStats.totalFeedbackGiven;
      break;
    case 'feedback_received':
      currentValue = userStats.totalFeedbackReceived;
      break;
    case 'daily_review_streak':
      currentValue = userStreaks.currentReviewStreak;
      break;
    case 'learning_hours':
      currentValue = userStats.daysActive * 2; // Mock calculation
      break;
    case 'positive_feedback_sources':
      currentValue = Math.floor(userStats.totalFeedbackReceived * 0.8); // Mock calculation
      break;
    case 'mentoring_sessions':
      currentValue = Math.floor(userStats.totalFeedbackGiven * 0.3); // Mock calculation
      break;
    default:
      currentValue = 0;
  }

  return Math.min(100, (currentValue / criteria.target) * 100);
};

export const generatePersonalizedGoals = (userProgress: UserProgress): GoalSuggestion[] => {
  const suggestions: GoalSuggestion[] = [];
  const { stats, badges } = userProgress;

  // Skill development goal
  if (stats.totalSkillsLearned < 5) {
    suggestions.push({
      id: 'develop_skills',
      title: 'Expand Your Skill Set',
      description: 'Learn 3 new skills to become more versatile in your role',
      category: 'skill',
      priority: 'high',
      difficulty: 'medium',
      estimatedTime: '1 month',
      points: 150,
      steps: [
        {
          id: 'identify_skills',
          title: 'Identify target skills',
          description: 'Choose 3 skills relevant to your career goals',
          completed: false
        },
        {
          id: 'create_plan',
          title: 'Create learning plan',
          description: 'Outline how you will develop each skill',
          completed: false
        },
        {
          id: 'practice_skills',
          title: 'Practice and apply',
          description: 'Apply new skills in real projects',
          completed: false
        }
      ],
      relatedBadges: ['skill_explorer'],
      personalizedReason: 'Based on your current skill count, expanding your expertise will unlock new opportunities.'
    });
  }

  // Feedback goal
  if (stats.totalFeedbackGiven < 10) {
    suggestions.push({
      id: 'give_feedback',
      title: 'Become a Feedback Champion',
      description: 'Help colleagues grow by providing constructive feedback',
      category: 'collaboration',
      priority: 'medium',
      difficulty: 'easy',
      estimatedTime: '2 weeks',
      points: 100,
      steps: [
        {
          id: 'schedule_feedback',
          title: 'Schedule feedback sessions',
          description: 'Set up regular feedback meetings with team members',
          completed: false
        },
        {
          id: 'provide_feedback',
          title: 'Provide quality feedback',
          description: 'Give specific, actionable feedback to 10 colleagues',
          completed: false
        }
      ],
      relatedBadges: ['feedback_champion'],
      personalizedReason: 'Your colleagues would benefit from your insights and experience.'
    });
  }

  // Performance goal
  if (stats.averageRating < 4.0) {
    suggestions.push({
      id: 'improve_performance',
      title: 'Boost Your Performance',
      description: 'Focus on key areas to improve your overall rating',
      category: 'performance',
      priority: 'high',
      difficulty: 'hard',
      estimatedTime: '6 weeks',
      points: 200,
      steps: [
        {
          id: 'identify_gaps',
          title: 'Identify improvement areas',
          description: 'Review feedback to find specific areas for growth',
          completed: false
        },
        {
          id: 'create_action_plan',
          title: 'Create action plan',
          description: 'Develop specific strategies for improvement',
          completed: false
        },
        {
          id: 'implement_changes',
          title: 'Implement improvements',
          description: 'Apply new strategies and track progress',
          completed: false
        }
      ],
      relatedBadges: ['consistency_king'],
      personalizedReason: 'Focusing on performance improvement will help you reach your full potential.'
    });
  }

  return suggestions.slice(0, 3); // Return top 3 suggestions
};

export const calculateAchievementProgress = (
  achievement: Achievement,
  userProgress: UserProgress
): number => {
  const completedRequirements = achievement.requirements.filter(req => {
    switch (req.type) {
      case 'badge':
        return userProgress.badges.some(badge => badge.id === req.target);
      case 'metric':
        // This would need more specific implementation based on the metric
        return false;
      case 'action':
        // This would track specific user actions
        return false;
      default:
        return false;
    }
  }).length;

  return (completedRequirements / achievement.requirements.length) * 100;
};

export const getMotivationalMessage = (userProgress: UserProgress): string => {
  const { level, badges, stats } = userProgress;
  const recentBadges = badges.filter(badge => 
    badge.unlockedAt && 
    Date.now() - badge.unlockedAt.getTime() < 7 * 24 * 60 * 60 * 1000 // Last 7 days
  );

  if (recentBadges.length > 0) {
    return `🎉 Great job earning the "${recentBadges[0].name}" badge! Keep up the momentum!`;
  }

  if (level >= 10) {
    return `🌟 Level ${level}! You're becoming a true professional development champion!`;
  }

  if (stats.totalReviews >= 5) {
    return `📈 Your consistency in self-reflection is paying off. ${stats.totalReviews} reviews completed!`;
  }

  return `🚀 Welcome to your growth journey! Complete your first review to start earning badges.`;
};

export const formatPoints = (points: number): string => {
  if (points >= 1000000) {
    return `${(points / 1000000).toFixed(1)}M`;
  }
  if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}K`;
  }
  return points.toString();
};
