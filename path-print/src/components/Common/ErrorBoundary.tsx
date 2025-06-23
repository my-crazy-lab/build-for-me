/**
 * Career Path Visualization - Error Boundary Component
 * 
 * This component provides error boundary functionality to catch and handle
 * JavaScript errors in the component tree, providing graceful error handling
 * and user-friendly error messages.
 * 
 * @fileoverview Error boundary for graceful error handling
 * @author Career Path Visualization Team
 * @version 1.0.0
 * 
 * MAINTAINER NOTES:
 * - Catches JavaScript errors anywhere in the child component tree
 * - Logs error details for debugging purposes
 * - Provides user-friendly error UI with recovery options
 * - Supports different error types with appropriate messaging
 * - Includes error reporting functionality for production use
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Props for the ErrorBoundary component
 */
interface ErrorBoundaryProps {
  /** Child components to wrap */
  children: ReactNode;
  /** Custom fallback component */
  fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
  /** Callback when error occurs */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Whether to show detailed error information */
  showDetails?: boolean;
}

/**
 * State for the ErrorBoundary component
 */
interface ErrorBoundaryState {
  /** Whether an error has occurred */
  hasError: boolean;
  /** The error that occurred */
  error: Error | null;
  /** Additional error information */
  errorInfo: ErrorInfo | null;
  /** Error ID for tracking */
  errorId: string;
}

// ============================================================================
// ERROR BOUNDARY COMPONENT
// ============================================================================

/**
 * Error boundary component that catches JavaScript errors in child components
 * and displays a fallback UI instead of crashing the entire application.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  /**
   * Static method called when an error occurs
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Generate unique error ID
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  /**
   * Called when an error occurs, used for logging and reporting
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Log error details
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }
  }

  /**
   * Report error to monitoring service
   */
  private reportError(error: Error, errorInfo: ErrorInfo) {
    // TODO: Implement error reporting to service like Sentry, LogRocket, etc.
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.log('Error report:', errorReport);
    // Send to monitoring service
  }

  /**
   * Reset error state to retry rendering
   */
  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
  };

  /**
   * Navigate to home page
   */
  private handleGoHome = () => {
    window.location.href = '/';
  };

  /**
   * Copy error details to clipboard
   */
  private handleCopyError = async () => {
    if (!this.state.error || !this.state.errorInfo) return;

    const errorDetails = `
Error ID: ${this.state.errorId}
Message: ${this.state.error.message}
Stack: ${this.state.error.stack}
Component Stack: ${this.state.errorInfo.componentStack}
Timestamp: ${new Date().toISOString()}
    `.trim();

    try {
      await navigator.clipboard.writeText(errorDetails);
      alert('Error details copied to clipboard');
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  };

  /**
   * Render error UI
   */
  private renderErrorUI() {
    const { error, errorInfo, errorId } = this.state;
    const { showDetails = false } = this.props;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4"
      >
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {/* Error Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertTriangle size={32} className="text-red-600 dark:text-red-400" />
            </div>
          </div>

          {/* Error Message */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>
          </div>

          {/* Error Details (if enabled) */}
          {showDetails && error && (
            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Error Details
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                ID: {errorId}
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 font-mono break-all">
                {error.message}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={this.handleRetry}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={16} className="mr-2" />
              Try Again
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={this.handleGoHome}
              className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <Home size={16} className="mr-2" />
              Go Home
            </motion.button>

            {showDetails && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={this.handleCopyError}
                className="w-full flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                <Bug size={16} className="mr-2" />
                Copy Error Details
              </motion.button>
            )}
          </div>

          {/* Support Information */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              If this problem continues, please contact support with error ID: {errorId}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback && this.state.error && this.state.errorInfo) {
        return this.props.fallback(this.state.error, this.state.errorInfo);
      }

      // Use default error UI
      return this.renderErrorUI();
    }

    // No error, render children normally
    return this.props.children;
  }
}

// ============================================================================
// FUNCTIONAL ERROR BOUNDARY HOOK
// ============================================================================

/**
 * Hook for handling errors in functional components
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { handleError, resetError };
}
