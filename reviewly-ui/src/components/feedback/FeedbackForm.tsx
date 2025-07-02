/**
 * Feedback Form Component for Reviewly Application
 * 
 * Comprehensive form for giving structured feedback with rating,
 * strengths, improvements, and anonymous options.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/SimpleAuthContext';
import type { FeedbackItem, FeedbackRequest } from '../../pages/FeedbackPage';
import './FeedbackForm.css';

interface FeedbackFormProps {
  request?: FeedbackRequest | null;
  onSubmit: (feedback: Omit<FeedbackItem, 'id' | 'createdDate' | 'lastUpdated'>) => void;
  onCancel: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  request,
  onSubmit,
  onCancel,
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    toUserId: '',
    toUserName: '',
    type: 'peer' as FeedbackItem['type'],
    category: 'performance' as FeedbackItem['category'],
    isAnonymous: false,
    content: '',
    rating: 0,
    strengths: [''],
    improvements: [''],
    tags: [] as string[],
    isPublic: false,
    status: 'submitted' as FeedbackItem['status'],
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { id: 'recipient', title: 'Recipient', icon: '👤' },
    { id: 'content', title: 'Feedback', icon: '💬' },
    { id: 'details', title: 'Details', icon: '📝' },
    { id: 'review', title: 'Review', icon: '✅' },
  ];

  // Mock users for recipient selection
  const availableUsers = [
    { id: 'user_demo2', name: 'Sarah Johnson', department: 'Engineering', position: 'Senior Developer' },
    { id: 'user_demo3', name: 'Mike Chen', department: 'Design', position: 'UX Designer' },
    { id: 'user_demo4', name: 'Emily Davis', department: 'Product', position: 'Product Manager' },
    { id: 'user_demo5', name: 'Alex Rodriguez', department: 'Engineering', position: 'Tech Lead' },
  ];

  // Initialize form with request data if available
  useEffect(() => {
    if (request) {
      setFormData(prev => ({
        ...prev,
        category: request.category,
        isAnonymous: request.isAnonymous,
      }));
    }
  }, [request]);

  // Validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.toUserId) {
        newErrors.toUserId = 'Please select a recipient';
      }
    }

    if (step === 1) {
      if (!formData.content.trim()) {
        newErrors.content = 'Feedback content is required';
      }
      if (formData.content.trim().length < 10) {
        newErrors.content = 'Feedback must be at least 10 characters long';
      }
    }

    if (step === 2) {
      const validStrengths = formData.strengths.filter(s => s.trim());
      const validImprovements = formData.improvements.filter(i => i.trim());
      
      if (validStrengths.length === 0 && validImprovements.length === 0) {
        newErrors.details = 'Please provide at least one strength or improvement area';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      const feedbackData = {
        ...formData,
        fromUserId: user?.id || '',
        fromUserName: user?.name || '',
        fromUserAvatar: user?.avatar,
        strengths: formData.strengths.filter(s => s.trim()),
        improvements: formData.improvements.filter(i => i.trim()),
        requestId: request?.id,
      };
      onSubmit(feedbackData);
    }
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  // Handle recipient selection
  const handleRecipientSelect = (userId: string, userName: string) => {
    setFormData(prev => ({
      ...prev,
      toUserId: userId,
      toUserName: userName,
    }));
  };

  // Handle tag addition
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  // Handle strength/improvement updates
  const updateListItem = (
    list: 'strengths' | 'improvements',
    index: number,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [list]: prev[list].map((item, i) => i === index ? value : item),
    }));
  };

  const addListItem = (list: 'strengths' | 'improvements') => {
    setFormData(prev => ({
      ...prev,
      [list]: [...prev[list], ''],
    }));
  };

  const removeListItem = (list: 'strengths' | 'improvements', index: number) => {
    setFormData(prev => ({
      ...prev,
      [list]: prev[list].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="feedback-form-overlay">
      <div className="feedback-form-modal">
        <div className="feedback-form-header">
          <h2>Give Feedback</h2>
          <button
            className="btn btn-ghost btn-small"
            onClick={onCancel}
          >
            ✕
          </button>
        </div>

        {/* Step Navigation */}
        <div className="step-navigation">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`step-item ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
            >
              <div className="step-icon">{step.icon}</div>
              <div className="step-title">{step.title}</div>
            </div>
          ))}
        </div>

        <div className="feedback-form-content">
          {/* Step 0: Recipient Selection */}
          {currentStep === 0 && (
            <div className="form-step">
              <h3>Select Recipient</h3>
              <p>Who would you like to give feedback to?</p>
              
              {request ? (
                <div className="request-info">
                  <p>This feedback is in response to a request from:</p>
                  <div className="requester-info">
                    <strong>{request.requesterName}</strong>
                    <span>Category: {request.category}</span>
                  </div>
                </div>
              ) : (
                <div className="recipient-selection">
                  {availableUsers.map(user => (
                    <div
                      key={user.id}
                      className={`recipient-card ${formData.toUserId === user.id ? 'selected' : ''}`}
                      onClick={() => handleRecipientSelect(user.id, user.name)}
                    >
                      <div className="recipient-avatar">
                        {user.name.charAt(0)}
                      </div>
                      <div className="recipient-info">
                        <h4>{user.name}</h4>
                        <p>{user.position}</p>
                        <span>{user.department}</span>
                      </div>
                      {formData.toUserId === user.id && (
                        <div className="selected-indicator">✓</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {errors.toUserId && <span className="error-message">{errors.toUserId}</span>}
            </div>
          )}

          {/* Step 1: Feedback Content */}
          {currentStep === 1 && (
            <div className="form-step">
              <h3>Your Feedback</h3>
              <p>Share your honest and constructive feedback.</p>
              
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as FeedbackItem['category'] }))}
                  disabled={!!request}
                >
                  <option value="performance">📊 Performance</option>
                  <option value="collaboration">🤝 Collaboration</option>
                  <option value="leadership">👑 Leadership</option>
                  <option value="communication">💬 Communication</option>
                  <option value="technical">⚙️ Technical</option>
                  <option value="general">📝 General</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="content">Feedback Content *</label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Share your feedback in a constructive and specific way..."
                  rows={6}
                  className={errors.content ? 'error' : ''}
                />
                {errors.content && <span className="error-message">{errors.content}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="rating">Overall Rating (Optional)</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`star-button ${star <= formData.rating ? 'filled' : 'empty'}`}
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    >
                      ⭐
                    </button>
                  ))}
                  <span className="rating-label">
                    {formData.rating > 0 ? `${formData.rating}/5` : 'No rating'}
                  </span>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isAnonymous}
                    onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                    disabled={!!request && !request.isAnonymous}
                  />
                  Give feedback anonymously
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                  />
                  Make this feedback visible to others
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Detailed Feedback */}
          {currentStep === 2 && (
            <div className="form-step">
              <h3>Detailed Feedback</h3>
              <p>Provide specific strengths and areas for improvement.</p>
              
              {/* Strengths */}
              <div className="feedback-section">
                <h4>💪 Strengths</h4>
                <p>What does this person do well?</p>
                
                {formData.strengths.map((strength, index) => (
                  <div key={index} className="list-item">
                    <input
                      type="text"
                      value={strength}
                      onChange={(e) => updateListItem('strengths', index, e.target.value)}
                      placeholder="e.g., Excellent communication skills"
                    />
                    {formData.strengths.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-small"
                        onClick={() => removeListItem('strengths', index)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  className="btn btn-outline btn-small"
                  onClick={() => addListItem('strengths')}
                >
                  + Add Strength
                </button>
              </div>

              {/* Areas for Improvement */}
              <div className="feedback-section">
                <h4>🎯 Areas for Improvement</h4>
                <p>What could this person work on?</p>
                
                {formData.improvements.map((improvement, index) => (
                  <div key={index} className="list-item">
                    <input
                      type="text"
                      value={improvement}
                      onChange={(e) => updateListItem('improvements', index, e.target.value)}
                      placeholder="e.g., Could be more proactive in meetings"
                    />
                    {formData.improvements.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-small"
                        onClick={() => removeListItem('improvements', index)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  className="btn btn-outline btn-small"
                  onClick={() => addListItem('improvements')}
                >
                  + Add Improvement Area
                </button>
              </div>

              {/* Tags */}
              <div className="form-group">
                <label>Tags</label>
                <div className="tags-input">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add tags (press Enter)"
                  />
                  <button
                    type="button"
                    className="btn btn-primary btn-small"
                    onClick={handleAddTag}
                  >
                    Add
                  </button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="tags-list">
                    {formData.tags.map(tag => (
                      <span key={tag} className="tag">
                        #{tag}
                        <button onClick={() => handleRemoveTag(tag)}>✕</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {errors.details && <span className="error-message">{errors.details}</span>}
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="form-step">
              <h3>Review Your Feedback</h3>
              <p>Please review your feedback before submitting.</p>
              
              <div className="feedback-review">
                <div className="review-section">
                  <h4>Recipient</h4>
                  <p>{formData.toUserName}</p>
                </div>

                <div className="review-section">
                  <h4>Category & Rating</h4>
                  <p>{formData.category}</p>
                  {formData.rating > 0 && <p>Rating: {formData.rating}/5 ⭐</p>}
                </div>

                <div className="review-section">
                  <h4>Feedback Content</h4>
                  <p>{formData.content}</p>
                </div>

                {formData.strengths.filter(s => s.trim()).length > 0 && (
                  <div className="review-section">
                    <h4>Strengths</h4>
                    <ul>
                      {formData.strengths.filter(s => s.trim()).map((strength, index) => (
                        <li key={index}>✅ {strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {formData.improvements.filter(i => i.trim()).length > 0 && (
                  <div className="review-section">
                    <h4>Areas for Improvement</h4>
                    <ul>
                      {formData.improvements.filter(i => i.trim()).map((improvement, index) => (
                        <li key={index}>💡 {improvement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="review-section">
                  <h4>Options</h4>
                  <p>Anonymous: {formData.isAnonymous ? 'Yes' : 'No'}</p>
                  <p>Public: {formData.isPublic ? 'Yes' : 'No'}</p>
                  {formData.tags.length > 0 && (
                    <p>Tags: {formData.tags.join(', ')}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Navigation */}
        <div className="feedback-form-footer">
          <div className="form-navigation">
            <button
              className="btn btn-outline btn-medium"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              ← Previous
            </button>
            
            <span className="step-indicator">
              Step {currentStep + 1} of {steps.length}
            </span>
            
            {currentStep < steps.length - 1 ? (
              <button
                className="btn btn-primary btn-medium"
                onClick={handleNext}
              >
                Next →
              </button>
            ) : (
              <button
                className="btn btn-success btn-medium"
                onClick={handleSubmit}
              >
                Submit Feedback
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
