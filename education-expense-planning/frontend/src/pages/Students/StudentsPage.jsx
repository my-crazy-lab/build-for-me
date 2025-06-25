/**
 * Students Page Component
 * 
 * This component provides student management:
 * - List of all students
 * - Add new student
 * - Student cards with quick actions
 * - Search and filter functionality
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  UserIcon,
  AcademicCapIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const StudentsPage = () => {
  const { isDemoAccount } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Demo data
  const demoStudents = [
    {
      id: '1',
      name: 'Nguyễn Minh An',
      birthYear: 2015,
      currentGrade: 3,
      schoolType: 'private',
      entryYear: 2021,
      graduationYear: 2033,
      avatar: null,
      isActive: true
    },
    {
      id: '2',
      name: 'Trần Thị Bình',
      birthYear: 2012,
      currentGrade: 6,
      schoolType: 'international',
      entryYear: 2018,
      graduationYear: 2030,
      avatar: null,
      isActive: true
    }
  ];

  const students = isDemoAccount() ? demoStudents : [];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSchoolTypeLabel = (type) => {
    const labels = {
      public: 'Public School',
      private: 'Private School',
      international: 'International School'
    };
    return labels[type] || type;
  };

  const getSchoolTypeColor = (type) => {
    const colors = {
      public: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      private: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      international: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            Students
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your children's education profiles and track their progress
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Student
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="flex-1 min-w-0">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  placeholder="Search students..."
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{filteredStudents.length} students</span>
            </div>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="px-4 py-5 sm:p-6">
                {/* Student Avatar and Name */}
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {student.avatar ? (
                      <img
                        className="h-12 w-12 rounded-full"
                        src={student.avatar}
                        alt={student.name}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Born {student.birthYear} • Age {new Date().getFullYear() - student.birthYear}
                    </p>
                  </div>
                </div>

                {/* Student Details */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <AcademicCapIcon className="flex-shrink-0 mr-2 h-4 w-4" />
                    <span>Grade {student.currentGrade}</span>
                    <span className="mx-2">•</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSchoolTypeColor(student.schoolType)}`}>
                      {getSchoolTypeLabel(student.schoolType)}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <CalendarIcon className="flex-shrink-0 mr-2 h-4 w-4" />
                    <span>Graduates {student.graduationYear}</span>
                    <span className="mx-2">•</span>
                    <span>{12 - student.currentGrade} years remaining</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex space-x-3">
                  <Link
                    to={`/students/${student.id}`}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-center px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/students/${student.id}/plans`}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-center px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Plans
                  </Link>
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
            <UserIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            {searchTerm ? 'No students found' : 'No students yet'}
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm 
              ? `No students match "${searchTerm}". Try adjusting your search.`
              : 'Get started by adding your first student profile.'
            }
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Add Your First Student
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default StudentsPage;
