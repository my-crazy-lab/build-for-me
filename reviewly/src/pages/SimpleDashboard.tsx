/**
 * Simple Dashboard Page Component for Reviewly Application
 * 
 * A simplified dashboard that works without complex animations or type dependencies.
 * This serves as the main dashboard for authenticated users with basic functionality.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/SimpleAuthContext';
import { useTheme } from '../contexts/SimpleThemeContext';
import SimpleThemeToggle from '../components/common/SimpleThemeToggle';
import './Dashboard.css';

const SimpleDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark } = useTheme();

  return (
    <div className="dashboard animate-fade-in">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <div className="user-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <div className="avatar-placeholder">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="welcome-text">
              <h1>Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋</h1>
              <p>Here's what's happening with your performance reviews</p>
            </div>
          </div>
          
          <div className="header-actions">
            <SimpleThemeToggle variant="dropdown" size="medium" showLabel />
            <button
              className="btn btn-outline btn-medium"
              onClick={logout}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Quick Stats */}
        <section className="stats-section">
          <h2>Quick Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>Current Review</h3>
                <p className="stat-value">In Progress</p>
                <p className="stat-description">Q4 2024 Performance Review</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <h3>Goals Completed</h3>
                <p className="stat-value">7/10</p>
                <p className="stat-description">70% completion rate</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3>Skills Gained</h3>
                <p className="stat-value">5</p>
                <p className="stat-description">New skills this quarter</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💬</div>
              <div className="stat-content">
                <h3>Peer Feedback</h3>
                <p className="stat-value">12</p>
                <p className="stat-description">Feedback received</p>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Overview */}
        <section className="performance-section">
          <h2>Performance Overview</h2>
          <div className="performance-cards">
            <div className="perf-card">
              <div className="perf-icon">📈</div>
              <div className="perf-content">
                <h3>Overall Score</h3>
                <div className="perf-value">4.2/5</div>
                <div className="perf-trend positive">+0.3 from last period</div>
              </div>
            </div>

            <div className="perf-card">
              <div className="perf-icon">🎯</div>
              <div className="perf-content">
                <h3>Goals Progress</h3>
                <div className="perf-value">67%</div>
                <div className="perf-trend positive">+12% this month</div>
              </div>
            </div>

            <div className="perf-card">
              <div className="perf-icon">💬</div>
              <div className="perf-content">
                <h3>Feedback Score</h3>
                <div className="perf-value">4.5/5</div>
                <div className="perf-trend stable">Stable</div>
              </div>
            </div>

            <div className="perf-card">
              <div className="perf-icon">🚀</div>
              <div className="perf-content">
                <h3>Skills Growth</h3>
                <div className="perf-value">+8</div>
                <div className="perf-trend positive">New skills this quarter</div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="actions-section">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <div className="action-card">
              <div className="action-icon">✍️</div>
              <h3>Continue Self Review</h3>
              <p>Complete your Q4 2024 self-evaluation</p>
              <button
                className="btn btn-primary btn-medium btn-full-width"
                onClick={() => navigate('/self-review')}
              >
                Continue Review
              </button>
            </div>

            <div className="action-card">
              <div className="action-icon">👥</div>
              <h3>Request Peer Feedback</h3>
              <p>Get feedback from your colleagues</p>
              <button
                className="btn btn-secondary btn-medium btn-full-width"
                onClick={() => navigate('/feedback')}
              >
                Request Feedback
              </button>
            </div>

            <div className="action-card">
              <div className="action-icon">🎯</div>
              <h3>Update Goals</h3>
              <p>Review and update your quarterly goals</p>
              <button
                className="btn btn-outline btn-medium btn-full-width"
                onClick={() => navigate('/goals')}
              >
                Manage Goals
              </button>
            </div>

            <div className="action-card">
              <div className="action-icon">📋</div>
              <h3>Manage Templates</h3>
              <p>Create and customize review templates</p>
              <button
                className="btn btn-outline btn-medium btn-full-width"
                onClick={() => navigate('/templates')}
              >
                View Templates
              </button>
            </div>

            <div className="action-card">
              <div className="action-icon">🔗</div>
              <h3>Integrations</h3>
              <p>Connect external tools and import data</p>
              <button
                className="btn btn-outline btn-medium btn-full-width"
                onClick={() => navigate('/integrations')}
              >
                Manage Integrations
              </button>
            </div>

            <div className="action-card">
              <div className="action-icon">📊</div>
              <h3>Analytics</h3>
              <p>View performance insights and trends</p>
              <button
                className="btn btn-outline btn-medium btn-full-width"
                onClick={() => navigate('/analytics')}
              >
                View Analytics
              </button>
            </div>

            <div className="action-card">
              <div className="action-icon">🔍</div>
              <h3>Search</h3>
              <p>Find reviews, feedback, goals, and templates</p>
              <button
                className="btn btn-outline btn-medium btn-full-width"
                onClick={() => navigate('/search')}
              >
                Search Everything
              </button>
            </div>

            <div className="action-card">
              <div className="action-icon">🔔</div>
              <h3>Notifications</h3>
              <p>Stay updated with alerts and reminders</p>
              <button
                className="btn btn-outline btn-medium btn-full-width"
                onClick={() => navigate('/notifications')}
              >
                View Notifications
              </button>
            </div>

            <div className="action-card">
              <div className="action-icon">👤</div>
              <h3>Profile</h3>
              <p>Manage your account and preferences</p>
              <button
                className="btn btn-outline btn-medium btn-full-width"
                onClick={() => navigate('/profile')}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="activity-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">📝</div>
              <div className="activity-content">
                <h4>Self-review updated</h4>
                <p>You updated your Q4 self-evaluation</p>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">💬</div>
              <div className="activity-content">
                <h4>Feedback received</h4>
                <p>Sarah Johnson provided peer feedback</p>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">🏆</div>
              <div className="activity-content">
                <h4>Goal completed</h4>
                <p>Completed "Learn React Advanced Patterns"</p>
                <span className="activity-time">3 days ago</span>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Progress */}
        <section className="skills-section">
          <h2>Skills Development</h2>
          <div className="skills-list">
            <div className="skill-item">
              <div className="skill-info">
                <span className="skill-name">JavaScript</span>
                <span className="skill-level">4.5/5</span>
              </div>
              <div className="skill-bar">
                <div className="skill-fill" style={{ width: '90%' }}></div>
              </div>
              <span className="skill-trend positive">↗️ +0.5</span>
            </div>

            <div className="skill-item">
              <div className="skill-info">
                <span className="skill-name">Leadership</span>
                <span className="skill-level">3.8/5</span>
              </div>
              <div className="skill-bar">
                <div className="skill-fill" style={{ width: '76%' }}></div>
              </div>
              <span className="skill-trend positive">↗️ +0.3</span>
            </div>

            <div className="skill-item">
              <div className="skill-info">
                <span className="skill-name">Communication</span>
                <span className="skill-level">4.0/5</span>
              </div>
              <div className="skill-bar">
                <div className="skill-fill" style={{ width: '80%' }}></div>
              </div>
              <span className="skill-trend stable">➡️ Stable</span>
            </div>

            <div className="skill-item">
              <div className="skill-info">
                <span className="skill-name">Project Management</span>
                <span className="skill-level">3.2/5</span>
              </div>
              <div className="skill-bar">
                <div className="skill-fill" style={{ width: '64%' }}></div>
              </div>
              <span className="skill-trend positive">↗️ +0.2</span>
            </div>
          </div>
        </section>

        {/* User Info Card */}
        <section className="user-info-section">
          <div className="user-info-card">
            <h2>Your Profile</h2>
            <div className="user-details">
              <div className="detail-item">
                <strong>Role:</strong> {user?.role}
              </div>
              <div className="detail-item">
                <strong>Department:</strong> {user?.department || 'Not specified'}
              </div>
              <div className="detail-item">
                <strong>Position:</strong> {user?.position || 'Not specified'}
              </div>
              <div className="detail-item">
                <strong>Email:</strong> {user?.email}
              </div>
              <div className="detail-item">
                <strong>Theme:</strong> {isDark ? 'Dark' : 'Light'} Mode
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SimpleDashboard;
