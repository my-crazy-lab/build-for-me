/**
 * Love Journey - Emotions Service
 * 
 * Frontend service for handling emotion tracking operations including
 * CRUD operations, mood analysis, and wellness trends.
 * 
 * Created: 2025-06-26
 * Version: 1.0.0
 */

import { api } from './authService';

class EmotionsService {
  // Get all emotions for the current user
  async getEmotions(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.userId) {
        params.append('userId', filters.userId);
      }
      if (filters.days) {
        params.append('days', filters.days);
      }
      if (filters.mood) {
        params.append('mood', filters.mood);
      }

      // Add cache-busting parameter to avoid 304 responses
      params.append('_t', Date.now().toString());

      const response = await api.get(`/emotions?${params.toString()}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (response.data.success) {
        return { success: true, data: response.data.data };
      }

      return { success: false, error: 'Failed to fetch emotions' };
    } catch (error) {
      console.error('Get emotions error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch emotions',
      };
    }
  }

  // Get a specific emotion entry by ID
  async getEmotion(emotionId) {
    try {
      const response = await api.get(`/emotions/${emotionId}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch emotion entry' };
    } catch (error) {
      console.error('Get emotion error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch emotion entry',
      };
    }
  }

  // Create a new emotion entry
  async createEmotion(emotionData) {
    try {
      const response = await api.post('/emotions', emotionData);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to create emotion entry' };
    } catch (error) {
      console.error('Create emotion error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create emotion entry',
      };
    }
  }

  // Update an existing emotion entry
  async updateEmotion(emotionId, emotionData) {
    try {
      const response = await api.put(`/emotions/${emotionId}`, emotionData);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to update emotion entry' };
    } catch (error) {
      console.error('Update emotion error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update emotion entry',
      };
    }
  }

  // Delete an emotion entry
  async deleteEmotion(emotionId) {
    try {
      const response = await api.delete(`/emotions/${emotionId}`);
      
      if (response.data.success) {
        return { success: true };
      }
      
      return { success: false, error: 'Failed to delete emotion entry' };
    } catch (error) {
      console.error('Delete emotion error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete emotion entry',
      };
    }
  }

  // Get user's emotion history
  async getEmotionHistory(userId, days = 30) {
    try {
      const response = await api.get(`/emotions/history/${userId}?days=${days}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch emotion history' };
    } catch (error) {
      console.error('Get emotion history error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch emotion history',
      };
    }
  }

  // Get relationship emotion trends
  async getEmotionTrends(days = 30) {
    try {
      const response = await api.get(`/emotions/trends?days=${days}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch emotion trends' };
    } catch (error) {
      console.error('Get emotion trends error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch emotion trends',
      };
    }
  }

  // Get mood statistics
  async getMoodStats(userId = null, days = 30) {
    try {
      const params = new URLSearchParams();
      params.append('days', days);
      if (userId) {
        params.append('userId', userId);
      }

      const response = await api.get(`/emotions/stats/mood?${params.toString()}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch mood statistics' };
    } catch (error) {
      console.error('Get mood stats error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch mood statistics',
      };
    }
  }

  // Get wellness trends
  async getWellnessTrends(userId = null, days = 30) {
    try {
      const params = new URLSearchParams();
      params.append('days', days);
      if (userId) {
        params.append('userId', userId);
      }

      const response = await api.get(`/emotions/stats/wellness?${params.toString()}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch wellness trends' };
    } catch (error) {
      console.error('Get wellness trends error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch wellness trends',
      };
    }
  }

  // Get today's emotion entry
  async getTodayEmotion() {
    try {
      const response = await api.get('/emotions/today');
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch today\'s emotion entry' };
    } catch (error) {
      console.error('Get today emotion error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch today\'s emotion entry',
      };
    }
  }
}

// Create and export a singleton instance
const emotionsService = new EmotionsService();
export default emotionsService;
