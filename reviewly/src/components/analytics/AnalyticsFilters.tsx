/**
 * Analytics Filters Component for Reviewly Application
 * 
 * Filter controls for analytics dashboard with time range,
 * metrics selection, and comparison options.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React from 'react';
import './AnalyticsFilters.css';

interface AnalyticsFiltersState {
  timeRange: '1m' | '3m' | '6m' | '1y' | 'all';
  metrics: string[];
  comparison: 'none' | 'team' | 'department' | 'company';
  skillCategories: string[];
}

interface AnalyticsFiltersProps {
  filters: AnalyticsFiltersState;
  onFiltersChange: (filters: AnalyticsFiltersState) => void;
}

const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const handleFilterChange = (key: keyof AnalyticsFiltersState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleMetricToggle = (metric: string) => {
    const newMetrics = filters.metrics.includes(metric)
      ? filters.metrics.filter(m => m !== metric)
      : [...filters.metrics, metric];
    handleFilterChange('metrics', newMetrics);
  };

  const handleSkillCategoryToggle = (category: string) => {
    const newCategories = filters.skillCategories.includes(category)
      ? filters.skillCategories.filter(c => c !== category)
      : [...filters.skillCategories, category];
    handleFilterChange('skillCategories', newCategories);
  };

  return (
    <div className="analytics-filters">
      <div className="filters-section">
        <h3>Time Range</h3>
        <div className="time-range-buttons">
          {[
            { value: '1m', label: '1 Month' },
            { value: '3m', label: '3 Months' },
            { value: '6m', label: '6 Months' },
            { value: '1y', label: '1 Year' },
            { value: 'all', label: 'All Time' },
          ].map(option => (
            <button
              key={option.value}
              className={`time-range-btn ${filters.timeRange === option.value ? 'active' : ''}`}
              onClick={() => handleFilterChange('timeRange', option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filters-section">
        <h3>Metrics</h3>
        <div className="metrics-checkboxes">
          {[
            { value: 'performance', label: 'Performance' },
            { value: 'skills', label: 'Skills' },
            { value: 'feedback', label: 'Feedback' },
            { value: 'goals', label: 'Goals' },
          ].map(metric => (
            <label key={metric.value} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.metrics.includes(metric.value)}
                onChange={() => handleMetricToggle(metric.value)}
              />
              <span>{metric.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filters-section">
        <h3>Comparison</h3>
        <select
          value={filters.comparison}
          onChange={(e) => handleFilterChange('comparison', e.target.value)}
          className="comparison-select"
        >
          <option value="none">No Comparison</option>
          <option value="team">Team Average</option>
          <option value="department">Department Average</option>
          <option value="company">Company Average</option>
        </select>
      </div>

      <div className="filters-section">
        <h3>Skill Categories</h3>
        <div className="skill-categories">
          {[
            { value: 'technical', label: 'Technical' },
            { value: 'leadership', label: 'Leadership' },
            { value: 'communication', label: 'Communication' },
            { value: 'creativity', label: 'Creativity' },
          ].map(category => (
            <label key={category.value} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.skillCategories.includes(category.value)}
                onChange={() => handleSkillCategoryToggle(category.value)}
              />
              <span>{category.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsFilters;
