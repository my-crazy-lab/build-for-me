/**
 * Love Journey - Love Calendar Page
 * 
 * Shared calendar for couples with events, anniversaries, date nights,
 * and relationship milestones with beautiful visualizations.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Plus, ChevronLeft, ChevronRight, Heart, 
  MapPin, Clock, Users, Gift, Star, Filter,
  Edit, Trash2, Share, Download, Bell, BellOff
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const LoveCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, day, list
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  // Event categories with colors and icons
  const eventCategories = {
    anniversary: {
      name: 'Anniversary',
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      icon: Heart
    },
    date: {
      name: 'Date Night',
      color: 'bg-pink-500',
      textColor: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      icon: Heart
    },
    milestone: {
      name: 'Milestone',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      icon: Star
    },
    celebration: {
      name: 'Celebration',
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      icon: Gift
    },
    travel: {
      name: 'Travel',
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      icon: MapPin
    },
    reminder: {
      name: 'Reminder',
      color: 'bg-gray-500',
      textColor: 'text-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
      icon: Bell
    }
  };

  // Mock events data
  const mockEvents = [
    {
      id: 1,
      title: "Our Anniversary",
      description: "Celebrating 2 years together! Dinner at our favorite restaurant.",
      date: "2025-06-14",
      time: "19:00",
      endTime: "22:00",
      category: "anniversary",
      location: "Romantic Bistro",
      isAllDay: false,
      isRecurring: true,
      recurringType: "yearly",
      attendees: ["both"],
      reminders: [
        { type: "notification", time: "1 week before" },
        { type: "email", time: "1 day before" }
      ],
      notes: "Book the table by the window. Don't forget to bring the gift!",
      tags: ["special", "restaurant", "anniversary"],
      createdBy: "self",
      isImportant: true
    },
    {
      id: 2,
      title: "Movie Night",
      description: "Weekly movie night - this week it's my turn to pick!",
      date: "2025-01-03",
      time: "20:00",
      endTime: "23:00",
      category: "date",
      location: "Home",
      isAllDay: false,
      isRecurring: true,
      recurringType: "weekly",
      attendees: ["both"],
      reminders: [
        { type: "notification", time: "2 hours before" }
      ],
      notes: "Pick up popcorn and wine on the way home",
      tags: ["home", "movies", "weekly"],
      createdBy: "partner",
      isImportant: false
    },
    {
      id: 3,
      title: "Paris Trip",
      description: "Our romantic getaway to the City of Love",
      date: "2025-03-15",
      time: "09:00",
      endTime: "2025-03-20T18:00",
      category: "travel",
      location: "Paris, France",
      isAllDay: true,
      isRecurring: false,
      attendees: ["both"],
      reminders: [
        { type: "notification", time: "1 month before" },
        { type: "email", time: "1 week before" }
      ],
      notes: "Flight at 9 AM. Hotel: Le Marais. Don't forget passports!",
      tags: ["travel", "vacation", "paris", "romantic"],
      createdBy: "both",
      isImportant: true
    },
    {
      id: 4,
      title: "Valentine's Day",
      description: "Special Valentine's celebration",
      date: "2025-02-14",
      time: "18:00",
      endTime: "23:59",
      category: "celebration",
      location: "TBD",
      isAllDay: false,
      isRecurring: true,
      recurringType: "yearly",
      attendees: ["both"],
      reminders: [
        { type: "notification", time: "1 week before" }
      ],
      notes: "Plan something special and romantic",
      tags: ["valentine", "romantic", "special"],
      createdBy: "self",
      isImportant: true
    },
    {
      id: 5,
      title: "Gym Together",
      description: "Weekly workout session",
      date: "2025-01-02",
      time: "07:00",
      endTime: "08:30",
      category: "date",
      location: "FitLife Gym",
      isAllDay: false,
      isRecurring: true,
      recurringType: "weekly",
      attendees: ["both"],
      reminders: [
        { type: "notification", time: "30 minutes before" }
      ],
      notes: "Bring water bottles and towels",
      tags: ["fitness", "health", "weekly"],
      createdBy: "both",
      isImportant: false
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => {
      if (filterCategory !== 'all' && event.category !== filterCategory) {
        return false;
      }
      
      // Handle multi-day events
      if (event.endTime && event.endTime.includes('T')) {
        const startDate = new Date(event.date);
        const endDate = new Date(event.endTime);
        return date >= startDate && date <= endDate;
      }
      
      return event.date === dateString;
    });
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getEventStats = () => {
    const total = events.length;
    const upcoming = events.filter(event => new Date(event.date) > new Date()).length;
    const thisMonth = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === currentDate.getMonth() && 
             eventDate.getFullYear() === currentDate.getFullYear();
    }).length;
    const important = events.filter(event => event.isImportant).length;

    return { total, upcoming, thisMonth, important };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner 
          size="lg" 
          variant="heart" 
          text="Loading your love calendar..." 
        />
      </div>
    );
  }

  const days = getDaysInMonth(currentDate);
  const stats = getEventStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Love Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Your shared journey through time
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAddModal(true)}
          >
            Add Event
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Events
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Upcoming
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.upcoming}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                This Month
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.thisMonth}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Important
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.important}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Calendar Controls */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Month Navigation */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth(-1)}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {getMonthName(currentDate)}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth(1)}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Next
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Category:
            </span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Events</option>
              {Object.entries(eventCategories).map(([key, category]) => (
                <option key={key} value={key}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {days.map((day, index) => {
            const dayEvents = day ? getEventsForDate(day) : [];
            
            return (
              <CalendarDay
                key={index}
                date={day}
                events={dayEvents}
                isToday={isToday(day)}
                isSelected={isSelected(day)}
                eventCategories={eventCategories}
                onClick={() => day && setSelectedDate(day)}
                onEventClick={setSelectedEvent}
              />
            );
          })}
        </div>
      </Card>

      {/* Selected Date Events */}
      {selectedDate && (
        <SelectedDateEvents
          date={selectedDate}
          events={getEventsForDate(selectedDate)}
          eventCategories={eventCategories}
          formatTime={formatTime}
          onEventClick={setSelectedEvent}
          onAddEvent={() => setShowAddModal(true)}
        />
      )}

      {/* Add Event Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Event"
        size="lg"
      >
        <EventForm
          eventCategories={eventCategories}
          selectedDate={selectedDate}
          onClose={() => setShowAddModal(false)}
          onSave={(newEvent) => {
            setEvents([...events, { ...newEvent, id: Date.now() }]);
            setShowAddModal(false);
          }}
        />
      </Modal>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          eventCategories={eventCategories}
          onClose={() => setSelectedEvent(null)}
          formatTime={formatTime}
        />
      )}
    </div>
  );
};

// Calendar Day Component
const CalendarDay = ({
  date,
  events,
  isToday,
  isSelected,
  eventCategories,
  onClick,
  onEventClick
}) => {
  if (!date) {
    return <div className="p-2 h-24"></div>;
  }

  const dayNumber = date.getDate();
  const hasEvents = events.length > 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-2 h-24 border border-gray-200 dark:border-gray-700 cursor-pointer transition-colors ${
        isToday
          ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700'
          : isSelected
          ? 'bg-secondary-50 dark:bg-secondary-900/20 border-secondary-300 dark:border-secondary-700'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        <div className={`text-sm font-medium mb-1 ${
          isToday
            ? 'text-primary-700 dark:text-primary-300'
            : 'text-gray-900 dark:text-white'
        }`}>
          {dayNumber}
        </div>

        <div className="flex-1 space-y-1 overflow-hidden">
          {events.slice(0, 2).map((event, index) => {
            const category = eventCategories[event.category];
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`text-xs p-1 rounded truncate cursor-pointer ${category.bgColor} ${category.textColor}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick(event);
                }}
                title={event.title}
              >
                {event.isImportant && <Star className="w-2 h-2 inline mr-1" />}
                {event.title}
              </motion.div>
            );
          })}

          {events.length > 2 && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              +{events.length - 2} more
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Selected Date Events Component
const SelectedDateEvents = ({
  date,
  events,
  eventCategories,
  formatTime,
  onEventClick,
  onAddEvent
}) => {
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {formatDate(date)}
        </h3>
        <div className="flex items-center space-x-2">
          <Badge variant="primary" size="sm">
            {events.length} events
          </Badge>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={onAddEvent}
          >
            Add Event
          </Button>
        </div>
      </div>

      {events.length > 0 ? (
        <div className="space-y-3">
          {events.map((event) => {
            const category = eventCategories[event.category];
            const CategoryIcon = category.icon;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="cursor-pointer"
                onClick={() => onEventClick(event)}
              >
                <Card hover className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category.color}`}>
                      <CategoryIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {event.isImportant && <Star className="w-4 h-4 inline mr-1 text-yellow-500" />}
                          {event.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {!event.isAllDay && (
                            <Badge variant="outline" size="sm">
                              {formatTime(event.time)}
                            </Badge>
                          )}
                          <Badge variant={category.textColor.includes('red') ? 'error' : 'default'} size="sm">
                            {category.name}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {event.description}
                      </p>
                      {event.location && (
                        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="w-3 h-3" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No events scheduled for this date
          </p>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={onAddEvent}
          >
            Add First Event
          </Button>
        </div>
      )}
    </Card>
  );
};

// Event Form Component
const EventForm = ({ eventCategories, selectedDate, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    time: '19:00',
    endTime: '21:00',
    category: 'date',
    location: '',
    isAllDay: false,
    isRecurring: false,
    recurringType: 'weekly',
    attendees: ['both'],
    reminders: [],
    notes: '',
    tags: '',
    isImportant: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;

    const newEvent = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdBy: 'self'
    };

    onSave(newEvent);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Event Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Date Night"
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {Object.entries(eventCategories).map(([key, category]) => (
              <option key={key} value={key}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="What's this event about?"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
        {!formData.isAllDay && (
          <>
            <Input
              label="Start Time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
            <Input
              label="End Time"
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            />
          </>
        )}
      </div>

      <Input
        label="Location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        placeholder="Where is this happening?"
        leftIcon={<MapPin className="w-4 h-4" />}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any additional notes or reminders..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <Input
        label="Tags (comma-separated)"
        value={formData.tags}
        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        placeholder="romantic, dinner, special"
        helperText="Add tags to help organize your events"
      />

      <div className="flex items-center space-x-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isAllDay}
            onChange={(e) => setFormData({ ...formData, isAllDay: e.target.checked })}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">All day event</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isImportant}
            onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Mark as important</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isRecurring}
            onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Recurring event</span>
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save Event
        </Button>
      </div>
    </form>
  );
};

// Event Detail Modal Component
const EventDetailModal = ({ event, eventCategories, onClose, formatTime }) => {
  const category = eventCategories[event.category];
  const CategoryIcon = category.icon;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={event.title}
      size="lg"
    >
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
              <CategoryIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <Badge variant={category.textColor.includes('red') ? 'error' : 'default'} size="sm">
                {category.name}
              </Badge>
              {event.isImportant && (
                <Badge variant="warning" size="sm" className="ml-2">
                  <Star className="w-3 h-3 mr-1" />
                  Important
                </Badge>
              )}
              {event.isRecurring && (
                <Badge variant="info" size="sm" className="ml-2">
                  Recurring
                </Badge>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Created by {event.createdBy === 'self' ? 'You' : 'Partner'}
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
            <p className="text-gray-600 dark:text-gray-300">{event.description}</p>
          </div>
        )}

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-primary-500" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {formatDate(event.date)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Date
                </div>
              </div>
            </div>
          </Card>

          {!event.isAllDay && (
            <Card>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-primary-500" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {formatTime(event.time)} - {formatTime(event.endTime)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Time
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Location */}
        {event.location && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Location</h4>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          </div>
        )}

        {/* Attendees */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Attendees</h4>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300">
              {event.attendees.includes('both') ? 'Both of us' : event.attendees.join(', ')}
            </span>
          </div>
        </div>

        {/* Reminders */}
        {event.reminders && event.reminders.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Reminders</h4>
            <div className="space-y-2">
              {event.reminders.map((reminder, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <Bell className="w-4 h-4 text-primary-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {reminder.type} - {reminder.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {event.notes && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Notes</h4>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{event.notes}</p>
          </div>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag, index) => (
                <Badge key={index} variant="outline" size="sm">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Recurring Info */}
        {event.isRecurring && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Recurring Pattern</h4>
            <p className="text-gray-600 dark:text-gray-300">
              Repeats {event.recurringType}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" leftIcon={<Share className="w-4 h-4" />}>
            Share
          </Button>
          <Button variant="outline" leftIcon={<Edit className="w-4 h-4" />}>
            Edit
          </Button>
          <Button variant="error" leftIcon={<Trash2 className="w-4 h-4" />}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LoveCalendar;
