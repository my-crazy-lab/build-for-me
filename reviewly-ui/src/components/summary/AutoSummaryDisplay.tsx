/**
 * Auto-Summary Display Component for Reviewly Application
 * 
 * Interactive display of automatically generated summaries with
 * categorized insights, key achievements, and recommendations.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState } from 'react';
import type { AutoSummaryResult, CategorySummary } from '../../utils/autoSummary';
import './AutoSummaryDisplay.css';

interface AutoSummaryDisplayProps {
  summaryResult: AutoSummaryResult;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const AutoSummaryDisplay: React.FC<AutoSummaryDisplayProps> = ({
  summaryResult,
  onRefresh,
  isLoading = false,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'insights'>('overview');

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getImportanceIcon = (importance: 'high' | 'medium' | 'low') => {
    switch (importance) {
      case 'high': return '🔥';
      case 'medium': return '⭐';
      case 'low': return '📝';
    }
  };

  const getTrendIcon = (trend: 'increasing' | 'stable' | 'decreasing') => {
    switch (trend) {
      case 'increasing': return '📈';
      case 'stable': return '➡️';
      case 'decreasing': return '📉';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'var(--color-success)';
    if (confidence >= 0.6) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  if (isLoading) {
    return (
      <div className="auto-summary-display loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Analyzing and summarizing your information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auto-summary-display">
      {/* Header */}
      <div className="summary-header">
        <div className="header-info">
          <h2>🤖 AI-Powered Summary</h2>
          <p>Automatically generated insights from your activities and achievements</p>
        </div>
        
        <div className="header-actions">
          <div className="confidence-indicator">
            <span className="confidence-label">Confidence:</span>
            <span 
              className="confidence-value"
              style={{ color: getConfidenceColor(summaryResult.metadata.confidence) }}
            >
              {Math.round(summaryResult.metadata.confidence * 100)}%
            </span>
          </div>
          
          {onRefresh && (
            <button
              className="btn btn-secondary btn-medium"
              onClick={onRefresh}
              disabled={isLoading}
            >
              🔄 Refresh Summary
            </button>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="summary-metadata">
        <div className="metadata-item">
          <span className="metadata-icon">📊</span>
          <span className="metadata-label">Items Analyzed:</span>
          <span className="metadata-value">{summaryResult.metadata.totalItems}</span>
        </div>
        
        <div className="metadata-item">
          <span className="metadata-icon">📅</span>
          <span className="metadata-label">Generated:</span>
          <span className="metadata-value">
            {summaryResult.metadata.processedAt.toLocaleDateString()}
          </span>
        </div>
        
        <div className="metadata-item">
          <span className="metadata-icon">🏷️</span>
          <span className="metadata-label">Categories:</span>
          <span className="metadata-value">{summaryResult.categories.length}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="summary-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📋 Overview
        </button>
        <button
          className={`tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          📂 Categories
        </button>
        <button
          className={`tab ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          💡 Insights
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="overall-summary">
              <h3>📝 Overall Summary</h3>
              <p className="summary-text">{summaryResult.overallSummary}</p>
            </div>

            <div className="quick-stats">
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-content">
                  <div className="stat-value">{summaryResult.keyAchievements.length}</div>
                  <div className="stat-label">Key Achievements</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🚀</div>
                <div className="stat-content">
                  <div className="stat-value">{summaryResult.skillsHighlights.length}</div>
                  <div className="stat-label">Skills Highlights</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <div className="stat-content">
                  <div className="stat-value">
                    {summaryResult.categories.filter(c => c.trends.growth === 'increasing').length}
                  </div>
                  <div className="stat-label">Growing Areas</div>
                </div>
              </div>
            </div>

            <div className="top-categories">
              <h3>🏆 Top Categories</h3>
              <div className="categories-preview">
                {summaryResult.categories.slice(0, 3).map((category) => (
                  <div key={category.category} className="category-preview">
                    <div className="category-header">
                      <span className="category-icon">
                        {getImportanceIcon(category.importance)}
                      </span>
                      <span className="category-name">{category.category}</span>
                      <span className="category-count">{category.totalItems} items</span>
                    </div>
                    <p className="category-summary">{category.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="categories-tab">
            <div className="categories-list">
              {summaryResult.categories.map((category) => (
                <div key={category.category} className="category-card">
                  <div 
                    className="category-header clickable"
                    onClick={() => toggleCategory(category.category)}
                  >
                    <div className="category-info">
                      <span className="category-icon">
                        {getImportanceIcon(category.importance)}
                      </span>
                      <h4 className="category-title">{category.category}</h4>
                      <span className="category-meta">
                        {category.totalItems} items • {category.importance} priority
                      </span>
                    </div>
                    
                    <div className="category-trends">
                      <span className="trend-icon">
                        {getTrendIcon(category.trends.growth)}
                      </span>
                      <span className="trend-text">{category.trends.growth}</span>
                    </div>
                    
                    <button className="expand-button">
                      {expandedCategories.has(category.category) ? '▼' : '▶'}
                    </button>
                  </div>

                  {expandedCategories.has(category.category) && (
                    <div className="category-details">
                      <div className="category-summary">
                        <p>{category.summary}</p>
                      </div>
                      
                      {category.keyPoints.length > 0 && (
                        <div className="key-points">
                          <h5>🔑 Key Points:</h5>
                          <ul>
                            {category.keyPoints.map((point, index) => (
                              <li key={index}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="category-stats">
                        <div className="stat">
                          <span className="stat-label">Frequency:</span>
                          <span className="stat-value">
                            {category.trends.frequency} items/day
                          </span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">Timespan:</span>
                          <span className="stat-value">{category.trends.timespan}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="insights-tab">
            {summaryResult.keyAchievements.length > 0 && (
              <div className="insights-section">
                <h3>🎯 Key Achievements</h3>
                <ul className="insights-list">
                  {summaryResult.keyAchievements.map((achievement, index) => (
                    <li key={index} className="insight-item achievement">
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {summaryResult.skillsHighlights.length > 0 && (
              <div className="insights-section">
                <h3>🚀 Skills Highlights</h3>
                <ul className="insights-list">
                  {summaryResult.skillsHighlights.map((skill, index) => (
                    <li key={index} className="insight-item skill">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {summaryResult.areasForImprovement.length > 0 && (
              <div className="insights-section">
                <h3>📈 Areas for Improvement</h3>
                <ul className="insights-list">
                  {summaryResult.areasForImprovement.map((area, index) => (
                    <li key={index} className="insight-item improvement">
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="insights-section">
              <h3>💡 Recommendations</h3>
              <ul className="insights-list">
                {summaryResult.recommendations.map((recommendation, index) => (
                  <li key={index} className="insight-item recommendation">
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoSummaryDisplay;
