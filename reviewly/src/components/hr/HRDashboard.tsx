/**
 * HR Dashboard Component for Reviewly Application
 * 
 * Advanced analytics dashboard for HR and managers with team insights,
 * performance metrics, talent analytics, and management reporting.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState, useMemo } from 'react';
import type { 
  TeamMember, 
  TeamAnalytics, 
  TalentInsight, 
  PerformanceAlert,
  DepartmentInsights 
} from '../../utils/hrAnalytics';
import { 
  calculateTeamPerformance,
  calculateReviewCompletionRate,
  identifyTopPerformers,
  identifyAtRiskMembers,
  getUpcomingReviews,
  generateTalentInsights,
  generatePerformanceAlerts,
  calculateDepartmentInsights,
  formatTrendIcon,
  formatTrendColor,
  getPriorityColor,
  getSeverityColor
} from '../../utils/hrAnalytics';
import './HRDashboard.css';

interface HRDashboardProps {
  teamMembers: TeamMember[];
  currentUserId: string;
  userRole: 'hr' | 'manager' | 'director';
}

const HRDashboard: React.FC<HRDashboardProps> = ({
  teamMembers,
  currentUserId,
  userRole
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'month' | 'quarter' | 'year'>('quarter');
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'insights' | 'alerts'>('overview');

  // Filter team members by department
  const filteredMembers = useMemo(() => {
    if (selectedDepartment === 'all') return teamMembers;
    return teamMembers.filter(member => member.department === selectedDepartment);
  }, [teamMembers, selectedDepartment]);

  // Get unique departments
  const departments = useMemo(() => {
    const deptSet = new Set(teamMembers.map(member => member.department));
    const depts = Array.from(deptSet);
    return depts.sort();
  }, [teamMembers]);

  // Calculate analytics
  const teamAnalytics = useMemo((): TeamAnalytics => {
    const memberCount = filteredMembers.length;
    const averagePerformance = calculateTeamPerformance(filteredMembers);
    const reviewCompletionRate = calculateReviewCompletionRate(filteredMembers);
    const topPerformers = identifyTopPerformers(filteredMembers);
    const atRiskMembers = identifyAtRiskMembers(filteredMembers);
    const upcomingReviews = getUpcomingReviews(filteredMembers);

    return {
      teamId: selectedDepartment,
      teamName: selectedDepartment === 'all' ? 'All Teams' : selectedDepartment,
      managerId: currentUserId,
      memberCount,
      averagePerformance,
      reviewCompletionRate,
      skillDevelopmentTrend: 'improving',
      topPerformers,
      atRiskMembers,
      upcomingReviews,
      keyMetrics: {
        totalReviewsCompleted: filteredMembers.reduce((sum, m) => sum + m.completedReviews, 0),
        averageSkillsPerMember: Math.round(filteredMembers.reduce((sum, m) => sum + m.skillsCount, 0) / memberCount),
        promotionReadiness: Math.round((topPerformers.length / memberCount) * 100),
        retentionRisk: Math.round((atRiskMembers.length / memberCount) * 100)
      }
    };
  }, [filteredMembers, selectedDepartment, currentUserId]);

  const talentInsights = useMemo(() => 
    generateTalentInsights(filteredMembers), 
    [filteredMembers]
  );

  const performanceAlerts = useMemo(() => 
    generatePerformanceAlerts(filteredMembers), 
    [filteredMembers]
  );

  const departmentInsights = useMemo(() => 
    calculateDepartmentInsights(filteredMembers, teamAnalytics.teamName),
    [filteredMembers, teamAnalytics.teamName]
  );

  const renderOverviewTab = () => (
    <div className="overview-tab">
      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <div className="metric-value">{teamAnalytics.memberCount}</div>
            <div className="metric-label">Team Members</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">⭐</div>
          <div className="metric-content">
            <div className="metric-value">{teamAnalytics.averagePerformance.toFixed(1)}</div>
            <div className="metric-label">Avg Performance</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <div className="metric-value">{teamAnalytics.reviewCompletionRate}%</div>
            <div className="metric-label">Review Completion</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <div className="metric-value">{teamAnalytics.keyMetrics.promotionReadiness}%</div>
            <div className="metric-label">Promotion Ready</div>
          </div>
        </div>
      </div>

      {/* Performance Distribution */}
      <div className="performance-distribution">
        <h3>Performance Distribution</h3>
        <div className="distribution-chart">
          {Object.entries(departmentInsights.performanceDistribution).map(([level, count]) => {
            const percentage = (count / teamAnalytics.memberCount) * 100;
            return (
              <div key={level} className="distribution-bar">
                <div className="bar-label">{level.charAt(0).toUpperCase() + level.slice(1)}</div>
                <div className="bar-container">
                  <div 
                    className={`bar-fill ${level}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="bar-value">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-card">
            <div className="action-icon">📝</div>
            <div className="action-content">
              <div className="action-title">Schedule Reviews</div>
              <div className="action-subtitle">{teamAnalytics.upcomingReviews.length} due soon</div>
            </div>
          </button>
          
          <button className="action-card">
            <div className="action-icon">📊</div>
            <div className="action-content">
              <div className="action-title">Generate Report</div>
              <div className="action-subtitle">Team performance summary</div>
            </div>
          </button>
          
          <button className="action-card">
            <div className="action-icon">🎯</div>
            <div className="action-content">
              <div className="action-title">Set Goals</div>
              <div className="action-subtitle">Define team objectives</div>
            </div>
          </button>
          
          <button className="action-card">
            <div className="action-icon">📚</div>
            <div className="action-content">
              <div className="action-title">Training Plans</div>
              <div className="action-subtitle">Skill development</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderTeamTab = () => (
    <div className="team-tab">
      {/* Top Performers */}
      <div className="team-section">
        <h3>🌟 Top Performers</h3>
        <div className="team-members-list">
          {teamAnalytics.topPerformers.map(member => (
            <div key={member.id} className="team-member-card top-performer">
              <div className="member-avatar">
                {member.avatar || member.name.charAt(0)}
              </div>
              <div className="member-info">
                <div className="member-name">{member.name}</div>
                <div className="member-role">{member.role}</div>
                <div className="member-rating">⭐ {member.performanceRating.toFixed(1)}</div>
              </div>
              <div className="member-actions">
                <button className="btn btn-outline btn-small">View Profile</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* At Risk Members */}
      {teamAnalytics.atRiskMembers.length > 0 && (
        <div className="team-section">
          <h3>⚠️ Needs Attention</h3>
          <div className="team-members-list">
            {teamAnalytics.atRiskMembers.map(member => (
              <div key={member.id} className="team-member-card at-risk">
                <div className="member-avatar">
                  {member.avatar || member.name.charAt(0)}
                </div>
                <div className="member-info">
                  <div className="member-name">{member.name}</div>
                  <div className="member-role">{member.role}</div>
                  <div className="member-risk">Risk: {member.riskLevel}</div>
                </div>
                <div className="member-actions">
                  <button className="btn btn-primary btn-small">Take Action</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Reviews */}
      <div className="team-section">
        <h3>📅 Upcoming Reviews</h3>
        <div className="reviews-list">
          {teamAnalytics.upcomingReviews.map(member => (
            <div key={member.id} className="review-item">
              <div className="review-member">
                <div className="member-avatar small">
                  {member.avatar || member.name.charAt(0)}
                </div>
                <div className="member-details">
                  <div className="member-name">{member.name}</div>
                  <div className="member-role">{member.role}</div>
                </div>
              </div>
              <div className="review-due">
                <div className="due-date">
                  {member.nextReviewDue?.toLocaleDateString()}
                </div>
                <div className="due-label">Due Date</div>
              </div>
              <div className="review-actions">
                <button className="btn btn-outline btn-small">Schedule</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInsightsTab = () => (
    <div className="insights-tab">
      <div className="insights-grid">
        {talentInsights.map((insight, index) => (
          <div key={index} className={`insight-card ${insight.type}`}>
            <div className="insight-header">
              <div className="insight-type">
                {insight.type.replace('_', ' ').toUpperCase()}
              </div>
              <div 
                className="insight-priority"
                style={{ color: getPriorityColor(insight.priority) }}
              >
                {insight.priority.toUpperCase()}
              </div>
            </div>
            
            <div className="insight-content">
              <div className="insight-employee">{insight.employeeName}</div>
              <div className="insight-description">{insight.description}</div>
            </div>
            
            <div className="insight-actions">
              <h5>Recommended Actions:</h5>
              <ul>
                {insight.recommendedActions.map((action, actionIndex) => (
                  <li key={actionIndex}>{action}</li>
                ))}
              </ul>
            </div>
            
            {insight.dueDate && (
              <div className="insight-due">
                <span className="due-label">Action needed by:</span>
                <span className="due-date">{insight.dueDate.toLocaleDateString()}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderAlertsTab = () => (
    <div className="alerts-tab">
      <div className="alerts-list">
        {performanceAlerts.map(alert => (
          <div key={alert.id} className={`alert-card ${alert.severity}`}>
            <div className="alert-header">
              <div className="alert-type">
                {alert.type.replace('_', ' ').toUpperCase()}
              </div>
              <div 
                className="alert-severity"
                style={{ color: getSeverityColor(alert.severity) }}
              >
                {alert.severity.toUpperCase()}
              </div>
            </div>
            
            <div className="alert-content">
              <div className="alert-employee">{alert.employeeName}</div>
              <div className="alert-message">{alert.message}</div>
            </div>
            
            <div className="alert-actions">
              <h5>Suggested Actions:</h5>
              <ul>
                {alert.suggestedActions.map((action, actionIndex) => (
                  <li key={actionIndex}>{action}</li>
                ))}
              </ul>
            </div>
            
            <div className="alert-footer">
              <span className="alert-date">
                {alert.createdAt.toLocaleDateString()}
              </span>
              {alert.actionRequired && (
                <button className="btn btn-primary btn-small">Take Action</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="hr-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-info">
          <h1>📊 HR Analytics Dashboard</h1>
          <p>Comprehensive team insights and performance analytics</p>
        </div>
        
        <div className="header-controls">
          <div className="filter-group">
            <label>Department:</label>
            <select 
              value={selectedDepartment} 
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Timeframe:</label>
            <select 
              value={selectedTimeframe} 
              onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            >
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📋 Overview
        </button>
        <button
          className={`tab ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          👥 Team
        </button>
        <button
          className={`tab ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          💡 Insights
          {talentInsights.length > 0 && (
            <span className="tab-badge">{talentInsights.length}</span>
          )}
        </button>
        <button
          className={`tab ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          🚨 Alerts
          {performanceAlerts.length > 0 && (
            <span className="tab-badge">{performanceAlerts.length}</span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'team' && renderTeamTab()}
        {activeTab === 'insights' && renderInsightsTab()}
        {activeTab === 'alerts' && renderAlertsTab()}
      </div>
    </div>
  );
};

export default HRDashboard;
