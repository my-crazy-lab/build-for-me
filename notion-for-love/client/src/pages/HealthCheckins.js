/**
 * Love Journey - Health Check-ins
 *
 * Relationship health monitoring with mood tracking, communication metrics,
 * and wellness insights for couples.
 *
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart, TrendingUp, Calendar, MessageCircle,
  Smile, Meh, Frown, Star, Activity, Users,
  BarChart3, PieChart, Target, Award
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const HealthCheckins = () => {
  const [selectedMood, setSelectedMood] = useState(null);

  const moodOptions = [
    { id: 'great', icon: Smile, label: 'Great', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900' },
    { id: 'good', icon: Smile, label: 'Good', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900' },
    { id: 'okay', icon: Meh, label: 'Okay', color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900' },
    { id: 'struggling', icon: Frown, label: 'Struggling', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900' }
  ];

  const healthMetrics = [
    {
      id: 'communication',
      title: 'Communication',
      value: 85,
      trend: '+5%',
      icon: MessageCircle,
      color: 'text-blue-500'
    },
    {
      id: 'intimacy',
      title: 'Intimacy',
      value: 78,
      trend: '+2%',
      icon: Heart,
      color: 'text-red-500'
    },
    {
      id: 'shared-goals',
      title: 'Shared Goals',
      value: 92,
      trend: '+8%',
      icon: Target,
      color: 'text-green-500'
    },
    {
      id: 'quality-time',
      title: 'Quality Time',
      value: 73,
      trend: '-3%',
      icon: Users,
      color: 'text-purple-500'
    }
  ];

  const recentCheckins = [
    {
      id: 1,
      date: '2025-06-24',
      mood: 'great',
      note: 'Had an amazing date night! Communication was excellent.',
      partner: 'Alex'
    },
    {
      id: 2,
      date: '2025-06-23',
      mood: 'good',
      note: 'Good day overall, spent quality time together.',
      partner: 'Jordan'
    },
    {
      id: 3,
      date: '2025-06-22',
      mood: 'okay',
      note: 'Busy day, but we made time for each other.',
      partner: 'Alex'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-neutral-50 to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Health Check-ins
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor and nurture your relationship wellness
          </p>
        </div>

        {/* Quick Check-in */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            How are you feeling about your relationship today?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {moodOptions.map((mood) => {
              const Icon = mood.icon;
              return (
                <motion.button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedMood === mood.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full ${mood.bg} flex items-center justify-center mx-auto mb-2`}>
                    <Icon className={`w-6 h-6 ${mood.color}`} />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {mood.label}
                  </p>
                </motion.button>
              );
            })}
          </div>
          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <textarea
                placeholder="Share what's on your mind about your relationship..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                rows={3}
              />
              <Button className="w-full md:w-auto">
                <Heart className="w-4 h-4 mr-2" />
                Submit Check-in
              </Button>
            </motion.div>
          )}
        </Card>

        {/* Health Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {healthMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800`}>
                      <Icon className={`w-5 h-5 ${metric.color}`} />
                    </div>
                    <span className={`text-sm font-medium ${
                      metric.trend.startsWith('+')
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {metric.trend}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {metric.title}
                  </h3>
                  <div className="flex items-end space-x-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metric.value}%
                    </span>
                  </div>
                  <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Check-ins */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Check-ins
            </h2>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>
          <div className="space-y-4">
            {recentCheckins.map((checkin) => {
              const mood = moodOptions.find(m => m.id === checkin.mood);
              const MoodIcon = mood?.icon;
              return (
                <motion.div
                  key={checkin.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: checkin.id * 0.1 }}
                  className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className={`p-2 rounded-full ${mood?.bg}`}>
                    {MoodIcon && <MoodIcon className={`w-4 h-4 ${mood?.color}`} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {checkin.partner}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {checkin.date}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {checkin.note}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HealthCheckins;
