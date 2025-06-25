/**
 * Goal Model - MongoDB schema for financial goals
 * 
 * This model represents savings goals and financial targets
 * for education expenses.
 * 
 * Features:
 * - Student-specific financial goals
 * - Target amounts and deadlines
 * - Progress tracking
 * - Achievement status
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

const goalSchema = new mongoose.Schema({
  // Student reference
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student ID is required'],
    index: true,
  },

  // Goal details
  title: {
    type: String,
    required: [true, 'Goal title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },

  description: {
    type: String,
    required: [true, 'Goal description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },

  // Financial details
  targetAmount: {
    type: Number,
    required: [true, 'Target amount is required'],
    min: [0, 'Target amount cannot be negative'],
    validate: {
      validator: function(value) {
        return Number.isFinite(value) && value > 0;
      },
      message: 'Target amount must be a positive number'
    }
  },

  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount cannot be negative'],
    validate: {
      validator: function(value) {
        return Number.isFinite(value);
      },
      message: 'Current amount must be a valid number'
    }
  },

  // Timeline
  deadline: {
    type: Date,
    required: [true, 'Deadline is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Deadline must be in the future'
    },
    index: true,
  },

  startDate: {
    type: Date,
    default: Date.now,
  },

  // Goal type and category
  goalType: {
    type: String,
    enum: ['savings', 'expense', 'equipment', 'tuition', 'emergency', 'other'],
    default: 'savings',
  },

  category: {
    type: String,
    default: 'general',
    trim: true,
    lowercase: true,
  },

  // Academic year association
  targetYear: {
    type: Number,
    validate: {
      validator: function(value) {
        if (value === null || value === undefined) return true;
        return Number.isInteger(value) && value >= new Date().getFullYear();
      },
      message: 'Target year must be current year or later'
    }
  },

  targetGrade: {
    type: Number,
    min: [1, 'Target grade must be between 1 and 12'],
    max: [12, 'Target grade must be between 1 and 12'],
    validate: {
      validator: function(value) {
        if (value === null || value === undefined) return true;
        return Number.isInteger(value);
      },
      message: 'Target grade must be a valid integer'
    }
  },

  // Status and progress
  isAchieved: {
    type: Boolean,
    default: false,
    index: true,
  },

  achievedAt: {
    type: Date,
    default: null,
  },

  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },

  // Priority and importance
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },

  // Savings plan
  monthlyContribution: {
    type: Number,
    default: 0,
    min: [0, 'Monthly contribution cannot be negative'],
  },

  autoCalculateContribution: {
    type: Boolean,
    default: true,
  },

  // Metadata
  notes: {
    type: String,
    default: '',
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    trim: true,
  },

  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function(tags) {
        return tags.every(tag => typeof tag === 'string' && tag.trim().length > 0);
      },
      message: 'All tags must be non-empty strings'
    }
  },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for performance
goalSchema.index({ studentId: 1, isActive: 1 });
goalSchema.index({ studentId: 1, deadline: 1 });
goalSchema.index({ studentId: 1, isAchieved: 1 });
goalSchema.index({ targetYear: 1, targetGrade: 1 });

// Virtual for progress percentage
goalSchema.virtual('progressPercentage').get(function() {
  if (this.targetAmount <= 0) return 0;
  return Math.min(100, Math.round((this.currentAmount / this.targetAmount) * 100));
});

// Virtual for remaining amount
goalSchema.virtual('remainingAmount').get(function() {
  return Math.max(0, this.targetAmount - this.currentAmount);
});

// Virtual for days remaining
goalSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const diffTime = this.deadline.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for suggested monthly contribution
goalSchema.virtual('suggestedMonthlyContribution').get(function() {
  const daysRemaining = this.daysRemaining;
  if (daysRemaining <= 0) return 0;
  
  const monthsRemaining = Math.max(1, daysRemaining / 30);
  return Math.ceil(this.remainingAmount / monthsRemaining);
});

// Virtual for status
goalSchema.virtual('status').get(function() {
  if (this.isAchieved) return 'achieved';
  if (!this.isActive) return 'inactive';
  
  const daysRemaining = this.daysRemaining;
  if (daysRemaining < 0) return 'overdue';
  if (daysRemaining <= 30) return 'urgent';
  if (this.progressPercentage >= 75) return 'on_track';
  if (this.progressPercentage >= 50) return 'moderate';
  return 'behind';
});

// Pre-save middleware to calculate monthly contribution
goalSchema.pre('save', function(next) {
  if (this.autoCalculateContribution && this.isModified('targetAmount', 'currentAmount', 'deadline')) {
    this.monthlyContribution = this.suggestedMonthlyContribution;
  }
  next();
});

// Pre-save middleware to check achievement
goalSchema.pre('save', function(next) {
  if (this.currentAmount >= this.targetAmount && !this.isAchieved) {
    this.isAchieved = true;
    this.achievedAt = new Date();
  } else if (this.currentAmount < this.targetAmount && this.isAchieved) {
    this.isAchieved = false;
    this.achievedAt = null;
  }
  next();
});

// Pre-save middleware for logging
goalSchema.pre('save', function(next) {
  if (this.isNew) {
    logger.logDatabase('goal_created', 'goals', {
      goalId: this._id,
      studentId: this.studentId,
      targetAmount: this.targetAmount,
      deadline: this.deadline
    });
  } else if (this.isModified('isAchieved') && this.isAchieved) {
    logger.logDatabase('goal_achieved', 'goals', {
      goalId: this._id,
      studentId: this.studentId,
      achievedAt: this.achievedAt
    });
  }
  next();
});

// Instance method to add contribution
goalSchema.methods.addContribution = async function(amount, note = '') {
  if (amount <= 0) {
    throw new Error('Contribution amount must be positive');
  }
  
  this.currentAmount += amount;
  
  // Check if goal is achieved
  if (this.currentAmount >= this.targetAmount && !this.isAchieved) {
    this.isAchieved = true;
    this.achievedAt = new Date();
  }
  
  await this.save();
  
  logger.logDatabase('goal_contribution_added', 'goals', {
    goalId: this._id,
    contributionAmount: amount,
    newCurrentAmount: this.currentAmount,
    note
  });
  
  return this;
};

// Instance method to update progress
goalSchema.methods.updateProgress = async function(newAmount) {
  if (newAmount < 0) {
    throw new Error('Progress amount cannot be negative');
  }
  
  const oldAmount = this.currentAmount;
  this.currentAmount = newAmount;
  
  await this.save();
  
  logger.logDatabase('goal_progress_updated', 'goals', {
    goalId: this._id,
    oldAmount,
    newAmount,
    progressPercentage: this.progressPercentage
  });
  
  return this;
};

// Static method to find goals by student
goalSchema.statics.findByStudent = function(studentId, includeInactive = false) {
  const query = { studentId };
  if (!includeInactive) {
    query.isActive = true;
  }
  return this.find(query).sort({ deadline: 1 });
};

// Static method to find active goals
goalSchema.statics.findActive = function(studentId = null) {
  const query = { isActive: true, isAchieved: false };
  if (studentId) {
    query.studentId = studentId;
  }
  return this.find(query).sort({ deadline: 1 });
};

// Static method to find achieved goals
goalSchema.statics.findAchieved = function(studentId = null) {
  const query = { isAchieved: true };
  if (studentId) {
    query.studentId = studentId;
  }
  return this.find(query).sort({ achievedAt: -1 });
};

// Static method to find urgent goals
goalSchema.statics.findUrgent = function(studentId = null, days = 30) {
  const urgentDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  const query = {
    isActive: true,
    isAchieved: false,
    deadline: { $lte: urgentDate }
  };
  if (studentId) {
    query.studentId = studentId;
  }
  return this.find(query).sort({ deadline: 1 });
};

// Static method to find overdue goals
goalSchema.statics.findOverdue = function(studentId = null) {
  const query = {
    isActive: true,
    isAchieved: false,
    deadline: { $lt: new Date() }
  };
  if (studentId) {
    query.studentId = studentId;
  }
  return this.find(query).sort({ deadline: 1 });
};

const Goal = mongoose.model('Goal', goalSchema);

export default Goal;
