/**
 * Template Form Component for Reviewly Application
 * 
 * Comprehensive form for creating and editing review templates with
 * sections, questions, and validation rules.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/SimpleAuthContext';
import type { ReviewTemplate, TemplateSection, TemplateQuestion } from '../../pages/TemplatesPage';
import './TemplateForm.css';

interface TemplateFormProps {
  template?: ReviewTemplate | null;
  onSave: (template: Omit<ReviewTemplate, 'id' | 'createdDate' | 'lastUpdated' | 'usageCount'>) => void;
  onCancel: () => void;
}

const TemplateForm: React.FC<TemplateFormProps> = ({
  template,
  onSave,
  onCancel,
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'self-review' as ReviewTemplate['category'],
    type: 'company' as ReviewTemplate['type'],
    isDefault: false,
    isActive: true,
    sections: [] as TemplateSection[],
    tags: [] as string[],
    companyId: '',
    departmentId: '',
    roleId: '',
    createdBy: user?.id || '',
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { id: 'basic', title: 'Basic Info', icon: '📝' },
    { id: 'sections', title: 'Sections', icon: '📋' },
    { id: 'questions', title: 'Questions', icon: '❓' },
    { id: 'review', title: 'Review', icon: '✅' },
  ];

  // Initialize form with existing template data
  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        description: template.description,
        category: template.category,
        type: template.type,
        isDefault: template.isDefault,
        isActive: template.isActive,
        sections: template.sections,
        tags: template.tags,
        companyId: template.companyId || '',
        departmentId: template.departmentId || '',
        roleId: template.roleId || '',
        createdBy: template.createdBy,
      });
    }
  }, [template]);

  // Validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.name.trim()) {
        newErrors.name = 'Template name is required';
      }
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      }
    }

    if (step === 1) {
      if (formData.sections.length === 0) {
        newErrors.sections = 'At least one section is required';
      }
      formData.sections.forEach((section, index) => {
        if (!section.title.trim()) {
          newErrors[`section_${index}_title`] = 'Section title is required';
        }
      });
    }

    if (step === 2) {
      const hasQuestions = formData.sections.some(section => section.questions.length > 0);
      if (!hasQuestions) {
        newErrors.questions = 'At least one question is required';
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

  // Handle section addition
  const handleAddSection = () => {
    const newSection: TemplateSection = {
      id: Date.now().toString(),
      title: '',
      description: '',
      order: formData.sections.length + 1,
      isRequired: false,
      questions: [],
    };
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  // Handle section update
  const handleUpdateSection = (index: number, field: keyof TemplateSection, value: any) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      ),
    }));
  };

  // Handle section removal
  const handleRemoveSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  // Handle question addition
  const handleAddQuestion = (sectionIndex: number) => {
    const newQuestion: TemplateQuestion = {
      id: Date.now().toString(),
      text: '',
      type: 'text',
      isRequired: false,
      order: formData.sections[sectionIndex].questions.length + 1,
    };
    
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? { ...section, questions: [...section.questions, newQuestion] }
          : section
      ),
    }));
  };

  // Handle question update
  const handleUpdateQuestion = (
    sectionIndex: number,
    questionIndex: number,
    field: keyof TemplateQuestion,
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              questions: section.questions.map((question, j) =>
                j === questionIndex ? { ...question, [field]: value } : question
              ),
            }
          : section
      ),
    }));
  };

  // Handle question removal
  const handleRemoveQuestion = (sectionIndex: number, questionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              questions: section.questions.filter((_, j) => j !== questionIndex),
            }
          : section
      ),
    }));
  };

  return (
    <div className="template-form-overlay">
      <div className="template-form-modal">
        <div className="template-form-header">
          <h2>{template ? 'Edit Template' : 'Create New Template'}</h2>
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

        <div className="template-form-content">
          {/* Step 0: Basic Information */}
          {currentStep === 0 && (
            <div className="form-step">
              <h3>Basic Information</h3>
              <p>Define the basic properties of your template.</p>
              
              <div className="form-group">
                <label htmlFor="name">Template Name *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Quarterly Self-Review"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the purpose and scope of this template..."
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
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ReviewTemplate['category'] }))}
                  >
                    <option value="self-review">🪞 Self Review</option>
                    <option value="peer-review">👥 Peer Review</option>
                    <option value="manager-review">👔 Manager Review</option>
                    <option value="goal-setting">🎯 Goal Setting</option>
                    <option value="feedback">💬 Feedback</option>
                    <option value="custom">📝 Custom</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="type">Type</label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as ReviewTemplate['type'] }))}
                  >
                    <option value="company">🏢 Company-wide</option>
                    <option value="department">🏬 Department</option>
                    <option value="role">👤 Role-specific</option>
                    <option value="personal">⭐ Personal</option>
                  </select>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                  />
                  Set as default template
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                  Template is active
                </label>
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

          {/* Step 1: Sections */}
          {currentStep === 1 && (
            <div className="form-step">
              <h3>Template Sections</h3>
              <p>Organize your template into logical sections.</p>
              
              {formData.sections.map((section, index) => (
                <div key={section.id} className="section-form-item">
                  <div className="section-header">
                    <h4>Section {index + 1}</h4>
                    {formData.sections.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-danger btn-small"
                        onClick={() => handleRemoveSection(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>Section Title *</label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => handleUpdateSection(index, 'title', e.target.value)}
                      placeholder="e.g., Key Accomplishments"
                      className={errors[`section_${index}_title`] ? 'error' : ''}
                    />
                    {errors[`section_${index}_title`] && (
                      <span className="error-message">{errors[`section_${index}_title`]}</span>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={section.description}
                      onChange={(e) => handleUpdateSection(index, 'description', e.target.value)}
                      placeholder="Describe what this section covers..."
                      rows={2}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={section.isRequired}
                        onChange={(e) => handleUpdateSection(index, 'isRequired', e.target.checked)}
                      />
                      This section is required
                    </label>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                className="btn btn-outline btn-medium"
                onClick={handleAddSection}
              >
                + Add Section
              </button>
              
              {errors.sections && <span className="error-message">{errors.sections}</span>}
            </div>
          )}

          {/* Step 2: Questions */}
          {currentStep === 2 && (
            <div className="form-step">
              <h3>Template Questions</h3>
              <p>Add questions to each section of your template.</p>

              {formData.sections.map((section, sectionIndex) => (
                <div key={section.id} className="section-questions">
                  <div className="section-title">
                    <h4>{section.title}</h4>
                    <button
                      type="button"
                      className="btn btn-primary btn-small"
                      onClick={() => handleAddQuestion(sectionIndex)}
                    >
                      + Add Question
                    </button>
                  </div>

                  {section.questions.map((question, questionIndex) => (
                    <div key={question.id} className="question-form-item">
                      <div className="question-header">
                        <h5>Question {questionIndex + 1}</h5>
                        <button
                          type="button"
                          className="btn btn-danger btn-small"
                          onClick={() => handleRemoveQuestion(sectionIndex, questionIndex)}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="form-group">
                        <label>Question Text *</label>
                        <textarea
                          value={question.text}
                          onChange={(e) => handleUpdateQuestion(sectionIndex, questionIndex, 'text', e.target.value)}
                          placeholder="e.g., Describe your most important task this period"
                          rows={2}
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Question Type</label>
                          <select
                            value={question.type}
                            onChange={(e) => handleUpdateQuestion(sectionIndex, questionIndex, 'type', e.target.value)}
                          >
                            <option value="text">Text Input</option>
                            <option value="textarea">Text Area</option>
                            <option value="rating">Rating (1-5)</option>
                            <option value="multiple-choice">Multiple Choice</option>
                            <option value="checkbox">Checkbox</option>
                            <option value="date">Date</option>
                            <option value="number">Number</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={question.isRequired}
                              onChange={(e) => handleUpdateQuestion(sectionIndex, questionIndex, 'isRequired', e.target.checked)}
                            />
                            Required
                          </label>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Placeholder Text</label>
                        <input
                          type="text"
                          value={question.placeholder || ''}
                          onChange={(e) => handleUpdateQuestion(sectionIndex, questionIndex, 'placeholder', e.target.value)}
                          placeholder="Placeholder text for the input field"
                        />
                      </div>

                      <div className="form-group">
                        <label>Help Text</label>
                        <input
                          type="text"
                          value={question.helpText || ''}
                          onChange={(e) => handleUpdateQuestion(sectionIndex, questionIndex, 'helpText', e.target.value)}
                          placeholder="Additional guidance for answering this question"
                        />
                      </div>

                      {(question.type === 'multiple-choice' || question.type === 'checkbox') && (
                        <div className="form-group">
                          <label>Options (one per line)</label>
                          <textarea
                            value={question.options?.join('\n') || ''}
                            onChange={(e) => handleUpdateQuestion(sectionIndex, questionIndex, 'options', e.target.value.split('\n').filter(o => o.trim()))}
                            placeholder="Option 1&#10;Option 2&#10;Option 3"
                            rows={4}
                          />
                        </div>
                      )}

                      {/* Validation Rules */}
                      <div className="validation-section">
                        <h6>Validation Rules</h6>

                        {(question.type === 'text' || question.type === 'textarea') && (
                          <div className="form-row">
                            <div className="form-group">
                              <label>Min Length</label>
                              <input
                                type="number"
                                value={question.validation?.minLength || ''}
                                onChange={(e) => handleUpdateQuestion(sectionIndex, questionIndex, 'validation', {
                                  ...question.validation,
                                  minLength: e.target.value ? parseInt(e.target.value) : undefined
                                })}
                                placeholder="0"
                              />
                            </div>

                            <div className="form-group">
                              <label>Max Length</label>
                              <input
                                type="number"
                                value={question.validation?.maxLength || ''}
                                onChange={(e) => handleUpdateQuestion(sectionIndex, questionIndex, 'validation', {
                                  ...question.validation,
                                  maxLength: e.target.value ? parseInt(e.target.value) : undefined
                                })}
                                placeholder="1000"
                              />
                            </div>
                          </div>
                        )}

                        {(question.type === 'number' || question.type === 'rating') && (
                          <div className="form-row">
                            <div className="form-group">
                              <label>Min Value</label>
                              <input
                                type="number"
                                value={question.validation?.min || ''}
                                onChange={(e) => handleUpdateQuestion(sectionIndex, questionIndex, 'validation', {
                                  ...question.validation,
                                  min: e.target.value ? parseInt(e.target.value) : undefined
                                })}
                                placeholder="1"
                              />
                            </div>

                            <div className="form-group">
                              <label>Max Value</label>
                              <input
                                type="number"
                                value={question.validation?.max || ''}
                                onChange={(e) => handleUpdateQuestion(sectionIndex, questionIndex, 'validation', {
                                  ...question.validation,
                                  max: e.target.value ? parseInt(e.target.value) : undefined
                                })}
                                placeholder="5"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {section.questions.length === 0 && (
                    <div className="empty-questions">
                      <p>No questions added to this section yet.</p>
                      <button
                        type="button"
                        className="btn btn-outline btn-medium"
                        onClick={() => handleAddQuestion(sectionIndex)}
                      >
                        Add First Question
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {errors.questions && <span className="error-message">{errors.questions}</span>}
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="form-step">
              <h3>Review Template</h3>
              <p>Review your template before saving.</p>

              <div className="template-review">
                <div className="review-section">
                  <h4>Basic Information</h4>
                  <div className="review-item">
                    <strong>Name:</strong> {formData.name}
                  </div>
                  <div className="review-item">
                    <strong>Description:</strong> {formData.description}
                  </div>
                  <div className="review-item">
                    <strong>Category:</strong> {formData.category}
                  </div>
                  <div className="review-item">
                    <strong>Type:</strong> {formData.type}
                  </div>
                  <div className="review-item">
                    <strong>Default Template:</strong> {formData.isDefault ? 'Yes' : 'No'}
                  </div>
                  <div className="review-item">
                    <strong>Active:</strong> {formData.isActive ? 'Yes' : 'No'}
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="review-item">
                      <strong>Tags:</strong> {formData.tags.join(', ')}
                    </div>
                  )}
                </div>

                <div className="review-section">
                  <h4>Template Structure</h4>
                  <div className="review-item">
                    <strong>Sections:</strong> {formData.sections.length}
                  </div>
                  <div className="review-item">
                    <strong>Total Questions:</strong> {formData.sections.reduce((sum, section) => sum + section.questions.length, 0)}
                  </div>

                  {formData.sections.map((section, index) => (
                    <div key={section.id} className="review-section-item">
                      <h5>{index + 1}. {section.title} {section.isRequired && <span className="required-indicator">*</span>}</h5>
                      {section.description && <p>{section.description}</p>}
                      <div className="section-questions-summary">
                        <strong>Questions ({section.questions.length}):</strong>
                        <ul>
                          {section.questions.map((question, qIndex) => (
                            <li key={question.id}>
                              {qIndex + 1}. {question.text} ({question.type})
                              {question.isRequired && <span className="required-indicator">*</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Navigation */}
        <div className="template-form-footer">
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
                {template ? 'Update Template' : 'Create Template'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateForm;
