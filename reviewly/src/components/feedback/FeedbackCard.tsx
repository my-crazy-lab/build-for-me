/**
 * Feedback Card Component for Reviewly Application
 * 
 * Individual feedback display card with rating, strengths, improvements,
 * and acknowledgment functionality.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState } from 'react';
import type { FeedbackItem } from '../../pages/FeedbackPage';
import './FeedbackCard.css';

interface FeedbackCardProps {
  feedback: FeedbackItem;
  currentUserId: string;
  onAcknowledge: (feedbackId: string) => void;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  feedback,
  currentUserId,
  onAcknowledge,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Get category icon and color
  const getCategoryInfo = (category: FeedbackItem['category']) => {
    switch (category) {
      case 'performance':
        return { icon: '📊', color: 'primary', label: 'Performance' };
      case 'collaboration':
        return { icon: '🤝', color: 'success', label: 'Collaboration' };
      case 'leadership':
        return { icon: '👑', color: 'warning', label: 'Leadership' };
      case 'communication':
        return { icon: '💬', color: 'info', label: 'Communication' };
      case 'technical':
        return { icon: '⚙️', color: 'secondary', label: 'Technical' };
      default:
        return { icon: '📝', color: 'neutral', label: 'General' };
    }
  };

  // Get type icon and label
  const getTypeInfo = (type: FeedbackItem['type']) => {
    switch (type) {
      case 'peer':
        return { icon: '👥', label: 'Peer Feedback' };
      case 'manager':
        return { icon: '👔', label: 'Manager Feedback' };
      case 'direct-report':
        return { icon: '👤', label: 'Direct Report' };
      case 'self':
        return { icon: '🪞', label: 'Self Assessment' };
      default:
        return { icon: '💬', label: 'Feedback' };
    }
  };

  // Render star rating
  const renderRating = (rating?: number) => {
    if (!rating) return null;
    
    return (
      <div className="rating-display">
        <div className="stars">
          {[1, 2, 3, 4, 5].map(star => (
            <span
              key={star}
              className={`star ${star <= rating ? 'filled' : 'empty'}`}
            >
              ⭐
            </span>
          ))}
        </div>
        <span className="rating-value">{rating}/5</span>
      </div>
    );
  };

  const categoryInfo = getCategoryInfo(feedback.category);
  const typeInfo = getTypeInfo(feedback.type);
  const isReceived = feedback.toUserId === currentUserId;
  const canAcknowledge = isReceived && feedback.status === 'submitted';

  return (
    <div className={`feedback-card ${categoryInfo.color} ${feedback.isAnonymous ? 'anonymous' : ''}`}>
      {/* Card Header */}
      <div className="feedback-card-header">
        <div className="feedback-meta">
          <div className="user-info">
            {!feedback.isAnonymous && feedback.fromUserAvatar ? (
              <img
                src={feedback.fromUserAvatar}
                alt={feedback.fromUserName}
                className="user-avatar"
              />
            ) : (
              <div className="user-avatar anonymous">
                {feedback.isAnonymous ? '🎭' : feedback.fromUserName.charAt(0)}
              </div>
            )}
            <div className="user-details">
              <h4 className="user-name">
                {feedback.isAnonymous ? 'Anonymous Colleague' : feedback.fromUserName}
              </h4>
              <span className="feedback-date">
                {new Date(feedback.createdDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div className="feedback-badges">
            <span className={`category-badge ${categoryInfo.color}`}>
              {categoryInfo.icon} {categoryInfo.label}
            </span>
            <span className="type-badge">
              {typeInfo.icon} {typeInfo.label}
            </span>
            {feedback.isAnonymous && (
              <span className="anonymous-badge">
                🎭 Anonymous
              </span>
            )}
          </div>
        </div>

        <div className="feedback-actions">
          <button
            className="btn btn-ghost btn-small"
            onClick={() => setShowDetails(!showDetails)}
            title="Toggle details"
          >
            {showDetails ? '▼' : '▶'}
          </button>
          
          {canAcknowledge && (
            <button
              className="btn btn-primary btn-small"
              onClick={() => onAcknowledge(feedback.id)}
              title="Acknowledge feedback"
            >
              ✓ Acknowledge
            </button>
          )}
        </div>
      </div>

      {/* Rating */}
      {feedback.rating && (
        <div className="feedback-rating">
          {renderRating(feedback.rating)}
        </div>
      )}

      {/* Content */}
      <div className="feedback-content">
        <p className="feedback-text">{feedback.content}</p>
        
        {feedback.tags.length > 0 && (
          <div className="feedback-tags">
            {feedback.tags.map(tag => (
              <span key={tag} className="feedback-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Detailed View */}
      {showDetails && (
        <div className="feedback-details">
          {/* Strengths */}
          {feedback.strengths.length > 0 && (
            <div className="feedback-section">
              <h5 className="section-title">
                💪 Strengths
              </h5>
              <ul className="feedback-list">
                {feedback.strengths.map((strength, index) => (
                  <li key={index} className="feedback-item positive">
                    ✅ {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Areas for Improvement */}
          {feedback.improvements.length > 0 && (
            <div className="feedback-section">
              <h5 className="section-title">
                🎯 Areas for Improvement
              </h5>
              <ul className="feedback-list">
                {feedback.improvements.map((improvement, index) => (
                  <li key={index} className="feedback-item improvement">
                    💡 {improvement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Additional Info */}
          <div className="feedback-info">
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className={`status-badge ${feedback.status}`}>
                {feedback.status === 'submitted' ? '📤 Submitted' : 
                 feedback.status === 'acknowledged' ? '✅ Acknowledged' : 
                 '📝 Draft'}
              </span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Visibility:</span>
              <span className="visibility-badge">
                {feedback.isPublic ? '🌐 Public' : '🔒 Private'}
              </span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Last Updated:</span>
              <span className="date-value">
                {new Date(feedback.lastUpdated).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Status Indicator */}
      <div className="feedback-status">
        <div className={`status-indicator ${feedback.status}`}>
          {feedback.status === 'submitted' && '📤'}
          {feedback.status === 'acknowledged' && '✅'}
          {feedback.status === 'draft' && '📝'}
        </div>
        
        {isReceived && feedback.status === 'submitted' && (
          <span className="action-hint">
            Click "Acknowledge" to confirm you've read this feedback
          </span>
        )}
      </div>
    </div>
  );
};

export default FeedbackCard;
