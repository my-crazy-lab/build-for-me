/**
 * Love Journey - Authentication Routes
 *
 * Handles user authentication including Google OAuth and demo login
 * for the Love Journey application.
 *
 * Created: 2025-06-25
 * Version: 1.0.0
 */

const express = require('express');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendTokenResponse } = require('../utils/jwt');

// Initialize passport configuration
require('../config/passport');

const router = express.Router();

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: user.profile
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', [
  body('firstName').trim().isLength({ min: 1, max: 50 }).withMessage('First name is required and must be less than 50 characters'),
  body('lastName').trim().isLength({ min: 1, max: 50 }).withMessage('Last name is required and must be less than 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('dateOfBirth').optional().isISO8601().withMessage('Valid date of birth is required'),
  body('coupleName').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Couple name must be less than 100 characters'),
  body('relationshipStartDate').optional().isISO8601().withMessage('Valid relationship start date is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input data',
        details: errors.array()
      });
    }

    const {
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      coupleName,
      relationshipStartDate
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    // Create user with couple information
    const userData = {
      name: `${firstName} ${lastName}`,
      email,
      password,
      profile: {
        firstName,
        lastName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        coupleName: coupleName || null,
        relationshipStartDate: relationshipStartDate ? new Date(relationshipStartDate) : null
      }
    };

    const user = await User.create(userData);

    await user.updateLastLogin();
    sendTokenResponse(user, 201, res);

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Demo login
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input data',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check for demo credentials
    if (email === process.env.DEMO_ADMIN_EMAIL && password === process.env.DEMO_ADMIN_PASSWORD) {
      // Find or create demo admin user
      let user = await User.findOne({ email: process.env.DEMO_ADMIN_EMAIL });

      if (!user) {
        user = await User.create({
          name: 'Demo Admin',
          email: process.env.DEMO_ADMIN_EMAIL,
          password: process.env.DEMO_ADMIN_PASSWORD,
          role: 'admin',
          avatar: 'https://ui-avatars.com/api/?name=Demo+Admin&background=A57B5B&color=fff'
        });
      }

      await user.updateLastLogin();
      sendTokenResponse(user, 200, res);
      return;
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    await user.updateLastLogin();
    sendTokenResponse(user, 200, res);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
});

// @desc    Google OAuth
// @route   GET /api/auth/google
// @access  Public
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {
      // Generate JWT token for the authenticated user
      await req.user.updateLastLogin();
      const token = require('../utils/jwt').generateToken(req.user._id);

      // Redirect to frontend with token
      const clientURL = process.env.CLIENT_URL || 'http://localhost:3000';
      res.redirect(`${clientURL}/auth/callback?token=${token}`);

    } catch (error) {
      console.error('Google OAuth callback error:', error);
      const clientURL = process.env.CLIENT_URL || 'http://localhost:3000';
      res.redirect(`${clientURL}/login?error=oauth_failed`);
    }
  }
);

module.exports = router;
