/**
 * Love Journey - Check-ins Service
 * 
 * Frontend service for handling check-in operations including
 * CRUD operations, partner responses, and streak tracking.
 * 
 * Created: 2025-06-26
 * Version: 1.0.0
 */

import { api } from './authService';

class CheckinsService {
  // Get all check-ins for the current user
  async getCheckins(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.userId) {
        params.append('userId', filters.userId);
      }
      if (filters.days) {
        params.append('days', filters.days);
      }
      if (filters.category) {
        params.append('category', filters.category);
      }
      if (filters.mood) {
        params.append('mood', filters.mood);
      }

      const response = await api.get(`/checkins?${params.toString()}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch check-ins' };
    } catch (error) {
      console.error('Get check-ins error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch check-ins',
      };
    }
  }

  // Get a specific check-in by ID
  async getCheckin(checkinId) {
    try {
      const response = await api.get(`/checkins/${checkinId}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch check-in' };
    } catch (error) {
      console.error('Get check-in error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch check-in',
      };
    }
  }

  // Create a new check-in
  async createCheckin(checkinData) {
    try {
      const response = await api.post('/checkins', checkinData);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to create check-in' };
    } catch (error) {
      console.error('Create check-in error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create check-in',
      };
    }
  }

  // Update an existing check-in
  async updateCheckin(checkinId, checkinData) {
    try {
      const response = await api.put(`/checkins/${checkinId}`, checkinData);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to update check-in' };
    } catch (error) {
      console.error('Update check-in error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update check-in',
      };
    }
  }

  // Delete a check-in
  async deleteCheckin(checkinId) {
    try {
      const response = await api.delete(`/checkins/${checkinId}`);
      
      if (response.data.success) {
        return { success: true };
      }
      
      return { success: false, error: 'Failed to delete check-in' };
    } catch (error) {
      console.error('Delete check-in error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete check-in',
      };
    }
  }

  // Add partner response to check-in
  async addPartnerResponse(checkinId, response, rating) {
    try {
      const responseData = await api.post(`/checkins/${checkinId}/response`, {
        response,
        rating
      });
      
      if (responseData.data.success) {
        return { success: true, data: responseData.data.data };
      }
      
      return { success: false, error: 'Failed to add partner response' };
    } catch (error) {
      console.error('Add partner response error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to add partner response',
      };
    }
  }

  // Award badge to check-in
  async awardBadge(checkinId, badgeType) {
    try {
      const response = await api.post(`/checkins/${checkinId}/badge`, {
        badgeType
      });
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to award badge' };
    } catch (error) {
      console.error('Award badge error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to award badge',
      };
    }
  }

  // Get user's check-in history
  async getCheckinHistory(userId, days = 30) {
    try {
      const response = await api.get(`/checkins/history/${userId}?days=${days}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch check-in history' };
    } catch (error) {
      console.error('Get check-in history error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch check-in history',
      };
    }
  }

  // Get relationship check-ins
  async getRelationshipCheckins(days = 30) {
    try {
      const response = await api.get(`/checkins/relationship?days=${days}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch relationship check-ins' };
    } catch (error) {
      console.error('Get relationship check-ins error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch relationship check-ins',
      };
    }
  }

  // Get user's current streak
  async getUserStreak(userId) {
    try {
      const response = await api.get(`/checkins/streak/${userId}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch user streak' };
    } catch (error) {
      console.error('Get user streak error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch user streak',
      };
    }
  }
}

// Create and export a singleton instance
const checkinsService = new CheckinsService();
export default checkinsService;
