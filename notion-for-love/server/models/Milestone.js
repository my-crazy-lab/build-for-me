/**
 * Love Journey - Milestone Model
 * 
 * MongoDB schema for relationship milestones that capture
 * important moments and memories in a couple's journey.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

const mongoose = require('mongoose');

const MilestoneSchema = new mongoose.Schema({
  relationshipId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Relationship',
    required: [true, 'Milestone must belong to a relationship']
  },
  title: {
    type: String,
    required: [true, 'Please add a milestone title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Please add a milestone date']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [200, 'Location cannot be more than 200 characters']
  },
  notes: {
    type: String,
    maxlength: [2000, 'Notes cannot be more than 2000 characters']
  },
  emotions: [{
    type: String,
    enum: [
      'happy', 'excited', 'loved', 'grateful', 'peaceful', 'proud',
      'nervous', 'anxious', 'sad', 'frustrated', 'angry', 'confused',
      'surprised', 'amazed', 'content', 'hopeful', 'romantic', 'playful'
    ]
  }],
  media: [{
    type: {
      type: String,
      enum: ['image', 'video', 'audio'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    filename: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  category: {
    type: String,
    enum: [
      'first-meeting', 'first-date', 'relationship-official', 'first-kiss',
      'first-fight', 'moving-in', 'engagement', 'wedding', 'honeymoon',
      'anniversary', 'pregnancy', 'birth', 'family', 'travel', 'achievement',
      'challenge', 'celebration', 'other'
    ],
    default: 'other'
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Milestone must have a creator']
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

// Virtual for time since milestone
MilestoneSchema.virtual('timeSince').get(function() {
  const now = new Date();
  const milestoneDate = new Date(this.date);
  const diffTime = Math.abs(now - milestoneDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  
  return `${Math.floor(diffDays / 365)} years ago`;
});

// Virtual for formatted date
MilestoneSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for media count
MilestoneSchema.virtual('mediaCount').get(function() {
  return this.media ? this.media.length : 0;
});

// Pre-save middleware to update lastEditedAt
MilestoneSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastEditedAt = new Date();
  }
  next();
});

// Method to add media
MilestoneSchema.methods.addMedia = function(mediaData) {
  this.media.push(mediaData);
  return this.save();
};

// Method to remove media
MilestoneSchema.methods.removeMedia = function(mediaId) {
  this.media = this.media.filter(media => !media._id.equals(mediaId));
  return this.save();
};

// Method to toggle favorite
MilestoneSchema.methods.toggleFavorite = function() {
  this.isFavorite = !this.isFavorite;
  return this.save();
};

// Method to add emotion
MilestoneSchema.methods.addEmotion = function(emotion) {
  if (!this.emotions.includes(emotion)) {
    this.emotions.push(emotion);
  }
  return this.save();
};

// Method to remove emotion
MilestoneSchema.methods.removeEmotion = function(emotion) {
  this.emotions = this.emotions.filter(e => e !== emotion);
  return this.save();
};

// Static method to get milestones by date range
MilestoneSchema.statics.getByDateRange = function(relationshipId, startDate, endDate) {
  return this.find({
    relationshipId,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: -1 });
};

// Static method to get favorite milestones
MilestoneSchema.statics.getFavorites = function(relationshipId) {
  return this.find({
    relationshipId,
    isFavorite: true
  }).sort({ date: -1 });
};

// Static method to get milestones by category
MilestoneSchema.statics.getByCategory = function(relationshipId, category) {
  return this.find({
    relationshipId,
    category
  }).sort({ date: -1 });
};

// Indexes for better query performance
MilestoneSchema.index({ relationshipId: 1, date: -1 });
MilestoneSchema.index({ relationshipId: 1, category: 1 });
MilestoneSchema.index({ relationshipId: 1, isFavorite: 1 });
MilestoneSchema.index({ relationshipId: 1, tags: 1 });
MilestoneSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Milestone', MilestoneSchema);
