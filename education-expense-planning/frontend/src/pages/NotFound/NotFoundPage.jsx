/**
 * 404 Not Found Page Component
 * 
 * This component provides a user-friendly 404 error page:
 * - Clear error message
 * - Navigation options
 * - Helpful links
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* 404 Number */}
          <motion.h1
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-9xl font-bold text-primary-600 dark:text-primary-400"
          >
            404
          </motion.h1>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
              Page not found
            </h2>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
              Sorry, we couldn't find the page you're looking for.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <HomeIcon className="-ml-1 mr-2 h-5 w-5" />
              Go to Dashboard
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" />
              Go Back
            </button>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Or try one of these helpful links:
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
              <Link
                to="/students"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors"
              >
                Students
              </Link>
              <Link
                to="/plans"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors"
              >
                Plans
              </Link>
              <Link
                to="/expenses"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors"
              >
                Expenses
              </Link>
              <Link
                to="/reports"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors"
              >
                Reports
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
