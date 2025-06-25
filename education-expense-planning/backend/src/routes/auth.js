/**
 * Authentication routes
 * 
 * This module handles all authentication-related endpoints:
 * - Google OAuth login
 * - Demo mode login
 * - Token refresh
 * - Logout
 * - User profile
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import express from 'express';
import { body, validationResult } from 'express-validator';
import { 
  authenticateGoogle, 
  authenticateGoogleCallback, 
  authenticateJWT,
  requireAuth 
} from '../config/passport.js';
import { 
  generateTokenPair, 
  refreshAccessToken, 
  blacklistToken, 
  extractTokenFromHeader 
} from '../utils/jwt.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import User from '../models/User.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

/**
 * @route   GET /api/auth/google
 * @desc    Initiate Google OAuth login
 * @access  Public
 */
router.get('/google', authenticateGoogle);

/**
 * @route   GET /api/auth/google/callback
 * @desc    Handle Google OAuth callback
 * @access  Public
 */
router.get('/google/callback', authenticateGoogleCallback, asyncHandler(async (req, res) => {
  try {
    // Generate JWT tokens for the authenticated user
    const tokens = generateTokenPair(req.user);
    
    // Update last login
    await req.user.updateLastLogin();
    
    // Redirect to frontend with tokens
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/auth/callback?token=${tokens.accessToken}&refresh=${tokens.refreshToken}`;
    
    logger.logSecurity('google_oauth_success', {
      userId: req.user._id,
      email: req.user.email,
      ip: req.ip
    });
    
    res.redirect(redirectUrl);
  } catch (error) {
    logger.logError('Google OAuth callback processing failed', error, {
      userId: req.user?._id,
      ip: req.ip
    });
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/error?message=callback_error`);
  }
}));

/**
 * @route   POST /api/auth/demo
 * @desc    Demo mode login
 * @access  Public
 */
router.post('/demo', [
  body('username')
    .equals(process.env.DEMO_USERNAME || 'admin')
    .withMessage('Invalid demo credentials'),
  body('password')
    .equals(process.env.DEMO_PASSWORD || '123456')
    .withMessage('Invalid demo credentials')
], asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.logSecurity('demo_login_failed_validation', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      errors: errors.array()
    });
    
    throw new AppError('Invalid demo credentials', 401, 'INVALID_CREDENTIALS');
  }

  // Check if demo mode is enabled
  if (process.env.DEMO_MODE_ENABLED !== 'true') {
    throw new AppError('Demo mode is not enabled', 403, 'DEMO_MODE_DISABLED');
  }

  try {
    // Create or get demo user
    let demoUser = await User.createDemoUser();
    
    // Generate tokens
    const tokens = generateTokenPair(demoUser);
    
    // Update last login
    await demoUser.updateLastLogin();
    
    logger.logSecurity('demo_login_success', {
      userId: demoUser._id,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: {
        user: {
          id: demoUser._id,
          email: demoUser.email,
          name: demoUser.name,
          avatar: demoUser.avatar,
          theme: demoUser.theme,
          isDemoAccount: true
        },
        tokens
      },
      message: 'Demo login successful'
    });
  } catch (error) {
    logger.logError('Demo login failed', error, {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    throw new AppError('Demo login failed', 500, 'DEMO_LOGIN_ERROR');
  }
}));

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
], asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Refresh token is required', 400, 'MISSING_REFRESH_TOKEN');
  }

  const { refreshToken } = req.body;

  try {
    // Refresh the access token
    const tokens = await refreshAccessToken(refreshToken);
    
    logger.logSecurity('token_refreshed', {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: { tokens },
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    logger.logSecurity('token_refresh_failed', {
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    throw new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
  }
}));

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and blacklist token
 * @access  Private
 */
router.post('/logout', authenticateJWT, asyncHandler(async (req, res) => {
  try {
    // Extract and blacklist the current access token
    const authHeader = req.get('Authorization');
    const token = extractTokenFromHeader(authHeader);
    
    if (token) {
      blacklistToken(token);
    }
    
    // Also blacklist refresh token if provided
    const { refreshToken } = req.body;
    if (refreshToken) {
      blacklistToken(refreshToken);
    }
    
    logger.logSecurity('user_logged_out', {
      userId: req.user._id,
      email: req.user.email,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    logger.logError('Logout failed', error, {
      userId: req.user?._id,
      ip: req.ip
    });
    
    // Even if blacklisting fails, consider logout successful
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  }
}));

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticateJWT, requireAuth, asyncHandler(async (req, res) => {
  try {
    // Get fresh user data from database
    const user = await User.findById(req.user._id);
    
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          theme: user.theme,
          isEmailVerified: user.isEmailVerified,
          isDemoAccount: user.isDemoAccount,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    logger.logError('Get user profile failed', error, {
      userId: req.user?._id,
      ip: req.ip
    });
    throw error;
  }
}));

/**
 * @route   PATCH /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.patch('/profile', [
  authenticateJWT,
  requireAuth,
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('theme')
    .optional()
    .isIn(['light', 'dark', 'system'])
    .withMessage('Theme must be light, dark, or system'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL')
], asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400, 'VALIDATION_ERROR');
  }

  try {
    const { name, theme, avatar } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Update fields if provided
    if (name !== undefined) user.name = name;
    if (theme !== undefined) user.theme = theme;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    logger.logDatabase('user_profile_updated', 'users', {
      userId: user._id,
      updatedFields: Object.keys(req.body)
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          theme: user.theme,
          isEmailVerified: user.isEmailVerified,
          isDemoAccount: user.isDemoAccount,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt
        }
      },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    logger.logError('Profile update failed', error, {
      userId: req.user?._id,
      ip: req.ip
    });
    throw error;
  }
}));

/**
 * @route   GET /api/auth/status
 * @desc    Check authentication status
 * @access  Public
 */
router.get('/status', (req, res) => {
  const authHeader = req.get('Authorization');
  const token = extractTokenFromHeader(authHeader);
  
  res.json({
    success: true,
    data: {
      isAuthenticated: !!token,
      demoModeEnabled: process.env.DEMO_MODE_ENABLED === 'true',
      googleOAuthEnabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
    }
  });
});

export default router;
