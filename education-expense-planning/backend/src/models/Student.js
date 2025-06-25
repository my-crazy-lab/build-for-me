/**
 * Student Model - MongoDB schema for student profiles
 * 
 * This model represents children/students whose education
 * expenses are being planned and tracked.
 * 
 * Features:
 * - Student profile information
 * - School details and grade tracking
 * - Parent/guardian relationship
 * - Avatar and notes
 * - Validation for academic years
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

const studentSchema = new mongoose.Schema({
  // Parent/Guardian reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },

  // Basic student information
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },

  birthYear: {
    type: Number,
    required: [true, 'Birth year is required'],
    min: [1990, 'Birth year must be 1990 or later'],
    max: [new Date().getFullYear(), 'Birth year cannot be in the future'],
    validate: {
      validator: function(value) {
        return Number.isInteger(value);
      },
      message: 'Birth year must be a valid integer'
    }
  },

  // School information
  entryYear: {
    type: Number,
    required: [true, 'School entry year is required'],
    min: [2000, 'Entry year must be 2000 or later'],
    max: [new Date().getFullYear() + 10, 'Entry year cannot be more than 10 years in the future'],
    validate: {
      validator: function(value) {
        return Number.isInteger(value) && value >= this.birthYear + 5;
      },
      message: 'Entry year must be at least 5 years after birth year'
    }
  },

  currentGrade: {
    type: Number,
    required: [true, 'Current grade is required'],
    min: [1, 'Grade must be between 1 and 12'],
    max: [12, 'Grade must be between 1 and 12'],
    validate: {
      validator: function(value) {
        return Number.isInteger(value);
      },
      message: 'Grade must be a valid integer'
    }
  },

  schoolType: {
    type: String,
    required: [true, 'School type is required'],
    enum: {
      values: ['public', 'private', 'international'],
      message: 'School type must be public, private, or international'
    },
    lowercase: true,
  },

  // Optional fields
  avatarUrl: {
    type: String,
    default: null,
    validate: {
      validator: function(value) {
        if (!value) return true;
        // Basic URL validation
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Avatar URL must be a valid URL'
    }
  },

  notes: {
    type: String,
    default: '',
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    trim: true,
  },

  // Status
  isActive: {
    type: Boolean,
    default: true,
  },

  // Graduation tracking
  graduationYear: {
    type: Number,
    default: function() {
      return this.entryYear + 12 - this.currentGrade;
    }
  },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for performance
studentSchema.index({ userId: 1, createdAt: -1 });
studentSchema.index({ userId: 1, isActive: 1 });
studentSchema.index({ graduationYear: 1 });

// Virtual for current age
studentSchema.virtual('currentAge').get(function() {
  const currentYear = new Date().getFullYear();
  return currentYear - this.birthYear;
});

// Virtual for school years remaining
studentSchema.virtual('yearsRemaining').get(function() {
  return Math.max(0, 12 - this.currentGrade);
});

// Virtual for academic year
studentSchema.virtual('academicYear').get(function() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  // Academic year typically starts in August/September
  const academicStartYear = currentMonth >= 7 ? currentYear : currentYear - 1;
  return `${academicStartYear}-${academicStartYear + 1}`;
});

// Pre-save middleware to calculate graduation year
studentSchema.pre('save', function(next) {
  if (this.isModified('entryYear') || this.isModified('currentGrade')) {
    this.graduationYear = this.entryYear + 12 - this.currentGrade;
  }
  next();
});

// Pre-save middleware for logging
studentSchema.pre('save', function(next) {
  if (this.isNew) {
    logger.logDatabase('student_created', 'students', {
      studentId: this._id,
      userId: this.userId,
      name: this.name,
      grade: this.currentGrade
    });
  }
  next();
});

// Instance method to advance grade
studentSchema.methods.advanceGrade = async function() {
  if (this.currentGrade < 12) {
    this.currentGrade += 1;
    this.graduationYear = this.entryYear + 12 - this.currentGrade;
    
    await this.save();
    
    logger.logDatabase('grade_advanced', 'students', {
      studentId: this._id,
      newGrade: this.currentGrade,
      graduationYear: this.graduationYear
    });
    
    return this;
  } else {
    throw new Error('Student is already in grade 12');
  }
};

// Instance method to check if graduated
studentSchema.methods.isGraduated = function() {
  return this.currentGrade >= 12 && new Date().getFullYear() >= this.graduationYear;
};

// Static method to find students by user
studentSchema.statics.findByUser = function(userId, includeInactive = false) {
  const query = { userId };
  if (!includeInactive) {
    query.isActive = true;
  }
  return this.find(query).sort({ createdAt: -1 });
};

// Static method to find students by grade
studentSchema.statics.findByGrade = function(grade, userId = null) {
  const query = { currentGrade: grade, isActive: true };
  if (userId) {
    query.userId = userId;
  }
  return this.find(query);
};

// Static method to find graduating students
studentSchema.statics.findGraduating = function(year = null, userId = null) {
  const targetYear = year || new Date().getFullYear();
  const query = { graduationYear: targetYear, isActive: true };
  if (userId) {
    query.userId = userId;
  }
  return this.find(query);
};

// Method to get grade progression
studentSchema.methods.getGradeProgression = function() {
  const progression = [];
  const startYear = this.entryYear;
  
  for (let grade = 1; grade <= 12; grade++) {
    const year = startYear + grade - 1;
    progression.push({
      grade,
      year,
      isCurrent: grade === this.currentGrade,
      isPast: grade < this.currentGrade,
      isFuture: grade > this.currentGrade
    });
  }
  
  return progression;
};

const Student = mongoose.model('Student', studentSchema);

export default Student;
