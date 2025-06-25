/**
 * Love Journey - Authentication Context
 *
 * Comprehensive authentication context with user management,
 * relationship data, and secure token handling.
 *
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock auth service for demo purposes
const authService = {
  login: async (email, password) => {
    // Demo login logic
    if (email === 'admin' && password === '123456') {
      const user = {
        id: '1',
        name: 'Demo User',
        email: 'admin@lovejourney.app',
        partner: {
          id: '2',
          name: 'Demo Partner',
          email: 'partner@lovejourney.app'
        },
        relationshipStartDate: '2023-01-01'
      };
      localStorage.setItem('auth_token', 'demo_token');
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, error: 'Invalid credentials' };
  },

  logout: async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    return { success: true };
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');

    if (token && user) {
      return { success: true, user: JSON.parse(user) };
    }
    return { success: false };
  },

  clearAuth: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  updateStoredUser: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      authService.clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);

      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    authService.updateStoredUser(userData);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    setLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
