/**
 * Analytics Page Component for Reviewly Application
 * 
 * Comprehensive analytics dashboard with performance metrics, progress tracking,
 * team insights, and data visualization charts.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/SimpleAuthContext';
import PerformanceChart from '../components/analytics/PerformanceChart';
import SkillsRadarChart from '../components/analytics/SkillsRadarChart';
import FeedbackTrendsChart from '../components/analytics/FeedbackTrendsChart';
import GoalsProgressChart from '../components/analytics/GoalsProgressChart';
import SkillGrowthChart from '../components/charts/SkillGrowthChart';
import ReviewScoreTrends from '../components/charts/ReviewScoreTrends';
import PeerFeedbackVisualization from '../components/charts/PeerFeedbackVisualization';
import AutoSummaryDisplay from '../components/summary/AutoSummaryDisplay';
import { useAutoSummary, useSummaryItemCollector } from '../hooks/useAutoSummary';
import type { SummaryItem } from '../utils/autoSummary';
import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import MetricsCard from '../components/analytics/MetricsCard';
import './AnalyticsPage.css';

// Analytics interfaces
export interface AnalyticsData {
  performance: PerformanceMetrics;
  skills: SkillMetrics[];
  feedback: FeedbackMetrics;
  goals: GoalMetrics;
  trends: TrendData[];
  comparisons: ComparisonData;
}

export interface PerformanceMetrics {
  currentScore: number;
  previousScore: number;
  trend: 'up' | 'down' | 'stable';
  percentageChange: number;
  reviewsCompleted: number;
  averageRating: number;
  topStrengths: string[];
  improvementAreas: string[];
}

export interface SkillMetrics {
  name: string;
  category: string;
  currentLevel: number;
  previousLevel: number;
  targetLevel: number;
  progress: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: Date;
}

export interface FeedbackMetrics {
  totalReceived: number;
  totalGiven: number;
  averageRating: number;
  positivePercentage: number;
  responseRate: number;
  topCategories: { category: string; count: number }[];
  recentTrends: { date: string; rating: number; count: number }[];
}

export interface GoalMetrics {
  totalGoals: number;
  completedGoals: number;
  inProgressGoals: number;
  overdueGoals: number;
  completionRate: number;
  averageProgress: number;
  categoryBreakdown: { category: string; completed: number; total: number }[];
}

export interface TrendData {
  date: string;
  performance: number;
  feedback: number;
  goals: number;
  skills: number;
}

export interface ComparisonData {
  teamAverage: number;
  departmentAverage: number;
  companyAverage: number;
  industryBenchmark: number;
  percentile: number;
}

interface AnalyticsFilters {
  timeRange: '1m' | '3m' | '6m' | '1y' | 'all';
  metrics: string[];
  comparison: 'none' | 'team' | 'department' | 'company';
  skillCategories: string[];
}

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [filters, setFilters] = useState<AnalyticsFilters>({
    timeRange: '6m',
    metrics: ['performance', 'skills', 'feedback', 'goals'],
    comparison: 'team',
    skillCategories: ['technical', 'leadership', 'communication'],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Auto-summary functionality
  const { collectFromSelfReview, collectFromIntegrations, collectFromFeedback } = useSummaryItemCollector();
  const {
    summaryResult,
    isLoading: isSummaryLoading,
    generateSummary,
    refreshSummary
  } = useAutoSummary([], { autoRefresh: false });

  // Load analytics data
  useEffect(() => {
    const loadAnalyticsData = async () => {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const mockData: AnalyticsData = {
          performance: {
            currentScore: 4.2,
            previousScore: 3.8,
            trend: 'up',
            percentageChange: 10.5,
            reviewsCompleted: 12,
            averageRating: 4.2,
            topStrengths: ['Problem Solving', 'Team Collaboration', 'Technical Skills'],
            improvementAreas: ['Time Management', 'Public Speaking', 'Project Planning'],
          },
          skills: [
            {
              name: 'JavaScript',
              category: 'technical',
              currentLevel: 4.5,
              previousLevel: 4.0,
              targetLevel: 5.0,
              progress: 90,
              trend: 'up',
              lastUpdated: new Date('2024-12-20'),
            },
            {
              name: 'Leadership',
              category: 'leadership',
              currentLevel: 3.8,
              previousLevel: 3.5,
              targetLevel: 4.5,
              progress: 65,
              trend: 'up',
              lastUpdated: new Date('2024-12-15'),
            },
            {
              name: 'Communication',
              category: 'communication',
              currentLevel: 4.0,
              previousLevel: 4.0,
              targetLevel: 4.5,
              progress: 80,
              trend: 'stable',
              lastUpdated: new Date('2024-12-10'),
            },
          ],
          feedback: {
            totalReceived: 28,
            totalGiven: 35,
            averageRating: 4.3,
            positivePercentage: 85,
            responseRate: 92,
            topCategories: [
              { category: 'Technical Skills', count: 12 },
              { category: 'Collaboration', count: 8 },
              { category: 'Communication', count: 6 },
            ],
            recentTrends: [
              { date: '2024-12', rating: 4.3, count: 8 },
              { date: '2024-11', rating: 4.1, count: 6 },
              { date: '2024-10', rating: 4.0, count: 7 },
              { date: '2024-09', rating: 3.9, count: 5 },
            ],
          },
          goals: {
            totalGoals: 15,
            completedGoals: 8,
            inProgressGoals: 5,
            overdueGoals: 2,
            completionRate: 53,
            averageProgress: 67,
            categoryBreakdown: [
              { category: 'Professional Development', completed: 3, total: 5 },
              { category: 'Technical Skills', completed: 4, total: 6 },
              { category: 'Leadership', completed: 1, total: 4 },
            ],
          },
          trends: [
            { date: '2024-07', performance: 3.5, feedback: 3.8, goals: 45, skills: 3.2 },
            { date: '2024-08', performance: 3.7, feedback: 4.0, goals: 52, skills: 3.4 },
            { date: '2024-09', performance: 3.9, feedback: 4.1, goals: 58, skills: 3.6 },
            { date: '2024-10', performance: 4.0, feedback: 4.2, goals: 61, skills: 3.8 },
            { date: '2024-11', performance: 4.1, feedback: 4.3, goals: 65, skills: 4.0 },
            { date: '2024-12', performance: 4.2, feedback: 4.3, goals: 67, skills: 4.1 },
          ],
          comparisons: {
            teamAverage: 3.9,
            departmentAverage: 3.8,
            companyAverage: 3.7,
            industryBenchmark: 3.6,
            percentile: 78,
          },
        };
        
        setAnalyticsData(mockData);
        setIsLoading(false);

        // Generate auto-summary from mock data
        generateMockSummaryData();
      }, 1500);
    };

    loadAnalyticsData();
  }, [filters, user?.id]);

  // Generate mock summary data
  const generateMockSummaryData = () => {
    const mockSummaryItems: SummaryItem[] = [
      {
        id: 'item-1',
        content: 'Completed major React TypeScript project with advanced state management and responsive design. Delivered 2 weeks ahead of schedule.',
        source: 'self-entered',
        sourceDetails: 'Self Review - Achievements',
        timestamp: new Date('2024-12-15'),
        keywords: ['react', 'typescript', 'project', 'delivered'],
        importance: 'high',
        sentiment: 'positive'
      },
      {
        id: 'item-2',
        content: 'Developed advanced JavaScript skills through hands-on coding and mentoring junior developers.',
        source: 'self-entered',
        sourceDetails: 'Self Review - Skills',
        timestamp: new Date('2024-12-10'),
        keywords: ['javascript', 'mentoring', 'development'],
        importance: 'high',
        sentiment: 'positive'
      },
      {
        id: 'item-3',
        content: 'Led team collaboration on cross-functional project involving 5 departments. Improved communication processes.',
        source: 'self-entered',
        sourceDetails: 'Self Review - Leadership',
        timestamp: new Date('2024-12-08'),
        keywords: ['leadership', 'collaboration', 'communication'],
        importance: 'high',
        sentiment: 'positive'
      },
      {
        id: 'item-4',
        content: 'Implemented automated testing framework reducing bug reports by 40%. Enhanced code quality significantly.',
        source: 'imported',
        sourceDetails: 'GitHub Integration',
        timestamp: new Date('2024-12-05'),
        keywords: ['testing', 'automation', 'quality'],
        importance: 'high',
        sentiment: 'positive'
      },
      {
        id: 'item-5',
        content: 'Participated in advanced React training course. Learned new patterns and best practices for component architecture.',
        source: 'self-entered',
        sourceDetails: 'Self Review - Learning',
        timestamp: new Date('2024-11-28'),
        keywords: ['training', 'react', 'learning'],
        importance: 'medium',
        sentiment: 'positive'
      },
      {
        id: 'item-6',
        content: 'Resolved critical performance issues in production application. Improved page load times by 60%.',
        source: 'imported',
        sourceDetails: 'Jira Integration',
        timestamp: new Date('2024-11-25'),
        keywords: ['performance', 'optimization', 'production'],
        importance: 'high',
        sentiment: 'positive'
      },
      {
        id: 'item-7',
        content: 'Excellent problem-solving skills and attention to detail. Always delivers high-quality work on time.',
        source: 'external',
        sourceDetails: 'Feedback from Sarah Johnson',
        timestamp: new Date('2024-11-20'),
        keywords: ['problem-solving', 'quality', 'delivery'],
        importance: 'high',
        sentiment: 'positive'
      },
      {
        id: 'item-8',
        content: 'Need to improve time management skills for better work-life balance and meeting deadlines consistently.',
        source: 'self-entered',
        sourceDetails: 'Self Review - Areas for Improvement',
        timestamp: new Date('2024-11-15'),
        keywords: ['time-management', 'balance', 'deadlines'],
        importance: 'medium',
        sentiment: 'negative'
      }
    ];

    generateSummary(mockSummaryItems);
  };

  if (isLoading) {
    return (
      <div className="analytics-page loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="analytics-page error">
        <div className="error-message">
          <h2>Unable to load analytics data</h2>
          <p>Please try again later or contact support if the problem persists.</p>
          <button
            className="btn btn-primary btn-medium"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      {/* Header */}
      <div className="page-header">
        <button
          className="btn btn-outline btn-medium back-button"
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </button>
        
        <div className="header-info">
          <h1>Analytics Dashboard</h1>
          <p>Track your performance, skills, and growth over time</p>
        </div>
        
        <div className="header-actions">
          <button
            className="btn btn-secondary btn-medium"
            onClick={() => navigate('/reports')}
          >
            📊 Generate Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <AnalyticsFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Key Metrics */}
      <div className="metrics-grid">
        <MetricsCard
          title="Performance Score"
          value={analyticsData.performance.currentScore}
          previousValue={analyticsData.performance.previousScore}
          format="decimal"
          trend={analyticsData.performance.trend}
          icon="📈"
        />
        
        <MetricsCard
          title="Feedback Rating"
          value={analyticsData.feedback.averageRating}
          previousValue={analyticsData.feedback.averageRating - 0.1}
          format="decimal"
          trend="up"
          icon="💬"
        />
        
        <MetricsCard
          title="Goals Completion"
          value={analyticsData.goals.completionRate}
          previousValue={analyticsData.goals.completionRate - 8}
          format="percentage"
          trend="up"
          icon="🎯"
        />
        
        <MetricsCard
          title="Skills Progress"
          value={analyticsData.skills.reduce((sum, skill) => sum + skill.progress, 0) / analyticsData.skills.length}
          previousValue={75}
          format="percentage"
          trend="up"
          icon="🚀"
        />
      </div>

      {/* Auto-Summary Section */}
      {summaryResult && (
        <div className="summary-section">
          <AutoSummaryDisplay
            summaryResult={summaryResult}
            onRefresh={refreshSummary}
            isLoading={isSummaryLoading}
          />
        </div>
      )}

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-container full-width">
          <SkillGrowthChart
            skills={[
              {
                skill: 'JavaScript',
                data: [
                  { date: '2024-07-01', value: 3.8 },
                  { date: '2024-08-01', value: 4.0 },
                  { date: '2024-09-01', value: 4.2 },
                  { date: '2024-10-01', value: 4.3 },
                  { date: '2024-11-01', value: 4.4 },
                  { date: '2024-12-01', value: 4.5 },
                ],
                color: 'primary',
              },
              {
                skill: 'Leadership',
                data: [
                  { date: '2024-07-01', value: 3.2 },
                  { date: '2024-08-01', value: 3.3 },
                  { date: '2024-09-01', value: 3.5 },
                  { date: '2024-10-01', value: 3.6 },
                  { date: '2024-11-01', value: 3.7 },
                  { date: '2024-12-01', value: 3.8 },
                ],
                color: 'success',
              },
              {
                skill: 'Communication',
                data: [
                  { date: '2024-07-01', value: 3.8 },
                  { date: '2024-08-01', value: 3.9 },
                  { date: '2024-09-01', value: 3.9 },
                  { date: '2024-10-01', value: 4.0 },
                  { date: '2024-11-01', value: 4.0 },
                  { date: '2024-12-01', value: 4.0 },
                ],
                color: 'warning',
              },
            ]}
            timeRange={filters.timeRange}
            height={400}
          />
        </div>

        <div className="chart-container full-width">
          <ReviewScoreTrends
            data={[
              { date: '2024-07-01', selfReview: 3.5, peerReview: 3.8, managerReview: 3.6, overall: 3.6 },
              { date: '2024-08-01', selfReview: 3.7, peerReview: 4.0, managerReview: 3.8, overall: 3.8 },
              { date: '2024-09-01', selfReview: 3.9, peerReview: 4.1, managerReview: 4.0, overall: 4.0 },
              { date: '2024-10-01', selfReview: 4.0, peerReview: 4.2, managerReview: 4.1, overall: 4.1 },
              { date: '2024-11-01', selfReview: 4.1, peerReview: 4.3, managerReview: 4.2, overall: 4.2 },
              { date: '2024-12-01', selfReview: 4.2, peerReview: 4.3, managerReview: 4.3, overall: 4.3 },
            ]}
            showComparison={filters.comparison !== 'none'}
            comparisonData={{
              teamAverage: [3.5, 3.6, 3.7, 3.8, 3.9, 4.0],
              departmentAverage: [3.4, 3.5, 3.6, 3.7, 3.8, 3.9],
            }}
            height={400}
          />
        </div>

        <div className="chart-container">
          <PeerFeedbackVisualization
            data={{
              sentiment: {
                positive: 24,
                neutral: 3,
                negative: 1,
              },
              categories: {
                technical: 4.2,
                communication: 4.0,
                leadership: 3.8,
                collaboration: 4.5,
                problemSolving: 4.1,
                creativity: 3.9,
              },
              sources: [
                { name: 'Sarah Johnson', count: 8, averageRating: 4.3 },
                { name: 'Mike Chen', count: 6, averageRating: 4.1 },
                { name: 'Emily Davis', count: 5, averageRating: 4.4 },
                { name: 'Alex Rodriguez', count: 4, averageRating: 4.0 },
                { name: 'Lisa Wang', count: 5, averageRating: 4.2 },
              ],
              timeline: [
                { month: 'Sep', received: 5, given: 7 },
                { month: 'Oct', received: 7, given: 8 },
                { month: 'Nov', received: 6, given: 9 },
                { month: 'Dec', received: 8, given: 11 },
              ],
            }}
            height={350}
          />
        </div>

        <div className="chart-container">
          <SkillsRadarChart
            skills={analyticsData.skills}
            categories={filters.skillCategories}
          />
        </div>

        <div className="chart-container">
          <FeedbackTrendsChart
            data={analyticsData.feedback.recentTrends}
            totalReceived={analyticsData.feedback.totalReceived}
            totalGiven={analyticsData.feedback.totalGiven}
          />
        </div>

        <div className="chart-container">
          <GoalsProgressChart
            data={analyticsData.goals}
            categoryBreakdown={analyticsData.goals.categoryBreakdown}
          />
        </div>
      </div>

      {/* Insights Section */}
      <div className="insights-section">
        <h2>Key Insights</h2>
        <div className="insights-grid">
          <div className="insight-card positive">
            <div className="insight-icon">🎉</div>
            <div className="insight-content">
              <h3>Strong Performance Growth</h3>
              <p>Your performance score increased by {analyticsData.performance.percentageChange}% this period, placing you in the top {100 - analyticsData.comparisons.percentile}% of your team.</p>
            </div>
          </div>
          
          <div className="insight-card neutral">
            <div className="insight-icon">📚</div>
            <div className="insight-content">
              <h3>Skill Development Focus</h3>
              <p>Continue developing {analyticsData.performance.improvementAreas[0]} to reach your next performance milestone.</p>
            </div>
          </div>
          
          <div className="insight-card warning">
            <div className="insight-icon">⏰</div>
            <div className="insight-content">
              <h3>Goal Attention Needed</h3>
              <p>You have {analyticsData.goals.overdueGoals} overdue goals. Consider reviewing and updating your timeline.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
