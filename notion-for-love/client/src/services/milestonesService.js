/**
 * Love Journey - Milestones Service
 * 
 * Frontend service for handling milestone operations including
 * CRUD operations, media management, and timeline features.
 * 
 * Created: 2025-06-26
 * Version: 1.0.0
 */

import { api } from './authService';

class MilestonesService {
  // Get all milestones for the current user
  async getMilestones(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }
      if (filters.search) {
        params.append('search', filters.search);
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
      if (filters.favorites) {
        params.append('favorites', 'true');
      }

      const response = await api.get(`/milestones?${params.toString()}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch milestones' };
    } catch (error) {
      console.error('Get milestones error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch milestones',
      };
    }
  }

  // Get a specific milestone by ID
  async getMilestone(milestoneId) {
    try {
      const response = await api.get(`/milestones/${milestoneId}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch milestone' };
    } catch (error) {
      console.error('Get milestone error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch milestone',
      };
    }
  }

  // Create a new milestone
  async createMilestone(milestoneData) {
    try {
      const response = await api.post('/milestones', milestoneData);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to create milestone' };
    } catch (error) {
      console.error('Create milestone error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create milestone',
      };
    }
  }

  // Update an existing milestone
  async updateMilestone(milestoneId, milestoneData) {
    try {
      const response = await api.put(`/milestones/${milestoneId}`, milestoneData);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to update milestone' };
    } catch (error) {
      console.error('Update milestone error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update milestone',
      };
    }
  }

  // Delete a milestone
  async deleteMilestone(milestoneId) {
    try {
      const response = await api.delete(`/milestones/${milestoneId}`);
      
      if (response.data.success) {
        return { success: true };
      }
      
      return { success: false, error: 'Failed to delete milestone' };
    } catch (error) {
      console.error('Delete milestone error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete milestone',
      };
    }
  }

  // Toggle milestone favorite status
  async toggleFavorite(milestoneId) {
    try {
      const response = await api.patch(`/milestones/${milestoneId}/favorite`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to toggle favorite status' };
    } catch (error) {
      console.error('Toggle favorite error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to toggle favorite status',
      };
    }
  }

  // Get milestone statistics
  async getMilestoneStats() {
    try {
      const response = await api.get('/milestones/stats');
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch milestone statistics' };
    } catch (error) {
      console.error('Get milestone stats error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch milestone statistics',
      };
    }
  }

  // Get recent milestones for dashboard
  async getRecentMilestones(limit = 5) {
    try {
      const response = await api.get(`/milestones?limit=${limit}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data.slice(0, limit) };
      }
      
      return { success: false, error: 'Failed to fetch recent milestones' };
    } catch (error) {
      console.error('Get recent milestones error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch recent milestones',
      };
    }
  }

  // Get milestone timeline for a specific date range
  async getMilestoneTimeline(dateFrom, dateTo) {
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      const response = await api.get(`/milestones?${params.toString()}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch milestone timeline' };
    } catch (error) {
      console.error('Get milestone timeline error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch milestone timeline',
      };
    }
  }
}

// Create and export a singleton instance
const milestonesService = new MilestonesService();
export default milestonesService;
