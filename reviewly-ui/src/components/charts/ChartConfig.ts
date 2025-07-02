/**
 * Chart Configuration Utilities for Reviewly Application
 * 
 * Centralized configuration for Chart.js with consistent styling,
 * animations, and responsive behavior across all charts.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
);

// Color palette for consistent theming
export const chartColors = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  light: '#f8fafc',
  dark: '#1e293b',
  gray: '#6b7280',
  gradients: {
    primary: ['#667eea', '#764ba2'],
    success: ['#22c55e', '#16a34a'],
    warning: ['#f59e0b', '#d97706'],
    danger: ['#ef4444', '#dc2626'],
    info: ['#3b82f6', '#2563eb'],
  },
};

// Common chart options
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
          weight: 'normal' as const,
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#667eea',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      padding: 12,
      titleFont: {
        size: 14,
        weight: 'bold' as const,
      },
      bodyFont: {
        size: 13,
      },
    },
  },
  animation: {
    duration: 1000,
    easing: 'easeInOutQuart' as const,
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 11,
        },
        color: '#6b7280',
      },
    },
    y: {
      grid: {
        color: 'rgba(107, 114, 128, 0.1)',
        lineWidth: 1,
      },
      ticks: {
        font: {
          size: 11,
        },
        color: '#6b7280',
      },
    },
  },
};

// Line chart specific options
export const lineChartOptions = {
  ...defaultChartOptions,
  elements: {
    line: {
      tension: 0.4,
      borderWidth: 3,
    },
    point: {
      radius: 6,
      hoverRadius: 8,
      borderWidth: 2,
      backgroundColor: '#ffffff',
    },
  },
};

// Bar chart specific options
export const barChartOptions = {
  ...defaultChartOptions,
  elements: {
    bar: {
      borderRadius: 4,
      borderSkipped: false,
    },
  },
};

// Doughnut chart specific options
export const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%',
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
          weight: 'normal' as const,
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#667eea',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      padding: 12,
      callbacks: {
        label: function(context: any) {
          const label = context.label || '';
          const value = context.parsed;
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ${value} (${percentage}%)`;
        },
      },
    },
  },
  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 1000,
    easing: 'easeInOutQuart' as const,
  },
};

// Radar chart specific options
export const radarChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
          weight: 'normal' as const,
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#667eea',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      padding: 12,
    },
  },
  scales: {
    r: {
      beginAtZero: true,
      max: 5,
      ticks: {
        stepSize: 1,
        font: {
          size: 10,
        },
        color: '#6b7280',
      },
      grid: {
        color: 'rgba(107, 114, 128, 0.2)',
      },
      pointLabels: {
        font: {
          size: 12,
          weight: 'normal' as const,
        },
        color: '#374151',
      },
    },
  },
  elements: {
    line: {
      borderWidth: 2,
    },
    point: {
      radius: 4,
      hoverRadius: 6,
    },
  },
  animation: {
    duration: 1000,
    easing: 'easeInOutQuart' as const,
  },
};

// Utility functions for creating gradients
export const createGradient = (
  ctx: CanvasRenderingContext2D,
  colors: string[],
  direction: 'vertical' | 'horizontal' = 'vertical'
) => {
  const gradient = direction === 'vertical'
    ? ctx.createLinearGradient(0, 0, 0, 400)
    : ctx.createLinearGradient(0, 0, 400, 0);
  
  colors.forEach((color, index) => {
    gradient.addColorStop(index / (colors.length - 1), color);
  });
  
  return gradient;
};

// Generate dataset with consistent styling
export const createDataset = (
  label: string,
  data: number[],
  type: 'line' | 'bar' | 'doughnut' | 'radar' = 'line',
  colorKey: keyof typeof chartColors.gradients = 'primary'
) => {
  const colors = chartColors.gradients[colorKey];
  
  const baseDataset = {
    label,
    data,
    borderColor: colors[0],
    backgroundColor: type === 'doughnut' 
      ? [
          chartColors.primary,
          chartColors.success,
          chartColors.warning,
          chartColors.danger,
          chartColors.info,
        ]
      : `${colors[0]}20`,
  };

  switch (type) {
    case 'line':
      return {
        ...baseDataset,
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: colors[0],
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      };
    
    case 'bar':
      return {
        ...baseDataset,
        borderRadius: 4,
        borderSkipped: false,
      };
    
    case 'radar':
      return {
        ...baseDataset,
        fill: true,
        borderWidth: 2,
        pointBackgroundColor: colors[0],
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      };
    
    default:
      return baseDataset;
  }
};

// Dark mode adjustments
export const getDarkModeOptions = (baseOptions: any) => {
  return {
    ...baseOptions,
    plugins: {
      ...baseOptions.plugins,
      legend: {
        ...baseOptions.plugins?.legend,
        labels: {
          ...baseOptions.plugins?.legend?.labels,
          color: '#e5e7eb',
        },
      },
    },
    scales: baseOptions.scales ? {
      ...baseOptions.scales,
      x: {
        ...baseOptions.scales.x,
        ticks: {
          ...baseOptions.scales.x?.ticks,
          color: '#9ca3af',
        },
        grid: {
          ...baseOptions.scales.x?.grid,
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
      y: {
        ...baseOptions.scales.y,
        ticks: {
          ...baseOptions.scales.y?.ticks,
          color: '#9ca3af',
        },
        grid: {
          ...baseOptions.scales.y?.grid,
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
      r: baseOptions.scales.r ? {
        ...baseOptions.scales.r,
        ticks: {
          ...baseOptions.scales.r.ticks,
          color: '#9ca3af',
        },
        grid: {
          ...baseOptions.scales.r.grid,
          color: 'rgba(156, 163, 175, 0.2)',
        },
        pointLabels: {
          ...baseOptions.scales.r.pointLabels,
          color: '#d1d5db',
        },
      } : undefined,
    } : undefined,
  };
};
