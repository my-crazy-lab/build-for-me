/**
 * Love Journey - Main App Component
 * 
 * Root component that sets up routing, global providers, and theme management
 * for the Love Journey application. Handles authentication state and provides
 * context for the entire application.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { RelationshipProvider } from './context/RelationshipContext';
import { LanguageProvider } from './context/LanguageContext';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Layout from './components/layout/Layout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import Dashboard from './pages/Dashboard';
import Timeline from './pages/Timeline';
import Goals from './pages/Goals';
import PlanningBoard from './pages/PlanningBoard';
import MemoryVault from './pages/MemoryVault';
import EmotionTracker from './pages/EmotionTracker';
import TimeCapsule from './pages/TimeCapsule';
import HealthCheckins from './pages/HealthCheckins';
import Calendar from './pages/Calendar';
import PrivateVault from './pages/PrivateVault';
import GrowthTracker from './pages/GrowthTracker';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Hooks
import { useAuth } from './hooks/useAuth';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-romantic">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />}
        />
        <Route path="/auth/callback" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="goals" element={<Goals />} />
            <Route path="planning" element={<PlanningBoard />} />
            <Route path="memories" element={<MemoryVault />} />
            <Route path="emotions" element={<EmotionTracker />} />
            <Route path="time-capsule" element={<TimeCapsule />} />
            <Route path="checkins" element={<HealthCheckins />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="vault" element={<PrivateVault />} />
            <Route path="growth" element={<GrowthTracker />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
        
        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <RelationshipProvider>
              <AppContent />
            </RelationshipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
