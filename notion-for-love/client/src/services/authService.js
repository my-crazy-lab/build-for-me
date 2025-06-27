/**
 * Love Journey - Authentication Service
 * 
 * Frontend service for handling authentication operations including
 * login, logout, token management, and API communication.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - only redirect if not already on login page
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

class AuthService {
  // Register new user
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);

      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user, token };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
      };
    }
  }

  // Login with email and password (demo mode)
  async login(email, password) {
    try {
      // Clear any existing auth data first
      this.clearAuth();
      delete api.defaults.headers.common['Authorization'];

      const response = await api.post('/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        const { token, user } = response.data;

        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Set authorization header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        return { success: true, user, token };
      }

      return { success: false, error: response.data.error || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Login failed',
      };
    }
  }

  // Google OAuth login
  async loginWithGoogle() {
    try {
      // Redirect to Google OAuth endpoint
      window.location.href = `${API_URL}/auth/google`;
    } catch (error) {
      console.error('Google login error:', error);
      return {
        success: false,
        error: 'Google login failed',
      };
    }
  }

  // Handle OAuth callback
  async handleOAuthCallback(token) {
    try {
      if (token) {
        localStorage.setItem('token', token);
        
        // Get user data
        const userResponse = await this.getCurrentUser();
        if (userResponse.success) {
          localStorage.setItem('user', JSON.stringify(userResponse.user));
          return { success: true, user: userResponse.user };
        }
      }
      
      return { success: false, error: 'OAuth callback failed' };
    } catch (error) {
      console.error('OAuth callback error:', error);
      return {
        success: false,
        error: 'OAuth callback failed',
      };
    }
  }

  // Logout
  async logout() {
    try {
      // Try to call server logout endpoint
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with cleanup even if server call fails
    } finally {
      // Always clear local storage and auth state
      this.clearAuth();
      // Clear authorization header
      delete api.defaults.headers.common['Authorization'];
      // Clear any axios cached requests
      api.defaults.headers.Authorization = undefined;
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      
      if (response.data.success) {
        const user = response.data.data;
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      }

      return { success: false, error: 'Failed to get user data' };
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get user data',
      };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  // Get stored user data
  getStoredUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  }

  // Get stored token
  getStoredToken() {
    return localStorage.getItem('token');
  }

  // Clear authentication data
  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Update user data in localStorage
  updateStoredUser(userData) {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error updating stored user:', error);
    }
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;

// Export the configured axios instance for other services
export { api };
