/**
 * Logging utility using Winston
 * 
 * This module provides structured logging for the application with:
 * - Different log levels (error, warn, info, debug)
 * - File and console transports
 * - JSON formatting for production
 * - Colorized output for development
 * - Log rotation and archiving
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which level to log based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? '\n' + info.stack : ''}`
  )
);

// Define format for file logs (no colors)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: format,
    level: level(),
  }),
];

// Add file transports in production or when LOG_FILE is specified
if (process.env.NODE_ENV === 'production' || process.env.LOG_FILE) {
  const logDir = path.join(__dirname, '../../logs');
  
  // Error log file
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );

  // Combined log file
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format: fileFormat,
  transports,
  exitOnError: false,
});

// Create a stream object for Morgan HTTP logging
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

/**
 * Log an error with additional context
 * @param {string} message - Error message
 * @param {Error} error - Error object
 * @param {Object} context - Additional context
 */
logger.logError = (message, error = null, context = {}) => {
  const errorInfo = {
    message,
    ...context,
  };

  if (error) {
    errorInfo.error = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  logger.error(errorInfo);
};

/**
 * Log API request information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {number} duration - Request duration in ms
 */
logger.logRequest = (req, res, duration) => {
  const logData = {
    method: req.method,
    url: req.originalUrl,
    statusCode: res.statusCode,
    duration: `${duration}ms`,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  };

  if (req.user) {
    logData.userId = req.user.id;
  }

  if (res.statusCode >= 400) {
    logger.warn('HTTP Request', logData);
  } else {
    logger.info('HTTP Request', logData);
  }
};

/**
 * Log security events
 * @param {string} event - Security event type
 * @param {Object} details - Event details
 * @param {Object} req - Express request object
 */
logger.logSecurity = (event, details = {}, req = null) => {
  const securityLog = {
    event,
    timestamp: new Date().toISOString(),
    ...details,
  };

  if (req) {
    securityLog.ip = req.ip;
    securityLog.userAgent = req.get('User-Agent');
    securityLog.url = req.originalUrl;
    
    if (req.user) {
      securityLog.userId = req.user.id;
    }
  }

  logger.warn('SECURITY EVENT', securityLog);
};

/**
 * Log database operations
 * @param {string} operation - Database operation
 * @param {string} collection - Collection name
 * @param {Object} details - Operation details
 */
logger.logDatabase = (operation, collection, details = {}) => {
  logger.debug('Database Operation', {
    operation,
    collection,
    ...details,
    timestamp: new Date().toISOString(),
  });
};

export { logger };
