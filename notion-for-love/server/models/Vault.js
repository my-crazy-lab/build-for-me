/**
 * Love Journey - Vault Model
 * 
 * MongoDB schema for the private vault storing sensitive information
 * like love letters, passwords, wills, and final wishes with encryption.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

const mongoose = require('mongoose');

const VaultSchema = new mongoose.Schema({
  relationshipId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Relationship',
    required: [true, 'Vault item must belong to a relationship']
  },
  title: {
    type: String,
    required: [true, 'Please add a vault item title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  type: {
    type: String,
    enum: [
      'love-letter', 'password', 'document', 'will', 'final-wishes',
      'financial', 'legal', 'personal', 'emergency', 'other'
    ],
    required: [true, 'Please specify vault item type']
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
    maxlength: [10000, 'Content cannot be more than 10000 characters']
  },
  attachments: [{
    type: {
      type: String,
      enum: ['document', 'image', 'audio', 'video'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      required: true
    },
    originalFilename: String,
    fileSize: Number,
    mimeType: String,
    isEncrypted: {
      type: Boolean,
      default: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  accessRules: {
    requireBothConsent: {
      type: Boolean,
      default: true
    },
    unlockDate: Date,
    emergencyAccess: {
      type: Boolean,
      default: false
    },
    allowedUsers: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }]
  },
  consentStatus: {
    user1: {
      userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      hasConsented: {
        type: Boolean,
        default: false
      },
      consentedAt: Date
    },
    user2: {
      userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      hasConsented: {
        type: Boolean,
        default: false
      },
      consentedAt: Date
    }
  },
  isEncrypted: {
    type: Boolean,
    default: true
  },
  encryptionKey: {
    type: String // Encrypted key for content decryption
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  expiryDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  accessLog: [{
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    action: {
      type: String,
      enum: ['view', 'edit', 'download', 'consent'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    ipAddress: String,
    userAgent: String
  }],
  reminderSettings: {
    sendReminders: {
      type: Boolean,
      default: false
    },
    reminderFrequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly']
    },
    lastReminderSent: Date
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Vault item must have a creator']
  },
  lastAccessedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  lastAccessedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for access status
VaultSchema.virtual('accessStatus').get(function() {
  if (!this.accessRules.requireBothConsent) {
    return 'accessible';
  }
  
  const user1Consented = this.consentStatus.user1.hasConsented;
  const user2Consented = this.consentStatus.user2.hasConsented;
  
  if (user1Consented && user2Consented) {
    return 'accessible';
  }
  
  if (user1Consented || user2Consented) {
    return 'partial-consent';
  }
  
  return 'locked';
});

// Virtual for days until expiry
VaultSchema.virtual('daysUntilExpiry').get(function() {
  if (!this.expiryDate) return null;
  
  const now = new Date();
  const expiry = new Date(this.expiryDate);
  const diffTime = expiry - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
});

// Virtual for is expired
VaultSchema.virtual('isExpired').get(function() {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
});

// Virtual for attachment count
VaultSchema.virtual('attachmentCount').get(function() {
  return this.attachments ? this.attachments.length : 0;
});

// Method to grant consent
VaultSchema.methods.grantConsent = function(userId) {
  if (this.consentStatus.user1.userId && this.consentStatus.user1.userId.equals(userId)) {
    this.consentStatus.user1.hasConsented = true;
    this.consentStatus.user1.consentedAt = new Date();
  } else if (this.consentStatus.user2.userId && this.consentStatus.user2.userId.equals(userId)) {
    this.consentStatus.user2.hasConsented = true;
    this.consentStatus.user2.consentedAt = new Date();
  }
  
  // Log the consent action
  this.logAccess(userId, 'consent');
  
  return this.save();
};

// Method to revoke consent
VaultSchema.methods.revokeConsent = function(userId) {
  if (this.consentStatus.user1.userId && this.consentStatus.user1.userId.equals(userId)) {
    this.consentStatus.user1.hasConsented = false;
    this.consentStatus.user1.consentedAt = undefined;
  } else if (this.consentStatus.user2.userId && this.consentStatus.user2.userId.equals(userId)) {
    this.consentStatus.user2.hasConsented = false;
    this.consentStatus.user2.consentedAt = undefined;
  }
  
  return this.save();
};

// Method to check if user can access
VaultSchema.methods.canUserAccess = function(userId) {
  // Check if user is in allowed users
  if (this.accessRules.allowedUsers.some(id => id.equals(userId))) {
    return true;
  }
  
  // Check if both consent is required
  if (this.accessRules.requireBothConsent) {
    return this.accessStatus === 'accessible';
  }
  
  // Check if unlock date has passed
  if (this.accessRules.unlockDate && new Date() >= this.accessRules.unlockDate) {
    return true;
  }
  
  // Check if emergency access is enabled
  if (this.accessRules.emergencyAccess) {
    return true;
  }
  
  return false;
};

// Method to log access
VaultSchema.methods.logAccess = function(userId, action, ipAddress = null, userAgent = null) {
  this.accessLog.push({
    userId,
    action,
    ipAddress,
    userAgent
  });
  
  this.lastAccessedBy = userId;
  this.lastAccessedAt = new Date();
  
  return this.save();
};

// Method to add attachment
VaultSchema.methods.addAttachment = function(attachmentData) {
  this.attachments.push(attachmentData);
  return this.save();
};

// Static method to get accessible items for user
VaultSchema.statics.getAccessibleItems = function(relationshipId, userId) {
  return this.find({
    relationshipId,
    isActive: true,
    $or: [
      { 'accessRules.allowedUsers': userId },
      { 'accessRules.requireBothConsent': false },
      {
        'accessRules.requireBothConsent': true,
        'consentStatus.user1.hasConsented': true,
        'consentStatus.user2.hasConsented': true
      },
      {
        'accessRules.unlockDate': { $lte: new Date() }
      },
      {
        'accessRules.emergencyAccess': true
      }
    ]
  }).sort({ priority: -1, createdAt: -1 });
};

// Static method to get items by type
VaultSchema.statics.getByType = function(relationshipId, type) {
  return this.find({
    relationshipId,
    type,
    isActive: true
  }).sort({ createdAt: -1 });
};

// Static method to get expiring items
VaultSchema.statics.getExpiringItems = function(relationshipId, days = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    relationshipId,
    isActive: true,
    expiryDate: {
      $lte: futureDate,
      $gt: new Date()
    }
  }).sort({ expiryDate: 1 });
};

// Indexes for better query performance
VaultSchema.index({ relationshipId: 1, type: 1 });
VaultSchema.index({ relationshipId: 1, isActive: 1 });
VaultSchema.index({ 'accessRules.allowedUsers': 1 });
VaultSchema.index({ createdBy: 1 });
VaultSchema.index({ expiryDate: 1 });

module.exports = mongoose.model('Vault', VaultSchema);
