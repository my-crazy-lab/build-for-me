/**
 * Love Journey - Goals Service
 * 
 * Frontend service for handling goals operations including
 * CRUD operations, progress tracking, and milestone management.
 * 
 * Created: 2025-06-26
 * Version: 1.0.0
 */

import { api } from './authService';

class GoalsService {
  // Get all goals for the current user
  async getGoals(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }
      if (filters.status) {
        params.append('status', filters.status);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.priority) {
        params.append('priority', filters.priority);
      }

      // Add cache-busting parameter to avoid 304 responses
      params.append('_t', Date.now().toString());

      const response = await api.get(`/goals?${params.toString()}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (response.data.success) {
        return { success: true, data: response.data.data };
      }

      return { success: false, error: 'Failed to fetch goals' };
    } catch (error) {
      console.error('Get goals error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch goals',
      };
    }
  }

  // Get a specific goal by ID
  async getGoal(goalId) {
    try {
      const response = await api.get(`/goals/${goalId}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch goal' };
    } catch (error) {
      console.error('Get goal error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch goal',
      };
    }
  }

  // Create a new goal
  async createGoal(goalData) {
    try {
      const response = await api.post('/goals', goalData);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to create goal' };
    } catch (error) {
      console.error('Create goal error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create goal',
      };
    }
  }

  // Update an existing goal
  async updateGoal(goalId, goalData) {
    try {
      const response = await api.put(`/goals/${goalId}`, goalData);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to update goal' };
    } catch (error) {
      console.error('Update goal error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update goal',
      };
    }
  }

  // Delete a goal
  async deleteGoal(goalId) {
    try {
      const response = await api.delete(`/goals/${goalId}`);
      
      if (response.data.success) {
        return { success: true };
      }
      
      return { success: false, error: 'Failed to delete goal' };
    } catch (error) {
      console.error('Delete goal error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete goal',
      };
    }
  }

  // Update goal progress
  async updateProgress(goalId, progress) {
    try {
      const response = await api.patch(`/goals/${goalId}/progress`, { progress });
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to update progress' };
    } catch (error) {
      console.error('Update progress error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update progress',
      };
    }
  }

  // Add milestone to goal
  async addMilestone(goalId, milestoneData) {
    try {
      const response = await api.post(`/goals/${goalId}/milestones`, milestoneData);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to add milestone' };
    } catch (error) {
      console.error('Add milestone error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to add milestone',
      };
    }
  }

  // Update milestone
  async updateMilestone(goalId, milestoneId, milestoneData) {
    try {
      const response = await api.put(`/goals/${goalId}/milestones/${milestoneId}`, milestoneData);
      
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

  // Complete milestone
  async completeMilestone(goalId, milestoneId) {
    try {
      const response = await api.patch(`/goals/${goalId}/milestones/${milestoneId}/complete`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to complete milestone' };
    } catch (error) {
      console.error('Complete milestone error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to complete milestone',
      };
    }
  }

  // Get goal statistics
  async getGoalStats() {
    try {
      const response = await api.get('/goals/stats');
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch goal statistics' };
    } catch (error) {
      console.error('Get goal stats error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch goal statistics',
      };
    }
  }

  // Get goal categories
  async getCategories() {
    try {
      const response = await api.get('/goals/categories');
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch categories' };
    } catch (error) {
      console.error('Get categories error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch categories',
      };
    }
  }
}

// Create and export a singleton instance
const goalsService = new GoalsService();
export default goalsService;
