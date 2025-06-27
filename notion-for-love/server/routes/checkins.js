/**
 * Love Journey - Check-ins Routes
 *
 * Handles all check-in operations including CRUD operations,
 * partner responses, and streak tracking.
 *
 * Created: 2025-06-26
 * Version: 1.0.0
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const Checkin = require('../models/Checkin');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// @desc    Get all check-ins for user's relationship
// @route   GET /api/checkins
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { userId, days, category, mood } = req.query;
    const daysFilter = parseInt(days) || 30;

    // Build query
    const query = { userId: req.user._id };

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    if (mood) {
      query.mood = mood;
    }

    // Date filter
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysFilter);
    query.date = { $gte: startDate };

    const checkins = await Checkin.find(query)
      .populate('userId', 'name avatar')
      .populate('partnerResponse.respondedBy', 'name avatar')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: checkins.length,
      data: checkins
    });
  } catch (error) {
    console.error('Get check-ins error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get single check-in
// @route   GET /api/checkins/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const checkin = await Checkin.findOne({
      _id: req.params.id,
      userId: req.user._id
    })
      .populate('userId', 'name avatar')
      .populate('partnerResponse.respondedBy', 'name avatar');

    if (!checkin) {
      return res.status(404).json({
        success: false,
        error: 'Check-in not found'
      });
    }

    res.status(200).json({
      success: true,
      data: checkin
    });
  } catch (error) {
    console.error('Get check-in error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create new check-in
// @route   POST /api/checkins
// @access  Private
router.post('/', [
  body('mood').optional().isString().withMessage('Mood must be a string'),
  body('communication').optional().isInt({ min: 1, max: 10 }).withMessage('Communication rating must be between 1 and 10'),
  body('intimacy').optional().isInt({ min: 1, max: 10 }).withMessage('Intimacy rating must be between 1 and 10'),
  body('sharedGoals').optional().isInt({ min: 1, max: 10 }).withMessage('Shared goals rating must be between 1 and 10'),
  body('overallSatisfaction').optional().isInt({ min: 1, max: 10 }).withMessage('Overall satisfaction rating must be between 1 and 10'),
  body('notes').optional().isLength({ max: 2000 }).withMessage('Notes must be less than 2000 characters'),
  body('gratitude').optional().isLength({ max: 1000 }).withMessage('Gratitude must be less than 1000 characters'),
  body('concerns').optional().isLength({ max: 1000 }).withMessage('Concerns must be less than 1000 characters')
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

    const {
      mood,
      communication,
      intimacy,
      sharedGoals,
      overallSatisfaction,
      notes,
      gratitude,
      concerns,
      date
    } = req.body;

    // Transform health check-in data to fit the existing model
    const prompt = "Daily Relationship Health Check-in";
    const response = [
      gratitude ? `Gratitude: ${gratitude}` : '',
      concerns ? `Concerns: ${concerns}` : '',
      notes ? `Notes: ${notes}` : ''
    ].filter(Boolean).join('\n\n') || 'Health check-in completed';

    const category = 'communication'; // Default category for health check-ins
    const rating = overallSatisfaction || 5;

    const checkinData = {
      userId: req.user._id,
      date: date ? new Date(date) : new Date(),
      prompt,
      response,
      category,
      mood: mood || 'okay',
      rating,
      // Store additional health metrics as metadata
      metadata: {
        communication,
        intimacy,
        sharedGoals,
        overallSatisfaction
      }
    };

    const checkin = await Checkin.create(checkinData);

    // Calculate and update streak
    const streak = await Checkin.calculateStreak(req.user._id);
    checkin.streak = streak;
    await checkin.save();

    await checkin.populate('userId', 'name avatar');

    res.status(201).json({
      success: true,
      data: checkin
    });
  } catch (error) {
    console.error('Create check-in error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update check-in
// @route   PUT /api/checkins/:id
// @access  Private
router.put('/:id', [
  body('prompt').optional().trim().isLength({ min: 1, max: 500 }).withMessage('Prompt must be less than 500 characters'),
  body('response').optional().trim().isLength({ min: 1, max: 2000 }).withMessage('Response must be less than 2000 characters'),
  body('category').optional().isIn(['gratitude', 'communication', 'intimacy', 'goals', 'challenges', 'appreciation', 'growth', 'fun', 'support', 'future', 'reflection']).withMessage('Invalid category'),
  body('mood').optional().isIn(['amazing', 'great', 'good', 'okay', 'meh', 'concerned', 'frustrated']).withMessage('Invalid mood'),
  body('rating').optional().isInt({ min: 1, max: 10 }).withMessage('Rating must be between 1 and 10')
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

    const checkin = await Checkin.findOne({
      _id: req.params.id,

      userId: req.user._id // Users can only update their own check-ins
    });

    if (!checkin) {
      return res.status(404).json({
        success: false,
        error: 'Check-in not found'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        checkin[key] = req.body[key];
      }
    });

    await checkin.save();

    await checkin.populate('userId', 'name avatar');
    await checkin.populate('partnerResponse.respondedBy', 'name avatar');

    res.status(200).json({
      success: true,
      data: checkin
    });
  } catch (error) {
    console.error('Update check-in error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete check-in
// @route   DELETE /api/checkins/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const checkin = await Checkin.findOne({
      _id: req.params.id,

      userId: req.user._id // Users can only delete their own check-ins
    });

    if (!checkin) {
      return res.status(404).json({
        success: false,
        error: 'Check-in not found'
      });
    }

    await checkin.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Check-in deleted successfully'
    });
  } catch (error) {
    console.error('Delete check-in error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Add partner response to check-in
// @route   POST /api/checkins/:id/response
// @access  Private
router.post('/:id/response', [
  body('response').trim().isLength({ min: 1, max: 2000 }).withMessage('Response is required and must be less than 2000 characters'),
  body('rating').isInt({ min: 1, max: 10 }).withMessage('Rating must be between 1 and 10')
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

    const checkin = await Checkin.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!checkin) {
      return res.status(404).json({
        success: false,
        error: 'Check-in not found'
      });
    }

    // Check if user is trying to respond to their own check-in
    if (checkin.userId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: 'You cannot respond to your own check-in'
      });
    }

    await checkin.addPartnerResponse(req.user._id, req.body.response, req.body.rating);

    await checkin.populate('userId', 'name avatar');
    await checkin.populate('partnerResponse.respondedBy', 'name avatar');

    res.status(201).json({
      success: true,
      data: checkin
    });
  } catch (error) {
    console.error('Add partner response error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Award badge to check-in
// @route   POST /api/checkins/:id/badge
// @access  Private
router.post('/:id/badge', [
  body('badgeType').isIn(['consistency', 'honesty', 'empathy', 'growth', 'communication', 'gratitude', 'support', 'reflection', 'openness', 'commitment']).withMessage('Invalid badge type')
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

    const checkin = await Checkin.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!checkin) {
      return res.status(404).json({
        success: false,
        error: 'Check-in not found'
      });
    }

    await checkin.awardBadge(req.body.badgeType);

    res.status(200).json({
      success: true,
      data: checkin
    });
  } catch (error) {
    console.error('Award badge error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get user's check-in history
// @route   GET /api/checkins/history/:userId
// @access  Private
router.get('/history/:userId', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;

    const checkins = await Checkin.getUserHistory(req.params.userId, days)
      .populate('userId', 'name avatar')
      .populate('partnerResponse.respondedBy', 'name avatar');

    res.status(200).json({
      success: true,
      data: checkins
    });
  } catch (error) {
    console.error('Get check-in history error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get relationship check-ins
// @route   GET /api/checkins/relationship
// @access  Private
router.get('/relationship', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;

    const checkins = await Checkin.getUserCheckins(req.user._id, days);

    res.status(200).json({
      success: true,
      data: checkins
    });
  } catch (error) {
    console.error('Get relationship check-ins error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get user's current streak
// @route   GET /api/checkins/streak/:userId
// @access  Private
router.get('/streak/:userId', async (req, res) => {
  try {
    const streak = await Checkin.calculateStreak(req.params.userId);

    res.status(200).json({
      success: true,
      data: { streak }
    });
  } catch (error) {
    console.error('Get streak error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
