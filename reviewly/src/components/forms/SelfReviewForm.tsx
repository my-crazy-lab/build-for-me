/**
 * Self-Review Form Component for Reviewly Application
 * 
 * A comprehensive form for employees to complete their self-evaluations with
 * structured sections for tasks, achievements, skills, and feedback.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/SimpleAuthContext';
import './SelfReviewForm.css';

// Form data interface
interface SelfReviewData {
  period: string;
  tasks: TaskSection[];
  achievements: AchievementSection[];
  skills: SkillSection[];
  feedback: FeedbackSection;
  goals: GoalSection[];
  challenges: string;
  improvements: string;
  additionalComments: string;
}

interface TaskSection {
  id: string;
  title: string;
  description: string;
  results: string;
  impact: string;
  skillsUsed: string[];
}

interface AchievementSection {
  id: string;
  title: string;
  description: string;
  metrics: string;
  recognition: string;
}

interface SkillSection {
  id: string;
  skillName: string;
  currentLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  targetLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  evidence: string;
  developmentPlan: string;
}

interface FeedbackSection {
  receivedFeedback: string;
  actionsTaken: string;
  requestedSupport: string;
}

interface GoalSection {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  nextSteps: string;
}

interface SelfReviewFormProps {
  onSubmit?: (data: SelfReviewData) => void;
  onSave?: (data: SelfReviewData) => void;
  initialData?: Partial<SelfReviewData>;
  readOnly?: boolean;
}

const SelfReviewForm: React.FC<SelfReviewFormProps> = ({
  onSubmit,
  onSave,
  initialData,
  readOnly = false,
}) => {
  const { user } = useAuth();
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<SelfReviewData>({
    period: 'Q4 2024',
    tasks: [{ id: '1', title: '', description: '', results: '', impact: '', skillsUsed: [] }],
    achievements: [{ id: '1', title: '', description: '', metrics: '', recognition: '' }],
    skills: [{ id: '1', skillName: '', currentLevel: 'beginner', targetLevel: 'intermediate', evidence: '', developmentPlan: '' }],
    feedback: { receivedFeedback: '', actionsTaken: '', requestedSupport: '' },
    goals: [{ id: '1', title: '', description: '', progress: 0, status: 'not-started', nextSteps: '' }],
    challenges: '',
    improvements: '',
    additionalComments: '',
    ...initialData,
  });

  const sections = [
    { id: 'tasks', title: 'Key Tasks & Projects', icon: '📋' },
    { id: 'achievements', title: 'Major Achievements', icon: '🏆' },
    { id: 'skills', title: 'Skills Development', icon: '🎯' },
    { id: 'feedback', title: 'Feedback & Growth', icon: '💬' },
    { id: 'goals', title: 'Goals & Objectives', icon: '🎪' },
    { id: 'reflection', title: 'Self-Reflection', icon: '🤔' },
  ];

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (onSave && !readOnly) {
        onSave(formData);
      }
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [formData, onSave, readOnly]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const addTask = () => {
    const newTask: TaskSection = {
      id: Date.now().toString(),
      title: '',
      description: '',
      results: '',
      impact: '',
      skillsUsed: [],
    };
    setFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));
  };

  const removeTask = (id: string) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== id),
    }));
  };

  const updateTask = (id: string, field: keyof TaskSection, value: any) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === id ? { ...task, [field]: value } : task
      ),
    }));
  };

  const addAchievement = () => {
    const newAchievement: AchievementSection = {
      id: Date.now().toString(),
      title: '',
      description: '',
      metrics: '',
      recognition: '',
    };
    setFormData(prev => ({
      ...prev,
      achievements: [...prev.achievements, newAchievement],
    }));
  };

  const removeAchievement = (id: string) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter(achievement => achievement.id !== id),
    }));
  };

  const updateAchievement = (id: string, field: keyof AchievementSection, value: any) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.map(achievement =>
        achievement.id === id ? { ...achievement, [field]: value } : achievement
      ),
    }));
  };

  const addSkill = () => {
    const newSkill: SkillSection = {
      id: Date.now().toString(),
      skillName: '',
      currentLevel: 'beginner',
      targetLevel: 'intermediate',
      evidence: '',
      developmentPlan: '',
    };
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  };

  const removeSkill = (id: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id),
    }));
  };

  const updateSkill = (id: string, field: keyof SkillSection, value: any) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    }));
  };

  const addGoal = () => {
    const newGoal: GoalSection = {
      id: Date.now().toString(),
      title: '',
      description: '',
      progress: 0,
      status: 'not-started',
      nextSteps: '',
    };
    setFormData(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }));
  };

  const removeGoal = (id: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal.id !== id),
    }));
  };

  const updateGoal = (id: string, field: keyof GoalSection, value: any) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.map(goal =>
        goal.id === id ? { ...goal, [field]: value } : goal
      ),
    }));
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const goToSection = (index: number) => {
    setCurrentSection(index);
  };

  return (
    <div className="self-review-form">
      <div className="form-header">
        <h1>Self-Review: {formData.period}</h1>
        <p>Complete your performance review for this period</p>
        <div className="user-info">
          <span>👤 {user?.name}</span>
          <span>📧 {user?.email}</span>
          <span>🏢 {user?.department}</span>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="section-nav">
        {sections.map((section, index) => (
          <button
            key={section.id}
            className={`section-nav-item ${index === currentSection ? 'active' : ''} ${index < currentSection ? 'completed' : ''}`}
            onClick={() => goToSection(index)}
            disabled={readOnly}
          >
            <span className="section-icon">{section.icon}</span>
            <span className="section-title">{section.title}</span>
            {index < currentSection && <span className="check-mark">✓</span>}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-content">
          {/* Tasks Section */}
          {currentSection === 0 && (
            <div className="form-section">
              <h2>📋 Key Tasks & Projects</h2>
              <p className="section-description">
                Describe the most important tasks and projects you worked on during this review period.
              </p>
              
              {formData.tasks.map((task, index) => (
                <div key={task.id} className="task-item">
                  <div className="item-header">
                    <h3>Task {index + 1}</h3>
                    {formData.tasks.length > 1 && !readOnly && (
                      <button
                        type="button"
                        className="btn btn-danger btn-small"
                        onClick={() => removeTask(task.id)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>Task Title *</label>
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) => updateTask(task.id, 'title', e.target.value)}
                      placeholder="e.g., Implemented new user authentication system"
                      required
                      disabled={readOnly}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      value={task.description}
                      onChange={(e) => updateTask(task.id, 'description', e.target.value)}
                      placeholder="Describe what you did, how you approached it, and any challenges you faced..."
                      rows={4}
                      required
                      disabled={readOnly}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Results Achieved *</label>
                    <textarea
                      value={task.results}
                      onChange={(e) => updateTask(task.id, 'results', e.target.value)}
                      placeholder="What were the outcomes? Include metrics, improvements, or deliverables..."
                      rows={3}
                      required
                      disabled={readOnly}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Impact & Value</label>
                    <textarea
                      value={task.impact}
                      onChange={(e) => updateTask(task.id, 'impact', e.target.value)}
                      placeholder="How did this work benefit the team, company, or customers?"
                      rows={2}
                      disabled={readOnly}
                    />
                  </div>
                </div>
              ))}
              
              {!readOnly && (
                <button
                  type="button"
                  className="btn btn-outline btn-medium"
                  onClick={addTask}
                >
                  + Add Another Task
                </button>
              )}
            </div>
          )}

          {/* Achievements Section */}
          {currentSection === 1 && (
            <div className="form-section">
              <h2>🏆 Major Achievements</h2>
              <p className="section-description">
                Highlight your most significant accomplishments and successes during this period.
              </p>

              {formData.achievements.map((achievement, index) => (
                <div key={achievement.id} className="achievement-item">
                  <div className="item-header">
                    <h3>Achievement {index + 1}</h3>
                    {formData.achievements.length > 1 && !readOnly && (
                      <button
                        type="button"
                        className="btn btn-danger btn-small"
                        onClick={() => removeAchievement(achievement.id)}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Achievement Title *</label>
                    <input
                      type="text"
                      value={achievement.title}
                      onChange={(e) => updateAchievement(achievement.id, 'title', e.target.value)}
                      placeholder="e.g., Led successful product launch"
                      required
                      disabled={readOnly}
                    />
                  </div>

                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      value={achievement.description}
                      onChange={(e) => updateAchievement(achievement.id, 'description', e.target.value)}
                      placeholder="Describe what you accomplished and how you achieved it..."
                      rows={4}
                      required
                      disabled={readOnly}
                    />
                  </div>

                  <div className="form-group">
                    <label>Metrics & Results</label>
                    <textarea
                      value={achievement.metrics}
                      onChange={(e) => updateAchievement(achievement.id, 'metrics', e.target.value)}
                      placeholder="Include specific numbers, percentages, or measurable outcomes..."
                      rows={2}
                      disabled={readOnly}
                    />
                  </div>

                  <div className="form-group">
                    <label>Recognition Received</label>
                    <textarea
                      value={achievement.recognition}
                      onChange={(e) => updateAchievement(achievement.id, 'recognition', e.target.value)}
                      placeholder="Any feedback, awards, or recognition you received for this achievement..."
                      rows={2}
                      disabled={readOnly}
                    />
                  </div>
                </div>
              ))}

              {!readOnly && (
                <button
                  type="button"
                  className="btn btn-outline btn-medium"
                  onClick={addAchievement}
                >
                  + Add Another Achievement
                </button>
              )}
            </div>
          )}

          {/* Skills Section */}
          {currentSection === 2 && (
            <div className="form-section">
              <h2>🎯 Skills Development</h2>
              <p className="section-description">
                Reflect on the skills you've developed, applied, or want to improve.
              </p>

              {formData.skills.map((skill, index) => (
                <div key={skill.id} className="skill-item">
                  <div className="item-header">
                    <h3>Skill {index + 1}</h3>
                    {formData.skills.length > 1 && !readOnly && (
                      <button
                        type="button"
                        className="btn btn-danger btn-small"
                        onClick={() => removeSkill(skill.id)}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Skill Name *</label>
                    <input
                      type="text"
                      value={skill.skillName}
                      onChange={(e) => updateSkill(skill.id, 'skillName', e.target.value)}
                      placeholder="e.g., React Development, Project Management, Data Analysis"
                      required
                      disabled={readOnly}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Current Level</label>
                      <select
                        value={skill.currentLevel}
                        onChange={(e) => updateSkill(skill.id, 'currentLevel', e.target.value)}
                        disabled={readOnly}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Target Level</label>
                      <select
                        value={skill.targetLevel}
                        onChange={(e) => updateSkill(skill.id, 'targetLevel', e.target.value)}
                        disabled={readOnly}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Evidence & Examples</label>
                    <textarea
                      value={skill.evidence}
                      onChange={(e) => updateSkill(skill.id, 'evidence', e.target.value)}
                      placeholder="Provide specific examples of how you used or developed this skill..."
                      rows={3}
                      disabled={readOnly}
                    />
                  </div>

                  <div className="form-group">
                    <label>Development Plan</label>
                    <textarea
                      value={skill.developmentPlan}
                      onChange={(e) => updateSkill(skill.id, 'developmentPlan', e.target.value)}
                      placeholder="How do you plan to improve this skill? Training, practice, mentoring..."
                      rows={2}
                      disabled={readOnly}
                    />
                  </div>
                </div>
              ))}

              {!readOnly && (
                <button
                  type="button"
                  className="btn btn-outline btn-medium"
                  onClick={addSkill}
                >
                  + Add Another Skill
                </button>
              )}
            </div>
          )}

          {/* Feedback Section */}
          {currentSection === 3 && (
            <div className="form-section">
              <h2>💬 Feedback & Growth</h2>
              <p className="section-description">
                Reflect on feedback you've received and how you've grown from it.
              </p>

              <div className="form-group">
                <label>Feedback Received</label>
                <textarea
                  value={formData.feedback.receivedFeedback}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    feedback: { ...prev.feedback, receivedFeedback: e.target.value }
                  }))}
                  placeholder="Summarize key feedback you received from managers, peers, or customers..."
                  rows={4}
                  disabled={readOnly}
                />
              </div>

              <div className="form-group">
                <label>Actions Taken</label>
                <textarea
                  value={formData.feedback.actionsTaken}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    feedback: { ...prev.feedback, actionsTaken: e.target.value }
                  }))}
                  placeholder="What specific actions did you take based on the feedback received?"
                  rows={3}
                  disabled={readOnly}
                />
              </div>

              <div className="form-group">
                <label>Support Requested</label>
                <textarea
                  value={formData.feedback.requestedSupport}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    feedback: { ...prev.feedback, requestedSupport: e.target.value }
                  }))}
                  placeholder="What support, training, or resources would help you grow further?"
                  rows={3}
                  disabled={readOnly}
                />
              </div>
            </div>
          )}

          {/* Goals Section */}
          {currentSection === 4 && (
            <div className="form-section">
              <h2>🎪 Goals & Objectives</h2>
              <p className="section-description">
                Review your progress on goals and set objectives for the next period.
              </p>

              {formData.goals.map((goal, index) => (
                <div key={goal.id} className="goal-item">
                  <div className="item-header">
                    <h3>Goal {index + 1}</h3>
                    {formData.goals.length > 1 && !readOnly && (
                      <button
                        type="button"
                        className="btn btn-danger btn-small"
                        onClick={() => removeGoal(goal.id)}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Goal Title *</label>
                    <input
                      type="text"
                      value={goal.title}
                      onChange={(e) => updateGoal(goal.id, 'title', e.target.value)}
                      placeholder="e.g., Improve team collaboration skills"
                      required
                      disabled={readOnly}
                    />
                  </div>

                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      value={goal.description}
                      onChange={(e) => updateGoal(goal.id, 'description', e.target.value)}
                      placeholder="Describe the goal and why it's important..."
                      rows={3}
                      required
                      disabled={readOnly}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Progress (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={goal.progress}
                        onChange={(e) => updateGoal(goal.id, 'progress', parseInt(e.target.value) || 0)}
                        disabled={readOnly}
                      />
                    </div>

                    <div className="form-group">
                      <label>Status</label>
                      <select
                        value={goal.status}
                        onChange={(e) => updateGoal(goal.id, 'status', e.target.value)}
                        disabled={readOnly}
                      >
                        <option value="not-started">Not Started</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Next Steps</label>
                    <textarea
                      value={goal.nextSteps}
                      onChange={(e) => updateGoal(goal.id, 'nextSteps', e.target.value)}
                      placeholder="What are the next actions needed to achieve this goal?"
                      rows={2}
                      disabled={readOnly}
                    />
                  </div>
                </div>
              ))}

              {!readOnly && (
                <button
                  type="button"
                  className="btn btn-outline btn-medium"
                  onClick={addGoal}
                >
                  + Add Another Goal
                </button>
              )}
            </div>
          )}

          {/* Reflection Section */}
          {currentSection === 5 && (
            <div className="form-section">
              <h2>🤔 Self-Reflection</h2>
              <p className="section-description">
                Take time to reflect on your overall performance, challenges, and growth.
              </p>

              <div className="form-group">
                <label>Challenges Faced</label>
                <textarea
                  value={formData.challenges}
                  onChange={(e) => setFormData(prev => ({ ...prev, challenges: e.target.value }))}
                  placeholder="What were the main challenges you faced this period? How did you handle them?"
                  rows={4}
                  disabled={readOnly}
                />
              </div>

              <div className="form-group">
                <label>Areas for Improvement</label>
                <textarea
                  value={formData.improvements}
                  onChange={(e) => setFormData(prev => ({ ...prev, improvements: e.target.value }))}
                  placeholder="What areas would you like to improve in? What would help you perform better?"
                  rows={4}
                  disabled={readOnly}
                />
              </div>

              <div className="form-group">
                <label>Additional Comments</label>
                <textarea
                  value={formData.additionalComments}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalComments: e.target.value }))}
                  placeholder="Any other thoughts, achievements, or feedback you'd like to share?"
                  rows={4}
                  disabled={readOnly}
                />
              </div>

              <div className="review-summary">
                <h3>Review Summary</h3>
                <div className="summary-stats">
                  <div className="stat-item">
                    <span className="stat-label">Tasks Completed:</span>
                    <span className="stat-value">{formData.tasks.length}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Achievements:</span>
                    <span className="stat-value">{formData.achievements.length}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Skills Developed:</span>
                    <span className="stat-value">{formData.skills.length}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Goals Tracked:</span>
                    <span className="stat-value">{formData.goals.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="form-navigation">
            <button
              type="button"
              className="btn btn-outline btn-medium"
              onClick={prevSection}
              disabled={currentSection === 0}
            >
              ← Previous
            </button>
            
            <span className="section-indicator">
              {currentSection + 1} of {sections.length}
            </span>
            
            {currentSection < sections.length - 1 ? (
              <button
                type="button"
                className="btn btn-primary btn-medium"
                onClick={nextSection}
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-success btn-medium"
                disabled={readOnly}
              >
                Submit Review
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default SelfReviewForm;
