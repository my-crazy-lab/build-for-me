/**
 * Love Journey - Memory Model
 * 
 * MongoDB schema for storing photos, videos, and other media
 * in the couple's memory vault with secure organization.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

const mongoose = require('mongoose');

const MemorySchema = new mongoose.Schema({
  relationshipId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Relationship',
    required: [true, 'Memory must belong to a relationship']
  },
  title: {
    type: String,
    required: [true, 'Please add a memory title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  type: {
    type: String,
    enum: ['image', 'video', 'audio', 'document'],
    required: [true, 'Please specify memory type']
  },
  url: {
    type: String,
    required: [true, 'Memory must have a URL']
  },
  thumbnailUrl: {
    type: String
  },
  filename: {
    type: String,
    required: [true, 'Memory must have a filename']
  },
  originalFilename: {
    type: String
  },
  fileSize: {
    type: Number,
    min: 0
  },
  mimeType: {
    type: String
  },
  dimensions: {
    width: Number,
    height: Number
  },
  duration: {
    type: Number, // For video/audio files in seconds
    min: 0
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  category: {
    type: String,
    enum: [
      'milestone', 'daily-life', 'travel', 'family', 'friends',
      'celebration', 'romantic', 'funny', 'achievement', 'other'
    ],
    default: 'other'
  },
  location: {
    name: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    address: String
  },
  dateTaken: {
    type: Date
  },
  milestoneId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Milestone'
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  isHighlight: {
    type: Boolean,
    default: false
  },
  metadata: {
    camera: String,
    settings: String,
    weather: String,
    mood: String
  },
  reactions: [{
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['love', 'laugh', 'wow', 'sad', 'angry'],
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      maxlength: [500, 'Comment cannot be more than 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  uploadedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Memory must have an uploader']
  },
  lastEditedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  lastEditedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for file size display
MemorySchema.virtual('fileSizeDisplay').get(function() {
  if (!this.fileSize) return 'Unknown';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(this.fileSize) / Math.log(1024));
  return Math.round(this.fileSize / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

// Virtual for duration display
MemorySchema.virtual('durationDisplay').get(function() {
  if (!this.duration) return null;
  
  const hours = Math.floor(this.duration / 3600);
  const minutes = Math.floor((this.duration % 3600) / 60);
  const seconds = Math.floor(this.duration % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Virtual for reaction counts
MemorySchema.virtual('reactionCounts').get(function() {
  const counts = {};
  this.reactions.forEach(reaction => {
    counts[reaction.type] = (counts[reaction.type] || 0) + 1;
  });
  return counts;
});

// Virtual for total reactions
MemorySchema.virtual('totalReactions').get(function() {
  return this.reactions ? this.reactions.length : 0;
});

// Virtual for comment count
MemorySchema.virtual('commentCount').get(function() {
  return this.comments ? this.comments.length : 0;
});

// Pre-save middleware
MemorySchema.pre('save', function(next) {
  // Update lastEditedAt if modified
  if (this.isModified() && !this.isNew) {
    this.lastEditedAt = new Date();
  }
  
  // Set dateTaken to createdAt if not provided
  if (!this.dateTaken) {
    this.dateTaken = this.createdAt || new Date();
  }
  
  next();
});

// Method to add reaction
MemorySchema.methods.addReaction = function(userId, type) {
  // Remove existing reaction from this user
  this.reactions = this.reactions.filter(r => !r.userId.equals(userId));
  
  // Add new reaction
  this.reactions.push({ userId, type });
  return this.save();
};

// Method to remove reaction
MemorySchema.methods.removeReaction = function(userId) {
  this.reactions = this.reactions.filter(r => !r.userId.equals(userId));
  return this.save();
};

// Method to add comment
MemorySchema.methods.addComment = function(userId, text) {
  this.comments.push({ userId, text });
  return this.save();
};

// Method to toggle favorite
MemorySchema.methods.toggleFavorite = function() {
  this.isFavorite = !this.isFavorite;
  return this.save();
};

// Method to toggle highlight
MemorySchema.methods.toggleHighlight = function() {
  this.isHighlight = !this.isHighlight;
  return this.save();
};

// Static method to get memories by type
MemorySchema.statics.getByType = function(relationshipId, type) {
  return this.find({ relationshipId, type })
    .sort({ dateTaken: -1, createdAt: -1 })
    .populate('uploadedBy', 'name avatar');
};

// Static method to get memories by date range
MemorySchema.statics.getByDateRange = function(relationshipId, startDate, endDate) {
  return this.find({
    relationshipId,
    dateTaken: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ dateTaken: -1 });
};

// Static method to get favorite memories
MemorySchema.statics.getFavorites = function(relationshipId) {
  return this.find({
    relationshipId,
    isFavorite: true
  }).sort({ dateTaken: -1 });
};

// Static method to get highlight memories
MemorySchema.statics.getHighlights = function(relationshipId) {
  return this.find({
    relationshipId,
    isHighlight: true
  }).sort({ dateTaken: -1 });
};

// Static method to get memories by category
MemorySchema.statics.getByCategory = function(relationshipId, category) {
  return this.find({
    relationshipId,
    category
  }).sort({ dateTaken: -1 });
};

// Indexes for better query performance
MemorySchema.index({ relationshipId: 1, dateTaken: -1 });
MemorySchema.index({ relationshipId: 1, type: 1 });
MemorySchema.index({ relationshipId: 1, category: 1 });
MemorySchema.index({ relationshipId: 1, isFavorite: 1 });
MemorySchema.index({ relationshipId: 1, isHighlight: 1 });
MemorySchema.index({ milestoneId: 1 });
MemorySchema.index({ uploadedBy: 1 });
MemorySchema.index({ tags: 1 });

module.exports = mongoose.model('Memory', MemorySchema);
