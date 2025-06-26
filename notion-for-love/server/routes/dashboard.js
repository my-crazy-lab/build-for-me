/**
 * Love Journey - Dashboard Routes
 *
 * Handles dashboard data aggregation including stats,
 * recent activities, and overview information.
 *
 * Created: 2025-06-26
 * Version: 1.0.0
 */

const express = require('express');
const Goal = require('../models/Goal');
const Memory = require('../models/Memory');
const Milestone = require('../models/Milestone');
const Event = require('../models/Event');

const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// @desc    Get dashboard overview data
// @route   GET /api/dashboard
// @access  Private
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;

    // Get basic stats
    const [
      totalGoals,
      completedGoals,
      totalMemories,
      totalMilestones,
      completedMilestones
    ] = await Promise.all([
      Goal.countDocuments({ userId }),
      Goal.countDocuments({ userId, status: 'completed' }),
      Memory.countDocuments({ userId }),
      Milestone.countDocuments({ userId }),
      Milestone.countDocuments({ userId, isCompleted: true })
    ]);

    // Calculate days together from user profile relationship start date
    const user = req.user;
    const daysTogetherCount = user.profile && user.profile.relationshipStartDate
      ? Math.floor((new Date() - new Date(user.profile.relationshipStartDate)) / (1000 * 60 * 60 * 24))
      : 0;

    // Calculate current streak based on recent activities
    const recentActivities = await Memory.find({
      userId,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }).sort({ createdAt: -1 });

    // Simple streak calculation - consecutive days with activities
    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const hasActivity = recentActivities.some(activity => {
        const activityDate = new Date(activity.createdAt);
        return activityDate.toDateString() === checkDate.toDateString();
      });
      if (hasActivity) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate love points based on activities and milestones
    const lovePoints = (totalMemories * 10) + (completedMilestones * 25) + (completedGoals * 15) + (currentStreak * 5);
    
    const dashboardData = {
      stats: {
        daysTogetherCount,
        totalGoals,
        completedGoals,
        totalMemories,
        totalMilestones,
        completedMilestones,
        currentStreak,
        lovePoints
      }
    };
    
    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      goalStats,
      memoryStats,
      milestoneStats
    ] = await Promise.all([
      Goal.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
            active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
            avgProgress: { $avg: '$progress' }
          }
        }
      ]),
      Memory.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            favorites: { $sum: { $cond: ['$isFavorite', 1, 0] } },
            highlights: { $sum: { $cond: ['$isHighlight', 1, 0] } }
          }
        }
      ]),
      Milestone.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            completed: { $sum: { $cond: ['$isCompleted', 1, 0] } }
          }
        }
      ])
    ]);

    // Calculate days together from user profile relationship start date
    const user = req.user;
    const daysTogetherCount = user.profile && user.profile.relationshipStartDate
      ? Math.floor((new Date() - new Date(user.profile.relationshipStartDate)) / (1000 * 60 * 60 * 24))
      : 0;

    // Calculate current streak based on recent activities
    const recentActivities = await Memory.find({
      userId,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }).sort({ createdAt: -1 });

    // Simple streak calculation - consecutive days with activities
    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const hasActivity = recentActivities.some(activity => {
        const activityDate = new Date(activity.createdAt);
        return activityDate.toDateString() === checkDate.toDateString();
      });
      if (hasActivity) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate love points based on activities and milestones
    const memoriesCount = memoryStats[0]?.total || 0;
    const milestonesCount = milestoneStats[0]?.completed || 0;
    const goalsCount = goalStats[0]?.completed || 0;
    const lovePoints = (memoriesCount * 10) + (milestonesCount * 25) + (goalsCount * 15) + (currentStreak * 5);

    const stats = {
      goals: goalStats[0] || { total: 0, completed: 0, active: 0, avgProgress: 0 },
      memories: memoryStats[0] || { total: 0, favorites: 0, highlights: 0 },
      milestones: milestoneStats[0] || { total: 0, completed: 0 },
      daysTogetherCount,
      currentStreak,
      lovePoints
    };
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get recent activities
// @route   GET /api/dashboard/activities
// @access  Private
router.get('/activities', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.user._id;

    // Get recent goals, memories, and milestones
    const [recentGoals, recentMemories, recentMilestones] = await Promise.all([
      Goal.find({ userId })
        .populate('createdBy', 'name avatar')
        .sort({ createdAt: -1 })
        .limit(3),
      Memory.find({ userId })
        .populate('uploadedBy', 'name avatar')
        .sort({ createdAt: -1 })
        .limit(3),
      Milestone.find({ userId })
        .populate('createdBy', 'name avatar')
        .sort({ createdAt: -1 })
        .limit(3)
    ]);
    
    // Combine and sort activities
    const activities = [
      ...recentGoals.map(goal => ({
        type: 'goal',
        action: 'created',
        title: goal.title,
        user: goal.createdBy,
        createdAt: goal.createdAt,
        id: goal._id
      })),
      ...recentMemories.map(memory => ({
        type: 'memory',
        action: 'uploaded',
        title: memory.title,
        user: memory.uploadedBy,
        createdAt: memory.createdAt,
        id: memory._id
      })),
      ...recentMilestones.map(milestone => ({
        type: 'milestone',
        action: milestone.isCompleted ? 'completed' : 'created',
        title: milestone.title,
        user: milestone.createdBy,
        createdAt: milestone.createdAt,
        id: milestone._id
      }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
     .slice(0, limit);
    
    res.status(200).json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Get recent activities error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get upcoming events
// @route   GET /api/dashboard/upcoming-events
// @access  Private
router.get('/upcoming-events', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    // Get real upcoming events from database
    const userId = req.user._id;
    const today = new Date();

    const upcomingEvents = await Event.find({
      userId,
      date: { $gte: today }
    })
    .sort({ date: 1 })
    .limit(limit)
    .select('title date type category location');
    
    res.status(200).json({
      success: true,
      data: upcomingEvents
    });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get milestone timeline for dashboard
// @route   GET /api/dashboard/milestones
// @access  Private
router.get('/milestones', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const userId = req.user._id;

    const milestones = await Milestone.find({ userId })
      .populate('createdBy', 'name avatar')
      .sort({ date: -1 })
      .limit(limit);
    
    res.status(200).json({
      success: true,
      data: milestones
    });
  } catch (error) {
    console.error('Get milestone timeline error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get memory highlights for dashboard
// @route   GET /api/dashboard/memory-highlights
// @access  Private
router.get('/memory-highlights', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const userId = req.user._id;

    const highlights = await Memory.find({
      userId,
      isHighlight: true
    })
      .populate('uploadedBy', 'name avatar')
      .sort({ dateTaken: -1 })
      .limit(limit);
    
    res.status(200).json({
      success: true,
      data: highlights
    });
  } catch (error) {
    console.error('Get memory highlights error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get shared goals for dashboard
// @route   GET /api/dashboard/shared-goals
// @access  Private
router.get('/shared-goals', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const userId = req.user._id;

    const goals = await Goal.find({
      userId,
      status: 'active'
    })
      .populate('createdBy', 'name avatar')
      .populate('assignedTo', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.status(200).json({
      success: true,
      data: goals
    });
  } catch (error) {
    console.error('Get shared goals error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
