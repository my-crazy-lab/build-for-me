/**
 * Love Journey - Events Routes
 *
 * Handles all event-related operations including CRUD operations,
 * calendar management, and reminder features.
 *
 * Created: 2025-06-26
 * Version: 1.0.0
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// @desc    Get all events for user's relationship
// @route   GET /api/events
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { type, dateFrom, dateTo, tags, upcoming, status } = req.query;

    // Build query
    const query = { userId: req.user._id };

    if (type && type !== 'all') {
      query.type = type;
    }

    // Status filter for planning board categories
    if (status && status !== 'all') {
      query.status = status;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }

    // Upcoming events filter
    if (upcoming === 'true') {
      const now = new Date();
      query.date = { $gte: now };
      query.status = { $in: ['confirmed', 'planning'] }; // Only actual events
    }

    // Tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      query.tags = { $in: tagArray };
    }

    const events = await Event.find(query)
      .populate('createdBy', 'name avatar')
      .populate('attendees.userId', 'name avatar')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get upcoming plans (confirmed and planning events)
// @route   GET /api/events/upcoming-plans
// @access  Private
router.get('/upcoming-plans', async (req, res) => {
  try {
    const query = {
      userId: req.user._id,
      status: { $in: ['confirmed', 'planning'] },
      date: { $gte: new Date() }
    };

    const events = await Event.find(query)
      .populate('createdBy', 'name avatar')
      .sort({ date: 1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Get upcoming plans error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get date ideas
// @route   GET /api/events/date-ideas
// @access  Private
router.get('/date-ideas', async (req, res) => {
  try {
    const query = {
      userId: req.user._id,
      status: 'idea'
    };

    const events = await Event.find(query)
      .populate('createdBy', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Get date ideas error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get bucket list items
// @route   GET /api/events/bucket-list
// @access  Private
router.get('/bucket-list', async (req, res) => {
  try {
    const query = {
      userId: req.user._id,
      status: 'bucket-list'
    };

    const events = await Event.find(query)
      .populate('createdBy', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Get bucket list error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      userId: req.user._id
    })
      .populate('createdBy', 'name avatar')
      .populate('attendees.userId', 'name avatar');

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create new event
// @route   POST /api/events
// @access  Private
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('endDate').optional().isISO8601().withMessage('Invalid end date'),
  body('type').isIn(['anniversary', 'birthday', 'date-night', 'family', 'travel', 'milestone', 'appointment', 'celebration', 'reminder', 'other']).withMessage('Invalid event type'),
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

    const eventData = {
      ...req.body,
      userId: req.user._id,
      createdBy: req.user._id,
      attendees: req.body.attendees || [{ userId: req.user._id, status: 'accepted' }]
    };

    const event = await Event.create(eventData);

    await event.populate('createdBy', 'name avatar');
    await event.populate('attendees.userId', 'name avatar');

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Title must be less than 100 characters'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('date').optional().isISO8601().withMessage('Invalid date'),
  body('endDate').optional().isISO8601().withMessage('Invalid end date'),
  body('type').optional().isIn(['anniversary', 'birthday', 'date-night', 'family', 'travel', 'milestone', 'appointment', 'celebration', 'reminder', 'other']).withMessage('Invalid event type'),
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

    const event = await Event.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        event[key] = req.body[key];
      }
    });

    await event.save();

    await event.populate('createdBy', 'name avatar');
    await event.populate('attendees.userId', 'name avatar');

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get upcoming events
// @route   GET /api/events/upcoming
// @access  Private
router.get('/upcoming', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const limit = parseInt(req.query.limit) || 10;

    const events = await Event.getUpcoming(req.user._id, days)
      .populate('createdBy', 'name avatar')
      .populate('attendees.userId', 'name avatar')
      .limit(limit);

    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update attendee status
// @route   PATCH /api/events/:id/attendees/:userId
// @access  Private
router.patch('/:id/attendees/:userId', [
  body('status').isIn(['pending', 'accepted', 'declined', 'maybe']).withMessage('Invalid status')
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

    const event = await Event.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    await event.updateAttendeeStatus(req.params.userId, req.body.status);

    await event.populate('createdBy', 'name avatar');
    await event.populate('attendees.userId', 'name avatar');

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Update attendee status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Add reminder to event
// @route   POST /api/events/:id/reminders
// @access  Private
router.post('/:id/reminders', [
  body('method').isIn(['email', 'push', 'sms']).withMessage('Invalid reminder method'),
  body('offsetMinutes').isInt({ min: 0 }).withMessage('Offset minutes must be a positive integer')
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

    const event = await Event.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    await event.addReminder(req.body.method, req.body.offsetMinutes);

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Add reminder error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get event statistics
// @route   GET /api/events/stats
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const [
      totalEvents,
      upcomingEvents,
      pastEvents,
      typeStats
    ] = await Promise.all([
      Event.countDocuments({ userId }),
      Event.countDocuments({ userId, date: { $gte: now } }),
      Event.countDocuments({ userId, date: { $lt: now } }),
      Event.aggregate([
        { $match: { userId } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    const stats = {
      total: totalEvents,
      upcoming: upcomingEvents,
      past: pastEvents,
      typeBreakdown: typeStats
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get event stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
