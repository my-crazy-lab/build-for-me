import winston from 'winston';
import path from 'path';
import { config } from '../config/config';

/**
 * Winston Logger Configuration
 * 
 * Provides structured logging with:
 * - Multiple log levels (error, warn, info, debug)
 * - File and console output
 * - JSON formatting for production
 * - Request correlation IDs
 * - Error stack traces
 */

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// Define colors for console output
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
};

winston.addColors(colors);

// Custom format for development
const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta, null, 2)}`;
    }
    
    // Add stack trace for errors
    if (stack) {
      log += `\n${stack}`;
    }
    
    return log;
  })
);

// Custom format for production
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const logObject = {
      timestamp,
      level,
      message,
      ...meta,
    };
    
    if (stack) {
      logObject.stack = stack;
    }
    
    return JSON.stringify(logObject);
  })
);

// Create transports array
const transports: winston.transport[] = [];

// Console transport
transports.push(
  new winston.transports.Console({
    level: config.logging.level,
    format: config.app.env === 'production' ? productionFormat : developmentFormat,
    handleExceptions: true,
    handleRejections: true,
  })
);

// File transport (if enabled)
if (config.logging.file.enabled) {
  // Ensure logs directory exists
  const logsDir = path.dirname(config.logging.file.path);
  
  // Error log file
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: productionFormat,
      maxsize: parseInt(config.logging.file.maxSize.replace('m', '')) * 1024 * 1024,
      maxFiles: config.logging.file.maxFiles,
      handleExceptions: true,
      handleRejections: true,
    })
  );

  // Combined log file
  transports.push(
    new winston.transports.File({
      filename: config.logging.file.path,
      level: config.logging.level,
      format: productionFormat,
      maxsize: parseInt(config.logging.file.maxSize.replace('m', '')) * 1024 * 1024,
      maxFiles: config.logging.file.maxFiles,
    })
  );
}

// Create logger instance
const logger = winston.createLogger({
  levels,
  level: config.logging.level,
  format: config.app.env === 'production' ? productionFormat : developmentFormat,
  transports,
  exitOnError: false,
});

/**
 * Enhanced logger with additional methods
 */
class EnhancedLogger {
  private winston: winston.Logger;

  constructor(winstonLogger: winston.Logger) {
    this.winston = winstonLogger;
  }

  /**
   * Log error message
   */
  error(message: string, meta?: any): void {
    this.winston.error(message, meta);
  }

  /**
   * Log warning message
   */
  warn(message: string, meta?: any): void {
    this.winston.warn(message, meta);
  }

  /**
   * Log info message
   */
  info(message: string, meta?: any): void {
    this.winston.info(message, meta);
  }

  /**
   * Log debug message
   */
  debug(message: string, meta?: any): void {
    this.winston.debug(message, meta);
  }

  /**
   * Log HTTP request
   */
  request(req: any, res: any, responseTime?: number): void {
    const meta = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      userId: req.user?.id,
      correlationId: req.correlationId,
    };

    if (responseTime) {
      meta.responseTime = `${responseTime}ms`;
    }

    const message = `${req.method} ${req.url} ${res.statusCode}`;
    
    if (res.statusCode >= 400) {
      this.winston.warn(message, meta);
    } else {
      this.winston.info(message, meta);
    }
  }

  /**
   * Log database query
   */
  query(query: string, duration: number, rowCount?: number): void {
    this.winston.debug('Database query executed', {
      query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
      duration: `${duration}ms`,
      rowCount,
    });
  }

  /**
   * Log authentication events
   */
  auth(event: string, userId?: string, email?: string, ip?: string): void {
    this.winston.info(`Auth: ${event}`, {
      userId,
      email,
      ip,
      event,
    });
  }

  /**
   * Log security events
   */
  security(event: string, details: any): void {
    this.winston.warn(`Security: ${event}`, {
      event,
      ...details,
    });
  }

  /**
   * Log business events
   */
  business(event: string, details: any): void {
    this.winston.info(`Business: ${event}`, {
      event,
      ...details,
    });
  }

  /**
   * Log performance metrics
   */
  performance(metric: string, value: number, unit: string = 'ms'): void {
    this.winston.info(`Performance: ${metric}`, {
      metric,
      value,
      unit,
    });
  }

  /**
   * Log external API calls
   */
  external(service: string, method: string, url: string, statusCode: number, duration: number): void {
    const message = `External API: ${service} ${method} ${url} ${statusCode}`;
    const meta = {
      service,
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
    };

    if (statusCode >= 400) {
      this.winston.warn(message, meta);
    } else {
      this.winston.info(message, meta);
    }
  }

  /**
   * Log job queue events
   */
  job(jobName: string, event: string, details?: any): void {
    this.winston.info(`Job: ${jobName} ${event}`, {
      jobName,
      event,
      ...details,
    });
  }

  /**
   * Create child logger with additional context
   */
  child(context: any): EnhancedLogger {
    const childLogger = this.winston.child(context);
    return new EnhancedLogger(childLogger);
  }

  /**
   * Get the underlying Winston logger
   */
  getWinstonLogger(): winston.Logger {
    return this.winston;
  }
}

// Create enhanced logger instance
const enhancedLogger = new EnhancedLogger(logger);

// Export both the enhanced logger and Winston logger
export { enhancedLogger as logger, logger as winstonLogger };

// Default export
export default enhancedLogger;

/**
 * Utility functions for logging
 */

/**
 * Create a correlation ID for request tracking
 */
export const createCorrelationId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Sanitize sensitive data from logs
 */
export const sanitizeLogData = (data: any): any => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const sensitiveFields = [
    'password',
    'token',
    'secret',
    'key',
    'authorization',
    'cookie',
    'session',
  ];

  const sanitized = { ...data };

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  }

  // Recursively sanitize nested objects
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeLogData(sanitized[key]);
    }
  }

  return sanitized;
};

/**
 * Format error for logging
 */
export const formatError = (error: Error | any): any => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return error;
};

/**
 * Log startup information
 */
export const logStartup = (): void => {
  enhancedLogger.info('Application starting up', {
    environment: config.app.env,
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    pid: process.pid,
  });
};

/**
 * Log shutdown information
 */
export const logShutdown = (signal: string): void => {
  enhancedLogger.info('Application shutting down', {
    signal,
    uptime: process.uptime(),
  });
};
