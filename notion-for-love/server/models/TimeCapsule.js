/**
 * Love Journey - Time Capsule Model
 * 
 * MongoDB schema for time capsules that allow couples to send
 * messages, photos, and videos to their future selves.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

const mongoose = require('mongoose');

const TimeCapsuleSchema = new mongoose.Schema({
  relationshipId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Relationship',
    required: [true, 'Time capsule must belong to a relationship']
  },
  title: {
    type: String,
    required: [true, 'Please add a time capsule title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
    maxlength: [5000, 'Message cannot be more than 5000 characters']
  },
  mediaUrl: {
    type: String
  },
  mediaType: {
    type: String,
    enum: ['image', 'video', 'audio']
  },
  unlockAt: {
    type: Date,
    required: [true, 'Please specify when to unlock this capsule']
  },
  isUnlocked: {
    type: Boolean,
    default: false
  },
  unlockedAt: {
    type: Date
  },
  shared: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    enum: [
      'anniversary', 'birthday', 'milestone', 'future-self', 'goals',
      'dreams', 'love-letter', 'memory', 'advice', 'gratitude', 'other'
    ],
    default: 'other'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  recipients: [{
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    hasViewed: {
      type: Boolean,
      default: false
    },
    viewedAt: Date
  }],
  reactions: [{
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['love', 'laugh', 'wow', 'cry', 'heart'],
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  replies: [{
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: [1000, 'Reply cannot be more than 1000 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  reminderSettings: {
    sendReminder: {
      type: Boolean,
      default: true
    },
    reminderDays: {
      type: Number,
      default: 7,
      min: 1,
      max: 365
    }
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Time capsule must have a creator']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for days until unlock
TimeCapsuleSchema.virtual('daysUntilUnlock').get(function() {
  if (this.isUnlocked) return 0;
  
  const now = new Date();
  const unlock = new Date(this.unlockAt);
  const diffTime = unlock - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
});

// Virtual for unlock status
TimeCapsuleSchema.virtual('unlockStatus').get(function() {
  if (this.isUnlocked) return 'unlocked';
  
  const now = new Date();
  const unlock = new Date(this.unlockAt);
  
  if (now >= unlock) return 'ready';
  
  const daysUntil = this.daysUntilUnlock;
  if (daysUntil <= 7) return 'soon';
  if (daysUntil <= 30) return 'upcoming';
  
  return 'future';
});

// Virtual for formatted unlock date
TimeCapsuleSchema.virtual('formattedUnlockDate').get(function() {
  return this.unlockAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Virtual for reaction counts
TimeCapsuleSchema.virtual('reactionCounts').get(function() {
  const counts = {};
  this.reactions.forEach(reaction => {
    counts[reaction.type] = (counts[reaction.type] || 0) + 1;
  });
  return counts;
});

// Virtual for total reactions
TimeCapsuleSchema.virtual('totalReactions').get(function() {
  return this.reactions ? this.reactions.length : 0;
});

// Virtual for reply count
TimeCapsuleSchema.virtual('replyCount').get(function() {
  return this.replies ? this.replies.length : 0;
});

// Pre-save middleware to check unlock status
TimeCapsuleSchema.pre('save', function(next) {
  const now = new Date();
  
  // Auto-unlock if unlock time has passed
  if (!this.isUnlocked && now >= this.unlockAt) {
    this.isUnlocked = true;
    this.unlockedAt = now;
  }
  
  next();
});

// Method to unlock capsule
TimeCapsuleSchema.methods.unlock = function() {
  if (!this.isUnlocked) {
    this.isUnlocked = true;
    this.unlockedAt = new Date();
  }
  return this.save();
};

// Method to mark as viewed by user
TimeCapsuleSchema.methods.markAsViewed = function(userId) {
  const recipient = this.recipients.find(r => r.userId.equals(userId));
  if (recipient && !recipient.hasViewed) {
    recipient.hasViewed = true;
    recipient.viewedAt = new Date();
  }
  return this.save();
};

// Method to add reaction
TimeCapsuleSchema.methods.addReaction = function(userId, type) {
  // Remove existing reaction from this user
  this.reactions = this.reactions.filter(r => !r.userId.equals(userId));
  
  // Add new reaction
  this.reactions.push({ userId, type });
  return this.save();
};

// Method to remove reaction
TimeCapsuleSchema.methods.removeReaction = function(userId) {
  this.reactions = this.reactions.filter(r => !r.userId.equals(userId));
  return this.save();
};

// Method to add reply
TimeCapsuleSchema.methods.addReply = function(userId, message) {
  this.replies.push({ userId, message });
  return this.save();
};

// Static method to get unlocked capsules
TimeCapsuleSchema.statics.getUnlocked = function(relationshipId) {
  return this.find({
    relationshipId,
    isUnlocked: true
  }).sort({ unlockedAt: -1 }).populate('createdBy', 'name avatar');
};

// Static method to get capsules ready to unlock
TimeCapsuleSchema.statics.getReadyToUnlock = function(relationshipId) {
  return this.find({
    relationshipId,
    isUnlocked: false,
    unlockAt: { $lte: new Date() }
  }).sort({ unlockAt: 1 });
};

// Static method to get upcoming capsules
TimeCapsuleSchema.statics.getUpcoming = function(relationshipId, days = 30) {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    relationshipId,
    isUnlocked: false,
    unlockAt: {
      $gt: now,
      $lte: futureDate
    }
  }).sort({ unlockAt: 1 });
};

// Static method to get capsules by category
TimeCapsuleSchema.statics.getByCategory = function(relationshipId, category) {
  return this.find({
    relationshipId,
    category
  }).sort({ unlockAt: -1 });
};

// Static method to get capsules created by user
TimeCapsuleSchema.statics.getByCreator = function(relationshipId, userId) {
  return this.find({
    relationshipId,
    createdBy: userId
  }).sort({ createdAt: -1 });
};

// Indexes for better query performance
TimeCapsuleSchema.index({ relationshipId: 1, unlockAt: 1 });
TimeCapsuleSchema.index({ relationshipId: 1, isUnlocked: 1 });
TimeCapsuleSchema.index({ relationshipId: 1, category: 1 });
TimeCapsuleSchema.index({ createdBy: 1 });
TimeCapsuleSchema.index({ 'recipients.userId': 1 });

module.exports = mongoose.model('TimeCapsule', TimeCapsuleSchema);
