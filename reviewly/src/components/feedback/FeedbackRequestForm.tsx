/**
 * Feedback Request Form Component for Reviewly Application
 * 
 * Form for requesting feedback from colleagues with custom questions,
 * deadline setting, and recipient selection.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState } from 'react';
import { useAuth } from '../../contexts/SimpleAuthContext';
import type { FeedbackRequest, FeedbackItem } from '../../pages/FeedbackPage';
import './FeedbackRequestForm.css';

interface FeedbackRequestFormProps {
  onSubmit: (request: Omit<FeedbackRequest, 'id' | 'createdDate' | 'responses'>) => void;
  onCancel: () => void;
}

const FeedbackRequestForm: React.FC<FeedbackRequestFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    targetUserIds: [] as string[],
    targetUserNames: [] as string[],
    message: '',
    category: 'performance' as FeedbackItem['category'],
    deadline: '',
    isAnonymous: false,
    questions: [''] as string[],
    status: 'pending' as FeedbackRequest['status'],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock users for recipient selection
  const availableUsers = [
    { id: 'user_demo2', name: 'Sarah Johnson', department: 'Engineering', position: 'Senior Developer' },
    { id: 'user_demo3', name: 'Mike Chen', department: 'Design', position: 'UX Designer' },
    { id: 'user_demo4', name: 'Emily Davis', department: 'Product', position: 'Product Manager' },
    { id: 'user_demo5', name: 'Alex Rodriguez', department: 'Engineering', position: 'Tech Lead' },
    { id: 'user_demo6', name: 'Lisa Wang', department: 'Marketing', position: 'Marketing Manager' },
    { id: 'user_demo7', name: 'David Brown', department: 'Sales', position: 'Sales Director' },
  ];

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.targetUserIds.length === 0) {
      newErrors.recipients = 'Please select at least one recipient';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please provide a message explaining your request';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Please set a deadline for responses';
    } else if (new Date(formData.deadline) <= new Date()) {
      newErrors.deadline = 'Deadline must be in the future';
    }

    const validQuestions = formData.questions.filter(q => q.trim());
    if (validQuestions.length === 0) {
      newErrors.questions = 'Please provide at least one question';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const requestData = {
        ...formData,
        requesterId: user?.id || '',
        requesterName: user?.name || '',
        questions: formData.questions.filter(q => q.trim()),
      };
      onSubmit(requestData);
    }
  };

  // Handle recipient selection
  const handleRecipientToggle = (userId: string, userName: string) => {
    const isSelected = formData.targetUserIds.includes(userId);
    
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        targetUserIds: prev.targetUserIds.filter(id => id !== userId),
        targetUserNames: prev.targetUserNames.filter(name => name !== userName),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        targetUserIds: [...prev.targetUserIds, userId],
        targetUserNames: [...prev.targetUserNames, userName],
      }));
    }
  };

  // Handle question updates
  const updateQuestion = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => i === index ? value : q),
    }));
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, ''],
    }));
  };

  const removeQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  // Get default deadline (2 weeks from now)
  const getDefaultDeadline = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="feedback-request-form-overlay">
      <div className="feedback-request-form-modal">
        <div className="feedback-request-form-header">
          <h2>Request Feedback</h2>
          <button
            className="btn btn-ghost btn-small"
            onClick={onCancel}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="feedback-request-form-content">
          {/* Recipients Selection */}
          <div className="form-section">
            <h3>Select Recipients</h3>
            <p>Choose who you'd like to receive feedback from:</p>
            
            <div className="recipients-grid">
              {availableUsers.map(user => (
                <div
                  key={user.id}
                  className={`recipient-card ${formData.targetUserIds.includes(user.id) ? 'selected' : ''}`}
                  onClick={() => handleRecipientToggle(user.id, user.name)}
                >
                  <div className="recipient-avatar">
                    {user.name.charAt(0)}
                  </div>
                  <div className="recipient-info">
                    <h4>{user.name}</h4>
                    <p>{user.position}</p>
                    <span>{user.department}</span>
                  </div>
                  {formData.targetUserIds.includes(user.id) && (
                    <div className="selected-indicator">✓</div>
                  )}
                </div>
              ))}
            </div>
            
            {errors.recipients && <span className="error-message">{errors.recipients}</span>}
          </div>

          {/* Request Details */}
          <div className="form-section">
            <h3>Request Details</h3>
            
            <div className="form-group">
              <label htmlFor="category">Feedback Category</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as FeedbackItem['category'] }))}
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
              <label htmlFor="message">Message to Recipients *</label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Hi! I would appreciate your feedback on my performance this quarter. Please be honest and constructive in your response."
                rows={4}
                className={errors.message ? 'error' : ''}
              />
              {errors.message && <span className="error-message">{errors.message}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="deadline">Response Deadline *</label>
                <input
                  id="deadline"
                  type="date"
                  value={formData.deadline || getDefaultDeadline()}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  className={errors.deadline ? 'error' : ''}
                />
                {errors.deadline && <span className="error-message">{errors.deadline}</span>}
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isAnonymous}
                    onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                  />
                  Allow anonymous responses
                </label>
              </div>
            </div>
          </div>

          {/* Custom Questions */}
          <div className="form-section">
            <h3>Custom Questions</h3>
            <p>Add specific questions to guide the feedback:</p>
            
            {formData.questions.map((question, index) => (
              <div key={index} className="question-item">
                <div className="question-header">
                  <label>Question {index + 1}</label>
                  {formData.questions.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-small"
                      onClick={() => removeQuestion(index)}
                    >
                      ✕
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => updateQuestion(index, e.target.value)}
                  placeholder="e.g., How would you rate my collaboration skills?"
                />
              </div>
            ))}
            
            <button
              type="button"
              className="btn btn-outline btn-medium"
              onClick={addQuestion}
            >
              + Add Question
            </button>
            
            {errors.questions && <span className="error-message">{errors.questions}</span>}
          </div>

          {/* Suggested Questions */}
          <div className="form-section">
            <h3>Suggested Questions</h3>
            <p>Click to add common feedback questions:</p>
            
            <div className="suggested-questions">
              {[
                "What are my key strengths?",
                "What areas should I focus on for improvement?",
                "How effective is my communication?",
                "How well do I collaborate with the team?",
                "What specific examples can you share?",
                "How can I better support the team?",
                "What skills should I develop further?",
                "How do you see my leadership style?",
              ].map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  className="suggestion-btn"
                  onClick={() => {
                    if (!formData.questions.includes(suggestion)) {
                      const emptyIndex = formData.questions.findIndex(q => !q.trim());
                      if (emptyIndex >= 0) {
                        updateQuestion(emptyIndex, suggestion);
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          questions: [...prev.questions, suggestion],
                        }));
                      }
                    }
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="form-section">
            <h3>Request Summary</h3>
            <div className="request-summary">
              <div className="summary-item">
                <strong>Recipients:</strong> {formData.targetUserNames.join(', ') || 'None selected'}
              </div>
              <div className="summary-item">
                <strong>Category:</strong> {formData.category}
              </div>
              <div className="summary-item">
                <strong>Deadline:</strong> {formData.deadline ? new Date(formData.deadline).toLocaleDateString() : 'Not set'}
              </div>
              <div className="summary-item">
                <strong>Questions:</strong> {formData.questions.filter(q => q.trim()).length}
              </div>
              <div className="summary-item">
                <strong>Anonymous:</strong> {formData.isAnonymous ? 'Allowed' : 'Not allowed'}
              </div>
            </div>
          </div>
        </form>

        {/* Form Footer */}
        <div className="feedback-request-form-footer">
          <button
            type="button"
            className="btn btn-outline btn-medium"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-medium"
            onClick={handleSubmit}
          >
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackRequestForm;
