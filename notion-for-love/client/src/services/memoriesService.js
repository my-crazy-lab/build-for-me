/**
 * Love Journey - Memories Service
 * 
 * Frontend service for handling memories operations including
 * CRUD operations, file uploads, and memory management.
 * 
 * Created: 2025-06-26
 * Version: 1.0.0
 */

import { api } from './authService';

class MemoriesService {
  // Get all memories for the current user
  async getMemories(filters = {}) {
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

      // Add cache-busting parameter to avoid 304 responses
      params.append('_t', Date.now().toString());

      const response = await api.get(`/memories?${params.toString()}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (response.data.success) {
        return { success: true, data: response.data.data };
      }

      return { success: false, error: 'Failed to fetch memories' };
    } catch (error) {
      console.error('Get memories error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch memories',
      };
    }
  }

  // Get a specific memory by ID
  async getMemory(memoryId) {
    try {
      const response = await api.get(`/memories/${memoryId}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch memory' };
    } catch (error) {
      console.error('Get memory error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch memory',
      };
    }
  }

  // Create a new memory
  async createMemory(memoryData) {
    try {
      const response = await api.post('/memories', memoryData);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to create memory' };
    } catch (error) {
      console.error('Create memory error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create memory',
      };
    }
  }

  // Update an existing memory
  async updateMemory(memoryId, memoryData) {
    try {
      const response = await api.put(`/memories/${memoryId}`, memoryData);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to update memory' };
    } catch (error) {
      console.error('Update memory error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update memory',
      };
    }
  }

  // Delete a memory
  async deleteMemory(memoryId) {
    try {
      const response = await api.delete(`/memories/${memoryId}`);
      
      if (response.data.success) {
        return { success: true };
      }
      
      return { success: false, error: 'Failed to delete memory' };
    } catch (error) {
      console.error('Delete memory error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete memory',
      };
    }
  }

  // Upload memory photos
  async uploadPhotos(memoryId, files) {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`photos`, file);
      });

      const response = await api.post(`/memories/${memoryId}/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to upload photos' };
    } catch (error) {
      console.error('Upload photos error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to upload photos',
      };
    }
  }

  // Delete a photo from memory
  async deletePhoto(memoryId, photoId) {
    try {
      const response = await api.delete(`/memories/${memoryId}/photos/${photoId}`);
      
      if (response.data.success) {
        return { success: true };
      }
      
      return { success: false, error: 'Failed to delete photo' };
    } catch (error) {
      console.error('Delete photo error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete photo',
      };
    }
  }

  // Get memory statistics
  async getMemoryStats() {
    try {
      const response = await api.get('/memories/stats');
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch memory statistics' };
    } catch (error) {
      console.error('Get memory stats error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch memory statistics',
      };
    }
  }

  // Get recent memories for dashboard
  async getRecentMemories(limit = 5) {
    try {
      const response = await api.get(`/memories/recent?limit=${limit}`);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch recent memories' };
    } catch (error) {
      console.error('Get recent memories error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch recent memories',
      };
    }
  }

  // Get memory tags
  async getTags() {
    try {
      const response = await api.get('/memories/tags');
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, error: 'Failed to fetch tags' };
    } catch (error) {
      console.error('Get tags error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch tags',
      };
    }
  }
}

// Create and export a singleton instance
const memoriesService = new MemoriesService();
export default memoriesService;
