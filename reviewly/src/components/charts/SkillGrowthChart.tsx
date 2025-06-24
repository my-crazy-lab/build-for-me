/**
 * Skill Growth Chart Component for Reviewly Application
 * 
 * Interactive line chart showing skill development over time with
 * smooth animations and hover effects.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { lineChartOptions, createDataset, createGradient, chartColors } from './ChartConfig';
import './SkillGrowthChart.css';

interface SkillData {
  skill: string;
  data: { date: string; value: number }[];
  color: keyof typeof chartColors.gradients;
}

interface SkillGrowthChartProps {
  skills: SkillData[];
  timeRange: '1m' | '3m' | '6m' | '1y' | 'all';
  showTrendlines?: boolean;
  height?: number;
}

const SkillGrowthChart: React.FC<SkillGrowthChartProps> = ({
  skills,
  timeRange,
  showTrendlines = true,
  height = 400,
}) => {
  const chartRef = useRef<any>(null);

  // Prepare chart data
  const chartData = {
    labels: skills[0]?.data.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }) || [],
    datasets: skills.map(skill => 
      createDataset(
        skill.skill,
        skill.data.map(d => d.value),
        'line',
        skill.color
      )
    ),
  };

  // Enhanced chart options
  const options = {
    ...lineChartOptions,
    plugins: {
      ...lineChartOptions.plugins,
      title: {
        display: true,
        text: 'Skill Development Over Time',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        color: '#374151',
        padding: 20,
      },
      tooltip: {
        ...lineChartOptions.plugins?.tooltip,
        callbacks: {
          title: function(context: any) {
            return `Date: ${context[0].label}`;
          },
          label: function(context: any) {
            const skill = context.dataset.label;
            const value = context.parsed.y;
            const change = context.dataIndex > 0 
              ? context.parsed.y - context.dataset.data[context.dataIndex - 1]
              : 0;
            const changeText = change > 0 ? `(+${change.toFixed(1)})` : 
                             change < 0 ? `(${change.toFixed(1)})` : '';
            return `${skill}: ${value.toFixed(1)}/5 ${changeText}`;
          },
        },
      },
    },
    scales: {
      ...lineChartOptions.scales,
      y: {
        ...lineChartOptions.scales?.y,
        min: 0,
        max: 5,
        ticks: {
          ...lineChartOptions.scales?.y?.ticks,
          stepSize: 0.5,
          callback: function(value: any) {
            return `${value}/5`;
          },
        },
      },
    },
    onHover: (event: any, elements: any) => {
      if (chartRef.current) {
        chartRef.current.canvas.style.cursor = elements.length > 0 ? 'pointer' : 'default';
      }
    },
  };

  // Add gradient backgrounds
  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const ctx = chart.ctx;
      
      chart.data.datasets.forEach((dataset: any, index: number) => {
        const skill = skills[index];
        if (skill) {
          const colors = chartColors.gradients[skill.color];
          dataset.backgroundColor = createGradient(ctx, [`${colors[0]}40`, `${colors[1]}10`]);
        }
      });
      
      chart.update('none');
    }
  }, [skills]);

  // Calculate skill statistics
  const skillStats = skills.map(skill => {
    const values = skill.data.map(d => d.value);
    const latest = values[values.length - 1];
    const previous = values[values.length - 2] || latest;
    const change = latest - previous;
    const growth = values[values.length - 1] - values[0];
    
    return {
      name: skill.skill,
      current: latest,
      change,
      growth,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
    };
  });

  return (
    <div className="skill-growth-chart">
      <div className="chart-header">
        <div className="chart-title">
          <h3>Skill Development Progress</h3>
          <p>Track your skill growth over the selected time period</p>
        </div>
        
        <div className="chart-controls">
          <div className="time-range-indicator">
            <span className="range-label">Showing:</span>
            <span className="range-value">
              {timeRange === '3m' ? 'Last 3 months' :
               timeRange === '6m' ? 'Last 6 months' :
               timeRange === '1y' ? 'Last year' : 'All time'}
            </span>
          </div>
        </div>
      </div>

      <div className="chart-container" style={{ height }}>
        <Line ref={chartRef} data={chartData} options={options} />
      </div>

      <div className="skill-summary">
        <h4>Current Skill Levels</h4>
        <div className="skills-grid">
          {skillStats.map(stat => (
            <div key={stat.name} className="skill-stat">
              <div className="skill-header">
                <span className="skill-name">{stat.name}</span>
                <span className={`skill-trend ${stat.trend}`}>
                  {stat.trend === 'up' ? '↗️' : stat.trend === 'down' ? '↘️' : '➡️'}
                  {stat.change > 0 ? '+' : ''}{stat.change.toFixed(1)}
                </span>
              </div>
              
              <div className="skill-level">
                <span className="current-level">{stat.current.toFixed(1)}/5</span>
                <div className="level-bar">
                  <div 
                    className="level-fill"
                    style={{ width: `${(stat.current / 5) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="skill-growth">
                <span className="growth-label">Total Growth:</span>
                <span className={`growth-value ${stat.growth >= 0 ? 'positive' : 'negative'}`}>
                  {stat.growth > 0 ? '+' : ''}{stat.growth.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showTrendlines && (
        <div className="trend-analysis">
          <h4>Trend Analysis</h4>
          <div className="trends-list">
            {skillStats.map(stat => (
              <div key={stat.name} className="trend-item">
                <span className="trend-skill">{stat.name}</span>
                <span className="trend-description">
                  {stat.growth > 1 ? 'Strong upward trend' :
                   stat.growth > 0.5 ? 'Moderate growth' :
                   stat.growth > 0 ? 'Slight improvement' :
                   stat.growth === 0 ? 'Stable performance' :
                   stat.growth > -0.5 ? 'Minor decline' :
                   'Needs attention'}
                </span>
                <span className={`trend-indicator ${
                  stat.growth > 0.5 ? 'excellent' :
                  stat.growth > 0 ? 'good' :
                  stat.growth === 0 ? 'neutral' : 'warning'
                }`}>
                  {stat.growth > 0.5 ? '🚀' :
                   stat.growth > 0 ? '📈' :
                   stat.growth === 0 ? '➡️' : '⚠️'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillGrowthChart;
