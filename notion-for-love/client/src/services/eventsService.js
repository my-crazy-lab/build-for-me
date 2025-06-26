/**
 * Love Journey - Events Service
 * 
 * Frontend service for handling events operations including
 * CRUD operations, calendar management, and reminders.
 * 
 * Created: 2025-06-26
 * Version: 1.0.0
 */

import { api } from './authService';

class EventsService {
  // Get all events for the current user
  async getEvents(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.type && filters.type !== 'all') {
        params.append('type', filters.type);
      }
      if (filters.dateFrom) {
        params.append('dateFrom', filters.dateFrom);
      }
      if (filters.dateTo) {
        params.append('dateTo', filters.dateTo);
      }
      if (filters.tags) {
        params.append('tags', filters.tags.join(','));
      }
      if (filters.upcoming) {
        params.append('upcoming', 'true');
      }

      const response = await api.get(`/events?${params.toString()}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch events' };
    } catch (error) {
      console.error('Get events error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch events',
      };
    }
  }

  // Get a specific event by ID
  async getEvent(eventId) {
    try {
      const response = await api.get(`/events/${eventId}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch event' };
    } catch (error) {
      console.error('Get event error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch event',
      };
    }
  }

  // Create a new event
  async createEvent(eventData) {
    try {
      const response = await api.post('/events', eventData);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to create event' };
    } catch (error) {
      console.error('Create event error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create event',
      };
    }
  }

  // Update an existing event
  async updateEvent(eventId, eventData) {
    try {
      const response = await api.put(`/events/${eventId}`, eventData);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to update event' };
    } catch (error) {
      console.error('Update event error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update event',
      };
    }
  }

  // Delete an event
  async deleteEvent(eventId) {
    try {
      const response = await api.delete(`/events/${eventId}`);
      
      if (response.data.success) {
        return { success: true };
      }
      
      return { success: false, error: 'Failed to delete event' };
    } catch (error) {
      console.error('Delete event error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete event',
      };
    }
  }

  // Get upcoming events
  async getUpcomingEvents(days = 30, limit = 10) {
    try {
      const response = await api.get(`/events/upcoming?days=${days}&limit=${limit}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch upcoming events' };
    } catch (error) {
      console.error('Get upcoming events error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch upcoming events',
      };
    }
  }

  // Update attendee status
  async updateAttendeeStatus(eventId, userId, status) {
    try {
      const response = await api.patch(`/events/${eventId}/attendees/${userId}`, { status });
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to update attendee status' };
    } catch (error) {
      console.error('Update attendee status error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update attendee status',
      };
    }
  }

  // Add reminder to event
  async addReminder(eventId, method, offsetMinutes) {
    try {
      const response = await api.post(`/events/${eventId}/reminders`, {
        method,
        offsetMinutes
      });
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to add reminder' };
    } catch (error) {
      console.error('Add reminder error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to add reminder',
      };
    }
  }

  // Get event statistics
  async getEventStats() {
    try {
      const response = await api.get('/events/stats');

      if (response.data.success) {
        return { success: true, data: response.data.data };
      }

      return { success: false, error: 'Failed to fetch event statistics' };
    } catch (error) {
      console.error('Get event stats error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch event statistics',
      };
    }
  }

  // Get upcoming plans (confirmed and planning events)
  async getUpcomingPlans() {
    try {
      const response = await api.get('/events/upcoming-plans');

      if (response.data.success) {
        return { success: true, data: response.data.data };
      }

      return { success: false, error: 'Failed to fetch upcoming plans' };
    } catch (error) {
      console.error('Get upcoming plans error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch upcoming plans',
      };
    }
  }

  // Get date ideas
  async getDateIdeas() {
    try {
      const response = await api.get('/events/date-ideas');

      if (response.data.success) {
        return { success: true, data: response.data.data };
      }

      return { success: false, error: 'Failed to fetch date ideas' };
    } catch (error) {
      console.error('Get date ideas error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch date ideas',
      };
    }
  }

  // Get bucket list items
  async getBucketList() {
    try {
      const response = await api.get('/events/bucket-list');

      if (response.data.success) {
        return { success: true, data: response.data.data };
      }

      return { success: false, error: 'Failed to fetch bucket list' };
    } catch (error) {
      console.error('Get bucket list error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch bucket list',
      };
    }
  }
}

// Create and export a singleton instance
const eventsService = new EventsService();
export default eventsService;
