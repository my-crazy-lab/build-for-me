/**
 * Reminders routes
 * 
 * This module handles all reminder-related endpoints:
 * - Create, read, update, delete reminders
 * - Mark reminders as read/completed
 * - Get upcoming and overdue reminders
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { authenticateJWT, requireAuth } from '../config/passport.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import Reminder from '../models/Reminder.js';
import ShareAccess from '../models/ShareAccess.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateJWT, requireAuth);

/**
 * @route   GET /api/reminders
 * @desc    Get all reminders for current user
 * @access  Private
 */
router.get('/', [
  query('includeRead').optional().isBoolean(),
  query('type').optional().isIn(['info', 'warning', 'critical', 'monthly', 'payment', 'deadline', 'budget_alert']),
  query('status').optional().isIn(['active', 'pending', 'overdue', 'completed']),
  query('limit').optional().isInt({ min: 1, max: 100 })
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400, 'VALIDATION_ERROR');
  }

  try {
    const { includeRead = false, type, status, limit = 50 } = req.query;
    
    let query = { userId: req.user._id };
    
    if (type) query.type = type;
    if (!includeRead) query.isRead = false;
    
    // Filter by status
    if (status === 'completed') {
      query.isCompleted = true;
    } else if (status === 'overdue') {
      query.isCompleted = false;
      query.isDismissed = false;
      query.dueDate = { $lt: new Date() };
    } else if (status === 'active') {
      query.isCompleted = false;
      query.isDismissed = false;
      query.reminderDate = { $lte: new Date() };
    } else if (status === 'pending') {
      query.isCompleted = false;
      query.isDismissed = false;
      query.reminderDate = { $gt: new Date() };
    }

    const reminders = await Reminder.find(query)
      .populate('studentId', 'name currentGrade')
      .sort({ dueDate: 1, priority: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        reminders,
        total: reminders.length
      }
    });
  } catch (error) {
    logger.logError('Get reminders failed', error, {
      userId: req.user._id,
      ip: req.ip
    });
    throw error;
  }
}));

/**
 * @route   POST /api/students/:studentId/reminders
 * @desc    Create a new reminder for a student
 * @access  Private
 */
router.post('/students/:studentId/reminders', [
  param('studentId').isMongoId().withMessage('Invalid student ID'),
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 1000 }),
  body('type').isIn(['info', 'warning', 'critical', 'monthly', 'payment', 'deadline', 'budget_alert']),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('reminderDate').optional().isISO8601(),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('amount').optional().isFloat({ min: 0 })
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400, 'VALIDATION_ERROR');
  }

  try {
    const { studentId } = req.params;
    const { title, message, type, dueDate, reminderDate, priority, amount } = req.body;

    // Check if user has access to this student
    const accessCheck = await ShareAccess.hasAccess(req.user._id, studentId, 'view');
    
    if (!accessCheck.hasAccess) {
      throw new AppError('Student not found or access denied', 404, 'STUDENT_NOT_FOUND');
    }

    // Validate due date is in the future
    if (new Date(dueDate) <= new Date()) {
      throw new AppError('Due date must be in the future', 400, 'INVALID_DUE_DATE');
    }

    const reminder = new Reminder({
      userId: req.user._id,
      studentId,
      title,
      message,
      type,
      dueDate: new Date(dueDate),
      reminderDate: reminderDate ? new Date(reminderDate) : undefined,
      priority: priority || 'medium',
      amount: amount || null
    });

    await reminder.save();

    res.status(201).json({
      success: true,
      data: { reminder },
      message: 'Reminder created successfully'
    });
  } catch (error) {
    logger.logError('Create reminder failed', error, {
      userId: req.user._id,
      studentId: req.params.studentId,
      ip: req.ip
    });
    throw error;
  }
}));

/**
 * @route   PATCH /api/reminders/:id/read
 * @desc    Mark reminder as read
 * @access  Private
 */
router.patch('/:id/read', [
  param('id').isMongoId().withMessage('Invalid reminder ID')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Invalid reminder ID', 400, 'INVALID_REMINDER_ID');
  }

  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!reminder) {
      throw new AppError('Reminder not found', 404, 'REMINDER_NOT_FOUND');
    }

    await reminder.markAsRead();

    res.json({
      success: true,
      data: { reminder },
      message: 'Reminder marked as read'
    });
  } catch (error) {
    logger.logError('Mark reminder as read failed', error, {
      userId: req.user._id,
      reminderId: req.params.id,
      ip: req.ip
    });
    throw error;
  }
}));

/**
 * @route   PATCH /api/reminders/:id/complete
 * @desc    Mark reminder as completed
 * @access  Private
 */
router.patch('/:id/complete', [
  param('id').isMongoId().withMessage('Invalid reminder ID')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Invalid reminder ID', 400, 'INVALID_REMINDER_ID');
  }

  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!reminder) {
      throw new AppError('Reminder not found', 404, 'REMINDER_NOT_FOUND');
    }

    await reminder.markAsCompleted();

    res.json({
      success: true,
      data: { reminder },
      message: 'Reminder marked as completed'
    });
  } catch (error) {
    logger.logError('Mark reminder as completed failed', error, {
      userId: req.user._id,
      reminderId: req.params.id,
      ip: req.ip
    });
    throw error;
  }
}));

/**
 * @route   DELETE /api/reminders/:id
 * @desc    Delete a reminder
 * @access  Private
 */
router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid reminder ID')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Invalid reminder ID', 400, 'INVALID_REMINDER_ID');
  }

  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!reminder) {
      throw new AppError('Reminder not found', 404, 'REMINDER_NOT_FOUND');
    }

    await reminder.deleteOne();

    res.json({
      success: true,
      message: 'Reminder deleted successfully'
    });
  } catch (error) {
    logger.logError('Delete reminder failed', error, {
      userId: req.user._id,
      reminderId: req.params.id,
      ip: req.ip
    });
    throw error;
  }
}));

export default router;
