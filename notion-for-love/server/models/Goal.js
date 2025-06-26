/**
 * Love Journey - Goal Model
 * 
 * MongoDB schema for shared goals that couples set together
 * to achieve their dreams and strengthen their relationship.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Goal must belong to a user']
  },
  title: {
    type: String,
    required: [true, 'Please add a goal title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    enum: [
      'travel', 'finance', 'health', 'family', 'learning', 'career',
      'home', 'romantic', 'adventure', 'spiritual', 'social', 'hobby', 'other'
    ],
    required: [true, 'Please specify a goal category']
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  targetDate: {
    type: Date
  },
  completedDate: {
    type: Date
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  milestones: [{
    title: {
      type: String,
      required: true,
      maxlength: [100, 'Milestone title cannot be more than 100 characters']
    },
    description: String,
    targetDate: Date,
    completedDate: Date,
    isCompleted: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  notes: {
    type: String,
    maxlength: [2000, 'Notes cannot be more than 2000 characters']
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'document', 'link'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    filename: String,
    title: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPrivate: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Goal must have a creator']
  },
  assignedTo: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
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

// Virtual for days until target date
GoalSchema.virtual('daysUntilTarget').get(function() {
  if (!this.targetDate) return null;
  
  const now = new Date();
  const target = new Date(this.targetDate);
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
});

// Virtual for completion percentage based on milestones
GoalSchema.virtual('milestoneProgress').get(function() {
  if (!this.milestones || this.milestones.length === 0) return 0;
  
  const completedMilestones = this.milestones.filter(m => m.isCompleted).length;
  return Math.round((completedMilestones / this.milestones.length) * 100);
});

// Virtual for status display
GoalSchema.virtual('statusDisplay').get(function() {
  if (this.status === 'completed') return 'Completed';
  if (this.status === 'cancelled') return 'Cancelled';
  if (this.status === 'paused') return 'Paused';
  
  if (this.targetDate) {
    const daysUntil = this.daysUntilTarget;
    if (daysUntil < 0) return 'Overdue';
    if (daysUntil === 0) return 'Due Today';
    if (daysUntil <= 7) return 'Due Soon';
  }
  
  return 'Active';
});

// Pre-save middleware
GoalSchema.pre('save', function(next) {
  // Update lastEditedAt if modified
  if (this.isModified() && !this.isNew) {
    this.lastEditedAt = new Date();
  }
  
  // Set completed date when status changes to completed
  if (this.isModified('status') && this.status === 'completed' && !this.completedDate) {
    this.completedDate = new Date();
    this.progress = 100;
  }
  
  // Clear completed date if status changes from completed
  if (this.isModified('status') && this.status !== 'completed' && this.completedDate) {
    this.completedDate = undefined;
  }
  
  next();
});

// Method to add milestone
GoalSchema.methods.addMilestone = function(milestoneData) {
  this.milestones.push(milestoneData);
  return this.save();
};

// Method to complete milestone
GoalSchema.methods.completeMilestone = function(milestoneId) {
  const milestone = this.milestones.id(milestoneId);
  if (milestone) {
    milestone.isCompleted = true;
    milestone.completedDate = new Date();
    
    // Update overall progress
    this.progress = this.milestoneProgress;
    
    // Check if all milestones are completed
    const allCompleted = this.milestones.every(m => m.isCompleted);
    if (allCompleted && this.status === 'active') {
      this.status = 'completed';
    }
  }
  return this.save();
};

// Method to update progress
GoalSchema.methods.updateProgress = function(newProgress) {
  this.progress = Math.max(0, Math.min(100, newProgress));
  
  if (this.progress === 100 && this.status === 'active') {
    this.status = 'completed';
  }
  
  return this.save();
};

// Method to add attachment
GoalSchema.methods.addAttachment = function(attachmentData) {
  this.attachments.push(attachmentData);
  return this.save();
};

// Static method to get goals by status
GoalSchema.statics.getByStatus = function(userId, status) {
  return this.find({ userId, status }).sort({ createdAt: -1 });
};

// Static method to get goals by category
GoalSchema.statics.getByCategory = function(userId, category) {
  return this.find({ userId, category }).sort({ createdAt: -1 });
};

// Static method to get overdue goals
GoalSchema.statics.getOverdue = function(userId) {
  return this.find({
    userId,
    status: 'active',
    targetDate: { $lt: new Date() }
  }).sort({ targetDate: 1 });
};

// Indexes for better query performance
GoalSchema.index({ userId: 1, status: 1 });
GoalSchema.index({ userId: 1, category: 1 });
GoalSchema.index({ userId: 1, targetDate: 1 });
GoalSchema.index({ assignedTo: 1 });
GoalSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Goal', GoalSchema);
