/**
 * Love Journey - Protected Route Component
 *
 * Route protection component that ensures only authenticated users
 * can access protected pages with beautiful loading states.
 *
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const ProtectedRoute = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-neutral-50 to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <LoadingSpinner
          size="lg"
          variant="heart"
          text="Loading your love journey..."
        />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Save the attempted location for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
