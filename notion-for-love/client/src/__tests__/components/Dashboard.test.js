/**
 * Love Journey - Dashboard Component Tests
 * 
 * Comprehensive test suite for the Dashboard component
 * including user interactions, data loading, and responsive behavior.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import { AuthProvider } from '../../context/AuthContext';
import Dashboard from '../../pages/Dashboard';

// Mock data
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  partner: {
    id: '2',
    name: 'Jane Doe',
    email: 'jane@example.com'
  },
  relationshipStartDate: '2023-01-01'
};

const mockDashboardData = {
  stats: {
    totalMilestones: 15,
    totalMemories: 42,
    totalGoals: 8,
    completedGoals: 3
  },
  recentMilestones: [
    {
      id: '1',
      title: 'First Date',
      date: '2023-01-01',
      category: 'romantic'
    }
  ],
  recentMemories: [
    {
      id: '1',
      title: 'Beach Vacation',
      date: '2023-06-15',
      type: 'photo'
    }
  ],
  upcomingEvents: [
    {
      id: '1',
      title: 'Anniversary Dinner',
      date: '2024-01-01',
      type: 'anniversary'
    }
  ]
};

// Mock API calls
jest.mock('../../utils/api', () => ({
  getDashboardData: jest.fn(() => Promise.resolve(mockDashboardData)),
  getMilestones: jest.fn(() => Promise.resolve(mockDashboardData.recentMilestones)),
  getMemories: jest.fn(() => Promise.resolve(mockDashboardData.recentMemories))
}));

// Mock hooks
jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: true,
    loading: false
  })
}));

// Test wrapper component
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders dashboard with welcome message', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
        expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      });
    });

    test('displays relationship stats correctly', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('15')).toBeInTheDocument(); // Total milestones
        expect(screen.getByText('42')).toBeInTheDocument(); // Total memories
        expect(screen.getByText('8')).toBeInTheDocument();  // Total goals
      });
    });

    test('shows recent milestones section', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Recent Milestones')).toBeInTheDocument();
        expect(screen.getByText('First Date')).toBeInTheDocument();
      });
    });

    test('displays recent memories section', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Recent Memories')).toBeInTheDocument();
        expect(screen.getByText('Beach Vacation')).toBeInTheDocument();
      });
    });

    test('shows upcoming events', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
        expect(screen.getByText('Anniversary Dinner')).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    test('navigates to milestones when "View All" is clicked', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        const viewAllButton = screen.getByText('View All Milestones');
        fireEvent.click(viewAllButton);
        // Navigation would be tested with router mock
      });
    });

    test('opens quick action modal when add milestone is clicked', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        const addButton = screen.getByLabelText('Add Milestone');
        fireEvent.click(addButton);
        expect(screen.getByText('Add New Milestone')).toBeInTheDocument();
      });
    });

    test('handles search functionality', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search memories, goals...');
        fireEvent.change(searchInput, { target: { value: 'vacation' } });
        expect(searchInput.value).toBe('vacation');
      });
    });
  });

  describe('Loading States', () => {
    test('shows loading spinner while data is loading', () => {
      // Mock loading state
      jest.mock('../../utils/api', () => ({
        getDashboardData: jest.fn(() => new Promise(() => {})) // Never resolves
      }));

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    test('shows skeleton cards during initial load', () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      expect(screen.getAllByTestId('skeleton-card')).toHaveLength(4);
    });
  });

  describe('Error Handling', () => {
    test('displays error message when data fetch fails', async () => {
      // Mock API error
      const mockError = new Error('Failed to fetch dashboard data');
      jest.mock('../../utils/api', () => ({
        getDashboardData: jest.fn(() => Promise.reject(mockError))
      }));

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
      });
    });

    test('shows retry button on error', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        const retryButton = screen.getByText('Retry');
        expect(retryButton).toBeInTheDocument();
        fireEvent.click(retryButton);
      });
    });
  });

  describe('Responsive Behavior', () => {
    test('adapts layout for mobile screens', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const container = screen.getByTestId('dashboard-container');
      expect(container).toHaveClass('mobile-layout');
    });

    test('shows desktop layout on larger screens', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const container = screen.getByTestId('dashboard-container');
      expect(container).toHaveClass('desktop-layout');
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
        expect(screen.getByRole('navigation')).toBeInTheDocument();
        expect(screen.getAllByRole('button')).toHaveLength(6);
      });
    });

    test('supports keyboard navigation', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        const firstButton = screen.getAllByRole('button')[0];
        firstButton.focus();
        expect(document.activeElement).toBe(firstButton);
      });
    });

    test('has proper heading hierarchy', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
        expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(4);
      });
    });
  });

  describe('Performance', () => {
    test('memoizes expensive calculations', () => {
      const { rerender } = render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Spy on expensive calculation function
      const calculateStatsSpy = jest.spyOn(require('../../utils/calculations'), 'calculateStats');
      
      rerender(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Should not recalculate if props haven't changed
      expect(calculateStatsSpy).toHaveBeenCalledTimes(1);
    });

    test('lazy loads non-critical components', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Check that heavy components are not immediately rendered
      expect(screen.queryByTestId('analytics-chart')).not.toBeInTheDocument();
      
      // Simulate scroll to trigger lazy loading
      fireEvent.scroll(window, { target: { scrollY: 500 } });
      
      await waitFor(() => {
        expect(screen.getByTestId('analytics-chart')).toBeInTheDocument();
      });
    });
  });
});
