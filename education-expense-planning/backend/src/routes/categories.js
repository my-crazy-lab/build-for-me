/**
 * Categories routes
 * 
 * This module handles expense category management:
 * - Get default categories
 * - Manage custom categories
 * - Category statistics
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import express from 'express';
import { authenticateJWT, requireAuth } from '../config/passport.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { DEFAULT_CATEGORIES } from '../models/Plan.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateJWT, requireAuth);

/**
 * @route   GET /api/categories
 * @desc    Get all available expense categories
 * @access  Private
 */
router.get('/', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      categories: DEFAULT_CATEGORIES,
      total: DEFAULT_CATEGORIES.length
    }
  });
}));

export default router;
