/**
 * Main App Component for Reviewly Application
 *
 * This is the root component that sets up the application structure,
 * providers, routing, and global layout. It includes theme management,
 * authentication context, and the main application shell.
 *
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/SimpleThemeContext';
import { AuthProvider } from './contexts/SimpleAuthContext';
import LoginForm from './components/auth/LoginForm';
import SimpleDashboard from './pages/SimpleDashboard';
import SelfReviewPage from './pages/SelfReviewPage';
import GoalsPage from './pages/GoalsPage';
import FeedbackPage from './pages/FeedbackPage';
import TemplatesPage from './pages/TemplatesPage';
import IntegrationsPage from './pages/IntegrationsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SearchPage from './pages/SearchPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import SimpleThemeToggle from './components/common/SimpleThemeToggle';
import LanguageSelector from './components/common/LanguageSelector';
import MobileNavigation from './components/navigation/MobileNavigation';
import NotificationBell from './components/notifications/NotificationBell';
import { NotificationProvider } from './contexts/NotificationContext';
import { initResponsiveUtils } from './utils/responsive';
import './i18n'; // Initialize i18n
import './App.css';

function App() {
  // Initialize responsive utilities
  useEffect(() => {
    const cleanup = initResponsiveUtils();
    return cleanup;
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider userId="current-user">
          <Router>
            <div className="app">
            {/* Mobile Navigation */}
            <MobileNavigation />

            {/* Global Controls - positioned in top right */}
            <div className="app-controls">
              <NotificationBell size="medium" />
              <LanguageSelector compact />
              <SimpleThemeToggle variant="button" size="medium" />
            </div>

            {/* Main Application Routes */}
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={<SimpleDashboard />}
              />
              <Route
                path="/self-review"
                element={<SelfReviewPage />}
              />
              <Route
                path="/goals"
                element={<GoalsPage />}
              />
              <Route
                path="/feedback"
                element={<FeedbackPage />}
              />
              <Route
                path="/templates"
                element={<TemplatesPage />}
              />
              <Route
                path="/integrations"
                element={<IntegrationsPage />}
              />
              <Route
                path="/analytics"
                element={<AnalyticsPage />}
              />
              <Route
                path="/search"
                element={<SearchPage />}
              />
              <Route
                path="/notifications"
                element={<NotificationsPage />}
              />
              <Route
                path="/profile"
                element={<ProfilePage />}
              />

              {/* Default redirect to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Login page component
const LoginPage: React.FC = () => {
  return (
    <div className="login-page">
      <LoginForm onSuccess={() => window.location.href = '/dashboard'} />
    </div>
  );
};

export default App;
