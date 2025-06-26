/**
 * Love Journey - Check-in Model
 * 
 * MongoDB schema for relationship health check-ins with prompts,
 * responses, and gamification badges to encourage regular reflection.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

const mongoose = require('mongoose');

const CheckinSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Check-in must have a user']
  },
  date: {
    type: Date,
    required: [true, 'Please add a check-in date'],
    default: Date.now
  },
  prompt: {
    type: String,
    required: [true, 'Check-in must have a prompt'],
    maxlength: [500, 'Prompt cannot be more than 500 characters']
  },
  response: {
    type: String,
    required: [true, 'Please provide a response'],
    maxlength: [2000, 'Response cannot be more than 2000 characters']
  },
  category: {
    type: String,
    enum: [
      'gratitude', 'communication', 'intimacy', 'goals', 'challenges',
      'appreciation', 'growth', 'fun', 'support', 'future', 'reflection'
    ],
    required: [true, 'Please specify a check-in category']
  },
  mood: {
    type: String,
    enum: [
      'amazing', 'great', 'good', 'okay', 'meh', 'concerned', 'frustrated'
    ],
    required: [true, 'Please specify your mood']
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please provide a rating (1-10)']
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  isShared: {
    type: Boolean,
    default: false
  },
  partnerResponse: {
    response: String,
    rating: {
      type: Number,
      min: 1,
      max: 10
    },
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  },
  badges: [{
    type: String,
    enum: [
      'consistency', 'honesty', 'empathy', 'growth', 'communication',
      'gratitude', 'support', 'reflection', 'openness', 'commitment'
    ]
  }],
  streak: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for mood category
CheckinSchema.virtual('moodCategory').get(function() {
  const positiveMoods = ['amazing', 'great', 'good'];
  const neutralMoods = ['okay', 'meh'];
  const negativeMoods = ['concerned', 'frustrated'];
  
  if (positiveMoods.includes(this.mood)) return 'positive';
  if (neutralMoods.includes(this.mood)) return 'neutral';
  if (negativeMoods.includes(this.mood)) return 'negative';
  
  return 'neutral';
});

// Virtual for formatted date
CheckinSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for has partner response
CheckinSchema.virtual('hasPartnerResponse').get(function() {
  return !!(this.partnerResponse && this.partnerResponse.response);
});

// Method to add partner response
CheckinSchema.methods.addPartnerResponse = function(userId, response, rating) {
  this.partnerResponse = {
    response,
    rating,
    respondedAt: new Date(),
    respondedBy: userId
  };
  this.isShared = true;
  return this.save();
};

// Method to award badge
CheckinSchema.methods.awardBadge = function(badgeType) {
  if (!this.badges.includes(badgeType)) {
    this.badges.push(badgeType);
  }
  return this.save();
};

// Static method to get user's check-in history
CheckinSchema.statics.getUserHistory = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    userId,
    date: { $gte: startDate }
  }).sort({ date: -1 });
};

// Static method to get user check-ins
CheckinSchema.statics.getUserCheckins = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.find({
    userId,
    date: { $gte: startDate }
  }).sort({ date: -1 }).populate('userId', 'name avatar');
};

// Static method to calculate streak
CheckinSchema.statics.calculateStreak = async function(userId) {
  const checkins = await this.find({ userId }).sort({ date: -1 });
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (const checkin of checkins) {
    const checkinDate = new Date(checkin.date);
    checkinDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((currentDate - checkinDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};

// Indexes for better query performance
CheckinSchema.index({ userId: 1, date: -1 });
CheckinSchema.index({ category: 1 });

module.exports = mongoose.model('Checkin', CheckinSchema);
