/**
 * Performance Chart Component for Reviewly Application
 * 
 * Line chart showing performance trends over time with comparison data
 * and interactive tooltips.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React from 'react';
import type { TrendData, ComparisonData } from '../../pages/AnalyticsPage';
import './PerformanceChart.css';

interface PerformanceChartProps {
  data: TrendData[];
  timeRange: string;
  comparison: ComparisonData;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  timeRange,
  comparison,
}) => {
  // Calculate chart dimensions
  const chartWidth = 400;
  const chartHeight = 200;
  const padding = 40;
  const innerWidth = chartWidth - padding * 2;
  const innerHeight = chartHeight - padding * 2;

  // Get min/max values for scaling
  const performanceValues = data.map(d => d.performance);
  const minValue = Math.min(...performanceValues, comparison.teamAverage) - 0.2;
  const maxValue = Math.max(...performanceValues, comparison.teamAverage) + 0.2;

  // Scale functions
  const scaleX = (index: number) => (index / (data.length - 1)) * innerWidth + padding;
  const scaleY = (value: number) => chartHeight - padding - ((value - minValue) / (maxValue - minValue)) * innerHeight;

  // Generate path for performance line
  const performancePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(d.performance)}`)
    .join(' ');

  // Generate comparison line
  const comparisonY = scaleY(comparison.teamAverage);

  return (
    <div className="performance-chart">
      <div className="chart-header">
        <h3>Performance Trends</h3>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color performance"></div>
            <span>Your Performance</span>
          </div>
          <div className="legend-item">
            <div className="legend-color team"></div>
            <span>Team Average</span>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <svg width={chartWidth} height={chartHeight} className="chart-svg">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 20" fill="none" stroke="var(--color-border)" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width={chartWidth} height={chartHeight} fill="url(#grid)" />

          {/* Y-axis labels */}
          {[1, 2, 3, 4, 5].map(value => (
            <g key={value}>
              <line
                x1={padding}
                y1={scaleY(value)}
                x2={chartWidth - padding}
                y2={scaleY(value)}
                stroke="var(--color-border)"
                strokeWidth="0.5"
                opacity="0.5"
              />
              <text
                x={padding - 10}
                y={scaleY(value)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="12"
                fill="var(--color-text-secondary)"
              >
                {value}
              </text>
            </g>
          ))}

          {/* X-axis labels */}
          {data.map((d, i) => (
            <text
              key={i}
              x={scaleX(i)}
              y={chartHeight - 10}
              textAnchor="middle"
              fontSize="12"
              fill="var(--color-text-secondary)"
            >
              {d.date}
            </text>
          ))}

          {/* Team average line */}
          <line
            x1={padding}
            y1={comparisonY}
            x2={chartWidth - padding}
            y2={comparisonY}
            stroke="var(--color-warning)"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.7"
          />

          {/* Performance line */}
          <path
            d={performancePath}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((d, i) => (
            <g key={i}>
              <circle
                cx={scaleX(i)}
                cy={scaleY(d.performance)}
                r="4"
                fill="var(--color-primary)"
                stroke="var(--color-surface)"
                strokeWidth="2"
                className="data-point"
              />
              
              {/* Tooltip on hover */}
              <circle
                cx={scaleX(i)}
                cy={scaleY(d.performance)}
                r="12"
                fill="transparent"
                className="hover-area"
                data-tooltip={`${d.date}: ${d.performance.toFixed(1)}`}
              />
            </g>
          ))}
        </svg>

        {/* Chart info */}
        <div className="chart-info">
          <div className="info-item">
            <span className="info-label">Current:</span>
            <span className="info-value">{data[data.length - 1]?.performance.toFixed(1)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Team Avg:</span>
            <span className="info-value">{comparison.teamAverage.toFixed(1)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Percentile:</span>
            <span className="info-value">{comparison.percentile}th</span>
          </div>
        </div>
      </div>

      {/* Performance summary */}
      <div className="chart-summary">
        <div className="summary-item">
          <div className="summary-icon">📈</div>
          <div className="summary-content">
            <h4>Trend Analysis</h4>
            <p>
              {data[data.length - 1]?.performance > data[0]?.performance
                ? `Positive growth of ${((data[data.length - 1]?.performance - data[0]?.performance) * 100 / data[0]?.performance).toFixed(1)}%`
                : 'Performance has remained stable'
              } over the selected period.
            </p>
          </div>
        </div>
        
        <div className="summary-item">
          <div className="summary-icon">🎯</div>
          <div className="summary-content">
            <h4>Benchmark Comparison</h4>
            <p>
              You're performing {data[data.length - 1]?.performance > comparison.teamAverage ? 'above' : 'below'} team average
              by {Math.abs(data[data.length - 1]?.performance - comparison.teamAverage).toFixed(1)} points.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;
