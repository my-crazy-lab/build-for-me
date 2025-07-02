/**
 * Gamification Utilities Tests
 * 
 * Unit tests for gamification system including level calculation,
 * badge progress tracking, achievement validation, and goal generation.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import {
  calculateLevel,
  calculateNextLevelXP,
  checkBadgeProgress,
  generatePersonalizedGoals,
  calculateAchievementProgress,
  getMotivationalMessage,
  formatPoints,
  PREDEFINED_BADGES,
  PREDEFINED_ACHIEVEMENTS
} from '../gamification';
import type { UserProgress, Badge } from '../gamification';

describe('Gamification Utilities', () => {
  describe('calculateLevel', () => {
    it('calculates correct level for various XP amounts', () => {
      expect(calculateLevel(0)).toBe(1);
      expect(calculateLevel(100)).toBe(2);
      expect(calculateLevel(400)).toBe(3);
      expect(calculateLevel(900)).toBe(4);
      expect(calculateLevel(1600)).toBe(5);
      expect(calculateLevel(2500)).toBe(6);
    });

    it('handles edge cases', () => {
      expect(calculateLevel(-100)).toBe(1); // Negative XP should still give level 1
      expect(calculateLevel(99)).toBe(1); // Just below level 2 threshold
      expect(calculateLevel(10000)).toBe(11); // High XP values
    });
  });

  describe('calculateNextLevelXP', () => {
    it('calculates correct XP needed for next level', () => {
      expect(calculateNextLevelXP(1)).toBe(100);
      expect(calculateNextLevelXP(2)).toBe(400);
      expect(calculateNextLevelXP(3)).toBe(900);
      expect(calculateNextLevelXP(4)).toBe(1600);
      expect(calculateNextLevelXP(5)).toBe(2500);
    });

    it('follows quadratic progression', () => {
      for (let level = 1; level <= 10; level++) {
        const expectedXP = level * level * 100;
        expect(calculateNextLevelXP(level)).toBe(expectedXP);
      }
    });
  });

  describe('checkBadgeProgress', () => {
    const mockUserStats = {
      totalReviews: 5,
      totalSkillsLearned: 3,
      totalFeedbackGiven: 8,
      totalFeedbackReceived: 6,
      averageRating: 4.2,
      daysActive: 45
    };

    const mockUserStreaks = {
      currentReviewStreak: 7,
      longestReviewStreak: 15,
      currentSkillStreak: 3,
      longestSkillStreak: 8
    };

    it('calculates progress for review-based badges', () => {
      const badge: Badge = {
        id: 'test-badge',
        name: 'Review Master',
        description: 'Complete 10 reviews',
        icon: '📝',
        category: 'reviews',
        rarity: 'common',
        criteria: {
          type: 'count',
          target: 10,
          metric: 'reviews_completed'
        },
        points: 50
      };

      const progress = checkBadgeProgress(badge, mockUserStats, mockUserStreaks);
      expect(progress).toBe(50); // 5/10 = 50%
    });

    it('calculates progress for skill-based badges', () => {
      const badge: Badge = {
        id: 'skill-badge',
        name: 'Skill Explorer',
        description: 'Learn 5 skills',
        icon: '🧭',
        category: 'skills',
        rarity: 'uncommon',
        criteria: {
          type: 'count',
          target: 5,
          metric: 'skills_developed'
        },
        points: 30
      };

      const progress = checkBadgeProgress(badge, mockUserStats, mockUserStreaks);
      expect(progress).toBe(60); // 3/5 = 60%
    });

    it('calculates progress for streak-based badges', () => {
      const badge: Badge = {
        id: 'streak-badge',
        name: 'Consistency King',
        description: 'Maintain 10-day review streak',
        icon: '👑',
        category: 'consistency',
        rarity: 'rare',
        criteria: {
          type: 'streak',
          target: 10,
          metric: 'daily_review_streak'
        },
        points: 100
      };

      const progress = checkBadgeProgress(badge, mockUserStats, mockUserStreaks);
      expect(progress).toBe(70); // 7/10 = 70%
    });

    it('caps progress at 100%', () => {
      const badge: Badge = {
        id: 'easy-badge',
        name: 'First Review',
        description: 'Complete 1 review',
        icon: '🎯',
        category: 'reviews',
        rarity: 'common',
        criteria: {
          type: 'count',
          target: 1,
          metric: 'reviews_completed'
        },
        points: 10
      };

      const progress = checkBadgeProgress(badge, mockUserStats, mockUserStreaks);
      expect(progress).toBe(100); // 5/1 = 500%, but capped at 100%
    });

    it('handles unknown metrics gracefully', () => {
      const badge: Badge = {
        id: 'unknown-badge',
        name: 'Unknown Badge',
        description: 'Unknown metric',
        icon: '❓',
        category: 'special',
        rarity: 'common',
        criteria: {
          type: 'count',
          target: 10,
          metric: 'unknown_metric'
        },
        points: 10
      };

      const progress = checkBadgeProgress(badge, mockUserStats, mockUserStreaks);
      expect(progress).toBe(0);
    });
  });

  describe('generatePersonalizedGoals', () => {
    it('generates skill development goal for users with few skills', () => {
      const userProgress: UserProgress = {
        userId: 'test-user',
        totalPoints: 1000,
        level: 3,
        experiencePoints: 500,
        nextLevelXP: 900,
        badges: [],
        achievements: [],
        currentGoals: [],
        completedGoals: [],
        streaks: {
          currentReviewStreak: 5,
          longestReviewStreak: 10,
          currentSkillStreak: 2,
          longestSkillStreak: 5
        },
        stats: {
          totalReviews: 8,
          totalSkillsLearned: 2, // Low skill count
          totalFeedbackGiven: 5,
          totalFeedbackReceived: 7,
          averageRating: 4.0,
          daysActive: 30
        }
      };

      const goals = generatePersonalizedGoals(userProgress);
      
      expect(goals.length).toBeGreaterThan(0);
      expect(goals.some(goal => goal.category === 'skill')).toBe(true);
      expect(goals.some(goal => goal.title.includes('Skill'))).toBe(true);
    });

    it('generates feedback goal for users with low feedback count', () => {
      const userProgress: UserProgress = {
        userId: 'test-user',
        totalPoints: 1000,
        level: 3,
        experiencePoints: 500,
        nextLevelXP: 900,
        badges: [],
        achievements: [],
        currentGoals: [],
        completedGoals: [],
        streaks: {
          currentReviewStreak: 5,
          longestReviewStreak: 10,
          currentSkillStreak: 2,
          longestSkillStreak: 5
        },
        stats: {
          totalReviews: 8,
          totalSkillsLearned: 6,
          totalFeedbackGiven: 3, // Low feedback count
          totalFeedbackReceived: 7,
          averageRating: 4.0,
          daysActive: 30
        }
      };

      const goals = generatePersonalizedGoals(userProgress);
      
      expect(goals.some(goal => goal.category === 'collaboration')).toBe(true);
      expect(goals.some(goal => goal.title.includes('Feedback'))).toBe(true);
    });

    it('generates performance goal for users with low ratings', () => {
      const userProgress: UserProgress = {
        userId: 'test-user',
        totalPoints: 1000,
        level: 3,
        experiencePoints: 500,
        nextLevelXP: 900,
        badges: [],
        achievements: [],
        currentGoals: [],
        completedGoals: [],
        streaks: {
          currentReviewStreak: 5,
          longestReviewStreak: 10,
          currentSkillStreak: 2,
          longestSkillStreak: 5
        },
        stats: {
          totalReviews: 8,
          totalSkillsLearned: 6,
          totalFeedbackGiven: 15,
          totalFeedbackReceived: 7,
          averageRating: 3.5, // Low rating
          daysActive: 30
        }
      };

      const goals = generatePersonalizedGoals(userProgress);
      
      expect(goals.some(goal => goal.category === 'performance')).toBe(true);
      expect(goals.some(goal => goal.title.includes('Performance'))).toBe(true);
    });

    it('limits the number of suggestions', () => {
      const userProgress: UserProgress = {
        userId: 'test-user',
        totalPoints: 100,
        level: 1,
        experiencePoints: 50,
        nextLevelXP: 100,
        badges: [],
        achievements: [],
        currentGoals: [],
        completedGoals: [],
        streaks: {
          currentReviewStreak: 1,
          longestReviewStreak: 1,
          currentSkillStreak: 1,
          longestSkillStreak: 1
        },
        stats: {
          totalReviews: 1,
          totalSkillsLearned: 1,
          totalFeedbackGiven: 1,
          totalFeedbackReceived: 1,
          averageRating: 3.0,
          daysActive: 5
        }
      };

      const goals = generatePersonalizedGoals(userProgress);
      
      expect(goals.length).toBeLessThanOrEqual(3);
    });
  });

  describe('getMotivationalMessage', () => {
    it('returns badge congratulation for recent badges', () => {
      const userProgress: UserProgress = {
        userId: 'test-user',
        totalPoints: 1000,
        level: 5,
        experiencePoints: 1500,
        nextLevelXP: 2500,
        badges: [{
          id: 'recent-badge',
          name: 'Test Badge',
          description: 'Test description',
          icon: '🎯',
          category: 'reviews',
          rarity: 'common',
          criteria: { type: 'count', target: 1, metric: 'test' },
          points: 10,
          unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        }],
        achievements: [],
        currentGoals: [],
        completedGoals: [],
        streaks: {
          currentReviewStreak: 5,
          longestReviewStreak: 10,
          currentSkillStreak: 2,
          longestSkillStreak: 5
        },
        stats: {
          totalReviews: 8,
          totalSkillsLearned: 6,
          totalFeedbackGiven: 15,
          totalFeedbackReceived: 7,
          averageRating: 4.0,
          daysActive: 30
        }
      };

      const message = getMotivationalMessage(userProgress);
      
      expect(message).toContain('Test Badge');
      expect(message).toContain('🎉');
    });

    it('returns level congratulation for high levels', () => {
      const userProgress: UserProgress = {
        userId: 'test-user',
        totalPoints: 5000,
        level: 15,
        experiencePoints: 10000,
        nextLevelXP: 22500,
        badges: [],
        achievements: [],
        currentGoals: [],
        completedGoals: [],
        streaks: {
          currentReviewStreak: 5,
          longestReviewStreak: 10,
          currentSkillStreak: 2,
          longestSkillStreak: 5
        },
        stats: {
          totalReviews: 8,
          totalSkillsLearned: 6,
          totalFeedbackGiven: 15,
          totalFeedbackReceived: 7,
          averageRating: 4.0,
          daysActive: 30
        }
      };

      const message = getMotivationalMessage(userProgress);
      
      expect(message).toContain('Level 15');
      expect(message).toContain('🌟');
    });

    it('returns review consistency message for active users', () => {
      const userProgress: UserProgress = {
        userId: 'test-user',
        totalPoints: 1000,
        level: 3,
        experiencePoints: 500,
        nextLevelXP: 900,
        badges: [],
        achievements: [],
        currentGoals: [],
        completedGoals: [],
        streaks: {
          currentReviewStreak: 5,
          longestReviewStreak: 10,
          currentSkillStreak: 2,
          longestSkillStreak: 5
        },
        stats: {
          totalReviews: 10, // High review count
          totalSkillsLearned: 6,
          totalFeedbackGiven: 15,
          totalFeedbackReceived: 7,
          averageRating: 4.0,
          daysActive: 30
        }
      };

      const message = getMotivationalMessage(userProgress);
      
      expect(message).toContain('consistency');
      expect(message).toContain('10 reviews');
      expect(message).toContain('📈');
    });

    it('returns welcome message for new users', () => {
      const userProgress: UserProgress = {
        userId: 'test-user',
        totalPoints: 100,
        level: 1,
        experiencePoints: 50,
        nextLevelXP: 100,
        badges: [],
        achievements: [],
        currentGoals: [],
        completedGoals: [],
        streaks: {
          currentReviewStreak: 1,
          longestReviewStreak: 1,
          currentSkillStreak: 1,
          longestSkillStreak: 1
        },
        stats: {
          totalReviews: 2, // Low review count
          totalSkillsLearned: 1,
          totalFeedbackGiven: 1,
          totalFeedbackReceived: 1,
          averageRating: 4.0,
          daysActive: 5
        }
      };

      const message = getMotivationalMessage(userProgress);
      
      expect(message).toContain('Welcome');
      expect(message).toContain('🚀');
    });
  });

  describe('formatPoints', () => {
    it('formats small numbers correctly', () => {
      expect(formatPoints(0)).toBe('0');
      expect(formatPoints(42)).toBe('42');
      expect(formatPoints(999)).toBe('999');
    });

    it('formats thousands correctly', () => {
      expect(formatPoints(1000)).toBe('1.0K');
      expect(formatPoints(1500)).toBe('1.5K');
      expect(formatPoints(12345)).toBe('12.3K');
      expect(formatPoints(999999)).toBe('1000.0K');
    });

    it('formats millions correctly', () => {
      expect(formatPoints(1000000)).toBe('1.0M');
      expect(formatPoints(1500000)).toBe('1.5M');
      expect(formatPoints(12345678)).toBe('12.3M');
    });
  });

  describe('PREDEFINED_BADGES', () => {
    it('contains valid badge definitions', () => {
      expect(PREDEFINED_BADGES.length).toBeGreaterThan(0);
      
      PREDEFINED_BADGES.forEach(badge => {
        expect(badge).toHaveProperty('id');
        expect(badge).toHaveProperty('name');
        expect(badge).toHaveProperty('description');
        expect(badge).toHaveProperty('icon');
        expect(badge).toHaveProperty('category');
        expect(badge).toHaveProperty('rarity');
        expect(badge).toHaveProperty('criteria');
        expect(badge).toHaveProperty('points');
        
        expect(typeof badge.id).toBe('string');
        expect(typeof badge.name).toBe('string');
        expect(typeof badge.description).toBe('string');
        expect(typeof badge.icon).toBe('string');
        expect(typeof badge.points).toBe('number');
        expect(badge.points).toBeGreaterThan(0);
      });
    });

    it('has unique badge IDs', () => {
      const ids = PREDEFINED_BADGES.map(badge => badge.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('PREDEFINED_ACHIEVEMENTS', () => {
    it('contains valid achievement definitions', () => {
      expect(PREDEFINED_ACHIEVEMENTS.length).toBeGreaterThan(0);
      
      PREDEFINED_ACHIEVEMENTS.forEach(achievement => {
        expect(achievement).toHaveProperty('id');
        expect(achievement).toHaveProperty('name');
        expect(achievement).toHaveProperty('description');
        expect(achievement).toHaveProperty('icon');
        expect(achievement).toHaveProperty('category');
        expect(achievement).toHaveProperty('tier');
        expect(achievement).toHaveProperty('points');
        expect(achievement).toHaveProperty('requirements');
        expect(achievement).toHaveProperty('rewards');
        
        expect(typeof achievement.id).toBe('string');
        expect(typeof achievement.name).toBe('string');
        expect(typeof achievement.points).toBe('number');
        expect(Array.isArray(achievement.requirements)).toBe(true);
        expect(Array.isArray(achievement.rewards)).toBe(true);
        expect(achievement.points).toBeGreaterThan(0);
      });
    });

    it('has unique achievement IDs', () => {
      const ids = PREDEFINED_ACHIEVEMENTS.map(achievement => achievement.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});
