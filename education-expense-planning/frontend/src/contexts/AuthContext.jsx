/**
 * Authentication Context for Education Expense Dashboard
 * 
 * This context provides:
 * - User authentication state
 * - Login/logout functionality
 * - Token management
 * - Demo mode support
 * - Google OAuth integration
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';
import { logger } from '../utils/logger';

// Initial state
const initialState = {
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  tokens: null,
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER',
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
        error: null,
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        loading: false,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize authentication on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      // Check for demo mode first
      const demoToken = localStorage.getItem('demo_access_token');
      const demoUser = localStorage.getItem('demo_user');

      if (demoToken && demoUser) {
        // Restore demo session
        const userData = JSON.parse(demoUser);
        const demoTokens = {
          accessToken: demoToken,
          refreshToken: localStorage.getItem('demo_refresh_token'),
        };

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: userData,
            tokens: demoTokens,
          },
        });

        logger.info('Demo session restored', { userId: userData.id });
        return;
      }

      // Check if user is already authenticated (real backend)
      const token = authService.getAccessToken();
      if (!token) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return;
      }

      // Verify token and get user data from backend
      const userData = await authService.getCurrentUser();
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: userData });

      logger.info('User authentication initialized', { userId: userData.id });
    } catch (error) {
      logger.error('Authentication initialization failed', error);

      // Clear invalid tokens
      authService.clearTokens();
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Demo login (frontend-only, no backend required)
  const loginDemo = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      // Validate demo credentials
      if (credentials.username !== 'admin' || credentials.password !== '123456') {
        throw new Error('Invalid demo credentials. Use admin/123456');
      }

      // Create demo user data (frontend-only)
      const demoUser = {
        id: 'demo-user-123',
        email: 'demo@example.com',
        name: 'Demo User',
        isDemoAccount: true,
        avatar: null,
        preferences: {
          theme: 'system',
          language: 'vi',
          currency: 'VND',
        },
        createdAt: new Date().toISOString(),
      };

      // Create fake tokens for demo mode
      const demoTokens = {
        accessToken: 'demo-access-token-' + Date.now(),
        refreshToken: 'demo-refresh-token-' + Date.now(),
      };

      // Store demo tokens in localStorage
      localStorage.setItem('demo_access_token', demoTokens.accessToken);
      localStorage.setItem('demo_refresh_token', demoTokens.refreshToken);
      localStorage.setItem('demo_user', JSON.stringify(demoUser));

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: demoUser,
          tokens: demoTokens,
        },
      });

      logger.info('Demo login successful (frontend-only)', { userId: demoUser.id });
      return { user: demoUser, tokens: demoTokens };
    } catch (error) {
      logger.error('Demo login failed', error);
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: error.message || 'Demo login failed',
      });
      throw error;
    }
  };

  // Google OAuth login
  const loginWithGoogle = () => {
    try {
      // Redirect to Google OAuth
      window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`;
    } catch (error) {
      logger.error('Google OAuth redirect failed', error);
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: 'Failed to initiate Google login',
      });
    }
  };

  // Handle OAuth callback (called from URL params)
  const handleOAuthCallback = async (token, refreshToken) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      // Store tokens
      authService.setTokens({ accessToken: token, refreshToken });

      // Get user data
      const userData = await authService.getCurrentUser();
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: userData,
          tokens: { accessToken: token, refreshToken },
        },
      });

      logger.info('OAuth callback handled successfully', { userId: userData.id });
    } catch (error) {
      logger.error('OAuth callback handling failed', error);
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: 'Authentication failed',
      });
      authService.clearTokens();
    }
  };

  // Logout
  const logout = async () => {
    try {
      // Check if this is a demo session
      const isDemoSession = localStorage.getItem('demo_access_token');

      if (isDemoSession) {
        // Demo mode logout - just clear local storage
        localStorage.removeItem('demo_access_token');
        localStorage.removeItem('demo_refresh_token');
        localStorage.removeItem('demo_user');
        logger.info('Demo session logged out');
      } else {
        // Real backend logout
        await authService.logout();
        authService.clearTokens();
        logger.info('User logged out');
      }
    } catch (error) {
      logger.error('Logout API call failed', error);
      // Continue with local logout even if API fails
      authService.clearTokens();
    } finally {
      // Clear state
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await authService.updateProfile(profileData);
      dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: updatedUser });
      
      logger.info('User profile updated', { userId: updatedUser.id });
      return updatedUser;
    } catch (error) {
      logger.error('Profile update failed', error);
      throw error;
    }
  };

  // Refresh token
  const refreshToken = async () => {
    try {
      const refreshTokenValue = authService.getRefreshToken();
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken(refreshTokenValue);
      authService.setTokens(response.tokens);

      logger.info('Token refreshed successfully');
      return response.tokens;
    } catch (error) {
      logger.error('Token refresh failed', error);
      
      // If refresh fails, logout user
      logout();
      throw error;
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Check if user is demo account
  const isDemoAccount = () => {
    return state.user?.isDemoAccount || false;
  };

  // Context value
  const value = {
    // State
    user: state.user,
    loading: state.loading,
    error: state.error,
    isAuthenticated: state.isAuthenticated,
    tokens: state.tokens,

    // Actions
    loginDemo,
    loginWithGoogle,
    handleOAuthCallback,
    logout,
    updateProfile,
    refreshToken,
    clearError,

    // Utilities
    isDemoAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
