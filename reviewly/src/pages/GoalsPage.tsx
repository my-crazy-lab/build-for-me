/**
 * Goals Page Component for Reviewly Application
 * 
 * A comprehensive goal management interface with SMART goal framework,
 * progress tracking, milestone management, and deadline monitoring.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/SimpleAuthContext';
import GoalCard from '../components/goals/GoalCard';
import GoalForm from '../components/goals/GoalForm';
import GoalFiltersComponent from '../components/goals/GoalFilters';
import './GoalsPage.css';

// Goal interfaces
export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'professional' | 'personal' | 'skill' | 'project' | 'leadership';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked' | 'cancelled';
  progress: number; // 0-100
  targetDate: string;
  createdDate: string;
  lastUpdated: string;
  milestones: Milestone[];
  tags: string[];
  isSmartGoal: boolean;
  smartCriteria: SmartCriteria;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  completedDate?: string;
}

export interface SmartCriteria {
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
}

interface GoalFilters {
  status: string;
  category: string;
  priority: string;
  search: string;
}

const GoalsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [filters, setFilters] = useState<GoalFilters>({
    status: 'all',
    category: 'all',
    priority: 'all',
    search: '',
  });

  // Load goals from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem(`reviewly_goals_${user?.id}`);
    if (savedGoals) {
      const parsedGoals = JSON.parse(savedGoals);
      setGoals(parsedGoals);
      setFilteredGoals(parsedGoals);
    } else {
      // Initialize with sample goals
      const sampleGoals: Goal[] = [
        {
          id: '1',
          title: 'Master React Advanced Patterns',
          description: 'Learn and implement advanced React patterns including render props, higher-order components, and custom hooks.',
          category: 'skill',
          priority: 'high',
          status: 'in-progress',
          progress: 65,
          targetDate: '2025-03-31',
          createdDate: '2024-12-01',
          lastUpdated: '2024-12-24',
          milestones: [
            {
              id: 'm1',
              title: 'Complete React Patterns Course',
              description: 'Finish the advanced React patterns online course',
              targetDate: '2025-01-15',
              completed: true,
              completedDate: '2025-01-10',
            },
            {
              id: 'm2',
              title: 'Build Practice Project',
              description: 'Create a project implementing learned patterns',
              targetDate: '2025-02-28',
              completed: false,
            },
          ],
          tags: ['react', 'frontend', 'javascript'],
          isSmartGoal: true,
          smartCriteria: {
            specific: 'Learn advanced React patterns and implement them in real projects',
            measurable: 'Complete course, build 2 practice projects, pass assessment',
            achievable: 'Have React experience and dedicated 5 hours/week',
            relevant: 'Directly improves job performance and career prospects',
            timeBound: 'Complete by March 31, 2025',
          },
        },
        {
          id: '2',
          title: 'Lead Team Project Successfully',
          description: 'Take leadership role in the upcoming Q1 product launch project.',
          category: 'leadership',
          priority: 'critical',
          status: 'not-started',
          progress: 0,
          targetDate: '2025-04-30',
          createdDate: '2024-12-20',
          lastUpdated: '2024-12-24',
          milestones: [
            {
              id: 'm3',
              title: 'Project Planning Phase',
              description: 'Complete project planning and team assignment',
              targetDate: '2025-01-31',
              completed: false,
            },
          ],
          tags: ['leadership', 'project-management'],
          isSmartGoal: true,
          smartCriteria: {
            specific: 'Lead the Q1 product launch project from planning to delivery',
            measurable: 'Deliver project on time, within budget, with team satisfaction >4/5',
            achievable: 'Have project management training and team support',
            relevant: 'Essential for promotion to senior role',
            timeBound: 'Project completion by April 30, 2025',
          },
        },
      ];
      setGoals(sampleGoals);
      setFilteredGoals(sampleGoals);
      localStorage.setItem(`reviewly_goals_${user?.id}`, JSON.stringify(sampleGoals));
    }
  }, [user?.id]);

  // Filter goals based on current filters
  useEffect(() => {
    let filtered = goals;

    if (filters.status !== 'all') {
      filtered = filtered.filter(goal => goal.status === filters.status);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(goal => goal.category === filters.category);
    }

    if (filters.priority !== 'all') {
      filtered = filtered.filter(goal => goal.priority === filters.priority);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(goal =>
        goal.title.toLowerCase().includes(searchLower) ||
        goal.description.toLowerCase().includes(searchLower) ||
        goal.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    setFilteredGoals(filtered);
  }, [goals, filters]);

  // Save goals to localStorage
  const saveGoals = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
    localStorage.setItem(`reviewly_goals_${user?.id}`, JSON.stringify(updatedGoals));
  };

  // Handle goal creation/update
  const handleGoalSave = (goalData: Omit<Goal, 'id' | 'createdDate' | 'lastUpdated'>) => {
    if (editingGoal) {
      // Update existing goal
      const updatedGoals = goals.map(goal =>
        goal.id === editingGoal.id
          ? { ...goalData, id: editingGoal.id, createdDate: editingGoal.createdDate, lastUpdated: new Date().toISOString() }
          : goal
      );
      saveGoals(updatedGoals);
    } else {
      // Create new goal
      const newGoal: Goal = {
        ...goalData,
        id: Date.now().toString(),
        createdDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
      saveGoals([...goals, newGoal]);
    }
    setShowGoalForm(false);
    setEditingGoal(null);
  };

  // Handle goal deletion
  const handleGoalDelete = (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      const updatedGoals = goals.filter(goal => goal.id !== goalId);
      saveGoals(updatedGoals);
    }
  };

  // Handle goal progress update
  const handleProgressUpdate = (goalId: string, progress: number) => {
    const updatedGoals = goals.map(goal =>
      goal.id === goalId
        ? { 
            ...goal, 
            progress, 
            lastUpdated: new Date().toISOString(),
            status: progress === 100 ? 'completed' : goal.status === 'not-started' ? 'in-progress' : goal.status
          }
        : goal
    );
    saveGoals(updatedGoals);
  };

  // Calculate statistics
  const stats = {
    total: goals.length,
    completed: goals.filter(g => g.status === 'completed').length,
    inProgress: goals.filter(g => g.status === 'in-progress').length,
    overdue: goals.filter(g => new Date(g.targetDate) < new Date() && g.status !== 'completed').length,
    averageProgress: goals.length > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length) : 0,
  };

  return (
    <div className="goals-page">
      {/* Header */}
      <div className="page-header">
        <button
          className="btn btn-outline btn-medium back-button"
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </button>
        
        <div className="header-info">
          <h1>Goal Management</h1>
          <p>Track and manage your professional and personal goals</p>
        </div>
        
        <div className="header-actions">
          <button
            className="btn btn-primary btn-medium"
            onClick={() => setShowGoalForm(true)}
          >
            + New Goal
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="goals-stats">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>Total Goals</h3>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Completed</h3>
            <p className="stat-value">{stats.completed}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-content">
            <h3>In Progress</h3>
            <p className="stat-value">{stats.inProgress}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Overdue</h3>
            <p className="stat-value">{stats.overdue}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Avg Progress</h3>
            <p className="stat-value">{stats.averageProgress}%</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <GoalFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Goals List */}
      <div className="goals-content">
        {filteredGoals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <h3>No goals found</h3>
            <p>
              {goals.length === 0
                ? "Start by creating your first goal to track your progress."
                : "Try adjusting your filters to see more goals."
              }
            </p>
            <button
              className="btn btn-primary btn-medium"
              onClick={() => setShowGoalForm(true)}
            >
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="goals-grid">
            {filteredGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={(goal) => {
                  setEditingGoal(goal);
                  setShowGoalForm(true);
                }}
                onDelete={handleGoalDelete}
                onProgressUpdate={handleProgressUpdate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Goal Form Modal */}
      {showGoalForm && (
        <GoalForm
          goal={editingGoal}
          onSave={handleGoalSave}
          onCancel={() => {
            setShowGoalForm(false);
            setEditingGoal(null);
          }}
        />
      )}
    </div>
  );
};

export default GoalsPage;
