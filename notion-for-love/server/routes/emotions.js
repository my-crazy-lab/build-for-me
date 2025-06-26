/**
 * Love Journey - Emotions Routes
 *
 * Handles all emotion tracking operations including CRUD operations,
 * mood analysis, and wellness trends.
 *
 * Created: 2025-06-26
 * Version: 1.0.0
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const Emotion = require('../models/Emotion');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// @desc    Get all emotions for user's relationship
// @route   GET /api/emotions
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { userId, days, mood } = req.query;
    const daysFilter = parseInt(days) || 30;

    // Build query
    const query = { userId: req.user._id };

    if (userId) {
      query.userId = userId;
    }

    if (mood) {
      query.mood = mood;
    }

    // Date filter
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysFilter);
    query.date = { $gte: startDate };

    const emotions = await Emotion.find(query)
      .populate('userId', 'name avatar')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: emotions.length,
      data: emotions
    });
  } catch (error) {
    console.error('Get emotions error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get single emotion entry
// @route   GET /api/emotions/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const emotion = await Emotion.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('userId', 'name avatar');

    if (!emotion) {
      return res.status(404).json({
        success: false,
        error: 'Emotion entry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: emotion
    });
  } catch (error) {
    console.error('Get emotion error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create new emotion entry
// @route   POST /api/emotions
// @access  Private
router.post('/', [
  body('mood').isIn(['amazing', 'great', 'good', 'okay', 'meh', 'bad', 'terrible', 'excited', 'happy', 'content', 'calm', 'neutral', 'anxious', 'sad', 'angry', 'frustrated', 'overwhelmed', 'lonely', 'loved', 'grateful', 'hopeful', 'confident', 'stressed', 'tired']).withMessage('Invalid mood'),
  body('intensity').isInt({ min: 1, max: 10 }).withMessage('Intensity must be between 1 and 10'),
  body('note').optional().isLength({ max: 500 }).withMessage('Note must be less than 500 characters'),
  body('relationshipSatisfaction').optional().isInt({ min: 1, max: 10 }).withMessage('Relationship satisfaction must be between 1 and 10'),
  body('communicationQuality').optional().isInt({ min: 1, max: 10 }).withMessage('Communication quality must be between 1 and 10'),
  body('intimacyLevel').optional().isInt({ min: 1, max: 10 }).withMessage('Intimacy level must be between 1 and 10'),
  body('stressLevel').optional().isInt({ min: 1, max: 10 }).withMessage('Stress level must be between 1 and 10'),
  body('energyLevel').optional().isInt({ min: 1, max: 10 }).withMessage('Energy level must be between 1 and 10'),
  body('sleepQuality').optional().isInt({ min: 1, max: 10 }).withMessage('Sleep quality must be between 1 and 10')
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

    const emotionData = {
      ...req.body,

      userId: req.user._id
    };

    const emotion = await Emotion.create(emotionData);

    await emotion.populate('userId', 'name avatar');

    res.status(201).json({
      success: true,
      data: emotion
    });
  } catch (error) {
    console.error('Create emotion error:', error);

    // Handle duplicate entry error
    if (error.name === 'ValidationError' && error.message.includes('one emotion entry per day')) {
      return res.status(400).json({
        success: false,
        error: 'You can only create one emotion entry per day'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update emotion entry
// @route   PUT /api/emotions/:id
// @access  Private
router.put('/:id', [
  body('mood').optional().isIn(['amazing', 'great', 'good', 'okay', 'meh', 'bad', 'terrible', 'excited', 'happy', 'content', 'calm', 'neutral', 'anxious', 'sad', 'angry', 'frustrated', 'overwhelmed', 'lonely', 'loved', 'grateful', 'hopeful', 'confident', 'stressed', 'tired']).withMessage('Invalid mood'),
  body('intensity').optional().isInt({ min: 1, max: 10 }).withMessage('Intensity must be between 1 and 10'),
  body('note').optional().isLength({ max: 500 }).withMessage('Note must be less than 500 characters'),
  body('relationshipSatisfaction').optional().isInt({ min: 1, max: 10 }).withMessage('Relationship satisfaction must be between 1 and 10'),
  body('communicationQuality').optional().isInt({ min: 1, max: 10 }).withMessage('Communication quality must be between 1 and 10'),
  body('intimacyLevel').optional().isInt({ min: 1, max: 10 }).withMessage('Intimacy level must be between 1 and 10'),
  body('stressLevel').optional().isInt({ min: 1, max: 10 }).withMessage('Stress level must be between 1 and 10'),
  body('energyLevel').optional().isInt({ min: 1, max: 10 }).withMessage('Energy level must be between 1 and 10'),
  body('sleepQuality').optional().isInt({ min: 1, max: 10 }).withMessage('Sleep quality must be between 1 and 10')
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

    const emotion = await Emotion.findOne({
      _id: req.params.id,

      userId: req.user._id // Users can only update their own emotions
    });

    if (!emotion) {
      return res.status(404).json({
        success: false,
        error: 'Emotion entry not found'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        emotion[key] = req.body[key];
      }
    });

    await emotion.save();

    await emotion.populate('userId', 'name avatar');

    res.status(200).json({
      success: true,
      data: emotion
    });
  } catch (error) {
    console.error('Update emotion error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete emotion entry
// @route   DELETE /api/emotions/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const emotion = await Emotion.findOne({
      _id: req.params.id,

      userId: req.user._id // Users can only delete their own emotions
    });

    if (!emotion) {
      return res.status(404).json({
        success: false,
        error: 'Emotion entry not found'
      });
    }

    await emotion.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Emotion entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete emotion error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get user's emotion history
// @route   GET /api/emotions/history/:userId
// @access  Private
router.get('/history/:userId', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;

    const emotions = await Emotion.getUserHistory(req.params.userId, days)
      .populate('userId', 'name avatar');

    res.status(200).json({
      success: true,
      data: emotions
    });
  } catch (error) {
    console.error('Get emotion history error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get relationship emotion trends
// @route   GET /api/emotions/trends
// @access  Private
router.get('/trends', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;

    const trends = await Emotion.getUserTrends(req.user._id, days);

    res.status(200).json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Get emotion trends error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get mood statistics
// @route   GET /api/emotions/stats/mood
// @access  Private
router.get('/stats/mood', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const userId = req.query.userId || null;

    const stats = await Emotion.getMoodStats(req.user._id, days);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get mood stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get wellness trends
// @route   GET /api/emotions/stats/wellness
// @access  Private
router.get('/stats/wellness', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const userId = req.query.userId || null;

    const trends = await Emotion.getWellnessTrends(req.user._id, days);

    res.status(200).json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Get wellness trends error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get today's emotion entry for user
// @route   GET /api/emotions/today
// @access  Private
router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const emotion = await Emotion.findOne({
      userId: req.user._id,

      date: {
        $gte: today,
        $lt: tomorrow
      }
    }).populate('userId', 'name avatar');

    res.status(200).json({
      success: true,
      data: emotion
    });
  } catch (error) {
    console.error('Get today emotion error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
