/**
 * Love Journey - Goals Routes
 *
 * Handles all goal-related operations including CRUD operations,
 * milestone management, and progress tracking.
 *
 * Created: 2025-06-26
 * Version: 1.0.0
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const Goal = require('../models/Goal');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// @desc    Get all goals for user's relationship
// @route   GET /api/goals
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { category, status, search, priority } = req.query;

    // Build query
    const query = { userId: req.user._id };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    // Build search query
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const goals = await Goal.find(query)
      .populate('createdBy', 'name avatar')
      .populate('assignedTo', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: goals.length,
      data: goals
    });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get goal categories with counts
// @route   GET /api/goals/categories
// @access  Private
router.get('/categories', async (req, res) => {
  try {
    const userId = req.user._id;

    const categories = await Goal.aggregate([
      { $match: { userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Add 'all' category
    const totalCount = await Goal.countDocuments({ userId });
    const categoriesWithAll = [
      { _id: 'all', count: totalCount },
      ...categories
    ];

    res.status(200).json({
      success: true,
      data: categoriesWithAll
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get single goal
// @route   GET /api/goals/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id
    })
      .populate('createdBy', 'name avatar')
      .populate('assignedTo', 'name avatar');

    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    res.status(200).json({
      success: true,
      data: goal
    });
  } catch (error) {
    console.error('Get goal error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create new goal
// @route   POST /api/goals
// @access  Private
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('category').isIn(['travel', 'finance', 'health', 'family', 'learning', 'career', 'home', 'romantic', 'adventure', 'spiritual', 'social', 'hobby', 'other']).withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('targetDate').optional().isISO8601().withMessage('Invalid target date'),
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

    const goalData = {
      ...req.body,
      userId: req.user._id,
      createdBy: req.user._id,
      assignedTo: req.body.assignedTo || [req.user._id]
    };

    const goal = await Goal.create(goalData);

    await goal.populate('createdBy', 'name avatar');
    await goal.populate('assignedTo', 'name avatar');

    res.status(201).json({
      success: true,
      data: goal
    });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Title must be less than 100 characters'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('category').optional().isIn(['travel', 'finance', 'health', 'family', 'learning', 'career', 'home', 'romantic', 'adventure', 'spiritual', 'social', 'hobby', 'other']).withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('status').optional().isIn(['active', 'completed', 'paused', 'cancelled']).withMessage('Invalid status'),
  body('targetDate').optional().isISO8601().withMessage('Invalid target date'),
  body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100'),
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

    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        goal[key] = req.body[key];
      }
    });

    goal.lastEditedBy = req.user._id;
    goal.lastEditedAt = new Date();

    await goal.save();

    await goal.populate('createdBy', 'name avatar');
    await goal.populate('assignedTo', 'name avatar');

    res.status(200).json({
      success: true,
      data: goal
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    await goal.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update goal progress
// @route   PATCH /api/goals/:id/progress
// @access  Private
router.patch('/:id/progress', [
  body('progress').isInt({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100')
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

    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    await goal.updateProgress(req.body.progress);

    await goal.populate('createdBy', 'name avatar');
    await goal.populate('assignedTo', 'name avatar');

    res.status(200).json({
      success: true,
      data: goal
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Add milestone to goal
// @route   POST /api/goals/:id/milestones
// @access  Private
router.post('/:id/milestones', [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Milestone title is required and must be less than 100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('targetDate').optional().isISO8601().withMessage('Invalid target date')
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

    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    await goal.addMilestone(req.body);

    await goal.populate('createdBy', 'name avatar');
    await goal.populate('assignedTo', 'name avatar');

    res.status(201).json({
      success: true,
      data: goal
    });
  } catch (error) {
    console.error('Add milestone error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update milestone
// @route   PUT /api/goals/:id/milestones/:milestoneId
// @access  Private
router.put('/:id/milestones/:milestoneId', [
  body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Milestone title must be less than 100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('targetDate').optional().isISO8601().withMessage('Invalid target date')
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

    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    const milestone = goal.milestones.id(req.params.milestoneId);
    if (!milestone) {
      return res.status(404).json({
        success: false,
        error: 'Milestone not found'
      });
    }

    // Update milestone fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        milestone[key] = req.body[key];
      }
    });

    await goal.save();

    await goal.populate('createdBy', 'name avatar');
    await goal.populate('assignedTo', 'name avatar');

    res.status(200).json({
      success: true,
      data: goal
    });
  } catch (error) {
    console.error('Update milestone error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Complete milestone
// @route   PATCH /api/goals/:id/milestones/:milestoneId/complete
// @access  Private
router.patch('/:id/milestones/:milestoneId/complete', async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    await goal.completeMilestone(req.params.milestoneId);

    await goal.populate('createdBy', 'name avatar');
    await goal.populate('assignedTo', 'name avatar');

    res.status(200).json({
      success: true,
      data: goal
    });
  } catch (error) {
    console.error('Complete milestone error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get goal statistics
// @route   GET /api/goals/stats
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      totalGoals,
      activeGoals,
      completedGoals,
      pausedGoals,
      cancelledGoals,
      overdueGoals
    ] = await Promise.all([
      Goal.countDocuments({ userId }),
      Goal.countDocuments({ userId, status: 'active' }),
      Goal.countDocuments({ userId, status: 'completed' }),
      Goal.countDocuments({ userId, status: 'paused' }),
      Goal.countDocuments({ userId, status: 'cancelled' }),
      Goal.countDocuments({
        userId,
        status: 'active',
        targetDate: { $lt: new Date() }
      })
    ]);

    // Calculate average progress
    const goalsWithProgress = await Goal.find({ userId }, 'progress');
    const avgProgress = goalsWithProgress.length > 0
      ? Math.round(goalsWithProgress.reduce((sum, goal) => sum + goal.progress, 0) / goalsWithProgress.length)
      : 0;

    // Get category breakdown
    const categoryStats = await Goal.aggregate([
      { $match: { userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const stats = {
      total: totalGoals,
      active: activeGoals,
      completed: completedGoals,
      paused: pausedGoals,
      cancelled: cancelledGoals,
      overdue: overdueGoals,
      averageProgress: avgProgress,
      completionRate: totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0,
      categoryBreakdown: categoryStats
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get goal stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
