/**
 * JWT utility functions for token generation and validation
 * 
 * This module provides utilities for:
 * - Generating access and refresh tokens
 * - Validating and decoding tokens
 * - Token blacklisting (optional)
 * - Token refresh logic
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import jwt from 'jsonwebtoken';
import { logger } from './logger.js';

// Token blacklist (in production, use Redis or database)
const tokenBlacklist = new Set();

/**
 * Generate JWT access token
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
export const generateAccessToken = (user) => {
  try {
    const payload = {
      userId: user._id,
      email: user.email,
      name: user.name,
      isDemoAccount: user.isDemoAccount || false,
      type: 'access'
    };

    const options = {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
      issuer: 'education-expense-dashboard',
      audience: 'education-expense-dashboard-users',
      algorithm: 'HS256'
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, options);

    logger.logSecurity('access_token_generated', {
      userId: user._id,
      email: user.email,
      expiresIn: options.expiresIn
    });

    return token;
  } catch (error) {
    logger.logError('Access token generation failed', error, {
      userId: user._id,
      email: user.email
    });
    throw new Error('Failed to generate access token');
  }
};

/**
 * Generate JWT refresh token
 * @param {Object} user - User object
 * @returns {string} JWT refresh token
 */
export const generateRefreshToken = (user) => {
  try {
    const payload = {
      userId: user._id,
      email: user.email,
      type: 'refresh',
      tokenVersion: user.tokenVersion || 1 // For token invalidation
    };

    const options = {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      issuer: 'education-expense-dashboard',
      audience: 'education-expense-dashboard-users',
      algorithm: 'HS256'
    };

    const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, options);

    logger.logSecurity('refresh_token_generated', {
      userId: user._id,
      email: user.email,
      expiresIn: options.expiresIn
    });

    return token;
  } catch (error) {
    logger.logError('Refresh token generation failed', error, {
      userId: user._id,
      email: user.email
    });
    throw new Error('Failed to generate refresh token');
  }
};

/**
 * Generate both access and refresh tokens
 * @param {Object} user - User object
 * @returns {Object} Object containing both tokens
 */
export const generateTokenPair = (user) => {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
    tokenType: 'Bearer',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  };
};

/**
 * Verify and decode JWT token
 * @param {string} token - JWT token
 * @param {string} type - Token type ('access' or 'refresh')
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token, type = 'access') => {
  try {
    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
      throw new Error('Token has been revoked');
    }

    const secret = type === 'refresh' 
      ? (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET)
      : process.env.JWT_SECRET;

    const options = {
      issuer: 'education-expense-dashboard',
      audience: 'education-expense-dashboard-users',
      algorithms: ['HS256']
    };

    const decoded = jwt.verify(token, secret, options);

    // Verify token type matches expected type
    if (decoded.type !== type) {
      throw new Error(`Invalid token type. Expected ${type}, got ${decoded.type}`);
    }

    logger.logSecurity('token_verified', {
      userId: decoded.userId,
      tokenType: type,
      expiresAt: new Date(decoded.exp * 1000)
    });

    return decoded;
  } catch (error) {
    logger.logSecurity('token_verification_failed', {
      tokenType: type,
      error: error.message,
      token: token ? token.substring(0, 20) + '...' : 'null'
    });

    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw error;
    }
  }
};

/**
 * Decode token without verification (for debugging)
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token, { complete: true });
  } catch (error) {
    logger.logError('Token decoding failed', error, { token: token?.substring(0, 20) });
    return null;
  }
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Extracted token
 */
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if token is expired
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} Expiration date
 */
export const getTokenExpiration = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return null;
    
    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
};

/**
 * Blacklist a token (revoke it)
 * @param {string} token - JWT token to blacklist
 */
export const blacklistToken = (token) => {
  tokenBlacklist.add(token);
  
  logger.logSecurity('token_blacklisted', {
    token: token.substring(0, 20) + '...',
    blacklistSize: tokenBlacklist.size
  });

  // Clean up expired tokens from blacklist periodically
  cleanupBlacklist();
};

/**
 * Check if token is blacklisted
 * @param {string} token - JWT token
 * @returns {boolean} True if token is blacklisted
 */
export const isTokenBlacklisted = (token) => {
  return tokenBlacklist.has(token);
};

/**
 * Clean up expired tokens from blacklist
 */
const cleanupBlacklist = () => {
  const currentTime = Math.floor(Date.now() / 1000);
  let cleanedCount = 0;

  for (const token of tokenBlacklist) {
    try {
      const decoded = jwt.decode(token);
      if (!decoded || !decoded.exp || decoded.exp < currentTime) {
        tokenBlacklist.delete(token);
        cleanedCount++;
      }
    } catch (error) {
      // Invalid token, remove it
      tokenBlacklist.delete(token);
      cleanedCount++;
    }
  }

  if (cleanedCount > 0) {
    logger.logSecurity('blacklist_cleaned', {
      removedTokens: cleanedCount,
      remainingTokens: tokenBlacklist.size
    });
  }
};

/**
 * Refresh access token using refresh token
 * @param {string} refreshToken - Valid refresh token
 * @returns {Object} New token pair
 */
export const refreshAccessToken = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = verifyToken(refreshToken, 'refresh');
    
    // Get user from database to ensure they still exist and are active
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    if (!user.isActive) {
      throw new Error('User account is inactive');
    }
    
    // Check token version if implemented
    if (user.tokenVersion && decoded.tokenVersion !== user.tokenVersion) {
      throw new Error('Refresh token is invalid');
    }
    
    // Generate new token pair
    const tokens = generateTokenPair(user);
    
    // Optionally blacklist the old refresh token
    blacklistToken(refreshToken);
    
    logger.logSecurity('access_token_refreshed', {
      userId: user._id,
      email: user.email
    });
    
    return tokens;
  } catch (error) {
    logger.logSecurity('token_refresh_failed', {
      error: error.message,
      refreshToken: refreshToken?.substring(0, 20) + '...'
    });
    throw error;
  }
};

// Periodic cleanup of blacklist (run every hour)
setInterval(cleanupBlacklist, 60 * 60 * 1000);
