/**
 * Goals routes
 * 
 * This module handles financial goal management:
 * - Create, read, update, delete goals
 * - Track goal progress
 * - Goal achievements
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { authenticateJWT, requireAuth } from '../config/passport.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import Goal from '../models/Goal.js';
import ShareAccess from '../models/ShareAccess.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateJWT, requireAuth);

/**
 * @route   GET /api/students/:studentId/goals
 * @desc    Get all goals for a student
 * @access  Private
 */
router.get('/students/:studentId/goals', [
  param('studentId').isMongoId().withMessage('Invalid student ID')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Invalid student ID', 400, 'INVALID_STUDENT_ID');
  }

  try {
    const { studentId } = req.params;

    // Check if user has access to this student
    const accessCheck = await ShareAccess.hasAccess(req.user._id, studentId, 'view');
    
    if (!accessCheck.hasAccess) {
      throw new AppError('Student not found or access denied', 404, 'STUDENT_NOT_FOUND');
    }

    const goals = await Goal.findByStudent(studentId);

    res.json({
      success: true,
      data: {
        goals,
        total: goals.length,
        studentId
      }
    });
  } catch (error) {
    logger.logError('Get student goals failed', error, {
      userId: req.user._id,
      studentId: req.params.studentId,
      ip: req.ip
    });
    throw error;
  }
}));

/**
 * @route   POST /api/students/:studentId/goals
 * @desc    Create a new goal for a student
 * @access  Private
 */
router.post('/students/:studentId/goals', [
  param('studentId').isMongoId().withMessage('Invalid student ID'),
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 1000 }),
  body('targetAmount').isFloat({ min: 0 }).withMessage('Target amount must be positive'),
  body('deadline').isISO8601().withMessage('Valid deadline is required'),
  body('goalType').optional().isIn(['savings', 'expense', 'equipment', 'tuition', 'emergency', 'other']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical'])
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400, 'VALIDATION_ERROR');
  }

  try {
    const { studentId } = req.params;
    const { title, description, targetAmount, deadline, goalType, priority } = req.body;

    // Check if user has edit access to this student
    const accessCheck = await ShareAccess.hasAccess(req.user._id, studentId, 'edit');
    
    if (!accessCheck.hasAccess) {
      throw new AppError('Student not found or edit access denied', 404, 'STUDENT_NOT_FOUND');
    }

    // Validate deadline is in the future
    if (new Date(deadline) <= new Date()) {
      throw new AppError('Deadline must be in the future', 400, 'INVALID_DEADLINE');
    }

    const goal = new Goal({
      studentId,
      title,
      description,
      targetAmount,
      deadline: new Date(deadline),
      goalType: goalType || 'savings',
      priority: priority || 'medium'
    });

    await goal.save();

    res.status(201).json({
      success: true,
      data: { goal },
      message: 'Goal created successfully'
    });
  } catch (error) {
    logger.logError('Create goal failed', error, {
      userId: req.user._id,
      studentId: req.params.studentId,
      ip: req.ip
    });
    throw error;
  }
}));

export default router;
