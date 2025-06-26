/**
 * Love Journey - Dashboard Service
 * 
 * Frontend service for handling dashboard data aggregation
 * including stats, recent activities, and overview data.
 * 
 * Created: 2025-06-26
 * Version: 1.0.0
 */

import { api } from './authService';

class DashboardService {
  // Get dashboard overview data
  async getDashboardData() {
    try {
      const response = await api.get('/dashboard');
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch dashboard data' };
    } catch (error) {
      console.error('Get dashboard data error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch dashboard data',
      };
    }
  }

  // Get dashboard statistics
  async getStats() {
    try {
      const response = await api.get('/dashboard/stats');
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch statistics' };
    } catch (error) {
      console.error('Get stats error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch statistics',
      };
    }
  }

  // Get recent activities
  async getRecentActivities(limit = 10) {
    try {
      const response = await api.get(`/dashboard/activities?limit=${limit}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch recent activities' };
    } catch (error) {
      console.error('Get recent activities error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch recent activities',
      };
    }
  }

  // Get upcoming events
  async getUpcomingEvents(limit = 5) {
    try {
      const response = await api.get(`/dashboard/upcoming-events?limit=${limit}`);
      
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

  // Get milestone timeline for dashboard
  async getMilestoneTimeline(limit = 5) {
    try {
      const response = await api.get(`/dashboard/milestones?limit=${limit}`);
      
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

  // Get memory highlights for dashboard
  async getMemoryHighlights(limit = 3) {
    try {
      const response = await api.get(`/dashboard/memory-highlights?limit=${limit}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch memory highlights' };
    } catch (error) {
      console.error('Get memory highlights error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch memory highlights',
      };
    }
  }

  // Get shared goals for dashboard
  async getSharedGoals(limit = 3) {
    try {
      const response = await api.get(`/dashboard/shared-goals?limit=${limit}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch shared goals' };
    } catch (error) {
      console.error('Get shared goals error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch shared goals',
      };
    }
  }

  // Get relationship insights
  async getRelationshipInsights() {
    try {
      const response = await api.get('/dashboard/insights');
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch relationship insights' };
    } catch (error) {
      console.error('Get relationship insights error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch relationship insights',
      };
    }
  }

  // Get love points and streaks
  async getLoveMetrics() {
    try {
      const response = await api.get('/dashboard/love-metrics');
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch love metrics' };
    } catch (error) {
      console.error('Get love metrics error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch love metrics',
      };
    }
  }

  // Update widget preferences
  async updateWidgetPreferences(preferences) {
    try {
      const response = await api.put('/dashboard/widget-preferences', preferences);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to update widget preferences' };
    } catch (error) {
      console.error('Update widget preferences error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update widget preferences',
      };
    }
  }
}

// Create and export a singleton instance
const dashboardService = new DashboardService();
export default dashboardService;
