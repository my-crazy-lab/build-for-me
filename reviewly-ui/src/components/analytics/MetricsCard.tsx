/**
 * Metrics Card Component for Reviewly Application
 * 
 * Reusable card component for displaying key performance metrics
 * with trend indicators and visual formatting.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React from 'react';
import './MetricsCard.css';

interface MetricsCardProps {
  title: string;
  value: number;
  previousValue?: number;
  format: 'decimal' | 'percentage' | 'integer';
  trend?: 'up' | 'down' | 'stable';
  icon: string;
  subtitle?: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  previousValue,
  format,
  trend,
  icon,
  subtitle,
}) => {
  // Format value based on type
  const formatValue = (val: number) => {
    switch (format) {
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'decimal':
        return val.toFixed(1);
      case 'integer':
        return Math.round(val).toString();
      default:
        return val.toString();
    }
  };

  // Calculate change percentage
  const calculateChange = () => {
    if (!previousValue || previousValue === 0) return null;
    const change = ((value - previousValue) / previousValue) * 100;
    return change;
  };

  const change = calculateChange();

  // Get trend info
  const getTrendInfo = () => {
    if (!trend || !change) return null;
    
    const absChange = Math.abs(change);
    const isPositive = change > 0;
    
    return {
      icon: trend === 'up' ? '↗️' : trend === 'down' ? '↘️' : '➡️',
      color: trend === 'up' ? 'success' : trend === 'down' ? 'danger' : 'neutral',
      text: `${isPositive ? '+' : ''}${change.toFixed(1)}%`,
    };
  };

  const trendInfo = getTrendInfo();

  return (
    <div className={`metrics-card ${trend || ''}`}>
      <div className="card-header">
        <div className="card-icon">{icon}</div>
        {trendInfo && (
          <div className={`trend-indicator ${trendInfo.color}`}>
            <span className="trend-icon">{trendInfo.icon}</span>
            <span className="trend-text">{trendInfo.text}</span>
          </div>
        )}
      </div>

      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <div className="card-value">{formatValue(value)}</div>
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
      </div>

      {previousValue && (
        <div className="card-footer">
          <span className="previous-value">
            Previous: {formatValue(previousValue)}
          </span>
        </div>
      )}
    </div>
  );
};

export default MetricsCard;
