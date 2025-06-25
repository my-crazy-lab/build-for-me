/**
 * Student Detail Page Component
 * 
 * This component provides detailed student information:
 * - Student profile overview
 * - Academic progress timeline
 * - Quick access to plans and expenses
 * - Edit student information
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
  UserIcon,
  AcademicCapIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  PencilIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const StudentDetailPage = () => {
  const { studentId } = useParams();
  const { isDemoAccount } = useAuth();

  // Demo data
  const demoStudent = {
    id: '1',
    name: 'Nguyễn Minh An',
    birthYear: 2015,
    currentGrade: 3,
    schoolType: 'private',
    entryYear: 2021,
    graduationYear: 2033,
    avatar: null,
    notes: 'Excellent student with strong interest in mathematics and science.',
    isActive: true
  };

  const student = isDemoAccount() ? demoStudent : null;

  if (!student) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Student not found
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          The student you're looking for doesn't exist or you don't have access to it.
        </p>
        <div className="mt-6">
          <Link
            to="/students"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" />
            Back to Students
          </Link>
        </div>
      </div>
    );
  }

  const getSchoolTypeLabel = (type) => {
    const labels = {
      public: 'Public School',
      private: 'Private School',
      international: 'International School'
    };
    return labels[type] || type;
  };

  const getGradeProgression = () => {
    const progression = [];
    for (let grade = 1; grade <= 12; grade++) {
      const year = student.entryYear + grade - 1;
      progression.push({
        grade,
        year,
        isCurrent: grade === student.currentGrade,
        isPast: grade < student.currentGrade,
        isFuture: grade > student.currentGrade
      });
    }
    return progression;
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
              <span className="sr-only">Back to students</span>
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg
                className="flex-shrink-0 h-5 w-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                {student.name}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Student Header */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {student.avatar ? (
                  <img
                    className="h-16 w-16 rounded-full"
                    src={student.avatar}
                    alt={student.name}
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  </div>
                )}
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {student.name}
                </h1>
                <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>Born {student.birthYear}</span>
                  <span>•</span>
                  <span>Age {new Date().getFullYear() - student.birthYear}</span>
                  <span>•</span>
                  <span>{getSchoolTypeLabel(student.schoolType)}</span>
                </div>
              </div>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <PencilIcon className="-ml-1 mr-2 h-4 w-4" />
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AcademicCapIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Current Grade
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    Grade {student.currentGrade}
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
                <CalendarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Years Remaining
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {12 - student.currentGrade} years
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
                <DocumentTextIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Active Plans
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {isDemoAccount() ? '8' : '0'}
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
                <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Planned
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {isDemoAccount() ? '₫225M' : '₫0'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Academic Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Academic Timeline
            </h3>
            <div className="mt-5">
              <div className="flow-root">
                <ul className="-mb-8">
                  {getGradeProgression().slice(0, 6).map((item, index) => (
                    <li key={item.grade}>
                      <div className="relative pb-8">
                        {index !== 5 && (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span
                              className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 ${
                                item.isCurrent
                                  ? 'bg-primary-600'
                                  : item.isPast
                                  ? 'bg-green-500'
                                  : 'bg-gray-400'
                              }`}
                            >
                              <span className="text-white text-sm font-medium">
                                {item.grade}
                              </span>
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Grade {item.grade}
                                {item.isCurrent && (
                                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                                    Current
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                              <time>{item.year}</time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <Link
                  to={`/students/${student.id}/timeline`}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500"
                >
                  View full timeline →
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Quick Actions
            </h3>
            <div className="mt-5 space-y-3">
              <Link
                to={`/students/${student.id}/plans`}
                className="w-full flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    View Plans
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {isDemoAccount() ? '8 plans' : '0 plans'}
                </span>
              </Link>

              <Link
                to={`/students/${student.id}/expenses`}
                className="w-full flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    View Expenses
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {isDemoAccount() ? '24 expenses' : '0 expenses'}
                </span>
              </Link>

              <button className="w-full flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <PencilIcon className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Edit Student Profile
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Notes Section */}
      {student.notes && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Notes
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {student.notes}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StudentDetailPage;
