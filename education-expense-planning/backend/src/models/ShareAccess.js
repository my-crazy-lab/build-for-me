/**
 * ShareAccess Model - MongoDB schema for sharing student data
 * 
 * This model manages sharing permissions for student data
 * between family members or other authorized users.
 * 
 * Features:
 * - Share student data with specific users
 * - Permission levels (view/edit)
 * - Email-based sharing
 * - Access control and revocation
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

const shareAccessSchema = new mongoose.Schema({
  // Owner of the student data
  ownerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner user ID is required'],
  },

  // Email of the user being granted access
  sharedWithEmail: {
    type: String,
    required: [true, 'Shared with email is required'],
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ],
  },

  // User ID if the shared user has an account
  sharedWithUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },

  // Student being shared
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student ID is required'],
  },

  // Permission level
  permission: {
    type: String,
    required: [true, 'Permission level is required'],
    enum: {
      values: ['view', 'edit'],
      message: 'Permission must be either view or edit'
    },
    default: 'view',
  },

  // Status
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'revoked'],
    default: 'pending',
  },

  // Invitation details
  invitationToken: {
    type: String,
    unique: true,
    sparse: true, // Allow multiple null values
  },

  invitationExpiresAt: {
    type: Date,
    default: function() {
      // Default expiration: 7 days from now
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    },
  },

  // Acceptance details
  acceptedAt: {
    type: Date,
    default: null,
  },

  lastAccessedAt: {
    type: Date,
    default: null,
  },

  // Restrictions
  canViewPlans: {
    type: Boolean,
    default: true,
  },

  canViewExpenses: {
    type: Boolean,
    default: true,
  },

  canViewReports: {
    type: Boolean,
    default: true,
  },

  canEditPlans: {
    type: Boolean,
    default: function() {
      return this.permission === 'edit';
    },
  },

  canEditExpenses: {
    type: Boolean,
    default: function() {
      return this.permission === 'edit';
    },
  },

  // Metadata
  notes: {
    type: String,
    default: '',
    maxlength: [500, 'Notes cannot exceed 500 characters'],
    trim: true,
  },

  // Notification preferences
  notifyOnExpenseAdd: {
    type: Boolean,
    default: false,
  },

  notifyOnPlanChange: {
    type: Boolean,
    default: false,
  },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for performance
shareAccessSchema.index({ ownerUserId: 1, studentId: 1 });
shareAccessSchema.index({ sharedWithEmail: 1, status: 1 });
shareAccessSchema.index({ sharedWithUserId: 1, status: 1 });
shareAccessSchema.index({ studentId: 1, status: 1 });

// Unique constraint: one share per email per student
shareAccessSchema.index(
  { sharedWithEmail: 1, studentId: 1 },
  { unique: true }
);

// Virtual for invitation status
shareAccessSchema.virtual('isInvitationValid').get(function() {
  return this.status === 'pending' && 
         this.invitationExpiresAt && 
         this.invitationExpiresAt > new Date();
});

// Virtual for access level description
shareAccessSchema.virtual('accessDescription').get(function() {
  const permissions = [];
  
  if (this.canViewPlans) permissions.push('view plans');
  if (this.canViewExpenses) permissions.push('view expenses');
  if (this.canViewReports) permissions.push('view reports');
  if (this.canEditPlans) permissions.push('edit plans');
  if (this.canEditExpenses) permissions.push('edit expenses');
  
  return permissions.join(', ');
});

// Pre-save middleware to generate invitation token
shareAccessSchema.pre('save', function(next) {
  if (this.isNew && this.status === 'pending' && !this.invitationToken) {
    // Generate a secure random token
    this.invitationToken = require('crypto').randomBytes(32).toString('hex');
  }
  next();
});

// Pre-save middleware to update permission-based flags
shareAccessSchema.pre('save', function(next) {
  if (this.isModified('permission')) {
    if (this.permission === 'view') {
      this.canEditPlans = false;
      this.canEditExpenses = false;
    } else if (this.permission === 'edit') {
      this.canEditPlans = true;
      this.canEditExpenses = true;
    }
  }
  next();
});

// Pre-save middleware for logging
shareAccessSchema.pre('save', function(next) {
  if (this.isNew) {
    logger.logDatabase('share_access_created', 'shareaccesses', {
      shareId: this._id,
      ownerUserId: this.ownerUserId,
      sharedWithEmail: this.sharedWithEmail,
      studentId: this.studentId,
      permission: this.permission
    });
  }
  next();
});

// Instance method to accept invitation
shareAccessSchema.methods.acceptInvitation = async function(userId) {
  if (!this.isInvitationValid) {
    throw new Error('Invitation is not valid or has expired');
  }
  
  this.status = 'accepted';
  this.sharedWithUserId = userId;
  this.acceptedAt = new Date();
  this.invitationToken = undefined; // Remove token after acceptance
  
  await this.save();
  
  logger.logDatabase('share_access_accepted', 'shareaccesses', {
    shareId: this._id,
    sharedWithUserId: userId
  });
  
  return this;
};

// Instance method to decline invitation
shareAccessSchema.methods.declineInvitation = async function() {
  this.status = 'declined';
  this.invitationToken = undefined;
  
  await this.save();
  
  logger.logDatabase('share_access_declined', 'shareaccesses', {
    shareId: this._id,
    sharedWithEmail: this.sharedWithEmail
  });
  
  return this;
};

// Instance method to revoke access
shareAccessSchema.methods.revokeAccess = async function() {
  this.status = 'revoked';
  this.invitationToken = undefined;
  
  await this.save();
  
  logger.logDatabase('share_access_revoked', 'shareaccesses', {
    shareId: this._id,
    ownerUserId: this.ownerUserId,
    sharedWithEmail: this.sharedWithEmail
  });
  
  return this;
};

// Instance method to update last access
shareAccessSchema.methods.updateLastAccess = async function() {
  this.lastAccessedAt = new Date();
  await this.save({ validateBeforeSave: false });
};

// Static method to find shares by owner
shareAccessSchema.statics.findByOwner = function(ownerUserId, status = null) {
  const query = { ownerUserId };
  if (status) {
    query.status = status;
  }
  return this.find(query)
    .populate('studentId', 'name currentGrade schoolType')
    .sort({ createdAt: -1 });
};

// Static method to find shares by shared user
shareAccessSchema.statics.findBySharedUser = function(userIdOrEmail, status = 'accepted') {
  const query = { status };
  
  if (mongoose.Types.ObjectId.isValid(userIdOrEmail)) {
    query.sharedWithUserId = userIdOrEmail;
  } else {
    query.sharedWithEmail = userIdOrEmail.toLowerCase();
  }
  
  return this.find(query)
    .populate('studentId', 'name currentGrade schoolType')
    .populate('ownerUserId', 'name email')
    .sort({ createdAt: -1 });
};

// Static method to find by invitation token
shareAccessSchema.statics.findByInvitationToken = function(token) {
  return this.findOne({
    invitationToken: token,
    status: 'pending',
    invitationExpiresAt: { $gt: new Date() }
  })
  .populate('studentId', 'name currentGrade schoolType')
  .populate('ownerUserId', 'name email');
};

// Static method to check if user has access to student
shareAccessSchema.statics.hasAccess = async function(userId, studentId, requiredPermission = 'view') {
  // Check if user is the owner
  const Student = mongoose.model('Student');
  const student = await Student.findById(studentId);
  
  if (student && student.userId.toString() === userId.toString()) {
    return { hasAccess: true, permission: 'edit', isOwner: true };
  }
  
  // Check if user has shared access
  const shareAccess = await this.findOne({
    sharedWithUserId: userId,
    studentId,
    status: 'accepted'
  });
  
  if (!shareAccess) {
    return { hasAccess: false, permission: null, isOwner: false };
  }
  
  // Check permission level
  const hasRequiredPermission = requiredPermission === 'view' || 
    (requiredPermission === 'edit' && shareAccess.permission === 'edit');
  
  return {
    hasAccess: hasRequiredPermission,
    permission: shareAccess.permission,
    isOwner: false,
    shareAccess
  };
};

// Static method to cleanup expired invitations
shareAccessSchema.statics.cleanupExpiredInvitations = async function() {
  const result = await this.deleteMany({
    status: 'pending',
    invitationExpiresAt: { $lt: new Date() }
  });
  
  logger.logDatabase('expired_invitations_cleaned', 'shareaccesses', {
    deletedCount: result.deletedCount
  });
  
  return result;
};

const ShareAccess = mongoose.model('ShareAccess', shareAccessSchema);

export default ShareAccess;
