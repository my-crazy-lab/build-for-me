/**
 * Authentication Service
 * 
 * This service handles all authentication-related API calls:
 * - Demo login
 * - Google OAuth
 * - Token management
 * - User profile operations
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import { apiClient } from './apiClient';

// Token storage keys
const ACCESS_TOKEN_KEY = 'education-expense-access-token';
const REFRESH_TOKEN_KEY = 'education-expense-refresh-token';

class AuthService {
  /**
   * Demo login
   * @param {Object} credentials - Demo credentials
   * @returns {Promise<Object>} Login response
   */
  async loginDemo(credentials) {
    try {
      const response = await apiClient.post('/auth/demo', credentials);
      return response.data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get current user profile
   * @returns {Promise<Object>} User data
   */
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data.user;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile update data
   * @returns {Promise<Object>} Updated user data
   */
  async updateProfile(profileData) {
    try {
      const response = await apiClient.patch('/auth/profile', profileData);
      return response.data.user;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} New tokens
   */
  async refreshToken(refreshToken) {
    try {
      const response = await apiClient.post('/auth/refresh', { refreshToken });
      return response.data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      const refreshToken = this.getRefreshToken();
      await apiClient.post('/auth/logout', { refreshToken });
    } catch (error) {
      // Don't throw error for logout - always clear local tokens
      console.warn('Logout API call failed:', error.message);
    }
  }

  /**
   * Get authentication status
   * @returns {Promise<Object>} Auth status
   */
  async getAuthStatus() {
    try {
      const response = await apiClient.get('/auth/status');
      return response.data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Store authentication tokens
   * @param {Object} tokens - Access and refresh tokens
   */
  setTokens(tokens) {
    if (tokens.accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    }
    if (tokens.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    }
  }

  /**
   * Get access token from storage
   * @returns {string|null} Access token
   */
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  /**
   * Get refresh token from storage
   * @returns {string|null} Refresh token
   */
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  /**
   * Clear all tokens from storage
   */
  clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      // Basic token validation (check if it's not expired)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get user data from token
   * @returns {Object|null} User data from token
   */
  getUserFromToken() {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.userId,
        email: payload.email,
        name: payload.name,
        isDemoAccount: payload.isDemoAccount || false,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Handle authentication errors
   * @param {Error} error - API error
   * @returns {Error} Formatted error
   */
  handleAuthError(error) {
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle specific error cases
      switch (status) {
        case 401:
          this.clearTokens();
          return new Error(data.error?.message || 'Authentication failed');
        
        case 403:
          return new Error(data.error?.message || 'Access denied');
        
        case 429:
          return new Error('Too many requests. Please try again later.');
        
        default:
          return new Error(data.error?.message || 'Authentication error occurred');
      }
    }
    
    if (error.request) {
      return new Error('Network error. Please check your connection.');
    }
    
    return new Error(error.message || 'An unexpected error occurred');
  }

  /**
   * Setup automatic token refresh
   * @param {Function} onTokenRefresh - Callback when token is refreshed
   * @param {Function} onRefreshFail - Callback when refresh fails
   */
  setupTokenRefresh(onTokenRefresh, onRefreshFail) {
    // Set up axios interceptor for automatic token refresh
    apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await this.refreshToken(refreshToken);
            this.setTokens(response.tokens);

            // Update authorization header
            originalRequest.headers.Authorization = `Bearer ${response.tokens.accessToken}`;

            // Notify about token refresh
            if (onTokenRefresh) {
              onTokenRefresh(response.tokens);
            }

            // Retry original request
            return apiClient(originalRequest);
          } catch (refreshError) {
            // Refresh failed, clear tokens and notify
            this.clearTokens();
            if (onRefreshFail) {
              onRefreshFail(refreshError);
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }
}

// Create and export singleton instance
export const authService = new AuthService();
export default authService;
