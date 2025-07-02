/**
 * Authentication Context for Reviewly Application
 * 
 * This context provides authentication state management throughout the application.
 * It handles both Google OAuth integration and fake login mode for demo/testing purposes.
 * The context manages user authentication state, login/logout functionality, and
 * provides user information to components that need it.
 * 
 * Features:
 * - Google OAuth integration
 * - Fake login mode (admin:123456)
 * - Persistent authentication state
 * - Loading states
 * - Error handling
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { User, ApiResponse } from '../types';
import { UserRole, ThemeMode } from '../types';

// Authentication state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

// Authentication actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: User };

// Authentication context interface
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (user: User) => void;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,
};

// Authentication reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...initialState,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo purposes
const createMockUser = (email: string, role: UserRole = UserRole.EMPLOYEE): User => ({
  id: `user_${Date.now()}`,
  email,
  name: email === 'admin@reviewly.com' ? 'Admin User' : 'Demo User',
  role,
  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=6366f1&color=fff`,
  department: role === UserRole.ADMIN ? 'Administration' : 'Engineering',
  position: role === UserRole.ADMIN ? 'System Administrator' : 'Software Engineer',
  companies: [
    {
      companyId: 'company_demo',
      companyName: 'Demo Company',
      role,
      department: role === UserRole.ADMIN ? 'Administration' : 'Engineering',
      position: role === UserRole.ADMIN ? 'System Administrator' : 'Software Engineer',
      startDate: new Date('2023-01-01'),
      isActive: true,
    },
  ],
  preferences: {
    language: 'en',
    theme: ThemeMode.AUTO,
    notifications: {
      email: true,
      inApp: true,
      reviewDeadlines: true,
      feedbackReceived: true,
      milestones: true,
    },
    timezone: 'UTC',
  },
  isActive: true,
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date(),
});

// Mock authentication service
const mockAuthService = {
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Demo credentials
    if (email === 'admin@reviewly.com' && password === '123456') {
      const user = createMockUser(email, UserRole.ADMIN);
      const token = `mock_token_${Date.now()}`;
      return {
        success: true,
        data: { user, token },
        message: 'Login successful',
      };
    }

    if (email === 'demo@reviewly.com' && password === 'demo123') {
      const user = createMockUser(email, UserRole.EMPLOYEE);
      const token = `mock_token_${Date.now()}`;
      return {
        success: true,
        data: { user, token },
        message: 'Login successful',
      };
    }

    if (email === 'manager@reviewly.com' && password === 'manager123') {
      const user = createMockUser(email, UserRole.MANAGER);
      const token = `mock_token_${Date.now()}`;
      return {
        success: true,
        data: { user, token },
        message: 'Login successful',
      };
    }

    if (email === 'hr@reviewly.com' && password === 'hr123') {
      const user = createMockUser(email, UserRole.HR);
      const token = `mock_token_${Date.now()}`;
      return {
        success: true,
        data: { user, token },
        message: 'Login successful',
      };
    }

    return {
      success: false,
      error: 'Invalid credentials. Try admin@reviewly.com:123456 or demo@reviewly.com:demo123',
    };
  },

  async loginWithGoogle(): Promise<ApiResponse<{ user: User; token: string }>> {
    // Simulate Google OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo purposes, create a mock Google user
    const user = createMockUser('google.user@gmail.com', UserRole.EMPLOYEE);
    const token = `google_mock_token_${Date.now()}`;

    return {
      success: true,
      data: { user, token },
      message: 'Google login successful',
    };
  },

  async validateToken(token: string): Promise<ApiResponse<User>> {
    // Simulate token validation
    await new Promise(resolve => setTimeout(resolve, 500));

    if (token.startsWith('mock_token_') || token.startsWith('google_mock_token_')) {
      // Extract user info from stored data or create a default user
      const user = createMockUser('restored@reviewly.com', UserRole.EMPLOYEE);
      return {
        success: true,
        data: user,
        message: 'Token valid',
      };
    }

    return {
      success: false,
      error: 'Invalid token',
    };
  },
};

// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'reviewly_auth_token',
  USER: 'reviewly_user',
} as const;

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize authentication state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

      if (storedToken && storedUser) {
        dispatch({ type: 'AUTH_START' });

        try {
          // Validate stored token
          const response = await mockAuthService.validateToken(storedToken);

          if (response.success && response.data) {
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                user: response.data,
                token: storedToken,
              },
            });
          } else {
            // Clear invalid stored data
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            dispatch({ type: 'AUTH_FAILURE', payload: 'Session expired' });
          }
        } catch (error) {
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          dispatch({ type: 'AUTH_FAILURE', payload: 'Authentication error' });
        }
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await mockAuthService.login(email, password);

      if (response.success && response.data) {
        const { user, token } = response.data;

        // Store authentication data
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token },
        });
      } else {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: response.error || 'Login failed',
        });
      }
    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: 'Network error. Please try again.',
      });
    }
  };

  // Google login function
  const loginWithGoogle = async (): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      // TODO: Implement actual Google OAuth integration
      const response = await mockAuthService.loginWithGoogle();

      if (response.success && response.data) {
        const { user, token } = response.data;

        // Store authentication data
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token },
        });
      } else {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: response.error || 'Google login failed',
        });
      }
    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: 'Google login error. Please try again.',
      });
    }
  };

  // Logout function
  const logout = (): void => {
    // Clear stored authentication data
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);

    dispatch({ type: 'LOGOUT' });
  };

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Update user function
  const updateUser = (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    loginWithGoogle,
    logout,
    clearError,
    updateUser,
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

// HOC for protected routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: UserRole[]
) => {
  return (props: P) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
      return <div>Loading...</div>; // TODO: Replace with proper loading component
    }

    if (!isAuthenticated || !user) {
      return <div>Please log in to access this page.</div>; // TODO: Redirect to login
    }

    if (requiredRoles && !requiredRoles.includes(user.role)) {
      return <div>You don't have permission to access this page.</div>; // TODO: Proper error page
    }

    return <Component {...props} />;
  };
};

export default AuthContext;
