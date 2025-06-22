import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './components/auth/LoginPage';
import Layout from './components/layout/Layout';
import DashboardPage from './components/dashboard/DashboardPage';
import GoalsPage from './components/goals/GoalsPage';
import TimeTrackingPage from './components/time/TimeTrackingPage';
import WeeklyReviewPage from './components/review/WeeklyReviewPage';
import SettingsPage from './components/settings/SettingsPage';
import { initializeSampleData } from './data/sampleData';

function AppContent() {
  const { state } = useApp();
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    // Initialize sample data when the app loads
    initializeSampleData();
  }, []);

  if (!state.user) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'goals':
        return <GoalsPage />;
      case 'time':
        return <TimeTrackingPage />;
      case 'review':
        return <WeeklyReviewPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
