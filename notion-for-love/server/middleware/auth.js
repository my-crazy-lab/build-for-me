/**
 * Love Journey - Authentication Middleware
 * 
 * JWT-based authentication middleware for protecting routes
 * and extracting user information from tokens.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'User not found'
        });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        error: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized, no token'
    });
  }
};

// Middleware to check if user has a relationship
const requireRelationship = async (req, res, next) => {
  try {
    if (!req.user.relationshipId) {
      return res.status(403).json({
        success: false,
        error: 'User must be part of a relationship to access this resource'
      });
    }
    next();
  } catch (error) {
    console.error('Relationship check error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error during relationship check'
    });
  }
};

// Middleware to check if user is admin (for demo purposes)
const requireAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error during admin check'
    });
  }
};

module.exports = {
  protect,
  requireRelationship,
  requireAdmin
};
