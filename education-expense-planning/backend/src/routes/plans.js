/**
 * Expense planning routes
 * 
 * This module handles all expense planning endpoints:
 * - Create, read, update, delete yearly expense plans
 * - Plan templates and duplication
 * - Inflation calculations
 * - Budget management
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { authenticateJWT, requireAuth } from '../config/passport.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import Plan, { DEFAULT_CATEGORIES } from '../models/Plan.js';
import Student from '../models/Student.js';
import ShareAccess from '../models/ShareAccess.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateJWT, requireAuth);

/**
 * @route   GET /api/plans/categories
 * @desc    Get default expense categories
 * @access  Private
 */
router.get('/categories', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      categories: DEFAULT_CATEGORIES,
      total: DEFAULT_CATEGORIES.length
    }
  });
}));

/**
 * @route   GET /api/students/:studentId/plans
 * @desc    Get all plans for a student
 * @access  Private
 */
router.get('/students/:studentId/plans', [
  param('studentId').isMongoId().withMessage('Invalid student ID'),
  query('includeInactive')
    .optional()
    .isBoolean()
    .withMessage('includeInactive must be a boolean')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400, 'VALIDATION_ERROR');
  }

  try {
    const { studentId } = req.params;
    const { includeInactive = false } = req.query;

    // Check if user has access to this student
    const accessCheck = await ShareAccess.hasAccess(req.user._id, studentId, 'view');
    
    if (!accessCheck.hasAccess || !accessCheck.shareAccess?.canViewPlans) {
      throw new AppError('Student not found or access denied', 404, 'STUDENT_NOT_FOUND');
    }

    const plans = await Plan.findByStudent(studentId, includeInactive === 'true');

    res.json({
      success: true,
      data: {
        plans,
        total: plans.length,
        studentId
      }
    });
  } catch (error) {
    logger.logError('Get student plans failed', error, {
      userId: req.user._id,
      studentId: req.params.studentId,
      ip: req.ip
    });
    throw error;
  }
}));

/**
 * @route   GET /api/plans/:id
 * @desc    Get a specific plan
 * @access  Private
 */
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid plan ID')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Invalid plan ID', 400, 'INVALID_PLAN_ID');
  }

  try {
    const plan = await Plan.findById(req.params.id).populate('studentId', 'name currentGrade schoolType');
    
    if (!plan) {
      throw new AppError('Plan not found', 404, 'PLAN_NOT_FOUND');
    }

    // Check if user has access to this student
    const accessCheck = await ShareAccess.hasAccess(req.user._id, plan.studentId._id, 'view');
    
    if (!accessCheck.hasAccess || !accessCheck.shareAccess?.canViewPlans) {
      throw new AppError('Plan not found or access denied', 404, 'PLAN_NOT_FOUND');
    }

    res.json({
      success: true,
      data: { plan }
    });
  } catch (error) {
    logger.logError('Get plan failed', error, {
      userId: req.user._id,
      planId: req.params.id,
      ip: req.ip
    });
    throw error;
  }
}));

/**
 * @route   POST /api/students/:studentId/plans
 * @desc    Create a new expense plan for a student
 * @access  Private
 */
router.post('/students/:studentId/plans', [
  param('studentId').isMongoId().withMessage('Invalid student ID'),
  body('grade')
    .isInt({ min: 1, max: 12 })
    .withMessage('Grade must be between 1 and 12'),
  body('schoolYear')
    .matches(/^\d{4}[-–]\d{4}$/)
    .withMessage('School year must be in format YYYY-YYYY'),
  body('inflationRate')
    .optional()
    .isFloat({ min: -10, max: 50 })
    .withMessage('Inflation rate must be between -10% and 50%'),
  body('budgetCap')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Budget cap must be a positive number'),
  body('plannedExpenses')
    .isArray({ min: 1 })
    .withMessage('At least one planned expense is required'),
  body('plannedExpenses.*.category')
    .trim()
    .notEmpty()
    .withMessage('Expense category is required'),
  body('plannedExpenses.*.amount')
    .isFloat({ min: 0 })
    .withMessage('Expense amount must be a positive number'),
  body('plannedExpenses.*.description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400, 'VALIDATION_ERROR');
  }

  try {
    const { studentId } = req.params;
    const { grade, schoolYear, inflationRate, budgetCap, plannedExpenses, notes } = req.body;

    // Check if user has edit access to this student
    const accessCheck = await ShareAccess.hasAccess(req.user._id, studentId, 'edit');
    
    if (!accessCheck.hasAccess || !accessCheck.shareAccess?.canEditPlans) {
      throw new AppError('Student not found or edit access denied', 404, 'STUDENT_NOT_FOUND');
    }

    // Validate school year format
    const [startYear, endYear] = schoolYear.split(/[-–]/).map(Number);
    if (endYear !== startYear + 1) {
      throw new AppError('School year end must be one year after start year', 400, 'INVALID_SCHOOL_YEAR');
    }

    // Check if plan already exists for this grade
    const existingPlan = await Plan.findByStudentAndGrade(studentId, grade);
    if (existingPlan) {
      throw new AppError(`Plan for grade ${grade} already exists`, 400, 'PLAN_ALREADY_EXISTS');
    }

    // Validate planned expenses
    const validatedExpenses = plannedExpenses.map(expense => ({
      category: expense.category.toLowerCase().trim(),
      amount: expense.amount,
      description: expense.description || ''
    }));

    const plan = new Plan({
      studentId,
      grade,
      schoolYear,
      inflationRate: inflationRate || 0,
      budgetCap: budgetCap || null,
      plannedExpenses: validatedExpenses,
      notes: notes || ''
    });

    await plan.save();

    // Populate student info for response
    await plan.populate('studentId', 'name currentGrade schoolType');

    logger.logDatabase('plan_created', 'plans', {
      planId: plan._id,
      studentId,
      grade,
      totalAmount: plan.totalPlannedAmount,
      userId: req.user._id
    });

    res.status(201).json({
      success: true,
      data: { plan },
      message: 'Expense plan created successfully'
    });
  } catch (error) {
    logger.logError('Create plan failed', error, {
      userId: req.user._id,
      studentId: req.params.studentId,
      ip: req.ip
    });
    throw error;
  }
}));

