/**
 * Goals Progress Chart Component for Reviewly Application
 * 
 * Donut chart showing goals completion status with category breakdown.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React from 'react';
import type { GoalMetrics } from '../../pages/AnalyticsPage';
import './GoalsProgressChart.css';

interface GoalsProgressChartProps {
  data: GoalMetrics;
  categoryBreakdown: { category: string; completed: number; total: number }[];
}

const GoalsProgressChart: React.FC<GoalsProgressChartProps> = ({
  data,
  categoryBreakdown,
}) => {
  const size = 200;
  const center = size / 2;
  const radius = 70;
  const strokeWidth = 20;

  // Calculate percentages
  const completedPercentage = (data.completedGoals / data.totalGoals) * 100;
  const inProgressPercentage = (data.inProgressGoals / data.totalGoals) * 100;
  const overduePercentage = (data.overdueGoals / data.totalGoals) * 100;

  // Calculate stroke dash arrays for donut segments
  const circumference = 2 * Math.PI * radius;
  const completedDash = (completedPercentage / 100) * circumference;
  const inProgressDash = (inProgressPercentage / 100) * circumference;
  const overdueDash = (overduePercentage / 100) * circumference;

  return (
    <div className="goals-progress-chart">
      <div className="chart-header">
        <h3>Goals Progress</h3>
        <div className="completion-rate">
          {data.completionRate}% Complete
        </div>
      </div>

      <div className="chart-container">
        <div className="donut-chart">
          <svg width={size} height={size}>
            {/* Background circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="var(--color-border)"
              strokeWidth={strokeWidth}
              opacity="0.2"
            />

            {/* Completed segment */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="var(--color-success)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${completedDash} ${circumference}`}
              strokeDashoffset={0}
              transform={`rotate(-90 ${center} ${center})`}
            />

            {/* In progress segment */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="var(--color-info)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${inProgressDash} ${circumference}`}
              strokeDashoffset={-completedDash}
              transform={`rotate(-90 ${center} ${center})`}
            />

            {/* Overdue segment */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="var(--color-danger)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${overdueDash} ${circumference}`}
              strokeDashoffset={-(completedDash + inProgressDash)}
              transform={`rotate(-90 ${center} ${center})`}
            />

            {/* Center text */}
            <text
              x={center}
              y={center - 5}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="24"
              fontWeight="bold"
              fill="var(--color-text)"
            >
              {data.totalGoals}
            </text>
            <text
              x={center}
              y={center + 15}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="12"
              fill="var(--color-text-secondary)"
            >
              Total Goals
            </text>
          </svg>
        </div>

        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color completed"></div>
            <span>Completed ({data.completedGoals})</span>
          </div>
          <div className="legend-item">
            <div className="legend-color in-progress"></div>
            <span>In Progress ({data.inProgressGoals})</span>
          </div>
          <div className="legend-item">
            <div className="legend-color overdue"></div>
            <span>Overdue ({data.overdueGoals})</span>
          </div>
        </div>
      </div>

      <div className="category-breakdown">
        <h4>By Category</h4>
        {categoryBreakdown.map(category => (
          <div key={category.category} className="category-item">
            <div className="category-info">
              <span className="category-name">{category.category}</span>
              <span className="category-ratio">
                {category.completed}/{category.total}
              </span>
            </div>
            <div className="category-progress">
              <div 
                className="progress-bar"
                style={{ width: `${(category.completed / category.total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalsProgressChart;
