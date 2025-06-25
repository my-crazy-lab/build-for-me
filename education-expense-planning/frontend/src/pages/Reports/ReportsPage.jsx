/**
 * Reports Page Component
 *
 * This component provides analytics and reporting:
 * - Expense analytics and charts
 * - Budget vs actual comparisons
 * - Trend analysis
 * - Export functionality
 *
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';

const ReportsPage = () => {
  const { isDemoAccount } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Demo analytics data
  const demoAnalytics = {
    totalExpenses: 18770000,
    monthlyGrowth: 12.5,
    categoryBreakdown: [
      { category: 'Tuition', amount: 15000000, percentage: 79.9, color: 'bg-blue-500' },
      { category: 'Extra Classes', amount: 2000000, percentage: 10.7, color: 'bg-green-500' },
      { category: 'Books', amount: 850000, percentage: 4.5, color: 'bg-yellow-500' },
      { category: 'Uniform', amount: 450000, percentage: 2.4, color: 'bg-purple-500' },
      { category: 'Supplies', amount: 320000, percentage: 1.7, color: 'bg-pink-500' },
      { category: 'Transport', amount: 150000, percentage: 0.8, color: 'bg-indigo-500' }
    ],
    monthlyTrend: [
      { month: 'Jan', amount: 16200000 },
      { month: 'Feb', amount: 18770000 },
      { month: 'Mar', amount: 15800000 },
      { month: 'Apr', amount: 17500000 },
      { month: 'May', amount: 19200000 },
      { month: 'Jun', amount: 18900000 }
    ],
    studentExpenses: [
      { name: 'Nguyễn Văn An', amount: 15450000, percentage: 82.3 },
      { name: 'Trần Thị Bình', amount: 1200000, percentage: 6.4 },
      { name: 'Lê Văn Cường', amount: 980000, percentage: 5.2 },
      { name: 'Phạm Thị Dung', amount: 750000, percentage: 4.0 },
      { name: 'Hoàng Văn Em', amount: 390000, percentage: 2.1 }
    ]
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatCompactCurrency = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M VND`;
    }
    return formatCurrency(amount);
  };

  if (!isDemoAccount()) {
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
              Reports & Analytics
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Analyze your education expense patterns and trends
            </p>
          </div>
        </div>

        {/* Empty State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="mx-auto h-24 w-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <ChartBarIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No data for reports yet
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Add some expenses to see analytics and reports here.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            Reports & Analytics
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Analyze your education expense patterns and trends
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <DocumentArrowDownIcon className="-ml-1 mr-2 h-5 w-5" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Expenses
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {formatCompactCurrency(demoAnalytics.totalExpenses)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Monthly Growth
                  </dt>
                  <dd className="text-lg font-medium text-green-600 dark:text-green-400">
                    +{demoAnalytics.monthlyGrowth}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartPieIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Categories
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {demoAnalytics.categoryBreakdown.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    This Period
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    6 months
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Expenses by Category
          </h3>
          <div className="space-y-4">
            {demoAnalytics.categoryBreakdown.map((item, index) => (
              <div key={item.category} className="flex items-center">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.category}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatCompactCurrency(item.amount)} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      className={`h-2 rounded-full ${item.color}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Monthly Trend
          </h3>
          <div className="space-y-4">
            {demoAnalytics.monthlyTrend.map((item, index) => {
              const maxAmount = Math.max(...demoAnalytics.monthlyTrend.map(m => m.amount));
              const percentage = (item.amount / maxAmount) * 100;

              return (
                <div key={item.month} className="flex items-center">
                  <div className="w-12 text-sm text-gray-500 dark:text-gray-400">
                    {item.month}
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="flex items-center justify-between">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                          className="h-3 rounded-full bg-primary-500"
                        />
                      </div>
                      <span className="ml-4 text-sm text-gray-900 dark:text-white min-w-0">
                        {formatCompactCurrency(item.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Student Expenses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-gray-800 shadow rounded-lg"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Expenses by Student
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {demoAnalytics.studentExpenses.map((student, index) => (
              <div key={student.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8">
                    <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                        {student.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {student.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {student.percentage}% of total
                    </p>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCompactCurrency(student.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportsPage;
