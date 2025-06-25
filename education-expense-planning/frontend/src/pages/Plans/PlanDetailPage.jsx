/**
 * Plan Detail Page Component
 * 
 * This component provides detailed plan information:
 * - Plan overview and breakdown
 * - Category-wise expense planning
 * - Budget vs actual comparison
 * - Edit plan functionality
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ArrowLeftIcon,
  PencilIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const PlanDetailPage = () => {
  const { planId } = useParams();
  const { isDemoAccount } = useAuth();

  // Demo data
  const demoPlan = {
    id: '1',
    grade: 3,
    schoolYear: '2024-2025',
    totalPlannedAmount: 25000000,
    inflationRate: 5,
    isActive: true,
    academicYearStatus: 'current',
    plannedExpenses: [
      { category: 'tuition', amount: 15000000, description: 'Monthly tuition fees' },
      { category: 'books', amount: 2000000, description: 'Textbooks and materials' },
      { category: 'uniform', amount: 1500000, description: 'School uniforms' },
      { category: 'transport', amount: 3000000, description: 'School bus fees' },
      { category: 'meals', amount: 2500000, description: 'School lunch program' },
      { category: 'extracurricular', amount: 1000000, description: 'Sports and activities' }
    ]
  };

  const plan = isDemoAccount() ? demoPlan : null;

  if (!plan) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Plan not found
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          The plan you're looking for doesn't exist or you don't have access to it.
        </p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getCategoryLabel = (category) => {
    const labels = {
      tuition: 'Tuition',
      books: 'Books & Materials',
      uniform: 'Uniforms',
      transport: 'Transportation',
      meals: 'Meals',
      extracurricular: 'Extracurricular',
      tutoring: 'Tutoring',
      devices: 'Devices & Equipment',
      summerCamp: 'Summer Camp',
      examFees: 'Exam Fees',
      misc: 'Miscellaneous'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      tuition: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      books: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      uniform: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      transport: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      meals: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      extracurricular: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-4">
          <li>
            <Link
              to="/students"
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <ArrowLeftIcon className="flex-shrink-0 h-5 w-5" />
              <span className="sr-only">Back</span>
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                Grade {plan.grade} Plan
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Plan Header */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Grade {plan.grade} Expense Plan
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Academic Year {plan.schoolYear}
              </p>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <PencilIcon className="-ml-1 mr-2 h-4 w-4" />
              Edit Plan
            </button>
          </div>
        </div>
      </div>

      {/* Plan Summary */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
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
                    Total Planned
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {formatCurrency(plan.totalPlannedAmount)}
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
                <ChartBarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Inflation Rate
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {plan.inflationRate}%
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
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Categories
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {plan.plannedExpenses.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Expense Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 shadow rounded-lg"
      >
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Expense Breakdown
          </h3>
          <div className="mt-5">
            <div className="space-y-4">
              {plan.plannedExpenses.map((expense, index) => (
                <motion.div
                  key={expense.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                      {getCategoryLabel(expense.category)}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(expense.amount)}
                      </p>
                      {expense.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {expense.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {((expense.amount / plan.totalPlannedAmount) * 100).toFixed(1)}%
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PlanDetailPage;
