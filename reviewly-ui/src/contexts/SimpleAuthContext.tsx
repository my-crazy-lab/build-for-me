/**
 * Simple Authentication Context for Reviewly Application
 * 
 * A simplified version of the auth context that works without complex enum imports.
 * This provides basic authentication functionality with mock users.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Simple user interface
interface SimpleUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  department?: string;
  position?: string;
}

// Auth state interface
interface AuthState {
  user: SimpleUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth context interface
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'reviewly_auth_token',
  USER: 'reviewly_user',
} as const;

// Mock users for demo
const mockUsers: Record<string, { password: string; user: SimpleUser }> = {
  'admin@reviewly.com': {
    password: '123456',
    user: {
      id: 'user_admin',
      email: 'admin@reviewly.com',
      name: 'Admin User',
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff',
      department: 'Administration',
      position: 'System Administrator',
    },
  },
  'demo@reviewly.com': {
    password: 'demo123',
    user: {
      id: 'user_demo',
      email: 'demo@reviewly.com',
      name: 'Demo User',
      role: 'employee',
      avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=6366f1&color=fff',
      department: 'Engineering',
      position: 'Software Engineer',
    },
  },
  'manager@reviewly.com': {
    password: 'manager123',
    user: {
      id: 'user_manager',
      email: 'manager@reviewly.com',
      name: 'Manager User',
      role: 'manager',
      avatar: 'https://ui-avatars.com/api/?name=Manager+User&background=6366f1&color=fff',
      department: 'Engineering',
      position: 'Engineering Manager',
    },
  },
  'hr@reviewly.com': {
    password: 'hr123',
    user: {
      id: 'user_hr',
      email: 'hr@reviewly.com',
      name: 'HR User',
      role: 'hr',
      avatar: 'https://ui-avatars.com/api/?name=HR+User&background=6366f1&color=fff',
      department: 'Human Resources',
      position: 'HR Manager',
    },
  },
};

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

      if (storedToken && storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          // Clear invalid stored data
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUser = mockUsers[email];
    if (mockUser && mockUser.password === password) {
      const token = `mock_token_${Date.now()}`;
      
      // Store authentication data
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser.user));

      setState({
        user: mockUser.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } else {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Invalid credentials. Try admin@reviewly.com:123456 or demo@reviewly.com:demo123',
      });
    }
  };

  // Logout function
  const logout = (): void => {
    // Clear stored authentication data
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);

    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  // Clear error function
  const clearError = (): void => {
    setState(prev => ({ ...prev, error: null }));
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
