/**
 * Love Journey - Emotion Model
 * 
 * MongoDB schema for tracking daily/weekly mood and emotional states
 * to help couples understand patterns and improve relationship health.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

const mongoose = require('mongoose');

const EmotionSchema = new mongoose.Schema({
  // Note: Keeping this simple for single-user approach
  // Each emotion entry belongs to a specific user
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Emotion entry must have a user']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date for the emotion entry'],
    default: Date.now
  },
  mood: {
    type: String,
    enum: [
      'amazing', 'great', 'good', 'okay', 'meh', 'bad', 'terrible',
      'excited', 'happy', 'content', 'calm', 'neutral', 'anxious',
      'sad', 'angry', 'frustrated', 'overwhelmed', 'lonely', 'loved',
      'grateful', 'hopeful', 'confident', 'stressed', 'tired'
    ],
    required: [true, 'Please specify a mood']
  },
  intensity: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please rate the intensity (1-10)']
  },
  emotions: [{
    type: String,
    enum: [
      'joy', 'love', 'excitement', 'gratitude', 'peace', 'confidence',
      'hope', 'contentment', 'pride', 'relief', 'surprise', 'curiosity',
      'sadness', 'anger', 'fear', 'anxiety', 'frustration', 'disappointment',
      'loneliness', 'guilt', 'shame', 'jealousy', 'confusion', 'overwhelm'
    ]
  }],
  note: {
    type: String,
    maxlength: [500, 'Note cannot be more than 500 characters']
  },
  triggers: [{
    type: String,
    enum: [
      'work', 'family', 'health', 'finances', 'relationship', 'friends',
      'weather', 'sleep', 'exercise', 'food', 'social-media', 'news',
      'achievement', 'challenge', 'change', 'routine', 'other'
    ]
  }],
  activities: [{
    type: String,
    enum: [
      'work', 'exercise', 'meditation', 'reading', 'cooking', 'cleaning',
      'socializing', 'dating', 'traveling', 'hobbies', 'learning',
      'relaxing', 'entertainment', 'shopping', 'volunteering', 'other'
    ]
  }],
  relationshipSatisfaction: {
    type: Number,
    min: 1,
    max: 10
  },
  communicationQuality: {
    type: Number,
    min: 1,
    max: 10
  },
  intimacyLevel: {
    type: Number,
    min: 1,
    max: 10
  },
  stressLevel: {
    type: Number,
    min: 1,
    max: 10
  },
  energyLevel: {
    type: Number,
    min: 1,
    max: 10
  },
  sleepQuality: {
    type: Number,
    min: 1,
    max: 10
  },
  isPrivate: {
    type: Boolean,
    default: false
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
EmotionSchema.virtual('moodCategory').get(function() {
  const positiveMoods = ['amazing', 'great', 'good', 'excited', 'happy', 'content', 'calm', 'loved', 'grateful', 'hopeful', 'confident'];
  const neutralMoods = ['okay', 'meh', 'neutral'];
  const negativeMoods = ['bad', 'terrible', 'anxious', 'sad', 'angry', 'frustrated', 'overwhelmed', 'lonely', 'stressed', 'tired'];
  
  if (positiveMoods.includes(this.mood)) return 'positive';
  if (neutralMoods.includes(this.mood)) return 'neutral';
  if (negativeMoods.includes(this.mood)) return 'negative';
  
  return 'neutral';
});

// Virtual for overall wellness score
EmotionSchema.virtual('wellnessScore').get(function() {
  const scores = [
    this.relationshipSatisfaction,
    this.communicationQuality,
    this.intimacyLevel,
    (11 - this.stressLevel), // Invert stress level
    this.energyLevel,
    this.sleepQuality
  ].filter(score => score !== undefined && score !== null);
  
  if (scores.length === 0) return null;
  
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  return Math.round(average * 10) / 10;
});

// Virtual for formatted date
EmotionSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

// Pre-save middleware to ensure one entry per user per day
EmotionSchema.pre('save', async function(next) {
  if (this.isNew) {
    const startOfDay = new Date(this.date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(this.date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const existingEntry = await this.constructor.findOne({
      userId: this.userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });
    
    if (existingEntry) {
      const error = new Error('User can only have one emotion entry per day');
      error.name = 'ValidationError';
      return next(error);
    }
  }
  
  next();
});

// Static method to get user's emotion history
EmotionSchema.statics.getUserHistory = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    userId,
    date: { $gte: startDate }
  }).sort({ date: -1 });
};

// Static method to get user emotion trends
EmotionSchema.statics.getUserTrends = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.find({
    userId,
    date: { $gte: startDate }
  }).sort({ date: -1 }).populate('userId', 'name avatar');
};

// Static method to get mood statistics
EmotionSchema.statics.getMoodStats = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const matchQuery = {
    userId,
    date: { $gte: startDate }
  };

  return this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$mood',
        count: { $sum: 1 },
        avgIntensity: { $avg: '$intensity' },
        avgWellness: { $avg: '$wellnessScore' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Static method to get wellness trends
EmotionSchema.statics.getWellnessTrends = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const matchQuery = {
    userId,
    date: { $gte: startDate }
  };

  return this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          day: { $dayOfMonth: '$date' }
        },
        avgRelationshipSatisfaction: { $avg: '$relationshipSatisfaction' },
        avgCommunicationQuality: { $avg: '$communicationQuality' },
        avgIntimacyLevel: { $avg: '$intimacyLevel' },
        avgStressLevel: { $avg: '$stressLevel' },
        avgEnergyLevel: { $avg: '$energyLevel' },
        avgSleepQuality: { $avg: '$sleepQuality' },
        avgWellnessScore: { $avg: '$wellnessScore' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);
};

// Indexes for better query performance
EmotionSchema.index({ userId: 1, date: -1 });
EmotionSchema.index({ mood: 1 });

// Compound index to enforce one entry per user per day
EmotionSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Emotion', EmotionSchema);
