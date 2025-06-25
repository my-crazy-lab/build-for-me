/**
 * Student management routes
 * 
 * This module handles all student-related endpoints:
 * - Create, read, update, delete student profiles
 * - Student validation and authorization
 * - Student statistics and summaries
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { authenticateJWT, requireAuth } from '../config/passport.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import Student from '../models/Student.js';
import ShareAccess from '../models/ShareAccess.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateJWT, requireAuth);

/**
 * @route   GET /api/students
 * @desc    Get all students for current user
 * @access  Private
 */
router.get('/', [
  query('includeInactive')
    .optional()
    .isBoolean()
    .withMessage('includeInactive must be a boolean'),
  query('includeShared')
    .optional()
    .isBoolean()
    .withMessage('includeShared must be a boolean')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400, 'VALIDATION_ERROR');
  }

  try {
    const { includeInactive = false, includeShared = true } = req.query;
    
    // Get user's own students
    const ownStudents = await Student.findByUser(
      req.user._id, 
      includeInactive === 'true'
    );

    let sharedStudents = [];
    
    // Get shared students if requested
    if (includeShared === 'true') {
      const shareAccesses = await ShareAccess.findBySharedUser(req.user._id, 'accepted');
      sharedStudents = shareAccesses.map(share => ({
        ...share.studentId.toObject(),
        isShared: true,
        shareAccess: {
          permission: share.permission,
          canViewPlans: share.canViewPlans,
          canViewExpenses: share.canViewExpenses,
          canViewReports: share.canViewReports,
          canEditPlans: share.canEditPlans,
          canEditExpenses: share.canEditExpenses,
          sharedBy: share.ownerUserId
        }
      }));
    }

    // Mark own students
    const ownStudentsWithFlag = ownStudents.map(student => ({
      ...student.toObject(),
      isShared: false,
      isOwner: true
    }));

    const allStudents = [...ownStudentsWithFlag, ...sharedStudents];

    res.json({
      success: true,
      data: {
        students: allStudents,
        total: allStudents.length,
        ownCount: ownStudents.length,
        sharedCount: sharedStudents.length
      }
    });
  } catch (error) {
    logger.logError('Get students failed', error, {
      userId: req.user._id,
      ip: req.ip
    });
    throw error;
  }
}));

/**
 * @route   POST /api/students
 * @desc    Create a new student profile
 * @access  Private
 */
router.post('/', [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Student name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('birthYear')
    .isInt({ min: 1990, max: new Date().getFullYear() })
    .withMessage('Birth year must be between 1990 and current year'),
  body('entryYear')
    .isInt({ min: 2000, max: new Date().getFullYear() + 10 })
    .withMessage('Entry year must be between 2000 and 10 years from now'),
  body('currentGrade')
    .isInt({ min: 1, max: 12 })
    .withMessage('Current grade must be between 1 and 12'),
  body('schoolType')
    .isIn(['public', 'private', 'international'])
    .withMessage('School type must be public, private, or international'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  body('avatarUrl')
    .optional()
    .isURL()
    .withMessage('Avatar URL must be a valid URL')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400, 'VALIDATION_ERROR');
  }

  try {
    const { name, birthYear, entryYear, currentGrade, schoolType, notes, avatarUrl } = req.body;

    // Additional validation: entry year should be reasonable based on birth year
    if (entryYear < birthYear + 5) {
      throw new AppError('Entry year must be at least 5 years after birth year', 400, 'INVALID_ENTRY_YEAR');
    }

    const student = new Student({
      userId: req.user._id,
      name,
      birthYear,
      entryYear,
      currentGrade,
      schoolType,
      notes: notes || '',
      avatarUrl: avatarUrl || null
    });

    await student.save();

    logger.logDatabase('student_created', 'students', {
      studentId: student._id,
      userId: req.user._id,
      name: student.name,
      grade: student.currentGrade
    });

    res.status(201).json({
      success: true,
      data: { student },
      message: 'Student profile created successfully'
    });
  } catch (error) {
    logger.logError('Create student failed', error, {
      userId: req.user._id,
      ip: req.ip
    });
    throw error;
  }
}));

/**
 * @route   GET /api/students/:id
 * @desc    Get a specific student profile
 * @access  Private
 */
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid student ID')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Invalid student ID', 400, 'INVALID_STUDENT_ID');
  }

  try {
    const studentId = req.params.id;

    // Check if user has access to this student
    const accessCheck = await ShareAccess.hasAccess(req.user._id, studentId, 'view');
    
    if (!accessCheck.hasAccess) {
      throw new AppError('Student not found or access denied', 404, 'STUDENT_NOT_FOUND');
    }

    const student = await Student.findById(studentId);
    
    if (!student) {
      throw new AppError('Student not found', 404, 'STUDENT_NOT_FOUND');
    }

    // Add access information to response
    const studentData = {
      ...student.toObject(),
      isOwner: accessCheck.isOwner,
      permission: accessCheck.permission,
      gradeProgression: student.getGradeProgression()
    };

    if (accessCheck.shareAccess) {
      studentData.shareAccess = {
        canViewPlans: accessCheck.shareAccess.canViewPlans,
        canViewExpenses: accessCheck.shareAccess.canViewExpenses,
        canViewReports: accessCheck.shareAccess.canViewReports,
        canEditPlans: accessCheck.shareAccess.canEditPlans,
        canEditExpenses: accessCheck.shareAccess.canEditExpenses
      };
    }

    res.json({
      success: true,
      data: { student: studentData }
    });
  } catch (error) {
    logger.logError('Get student failed', error, {
      userId: req.user._id,
      studentId: req.params.id,
      ip: req.ip
    });
    throw error;
  }
}));

