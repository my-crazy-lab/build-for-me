/**
 * Plans Page Component
 * 
 * This component provides expense planning management:
 * - List of all plans for a student
 * - Create new plans
 * - Plan overview and status
 * - Quick actions
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
  PlusIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const PlansPage = () => {
  const { studentId } = useParams();
  const { isDemoAccount } = useAuth();

  // If no studentId, show all plans for all students
  const showAllStudents = !studentId;

  // Demo data
  const demoStudents = [
    {
      id: '1',
      name: 'Nguyễn Minh An',
      currentGrade: 3,
      plans: [
        {
          id: '1',
          grade: 3,
          schoolYear: '2024-2025',
          totalPlannedAmount: 25000000,
          inflationRate: 5,
          isActive: true,
          academicYearStatus: 'current'
        },
        {
          id: '2',
          grade: 4,
          schoolYear: '2025-2026',
          totalPlannedAmount: 27000000,
          inflationRate: 5,
          isActive: true,
          academicYearStatus: 'future'
        }
      ]
    },
    {
      id: '2',
      name: 'Nguyễn Minh Bảo',
      currentGrade: 1,
      plans: [
        {
          id: '3',
          grade: 1,
          schoolYear: '2024-2025',
          totalPlannedAmount: 20000000,
          inflationRate: 5,
          isActive: true,
          academicYearStatus: 'current'
        }
      ]
    }
  ];

  const demoPlans = showAllStudents
    ? demoStudents.flatMap(student =>
        student.plans.map(plan => ({ ...plan, studentName: student.name, studentId: student.id }))
      )
    : demoStudents.find(s => s.id === studentId)?.plans || [];

  const plans = isDemoAccount() ? demoPlans : [];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      current: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      future: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      past: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[status] || colors.future;
  };

  const getStatusLabel = (status) => {
    const labels = {
      current: 'Current Year',
      future: 'Future Year',
      past: 'Past Year'
    };
    return labels[status] || 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      {!showAllStudents && (
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link
                to="/students"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <ArrowLeftIcon className="flex-shrink-0 h-5 w-5" />
                <span className="sr-only">Back to students</span>
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Expense Plans
                </span>
              </div>
            </li>
          </ol>
        </nav>
      )}

      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            {showAllStudents ? 'All Expense Plans' : 'Expense Plans'}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {showAllStudents
              ? 'View and manage expense plans for all students'
              : 'Plan education expenses for each academic year'
            }
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Create Plan
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      {plans.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="px-4 py-5 sm:p-6">
                {/* Plan Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {showAllStudents ? `${plan.studentName} - Grade ${plan.grade}` : `Grade ${plan.grade}`}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {plan.schoolYear}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(plan.academicYearStatus)}`}>
                    {getStatusLabel(plan.academicYearStatus)}
                  </span>
                </div>

                {/* Plan Details */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Total Planned</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(plan.totalPlannedAmount)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Inflation Rate</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {plan.inflationRate}%
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex space-x-3">
                  <Link
                    to={`/plans/${plan.id}`}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-center px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    View Details
                  </Link>
                  <button className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-center px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="mx-auto h-24 w-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <DocumentTextIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No expense plans yet
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating your first expense plan for this student.
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Create Your First Plan
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PlansPage;
