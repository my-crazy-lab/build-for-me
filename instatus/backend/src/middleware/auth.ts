import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { logger } from '../utils/logger';
import { AuthenticationError, AuthorizationError } from './errorHandler';
import { query } from '../config/database';
import { User, UserRole } from '../../../shared/types';

/**
 * Authentication and Authorization Middleware
 * 
 * Handles:
 * - JWT token verification
 * - User authentication
 * - Role-based authorization
 * - Project ownership verification
 */

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
      correlationId?: string;
    }
  }
}

/**
 * JWT payload interface
 */
interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

/**
 * Extract JWT token from request
 */
const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Also check for token in cookies (for web clients)
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  
  return null;
};

/**
 * Verify JWT token and extract user information
 */
const verifyToken = async (token: string): Promise<User> => {
  try {
    // Verify the token
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    
    // Fetch user from database to ensure they still exist and are active
    const userResult = await query<User>(
      'SELECT id, email, name, role, email_verified, avatar_url, preferences, created_at, updated_at FROM users WHERE id = $1',
      [decoded.userId]
    );
    
    if (userResult.rows.length === 0) {
      throw new AuthenticationError('User not found');
    }
    
    const user = userResult.rows[0];
    
    // Check if user is still active (you can add an 'active' field to users table)
    // if (!user.active) {
    //   throw new AuthenticationError('User account is deactivated');
    // }
    
    return user;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError('Invalid token');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Token expired');
    }
    throw error;
  }
};

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      throw new AuthenticationError('Authentication token required');
    }
    
    const user = await verifyToken(token);
    req.user = user;
    
    // Log authentication
    logger.auth('User authenticated', user.id, user.email, req.ip);
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication middleware
 * Attaches user to request if token is present, but doesn't require it
 */
export const optionalAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);
    
    if (token) {
      try {
        const user = await verifyToken(token);
        req.user = user;
        logger.auth('User optionally authenticated', user.id, user.email, req.ip);
      } catch (error) {
        // Ignore authentication errors for optional auth
        logger.debug('Optional authentication failed', { error: error.message });
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Role-based authorization middleware factory
 */
export const requireRole = (roles: UserRole | UserRole[]) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AuthenticationError('Authentication required'));
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      logger.security('Insufficient permissions', {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: allowedRoles,
        url: req.url,
        method: req.method,
      });
      
      return next(new AuthorizationError('Insufficient permissions'));
    }
    
    next();
  };
};

/**
 * Admin role requirement
 */
export const requireAdmin = requireRole(UserRole.ADMIN);

/**
 * Project ownership verification middleware
 */
export const requireProjectOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AuthenticationError('Authentication required'));
    }
    
    const projectId = req.params.projectId || req.params.id;
    
    if (!projectId) {
      return next(new Error('Project ID not found in request parameters'));
    }
    
    // Check if user owns the project
    const projectResult = await query(
      'SELECT id, user_id FROM projects WHERE id = $1',
      [projectId]
    );
    
    if (projectResult.rows.length === 0) {
      return next(new Error('Project not found'));
    }
    
    const project = projectResult.rows[0];
    
    // Allow if user is admin or project owner
    if (req.user.role === UserRole.ADMIN || project.user_id === req.user.id) {
      return next();
    }
    
    logger.security('Project access denied', {
      userId: req.user.id,
      projectId,
      projectOwnerId: project.user_id,
      url: req.url,
      method: req.method,
    });
    
    return next(new AuthorizationError('You do not have permission to access this project'));
  } catch (error) {
    next(error);
  }
};

/**
 * Component ownership verification (through project ownership)
 */
export const requireComponentOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AuthenticationError('Authentication required'));
    }
    
    const componentId = req.params.componentId || req.params.id;
    
    if (!componentId) {
      return next(new Error('Component ID not found in request parameters'));
    }
    
    // Get component and its project
    const componentResult = await query(
      `SELECT c.id, c.project_id, p.user_id 
       FROM components c 
       JOIN projects p ON c.project_id = p.id 
       WHERE c.id = $1`,
      [componentId]
    );
    
    if (componentResult.rows.length === 0) {
      return next(new Error('Component not found'));
    }
    
    const component = componentResult.rows[0];
    
    // Allow if user is admin or project owner
    if (req.user.role === UserRole.ADMIN || component.user_id === req.user.id) {
      return next();
    }
    
    logger.security('Component access denied', {
      userId: req.user.id,
      componentId,
      projectId: component.project_id,
      projectOwnerId: component.user_id,
      url: req.url,
      method: req.method,
    });
    
    return next(new AuthorizationError('You do not have permission to access this component'));
  } catch (error) {
    next(error);
  }
};

/**
 * Incident ownership verification (through project ownership)
 */
export const requireIncidentOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AuthenticationError('Authentication required'));
    }
    
    const incidentId = req.params.incidentId || req.params.id;
    
    if (!incidentId) {
      return next(new Error('Incident ID not found in request parameters'));
    }
    
    // Get incident and its project
    const incidentResult = await query(
      `SELECT i.id, i.project_id, p.user_id 
       FROM incidents i 
       JOIN projects p ON i.project_id = p.id 
       WHERE i.id = $1`,
      [incidentId]
    );
    
    if (incidentResult.rows.length === 0) {
      return next(new Error('Incident not found'));
    }
    
    const incident = incidentResult.rows[0];
    
    // Allow if user is admin or project owner
    if (req.user.role === UserRole.ADMIN || incident.user_id === req.user.id) {
      return next();
    }
    
    logger.security('Incident access denied', {
      userId: req.user.id,
      incidentId,
      projectId: incident.project_id,
      projectOwnerId: incident.user_id,
      url: req.url,
      method: req.method,
    });
    
    return next(new AuthorizationError('You do not have permission to access this incident'));
  } catch (error) {
    next(error);
  }
};

/**
 * Rate limiting bypass for authenticated users
 */
export const bypassRateLimitForAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user) {
    (req as any).bypassRateLimit = true;
  }
  next();
};

/**
 * Generate JWT token for user
 */
export const generateToken = (user: User): string => {
  const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (user: User): string => {
  const payload = {
    userId: user.id,
    type: 'refresh',
  };
  
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): { userId: string } => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as any;
    
    if (decoded.type !== 'refresh') {
      throw new AuthenticationError('Invalid refresh token');
    }
    
    return { userId: decoded.userId };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError('Invalid refresh token');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Refresh token expired');
    }
    throw error;
  }
};
