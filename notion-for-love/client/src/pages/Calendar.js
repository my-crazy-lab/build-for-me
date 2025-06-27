/**
 * Love Journey - Calendar
 *
 * Interactive calendar for couples to track dates, anniversaries,
 * milestones, and shared events.
 *
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight,
  Plus, Heart, Star, Gift, Coffee, Plane, Camera,
  Clock, MapPin, Users, Bell
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { eventsService } from '../services';
import { showToast, handleApiError, handleApiSuccess } from '../utils/toast';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Load events from API
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const response = await eventsService.getEvents();
        if (response.success) {
          // Transform events to calendar format
          const calendarEvents = response.data.map(event => ({
            id: event._id,
            date: event.date.split('T')[0], // Extract date part
            title: event.title,
            time: new Date(event.date).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }),
            type: event.type,
            icon: getEventIcon(event.type),
            color: getEventColor(event.type)
          }));
          setEvents(calendarEvents);
        }
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const getEventIcon = (type) => {
    const icons = {
      date: Heart,
      milestone: Star,
      travel: Plane,
      casual: Coffee,
      anniversary: Gift,
      default: CalendarIcon
    };
    return icons[type] || icons.default;
  };

  const getEventColor = (type) => {
    const colors = {
      date: 'bg-red-500',
      milestone: 'bg-purple-500',
      travel: 'bg-blue-500',
      casual: 'bg-amber-500',
      anniversary: 'bg-pink-500',
      default: 'bg-gray-500'
    };
    return colors[type] || colors.default;
  };

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
              <Button
                className="w-full mb-3"
                onClick={() => setShowEventModal(true)}
              >
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

        {/* Event Creation Modal */}
        <Modal
          isOpen={showEventModal}
          onClose={() => setShowEventModal(false)}
          title="Create New Event"
          size="lg"
        >
          <EventForm
            selectedDate={selectedDate}
            onClose={() => setShowEventModal(false)}
            onSave={async (eventData) => {
              try {
                const response = await eventsService.createEvent(eventData);
                if (response.success) {
                  // Refresh events list
                  const eventsResponse = await eventsService.getEvents();
                  if (eventsResponse.success) {
                    // Transform events to calendar format
                    const calendarEvents = eventsResponse.data.map(event => ({
                      id: event._id,
                      date: event.date.split('T')[0],
                      title: event.title,
                      time: new Date(event.date).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      }),
                      type: event.type,
                      icon: getEventIcon(event.type),
                      color: getEventColor(event.type)
                    }));
                    setEvents(calendarEvents);
                  }
                  handleApiSuccess('Event created successfully');
                  setShowEventModal(false);
                } else {
                  handleApiError({ message: response.error });
                }
              } catch (error) {
                console.error('Error creating event:', error);
                handleApiError(error, 'Failed to create event');
              }
            }}
          />
        </Modal>
      </div>
    </div>
  );
};

// Event Form Component
const EventForm = ({ selectedDate, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    time: '19:00',
    endTime: '21:00',
    type: 'date-night',
    location: '',
    isAllDay: false,
    notes: ''
  });

  const eventTypes = [
    { value: 'date-night', label: 'Date Night' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'birthday', label: 'Birthday' },
    { value: 'milestone', label: 'Milestone' },
    { value: 'travel', label: 'Travel' },
    { value: 'family', label: 'Family' },
    { value: 'celebration', label: 'Celebration' },
    { value: 'appointment', label: 'Appointment' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;

    // Format date and time for API
    const eventDateTime = formData.isAllDay
      ? new Date(formData.date).toISOString()
      : new Date(`${formData.date}T${formData.time}`).toISOString();

    const endDateTime = formData.isAllDay
      ? new Date(formData.date).toISOString()
      : new Date(`${formData.date}T${formData.endTime}`).toISOString();

    const eventData = {
      title: formData.title,
      description: formData.description,
      date: eventDateTime,
      endDate: endDateTime,
      type: formData.type,
      status: 'confirmed',
      isAllDay: formData.isAllDay,
      location: formData.location ? { name: formData.location } : undefined,
      notes: formData.notes,
      isPrivate: false
    };

    onSave(eventData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Event Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Date Night"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Event Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {eventTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="flex items-center space-x-2 mt-8">
            <input
              type="checkbox"
              checked={formData.isAllDay}
              onChange={(e) => setFormData({ ...formData, isAllDay: e.target.checked })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">All day event</span>
          </label>
        </div>
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
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Add details about this event..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any additional notes..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Create Event
        </Button>
      </div>
    </form>
  );
};

export default Calendar;
