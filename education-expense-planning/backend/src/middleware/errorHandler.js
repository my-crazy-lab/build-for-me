/**
 * Error handling middleware for Express application
 * 
 * This module provides:
 * - Global error handler for unhandled errors
 * - 404 Not Found handler
 * - Consistent error response format
 * - Error logging and monitoring
 * - Development vs production error details
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import { logger } from '../utils/logger.js';

/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle 404 Not Found errors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const notFound = (req, res, next) => {
  const error = new AppError(`Not found - ${req.originalUrl}`, 404, 'NOT_FOUND');
  next(error);
};

/**
 * Handle Mongoose validation errors
 * @param {Object} err - Mongoose validation error
 * @returns {AppError} Formatted error
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(val => val.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400, 'VALIDATION_ERROR');
};

/**
 * Handle Mongoose duplicate key errors
 * @param {Object} err - Mongoose duplicate key error
 * @returns {AppError} Formatted error
 */
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `${field} '${value}' already exists`;
  return new AppError(message, 400, 'DUPLICATE_FIELD');
};

/**
 * Handle Mongoose cast errors
 * @param {Object} err - Mongoose cast error
 * @returns {AppError} Formatted error
 */
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400, 'INVALID_ID');
};

/**
 * Handle JWT errors
 * @param {Object} err - JWT error
 * @returns {AppError} Formatted error
 */
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again.', 401, 'INVALID_TOKEN');
};

/**
 * Handle JWT expired errors
 * @param {Object} err - JWT expired error
 * @returns {AppError} Formatted error
 */
const handleJWTExpiredError = () => {
  return new AppError('Your token has expired. Please log in again.', 401, 'TOKEN_EXPIRED');
};

/**
 * Send error response in development mode
 * @param {Object} err - Error object
 * @param {Object} res - Express response object
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message,
      stack: err.stack,
      details: err,
    },
  });
};

/**
 * Send error response in production mode
 * @param {Object} err - Error object
 * @param {Object} res - Express response object
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code || 'OPERATION_ERROR',
        message: err.message,
      },
    });
  } else {
    // Programming or other unknown error: don't leak error details
    logger.error('ERROR', err);

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Something went wrong!',
      },
    });
  }
};

/**
 * Global error handling middleware
 * @param {Object} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Set default values
  error.statusCode = error.statusCode || 500;

  // Log error details
  logger.logError('Global Error Handler', err, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = handleCastError(error);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error = handleValidationError(error);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error = handleDuplicateKeyError(error);
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  // Send error response
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

/**
 * Async error handler wrapper
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Create and throw an AppError
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {string} code - Error code
 */
export const throwError = (message, statusCode = 500, code = null) => {
  throw new AppError(message, statusCode, code);
};
