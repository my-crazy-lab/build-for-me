/**
 * Template Card Component for Reviewly Application
 * 
 * Individual template display card with preview, usage statistics,
 * and management actions.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState } from 'react';
import type { ReviewTemplate } from '../../pages/TemplatesPage';
import './TemplateCard.css';

interface TemplateCardProps {
  template: ReviewTemplate;
  onEdit: (template: ReviewTemplate) => void;
  onDelete: (templateId: string) => void;
  onDuplicate: (template: ReviewTemplate) => void;
  onToggle: (templateId: string) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onEdit,
  onDelete,
  onDuplicate,
  onToggle,
}) => {
  const [showPreview, setShowPreview] = useState(false);

  // Get category icon and color
  const getCategoryInfo = (category: ReviewTemplate['category']) => {
    switch (category) {
      case 'self-review':
        return { icon: '🪞', color: 'primary', label: 'Self Review' };
      case 'peer-review':
        return { icon: '👥', color: 'success', label: 'Peer Review' };
      case 'manager-review':
        return { icon: '👔', color: 'warning', label: 'Manager Review' };
      case 'goal-setting':
        return { icon: '🎯', color: 'info', label: 'Goal Setting' };
      case 'feedback':
        return { icon: '💬', color: 'secondary', label: 'Feedback' };
      default:
        return { icon: '📝', color: 'neutral', label: 'Custom' };
    }
  };

  // Get type icon and label
  const getTypeInfo = (type: ReviewTemplate['type']) => {
    switch (type) {
      case 'company':
        return { icon: '🏢', label: 'Company-wide' };
      case 'department':
        return { icon: '🏬', label: 'Department' };
      case 'role':
        return { icon: '👤', label: 'Role-specific' };
      default:
        return { icon: '⭐', label: 'Personal' };
    }
  };

  const categoryInfo = getCategoryInfo(template.category);
  const typeInfo = getTypeInfo(template.type);

  // Calculate total questions
  const totalQuestions = template.sections.reduce((sum, section) => sum + section.questions.length, 0);

  return (
    <div className={`template-card ${categoryInfo.color} ${!template.isActive ? 'inactive' : ''}`}>
      {/* Card Header */}
      <div className="template-card-header">
        <div className="template-meta">
          <div className="template-badges">
            <span className={`category-badge ${categoryInfo.color}`}>
              {categoryInfo.icon} {categoryInfo.label}
            </span>
            <span className="type-badge">
              {typeInfo.icon} {typeInfo.label}
            </span>
            {template.isDefault && (
              <span className="default-badge">
                ⭐ Default
              </span>
            )}
            {!template.isActive && (
              <span className="inactive-badge">
                ⏸️ Inactive
              </span>
            )}
          </div>
        </div>

        <div className="template-actions">
          <button
            className="btn btn-ghost btn-small"
            onClick={() => setShowPreview(!showPreview)}
            title="Toggle preview"
          >
            {showPreview ? '▼' : '▶'}
          </button>
          
          <button
            className="btn btn-ghost btn-small"
            onClick={() => onDuplicate(template)}
            title="Duplicate template"
          >
            📋
          </button>
          
          <button
            className="btn btn-ghost btn-small"
            onClick={() => onEdit(template)}
            title="Edit template"
          >
            ✏️
          </button>
          
          <button
            className="btn btn-ghost btn-small"
            onClick={() => onToggle(template.id)}
            title={template.isActive ? 'Deactivate' : 'Activate'}
          >
            {template.isActive ? '⏸️' : '▶️'}
          </button>
          
          {!template.isDefault && (
            <button
              className="btn btn-ghost btn-small"
              onClick={() => onDelete(template.id)}
              title="Delete template"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      {/* Template Content */}
      <div className="template-content">
        <h3 className="template-title">{template.name}</h3>
        <p className="template-description">{template.description}</p>
        
        {template.tags.length > 0 && (
          <div className="template-tags">
            {template.tags.map(tag => (
              <span key={tag} className="template-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Template Stats */}
      <div className="template-stats">
        <div className="stat-item">
          <span className="stat-icon">📝</span>
          <span className="stat-label">Sections:</span>
          <span className="stat-value">{template.sections.length}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-icon">❓</span>
          <span className="stat-label">Questions:</span>
          <span className="stat-value">{totalQuestions}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-icon">📊</span>
          <span className="stat-label">Used:</span>
          <span className="stat-value">{template.usageCount} times</span>
        </div>
      </div>

      {/* Template Preview */}
      {showPreview && (
        <div className="template-preview">
          <h4>Template Preview</h4>
          
          {template.sections.map((section, sectionIndex) => (
            <div key={section.id} className="preview-section">
              <div className="section-header">
                <h5>
                  {sectionIndex + 1}. {section.title}
                  {section.isRequired && <span className="required-indicator">*</span>}
                </h5>
                {section.description && (
                  <p className="section-description">{section.description}</p>
                )}
              </div>
              
              <div className="section-questions">
                {section.questions.map((question, questionIndex) => (
                  <div key={question.id} className="preview-question">
                    <div className="question-header">
                      <span className="question-number">
                        {sectionIndex + 1}.{questionIndex + 1}
                      </span>
                      <span className="question-text">
                        {question.text}
                        {question.isRequired && <span className="required-indicator">*</span>}
                      </span>
                      <span className="question-type">
                        ({question.type})
                      </span>
                    </div>
                    
                    {question.helpText && (
                      <p className="question-help">{question.helpText}</p>
                    )}
                    
                    {question.placeholder && (
                      <p className="question-placeholder">
                        Placeholder: "{question.placeholder}"
                      </p>
                    )}
                    
                    {question.options && question.options.length > 0 && (
                      <div className="question-options">
                        <strong>Options:</strong>
                        <ul>
                          {question.options.map((option, optionIndex) => (
                            <li key={optionIndex}>{option}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {question.validation && (
                      <div className="question-validation">
                        <strong>Validation:</strong>
                        <ul>
                          {question.validation.minLength && (
                            <li>Min length: {question.validation.minLength}</li>
                          )}
                          {question.validation.maxLength && (
                            <li>Max length: {question.validation.maxLength}</li>
                          )}
                          {question.validation.min && (
                            <li>Min value: {question.validation.min}</li>
                          )}
                          {question.validation.max && (
                            <li>Max value: {question.validation.max}</li>
                          )}
                          {question.validation.pattern && (
                            <li>Pattern: {question.validation.pattern}</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Template Footer */}
      <div className="template-footer">
        <div className="template-dates">
          <div className="date-item">
            <span className="date-label">Created:</span>
            <span className="date-value">
              {new Date(template.createdDate).toLocaleDateString()}
            </span>
          </div>
          
          <div className="date-item">
            <span className="date-label">Updated:</span>
            <span className="date-value">
              {new Date(template.lastUpdated).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="template-status">
          <span className={`status-indicator ${template.isActive ? 'active' : 'inactive'}`}>
            {template.isActive ? '🟢 Active' : '🔴 Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
