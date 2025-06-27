/**
 * Love Journey - Time Capsules Service
 * 
 * API service for managing time capsules - messages and memories
 * to be opened at future dates.
 * 
 * Created: 2025-06-26
 * Version: 1.0.0
 */

import { api } from './authService';

const timeCapsulesService = {
  /**
   * Get all time capsules for the current relationship
   */
  async getTimeCapsules() {
    try {
      const response = await api.get('/time-capsules', {
        params: { _t: Date.now() },
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error) {
      console.error('Error fetching time capsules:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch time capsules'
      };
    }
  },

  /**
   * Get a specific time capsule by ID
   */
  async getTimeCapsule(id) {
    try {
      const response = await api.get(`/time-capsules/${id}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error fetching time capsule:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch time capsule'
      };
    }
  },

  /**
   * Create a new time capsule
   */
  async createTimeCapsule(capsuleData) {
    try {
      const response = await api.post('/time-capsules', capsuleData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error creating time capsule:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create time capsule'
      };
    }
  },

  /**
   * Update an existing time capsule
   */
  async updateTimeCapsule(id, capsuleData) {
    try {
      const response = await api.put(`/time-capsules/${id}`, capsuleData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error updating time capsule:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update time capsule'
      };
    }
  },

  /**
   * Delete a time capsule
   */
  async deleteTimeCapsule(id) {
    try {
      await api.delete(`/time-capsules/${id}`);
      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting time capsule:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete time capsule'
      };
    }
  },

  /**
   * Unlock a time capsule (mark as opened)
   */
  async unlockTimeCapsule(id) {
    try {
      const response = await api.post(`/time-capsules/${id}/unlock`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error unlocking time capsule:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to unlock time capsule'
      };
    }
  },

  /**
   * Add a reaction to a time capsule
   */
  async addReaction(id, reactionType) {
    try {
      const response = await api.post(`/time-capsules/${id}/reactions`, {
        type: reactionType
      });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error adding reaction:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add reaction'
      };
    }
  },

  /**
   * Add a reply to a time capsule
   */
  async addReply(id, message) {
    try {
      const response = await api.post(`/time-capsules/${id}/replies`, {
        message
      });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error adding reply:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add reply'
      };
    }
  },

  /**
   * Get time capsules ready to unlock
   */
  async getReadyToUnlock() {
    try {
      const response = await api.get('/time-capsules/ready');
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error) {
      console.error('Error fetching ready capsules:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch ready capsules'
      };
    }
  },

  /**
   * Get upcoming time capsules
   */
  async getUpcoming(days = 30) {
    try {
      const response = await api.get(`/time-capsules/upcoming?days=${days}`);
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error) {
      console.error('Error fetching upcoming capsules:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch upcoming capsules'
      };
    }
  },

  /**
   * Get time capsules by category
   */
  async getByCategory(category) {
    try {
      const response = await api.get(`/time-capsules/category/${category}`);
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error) {
      console.error('Error fetching capsules by category:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch capsules by category'
      };
    }
  }
};

export default timeCapsulesService;
