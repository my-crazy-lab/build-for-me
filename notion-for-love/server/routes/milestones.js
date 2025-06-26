/**
 * Love Journey - Milestones Routes
 *
 * Handles all milestone-related operations including CRUD operations,
 * media management, and timeline features.
 *
 * Created: 2025-06-26
 * Version: 1.0.0
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const Milestone = require('../models/Milestone');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// @desc    Get all milestones for user's relationship
// @route   GET /api/milestones
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { category, search, dateFrom, dateTo, tags, favorites } = req.query;

    // Build query
    const query = { userId: req.user._id };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (favorites === 'true') {
      query.isFavorite = true;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }

    // Tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      query.tags = { $in: tagArray };
    }

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const milestones = await Milestone.find(query)
      .populate('createdBy', 'name avatar')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: milestones.length,
      data: milestones
    });
  } catch (error) {
    console.error('Get milestones error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get single milestone
// @route   GET /api/milestones/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const milestone = await Milestone.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('createdBy', 'name avatar');

    if (!milestone) {
      return res.status(404).json({
        success: false,
        error: 'Milestone not found'
      });
    }

    res.status(200).json({
      success: true,
      data: milestone
    });
  } catch (error) {
    console.error('Get milestone error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create new milestone
// @route   POST /api/milestones
// @access  Private
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('location').optional().isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
  body('category').optional().isIn(['first-meeting', 'first-date', 'relationship-official', 'first-kiss', 'first-fight', 'moving-in', 'engagement', 'wedding', 'honeymoon', 'anniversary', 'pregnancy', 'birth', 'family', 'travel', 'achievement', 'challenge', 'celebration', 'other']).withMessage('Invalid category'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('notes').optional().isLength({ max: 2000 }).withMessage('Notes must be less than 2000 characters')
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

    const milestoneData = {
      ...req.body,
      userId: req.user._id,
      createdBy: req.user._id
    };

    const milestone = await Milestone.create(milestoneData);

    await milestone.populate('createdBy', 'name avatar');

    res.status(201).json({
      success: true,
      data: milestone
    });
  } catch (error) {
    console.error('Create milestone error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update milestone
// @route   PUT /api/milestones/:id
// @access  Private
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Title must be less than 100 characters'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('date').optional().isISO8601().withMessage('Invalid date'),
  body('location').optional().isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
  body('category').optional().isIn(['first-meeting', 'first-date', 'relationship-official', 'first-kiss', 'first-fight', 'moving-in', 'engagement', 'wedding', 'honeymoon', 'anniversary', 'pregnancy', 'birth', 'family', 'travel', 'achievement', 'challenge', 'celebration', 'other']).withMessage('Invalid category'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('notes').optional().isLength({ max: 2000 }).withMessage('Notes must be less than 2000 characters')
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

    const milestone = await Milestone.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!milestone) {
      return res.status(404).json({
        success: false,
        error: 'Milestone not found'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        milestone[key] = req.body[key];
      }
    });

    milestone.lastEditedBy = req.user._id;
    milestone.lastEditedAt = new Date();

    await milestone.save();

    await milestone.populate('createdBy', 'name avatar');

    res.status(200).json({
      success: true,
      data: milestone
    });
  } catch (error) {
    console.error('Update milestone error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete milestone
// @route   DELETE /api/milestones/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const milestone = await Milestone.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!milestone) {
      return res.status(404).json({
        success: false,
        error: 'Milestone not found'
      });
    }

    await milestone.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Milestone deleted successfully'
    });
  } catch (error) {
    console.error('Delete milestone error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Toggle milestone favorite status
// @route   PATCH /api/milestones/:id/favorite
// @access  Private
router.patch('/:id/favorite', async (req, res) => {
  try {
    const milestone = await Milestone.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!milestone) {
      return res.status(404).json({
        success: false,
        error: 'Milestone not found'
      });
    }

    await milestone.toggleFavorite();

    res.status(200).json({
      success: true,
      data: milestone
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get milestone statistics
// @route   GET /api/milestones/stats
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      totalMilestones,
      favoriteCount,
      categoryStats
    ] = await Promise.all([
      Milestone.countDocuments({ userId }),
      Milestone.countDocuments({ userId, isFavorite: true }),
      Milestone.aggregate([
        { $match: { userId } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    const stats = {
      total: totalMilestones,
      favorites: favoriteCount,
      categoryBreakdown: categoryStats
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get milestone stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
