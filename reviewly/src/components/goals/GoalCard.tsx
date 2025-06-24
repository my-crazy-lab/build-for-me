/**
 * Goal Card Component for Reviewly Application
 * 
 * Individual goal display card with progress tracking, milestone indicators,
 * and action buttons for editing and managing goals.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState } from 'react';
import type { Goal } from '../../pages/GoalsPage';
import './GoalCard.css';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
  onProgressUpdate: (goalId: string, progress: number) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDelete,
  onProgressUpdate,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [newProgress, setNewProgress] = useState(goal.progress);

  // Get status color and icon
  const getStatusInfo = (status: Goal['status']) => {
    switch (status) {
      case 'completed':
        return { color: 'success', icon: '✅', label: 'Completed' };
      case 'in-progress':
        return { color: 'primary', icon: '🚀', label: 'In Progress' };
      case 'blocked':
        return { color: 'warning', icon: '🚫', label: 'Blocked' };
      case 'cancelled':
        return { color: 'danger', icon: '❌', label: 'Cancelled' };
      default:
        return { color: 'secondary', icon: '⏳', label: 'Not Started' };
    }
  };

  // Get priority color and icon
  const getPriorityInfo = (priority: Goal['priority']) => {
    switch (priority) {
      case 'critical':
        return { color: 'danger', icon: '🔥', label: 'Critical' };
      case 'high':
        return { color: 'warning', icon: '⚡', label: 'High' };
      case 'medium':
        return { color: 'primary', icon: '📋', label: 'Medium' };
      default:
        return { color: 'secondary', icon: '📝', label: 'Low' };
    }
  };

  // Get category icon
  const getCategoryIcon = (category: Goal['category']) => {
    switch (category) {
      case 'professional':
        return '💼';
      case 'personal':
        return '🌟';
      case 'skill':
        return '🎯';
      case 'project':
        return '📊';
      case 'leadership':
        return '👑';
      default:
        return '📋';
    }
  };

  // Check if goal is overdue
  const isOverdue = new Date(goal.targetDate) < new Date() && goal.status !== 'completed';

  // Calculate days remaining
  const daysRemaining = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  // Get completed milestones count
  const completedMilestones = goal.milestones.filter(m => m.completed).length;

  const statusInfo = getStatusInfo(goal.status);
  const priorityInfo = getPriorityInfo(goal.priority);

  // Handle progress update
  const handleProgressUpdate = () => {
    onProgressUpdate(goal.id, newProgress);
    setIsUpdatingProgress(false);
  };

  // Handle quick progress actions
  const handleQuickProgress = (progress: number) => {
    onProgressUpdate(goal.id, progress);
  };

  return (
    <div className={`goal-card ${statusInfo.color} ${isOverdue ? 'overdue' : ''}`}>
      {/* Card Header */}
      <div className="goal-card-header">
        <div className="goal-meta">
          <span className={`goal-category ${goal.category}`}>
            {getCategoryIcon(goal.category)} {goal.category}
          </span>
          <span className={`goal-priority ${priorityInfo.color}`}>
            {priorityInfo.icon} {priorityInfo.label}
          </span>
        </div>
        
        <div className="goal-actions">
          <button
            className="btn btn-ghost btn-small"
            onClick={() => setShowDetails(!showDetails)}
            title="Toggle details"
          >
            {showDetails ? '▼' : '▶'}
          </button>
          <button
            className="btn btn-ghost btn-small"
            onClick={() => onEdit(goal)}
            title="Edit goal"
          >
            ✏️
          </button>
          <button
            className="btn btn-ghost btn-small"
            onClick={() => onDelete(goal.id)}
            title="Delete goal"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Goal Title and Description */}
      <div className="goal-content">
        <h3 className="goal-title">{goal.title}</h3>
        <p className="goal-description">{goal.description}</p>
        
        {goal.tags.length > 0 && (
          <div className="goal-tags">
            {goal.tags.map(tag => (
              <span key={tag} className="goal-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Progress Section */}
      <div className="goal-progress-section">
        <div className="progress-header">
          <span className="progress-label">Progress</span>
          <span className="progress-value">{goal.progress}%</span>
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${goal.progress}%` }}
          />
        </div>
        
        {!isUpdatingProgress ? (
          <div className="progress-actions">
            <button
              className="btn btn-ghost btn-small"
              onClick={() => setIsUpdatingProgress(true)}
            >
              Update Progress
            </button>
            <div className="quick-progress">
              <button
                className="btn btn-ghost btn-small"
                onClick={() => handleQuickProgress(25)}
                disabled={goal.progress >= 25}
              >
                25%
              </button>
              <button
                className="btn btn-ghost btn-small"
                onClick={() => handleQuickProgress(50)}
                disabled={goal.progress >= 50}
              >
                50%
              </button>
              <button
                className="btn btn-ghost btn-small"
                onClick={() => handleQuickProgress(75)}
                disabled={goal.progress >= 75}
              >
                75%
              </button>
              <button
                className="btn btn-ghost btn-small"
                onClick={() => handleQuickProgress(100)}
                disabled={goal.progress >= 100}
              >
                100%
              </button>
            </div>
          </div>
        ) : (
          <div className="progress-update">
            <input
              type="range"
              min="0"
              max="100"
              value={newProgress}
              onChange={(e) => setNewProgress(parseInt(e.target.value))}
              className="progress-slider"
            />
            <div className="progress-update-actions">
              <button
                className="btn btn-primary btn-small"
                onClick={handleProgressUpdate}
              >
                Save
              </button>
              <button
                className="btn btn-ghost btn-small"
                onClick={() => {
                  setIsUpdatingProgress(false);
                  setNewProgress(goal.progress);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status and Timeline */}
      <div className="goal-status-section">
        <div className="goal-status">
          <span className={`status-badge ${statusInfo.color}`}>
            {statusInfo.icon} {statusInfo.label}
          </span>
        </div>
        
        <div className="goal-timeline">
          <div className="timeline-item">
            <span className="timeline-label">Target Date:</span>
            <span className={`timeline-value ${isOverdue ? 'overdue' : ''}`}>
              {new Date(goal.targetDate).toLocaleDateString()}
            </span>
          </div>
          
          {daysRemaining !== null && (
            <div className="timeline-item">
              <span className="timeline-label">
                {daysRemaining > 0 ? 'Days Remaining:' : 'Days Overdue:'}
              </span>
              <span className={`timeline-value ${daysRemaining < 0 ? 'overdue' : ''}`}>
                {Math.abs(daysRemaining)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Milestones */}
      {goal.milestones.length > 0 && (
        <div className="goal-milestones">
          <div className="milestones-header">
            <span>Milestones ({completedMilestones}/{goal.milestones.length})</span>
          </div>
          
          {showDetails && (
            <div className="milestones-list">
              {goal.milestones.map(milestone => (
                <div key={milestone.id} className={`milestone-item ${milestone.completed ? 'completed' : ''}`}>
                  <div className="milestone-checkbox">
                    {milestone.completed ? '✅' : '⭕'}
                  </div>
                  <div className="milestone-content">
                    <h4 className="milestone-title">{milestone.title}</h4>
                    <p className="milestone-description">{milestone.description}</p>
                    <span className="milestone-date">
                      Due: {new Date(milestone.targetDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SMART Criteria (if expanded) */}
      {showDetails && goal.isSmartGoal && (
        <div className="smart-criteria">
          <h4>SMART Criteria</h4>
          <div className="smart-list">
            <div className="smart-item">
              <strong>Specific:</strong> {goal.smartCriteria.specific}
            </div>
            <div className="smart-item">
              <strong>Measurable:</strong> {goal.smartCriteria.measurable}
            </div>
            <div className="smart-item">
              <strong>Achievable:</strong> {goal.smartCriteria.achievable}
            </div>
            <div className="smart-item">
              <strong>Relevant:</strong> {goal.smartCriteria.relevant}
            </div>
            <div className="smart-item">
              <strong>Time-bound:</strong> {goal.smartCriteria.timeBound}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalCard;
