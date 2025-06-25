/**
 * Expense Model - MongoDB schema for actual expenses
 * 
 * This model represents actual expenses incurred for students,
 * which are compared against planned expenses.
 * 
 * Features:
 * - Actual expense tracking
 * - Category-based organization
 * - Receipt image storage
 * - Tagging system
 * - Plan association
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

const expenseSchema = new mongoose.Schema({
  // Student reference
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student ID is required'],
    index: true,
  },

  // Optional plan reference
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    default: null,
    index: true,
  },

  // Expense details
  date: {
    type: Date,
    required: [true, 'Expense date is required'],
    index: true,
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: 'Expense date cannot be in the future'
    }
  },

  category: {
    type: String,
    required: [true, 'Expense category is required'],
    trim: true,
    lowercase: true,
    index: true,
  },

  amount: {
    type: Number,
    required: [true, 'Expense amount is required'],
    min: [0, 'Expense amount cannot be negative'],
    validate: {
      validator: function(value) {
        return Number.isFinite(value) && value >= 0;
      },
      message: 'Expense amount must be a valid positive number'
    }
  },

  description: {
    type: String,
    default: '',
    maxlength: [500, 'Description cannot exceed 500 characters'],
    trim: true,
  },

  note: {
    type: String,
    default: '',
    maxlength: [1000, 'Note cannot exceed 1000 characters'],
    trim: true,
  },

  // Tags for categorization
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

  // Receipt and documentation
  receiptImageUrl: {
    type: String,
    default: null,
    validate: {
      validator: function(value) {
        if (!value) return true;
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Receipt image URL must be a valid URL'
    }
  },

  receiptImagePublicId: {
    type: String,
    default: null, // For Cloudinary public ID
  },

  // Payment information
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'transfer', 'check', 'other'],
    default: 'cash',
    lowercase: true,
  },

  // Status and metadata
  isRecurring: {
    type: Boolean,
    default: false,
  },

  recurringFrequency: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly'],
    default: null,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  // Academic year derived from date
  academicYear: {
    type: String,
    index: true,
  },

  // Grade derived from date and student info
  grade: {
    type: Number,
    min: 1,
    max: 12,
    index: true,
  },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for performance
expenseSchema.index({ studentId: 1, date: -1 });
expenseSchema.index({ studentId: 1, category: 1, date: -1 });
expenseSchema.index({ studentId: 1, academicYear: 1 });
expenseSchema.index({ studentId: 1, grade: 1 });
expenseSchema.index({ planId: 1, category: 1 });

// Virtual for formatted amount
expenseSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(this.amount);
});

// Virtual for expense age
expenseSchema.virtual('daysAgo').get(function() {
  return Math.floor((Date.now() - this.date.getTime()) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to calculate academic year and grade
expenseSchema.pre('save', async function(next) {
  try {
    // Calculate academic year from date
    const expenseYear = this.date.getFullYear();
    const expenseMonth = this.date.getMonth();
    
    // Academic year typically starts in August/September
    const academicStartYear = expenseMonth >= 7 ? expenseYear : expenseYear - 1;
    this.academicYear = `${academicStartYear}-${academicStartYear + 1}`;
    
    // Calculate grade based on student's entry year and current academic year
    if (this.isModified('studentId') || this.isModified('date')) {
      const Student = mongoose.model('Student');
      const student = await Student.findById(this.studentId);
      
      if (student) {
        // Calculate which grade the student was in during this expense date
        const yearsInSchool = academicStartYear - student.entryYear + 1;
        this.grade = Math.max(1, Math.min(12, yearsInSchool));
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware for logging
expenseSchema.pre('save', function(next) {
  if (this.isNew) {
    logger.logDatabase('expense_created', 'expenses', {
      expenseId: this._id,
      studentId: this.studentId,
      category: this.category,
      amount: this.amount,
      date: this.date
    });
  }
  next();
});

// Instance method to add tag
expenseSchema.methods.addTag = function(tag) {
  const normalizedTag = tag.toLowerCase().trim();
  if (!this.tags.includes(normalizedTag)) {
    this.tags.push(normalizedTag);
  }
  return this;
};

// Instance method to remove tag
expenseSchema.methods.removeTag = function(tag) {
  const normalizedTag = tag.toLowerCase().trim();
  this.tags = this.tags.filter(t => t !== normalizedTag);
  return this;
};

// Instance method to check if expense has tag
expenseSchema.methods.hasTag = function(tag) {
  const normalizedTag = tag.toLowerCase().trim();
  return this.tags.includes(normalizedTag);
};

// Static method to find expenses by student
expenseSchema.statics.findByStudent = function(studentId, options = {}) {
  const query = { studentId };
  
  if (options.category) {
    query.category = options.category.toLowerCase();
  }
  
  if (options.startDate || options.endDate) {
    query.date = {};
    if (options.startDate) {
      query.date.$gte = new Date(options.startDate);
    }
    if (options.endDate) {
      query.date.$lte = new Date(options.endDate);
    }
  }
  
  if (options.academicYear) {
    query.academicYear = options.academicYear;
  }
  
  if (options.grade) {
    query.grade = options.grade;
  }
  
  if (options.tags && options.tags.length > 0) {
    query.tags = { $in: options.tags.map(tag => tag.toLowerCase()) };
  }
  
  return this.find(query).sort({ date: -1 });
};

// Static method to get expense summary by category
expenseSchema.statics.getSummaryByCategory = async function(studentId, options = {}) {
  const matchStage = { studentId: new mongoose.Types.ObjectId(studentId) };
  
  if (options.startDate || options.endDate) {
    matchStage.date = {};
    if (options.startDate) {
      matchStage.date.$gte = new Date(options.startDate);
    }
    if (options.endDate) {
      matchStage.date.$lte = new Date(options.endDate);
    }
  }
  
  if (options.academicYear) {
    matchStage.academicYear = options.academicYear;
  }
  
  if (options.grade) {
    matchStage.grade = options.grade;
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$category',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
        avgAmount: { $avg: '$amount' },
        minAmount: { $min: '$amount' },
        maxAmount: { $max: '$amount' }
      }
    },
    { $sort: { totalAmount: -1 } }
  ]);
};

// Static method to get monthly expense trends
expenseSchema.statics.getMonthlyTrends = async function(studentId, year) {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year + 1, 0, 1);
  
  return this.aggregate([
    {
      $match: {
        studentId: new mongoose.Types.ObjectId(studentId),
        date: { $gte: startDate, $lt: endDate }
      }
    },
    {
      $group: {
        _id: {
          month: { $month: '$date' },
          category: '$category'
        },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.month',
        categories: {
          $push: {
            category: '$_id.category',
            amount: '$totalAmount',
            count: '$count'
          }
        },
        monthlyTotal: { $sum: '$totalAmount' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
