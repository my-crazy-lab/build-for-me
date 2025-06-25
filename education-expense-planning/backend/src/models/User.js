/**
 * User Model - MongoDB schema for user accounts
 * 
 * This model represents parent/guardian accounts who manage
 * education expense planning for their children.
 * 
 * Features:
 * - User authentication data
 * - Profile information
 * - Theme preferences
 * - Account timestamps
 * - Password hashing
 * - Email validation
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger.js';

const userSchema = new mongoose.Schema({
  // Authentication fields
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ],
  },
  
  passwordHash: {
    type: String,
    required: function() {
      // Password is required only for non-OAuth users
      return !this.googleId;
    },
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false, // Don't include in queries by default
  },

  // OAuth fields
  googleId: {
    type: String,
    sparse: true, // Allow multiple null values
  },

  // Profile information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },

  avatar: {
    type: String,
    default: null,
  },

  // User preferences
  theme: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'system',
  },

  // Account status
  isActive: {
    type: Boolean,
    default: true,
  },

  isEmailVerified: {
    type: Boolean,
    default: false,
  },

  // Timestamps
  lastLoginAt: {
    type: Date,
    default: null,
  },

  // Demo account flag
  isDemoAccount: {
    type: Boolean,
    default: false,
  },

}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: {
    transform: function(doc, ret) {
      delete ret.passwordHash;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    transform: function(doc, ret) {
      delete ret.passwordHash;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('passwordHash')) return next();

  try {
    // Hash the password with cost of 12
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    this.passwordHash = await bcrypt.hash(this.passwordHash, saltRounds);
    
    logger.logDatabase('password_hashed', 'users', { userId: this._id });
    next();
  } catch (error) {
    logger.logError('Password hashing failed', error, { userId: this._id });
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.passwordHash) {
    return false;
  }
  
  try {
    return await bcrypt.compare(candidatePassword, this.passwordHash);
  } catch (error) {
    logger.logError('Password comparison failed', error, { userId: this._id });
    return false;
  }
};

// Instance method to update last login
userSchema.methods.updateLastLogin = async function() {
  try {
    this.lastLoginAt = new Date();
    await this.save({ validateBeforeSave: false });
    
    logger.logDatabase('last_login_updated', 'users', { userId: this._id });
  } catch (error) {
    logger.logError('Failed to update last login', error, { userId: this._id });
  }
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find by Google ID
userSchema.statics.findByGoogleId = function(googleId) {
  return this.findOne({ googleId });
};

// Static method to create demo user
userSchema.statics.createDemoUser = async function() {
  const demoEmail = 'demo@education-expense-dashboard.com';
  
  try {
    // Check if demo user already exists
    let demoUser = await this.findByEmail(demoEmail);
    
    if (!demoUser) {
      demoUser = await this.create({
        email: demoEmail,
        passwordHash: process.env.DEMO_PASSWORD || '123456',
        name: 'Demo User',
        isDemoAccount: true,
        isEmailVerified: true,
        theme: 'light',
      });
      
      logger.info('Demo user created successfully');
    }
    
    return demoUser;
  } catch (error) {
    logger.logError('Failed to create demo user', error);
    throw error;
  }
};

// Virtual for full name (if we add first/last name later)
userSchema.virtual('displayName').get(function() {
  return this.name || this.email;
});

// Virtual for account age
userSchema.virtual('accountAge').get(function() {
  if (!this.createdAt) return 0;
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24));
});

const User = mongoose.model('User', userSchema);

export default User;
