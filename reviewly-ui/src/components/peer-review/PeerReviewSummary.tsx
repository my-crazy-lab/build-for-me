/**
 * Peer Review Summary Component for Reviewly Application
 * 
 * Display aggregated peer feedback with anonymized insights,
 * category breakdowns, and trend analysis.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState } from 'react';
import type { PeerReviewSummary } from '../../utils/peerReview';
import './PeerReviewSummary.css';

interface PeerReviewSummaryProps {
  summary: PeerReviewSummary;
  showDetailedBreakdown?: boolean;
}

const PeerReviewSummary: React.FC<PeerReviewSummaryProps> = ({
  summary,
  showDetailedBreakdown = true
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'feedback' | 'insights'>('overview');

  const getSentimentIcon = (sentiment: PeerReviewSummary['sentiment']) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😟';
      case 'mixed': return '😐';
      default: return '😶';
    }
  };

  const getSentimentColor = (sentiment: PeerReviewSummary['sentiment']) => {
    switch (sentiment) {
      case 'positive': return 'var(--color-success)';
      case 'negative': return 'var(--color-danger)';
      case 'mixed': return 'var(--color-warning)';
      default: return 'var(--color-text-secondary)';
    }
  };

  const getConfidenceLevel = (score: number) => {
    if (score >= 0.8) return { level: 'High', color: 'var(--color-success)' };
    if (score >= 0.6) return { level: 'Medium', color: 'var(--color-warning)' };
    return { level: 'Low', color: 'var(--color-danger)' };
  };

  const renderRatingDistribution = (distribution: number[], category: string) => {
    const total = distribution.reduce((sum, count) => sum + count, 0);
    
    return (
      <div className="rating-distribution">
        <h5>{category.replace('_', ' ').toUpperCase()}</h5>
        <div className="distribution-bars">
          {distribution.map((count, index) => {
            const percentage = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={index} className="distribution-item">
                <span className="rating-label">{index + 1}</span>
                <div className="distribution-bar">
                  <div 
                    className="distribution-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="count-label">{count}</span>
              </div>
            );
          })}
        </div>
        <div className="category-average">
          Average: {summary.categoryRatings[category]?.average.toFixed(1)}/5
        </div>
      </div>
    );
  };

  const confidence = getConfidenceLevel(summary.confidenceScore);

  return (
    <div className="peer-review-summary">
      {/* Header */}
      <div className="summary-header">
        <div className="header-info">
          <h2>📊 Peer Review Summary</h2>
          <p>Aggregated feedback from {summary.totalReviews} colleague{summary.totalReviews !== 1 ? 's' : ''}</p>
        </div>
        
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <div className="stat-content">
              <div className="stat-value">{summary.averageRating.toFixed(1)}/5</div>
              <div className="stat-label">Overall Rating</div>
            </div>
          </div>
          
          <div className="stat-item">
            <span className="stat-icon" style={{ color: getSentimentColor(summary.sentiment) }}>
              {getSentimentIcon(summary.sentiment)}
            </span>
            <div className="stat-content">
              <div className="stat-value" style={{ color: getSentimentColor(summary.sentiment) }}>
                {summary.sentiment.charAt(0).toUpperCase() + summary.sentiment.slice(1)}
              </div>
              <div className="stat-label">Overall Sentiment</div>
            </div>
          </div>
          
          <div className="stat-item">
            <span className="stat-icon">🎯</span>
            <div className="stat-content">
              <div className="stat-value" style={{ color: confidence.color }}>
                {confidence.level}
              </div>
              <div className="stat-label">Confidence ({Math.round(summary.confidenceScore * 100)}%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="summary-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📋 Overview
        </button>
        <button
          className={`tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          📊 Categories
        </button>
        <button
          className={`tab ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('feedback')}
        >
          💬 Feedback
        </button>
        <button
          className={`tab ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          💡 Insights
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="overview-grid">
              <div className="overview-card">
                <h3>📈 Performance Snapshot</h3>
                <div className="performance-metrics">
                  <div className="metric">
                    <span className="metric-label">Reviews Received:</span>
                    <span className="metric-value">{summary.totalReviews}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Average Rating:</span>
                    <span className="metric-value">{summary.averageRating.toFixed(1)}/5</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Top Category:</span>
                    <span className="metric-value">
                      {Object.entries(summary.categoryRatings)
                        .sort(([,a], [,b]) => b.average - a.average)[0]?.[0]
                        ?.replace('_', ' ') || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="overview-card">
                <h3>👥 Reviewer Breakdown</h3>
                <div className="reviewer-stats">
                  {Object.entries(summary.reviewerBreakdown.byRelationship).map(([relationship, count]) => (
                    <div key={relationship} className="reviewer-stat">
                      <span className="relationship-label">
                        {relationship.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                      </span>
                      <span className="relationship-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {summary.commonThemes.length > 0 && (
              <div className="common-themes">
                <h3>🔍 Common Themes</h3>
                <div className="themes-list">
                  {summary.commonThemes.map((theme, index) => (
                    <span key={index} className="theme-tag">
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="categories-tab">
            <div className="categories-grid">
              {Object.entries(summary.categoryRatings).map(([category, data]) => (
                <div key={category} className="category-card">
                  {renderRatingDistribution(data.distribution, category)}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="feedback-tab">
            {summary.strengths.length > 0 && (
              <div className="feedback-section">
                <h3>💪 Strengths</h3>
                <div className="feedback-list">
                  {summary.strengths.map((strength, index) => (
                    <div key={index} className="feedback-item positive">
                      <div className="feedback-icon">✅</div>
                      <div className="feedback-text">{strength}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {summary.improvementAreas.length > 0 && (
              <div className="feedback-section">
                <h3>📈 Areas for Improvement</h3>
                <div className="feedback-list">
                  {summary.improvementAreas.map((area, index) => (
                    <div key={index} className="feedback-item improvement">
                      <div className="feedback-icon">🎯</div>
                      <div className="feedback-text">{area}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="insights-tab">
            <div className="insights-grid">
              <div className="insight-card">
                <h3>📊 Rating Analysis</h3>
                <div className="rating-insights">
                  <p>
                    Your average rating of <strong>{summary.averageRating.toFixed(1)}/5</strong> places you in the 
                    <strong> {summary.averageRating >= 4.5 ? 'top 10%' : 
                             summary.averageRating >= 4.0 ? 'top 25%' :
                             summary.averageRating >= 3.5 ? 'top 50%' : 'bottom 50%'}</strong> of performers.
                  </p>
                  <p>
                    Based on <strong>{summary.totalReviews}</strong> reviews, 
                    this assessment has <strong>{confidence.level.toLowerCase()}</strong> confidence.
                  </p>
                </div>
              </div>

              <div className="insight-card">
                <h3>🎯 Key Recommendations</h3>
                <div className="recommendations">
                  {summary.averageRating >= 4.0 ? (
                    <div className="recommendation">
                      <span className="rec-icon">🌟</span>
                      <span>Continue leveraging your strengths in leadership and mentoring roles.</span>
                    </div>
                  ) : (
                    <div className="recommendation">
                      <span className="rec-icon">📚</span>
                      <span>Focus on skill development in your lowest-rated categories.</span>
                    </div>
                  )}
                  
                  {summary.improvementAreas.length > 0 && (
                    <div className="recommendation">
                      <span className="rec-icon">🎯</span>
                      <span>Create an action plan to address the improvement areas identified.</span>
                    </div>
                  )}
                  
                  <div className="recommendation">
                    <span className="rec-icon">🤝</span>
                    <span>Seek regular feedback to maintain and improve your performance.</span>
                  </div>
                </div>
              </div>

              {showDetailedBreakdown && (
                <div className="insight-card">
                  <h3>🔍 Detailed Breakdown</h3>
                  <div className="detailed-stats">
                    {Object.entries(summary.reviewerBreakdown.byRole).length > 0 && (
                      <div className="breakdown-section">
                        <h4>By Role</h4>
                        {Object.entries(summary.reviewerBreakdown.byRole).map(([role, count]) => (
                          <div key={role} className="breakdown-item">
                            <span>{role}: {count}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {Object.entries(summary.reviewerBreakdown.byDepartment).length > 0 && (
                      <div className="breakdown-section">
                        <h4>By Department</h4>
                        {Object.entries(summary.reviewerBreakdown.byDepartment).map(([dept, count]) => (
                          <div key={dept} className="breakdown-item">
                            <span>{dept}: {count}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeerReviewSummary;
