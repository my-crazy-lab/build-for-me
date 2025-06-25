/**
 * Love Journey - Planning Board
 *
 * Interactive planning board for couples to organize dates, goals, and activities.
 * Features drag-and-drop functionality and beautiful card layouts.
 *
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Plus, Heart, Star, MapPin, Clock,
  Coffee, Camera, Music, Utensils, Plane, Gift
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const PlanningBoard = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const tabs = [
    { id: 'upcoming', label: 'Upcoming Plans', icon: Calendar },
    { id: 'ideas', label: 'Date Ideas', icon: Heart },
    { id: 'bucket-list', label: 'Bucket List', icon: Star }
  ];

  const upcomingPlans = [
    {
      id: 1,
      title: 'Romantic Dinner',
      date: '2025-06-28',
      time: '7:00 PM',
      location: 'The Garden Restaurant',
      type: 'dinner',
      icon: Utensils,
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'Weekend Getaway',
      date: '2025-07-05',
      time: 'All Day',
      location: 'Mountain Cabin',
      type: 'travel',
      icon: Plane,
      status: 'planning'
    }
  ];

  const dateIdeas = [
    { id: 1, title: 'Coffee Shop Hopping', icon: Coffee, category: 'casual' },
    { id: 2, title: 'Photography Walk', icon: Camera, category: 'creative' },
    { id: 3, title: 'Concert Night', icon: Music, category: 'entertainment' },
    { id: 4, title: 'Cooking Class', icon: Utensils, category: 'learning' }
  ];

  const bucketList = [
    { id: 1, title: 'Visit Paris Together', icon: MapPin, priority: 'high' },
    { id: 2, title: 'Learn to Dance', icon: Music, priority: 'medium' },
    { id: 3, title: 'Build a Garden', icon: Heart, priority: 'low' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-neutral-50 to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Planning Board
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Plan your perfect moments together
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {activeTab === 'upcoming' && (
            <>
              {upcomingPlans.map((plan) => {
                const Icon = plan.icon;
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: plan.id * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                            <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {plan.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {plan.location}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          plan.status === 'confirmed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {plan.status}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{plan.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{plan.time}</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500 transition-colors">
                  <div className="text-center">
                    <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      Add New Plan
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Create a new date or activity
                    </p>
                    <Button size="sm" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Plan
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </>
          )}

          {activeTab === 'ideas' && (
            <>
              {dateIdeas.map((idea) => {
                const Icon = idea.icon;
                return (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idea.id * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-secondary-100 dark:bg-secondary-900 rounded-lg">
                          <Icon className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {idea.title}
                        </h3>
                      </div>
                      <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                        {idea.category}
                      </span>
                    </Card>
                  </motion.div>
                );
              })}
            </>
          )}

          {activeTab === 'bucket-list' && (
            <>
              {bucketList.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: item.id * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-accent-100 dark:bg-accent-900 rounded-lg">
                            <Icon className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {item.title}
                          </h3>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.priority === 'high'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : item.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {item.priority}
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanningBoard;
