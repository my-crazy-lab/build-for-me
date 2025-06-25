/**
 * Plan Model - MongoDB schema for yearly expense plans
 * 
 * This model represents planned expenses for each academic year
 * (grades 1-12) for each student.
 * 
 * Features:
 * - Yearly expense planning by grade
 * - Category-based expense breakdown
 * - Inflation rate calculations
 * - Budget cap management
 * - School year tracking
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

// Default expense categories
export const DEFAULT_CATEGORIES = [
  'tuition',
  'books',
  'uniform',
  'tutoring',
  'devices',
  'transport',
  'meals',
  'extracurricular',
  'summerCamp',
  'examFees',
  'misc'
];

const plannedExpenseSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Expense category is required'],
    trim: true,
    lowercase: true,
  },
  
  amount: {
    type: Number,
    required: [true, 'Planned amount is required'],
    min: [0, 'Planned amount cannot be negative'],
    validate: {
      validator: function(value) {
        return Number.isFinite(value);
      },
      message: 'Planned amount must be a valid number'
    }
  },
  
  description: {
    type: String,
    default: '',
    maxlength: [500, 'Description cannot exceed 500 characters'],
    trim: true,
  }
}, { _id: false });

const planSchema = new mongoose.Schema({
  // Student reference
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student ID is required'],
    index: true,
  },

  // Academic year information
  grade: {
    type: Number,
    required: [true, 'Grade is required'],
    min: [1, 'Grade must be between 1 and 12'],
    max: [12, 'Grade must be between 1 and 12'],
    validate: {
      validator: function(value) {
        return Number.isInteger(value);
      },
      message: 'Grade must be a valid integer'
    }
  },

  schoolYear: {
    type: String,
    required: [true, 'School year is required'],
    match: [/^\d{4}[-–]\d{4}$/, 'School year must be in format YYYY-YYYY'],
    validate: {
      validator: function(value) {
        const [startYear, endYear] = value.split(/[-–]/).map(Number);
        return endYear === startYear + 1;
      },
      message: 'School year end must be one year after start year'
    }
  },

  // Financial planning
  inflationRate: {
    type: Number,
    default: 0,
    min: [-10, 'Inflation rate cannot be less than -10%'],
    max: [50, 'Inflation rate cannot exceed 50%'],
    validate: {
      validator: function(value) {
        return Number.isFinite(value);
      },
      message: 'Inflation rate must be a valid number'
    }
  },

  budgetCap: {
    type: Number,
    default: null,
    min: [0, 'Budget cap cannot be negative'],
    validate: {
      validator: function(value) {
        return value === null || Number.isFinite(value);
      },
      message: 'Budget cap must be a valid number or null'
    }
  },

  // Planned expenses by category
  plannedExpenses: {
    type: [plannedExpenseSchema],
    required: [true, 'At least one planned expense is required'],
    validate: {
      validator: function(expenses) {
        return expenses && expenses.length > 0;
      },
      message: 'Plan must include at least one expense item'
    }
  },

  // Status and metadata
  isActive: {
    type: Boolean,
    default: true,
  },

  notes: {
    type: String,
    default: '',
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    trim: true,
  },

  // Calculated fields
  totalPlannedAmount: {
    type: Number,
    default: 0,
  },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for performance
planSchema.index({ studentId: 1, grade: 1 }, { unique: true });
planSchema.index({ studentId: 1, schoolYear: 1 });
planSchema.index({ grade: 1, isActive: 1 });

// Virtual for academic year status
planSchema.virtual('academicYearStatus').get(function() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  // Extract start year from schoolYear (e.g., "2025-2026" -> 2025)
  const planStartYear = parseInt(this.schoolYear.split(/[-–]/)[0]);
  
  // Academic year typically starts in August/September
  const currentAcademicYear = currentMonth >= 7 ? currentYear : currentYear - 1;
  
  if (planStartYear < currentAcademicYear) {
    return 'past';
  } else if (planStartYear === currentAcademicYear) {
    return 'current';
  } else {
    return 'future';
  }
});

// Virtual for expense categories summary
planSchema.virtual('categorySummary').get(function() {
  const summary = {};
  this.plannedExpenses.forEach(expense => {
    if (summary[expense.category]) {
      summary[expense.category] += expense.amount;
    } else {
      summary[expense.category] = expense.amount;
    }
  });
  return summary;
});

// Pre-save middleware to calculate total planned amount
planSchema.pre('save', function(next) {
  if (this.isModified('plannedExpenses')) {
    this.totalPlannedAmount = this.plannedExpenses.reduce((total, expense) => {
      return total + (expense.amount || 0);
    }, 0);
  }
  next();
});

// Pre-save middleware for logging
planSchema.pre('save', function(next) {
  if (this.isNew) {
    logger.logDatabase('plan_created', 'plans', {
      planId: this._id,
      studentId: this.studentId,
      grade: this.grade,
      schoolYear: this.schoolYear,
      totalAmount: this.totalPlannedAmount
    });
  }
  next();
});

// Instance method to add expense category
planSchema.methods.addExpenseCategory = function(category, amount, description = '') {
  // Check if category already exists
  const existingExpense = this.plannedExpenses.find(exp => exp.category === category.toLowerCase());
  
  if (existingExpense) {
    existingExpense.amount += amount;
    if (description) {
      existingExpense.description = description;
    }
  } else {
    this.plannedExpenses.push({
      category: category.toLowerCase(),
      amount,
      description
    });
  }
  
  return this;
};

// Instance method to remove expense category
planSchema.methods.removeExpenseCategory = function(category) {
  this.plannedExpenses = this.plannedExpenses.filter(
    exp => exp.category !== category.toLowerCase()
  );
  return this;
};

// Instance method to update expense amount
planSchema.methods.updateExpenseAmount = function(category, newAmount) {
  const expense = this.plannedExpenses.find(exp => exp.category === category.toLowerCase());
  if (expense) {
    expense.amount = newAmount;
  }
  return this;
};

// Instance method to apply inflation
planSchema.methods.applyInflation = function(rate = null) {
  const inflationRate = rate !== null ? rate : this.inflationRate;
  const multiplier = 1 + (inflationRate / 100);
  
  this.plannedExpenses.forEach(expense => {
    expense.amount = Math.round(expense.amount * multiplier);
  });
  
  if (this.budgetCap) {
    this.budgetCap = Math.round(this.budgetCap * multiplier);
  }
  
  return this;
};

// Static method to find plans by student
planSchema.statics.findByStudent = function(studentId, includeInactive = false) {
  const query = { studentId };
  if (!includeInactive) {
    query.isActive = true;
  }
  return this.find(query).sort({ grade: 1 });
};

// Static method to find plan by student and grade
planSchema.statics.findByStudentAndGrade = function(studentId, grade) {
  return this.findOne({ studentId, grade, isActive: true });
};

// Static method to create plan from template
planSchema.statics.createFromTemplate = async function(studentId, grade, schoolYear, templateData) {
  const planData = {
    studentId,
    grade,
    schoolYear,
    inflationRate: templateData.inflationRate || 0,
    budgetCap: templateData.budgetCap || null,
    plannedExpenses: templateData.plannedExpenses || [],
    notes: templateData.notes || ''
  };
  
  return this.create(planData);
};

// Static method to duplicate plan for next grade
planSchema.statics.duplicateForNextGrade = async function(planId, newSchoolYear) {
  const originalPlan = await this.findById(planId);
  if (!originalPlan) {
    throw new Error('Original plan not found');
  }
  
  const newPlan = new this({
    studentId: originalPlan.studentId,
    grade: originalPlan.grade + 1,
    schoolYear: newSchoolYear,
    inflationRate: originalPlan.inflationRate,
    budgetCap: originalPlan.budgetCap,
    plannedExpenses: originalPlan.plannedExpenses.map(expense => ({
      category: expense.category,
      amount: expense.amount,
      description: expense.description
    })),
    notes: originalPlan.notes
  });
  
  // Apply inflation if specified
  if (originalPlan.inflationRate > 0) {
    newPlan.applyInflation();
  }
  
  return newPlan.save();
};

const Plan = mongoose.model('Plan', planSchema);

export default Plan;
