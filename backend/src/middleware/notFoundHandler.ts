import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * 404 Not Found Handler Middleware
 * 
 * Handles requests to non-existent endpoints and returns a standardized 404 response.
 */

interface NotFoundResponse {
  success: false;
  error: {
    code: string;
    message: string;
    suggestions?: string[];
  };
  timestamp: string;
  path: string;
  method: string;
  correlationId?: string;
}

/**
 * Main 404 handler middleware
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the 404 request
  logger.warn('404 Not Found', {
    method: req.method,
    url: req.url,
    path: req.path,
    query: req.query,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    referer: req.get('Referer'),
    userId: (req as any).user?.id,
    correlationId: (req as any).correlationId,
  });

  // Generate suggestions based on the requested path
  const suggestions = generateSuggestions(req.path);

  // Create 404 response
  const notFoundResponse: NotFoundResponse = {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `The requested endpoint '${req.method} ${req.path}' was not found.`,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    },
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  };

  // Add correlation ID if available
  if ((req as any).correlationId) {
    notFoundResponse.correlationId = (req as any).correlationId;
  }

  // Send 404 response
  res.status(404).json(notFoundResponse);
};

/**
 * Generate helpful suggestions for similar endpoints
 */
const generateSuggestions = (requestedPath: string): string[] => {
  const suggestions: string[] = [];
  
  // Define available API endpoints
  const availableEndpoints = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/logout',
    '/api/auth/refresh',
    '/api/auth/me',
    '/api/users',
    '/api/projects',
    '/api/components',
    '/api/incidents',
    '/api/subscribers',
    '/api/uptime',
    '/api/status',
    '/api/notifications',
    '/health',
    '/api/docs',
  ];

  // Calculate similarity scores and suggest closest matches
  const similarities = availableEndpoints.map(endpoint => ({
    endpoint,
    score: calculateSimilarity(requestedPath, endpoint),
  }));

  // Sort by similarity score and take top 3
  const topMatches = similarities
    .filter(item => item.score > 0.3) // Only suggest if similarity > 30%
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.endpoint);

  suggestions.push(...topMatches);

  // Add common suggestions based on path patterns
  if (requestedPath.includes('/auth')) {
    suggestions.push('/api/auth/login', '/api/auth/register');
  }

  if (requestedPath.includes('/project')) {
    suggestions.push('/api/projects');
  }

  if (requestedPath.includes('/component')) {
    suggestions.push('/api/components');
  }

  if (requestedPath.includes('/incident')) {
    suggestions.push('/api/incidents');
  }

  if (requestedPath.includes('/status')) {
    suggestions.push('/api/status/:slug');
  }

  if (requestedPath.includes('/doc') || requestedPath.includes('/swagger')) {
    suggestions.push('/api/docs');
  }

  // Remove duplicates and return
  return [...new Set(suggestions)];
};

/**
 * Calculate similarity between two strings using Levenshtein distance
 */
const calculateSimilarity = (str1: string, str2: string): number => {
  const matrix: number[][] = [];
  const len1 = str1.length;
  const len2 = str2.length;

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,     // deletion
        matrix[i][j - 1] + 1,     // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  // Calculate similarity percentage
  const maxLength = Math.max(len1, len2);
  const distance = matrix[len1][len2];
  return maxLength === 0 ? 1 : (maxLength - distance) / maxLength;
};

/**
 * API documentation suggestion handler
 */
export const apiDocsHandler = (req: Request, res: Response): void => {
  res.json({
    success: true,
    message: 'Instatus Clone API Documentation',
    version: '1.0.0',
    documentation: {
      swagger: '/api/docs',
      postman: '/api/postman',
    },
    endpoints: {
      authentication: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        logout: 'POST /api/auth/logout',
        refresh: 'POST /api/auth/refresh',
        profile: 'GET /api/auth/me',
      },
      projects: {
        list: 'GET /api/projects',
        create: 'POST /api/projects',
        get: 'GET /api/projects/:id',
        update: 'PUT /api/projects/:id',
        delete: 'DELETE /api/projects/:id',
      },
      components: {
        list: 'GET /api/projects/:projectId/components',
        create: 'POST /api/projects/:projectId/components',
        update: 'PUT /api/components/:id',
        delete: 'DELETE /api/components/:id',
      },
      incidents: {
        list: 'GET /api/projects/:projectId/incidents',
        create: 'POST /api/projects/:projectId/incidents',
        get: 'GET /api/incidents/:id',
        update: 'PUT /api/incidents/:id',
        delete: 'DELETE /api/incidents/:id',
      },
      status: {
        public: 'GET /api/status/:slug',
        subscribe: 'POST /api/status/:slug/subscribe',
      },
      monitoring: {
        checks: 'GET /api/projects/:projectId/uptime-checks',
        create: 'POST /api/projects/:projectId/uptime-checks',
        logs: 'GET /api/uptime-checks/:id/logs',
      },
    },
    examples: {
      authentication: {
        login: {
          method: 'POST',
          url: '/api/auth/login',
          body: {
            email: 'user@example.com',
            password: 'password123',
          },
        },
        register: {
          method: 'POST',
          url: '/api/auth/register',
          body: {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
          },
        },
      },
      projects: {
        create: {
          method: 'POST',
          url: '/api/projects',
          headers: {
            'Authorization': 'Bearer <your-jwt-token>',
            'Content-Type': 'application/json',
          },
          body: {
            name: 'My Status Page',
            slug: 'my-status-page',
            description: 'Status page for my services',
            is_private: false,
          },
        },
      },
    },
    support: {
      documentation: 'https://docs.instatus-clone.com',
      github: 'https://github.com/yourusername/instatus-clone',
      issues: 'https://github.com/yourusername/instatus-clone/issues',
    },
  });
};

/**
 * Health check endpoint
 */
export const healthCheckHandler = (req: Request, res: Response): void => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      external: Math.round(process.memoryUsage().external / 1024 / 1024),
    },
    cpu: {
      usage: process.cpuUsage(),
    },
  });
};
