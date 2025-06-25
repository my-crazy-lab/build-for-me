/**
 * Expense tracking routes
 * 
 * This module handles all actual expense tracking endpoints:
 * - Create, read, update, delete actual expenses
 * - Expense filtering and search
 * - Receipt image handling
 * - Expense analytics
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { authenticateJWT, requireAuth } from '../config/passport.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import Expense from '../models/Expense.js';
import ShareAccess from '../models/ShareAccess.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateJWT, requireAuth);

/**
 * @route   GET /api/students/:studentId/expenses
 * @desc    Get all expenses for a student with filtering
 * @access  Private
 */
router.get('/students/:studentId/expenses', [
  param('studentId').isMongoId().withMessage('Invalid student ID'),
  query('category').optional().trim(),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date'),
  query('academicYear').optional().matches(/^\d{4}-\d{4}$/),
  query('grade').optional().isInt({ min: 1, max: 12 }),
  query('tags').optional(),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400, 'VALIDATION_ERROR');
  }

  try {
    const { studentId } = req.params;
    const { category, startDate, endDate, academicYear, grade, tags, limit = 50, offset = 0 } = req.query;

    // Check if user has access to this student
    const accessCheck = await ShareAccess.hasAccess(req.user._id, studentId, 'view');
    
    if (!accessCheck.hasAccess || !accessCheck.shareAccess?.canViewExpenses) {
      throw new AppError('Student not found or access denied', 404, 'STUDENT_NOT_FOUND');
    }

    // Build filter options
    const filterOptions = {
      category,
      startDate,
      endDate,
      academicYear,
      grade: grade ? parseInt(grade) : undefined,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : undefined
    };

    // Remove undefined values
    Object.keys(filterOptions).forEach(key => {
      if (filterOptions[key] === undefined) {
        delete filterOptions[key];
      }
    });

    const expenses = await Expense.findByStudent(studentId, filterOptions)
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    // Get total count for pagination
    const totalQuery = Expense.findByStudent(studentId, filterOptions);
    const total = await totalQuery.countDocuments();

    res.json({
      success: true,
      data: {
        expenses,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: total > parseInt(offset) + parseInt(limit)
        },
        studentId
      }
    });
  } catch (error) {
    logger.logError('Get student expenses failed', error, {
      userId: req.user._id,
      studentId: req.params.studentId,
      ip: req.ip
    });
    throw error;
  }
}));

/**
 * @route   POST /api/students/:studentId/expenses
 * @desc    Create a new expense for a student
 * @access  Private
 */
router.post('/students/:studentId/expenses', [
  param('studentId').isMongoId().withMessage('Invalid student ID'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('description').optional().trim().isLength({ max: 500 }),
  body('note').optional().trim().isLength({ max: 1000 }),
  body('tags').optional().isArray(),
  body('paymentMethod').optional().isIn(['cash', 'card', 'transfer', 'check', 'other']),
  body('receiptImageUrl').optional().isURL(),
  body('planId').optional().isMongoId()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400, 'VALIDATION_ERROR');
  }

  try {
    const { studentId } = req.params;
    const { date, category, amount, description, note, tags, paymentMethod, receiptImageUrl, planId } = req.body;

    // Check if user has edit access to this student
    const accessCheck = await ShareAccess.hasAccess(req.user._id, studentId, 'edit');
    
    if (!accessCheck.hasAccess || !accessCheck.shareAccess?.canEditExpenses) {
      throw new AppError('Student not found or edit access denied', 404, 'STUDENT_NOT_FOUND');
    }

    // Validate date is not in the future
    if (new Date(date) > new Date()) {
      throw new AppError('Expense date cannot be in the future', 400, 'INVALID_DATE');
    }

    const expense = new Expense({
      studentId,
      planId: planId || null,
      date: new Date(date),
      category: category.toLowerCase().trim(),
      amount,
      description: description || '',
      note: note || '',
      tags: tags || [],
      paymentMethod: paymentMethod || 'cash',
      receiptImageUrl: receiptImageUrl || null
    });

    await expense.save();

    logger.logDatabase('expense_created', 'expenses', {
      expenseId: expense._id,
      studentId,
      category: expense.category,
      amount: expense.amount,
      userId: req.user._id
    });

    res.status(201).json({
      success: true,
      data: { expense },
      message: 'Expense created successfully'
    });
  } catch (error) {
    logger.logError('Create expense failed', error, {
      userId: req.user._id,
      studentId: req.params.studentId,
      ip: req.ip
    });
    throw error;
  }
}));

