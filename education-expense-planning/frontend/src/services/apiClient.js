/**
 * API Client Configuration
 * 
 * This module configures axios for API communication:
 * - Base URL configuration
 * - Request/response interceptors
 * - Authentication headers
 * - Error handling
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import axios from 'axios';

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('education-expense-access-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
apiClient.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;

    // Log successful requests in development
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`);
    }

    return response;
  },
  (error) => {
    // Calculate request duration
    const endTime = new Date();
    const duration = error.config?.metadata?.startTime 
      ? endTime - error.config.metadata.startTime 
      : 0;

    // Log errors in development
    if (import.meta.env.DEV) {
      const status = error.response?.status || 'Network Error';
      const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
      const url = error.config?.url || 'unknown';
      
      console.error(`❌ ${method} ${url} - ${status} (${duration}ms)`, {
        error: error.response?.data || error.message,
        config: error.config,
      });
    }

    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - token might be expired
          if (data.error?.code === 'TOKEN_EXPIRED') {
            // This will be handled by auth service interceptor
            break;
          }
          break;
          
        case 403:
          // Forbidden - insufficient permissions
          break;
          
        case 404:
          // Not found
          break;
          
        case 429:
          // Rate limited
          break;
          
        case 500:
          // Server error
          console.error('Server error:', data);
          break;
          
        default:
          console.error('API error:', data);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
    } else {
      // Request setup error
      console.error('Request error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Helper function to handle file uploads
export const uploadFile = async (endpoint, file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  return apiClient.post(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

// Helper function for downloading files
export const downloadFile = async (endpoint, filename) => {
  const response = await apiClient.get(endpoint, {
    responseType: 'blob',
  });

  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// Helper function to cancel requests
export const createCancelToken = () => {
  return axios.CancelToken.source();
};

// Helper function to check if error is a cancel error
export const isCancel = (error) => {
  return axios.isCancel(error);
};

export { apiClient };
export default apiClient;
