/**
 * Sharing and collaboration routes
 * 
 * This module handles all sharing-related endpoints:
 * - Share student data with other users
 * - Manage sharing permissions
 * - Accept/decline invitations
 * - View shared students
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { authenticateJWT, requireAuth } from '../config/passport.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import ShareAccess from '../models/ShareAccess.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateJWT, requireAuth);

/**
 * @route   POST /api/students/:studentId/share
 * @desc    Share student data with another user
 * @access  Private
 */
router.post('/students/:studentId/share', [
  param('studentId').isMongoId().withMessage('Invalid student ID'),
  body('sharedWithEmail').isEmail().withMessage('Valid email is required'),
  body('permission').isIn(['view', 'edit']).withMessage('Permission must be view or edit'),
  body('notes').optional().trim().isLength({ max: 500 })
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400, 'VALIDATION_ERROR');
  }

  try {
    const { studentId } = req.params;
    const { sharedWithEmail, permission, notes } = req.body;

    // Check if user owns this student
    const student = await Student.findOne({ _id: studentId, userId: req.user._id });
    
    if (!student) {
      throw new AppError('Student not found or access denied', 404, 'STUDENT_NOT_FOUND');
    }

    // Check if already shared with this email
    const existingShare = await ShareAccess.findOne({
      studentId,
      sharedWithEmail: sharedWithEmail.toLowerCase()
    });

    if (existingShare) {
      throw new AppError('Student is already shared with this email', 400, 'ALREADY_SHARED');
    }

    // Check if trying to share with self
    if (sharedWithEmail.toLowerCase() === req.user.email.toLowerCase()) {
      throw new AppError('Cannot share with yourself', 400, 'CANNOT_SHARE_WITH_SELF');
    }

    // Check if shared user exists
    const sharedUser = await User.findByEmail(sharedWithEmail);

    const shareAccess = new ShareAccess({
      ownerUserId: req.user._id,
      sharedWithEmail: sharedWithEmail.toLowerCase(),
      sharedWithUserId: sharedUser?._id || null,
      studentId,
      permission,
      notes: notes || ''
    });

    await shareAccess.save();

    res.status(201).json({
      success: true,
      data: { shareAccess },
      message: 'Student shared successfully'
    });
  } catch (error) {
    logger.logError('Share student failed', error, {
      userId: req.user._id,
      studentId: req.params.studentId,
      ip: req.ip
    });
    throw error;
  }
}));

/**
 * @route   GET /api/shared
 * @desc    Get all students shared with current user
 * @access  Private
 */
router.get('/shared', asyncHandler(async (req, res) => {
  try {
    const sharedAccesses = await ShareAccess.findBySharedUser(req.user._id, 'accepted');

    res.json({
      success: true,
      data: {
        sharedStudents: sharedAccesses,
        total: sharedAccesses.length
      }
    });
  } catch (error) {
    logger.logError('Get shared students failed', error, {
      userId: req.user._id,
      ip: req.ip
    });
    throw error;
  }
}));

/**
 * @route   GET /api/students/:studentId/shares
 * @desc    Get all shares for a student (owner only)
 * @access  Private
 */
router.get('/students/:studentId/shares', [
  param('studentId').isMongoId().withMessage('Invalid student ID')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Invalid student ID', 400, 'INVALID_STUDENT_ID');
  }

  try {
    const { studentId } = req.params;

    // Check if user owns this student
    const student = await Student.findOne({ _id: studentId, userId: req.user._id });
    
    if (!student) {
      throw new AppError('Student not found or access denied', 404, 'STUDENT_NOT_FOUND');
    }

    const shares = await ShareAccess.find({ studentId })
      .populate('sharedWithUserId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        shares,
        total: shares.length,
        studentId
      }
    });
  } catch (error) {
    logger.logError('Get student shares failed', error, {
      userId: req.user._id,
      studentId: req.params.studentId,
      ip: req.ip
    });
    throw error;
  }
}));

/**
 * @route   PATCH /api/share/:shareId/revoke
 * @desc    Revoke sharing access
 * @access  Private
 */
router.patch('/share/:shareId/revoke', [
  param('shareId').isMongoId().withMessage('Invalid share ID')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Invalid share ID', 400, 'INVALID_SHARE_ID');
  }

  try {
    const shareAccess = await ShareAccess.findOne({
      _id: req.params.shareId,
      ownerUserId: req.user._id
    });

    if (!shareAccess) {
      throw new AppError('Share not found or access denied', 404, 'SHARE_NOT_FOUND');
    }

    await shareAccess.revokeAccess();

    res.json({
      success: true,
      data: { shareAccess },
      message: 'Sharing access revoked successfully'
    });
  } catch (error) {
    logger.logError('Revoke share failed', error, {
      userId: req.user._id,
      shareId: req.params.shareId,
      ip: req.ip
    });
    throw error;
  }
}));

export default router;
