/**
 * Goal Form Component for Reviewly Application
 * 
 * Comprehensive form for creating and editing goals with SMART criteria,
 * milestone management, and validation.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState, useEffect } from 'react';
import type { Goal, Milestone, SmartCriteria } from '../../pages/GoalsPage';
import './GoalForm.css';

interface GoalFormProps {
  goal?: Goal | null;
  onSave: (goal: Omit<Goal, 'id' | 'createdDate' | 'lastUpdated'>) => void;
  onCancel: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({
  goal,
  onSave,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'professional' as Goal['category'],
    priority: 'medium' as Goal['priority'],
    status: 'not-started' as Goal['status'],
    progress: 0,
    targetDate: '',
    milestones: [] as Milestone[],
    tags: [] as string[],
    isSmartGoal: false,
    smartCriteria: {
      specific: '',
      measurable: '',
      achievable: '',
      relevant: '',
      timeBound: '',
    } as SmartCriteria,
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { id: 'basic', title: 'Basic Information', icon: '📝' },
    { id: 'smart', title: 'SMART Criteria', icon: '🎯' },
    { id: 'milestones', title: 'Milestones', icon: '🏁' },
    { id: 'review', title: 'Review & Save', icon: '✅' },
  ];

  // Initialize form with existing goal data
  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title,
        description: goal.description,
        category: goal.category,
        priority: goal.priority,
        status: goal.status,
        progress: goal.progress,
        targetDate: goal.targetDate,
        milestones: goal.milestones,
        tags: goal.tags,
        isSmartGoal: goal.isSmartGoal,
        smartCriteria: goal.smartCriteria,
      });
    }
  }, [goal]);

  // Validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.title.trim()) {
        newErrors.title = 'Title is required';
      }
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      }
      if (!formData.targetDate) {
        newErrors.targetDate = 'Target date is required';
      } else if (new Date(formData.targetDate) <= new Date()) {
        newErrors.targetDate = 'Target date must be in the future';
      }
    }

    if (step === 1 && formData.isSmartGoal) {
      if (!formData.smartCriteria.specific.trim()) {
        newErrors.specific = 'Specific criteria is required for SMART goals';
      }
      if (!formData.smartCriteria.measurable.trim()) {
        newErrors.measurable = 'Measurable criteria is required for SMART goals';
      }
      if (!formData.smartCriteria.achievable.trim()) {
        newErrors.achievable = 'Achievable criteria is required for SMART goals';
      }
      if (!formData.smartCriteria.relevant.trim()) {
        newErrors.relevant = 'Relevant criteria is required for SMART goals';
      }
      if (!formData.smartCriteria.timeBound.trim()) {
        newErrors.timeBound = 'Time-bound criteria is required for SMART goals';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onSave(formData);
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

  // Handle milestone addition
  const handleAddMilestone = () => {
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title: '',
      description: '',
      targetDate: '',
      completed: false,
    };
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone],
    }));
  };

  // Handle milestone update
  const handleUpdateMilestone = (index: number, field: keyof Milestone, value: any) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) =>
        i === index ? { ...milestone, [field]: value } : milestone
      ),
    }));
  };

  // Handle milestone removal
  const handleRemoveMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="goal-form-overlay">
      <div className="goal-form-modal">
        <div className="goal-form-header">
          <h2>{goal ? 'Edit Goal' : 'Create New Goal'}</h2>
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

        <div className="goal-form-content">
          {/* Step 0: Basic Information */}
          {currentStep === 0 && (
            <div className="form-step">
              <h3>Basic Information</h3>
              
              <div className="form-group">
                <label htmlFor="title">Goal Title *</label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Master React Advanced Patterns"
                  className={errors.title ? 'error' : ''}
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what you want to achieve and why it's important..."
                  rows={4}
                  className={errors.description ? 'error' : ''}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Goal['category'] }))}
                  >
                    <option value="professional">💼 Professional</option>
                    <option value="personal">🌟 Personal</option>
                    <option value="skill">🎯 Skill Development</option>
                    <option value="project">📊 Project</option>
                    <option value="leadership">👑 Leadership</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Goal['priority'] }))}
                  >
                    <option value="low">📝 Low</option>
                    <option value="medium">📋 Medium</option>
                    <option value="high">⚡ High</option>
                    <option value="critical">🔥 Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="targetDate">Target Date *</label>
                  <input
                    id="targetDate"
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
                    className={errors.targetDate ? 'error' : ''}
                  />
                  {errors.targetDate && <span className="error-message">{errors.targetDate}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Goal['status'] }))}
                  >
                    <option value="not-started">⏳ Not Started</option>
                    <option value="in-progress">🚀 In Progress</option>
                    <option value="completed">✅ Completed</option>
                    <option value="blocked">🚫 Blocked</option>
                    <option value="cancelled">❌ Cancelled</option>
                  </select>
                </div>
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
            </div>
          )}

          {/* Step 1: SMART Criteria */}
          {currentStep === 1 && (
            <div className="form-step">
              <h3>SMART Criteria</h3>
              <p>Make your goal SMART (Specific, Measurable, Achievable, Relevant, Time-bound)</p>
              
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isSmartGoal}
                    onChange={(e) => setFormData(prev => ({ ...prev, isSmartGoal: e.target.checked }))}
                  />
                  This is a SMART goal
                </label>
              </div>

              {formData.isSmartGoal && (
                <>
                  <div className="form-group">
                    <label htmlFor="specific">Specific *</label>
                    <textarea
                      id="specific"
                      value={formData.smartCriteria.specific}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        smartCriteria: { ...prev.smartCriteria, specific: e.target.value }
                      }))}
                      placeholder="What exactly do you want to accomplish? Be clear and detailed."
                      rows={2}
                      className={errors.specific ? 'error' : ''}
                    />
                    {errors.specific && <span className="error-message">{errors.specific}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="measurable">Measurable *</label>
                    <textarea
                      id="measurable"
                      value={formData.smartCriteria.measurable}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        smartCriteria: { ...prev.smartCriteria, measurable: e.target.value }
                      }))}
                      placeholder="How will you measure progress and success? Include specific metrics."
                      rows={2}
                      className={errors.measurable ? 'error' : ''}
                    />
                    {errors.measurable && <span className="error-message">{errors.measurable}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="achievable">Achievable *</label>
                    <textarea
                      id="achievable"
                      value={formData.smartCriteria.achievable}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        smartCriteria: { ...prev.smartCriteria, achievable: e.target.value }
                      }))}
                      placeholder="Is this goal realistic? What resources and skills do you have?"
                      rows={2}
                      className={errors.achievable ? 'error' : ''}
                    />
                    {errors.achievable && <span className="error-message">{errors.achievable}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="relevant">Relevant *</label>
                    <textarea
                      id="relevant"
                      value={formData.smartCriteria.relevant}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        smartCriteria: { ...prev.smartCriteria, relevant: e.target.value }
                      }))}
                      placeholder="Why is this goal important? How does it align with your objectives?"
                      rows={2}
                      className={errors.relevant ? 'error' : ''}
                    />
                    {errors.relevant && <span className="error-message">{errors.relevant}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="timeBound">Time-bound *</label>
                    <textarea
                      id="timeBound"
                      value={formData.smartCriteria.timeBound}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        smartCriteria: { ...prev.smartCriteria, timeBound: e.target.value }
                      }))}
                      placeholder="What is your deadline? Include any interim deadlines."
                      rows={2}
                      className={errors.timeBound ? 'error' : ''}
                    />
                    {errors.timeBound && <span className="error-message">{errors.timeBound}</span>}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 2: Milestones */}
          {currentStep === 2 && (
            <div className="form-step">
              <h3>Milestones</h3>
              <p>Break down your goal into smaller, manageable milestones to track progress.</p>

              {formData.milestones.map((milestone, index) => (
                <div key={milestone.id} className="milestone-form-item">
                  <div className="milestone-header">
                    <h4>Milestone {index + 1}</h4>
                    {formData.milestones.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-danger btn-small"
                        onClick={() => handleRemoveMilestone(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Milestone Title</label>
                    <input
                      type="text"
                      value={milestone.title}
                      onChange={(e) => handleUpdateMilestone(index, 'title', e.target.value)}
                      placeholder="e.g., Complete React course"
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={milestone.description}
                      onChange={(e) => handleUpdateMilestone(index, 'description', e.target.value)}
                      placeholder="Describe what needs to be accomplished for this milestone"
                      rows={2}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Target Date</label>
                      <input
                        type="date"
                        value={milestone.targetDate}
                        onChange={(e) => handleUpdateMilestone(index, 'targetDate', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={milestone.completed}
                          onChange={(e) => handleUpdateMilestone(index, 'completed', e.target.checked)}
                        />
                        Mark as completed
                      </label>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-outline btn-medium"
                onClick={handleAddMilestone}
              >
                + Add Milestone
              </button>
            </div>
          )}

          {/* Step 3: Review & Save */}
          {currentStep === 3 && (
            <div className="form-step">
              <h3>Review & Save</h3>
              <p>Review your goal details before saving.</p>

              <div className="goal-review">
                <div className="review-section">
                  <h4>Basic Information</h4>
                  <div className="review-item">
                    <strong>Title:</strong> {formData.title}
                  </div>
                  <div className="review-item">
                    <strong>Description:</strong> {formData.description}
                  </div>
                  <div className="review-item">
                    <strong>Category:</strong> {formData.category}
                  </div>
                  <div className="review-item">
                    <strong>Priority:</strong> {formData.priority}
                  </div>
                  <div className="review-item">
                    <strong>Target Date:</strong> {new Date(formData.targetDate).toLocaleDateString()}
                  </div>
                  <div className="review-item">
                    <strong>Status:</strong> {formData.status}
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="review-item">
                      <strong>Tags:</strong> {formData.tags.join(', ')}
                    </div>
                  )}
                </div>

                {formData.isSmartGoal && (
                  <div className="review-section">
                    <h4>SMART Criteria</h4>
                    <div className="review-item">
                      <strong>Specific:</strong> {formData.smartCriteria.specific}
                    </div>
                    <div className="review-item">
                      <strong>Measurable:</strong> {formData.smartCriteria.measurable}
                    </div>
                    <div className="review-item">
                      <strong>Achievable:</strong> {formData.smartCriteria.achievable}
                    </div>
                    <div className="review-item">
                      <strong>Relevant:</strong> {formData.smartCriteria.relevant}
                    </div>
                    <div className="review-item">
                      <strong>Time-bound:</strong> {formData.smartCriteria.timeBound}
                    </div>
                  </div>
                )}

                {formData.milestones.length > 0 && (
                  <div className="review-section">
                    <h4>Milestones ({formData.milestones.length})</h4>
                    {formData.milestones.map((milestone, index) => (
                      <div key={milestone.id} className="review-milestone">
                        <strong>{index + 1}. {milestone.title}</strong>
                        {milestone.description && <p>{milestone.description}</p>}
                        <span>Due: {milestone.targetDate ? new Date(milestone.targetDate).toLocaleDateString() : 'No date set'}</span>
                        {milestone.completed && <span className="completed-badge">✅ Completed</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Form Navigation */}
        <div className="goal-form-footer">
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
                {goal ? 'Update Goal' : 'Create Goal'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalForm;
