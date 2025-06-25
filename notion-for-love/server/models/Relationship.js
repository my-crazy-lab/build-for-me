/**
 * Love Journey - Relationship Model
 * 
 * MongoDB schema for relationship entities that connect couples
 * and serve as the central hub for all shared data.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

const mongoose = require('mongoose');

const RelationshipSchema = new mongoose.Schema({
  coupleName: {
    type: String,
    required: [true, 'Please add a couple name'],
    trim: true,
    maxlength: [100, 'Couple name cannot be more than 100 characters']
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'ended'],
    default: 'active'
  },
  partnerIds: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }],
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    layout: {
      type: String,
      enum: ['minimal', 'timeline-focused', 'memory-first', 'custom'],
      default: 'custom'
    },
    privacy: {
      publicProfile: {
        type: Boolean,
        default: false
      },
      shareMemories: {
        type: Boolean,
        default: true
      }
    },
    notifications: {
      milestoneReminders: {
        type: Boolean,
        default: true
      },
      goalDeadlines: {
        type: Boolean,
        default: true
      },
      checkinPrompts: {
        type: Boolean,
        default: true
      }
    }
  },
  anniversaryDate: {
    type: Date,
    default: null
  },
  relationshipStartDate: {
    type: Date,
    default: null
  },
  stats: {
    milestonesCount: {
      type: Number,
      default: 0
    },
    memoriesCount: {
      type: Number,
      default: 0
    },
    goalsCompleted: {
      type: Number,
      default: 0
    },
    daysTogetherCount: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculating days together
RelationshipSchema.virtual('daysTogether').get(function() {
  if (!this.relationshipStartDate) return 0;
  
  const now = new Date();
  const start = new Date(this.relationshipStartDate);
  const diffTime = Math.abs(now - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
});

// Virtual for next anniversary
RelationshipSchema.virtual('nextAnniversary').get(function() {
  if (!this.anniversaryDate) return null;
  
  const now = new Date();
  const anniversary = new Date(this.anniversaryDate);
  const currentYear = now.getFullYear();
  
  // Set anniversary to current year
  anniversary.setFullYear(currentYear);
  
  // If anniversary has passed this year, set to next year
  if (anniversary < now) {
    anniversary.setFullYear(currentYear + 1);
  }
  
  return anniversary;
});

// Virtual for relationship duration
RelationshipSchema.virtual('relationshipDuration').get(function() {
  if (!this.relationshipStartDate) return null;
  
  const now = new Date();
  const start = new Date(this.relationshipStartDate);
  
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  
  if (days < 0) {
    months--;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  return { years, months, days };
});

// Middleware to update stats
RelationshipSchema.methods.updateStats = async function() {
  try {
    // This will be implemented when we create the other models
    // For now, just update the days together count
    if (this.relationshipStartDate) {
      this.stats.daysTogetherCount = this.daysTogether;
    }
    
    await this.save({ validateBeforeSave: false });
  } catch (error) {
    console.error('Error updating relationship stats:', error);
  }
};

// Method to add partner
RelationshipSchema.methods.addPartner = function(userId) {
  if (!this.partnerIds.includes(userId)) {
    this.partnerIds.push(userId);
  }
  return this.save();
};

// Method to remove partner
RelationshipSchema.methods.removePartner = function(userId) {
  this.partnerIds = this.partnerIds.filter(id => !id.equals(userId));
  return this.save();
};

// Method to check if user is partner
RelationshipSchema.methods.isPartner = function(userId) {
  return this.partnerIds.some(id => id.equals(userId));
};

// Index for better query performance
RelationshipSchema.index({ partnerIds: 1 });
RelationshipSchema.index({ status: 1 });
RelationshipSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Relationship', RelationshipSchema);
