/**
 * Protected Route Component for Reviewly Application
 * 
 * This component provides route protection based on authentication status and user roles.
 * It handles redirecting unauthenticated users to login and unauthorized users to
 * appropriate error pages. The component also displays loading states during
 * authentication checks.
 * 
 * Features:
 * - Authentication requirement
 * - Role-based access control
 * - Permission-based access control
 * - Loading states
 * - Automatic redirects
 * - Error handling
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole, Permission } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';
import UnauthorizedPage from '../common/UnauthorizedPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: Permission[];
  fallbackPath?: string;
  showUnauthorized?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  fallbackPath = '/login',
  showUnauthorized = true,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="protected-route-loading">
        <LoadingSpinner size="large" message="Checking authentication..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={fallbackPath}
        state={{ from: location }}
        replace
      />
    );
  }

  // Check role requirements
  const hasRequiredRole = requiredRoles.length === 0 || requiredRoles.includes(user.role);

  // Check permission requirements (simplified for demo)
  // TODO: Implement proper permission checking system
  const hasRequiredPermissions = requiredPermissions.length === 0 || checkUserPermissions(user, requiredPermissions);

  // Show unauthorized page or redirect if access is denied
  if (!hasRequiredRole || !hasRequiredPermissions) {
    if (showUnauthorized) {
      return (
        <UnauthorizedPage
          requiredRoles={requiredRoles}
          requiredPermissions={requiredPermissions}
          userRole={user.role}
        />
      );
    } else {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Render protected content with animation
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="protected-route-content"
    >
      {children}
    </motion.div>
  );
};

// Helper function to check user permissions
// This is a simplified implementation for demo purposes
function checkUserPermissions(user: any, requiredPermissions: Permission[]): boolean {
  // Admin users have all permissions
  if (user.role === 'admin' || user.role === 'super_admin') {
    return true;
  }

  // HR users have most permissions
  if (user.role === 'hr') {
    const hrPermissions = [
      'read_all_reviews',
      'view_analytics',
      'export_data',
      'manage_users',
    ];
    return requiredPermissions.every(permission => hrPermissions.includes(permission));
  }

  // Manager users have team-level permissions
  if (user.role === 'manager') {
    const managerPermissions = [
      'read_own_reviews',
      'write_own_reviews',
      'read_team_reviews',
      'write_team_reviews',
      'view_analytics',
    ];
    return requiredPermissions.every(permission => managerPermissions.includes(permission));
  }

  // Employee users have basic permissions
  if (user.role === 'employee') {
    const employeePermissions = [
      'read_own_reviews',
      'write_own_reviews',
    ];
    return requiredPermissions.every(permission => employeePermissions.includes(permission));
  }

  return false;
}

// Higher-order component for protecting routes
export const withProtectedRoute = (
  Component: React.ComponentType<any>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) => {
  return (props: any) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

// Hook for checking if user has specific permissions
export const usePermissions = () => {
  const { user } = useAuth();

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const hasPermission = (permission: Permission): boolean => {
    return user ? checkUserPermissions(user, [permission]) : false;
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return user ? permissions.some(permission => checkUserPermissions(user, [permission])) : false;
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return user ? checkUserPermissions(user, permissions) : false;
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin' || user?.role === 'super_admin';
  };

  const isManager = (): boolean => {
    return user?.role === 'manager' || isAdmin();
  };

  const isHR = (): boolean => {
    return user?.role === 'hr' || isAdmin();
  };

  return {
    user,
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    isManager,
    isHR,
  };
};

// Component for conditionally rendering content based on permissions
interface ConditionalRenderProps {
  children: React.ReactNode;
  roles?: UserRole[];
  permissions?: Permission[];
  fallback?: React.ReactNode;
  requireAll?: boolean; // If true, user must have ALL roles/permissions. If false, ANY is sufficient.
}

export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  children,
  roles = [],
  permissions = [],
  fallback = null,
  requireAll = true,
}) => {
  const { hasAnyRole, hasAllPermissions, hasAnyPermission } = usePermissions();

  const hasRoleAccess = roles.length === 0 || (requireAll ? roles.every(role => hasAnyRole([role])) : hasAnyRole(roles));
  const hasPermissionAccess = permissions.length === 0 || (requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions));

  const hasAccess = hasRoleAccess && hasPermissionAccess;

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default ProtectedRoute;
