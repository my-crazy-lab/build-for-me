import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { config } from '../config/config';
import { logger } from '../utils/logger';
import { cache } from '../config/redis';

/**
 * Rate Limiting Middleware
 * 
 * Implements various rate limiting strategies:
 * - Global API rate limiting
 * - Authentication endpoint protection
 * - User-specific rate limiting
 * - IP-based rate limiting
 */

/**
 * Custom key generator for rate limiting
 */
const createKeyGenerator = (prefix: string) => {
  return (req: Request): string => {
    const userId = (req as any).user?.id;
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    
    if (userId) {
      return `${prefix}:user:${userId}`;
    }
    
    return `${prefix}:ip:${ip}`;
  };
};

/**
 * Custom rate limit handler
 */
const rateLimitHandler = (req: Request, res: Response): void => {
  const userId = (req as any).user?.id;
  const ip = req.ip || req.connection.remoteAddress;
  
  logger.security('Rate limit exceeded', {
    userId,
    ip,
    url: req.url,
    method: req.method,
    userAgent: req.get('User-Agent'),
  });

  res.status(429).json({
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.',
    },
    retryAfter: Math.ceil(config.security.rateLimiting.windowMs / 1000),
    timestamp: new Date().toISOString(),
  });
};

/**
 * Skip rate limiting for certain conditions
 */
const skipRateLimit = (req: Request): boolean => {
  // Skip for health checks
  if (req.path === '/health') {
    return true;
  }

  // Skip for internal requests (if you have internal API keys)
  const internalApiKey = req.get('X-Internal-API-Key');
  if (internalApiKey && internalApiKey === process.env.INTERNAL_API_KEY) {
    return true;
  }

  return false;
};

/**
 * Global API rate limiter
 */
export const rateLimiter = rateLimit({
  windowMs: config.security.rateLimiting.windowMs,
  max: config.security.rateLimiting.maxRequests,
  keyGenerator: createKeyGenerator('api'),
  handler: rateLimitHandler,
  skip: skipRateLimit,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.',
    },
  },
});

/**
 * Strict rate limiter for authentication endpoints
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  keyGenerator: (req: Request): string => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const email = req.body?.email || 'unknown';
    return `auth:${ip}:${email}`;
  },
  handler: (req: Request, res: Response): void => {
    const ip = req.ip || req.connection.remoteAddress;
    const email = req.body?.email;
    
    logger.security('Authentication rate limit exceeded', {
      ip,
      email,
      url: req.url,
      method: req.method,
      userAgent: req.get('User-Agent'),
    });

    res.status(429).json({
      success: false,
      error: {
        code: 'AUTH_RATE_LIMIT_EXCEEDED',
        message: 'Too many authentication attempts. Please try again in 15 minutes.',
      },
      retryAfter: 900, // 15 minutes
      timestamp: new Date().toISOString(),
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Password reset rate limiter
 */
export const passwordResetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per hour
  keyGenerator: (req: Request): string => {
    const email = req.body?.email || 'unknown';
    return `password-reset:${email}`;
  },
  handler: rateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Email sending rate limiter
 */
export const emailRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 emails per hour per user
  keyGenerator: createKeyGenerator('email'),
  handler: rateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * SMS sending rate limiter
 */
export const smsRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 SMS per hour per user
  keyGenerator: createKeyGenerator('sms'),
  handler: rateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * File upload rate limiter
 */
export const uploadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 uploads per 15 minutes
  keyGenerator: createKeyGenerator('upload'),
  handler: rateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Webhook rate limiter
 */
export const webhookRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 webhook calls per minute
  keyGenerator: createKeyGenerator('webhook'),
  handler: rateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Custom Redis-based rate limiter for more complex scenarios
 */
export class RedisRateLimiter {
  private prefix: string;
  private windowMs: number;
  private maxRequests: number;

