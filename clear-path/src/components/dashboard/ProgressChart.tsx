import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartData } from '../../types';

interface ProgressChartProps {
  data: ChartData[];
}

export default function ProgressChart({ data }: ProgressChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Progress: {data.value.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (value: number) => {
    if (value >= 80) return '#22c55e'; // green
    if (value >= 60) return '#f59e0b'; // amber
    if (value >= 40) return '#ef4444'; // red
    return '#6b7280'; // gray
  };

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No progress data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              className="text-gray-600 dark:text-gray-400"
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              className="text-gray-600 dark:text-gray-400"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 0, 0]}
              fill={(entry: any) => getBarColor(entry.value)}
            >
              {data.map((entry, index) => (
                <Bar key={`bar-${index}`} fill={getBarColor(entry.value)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            {data.filter(d => d.value >= 80).length}
          </div>
          <div className="text-xs text-green-700 dark:text-green-300">
            On Track (≥80%)
          </div>
        </div>
        
        <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
            {data.filter(d => d.value >= 40 && d.value < 80).length}
          </div>
          <div className="text-xs text-yellow-700 dark:text-yellow-300">
            In Progress (40-79%)
          </div>
        </div>
        
        <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="text-lg font-bold text-red-600 dark:text-red-400">
            {data.filter(d => d.value < 40).length}
          </div>
          <div className="text-xs text-red-700 dark:text-red-300">
            Behind ({`<40%`})
          </div>
        </div>
      </div>

      {/* Individual Progress Bars */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Individual Goal Progress
        </h4>
        {data.map((goal, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {goal.name}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {goal.value.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${goal.value}%`,
                  backgroundColor: goal.color || getBarColor(goal.value),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
