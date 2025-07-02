/**
 * Gamification Dashboard Component for Reviewly Application
 * 
 * Interactive dashboard showing user progress, badges, achievements,
 * and personalized goal suggestions with motivational elements.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState, useMemo } from 'react';
import type { 
  UserProgress, 
  Badge, 
  Achievement, 
  GoalSuggestion 
} from '../../utils/gamification';
import { 
  calculateLevel,
  calculateNextLevelXP,
  getRarityColor,
  getTierColor,
  checkBadgeProgress,
  generatePersonalizedGoals,
  calculateAchievementProgress,
  getMotivationalMessage,
  formatPoints,
  PREDEFINED_BADGES,
  PREDEFINED_ACHIEVEMENTS
} from '../../utils/gamification';
import './GamificationDashboard.css';

interface GamificationDashboardProps {
  userProgress: UserProgress;
  onGoalAccept?: (goal: GoalSuggestion) => void;
  onBadgeClick?: (badge: Badge) => void;
  onAchievementClick?: (achievement: Achievement) => void;
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({
  userProgress,
  onGoalAccept,
  onBadgeClick,
  onAchievementClick
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'achievements' | 'goals'>('overview');

  // Calculate progress metrics
  const currentLevel = useMemo(() => calculateLevel(userProgress.experiencePoints), [userProgress.experiencePoints]);
  const nextLevelXP = useMemo(() => calculateNextLevelXP(currentLevel), [currentLevel]);
  const levelProgress = useMemo(() => 
    ((userProgress.experiencePoints - (currentLevel - 1) * (currentLevel - 1) * 100) / 
     (nextLevelXP - (currentLevel - 1) * (currentLevel - 1) * 100)) * 100,
    [userProgress.experiencePoints, currentLevel, nextLevelXP]
  );

  // Generate available badges with progress
  const availableBadges = useMemo(() => {
    return PREDEFINED_BADGES.map(badge => {
      const userBadge = userProgress.badges.find(b => b.id === badge.id);
      if (userBadge) return userBadge;
      
      const progress = checkBadgeProgress(badge, userProgress.stats, userProgress.streaks);
      return { ...badge, progress };
    });
  }, [userProgress]);

  // Generate achievements with progress
  const availableAchievements = useMemo(() => {
    return PREDEFINED_ACHIEVEMENTS.map(achievement => {
      const userAchievement = userProgress.achievements.find(a => a.id === achievement.id);
      if (userAchievement) return userAchievement;
      
      const progress = calculateAchievementProgress(achievement, userProgress);
      return { ...achievement, progress };
    });
  }, [userProgress]);

  // Generate personalized goals
  const personalizedGoals = useMemo(() => 
    generatePersonalizedGoals(userProgress), 
    [userProgress]
  );

  const motivationalMessage = useMemo(() => 
    getMotivationalMessage(userProgress), 
    [userProgress]
  );

  const renderOverviewTab = () => (
    <div className="overview-tab">
      {/* Level Progress */}
      <div className="level-section">
        <div className="level-display">
          <div className="level-icon">🏆</div>
          <div className="level-info">
            <div className="level-number">Level {currentLevel}</div>
            <div className="level-title">Professional Developer</div>
          </div>
        </div>
        
        <div className="xp-progress">
          <div className="xp-bar">
            <div 
              className="xp-fill"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
          <div className="xp-text">
            {userProgress.experiencePoints} / {nextLevelXP} XP
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="motivation-card">
        <div className="motivation-message">{motivationalMessage}</div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{formatPoints(userProgress.totalPoints)}</div>
            <div className="stat-label">Total Points</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🏅</div>
          <div className="stat-content">
            <div className="stat-value">{userProgress.badges.filter(b => b.unlockedAt).length}</div>
            <div className="stat-label">Badges Earned</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-value">{userProgress.streaks.currentReviewStreak}</div>
            <div className="stat-label">Current Streak</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-value">{userProgress.stats.totalReviews}</div>
            <div className="stat-label">Reviews Done</div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="recent-section">
        <h3>🌟 Recent Achievements</h3>
        <div className="recent-badges">
          {userProgress.badges
            .filter(badge => badge.unlockedAt)
            .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
            .slice(0, 3)
            .map(badge => (
              <div key={badge.id} className="recent-badge">
                <div className="badge-icon">{badge.icon}</div>
                <div className="badge-info">
                  <div className="badge-name">{badge.name}</div>
                  <div className="badge-date">
                    {badge.unlockedAt?.toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderBadgesTab = () => (
    <div className="badges-tab">
      <div className="badges-grid">
        {availableBadges.map(badge => {
          const isUnlocked = badge.unlockedAt !== undefined;
          const progress = badge.progress || 0;
          
          return (
            <div 
              key={badge.id} 
              className={`badge-card ${isUnlocked ? 'unlocked' : 'locked'}`}
              onClick={() => onBadgeClick?.(badge)}
              style={{ borderColor: getRarityColor(badge.rarity) }}
            >
              <div className="badge-header">
                <div className="badge-icon-large">{badge.icon}</div>
                <div className="badge-rarity" style={{ color: getRarityColor(badge.rarity) }}>
                  {badge.rarity.toUpperCase()}
                </div>
              </div>
              
              <div className="badge-content">
                <div className="badge-name">{badge.name}</div>
                <div className="badge-description">{badge.description}</div>
                <div className="badge-points">+{badge.points} points</div>
              </div>
              
              {!isUnlocked && (
                <div className="badge-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="progress-text">{Math.round(progress)}%</div>
                </div>
              )}
              
              {isUnlocked && (
                <div className="badge-unlocked">
                  <div className="unlocked-icon">✅</div>
                  <div className="unlocked-date">
                    {badge.unlockedAt?.toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderAchievementsTab = () => (
    <div className="achievements-tab">
      <div className="achievements-list">
        {availableAchievements.map(achievement => {
          const isUnlocked = achievement.unlockedAt !== undefined;
          const progress = achievement.progress || 0;
          
          return (
            <div 
              key={achievement.id} 
              className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
              onClick={() => onAchievementClick?.(achievement)}
            >
              <div className="achievement-header">
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-info">
                  <div className="achievement-name">{achievement.name}</div>
                  <div className="achievement-tier" style={{ color: getTierColor(achievement.tier) }}>
                    {achievement.tier.toUpperCase()} TIER
                  </div>
                </div>
                <div className="achievement-points">
                  {formatPoints(achievement.points)} pts
                </div>
              </div>
              
              <div className="achievement-description">
                {achievement.description}
              </div>
              
              <div className="achievement-requirements">
                <h5>Requirements:</h5>
                <ul>
                  {achievement.requirements.map((req, index) => (
                    <li key={index} className={req.completed ? 'completed' : 'pending'}>
                      {req.completed && <span className="req-check">✅</span>}
                      {req.description}
                    </li>
                  ))}
                </ul>
              </div>
              
              {!isUnlocked && (
                <div className="achievement-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="progress-text">{Math.round(progress)}% Complete</div>
                </div>
              )}
              
              {achievement.rewards.length > 0 && (
                <div className="achievement-rewards">
                  <h5>Rewards:</h5>
                  <ul>
                    {achievement.rewards.map((reward, index) => (
                      <li key={index}>{reward.description}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderGoalsTab = () => (
    <div className="goals-tab">
      <div className="goals-section">
        <h3>🎯 Personalized Goals</h3>
        <div className="goals-list">
          {personalizedGoals.map(goal => (
            <div key={goal.id} className="goal-card">
              <div className="goal-header">
                <div className="goal-info">
                  <div className="goal-title">{goal.title}</div>
                  <div className="goal-meta">
                    <span className="goal-difficulty">{goal.difficulty.toUpperCase()}</span>
                    <span className="goal-time">{goal.estimatedTime}</span>
                    <span className="goal-points">+{goal.points} points</span>
                  </div>
                </div>
                <div className="goal-priority" style={{ 
                  color: goal.priority === 'high' ? 'var(--color-danger)' : 
                        goal.priority === 'medium' ? 'var(--color-warning)' : 'var(--color-success)'
                }}>
                  {goal.priority.toUpperCase()}
                </div>
              </div>
              
              <div className="goal-description">{goal.description}</div>
              
              <div className="goal-reason">
                <strong>Why this goal?</strong> {goal.personalizedReason}
              </div>
              
              <div className="goal-steps">
                <h5>Steps to complete:</h5>
                <ul>
                  {goal.steps.map(step => (
                    <li key={step.id} className={step.completed ? 'completed' : 'pending'}>
                      {step.completed && <span className="step-check">✅</span>}
                      <strong>{step.title}:</strong> {step.description}
                    </li>
                  ))}
                </ul>
              </div>
              
              {goal.relatedBadges.length > 0 && (
                <div className="goal-badges">
                  <h5>Related badges:</h5>
                  <div className="related-badges">
                    {goal.relatedBadges.map(badgeId => {
                      const badge = availableBadges.find(b => b.id === badgeId);
                      return badge ? (
                        <span key={badgeId} className="related-badge">
                          {badge.icon} {badge.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
              
              <div className="goal-actions">
                <button 
                  className="btn btn-primary btn-medium"
                  onClick={() => onGoalAccept?.(goal)}
                >
                  Accept Goal
                </button>
                <button className="btn btn-outline btn-medium">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {userProgress.currentGoals.length > 0 && (
        <div className="goals-section">
          <h3>📋 Current Goals</h3>
          <div className="current-goals">
            {userProgress.currentGoals.map(goal => (
              <div key={goal.id} className="current-goal">
                <div className="goal-title">{goal.title}</div>
                <div className="goal-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${(goal.steps.filter(s => s.completed).length / goal.steps.length) * 100}%` }}
                    />
                  </div>
                  <div className="progress-text">
                    {goal.steps.filter(s => s.completed).length} / {goal.steps.length} steps
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="gamification-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-info">
          <h2>🎮 Your Progress Journey</h2>
          <p>Track your growth, earn badges, and achieve your goals</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab ${activeTab === 'badges' ? 'active' : ''}`}
          onClick={() => setActiveTab('badges')}
        >
          🏅 Badges
          <span className="tab-count">{userProgress.badges.filter(b => b.unlockedAt).length}</span>
        </button>
        <button
          className={`tab ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          🏆 Achievements
          <span className="tab-count">{userProgress.achievements.filter(a => a.unlockedAt).length}</span>
        </button>
        <button
          className={`tab ${activeTab === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          🎯 Goals
          <span className="tab-count">{personalizedGoals.length}</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'badges' && renderBadgesTab()}
        {activeTab === 'achievements' && renderAchievementsTab()}
        {activeTab === 'goals' && renderGoalsTab()}
      </div>
    </div>
  );
};

export default GamificationDashboard;