  constructor(prefix: string, windowMs: number, maxRequests: number) {
    this.prefix = prefix;
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  /**
   * Check if request is within rate limit
   */
  async isAllowed(key: string): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const redisKey = `${this.prefix}:${key}`;
    const now = Date.now();
    const windowStart = now - this.windowMs;

    try {
      // Get current count
      const current = await cache.get(redisKey);
      const count = current ? parseInt(current as string, 10) : 0;

      if (count >= this.maxRequests) {
        const ttl = await cache.exists(redisKey) ? this.windowMs / 1000 : 0;
        return {
          allowed: false,
          remaining: 0,
          resetTime: now + (ttl * 1000),
        };
      }

      // Increment counter
      await cache.incrBy(redisKey, 1);
      
      // Set expiration if this is the first request in the window
      if (count === 0) {
        await cache.expire(redisKey, Math.ceil(this.windowMs / 1000));
      }

      return {
        allowed: true,
        remaining: this.maxRequests - count - 1,
        resetTime: now + this.windowMs,
      };
    } catch (error) {
      logger.error('Redis rate limiter error:', error);
      // Allow request if Redis is down
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: now + this.windowMs,
      };
    }
  }

  /**
   * Express middleware factory
   */
  middleware(keyGenerator: (req: Request) => string) {
    return async (req: Request, res: Response, next: Function): Promise<void> => {
      try {
        const key = keyGenerator(req);
        const result = await this.isAllowed(key);

        // Set rate limit headers
        res.set({
          'X-RateLimit-Limit': this.maxRequests.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
        });

        if (!result.allowed) {
          logger.security('Redis rate limit exceeded', {
            key,
            url: req.url,
            method: req.method,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
          });

          return res.status(429).json({
            success: false,
            error: {
              code: 'RATE_LIMIT_EXCEEDED',
              message: 'Too many requests. Please try again later.',
            },
            retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
            timestamp: new Date().toISOString(),
          });
        }

        next();
      } catch (error) {
        logger.error('Rate limiter middleware error:', error);
        // Allow request if there's an error
        next();
      }
    };
  }
}

/**
 * Create custom rate limiters for specific use cases
 */
export const createCustomRateLimiter = (
  prefix: string,
  windowMs: number,
  maxRequests: number
): RedisRateLimiter => {
  return new RedisRateLimiter(prefix, windowMs, maxRequests);
};

/**
 * Project-specific rate limiter
 */
export const projectRateLimiter = createCustomRateLimiter('project', 60 * 1000, 50);

/**
 * Incident creation rate limiter
 */
export const incidentRateLimiter = createCustomRateLimiter('incident', 5 * 60 * 1000, 10);

/**
 * Notification rate limiter
 */
export const notificationRateLimiter = createCustomRateLimiter('notification', 60 * 1000, 100);

/**
 * Monitoring check rate limiter
 */
export const monitoringRateLimiter = createCustomRateLimiter('monitoring', 60 * 1000, 1000);

/**
 * Rate limit bypass for internal services
 */
export const bypassRateLimit = (req: Request, res: Response, next: Function): void => {
  // Add a flag to bypass rate limiting
  (req as any).bypassRateLimit = true;
  next();
};

/**
 * Get rate limit status for a key
 */
export const getRateLimitStatus = async (
  prefix: string,
  key: string
): Promise<{ count: number; remaining: number; resetTime: number } | null> => {
  try {
    const redisKey = `${prefix}:${key}`;
    const count = await cache.get(redisKey);
    
    if (!count) {
      return null;
    }

    const numCount = parseInt(count as string, 10);
    const maxRequests = config.security.rateLimiting.maxRequests;
    
    return {
      count: numCount,
      remaining: Math.max(0, maxRequests - numCount),
      resetTime: Date.now() + config.security.rateLimiting.windowMs,
    };
  } catch (error) {
    logger.error('Error getting rate limit status:', error);
    return null;
  }
};
