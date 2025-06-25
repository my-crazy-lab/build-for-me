/**
 * Reminders Page Component
 *
 * This component provides reminder management:
 * - List of active reminders
 * - Create new reminders
 * - Mark reminders as complete
 * - Reminder notifications
 *
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import {
  BellIcon,
  PlusIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CalendarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const RemindersPage = () => {
  const { isDemoAccount } = useAuth();
  const [filter, setFilter] = useState('all');

  // Demo reminders data
  const demoReminders = [
    {
      id: 1,
      title: 'School Tuition Payment Due',
      description: 'Semester 2 tuition payment for Nguyễn Văn An',
      dueDate: '2024-03-15',
      priority: 'high',
      category: 'tuition',
      studentName: 'Nguyễn Văn An',
      amount: 15000000,
      status: 'pending',
      daysUntilDue: 5
    },
    {
      id: 2,
      title: 'Book Purchase Reminder',
      description: 'Buy new textbooks for next semester',
      dueDate: '2024-03-20',
      priority: 'medium',
      category: 'books',
      studentName: 'Trần Thị Bình',
      amount: 850000,
      status: 'pending',
      daysUntilDue: 10
    },
    {
      id: 3,
      title: 'Uniform Fitting Appointment',
      description: 'Schedule uniform fitting for new school year',
      dueDate: '2024-03-25',
      priority: 'low',
      category: 'uniform',
      studentName: 'Lê Văn Cường',
      amount: 450000,
      status: 'pending',
      daysUntilDue: 15
    },
    {
      id: 4,
      title: 'Extra Class Registration',
      description: 'Register for summer English classes',
      dueDate: '2024-03-10',
      priority: 'high',
      category: 'extra_classes',
      studentName: 'Phạm Thị Dung',
      amount: 2000000,
      status: 'completed',
      daysUntilDue: -5
    },
    {
      id: 5,
      title: 'Transportation Pass Renewal',
      description: 'Renew monthly bus pass',
      dueDate: '2024-03-30',
      priority: 'medium',
      category: 'transport',
      studentName: 'Hoàng Văn Em',
      amount: 150000,
      status: 'pending',
      daysUntilDue: 20
    },
    {
      id: 6,
      title: 'School Supply Shopping',
      description: 'Buy notebooks and stationery for new term',
      dueDate: '2024-04-01',
      priority: 'low',
      category: 'supplies',
      studentName: 'Nguyễn Thị Phương',
      amount: 320000,
      status: 'pending',
      daysUntilDue: 22
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getPriorityIcon = (priority) => {
    if (priority === 'high') return ExclamationTriangleIcon;
    if (priority === 'medium') return ClockIcon;
    return BellIcon;
  };

  const getStatusColor = (status) => {
    return status === 'completed'
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  };

  const getDueDateColor = (daysUntilDue) => {
    if (daysUntilDue < 0) return 'text-red-600 dark:text-red-400';
    if (daysUntilDue <= 7) return 'text-orange-600 dark:text-orange-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const filteredReminders = demoReminders.filter(reminder => {
    if (filter === 'all') return true;
    if (filter === 'pending') return reminder.status === 'pending';
    if (filter === 'completed') return reminder.status === 'completed';
    if (filter === 'overdue') return reminder.daysUntilDue < 0;
    return true;
  });

  const filters = [
    { value: 'all', label: 'All Reminders', count: demoReminders.length },
    { value: 'pending', label: 'Pending', count: demoReminders.filter(r => r.status === 'pending').length },
    { value: 'overdue', label: 'Overdue', count: demoReminders.filter(r => r.daysUntilDue < 0).length },
    { value: 'completed', label: 'Completed', count: demoReminders.filter(r => r.status === 'completed').length }
  ];

  if (!isDemoAccount()) {
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
              Reminders
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Stay on top of important education expense deadlines
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Add Reminder
            </button>
          </div>
        </div>

        {/* Empty State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="mx-auto h-24 w-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <BellIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No reminders yet
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Create reminders for important education expense deadlines.
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
            Reminders
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Stay on top of important education expense deadlines
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Reminder
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {filters.map((filterOption) => (
              <button
                key={filterOption.value}
                onClick={() => setFilter(filterOption.value)}
                className={`${
                  filter === filterOption.value
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {filterOption.label}
                <span className={`${
                  filter === filterOption.value
                    ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400'
                    : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-300'
                } ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium`}>
                  {filterOption.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Reminders List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md"
      >
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredReminders.map((reminder, index) => {
            const PriorityIcon = getPriorityIcon(reminder.priority);

            return (
              <motion.li
                key={reminder.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        reminder.status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900'
                          : 'bg-primary-100 dark:bg-primary-900'
                      }`}>
                        {reminder.status === 'completed' ? (
                          <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                        ) : (
                          <PriorityIcon className={`h-6 w-6 ${
                            reminder.priority === 'high' ? 'text-red-600 dark:text-red-400' :
                            reminder.priority === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-green-600 dark:text-green-400'
                          }`} />
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {reminder.title}
                        </div>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(reminder.priority)}`}>
                          {reminder.priority}
                        </span>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reminder.status)}`}>
                          {reminder.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {reminder.description}
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <AcademicCapIcon className="h-4 w-4 mr-1" />
                        {reminder.studentName}
                        <CalendarIcon className="h-4 w-4 ml-3 mr-1" />
                        {new Date(reminder.dueDate).toLocaleDateString('vi-VN')}
                        <span className={`ml-2 ${getDueDateColor(reminder.daysUntilDue)}`}>
                          {reminder.daysUntilDue < 0
                            ? `${Math.abs(reminder.daysUntilDue)} days overdue`
                            : reminder.daysUntilDue === 0
                            ? 'Due today'
                            : `${reminder.daysUntilDue} days left`
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-right mr-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(reminder.amount)}
                      </div>
                    </div>
                    {reminder.status === 'pending' && (
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>
        {filteredReminders.length === 0 && (
          <div className="text-center py-12">
            <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No reminders found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your filter or create a new reminder.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RemindersPage;
