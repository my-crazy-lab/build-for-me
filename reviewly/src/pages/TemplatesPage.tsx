/**
 * Templates Page Component for Reviewly Application
 * 
 * Comprehensive template management system with customizable review templates,
 * example questions, and company/department specific customization.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/SimpleAuthContext';
import TemplateCard from '../components/templates/TemplateCard';
import TemplateForm from '../components/templates/TemplateForm';
import TemplateFilters from '../components/templates/TemplateFilters';
import './TemplatesPage.css';

// Template interfaces
export interface ReviewTemplate {
  id: string;
  name: string;
  description: string;
  category: 'self-review' | 'peer-review' | 'manager-review' | 'goal-setting' | 'feedback' | 'custom';
  type: 'company' | 'department' | 'role' | 'personal';
  isDefault: boolean;
  isActive: boolean;
  sections: TemplateSection[];
  tags: string[];
  companyId?: string;
  departmentId?: string;
  roleId?: string;
  createdBy: string;
  createdDate: string;
  lastUpdated: string;
  usageCount: number;
}

export interface TemplateSection {
  id: string;
  title: string;
  description: string;
  order: number;
  isRequired: boolean;
  questions: TemplateQuestion[];
}

export interface TemplateQuestion {
  id: string;
  text: string;
  type: 'text' | 'textarea' | 'rating' | 'multiple-choice' | 'checkbox' | 'date' | 'number';
  placeholder?: string;
  helpText?: string;
  isRequired: boolean;
  order: number;
  options?: string[]; // For multiple-choice and checkbox questions
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
  };
}

interface TemplateFiltersState {
  category: string;
  type: string;
  status: string;
  search: string;
}

const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [templates, setTemplates] = useState<ReviewTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<ReviewTemplate[]>([]);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ReviewTemplate | null>(null);
  const [filters, setFilters] = useState<TemplateFiltersState>({
    category: 'all',
    type: 'all',
    status: 'all',
    search: '',
  });

  // Load templates from localStorage
  useEffect(() => {
    const savedTemplates = localStorage.getItem(`reviewly_templates_${user?.id}`);
    if (savedTemplates) {
      const parsedTemplates = JSON.parse(savedTemplates);
      setTemplates(parsedTemplates);
      setFilteredTemplates(parsedTemplates);
    } else {
      // Initialize with sample templates
      const sampleTemplates: ReviewTemplate[] = [
        {
          id: '1',
          name: 'Quarterly Self-Review',
          description: 'Comprehensive quarterly self-evaluation template with focus on achievements, goals, and development areas.',
          category: 'self-review',
          type: 'company',
          isDefault: true,
          isActive: true,
          sections: [
            {
              id: 's1',
              title: 'Key Accomplishments',
              description: 'Reflect on your major achievements this quarter',
              order: 1,
              isRequired: true,
              questions: [
                {
                  id: 'q1',
                  text: 'Describe your most important task or project this period',
                  type: 'textarea',
                  placeholder: 'Detail the project, your role, and the impact...',
                  helpText: 'Focus on specific outcomes and measurable results',
                  isRequired: true,
                  order: 1,
                  validation: { minLength: 50, maxLength: 1000 }
                },
                {
                  id: 'q2',
                  text: 'What were your top 3 achievements this quarter?',
                  type: 'textarea',
                  placeholder: '1. Achievement one...\n2. Achievement two...\n3. Achievement three...',
                  isRequired: true,
                  order: 2,
                  validation: { minLength: 100 }
                }
              ]
            },
            {
              id: 's2',
              title: 'Skills and Development',
              description: 'Assess your skill development and learning',
              order: 2,
              isRequired: true,
              questions: [
                {
                  id: 'q3',
                  text: 'What new skills did you develop or improve?',
                  type: 'textarea',
                  isRequired: true,
                  order: 1
                },
                {
                  id: 'q4',
                  text: 'Rate your overall performance this quarter',
                  type: 'rating',
                  isRequired: true,
                  order: 2,
                  validation: { min: 1, max: 5 }
                }
              ]
            }
          ],
          tags: ['quarterly', 'self-evaluation', 'performance'],
          companyId: 'company_demo',
          createdBy: user?.id || '',
          createdDate: '2024-01-01',
          lastUpdated: '2024-12-24',
          usageCount: 45
        },
        {
          id: '2',
          name: 'Peer Feedback Template',
          description: 'Structured template for providing constructive peer feedback.',
          category: 'peer-review',
          type: 'company',
          isDefault: true,
          isActive: true,
          sections: [
            {
              id: 's3',
              title: 'Collaboration Assessment',
              description: 'Evaluate collaboration and teamwork',
              order: 1,
              isRequired: true,
              questions: [
                {
                  id: 'q5',
                  text: 'How would you rate their collaboration skills?',
                  type: 'rating',
                  isRequired: true,
                  order: 1,
                  validation: { min: 1, max: 5 }
                },
                {
                  id: 'q6',
                  text: 'What are their key strengths in teamwork?',
                  type: 'textarea',
                  isRequired: true,
                  order: 2
                }
              ]
            }
          ],
          tags: ['peer-feedback', 'collaboration', 'teamwork'],
          createdBy: user?.id || '',
          createdDate: '2024-01-15',
          lastUpdated: '2024-12-20',
          usageCount: 23
        },
        {
          id: '3',
          name: 'Engineering Department Review',
          description: 'Specialized template for engineering team members focusing on technical skills and project delivery.',
          category: 'self-review',
          type: 'department',
          isDefault: false,
          isActive: true,
          sections: [
            {
              id: 's4',
              title: 'Technical Contributions',
              description: 'Assess your technical work and contributions',
              order: 1,
              isRequired: true,
              questions: [
                {
                  id: 'q7',
                  text: 'Describe your most significant technical contribution this period',
                  type: 'textarea',
                  helpText: 'Include technologies used, challenges overcome, and impact',
                  isRequired: true,
                  order: 1
                },
                {
                  id: 'q8',
                  text: 'Which technologies did you work with?',
                  type: 'multiple-choice',
                  options: ['React', 'Node.js', 'Python', 'Java', 'TypeScript', 'AWS', 'Docker', 'Other'],
                  isRequired: false,
                  order: 2
                }
              ]
            }
          ],
          tags: ['engineering', 'technical', 'development'],
          departmentId: 'dept_engineering',
          createdBy: user?.id || '',
          createdDate: '2024-02-01',
          lastUpdated: '2024-12-15',
          usageCount: 12
        }
      ];
      setTemplates(sampleTemplates);
      setFilteredTemplates(sampleTemplates);
      localStorage.setItem(`reviewly_templates_${user?.id}`, JSON.stringify(sampleTemplates));
    }
  }, [user?.id]);

  // Filter templates based on current filters
  useEffect(() => {
    let filtered = templates;

    if (filters.category !== 'all') {
      filtered = filtered.filter(template => template.category === filters.category);
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(template => template.type === filters.type);
    }

    if (filters.status !== 'all') {
      if (filters.status === 'active') {
        filtered = filtered.filter(template => template.isActive);
      } else if (filters.status === 'inactive') {
        filtered = filtered.filter(template => !template.isActive);
      } else if (filters.status === 'default') {
        filtered = filtered.filter(template => template.isDefault);
      }
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchLower) ||
        template.description.toLowerCase().includes(searchLower) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    setFilteredTemplates(filtered);
  }, [templates, filters]);

  // Save templates to localStorage
  const saveTemplates = (updatedTemplates: ReviewTemplate[]) => {
    setTemplates(updatedTemplates);
    localStorage.setItem(`reviewly_templates_${user?.id}`, JSON.stringify(updatedTemplates));
  };

  // Handle template creation/update
  const handleTemplateSave = (templateData: Omit<ReviewTemplate, 'id' | 'createdDate' | 'lastUpdated' | 'usageCount'>) => {
    if (editingTemplate) {
      // Update existing template
      const updatedTemplates = templates.map(template =>
        template.id === editingTemplate.id
          ? { 
              ...templateData, 
              id: editingTemplate.id, 
              createdDate: editingTemplate.createdDate, 
              lastUpdated: new Date().toISOString(),
              usageCount: editingTemplate.usageCount
            }
          : template
      );
      saveTemplates(updatedTemplates);
    } else {
      // Create new template
      const newTemplate: ReviewTemplate = {
        ...templateData,
        id: Date.now().toString(),
        createdDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        usageCount: 0,
      };
      saveTemplates([...templates, newTemplate]);
    }
    setShowTemplateForm(false);
    setEditingTemplate(null);
  };

  // Handle template deletion
  const handleTemplateDelete = (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      const updatedTemplates = templates.filter(template => template.id !== templateId);
      saveTemplates(updatedTemplates);
    }
  };

  // Handle template duplication
  const handleTemplateDuplicate = (template: ReviewTemplate) => {
    const duplicatedTemplate: ReviewTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      isDefault: false,
      createdDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      usageCount: 0,
    };
    saveTemplates([...templates, duplicatedTemplate]);
  };

  // Handle template activation/deactivation
  const handleTemplateToggle = (templateId: string) => {
    const updatedTemplates = templates.map(template =>
      template.id === templateId
        ? { ...template, isActive: !template.isActive, lastUpdated: new Date().toISOString() }
        : template
    );
    saveTemplates(updatedTemplates);
  };

  // Calculate statistics
  const stats = {
    total: templates.length,
    active: templates.filter(t => t.isActive).length,
    default: templates.filter(t => t.isDefault).length,
    custom: templates.filter(t => !t.isDefault).length,
    totalUsage: templates.reduce((sum, t) => sum + t.usageCount, 0),
  };

  return (
    <div className="templates-page">
      {/* Header */}
      <div className="page-header">
        <button
          className="btn btn-outline btn-medium back-button"
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </button>
        
        <div className="header-info">
          <h1>Template Management</h1>
          <p>Create and manage review templates for your organization</p>
        </div>
        
        <div className="header-actions">
          <button
            className="btn btn-primary btn-medium"
            onClick={() => setShowTemplateForm(true)}
          >
            + New Template
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="templates-stats">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Total Templates</h3>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Active</h3>
            <p className="stat-value">{stats.active}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>Default Templates</h3>
            <p className="stat-value">{stats.default}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🎨</div>
          <div className="stat-content">
            <h3>Custom Templates</h3>
            <p className="stat-value">{stats.custom}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Usage</h3>
            <p className="stat-value">{stats.totalUsage}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <TemplateFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Templates List */}
      <div className="templates-content">
        {filteredTemplates.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No templates found</h3>
            <p>
              {templates.length === 0
                ? "Start by creating your first template to standardize reviews."
                : "Try adjusting your filters to see more templates."
              }
            </p>
            <button
              className="btn btn-primary btn-medium"
              onClick={() => setShowTemplateForm(true)}
            >
              Create Your First Template
            </button>
          </div>
        ) : (
          <div className="templates-grid">
            {filteredTemplates.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onEdit={(template) => {
                  setEditingTemplate(template);
                  setShowTemplateForm(true);
                }}
                onDelete={handleTemplateDelete}
                onDuplicate={handleTemplateDuplicate}
                onToggle={handleTemplateToggle}
              />
            ))}
          </div>
        )}
      </div>

      {/* Template Form Modal */}
      {showTemplateForm && (
        <TemplateForm
          template={editingTemplate}
          onSave={handleTemplateSave}
          onCancel={() => {
            setShowTemplateForm(false);
            setEditingTemplate(null);
          }}
        />
      )}
    </div>
  );
};

export default TemplatesPage;
