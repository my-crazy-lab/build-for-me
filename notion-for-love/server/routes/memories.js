/**
 * Love Journey - Memories Routes
 *
 * Handles all memory-related operations including CRUD operations,
 * file uploads, reactions, and comments.
 *
 * Created: 2025-06-26
 * Version: 1.0.0
 */

const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const Memory = require('../models/Memory');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images, videos, audio, and documents
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|mp3|wav|pdf|doc|docx/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Apply authentication middleware to all routes
router.use(protect);

// @desc    Get all memories for user's relationship
// @route   GET /api/memories
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { category, search, dateFrom, dateTo, tags, type, favorites, highlights } = req.query;

    // Build query
    const query = { userId: req.user._id };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (type) {
      query.type = type;
    }

    if (favorites === 'true') {
      query.isFavorite = true;
    }

    if (highlights === 'true') {
      query.isHighlight = true;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.dateTaken = {};
      if (dateFrom) query.dateTaken.$gte = new Date(dateFrom);
      if (dateTo) query.dateTaken.$lte = new Date(dateTo);
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
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const memories = await Memory.find(query)
      .populate('uploadedBy', 'name avatar')
      .populate('milestoneId', 'title date')
      .sort({ dateTaken: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: memories.length,
      data: memories
    });
  } catch (error) {
    console.error('Get memories error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get single memory
// @route   GET /api/memories/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const memory = await Memory.findOne({
      _id: req.params.id,
      userId: req.user._id
    })
      .populate('uploadedBy', 'name avatar')
      .populate('milestoneId', 'title date')
      .populate('comments.userId', 'name avatar')
      .populate('reactions.userId', 'name avatar');

    if (!memory) {
      return res.status(404).json({
        success: false,
        error: 'Memory not found'
      });
    }

    res.status(200).json({
      success: true,
      data: memory
    });
  } catch (error) {
    console.error('Get memory error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create new memory
// @route   POST /api/memories
// @access  Private
router.post('/', upload.single('file'), [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('category').optional().isIn(['milestone', 'daily-life', 'travel', 'family', 'friends', 'celebration', 'romantic', 'funny', 'achievement', 'other']).withMessage('Invalid category'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('dateTaken').optional().isISO8601().withMessage('Invalid date taken')
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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'File is required'
      });
    }

    // FUTURE ENHANCEMENT: Upload file to cloud storage (Cloudinary, AWS S3, etc.)
    // Currently using placeholder URLs - implement actual file upload service
    const fileUrl = `https://example.com/uploads/${Date.now()}-${req.file.originalname}`;
    const thumbnailUrl = req.file.mimetype.startsWith('image/')
      ? `https://example.com/thumbnails/${Date.now()}-${req.file.originalname}`
      : null;

    // Determine file type
    let type = 'document';
    if (req.file.mimetype.startsWith('image/')) type = 'image';
    else if (req.file.mimetype.startsWith('video/')) type = 'video';
    else if (req.file.mimetype.startsWith('audio/')) type = 'audio';

    const memoryData = {
      ...req.body,
      userId: req.user._id,
      uploadedBy: req.user._id,
      type,
      url: fileUrl,
      thumbnailUrl,
      filename: `${Date.now()}-${req.file.originalname}`,
      originalFilename: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    };

    const memory = await Memory.create(memoryData);

    await memory.populate('uploadedBy', 'name avatar');

    res.status(201).json({
      success: true,
      data: memory
    });
  } catch (error) {
    console.error('Create memory error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update memory
// @route   PUT /api/memories/:id
// @access  Private
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Title must be less than 100 characters'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('category').optional().isIn(['milestone', 'daily-life', 'travel', 'family', 'friends', 'celebration', 'romantic', 'funny', 'achievement', 'other']).withMessage('Invalid category'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('dateTaken').optional().isISO8601().withMessage('Invalid date taken')
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

    const memory = await Memory.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!memory) {
      return res.status(404).json({
        success: false,
        error: 'Memory not found'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        memory[key] = req.body[key];
      }
    });

    memory.lastEditedBy = req.user._id;
    memory.lastEditedAt = new Date();

    await memory.save();

    await memory.populate('uploadedBy', 'name avatar');

    res.status(200).json({
      success: true,
      data: memory
    });
  } catch (error) {
    console.error('Update memory error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete memory
// @route   DELETE /api/memories/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const memory = await Memory.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!memory) {
      return res.status(404).json({
        success: false,
        error: 'Memory not found'
      });
    }

    // FUTURE ENHANCEMENT: Delete file from cloud storage when implemented

    await memory.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Memory deleted successfully'
    });
  } catch (error) {
    console.error('Delete memory error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Toggle memory favorite status
// @route   PATCH /api/memories/:id/favorite
// @access  Private
router.patch('/:id/favorite', async (req, res) => {
  try {
    const memory = await Memory.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!memory) {
      return res.status(404).json({
        success: false,
        error: 'Memory not found'
      });
    }

    await memory.toggleFavorite();

    res.status(200).json({
      success: true,
      data: memory
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Toggle memory highlight status
// @route   PATCH /api/memories/:id/highlight
// @access  Private
router.patch('/:id/highlight', async (req, res) => {
  try {
    const memory = await Memory.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!memory) {
      return res.status(404).json({
        success: false,
        error: 'Memory not found'
      });
    }

    await memory.toggleHighlight();

    res.status(200).json({
      success: true,
      data: memory
    });
  } catch (error) {
    console.error('Toggle highlight error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Add reaction to memory
// @route   POST /api/memories/:id/reactions
// @access  Private
router.post('/:id/reactions', [
  body('type').isIn(['love', 'laugh', 'wow', 'sad', 'angry']).withMessage('Invalid reaction type')
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

    const memory = await Memory.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!memory) {
      return res.status(404).json({
        success: false,
        error: 'Memory not found'
      });
    }

    await memory.addReaction(req.user._id, req.body.type);

    await memory.populate('reactions.userId', 'name avatar');

    res.status(200).json({
      success: true,
      data: memory
    });
  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Remove reaction from memory
// @route   DELETE /api/memories/:id/reactions
// @access  Private
router.delete('/:id/reactions', async (req, res) => {
  try {
    const memory = await Memory.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!memory) {
      return res.status(404).json({
        success: false,
        error: 'Memory not found'
      });
    }

    await memory.removeReaction(req.user._id);

    res.status(200).json({
      success: true,
      data: memory
    });
  } catch (error) {
    console.error('Remove reaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Add comment to memory
// @route   POST /api/memories/:id/comments
// @access  Private
router.post('/:id/comments', [
  body('text').trim().isLength({ min: 1, max: 500 }).withMessage('Comment text is required and must be less than 500 characters')
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

    const memory = await Memory.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!memory) {
      return res.status(404).json({
        success: false,
        error: 'Memory not found'
      });
    }

    await memory.addComment(req.user._id, req.body.text);

    await memory.populate('comments.userId', 'name avatar');

    res.status(201).json({
      success: true,
      data: memory
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get memory statistics
// @route   GET /api/memories/stats
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      totalMemories,
      imageCount,
      videoCount,
      audioCount,
      documentCount,
      favoriteCount,
      highlightCount
    ] = await Promise.all([
      Memory.countDocuments({ userId }),
      Memory.countDocuments({ userId, type: 'image' }),
      Memory.countDocuments({ userId, type: 'video' }),
      Memory.countDocuments({ userId, type: 'audio' }),
      Memory.countDocuments({ userId, type: 'document' }),
      Memory.countDocuments({ userId, isFavorite: true }),
      Memory.countDocuments({ userId, isHighlight: true })
    ]);

    // Get category breakdown
    const categoryStats = await Memory.aggregate([
      { $match: { userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get total file size
    const sizeStats = await Memory.aggregate([
      { $match: { userId } },
      { $group: { _id: null, totalSize: { $sum: '$fileSize' } } }
    ]);

    const stats = {
      total: totalMemories,
      byType: {
        image: imageCount,
        video: videoCount,
        audio: audioCount,
        document: documentCount
      },
      favorites: favoriteCount,
      highlights: highlightCount,
      totalFileSize: sizeStats[0]?.totalSize || 0,
      categoryBreakdown: categoryStats
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get memory stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get recent memories for dashboard
// @route   GET /api/memories/recent
// @access  Private
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const memories = await Memory.find({
      userId: req.user._id
    })
      .populate('uploadedBy', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      data: memories
    });
  } catch (error) {
    console.error('Get recent memories error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get memory tags
// @route   GET /api/memories/tags
// @access  Private
router.get('/tags', async (req, res) => {
  try {
    const tags = await Memory.aggregate([
      { $match: { userId: req.user._id } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 50 } // Limit to top 50 tags
    ]);

    res.status(200).json({
      success: true,
      data: tags
    });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
