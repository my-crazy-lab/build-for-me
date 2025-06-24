/**
 * Peer Feedback Visualization Component for Reviewly Application
 * 
 * Interactive visualization showing peer feedback patterns, sentiment analysis,
 * and collaboration metrics with multiple chart types.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState } from 'react';
import { Doughnut, Bar, Radar } from 'react-chartjs-2';
import { 
  doughnutChartOptions, 
  barChartOptions, 
  radarChartOptions,
  createDataset, 
  chartColors 
} from './ChartConfig';
import './PeerFeedbackVisualization.css';

interface FeedbackData {
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  categories: {
    technical: number;
    communication: number;
    leadership: number;
    collaboration: number;
    problemSolving: number;
    creativity: number;
  };
  sources: {
    name: string;
    count: number;
    averageRating: number;
  }[];
  timeline: {
    month: string;
    received: number;
    given: number;
  }[];
}

interface PeerFeedbackVisualizationProps {
  data: FeedbackData;
  height?: number;
}

const PeerFeedbackVisualization: React.FC<PeerFeedbackVisualizationProps> = ({
  data,
  height = 300,
}) => {
  const [activeView, setActiveView] = useState<'sentiment' | 'categories' | 'sources' | 'timeline'>('sentiment');

  // Sentiment Analysis Chart
  const sentimentData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [{
      data: [data.sentiment.positive, data.sentiment.neutral, data.sentiment.negative],
      backgroundColor: [
        chartColors.success,
        chartColors.gray,
        chartColors.danger,
      ],
      borderWidth: 2,
      borderColor: '#ffffff',
    }],
  };

  const sentimentOptions = {
    ...doughnutChartOptions,
    plugins: {
      ...doughnutChartOptions.plugins,
      title: {
        display: true,
        text: 'Feedback Sentiment Analysis',
        font: {
          size: 14,
          weight: 'bold' as const,
        },
        color: '#374151',
        padding: 16,
      },
    },
  };

  // Categories Radar Chart
  const categoriesData = {
    labels: [
      'Technical Skills',
      'Communication',
      'Leadership',
      'Collaboration',
      'Problem Solving',
      'Creativity'
    ],
    datasets: [{
      label: 'Peer Feedback Scores',
      data: [
        data.categories.technical,
        data.categories.communication,
        data.categories.leadership,
        data.categories.collaboration,
        data.categories.problemSolving,
        data.categories.creativity,
      ],
      backgroundColor: `${chartColors.primary}30`,
      borderColor: chartColors.primary,
      borderWidth: 2,
      pointBackgroundColor: chartColors.primary,
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 6,
    }],
  };

  const categoriesOptions = {
    ...radarChartOptions,
    plugins: {
      ...radarChartOptions.plugins,
      title: {
        display: true,
        text: 'Feedback by Category',
        font: {
          size: 14,
          weight: 'bold' as const,
        },
        color: '#374151',
        padding: 16,
      },
    },
  };

  // Sources Bar Chart
  const sourcesData = {
    labels: data.sources.map(s => s.name),
    datasets: [
      createDataset('Feedback Count', data.sources.map(s => s.count), 'bar', 'info'),
    ],
  };

  const sourcesOptions = {
    ...barChartOptions,
    plugins: {
      ...barChartOptions.plugins,
      title: {
        display: true,
        text: 'Feedback Sources',
        font: {
          size: 14,
          weight: 'bold' as const,
        },
        color: '#374151',
        padding: 16,
      },
    },
  };

  // Timeline Bar Chart
  const timelineData = {
    labels: data.timeline.map(t => t.month),
    datasets: [
      createDataset('Received', data.timeline.map(t => t.received), 'bar', 'success'),
      createDataset('Given', data.timeline.map(t => t.given), 'bar', 'info'),
    ],
  };

  const timelineOptions = {
    ...barChartOptions,
    plugins: {
      ...barChartOptions.plugins,
      title: {
        display: true,
        text: 'Feedback Activity Timeline',
        font: {
          size: 14,
          weight: 'bold' as const,
        },
        color: '#374151',
        padding: 16,
      },
    },
  };

  // Calculate summary statistics
  const totalFeedback = data.sentiment.positive + data.sentiment.neutral + data.sentiment.negative;
  const positivePercentage = totalFeedback > 0 ? (data.sentiment.positive / totalFeedback) * 100 : 0;
  const averageRating = data.sources.reduce((sum, source) => sum + source.averageRating, 0) / data.sources.length;
  const totalReceived = data.timeline.reduce((sum, month) => sum + month.received, 0);
  const totalGiven = data.timeline.reduce((sum, month) => sum + month.given, 0);

  const renderChart = () => {
    switch (activeView) {
      case 'sentiment':
        return <Doughnut data={sentimentData} options={sentimentOptions} />;
      case 'categories':
        return <Radar data={categoriesData} options={categoriesOptions} />;
      case 'sources':
        return <Bar data={sourcesData} options={sourcesOptions} />;
      case 'timeline':
        return <Bar data={timelineData} options={timelineOptions} />;
      default:
        return <Doughnut data={sentimentData} options={sentimentOptions} />;
    }
  };

  return (
    <div className="peer-feedback-visualization">
      <div className="chart-header">
        <div className="chart-title">
          <h3>Peer Feedback Analysis</h3>
          <p>Insights from colleague feedback and collaboration patterns</p>
        </div>
        
        <div className="view-toggles">
          <button
            className={`view-toggle ${activeView === 'sentiment' ? 'active' : ''}`}
            onClick={() => setActiveView('sentiment')}
          >
            😊 Sentiment
          </button>
          <button
            className={`view-toggle ${activeView === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveView('categories')}
          >
            📊 Categories
          </button>
          <button
            className={`view-toggle ${activeView === 'sources' ? 'active' : ''}`}
            onClick={() => setActiveView('sources')}
          >
            👥 Sources
          </button>
          <button
            className={`view-toggle ${activeView === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveView('timeline')}
          >
            📅 Timeline
          </button>
        </div>
      </div>

      <div className="chart-container" style={{ height }}>
        {renderChart()}
      </div>

      <div className="feedback-summary">
        <div className="summary-stats">
          <div className="stat-item">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-value">{positivePercentage.toFixed(1)}%</div>
              <div className="stat-label">Positive Feedback</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-value">{averageRating.toFixed(1)}/5</div>
              <div className="stat-label">Average Rating</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">📥</div>
            <div className="stat-content">
              <div className="stat-value">{totalReceived}</div>
              <div className="stat-label">Feedback Received</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">📤</div>
            <div className="stat-content">
              <div className="stat-value">{totalGiven}</div>
              <div className="stat-label">Feedback Given</div>
            </div>
          </div>
        </div>

        <div className="insights">
          <h4>Key Insights</h4>
          <div className="insights-list">
            <div className="insight-item">
              <span className="insight-icon">🎯</span>
              <span className="insight-text">
                Strongest area: {Object.entries(data.categories)
                  .sort(([,a], [,b]) => b - a)[0][0]
                  .replace(/([A-Z])/g, ' $1')
                  .toLowerCase()
                  .replace(/^./, str => str.toUpperCase())}
              </span>
            </div>
            
            <div className="insight-item">
              <span className="insight-icon">📊</span>
              <span className="insight-text">
                Most active feedback source: {data.sources
                  .sort((a, b) => b.count - a.count)[0]?.name || 'N/A'}
              </span>
            </div>
            
            <div className="insight-item">
              <span className="insight-icon">🤝</span>
              <span className="insight-text">
                Feedback ratio: {totalReceived > 0 ? (totalGiven / totalReceived).toFixed(1) : '0'}:1 
                (given:received)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeerFeedbackVisualization;