/**
 * @route   PATCH /api/students/:id
 * @desc    Update student profile
 * @access  Private
 */
router.patch('/:id', [
  param('id').isMongoId().withMessage('Invalid student ID'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Student name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('birthYear')
    .optional()
    .isInt({ min: 1990, max: new Date().getFullYear() })
    .withMessage('Birth year must be between 1990 and current year'),
  body('entryYear')
    .optional()
    .isInt({ min: 2000, max: new Date().getFullYear() + 10 })
    .withMessage('Entry year must be between 2000 and 10 years from now'),
  body('currentGrade')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Current grade must be between 1 and 12'),
  body('schoolType')
    .optional()
    .isIn(['public', 'private', 'international'])
    .withMessage('School type must be public, private, or international'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  body('avatarUrl')
    .optional()
    .isURL()
    .withMessage('Avatar URL must be a valid URL'),
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
    const studentId = req.params.id;

    // Check if user has edit access to this student
    const accessCheck = await ShareAccess.hasAccess(req.user._id, studentId, 'edit');
    
    if (!accessCheck.hasAccess) {
      throw new AppError('Student not found or edit access denied', 404, 'STUDENT_NOT_FOUND');
    }

    const student = await Student.findById(studentId);
    
    if (!student) {
      throw new AppError('Student not found', 404, 'STUDENT_NOT_FOUND');
    }

    // Update fields
    const allowedFields = ['name', 'birthYear', 'entryYear', 'currentGrade', 'schoolType', 'notes', 'avatarUrl', 'isActive'];
    const updates = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Additional validation for related fields
    if (updates.birthYear && updates.entryYear && updates.entryYear < updates.birthYear + 5) {
      throw new AppError('Entry year must be at least 5 years after birth year', 400, 'INVALID_ENTRY_YEAR');
    }

    Object.assign(student, updates);
    await student.save();

    logger.logDatabase('student_updated', 'students', {
      studentId: student._id,
      userId: req.user._id,
      updatedFields: Object.keys(updates)
    });

    res.json({
      success: true,
      data: { student },
      message: 'Student profile updated successfully'
    });
  } catch (error) {
    logger.logError('Update student failed', error, {
      userId: req.user._id,
      studentId: req.params.id,
      ip: req.ip
    });
    throw error;
  }
}));

/**
 * @route   DELETE /api/students/:id
 * @desc    Delete student profile
 * @access  Private
 */
router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid student ID')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Invalid student ID', 400, 'INVALID_STUDENT_ID');
  }

  try {
    const studentId = req.params.id;

    // Only owners can delete students
    const student = await Student.findOne({ _id: studentId, userId: req.user._id });
    
    if (!student) {
      throw new AppError('Student not found or access denied', 404, 'STUDENT_NOT_FOUND');
    }

    // Soft delete by setting isActive to false
    student.isActive = false;
    await student.save();

    logger.logDatabase('student_deleted', 'students', {
      studentId: student._id,
      userId: req.user._id,
      name: student.name
    });

    res.json({
      success: true,
      message: 'Student profile deleted successfully'
    });
  } catch (error) {
    logger.logError('Delete student failed', error, {
      userId: req.user._id,
      studentId: req.params.id,
      ip: req.ip
    });
    throw error;
  }
}));

/**
 * @route   POST /api/students/:id/advance-grade
 * @desc    Advance student to next grade
 * @access  Private
 */
router.post('/:id/advance-grade', [
  param('id').isMongoId().withMessage('Invalid student ID')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Invalid student ID', 400, 'INVALID_STUDENT_ID');
  }

  try {
    const studentId = req.params.id;

    // Check if user has edit access to this student
    const accessCheck = await ShareAccess.hasAccess(req.user._id, studentId, 'edit');
    
    if (!accessCheck.hasAccess) {
      throw new AppError('Student not found or edit access denied', 404, 'STUDENT_NOT_FOUND');
    }

    const student = await Student.findById(studentId);
    
    if (!student) {
      throw new AppError('Student not found', 404, 'STUDENT_NOT_FOUND');
    }

    if (student.currentGrade >= 12) {
      throw new AppError('Student is already in grade 12', 400, 'ALREADY_MAX_GRADE');
    }

    await student.advanceGrade();

    res.json({
      success: true,
      data: { student },
      message: `Student advanced to grade ${student.currentGrade}`
    });
  } catch (error) {
    logger.logError('Advance grade failed', error, {
      userId: req.user._id,
      studentId: req.params.id,
      ip: req.ip
    });
    throw error;
  }
}));

export default router;
