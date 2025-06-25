/**
 * Love Journey - Calendar
 *
 * Interactive calendar for couples to track dates, anniversaries,
 * milestones, and shared events.
 *
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight,
  Plus, Heart, Star, Gift, Coffee, Plane, Camera,
  Clock, MapPin, Users, Bell
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const events = [
    {
      id: 1,
      date: '2025-06-28',
      title: 'Romantic Dinner',
      time: '7:00 PM',
      type: 'date',
      icon: Heart,
      color: 'bg-red-500'
    },
    {
      id: 2,
      date: '2025-06-30',
      title: 'Coffee Date',
      time: '10:00 AM',
      type: 'casual',
      icon: Coffee,
      color: 'bg-amber-500'
    },
    {
      id: 3,
      date: '2025-07-05',
      title: 'Weekend Getaway',
      time: 'All Day',
      type: 'travel',
      icon: Plane,
      color: 'bg-blue-500'
    },
    {
      id: 4,
      date: '2025-07-14',
      title: 'Anniversary',
      time: 'All Day',
      type: 'milestone',
      icon: Star,
      color: 'bg-purple-500'
    }
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getEventsForDate = (date) => {
    const dateStr = formatDate(date);
    return events.filter(event => event.date === dateStr);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateEvents = getEventsForDate(date);
      const isToday = formatDate(date) === formatDate(new Date());
      const isSelected = selectedDate && formatDate(date) === formatDate(selectedDate);

      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: 1.02 }}
          onClick={() => setSelectedDate(date)}
          className={`h-24 p-2 border border-gray-200 dark:border-gray-700 cursor-pointer transition-all ${
            isToday
              ? 'bg-primary-100 dark:bg-primary-900 border-primary-300 dark:border-primary-700'
              : isSelected
              ? 'bg-secondary-100 dark:bg-secondary-900 border-secondary-300 dark:border-secondary-700'
              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <div className="flex justify-between items-start mb-1">
            <span className={`text-sm font-medium ${
              isToday
                ? 'text-primary-700 dark:text-primary-300'
                : 'text-gray-900 dark:text-white'
            }`}>
              {day}
            </span>
            {dateEvents.length > 0 && (
              <div className="flex space-x-1">
                {dateEvents.slice(0, 2).map((event) => {
                  const Icon = event.icon;
                  return (
                    <div
                      key={event.id}
                      className={`w-2 h-2 rounded-full ${event.color}`}
                      title={event.title}
                    />
                  );
                })}
                {dateEvents.length > 2 && (
                  <div className="w-2 h-2 rounded-full bg-gray-400" title={`+${dateEvents.length - 2} more`} />
                )}
              </div>
            )}
          </div>
          <div className="space-y-1">
            {dateEvents.slice(0, 1).map((event) => (
              <div
                key={event.id}
                className="text-xs p-1 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 truncate"
              >
                {event.title}
              </div>
            ))}
          </div>
        </motion.div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-neutral-50 to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Keep track of your special moments and upcoming plans
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth(-1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth(1)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-0 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className="h-10 flex items-center justify-center font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0">
                {renderCalendarDays()}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Add Event */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Add
              </h3>
              <Button className="w-full mb-3">
                <Plus className="w-4 h-4 mr-2" />
                New Event
              </Button>
              <div className="space-y-2 text-sm">
                <button className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>Date Night</span>
                </button>
                <button className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-2">
                  <Star className="w-4 h-4 text-purple-500" />
                  <span>Milestone</span>
                </button>
                <button className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-2">
                  <Gift className="w-4 h-4 text-green-500" />
                  <span>Anniversary</span>
                </button>
              </div>
            </Card>

            {/* Upcoming Events */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Upcoming Events
              </h3>
              <div className="space-y-3">
                {events.slice(0, 3).map((event) => {
                  const Icon = event.icon;
                  return (
                    <div key={event.id} className="flex items-start space-x-3">
                      <div className={`p-1.5 rounded-full ${event.color}`}>
                        <Icon className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {event.date} • {event.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
