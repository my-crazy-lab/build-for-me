/**
 * Feedback Trends Chart Component for Reviewly Application
 * 
 * Bar chart showing feedback trends over time with received vs given metrics.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React from 'react';
import './FeedbackTrendsChart.css';

interface FeedbackTrendsChartProps {
  data: { date: string; rating: number; count: number }[];
  totalReceived: number;
  totalGiven: number;
}

const FeedbackTrendsChart: React.FC<FeedbackTrendsChartProps> = ({
  data,
  totalReceived,
  totalGiven,
}) => {
  const chartWidth = 400;
  const chartHeight = 200;
  const padding = 40;

  const maxCount = Math.max(...data.map(d => d.count));
  const maxRating = 5;

  return (
    <div className="feedback-trends-chart">
      <div className="chart-header">
        <h3>Feedback Trends</h3>
        <div className="feedback-stats">
          <div className="stat-item">
            <span className="stat-value">{totalReceived}</span>
            <span className="stat-label">Received</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{totalGiven}</span>
            <span className="stat-label">Given</span>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <svg width={chartWidth} height={chartHeight}>
          {/* Bars */}
          {data.map((d, i) => {
            const barWidth = (chartWidth - padding * 2) / data.length - 10;
            const barHeight = (d.count / maxCount) * (chartHeight - padding * 2);
            const x = padding + i * ((chartWidth - padding * 2) / data.length);
            const y = chartHeight - padding - barHeight;

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="var(--color-primary)"
                  opacity="0.7"
                />
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--color-text-secondary)"
                >
                  {d.date}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--color-text)"
                >
                  {d.rating.toFixed(1)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default FeedbackTrendsChart;
