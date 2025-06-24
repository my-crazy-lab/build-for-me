/**
 * Peer Review Form Component for Reviewly Application
 * 
 * Anonymous peer review form with rating scales, text feedback,
 * and anonymity protection features.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState, useEffect } from 'react';
import type { 
  PeerReviewRequest, 
  PeerReviewQuestion, 
  PeerReviewResponse,
  PeerReview 
} from '../../utils/peerReview';
import { 
  generateAnonymityHash, 
  calculateOverallRating,
  anonymizeReviewerInfo 
} from '../../utils/peerReview';
import './PeerReviewForm.css';

interface PeerReviewFormProps {
  request: PeerReviewRequest;
  currentUserId: string;
  onSubmit: (review: Omit<PeerReview, 'id'>) => void;
  onSave?: (responses: PeerReviewResponse[]) => void;
  isSubmitting?: boolean;
}

const PeerReviewForm: React.FC<PeerReviewFormProps> = ({
  request,
  currentUserId,
  onSubmit,
  onSave,
  isSubmitting = false
}) => {
  const [responses, setResponses] = useState<PeerReviewResponse[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const questions = request.customQuestions || [];
  const sectionsMap = questions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {} as Record<string, PeerReviewQuestion[]>);

  const sections = Object.keys(sectionsMap);
  const currentSectionQuestions = sectionsMap[sections[currentSection]] || [];

  // Load saved responses
  useEffect(() => {
    const savedKey = `peer-review-${request.id}-${currentUserId}`;
    const saved = localStorage.getItem(savedKey);
    if (saved) {
      try {
        const savedResponses = JSON.parse(saved);
        setResponses(savedResponses);
      } catch (error) {
        console.error('Failed to load saved responses:', error);
      }
    }
  }, [request.id, currentUserId]);

  // Auto-save responses
  useEffect(() => {
    if (hasUnsavedChanges && responses.length > 0) {
      const savedKey = `peer-review-${request.id}-${currentUserId}`;
      localStorage.setItem(savedKey, JSON.stringify(responses));
      onSave?.(responses);
      setHasUnsavedChanges(false);
    }
  }, [responses, hasUnsavedChanges, request.id, currentUserId, onSave]);

  const updateResponse = (questionId: string, value: string | number | string[], type: PeerReviewResponse['type']) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    setResponses(prev => {
      const existing = prev.find(r => r.questionId === questionId);
      const newResponse: PeerReviewResponse = {
        questionId,
        type,
        value,
        category: question.category
      };

      if (existing) {
        return prev.map(r => r.questionId === questionId ? newResponse : r);
      } else {
        return [...prev, newResponse];
      }
    });
    setHasUnsavedChanges(true);
  };

  const getResponseValue = (questionId: string): any => {
    const response = responses.find(r => r.questionId === questionId);
    return response?.value || '';
  };

  const isQuestionAnswered = (question: PeerReviewQuestion): boolean => {
    const response = responses.find(r => r.questionId === question.id);
    if (!response) return false;
    
    if (question.type === 'text') {
      return typeof response.value === 'string' && response.value.trim().length > 0;
    }
    
    return response.value !== undefined && response.value !== '';
  };

  const canProceedToNextSection = (): boolean => {
    const requiredQuestions = currentSectionQuestions.filter(q => q.required);
    return requiredQuestions.every(q => isQuestionAnswered(q));
  };

  const canSubmitReview = (): boolean => {
    const requiredQuestions = questions.filter(q => q.required);
    return requiredQuestions.every(q => isQuestionAnswered(q));
  };

  const handleSubmit = () => {
    if (!canSubmitReview()) return;

    const reviewerData = {
      role: 'Software Engineer', // Mock data
      department: 'Engineering',
      workRelationship: getResponseValue('work_relationship'),
      collaborationFrequency: getResponseValue('collaboration_frequency')
    };

    const anonymizedMetadata = anonymizeReviewerInfo(
      currentUserId,
      request.anonymityLevel,
      reviewerData
    );

    const review: Omit<PeerReview, 'id'> = {
      requestId: request.id,
      reviewerId: isAnonymous ? generateAnonymityHash(currentUserId, request.id) : currentUserId,
      revieweeId: request.revieweeId,
      submittedAt: new Date(),
      responses,
      overallRating: calculateOverallRating(responses),
      anonymityHash: generateAnonymityHash(currentUserId, request.id),
      isAnonymous,
      reviewerMetadata: anonymizedMetadata
    };

    onSubmit(review);

    // Clear saved data
    const savedKey = `peer-review-${request.id}-${currentUserId}`;
    localStorage.removeItem(savedKey);
  };

  const renderRatingQuestion = (question: PeerReviewQuestion) => {
    const scale = question.ratingScale!;
    const currentValue = getResponseValue(question.id) as number;

    return (
      <div className="rating-question">
        <div className="rating-scale">
          {Array.from({ length: scale.max - scale.min + 1 }, (_, i) => {
            const value = scale.min + i;
            const label = scale.labels[i];
            
            return (
              <button
                key={value}
                type="button"
                className={`rating-option ${currentValue === value ? 'selected' : ''}`}
                onClick={() => updateResponse(question.id, value, 'rating')}
              >
                <span className="rating-number">{value}</span>
                <span className="rating-label">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTextQuestion = (question: PeerReviewQuestion) => {
    return (
      <textarea
        className="text-input"
        value={getResponseValue(question.id) as string}
        onChange={(e) => updateResponse(question.id, e.target.value, 'text')}
        placeholder="Please provide your feedback..."
        rows={4}
      />
    );
  };

  const renderMultipleChoiceQuestion = (question: PeerReviewQuestion) => {
    const currentValue = getResponseValue(question.id) as string;

    return (
      <div className="multiple-choice">
        {question.options?.map((option, index) => (
          <label key={index} className="choice-option">
            <input
              type="radio"
              name={question.id}
              value={option}
              checked={currentValue === option}
              onChange={(e) => updateResponse(question.id, e.target.value, 'multiple_choice')}
            />
            <span className="choice-label">{option}</span>
          </label>
        ))}
      </div>
    );
  };

  const renderQuestion = (question: PeerReviewQuestion) => {
    return (
      <div key={question.id} className="question-container">
        <div className="question-header">
          <h4 className="question-text">
            {question.question}
            {question.required && <span className="required-indicator">*</span>}
          </h4>
        </div>
        
        <div className="question-input">
          {question.type === 'rating' && renderRatingQuestion(question)}
          {question.type === 'text' && renderTextQuestion(question)}
          {question.type === 'multiple_choice' && renderMultipleChoiceQuestion(question)}
        </div>
      </div>
    );
  };

  const formatTimeRemaining = () => {
    const now = new Date();
    const timeLeft = request.dueDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return 'Overdue';
    if (daysLeft === 0) return 'Due today';
    if (daysLeft === 1) return '1 day remaining';
    return `${daysLeft} days remaining`;
  };

  return (
    <div className="peer-review-form">
      {/* Header */}
      <div className="form-header">
        <div className="reviewee-info">
          <h2>Peer Review for {request.revieweeName}</h2>
          <div className="reviewee-details">
            <span className="role">{request.revieweeRole}</span>
            <span className="department">{request.revieweeDepartment}</span>
          </div>
        </div>
        
        <div className="review-meta">
          <div className="due-date">
            <span className="label">Due:</span>
            <span className={`value ${formatTimeRemaining().includes('Overdue') ? 'overdue' : ''}`}>
              {formatTimeRemaining()}
            </span>
          </div>
          
          <div className="anonymity-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              <span className="toggle-text">Submit anonymously</span>
            </label>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {request.instructions && (
        <div className="instructions">
          <h3>Instructions</h3>
          <p>{request.instructions}</p>
        </div>
      )}

      {/* Progress */}
      <div className="progress-section">
        <div className="section-tabs">
          {sections.map((section, index) => (
            <button
              key={section}
              className={`section-tab ${index === currentSection ? 'active' : ''} ${
                index < currentSection ? 'completed' : ''
              }`}
              onClick={() => setCurrentSection(index)}
              disabled={index > currentSection && !canProceedToNextSection()}
            >
              <span className="section-number">{index + 1}</span>
              <span className="section-name">{section.replace('_', ' ').toUpperCase()}</span>
            </button>
          ))}
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="questions-section">
        <div className="section-header">
          <h3>{sections[currentSection]?.replace('_', ' ').toUpperCase()}</h3>
          <span className="question-count">
            {currentSectionQuestions.length} question{currentSectionQuestions.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="questions-list">
          {currentSectionQuestions.map(renderQuestion)}
        </div>
      </div>

      {/* Navigation */}
      <div className="form-navigation">
        <div className="nav-left">
          {currentSection > 0 && (
            <button
              type="button"
              className="btn btn-outline btn-medium"
              onClick={() => setCurrentSection(currentSection - 1)}
            >
              ← Previous Section
            </button>
          )}
        </div>
        
        <div className="nav-right">
          {currentSection < sections.length - 1 ? (
            <button
              type="button"
              className="btn btn-primary btn-medium"
              onClick={() => setCurrentSection(currentSection + 1)}
              disabled={!canProceedToNextSection()}
            >
              Next Section →
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-success btn-medium"
              onClick={handleSubmit}
              disabled={!canSubmitReview() || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          )}
        </div>
      </div>

      {/* Anonymity Notice */}
      <div className="anonymity-notice">
        <div className="notice-icon">🔒</div>
        <div className="notice-content">
          <h4>Privacy & Anonymity</h4>
          <p>
            {isAnonymous 
              ? 'Your review will be submitted anonymously. Your identity will not be revealed to the reviewee.'
              : 'Your review will include your name. The reviewee will know this feedback came from you.'
            }
          </p>
          {request.anonymityLevel !== 'fully_anonymous' && (
            <p className="anonymity-level">
              Note: {request.anonymityLevel === 'role_visible' 
                ? 'Your role may be visible to provide context.'
                : 'Your role and department may be visible to provide context.'
              }
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeerReviewForm;