/**
 * @route   GET /api/expenses/:id
 * @desc    Get a specific expense
 * @access  Private
 */
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid expense ID')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Invalid expense ID', 400, 'INVALID_EXPENSE_ID');
  }

  try {
    const expense = await Expense.findById(req.params.id).populate('studentId', 'name currentGrade');
    
    if (!expense) {
      throw new AppError('Expense not found', 404, 'EXPENSE_NOT_FOUND');
    }

    // Check if user has access to this student
    const accessCheck = await ShareAccess.hasAccess(req.user._id, expense.studentId._id, 'view');
    
    if (!accessCheck.hasAccess || !accessCheck.shareAccess?.canViewExpenses) {
      throw new AppError('Expense not found or access denied', 404, 'EXPENSE_NOT_FOUND');
    }

    res.json({
      success: true,
      data: { expense }
    });
  } catch (error) {
    logger.logError('Get expense failed', error, {
      userId: req.user._id,
      expenseId: req.params.id,
      ip: req.ip
    });
    throw error;
  }
}));

/**
 * @route   PATCH /api/expenses/:id
 * @desc    Update an expense
 * @access  Private
 */
router.patch('/:id', [
  param('id').isMongoId().withMessage('Invalid expense ID'),
  body('date').optional().isISO8601().withMessage('Valid date is required'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('amount').optional().isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('description').optional().trim().isLength({ max: 500 }),
  body('note').optional().trim().isLength({ max: 1000 }),
  body('tags').optional().isArray(),
  body('paymentMethod').optional().isIn(['cash', 'card', 'transfer', 'check', 'other']),
  body('receiptImageUrl').optional().isURL()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400, 'VALIDATION_ERROR');
  }

  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      throw new AppError('Expense not found', 404, 'EXPENSE_NOT_FOUND');
    }

    // Check if user has edit access to this student
    const accessCheck = await ShareAccess.hasAccess(req.user._id, expense.studentId, 'edit');
    
    if (!accessCheck.hasAccess || !accessCheck.shareAccess?.canEditExpenses) {
      throw new AppError('Expense not found or edit access denied', 404, 'EXPENSE_NOT_FOUND');
    }

    // Update fields
    const allowedFields = ['date', 'category', 'amount', 'description', 'note', 'tags', 'paymentMethod', 'receiptImageUrl'];
    const updates = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Validate date if provided
    if (updates.date && new Date(updates.date) > new Date()) {
      throw new AppError('Expense date cannot be in the future', 400, 'INVALID_DATE');
    }

    // Normalize category if provided
    if (updates.category) {
      updates.category = updates.category.toLowerCase().trim();
    }

    Object.assign(expense, updates);
    await expense.save();

    logger.logDatabase('expense_updated', 'expenses', {
      expenseId: expense._id,
      studentId: expense.studentId,
      updatedFields: Object.keys(updates),
      userId: req.user._id
    });

    res.json({
      success: true,
      data: { expense },
      message: 'Expense updated successfully'
    });
  } catch (error) {
    logger.logError('Update expense failed', error, {
      userId: req.user._id,
      expenseId: req.params.id,
      ip: req.ip
    });
    throw error;
  }
}));

/**
 * @route   DELETE /api/expenses/:id
 * @desc    Delete an expense
 * @access  Private
 */
router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid expense ID')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Invalid expense ID', 400, 'INVALID_EXPENSE_ID');
  }

  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      throw new AppError('Expense not found', 404, 'EXPENSE_NOT_FOUND');
    }

    // Check if user has edit access to this student
    const accessCheck = await ShareAccess.hasAccess(req.user._id, expense.studentId, 'edit');
    
    if (!accessCheck.hasAccess || !accessCheck.shareAccess?.canEditExpenses) {
      throw new AppError('Expense not found or edit access denied', 404, 'EXPENSE_NOT_FOUND');
    }

    await expense.deleteOne();

    logger.logDatabase('expense_deleted', 'expenses', {
      expenseId: expense._id,
      studentId: expense.studentId,
      category: expense.category,
      amount: expense.amount,
      userId: req.user._id
    });

    res.json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    logger.logError('Delete expense failed', error, {
      userId: req.user._id,
      expenseId: req.params.id,
      ip: req.ip
    });
    throw error;
  }
}));

export default router;
