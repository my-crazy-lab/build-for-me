/**
 * Frontend Logger Utility
 * 
 * This utility provides structured logging for the frontend:
 * - Different log levels
 * - Structured log format
 * - Development vs production behavior
 * - Error tracking
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

// Current log level based on environment
const CURRENT_LOG_LEVEL = import.meta.env.DEV ? LOG_LEVELS.DEBUG : LOG_LEVELS.WARN;

// Colors for console output
const LOG_COLORS = {
  ERROR: '#ff4444',
  WARN: '#ffaa00',
  INFO: '#00aa00',
  DEBUG: '#0088cc',
};

class Logger {
  constructor() {
    this.sessionId = this.generateSessionId();
  }

  /**
   * Generate unique session ID
   * @returns {string} Session ID
   */
  generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Format log message
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} context - Additional context
   * @returns {Object} Formatted log entry
   */
  formatLog(level, message, context = {}) {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...context,
    };
  }

  /**
   * Check if log level should be output
   * @param {string} level - Log level
   * @returns {boolean} Should log
   */
  shouldLog(level) {
    return LOG_LEVELS[level] <= CURRENT_LOG_LEVEL;
  }

  /**
   * Output log to console
   * @param {string} level - Log level
   * @param {Object} logEntry - Formatted log entry
   */
  outputToConsole(level, logEntry) {
    const color = LOG_COLORS[level];
    const prefix = `%c[${level}]`;
    const style = `color: ${color}; font-weight: bold;`;

    switch (level) {
      case 'ERROR':
        console.error(prefix, style, logEntry.message, logEntry);
        break;
      case 'WARN':
        console.warn(prefix, style, logEntry.message, logEntry);
        break;
      case 'INFO':
        console.info(prefix, style, logEntry.message, logEntry);
        break;
      case 'DEBUG':
        console.debug(prefix, style, logEntry.message, logEntry);
        break;
      default:
        console.log(prefix, style, logEntry.message, logEntry);
    }
  }

  /**
   * Send log to external service (placeholder)
   * @param {Object} logEntry - Formatted log entry
   */
  sendToExternalService(logEntry) {
    // TODO: Implement external logging service integration
    // This could send logs to services like LogRocket, Sentry, etc.
    
    // For now, only send errors in production
    if (logEntry.level === 'ERROR' && !import.meta.env.DEV) {
      // Example: Send to error tracking service
      // errorTrackingService.captureException(logEntry);
    }
  }

  /**
   * Log error message
   * @param {string} message - Error message
   * @param {Error|Object} error - Error object or additional context
   * @param {Object} context - Additional context
   */
  error(message, error = null, context = {}) {
    if (!this.shouldLog('ERROR')) return;

    const logContext = { ...context };
    
    if (error instanceof Error) {
      logContext.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    } else if (error) {
      logContext.error = error;
    }

    const logEntry = this.formatLog('ERROR', message, logContext);
    this.outputToConsole('ERROR', logEntry);
    this.sendToExternalService(logEntry);
  }

  /**
   * Log warning message
   * @param {string} message - Warning message
   * @param {Object} context - Additional context
   */
  warn(message, context = {}) {
    if (!this.shouldLog('WARN')) return;

    const logEntry = this.formatLog('WARN', message, context);
    this.outputToConsole('WARN', logEntry);
    this.sendToExternalService(logEntry);
  }

  /**
   * Log info message
   * @param {string} message - Info message
   * @param {Object} context - Additional context
   */
  info(message, context = {}) {
    if (!this.shouldLog('INFO')) return;

    const logEntry = this.formatLog('INFO', message, context);
    this.outputToConsole('INFO', logEntry);
    this.sendToExternalService(logEntry);
  }

  /**
   * Log debug message
   * @param {string} message - Debug message
   * @param {Object} context - Additional context
   */
  debug(message, context = {}) {
    if (!this.shouldLog('DEBUG')) return;

    const logEntry = this.formatLog('DEBUG', message, context);
    this.outputToConsole('DEBUG', logEntry);
  }

  /**
   * Log user action
   * @param {string} action - Action name
   * @param {Object} details - Action details
   */
  logUserAction(action, details = {}) {
    this.info(`User action: ${action}`, {
      action,
      details,
      category: 'user_action',
    });
  }

  /**
   * Log performance metric
   * @param {string} metric - Metric name
   * @param {number} value - Metric value
   * @param {Object} context - Additional context
   */
  logPerformance(metric, value, context = {}) {
    this.info(`Performance: ${metric}`, {
      metric,
      value,
      unit: context.unit || 'ms',
      category: 'performance',
      ...context,
    });
  }

  /**
   * Log API call
   * @param {string} method - HTTP method
   * @param {string} url - API endpoint
   * @param {number} status - Response status
   * @param {number} duration - Request duration
   * @param {Object} context - Additional context
   */
  logApiCall(method, url, status, duration, context = {}) {
    const level = status >= 400 ? 'ERROR' : 'DEBUG';
    const message = `API ${method} ${url} - ${status} (${duration}ms)`;
    
    this[level.toLowerCase()](message, {
      method,
      url,
      status,
      duration,
      category: 'api_call',
      ...context,
    });
  }

  /**
   * Start performance timer
   * @param {string} label - Timer label
   * @returns {Function} End timer function
   */
  startTimer(label) {
    const startTime = performance.now();
    
    return (context = {}) => {
      const duration = performance.now() - startTime;
      this.logPerformance(label, Math.round(duration), context);
      return duration;
    };
  }
}

// Create and export singleton instance
export const logger = new Logger();
export default logger;