/**
 * @route   PATCH /api/plans/:id
 * @desc    Update an expense plan
 * @access  Private
 */
router.patch('/:id', [
  param('id').isMongoId().withMessage('Invalid plan ID'),
  body('schoolYear')
    .optional()
    .matches(/^\d{4}[-–]\d{4}$/)
    .withMessage('School year must be in format YYYY-YYYY'),
  body('inflationRate')
    .optional()
    .isFloat({ min: -10, max: 50 })
    .withMessage('Inflation rate must be between -10% and 50%'),
  body('budgetCap')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Budget cap must be a positive number'),
  body('plannedExpenses')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one planned expense is required'),
  body('plannedExpenses.*.category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Expense category is required'),
  body('plannedExpenses.*.amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Expense amount must be a positive number'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400, 'VALIDATION_ERROR');
  }

  try {
    const plan = await Plan.findById(req.params.id);
    
    if (!plan) {
      throw new AppError('Plan not found', 404, 'PLAN_NOT_FOUND');
    }

    // Check if user has edit access to this student
    const accessCheck = await ShareAccess.hasAccess(req.user._id, plan.studentId, 'edit');
    
    if (!accessCheck.hasAccess || !accessCheck.shareAccess?.canEditPlans) {
      throw new AppError('Plan not found or edit access denied', 404, 'PLAN_NOT_FOUND');
    }

    // Update fields
    const allowedFields = ['schoolYear', 'inflationRate', 'budgetCap', 'plannedExpenses', 'notes', 'isActive'];
    const updates = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Validate school year if provided
    if (updates.schoolYear) {
      const [startYear, endYear] = updates.schoolYear.split(/[-–]/).map(Number);
      if (endYear !== startYear + 1) {
        throw new AppError('School year end must be one year after start year', 400, 'INVALID_SCHOOL_YEAR');
      }
    }

    // Validate and normalize planned expenses if provided
    if (updates.plannedExpenses) {
      updates.plannedExpenses = updates.plannedExpenses.map(expense => ({
        category: expense.category.toLowerCase().trim(),
        amount: expense.amount,
        description: expense.description || ''
      }));
    }

    Object.assign(plan, updates);
    await plan.save();

    logger.logDatabase('plan_updated', 'plans', {
      planId: plan._id,
      studentId: plan.studentId,
      updatedFields: Object.keys(updates),
      userId: req.user._id
    });

    res.json({
      success: true,
      data: { plan },
      message: 'Expense plan updated successfully'
    });
  } catch (error) {
    logger.logError('Update plan failed', error, {
      userId: req.user._id,
      planId: req.params.id,
      ip: req.ip
    });
    throw error;
  }
}));

/**
 * @route   DELETE /api/plans/:id
 * @desc    Delete an expense plan
 * @access  Private
 */
router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid plan ID')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Invalid plan ID', 400, 'INVALID_PLAN_ID');
  }

  try {
    const plan = await Plan.findById(req.params.id);
    
    if (!plan) {
      throw new AppError('Plan not found', 404, 'PLAN_NOT_FOUND');
    }

    // Check if user has edit access to this student
    const accessCheck = await ShareAccess.hasAccess(req.user._id, plan.studentId, 'edit');
    
    if (!accessCheck.hasAccess || !accessCheck.shareAccess?.canEditPlans) {
      throw new AppError('Plan not found or edit access denied', 404, 'PLAN_NOT_FOUND');
    }

    // Soft delete by setting isActive to false
    plan.isActive = false;
    await plan.save();

    logger.logDatabase('plan_deleted', 'plans', {
      planId: plan._id,
      studentId: plan.studentId,
      grade: plan.grade,
      userId: req.user._id
    });

    res.json({
      success: true,
      message: 'Expense plan deleted successfully'
    });
  } catch (error) {
    logger.logError('Delete plan failed', error, {
      userId: req.user._id,
      planId: req.params.id,
      ip: req.ip
    });
    throw error;
  }
}));

export default router;
