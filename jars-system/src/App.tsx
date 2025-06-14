import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { JarsProvider } from './context/JarsContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import IncomeManagement from './components/Income/IncomeManagement';
import ExpenseManagement from './components/Expenses/ExpenseManagement';
import JarSettings from './components/JarSettings/JarSettings';
import Reports from './components/Reports/Reports';
import Goals from './components/Goals/Goals';
import Settings from './components/Settings/Settings';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  console.log('PublicRoute - user:', user, 'isLoading:', isLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (user) {
    console.log('User is logged in, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <JarsProvider>
                <Layout>
                  <Dashboard />
                </Layout>
              </JarsProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/income"
          element={
            <ProtectedRoute>
              <JarsProvider>
                <Layout>
                  <IncomeManagement />
                </Layout>
              </JarsProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <JarsProvider>
                <Layout>
                  <ExpenseManagement />
                </Layout>
              </JarsProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jar-settings"
          element={
            <ProtectedRoute>
              <JarsProvider>
                <Layout>
                  <JarSettings />
                </Layout>
              </JarsProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <JarsProvider>
                <Layout>
                  <Reports />
                </Layout>
              </JarsProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <JarsProvider>
                <Layout>
                  <Goals />
                </Layout>
              </JarsProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <JarsProvider>
                <Layout>
                  <Settings />
                </Layout>
              </JarsProvider>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
};

export default App;
