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
    const user = await User.findById(req.user._id).populate('relationshipId');

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
