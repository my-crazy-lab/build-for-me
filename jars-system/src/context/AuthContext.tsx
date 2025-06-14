import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type User, type UserPreferences, DEFAULT_JAR_ALLOCATIONS } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Create demo user if it doesn't exist
    const users = JSON.parse(localStorage.getItem('jars_users') || '[]');
    const demoUser = users.find((u: any) => u.email === 'demo@example.com');

    if (!demoUser) {
      const newDemoUser = {
        id: 'demo-user',
        email: 'demo@example.com',
        name: 'Demo User',
        password: 'password',
        createdAt: new Date(),
        preferences: {
          language: 'en',
          theme: 'light',
          currency: 'USD',
          jarAllocations: DEFAULT_JAR_ALLOCATIONS,
        },
      };
      users.push(newDemoUser);
      localStorage.setItem('jars_users', JSON.stringify(users));
    }

    // Check for existing user in localStorage
    const savedUser = localStorage.getItem('jars_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('jars_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('jars_users') || '[]');
    const existingUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (existingUser) {
      const { password: _, ...userWithoutPassword } = existingUser;
      console.log('Login successful, setting user:', userWithoutPassword);
      setUser(userWithoutPassword);
      localStorage.setItem('jars_user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('jars_users') || '[]');
    const existingUser = users.find((u: any) => u.email === email);
    
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      createdAt: new Date(),
      preferences: {
        language: 'en',
        theme: 'light',
        currency: 'USD',
        jarAllocations: DEFAULT_JAR_ALLOCATIONS,
      },
    };
    
    // Save to localStorage
    const userWithPassword = { ...newUser, password };
    users.push(userWithPassword);
    localStorage.setItem('jars_users', JSON.stringify(users));
    localStorage.setItem('jars_user', JSON.stringify(newUser));
    
    setUser(newUser);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jars_user');
  };

  const updatePreferences = (preferences: Partial<UserPreferences>) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        ...preferences,
      },
    };
    
    setUser(updatedUser);
    localStorage.setItem('jars_user', JSON.stringify(updatedUser));
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('jars_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], preferences: updatedUser.preferences };
      localStorage.setItem('jars_users', JSON.stringify(users));
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updatePreferences,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
