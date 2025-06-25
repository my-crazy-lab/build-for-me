/**
 * Expenses Page Component
 *
 * This component provides expense tracking:
 * - List of actual expenses
 * - Add new expenses
 * - Filter and search functionality
 * - Expense analytics
 *
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import {
  PlusIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  TagIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

const ExpensesPage = () => {
  const { isDemoAccount } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Demo expenses data
  const demoExpenses = [
    {
      id: 1,
      description: 'School Tuition - Semester 1',
      amount: 15000000,
      category: 'tuition',
      date: '2024-01-15',
      studentName: 'Nguyễn Văn An',
      paymentMethod: 'Bank Transfer',
      status: 'paid'
    },
    {
      id: 2,
      description: 'Textbooks - Mathematics & Science',
      amount: 850000,
      category: 'books',
      date: '2024-01-20',
      studentName: 'Trần Thị Bình',
      paymentMethod: 'Cash',
      status: 'paid'
    },
    {
      id: 3,
      description: 'School Uniform',
      amount: 450000,
      category: 'uniform',
      date: '2024-01-25',
      studentName: 'Lê Văn Cường',
      paymentMethod: 'Credit Card',
      status: 'paid'
    },
    {
      id: 4,
      description: 'Extra Classes - English',
      amount: 2000000,
      category: 'extra_classes',
      date: '2024-02-01',
      studentName: 'Phạm Thị Dung',
      paymentMethod: 'Bank Transfer',
      status: 'paid'
    },
    {
      id: 5,
      description: 'School Supplies',
      amount: 320000,
      category: 'supplies',
      date: '2024-02-05',
      studentName: 'Hoàng Văn Em',
      paymentMethod: 'Cash',
      status: 'paid'
    },
    {
      id: 6,
      description: 'Transportation - Monthly Pass',
      amount: 150000,
      category: 'transport',
      date: '2024-02-10',
      studentName: 'Nguyễn Thị Phương',
      paymentMethod: 'Mobile Payment',
      status: 'pending'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'tuition', label: 'Tuition' },
    { value: 'books', label: 'Books' },
    { value: 'uniform', label: 'Uniform' },
    { value: 'supplies', label: 'Supplies' },
    { value: 'transport', label: 'Transportation' },
    { value: 'extra_classes', label: 'Extra Classes' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getCategoryColor = (category) => {
    const colors = {
      tuition: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      books: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      uniform: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      supplies: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      transport: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      extra_classes: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getStatusColor = (status) => {
    return status === 'paid'
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
  };

  const filteredExpenses = demoExpenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (!isDemoAccount()) {
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
              Expenses
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Track and manage actual education expenses
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Add Expense
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
            <CurrencyDollarIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No expenses yet
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Start tracking your education expenses here.
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
            Expenses
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track and manage actual education expenses
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Expense
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BanknotesIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Expenses
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {formatCurrency(totalExpenses)}
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
                    This Month
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {filteredExpenses.length} expenses
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
                <TagIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Categories
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {categories.length - 1} active
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Search expenses
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                placeholder="Search by description or student name..."
              />
            </div>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md"
      >
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Recent Expenses
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            {filteredExpenses.length} expenses found
          </p>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredExpenses.map((expense, index) => (
            <motion.li
              key={expense.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <CurrencyDollarIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {expense.description}
                      </div>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                        {categories.find(c => c.value === expense.category)?.label}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {expense.studentName} • {new Date(expense.date).toLocaleDateString('vi-VN')} • {expense.paymentMethod}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-right mr-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(expense.amount)}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                      {expense.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
        {filteredExpenses.length === 0 && (
          <div className="text-center py-12">
            <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No expenses found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ExpensesPage;
