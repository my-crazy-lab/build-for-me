/**
 * Love Journey - Time Capsules Routes
 *
 * Handles all time capsule-related operations including creation,
 * retrieval, unlocking, and management.
 *
 * Created: 2025-06-27
 * Version: 1.0.0
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const TimeCapsule = require('../models/TimeCapsule');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// @desc    Get all time capsules for user
// @route   GET /api/time-capsules
// @access  Private
router.get('/', async (req, res) => {
  try {
    const timeCapsules = await TimeCapsule.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: timeCapsules
    });
  } catch (error) {
    console.error('Get time capsules error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create new time capsule
// @route   POST /api/time-capsules
// @access  Private
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('unlockDate').isISO8601().withMessage('Invalid unlock date'),
  body('type').optional().isIn(['anniversary', 'birthday', 'milestone', 'future-self', 'goals', 'dreams', 'love-letter', 'memory', 'advice', 'gratitude', 'other']).withMessage('Invalid type'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const {
      title,
      description,
      unlockDate,
      type,
      priority,
      contents,
      tags,
      recipients,
      isSpecial
    } = req.body;

    // Convert contents to message format for the existing model
    const message = description || '';
    const contentsText = contents && contents.length > 0
      ? contents.map(c => `${c.title}: ${c.content}`).join('\n\n')
      : '';
    const fullMessage = message + (contentsText ? '\n\n' + contentsText : '');

    const timeCapsule = await TimeCapsule.create({
      userId: req.user._id,
      title,
      message: fullMessage,
      unlockAt: new Date(unlockDate),
      category: type || 'other',
      tags: tags || [],
      shared: true,
      isUnlocked: false
    });

    res.status(201).json({
      success: true,
      data: timeCapsule
    });
  } catch (error) {
    console.error('Create time capsule error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get single time capsule
// @route   GET /api/time-capsules/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const timeCapsule = await TimeCapsule.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!timeCapsule) {
      return res.status(404).json({
        success: false,
        error: 'Time capsule not found'
      });
    }

    res.status(200).json({
      success: true,
      data: timeCapsule
    });
  } catch (error) {
    console.error('Get time capsule error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Unlock time capsule
// @route   PUT /api/time-capsules/:id/unlock
// @access  Private
router.put('/:id/unlock', async (req, res) => {
  try {
    const timeCapsule = await TimeCapsule.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!timeCapsule) {
      return res.status(404).json({
        success: false,
        error: 'Time capsule not found'
      });
    }

    // Check if unlock date has passed
    if (new Date() < timeCapsule.unlockAt) {
      return res.status(400).json({
        success: false,
        error: 'Time capsule cannot be unlocked yet'
      });
    }

    // Update status to unlocked
    timeCapsule.isUnlocked = true;
    timeCapsule.unlockedAt = new Date();
    await timeCapsule.save();

    res.status(200).json({
      success: true,
      data: timeCapsule
    });
  } catch (error) {
    console.error('Unlock time capsule error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete time capsule
// @route   DELETE /api/time-capsules/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const timeCapsule = await TimeCapsule.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!timeCapsule) {
      return res.status(404).json({
        success: false,
        error: 'Time capsule not found'
      });
    }

    await timeCapsule.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete time capsule error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
