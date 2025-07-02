/**
 * Unauthorized Page Component for Reviewly Application
 * 
 * This component displays a user-friendly error page when users attempt to access
 * resources they don't have permission for. It provides clear information about
 * the access requirements and helpful actions the user can take.
 * 
 * Features:
 * - Clear error messaging
 * - Role and permission information
 * - Helpful action buttons
 * - Beautiful animations
 * - Responsive design
 * - Accessibility support
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { UserRole, Permission } from '../../types';
import './UnauthorizedPage.css';

interface UnauthorizedPageProps {
  requiredRoles?: UserRole[];
  requiredPermissions?: Permission[];
  userRole?: UserRole;
  title?: string;
  message?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showContactSupport?: boolean;
}

const UnauthorizedPage: React.FC<UnauthorizedPageProps> = ({
  requiredRoles = [],
  requiredPermissions = [],
  userRole,
  title = 'Access Denied',
  message,
  showBackButton = true,
  showHomeButton = true,
  showContactSupport = true,
}) => {
  const navigate = useNavigate();

  // Generate default message based on requirements
  const getDefaultMessage = (): string => {
    if (requiredRoles.length > 0) {
      const roleNames = requiredRoles.map(role => formatRoleName(role)).join(', ');
      return `This page requires ${roleNames} access. Your current role (${formatRoleName(userRole || 'unknown')}) doesn't have sufficient permissions.`;
    }

    if (requiredPermissions.length > 0) {
      return `You don't have the required permissions to access this page. Please contact your administrator if you believe this is an error.`;
    }

    return 'You don\'t have permission to access this page. Please contact your administrator for assistance.';
  };

  const displayMessage = message || getDefaultMessage();

  // Format role names for display
  function formatRoleName(role: string): string {
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    },
  };

  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        delay: 0.2,
        duration: 0.6,
        type: "spring" as const,
        stiffness: 200
      }
    },
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.4, duration: 0.3 }
    },
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleContactSupport = () => {
    // TODO: Implement contact support functionality
    // This could open a modal, navigate to a support page, or open email client
    window.location.href = 'mailto:support@reviewly.com?subject=Access Request&body=I need access to a restricted page.';
  };

  return (
    <div className="unauthorized-page">
      <motion.div
        className="unauthorized-container"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Error Icon */}
        <motion.div
          className="unauthorized-icon"
          variants={iconVariants}
          initial="initial"
          animate="animate"
        >
          🔒
        </motion.div>

        {/* Title */}
        <motion.h1
          className="unauthorized-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {title}
        </motion.h1>

        {/* Message */}
        <motion.p
          className="unauthorized-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {displayMessage}
        </motion.p>

        {/* Requirements Info */}
        {(requiredRoles.length > 0 || requiredPermissions.length > 0) && (
          <motion.div
            className="requirements-info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            {requiredRoles.length > 0 && (
              <div className="requirement-item">
                <strong>Required Roles:</strong>
                <div className="requirement-tags">
                  {requiredRoles.map(role => (
                    <span key={role} className="requirement-tag role-tag">
                      {formatRoleName(role)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {requiredPermissions.length > 0 && (
              <div className="requirement-item">
                <strong>Required Permissions:</strong>
                <div className="requirement-tags">
                  {requiredPermissions.map(permission => (
                    <span key={permission} className="requirement-tag permission-tag">
                      {formatRoleName(permission)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {userRole && (
              <div className="requirement-item">
                <strong>Your Current Role:</strong>
                <span className="requirement-tag current-role-tag">
                  {formatRoleName(userRole)}
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          className="unauthorized-actions"
          variants={buttonVariants}
          initial="initial"
          animate="animate"
        >
          {showBackButton && (
            <motion.button
              className="action-button secondary"
              onClick={handleGoBack}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="button-icon">←</span>
              Go Back
            </motion.button>
          )}

          {showHomeButton && (
            <motion.button
              className="action-button primary"
              onClick={handleGoHome}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="button-icon">🏠</span>
              Go Home
            </motion.button>
          )}

          {showContactSupport && (
            <motion.button
              className="action-button outline"
              onClick={handleContactSupport}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="button-icon">📧</span>
              Contact Support
            </motion.button>
          )}
        </motion.div>

        {/* Help Text */}
        <motion.div
          className="unauthorized-help"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p>
            If you believe you should have access to this page, please contact your administrator
            or use the "Contact Support" button above.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UnauthorizedPage;
