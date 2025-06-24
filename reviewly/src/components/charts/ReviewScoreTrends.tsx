/**
 * Review Score Trends Chart Component for Reviewly Application
 * 
 * Interactive chart showing review score trends over time with
 * multiple metrics and comparison features.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useRef, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { lineChartOptions, createDataset, createGradient, chartColors } from './ChartConfig';
import './ReviewScoreTrends.css';

interface ReviewData {
  date: string;
  selfReview: number;
  peerReview: number;
  managerReview: number;
  overall: number;
}

interface ReviewScoreTrendsProps {
  data: ReviewData[];
  showComparison?: boolean;
  comparisonData?: {
    teamAverage: number[];
    departmentAverage: number[];
  };
  height?: number;
}

const ReviewScoreTrends: React.FC<ReviewScoreTrendsProps> = ({
  data,
  showComparison = false,
  comparisonData,
  height = 400,
}) => {
  const chartRef = useRef<any>(null);
  const [selectedMetrics, setSelectedMetrics] = useState({
    selfReview: true,
    peerReview: true,
    managerReview: true,
    overall: true,
    teamAverage: showComparison,
    departmentAverage: showComparison,
  });

  // Prepare chart data
  const labels = data.map(d => {
    const date = new Date(d.date);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: '2-digit' 
    });
  });

  const datasets = [];

  // Add main datasets
  if (selectedMetrics.selfReview) {
    datasets.push(createDataset(
      'Self Review',
      data.map(d => d.selfReview),
      'line',
      'primary'
    ));
  }

  if (selectedMetrics.peerReview) {
    datasets.push(createDataset(
      'Peer Review',
      data.map(d => d.peerReview),
      'line',
      'success'
    ));
  }

  if (selectedMetrics.managerReview) {
    datasets.push(createDataset(
      'Manager Review',
      data.map(d => d.managerReview),
      'line',
      'warning'
    ));
  }

  if (selectedMetrics.overall) {
    datasets.push({
      ...createDataset(
        'Overall Score',
        data.map(d => d.overall),
        'line',
        'info'
      ),
      borderWidth: 4,
      pointRadius: 8,
    });
  }

  // Add comparison datasets
  if (showComparison && comparisonData) {
    if (selectedMetrics.teamAverage) {
      datasets.push({
        ...createDataset(
          'Team Average',
          comparisonData.teamAverage,
          'line',
          'danger'
        ),
        borderDash: [5, 5],
        pointRadius: 4,
        backgroundColor: 'transparent',
      });
    }

    if (selectedMetrics.departmentAverage) {
      datasets.push({
        ...createDataset(
          'Department Average',
          comparisonData.departmentAverage,
          'line',
          'danger'
        ),
        borderDash: [10, 5],
        pointRadius: 4,
        backgroundColor: 'transparent',
      });
    }
  }

  const chartData = { labels, datasets };

  // Enhanced chart options
  const options = {
    ...lineChartOptions,
    plugins: {
      ...lineChartOptions.plugins,
      title: {
        display: true,
        text: 'Review Score Trends',
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
            return `Review Period: ${context[0].label}`;
          },
          label: function(context: any) {
            const metric = context.dataset.label;
            const value = context.parsed.y;
            return `${metric}: ${value.toFixed(1)}/5`;
          },
          afterBody: function(context: any) {
            if (context.length > 0) {
              const dataIndex = context[0].dataIndex;
              const currentData = data[dataIndex];
              if (currentData) {
                return [
                  '',
                  `Review Details:`,
                  `• Self: ${currentData.selfReview.toFixed(1)}/5`,
                  `• Peer: ${currentData.peerReview.toFixed(1)}/5`,
                  `• Manager: ${currentData.managerReview.toFixed(1)}/5`,
                  `• Overall: ${currentData.overall.toFixed(1)}/5`,
                ];
              }
            }
            return [];
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
  };

  // Add gradient backgrounds
  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const ctx = chart.ctx;
      
      chart.data.datasets.forEach((dataset: any, index: number) => {
        if (!dataset.borderDash) { // Only add gradients to non-dashed lines
          const colorKeys = ['primary', 'success', 'warning', 'info'];
          const colorKey = colorKeys[index % colorKeys.length];
          const colors = chartColors.gradients[colorKey as keyof typeof chartColors.gradients];
          dataset.backgroundColor = createGradient(ctx, [`${colors[0]}30`, `${colors[1]}05`]);
        }
      });
      
      chart.update('none');
    }
  }, [selectedMetrics]);

  // Calculate statistics
  const latestData = data[data.length - 1];
  const previousData = data[data.length - 2];
  const stats = latestData ? {
    current: {
      selfReview: latestData.selfReview,
      peerReview: latestData.peerReview,
      managerReview: latestData.managerReview,
      overall: latestData.overall,
    },
    change: previousData ? {
      selfReview: latestData.selfReview - previousData.selfReview,
      peerReview: latestData.peerReview - previousData.peerReview,
      managerReview: latestData.managerReview - previousData.managerReview,
      overall: latestData.overall - previousData.overall,
    } : null,
  } : null;

  // Toggle metric visibility
  const toggleMetric = (metric: keyof typeof selectedMetrics) => {
    setSelectedMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric],
    }));
  };

  return (
    <div className="review-score-trends">
      <div className="chart-header">
        <div className="chart-title">
          <h3>Review Score Trends</h3>
          <p>Track your performance across different review types</p>
        </div>
        
        <div className="metric-toggles">
          <button
            className={`metric-toggle ${selectedMetrics.selfReview ? 'active' : ''}`}
            onClick={() => toggleMetric('selfReview')}
          >
            Self Review
          </button>
          <button
            className={`metric-toggle ${selectedMetrics.peerReview ? 'active' : ''}`}
            onClick={() => toggleMetric('peerReview')}
          >
            Peer Review
          </button>
          <button
            className={`metric-toggle ${selectedMetrics.managerReview ? 'active' : ''}`}
            onClick={() => toggleMetric('managerReview')}
          >
            Manager Review
          </button>
          <button
            className={`metric-toggle ${selectedMetrics.overall ? 'active' : ''}`}
            onClick={() => toggleMetric('overall')}
          >
            Overall
          </button>
          
          {showComparison && (
            <>
              <button
                className={`metric-toggle comparison ${selectedMetrics.teamAverage ? 'active' : ''}`}
                onClick={() => toggleMetric('teamAverage')}
              >
                Team Avg
              </button>
              <button
                className={`metric-toggle comparison ${selectedMetrics.departmentAverage ? 'active' : ''}`}
                onClick={() => toggleMetric('departmentAverage')}
              >
                Dept Avg
              </button>
            </>
          )}
        </div>
      </div>

      <div className="chart-container" style={{ height }}>
        <Line ref={chartRef} data={chartData} options={options} />
      </div>

      {stats && (
        <div className="score-summary">
          <h4>Latest Review Scores</h4>
          <div className="scores-grid">
            <div className="score-item">
              <div className="score-header">
                <span className="score-label">Self Review</span>
                {stats.change && (
                  <span className={`score-change ${stats.change.selfReview >= 0 ? 'positive' : 'negative'}`}>
                    {stats.change.selfReview > 0 ? '+' : ''}{stats.change.selfReview.toFixed(1)}
                  </span>
                )}
              </div>
              <div className="score-value">{stats.current.selfReview.toFixed(1)}/5</div>
              <div className="score-bar">
                <div 
                  className="score-fill self"
                  style={{ width: `${(stats.current.selfReview / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="score-item">
              <div className="score-header">
                <span className="score-label">Peer Review</span>
                {stats.change && (
                  <span className={`score-change ${stats.change.peerReview >= 0 ? 'positive' : 'negative'}`}>
                    {stats.change.peerReview > 0 ? '+' : ''}{stats.change.peerReview.toFixed(1)}
                  </span>
                )}
              </div>
              <div className="score-value">{stats.current.peerReview.toFixed(1)}/5</div>
              <div className="score-bar">
                <div 
                  className="score-fill peer"
                  style={{ width: `${(stats.current.peerReview / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="score-item">
              <div className="score-header">
                <span className="score-label">Manager Review</span>
                {stats.change && (
                  <span className={`score-change ${stats.change.managerReview >= 0 ? 'positive' : 'negative'}`}>
                    {stats.change.managerReview > 0 ? '+' : ''}{stats.change.managerReview.toFixed(1)}
                  </span>
                )}
              </div>
              <div className="score-value">{stats.current.managerReview.toFixed(1)}/5</div>
              <div className="score-bar">
                <div 
                  className="score-fill manager"
                  style={{ width: `${(stats.current.managerReview / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="score-item overall">
              <div className="score-header">
                <span className="score-label">Overall Score</span>
                {stats.change && (
                  <span className={`score-change ${stats.change.overall >= 0 ? 'positive' : 'negative'}`}>
                    {stats.change.overall > 0 ? '+' : ''}{stats.change.overall.toFixed(1)}
                  </span>
                )}
              </div>
              <div className="score-value">{stats.current.overall.toFixed(1)}/5</div>
              <div className="score-bar">
                <div 
                  className="score-fill overall"
                  style={{ width: `${(stats.current.overall / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewScoreTrends;
