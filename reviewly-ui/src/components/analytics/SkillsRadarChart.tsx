/**
 * Skills Radar Chart Component for Reviewly Application
 * 
 * Radar/spider chart showing skill levels across different categories
 * with current vs target comparisons.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React from 'react';
import type { SkillMetrics } from '../../pages/AnalyticsPage';
import './SkillsRadarChart.css';

interface SkillsRadarChartProps {
  skills: SkillMetrics[];
  categories: string[];
}

const SkillsRadarChart: React.FC<SkillsRadarChartProps> = ({
  skills,
  categories,
}) => {
  const size = 300;
  const center = size / 2;
  const maxRadius = center - 40;

  // Filter skills by selected categories
  const filteredSkills = skills.filter(skill => 
    categories.includes(skill.category)
  );

  // Calculate points for radar chart
  const getRadarPoints = (values: number[]) => {
    return values.map((value, index) => {
      const angle = (index * 2 * Math.PI) / values.length - Math.PI / 2;
      const radius = (value / 5) * maxRadius;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      return { x, y };
    });
  };

  // Get axis points
  const axisPoints = filteredSkills.map((_, index) => {
    const angle = (index * 2 * Math.PI) / filteredSkills.length - Math.PI / 2;
    const x = center + maxRadius * Math.cos(angle);
    const y = center + maxRadius * Math.sin(angle);
    return { x, y, angle };
  });

  // Current and target values
  const currentValues = filteredSkills.map(skill => skill.currentLevel);
  const targetValues = filteredSkills.map(skill => skill.targetLevel);

  const currentPoints = getRadarPoints(currentValues);
  const targetPoints = getRadarPoints(targetValues);

  // Create path strings
  const currentPath = currentPoints.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ') + ' Z';

  const targetPath = targetPoints.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ') + ' Z';

  return (
    <div className="skills-radar-chart">
      <div className="chart-header">
        <h3>Skills Assessment</h3>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color current"></div>
            <span>Current Level</span>
          </div>
          <div className="legend-item">
            <div className="legend-color target"></div>
            <span>Target Level</span>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <svg width={size} height={size} className="radar-svg">
          {/* Background circles */}
          {[1, 2, 3, 4, 5].map(level => (
            <circle
              key={level}
              cx={center}
              cy={center}
              r={(level / 5) * maxRadius}
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="1"
              opacity="0.3"
            />
          ))}

          {/* Axis lines */}
          {axisPoints.map((point, index) => (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="var(--color-border)"
              strokeWidth="1"
              opacity="0.5"
            />
          ))}

          {/* Target area */}
          <path
            d={targetPath}
            fill="var(--color-warning)"
            fillOpacity="0.1"
            stroke="var(--color-warning)"
            strokeWidth="2"
            strokeDasharray="5,5"
          />

          {/* Current area */}
          <path
            d={currentPath}
            fill="var(--color-primary)"
            fillOpacity="0.2"
            stroke="var(--color-primary)"
            strokeWidth="3"
          />

          {/* Data points */}
          {currentPoints.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="var(--color-primary)"
              stroke="var(--color-surface)"
              strokeWidth="2"
            />
          ))}

          {/* Skill labels */}
          {axisPoints.map((point, index) => {
            const skill = filteredSkills[index];
            const labelX = center + (maxRadius + 20) * Math.cos(point.angle);
            const labelY = center + (maxRadius + 20) * Math.sin(point.angle);
            
            return (
              <text
                key={index}
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill="var(--color-text)"
                fontWeight="500"
              >
                {skill.name}
              </text>
            );
          })}

          {/* Level labels */}
          {[1, 2, 3, 4, 5].map(level => (
            <text
              key={level}
              x={center + 5}
              y={center - (level / 5) * maxRadius}
              fontSize="10"
              fill="var(--color-text-secondary)"
              dominantBaseline="middle"
            >
              {level}
            </text>
          ))}
        </svg>
      </div>

      {/* Skills summary */}
      <div className="skills-summary">
        {filteredSkills.map(skill => (
          <div key={skill.name} className="skill-item">
            <div className="skill-info">
              <span className="skill-name">{skill.name}</span>
              <span className="skill-level">{skill.currentLevel.toFixed(1)}/5</span>
            </div>
            <div className="skill-progress">
              <div 
                className="progress-bar"
                style={{ width: `${(skill.currentLevel / 5) * 100}%` }}
              />
            </div>
            <div className="skill-trend">
              {skill.trend === 'up' && <span className="trend-up">↗️</span>}
              {skill.trend === 'down' && <span className="trend-down">↘️</span>}
              {skill.trend === 'stable' && <span className="trend-stable">➡️</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsRadarChart;
