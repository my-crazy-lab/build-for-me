import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { config } from '../config/config';

/**
 * Error Handler Middleware
 * 
 * Centralized error handling for the application.
 * Handles different types of errors and returns appropriate responses.
 */

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
  isOperational?: boolean;
}

/**
 * Custom error classes
 */
export class ValidationError extends Error implements ApiError {
  statusCode = 400;
  code = 'VALIDATION_ERROR';
  isOperational = true;

  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error implements ApiError {
  statusCode = 401;
  code = 'AUTHENTICATION_ERROR';
  isOperational = true;

  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error implements ApiError {
  statusCode = 403;
  code = 'AUTHORIZATION_ERROR';
  isOperational = true;

  constructor(message: string = 'Insufficient permissions') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends Error implements ApiError {
  statusCode = 404;
  code = 'NOT_FOUND';
  isOperational = true;

  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error implements ApiError {
  statusCode = 409;
  code = 'CONFLICT';
  isOperational = true;

  constructor(message: string = 'Resource conflict') {
    super(message);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends Error implements ApiError {
  statusCode = 429;
  code = 'RATE_LIMIT_EXCEEDED';
  isOperational = true;

  constructor(message: string = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class InternalServerError extends Error implements ApiError {
  statusCode = 500;
  code = 'INTERNAL_SERVER_ERROR';
  isOperational = false;

  constructor(message: string = 'Internal server error') {
    super(message);
    this.name = 'InternalServerError';
  }
}

/**
 * Error response interface
 */
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    stack?: string;
  };
  timestamp: string;
  path: string;
  method: string;
  correlationId?: string;
}

/**
 * Main error handler middleware
 */
export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    statusCode: error.statusCode,
    code: error.code,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: (req as any).user?.id,
    correlationId: (req as any).correlationId,
    details: error.details,
  };

  if (error.statusCode && error.statusCode < 500) {
    logger.warn('Client error occurred', errorInfo);
  } else {
    logger.error('Server error occurred', errorInfo);
  }

  // Determine status code
  const statusCode = error.statusCode || 500;

  // Determine error code
  const errorCode = error.code || 'UNKNOWN_ERROR';

  // Create error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: errorCode,
      message: error.message || 'An unexpected error occurred',
    },
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  };

  // Add correlation ID if available
  if ((req as any).correlationId) {
    errorResponse.correlationId = (req as any).correlationId;
  }

  // Add error details in development
  if (config.app.env === 'development') {
    if (error.details) {
      errorResponse.error.details = error.details;
    }
    if (error.stack) {
      errorResponse.error.stack = error.stack;
    }
  }

  // Handle specific error types
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    errorResponse.error.code = 'VALIDATION_ERROR';
    errorResponse.error.message = 'Invalid input data';
    if (config.app.env === 'development') {
      errorResponse.error.details = error.message;
    }
  }

  if (error.name === 'JsonWebTokenError') {
    errorResponse.error.code = 'INVALID_TOKEN';
    errorResponse.error.message = 'Invalid authentication token';
  }

  if (error.name === 'TokenExpiredError') {
    errorResponse.error.code = 'TOKEN_EXPIRED';
    errorResponse.error.message = 'Authentication token has expired';
  }

  if (error.name === 'MulterError') {
    errorResponse.error.code = 'FILE_UPLOAD_ERROR';
    errorResponse.error.message = 'File upload failed';
    if (config.app.env === 'development') {
      errorResponse.error.details = error.message;
    }
  }

  // Database errors
  if (error.code === '23505') { // PostgreSQL unique violation
    errorResponse.error.code = 'DUPLICATE_ENTRY';
    errorResponse.error.message = 'Resource already exists';
  }

  if (error.code === '23503') { // PostgreSQL foreign key violation
    errorResponse.error.code = 'FOREIGN_KEY_VIOLATION';
    errorResponse.error.message = 'Referenced resource does not exist';
  }

  if (error.code === '23502') { // PostgreSQL not null violation
    errorResponse.error.code = 'REQUIRED_FIELD_MISSING';
    errorResponse.error.message = 'Required field is missing';
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors and pass them to error handler
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Create standardized API error
 */
export const createApiError = (
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: any
): ApiError => {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  error.code = code || 'API_ERROR';
  error.details = details;
  error.isOperational = true;
  return error;
};

/**
 * Handle unhandled promise rejections
 */
export const handleUnhandledRejection = (reason: any, promise: Promise<any>): void => {
  logger.error('Unhandled Promise Rejection', {
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined,
    promise: promise.toString(),
  });

  // In production, you might want to exit the process
  if (config.app.env === 'production') {
    process.exit(1);
  }
};

/**
 * Handle uncaught exceptions
 */
export const handleUncaughtException = (error: Error): void => {
  logger.error('Uncaught Exception', {
    message: error.message,
    stack: error.stack,
    name: error.name,
  });

  // Exit the process as the application is in an undefined state
  process.exit(1);
};

/**
 * Validation error helper
 */
export const createValidationError = (field: string, message: string): ValidationError => {
  return new ValidationError(`Validation failed for field '${field}': ${message}`, {
    field,
    message,
  });
};

/**
 * Database error helper
 */
export const handleDatabaseError = (error: any): ApiError => {
  if (error.code === '23505') {
    return new ConflictError('Resource already exists');
  }

  if (error.code === '23503') {
    return new ValidationError('Referenced resource does not exist');
  }

  if (error.code === '23502') {
    return new ValidationError('Required field is missing');
  }

  if (error.code === 'ECONNREFUSED') {
    return new InternalServerError('Database connection failed');
  }

  return new InternalServerError('Database operation failed');
};

/**
 * External service error helper
 */
export const handleExternalServiceError = (serviceName: string, error: any): ApiError => {
  logger.error(`External service error: ${serviceName}`, {
    service: serviceName,
    error: error.message,
    stack: error.stack,
  });

  return new InternalServerError(`External service ${serviceName} is unavailable`);
};
