import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5666',
  timeout: 10000,
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  getLinearAuthUrl: () => api.get('/auth/linear/url'),
  getGitLabAuthUrl: () => api.get('/auth/gitlab/url'),
};

// Data API calls
export const dataAPI = {
  getConnectionStatus: (userId) => api.get(`/api/status?userId=${userId}`),
  getLinearIssues: (userId) => api.get(`/api/linear/issues?userId=${userId}`),
  getGitLabMergeRequests: (userId) => api.get(`/api/gitlab/merge-requests?userId=${userId}`),
};

// Utility functions
export const getUserId = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userIdFromUrl = urlParams.get('userId');
  const storedUserId = localStorage.getItem('userId');
  
  if (userIdFromUrl) {
    localStorage.setItem('userId', userIdFromUrl);
    return userIdFromUrl;
  }
  
  return storedUserId;
};

export const setUserId = (userId) => {
  localStorage.setItem('userId', userId);
};

export const clearUserId = () => {
  localStorage.removeItem('userId');
};

export default api;
