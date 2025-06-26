/**
 * Love Journey - Growth Tracker Model
 * 
 * MongoDB schema for the couple's symbolic tree that grows with
 * relationship milestones, achievements, and acts of love.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

const mongoose = require('mongoose');

const GrowthTrackerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Growth tracker must belong to a user'],
    unique: true
  },
  leavesCount: {
    type: Number,
    default: 0,
    min: 0
  },
  flowersCount: {
    type: Number,
    default: 0,
    min: 0
  },
  fruitsCount: {
    type: Number,
    default: 0,
    min: 0
  },
  treeLevel: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  totalPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  milestonesEarned: [{
    milestoneId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Milestone'
    },
    type: {
      type: String,
      enum: ['leaf', 'flower', 'fruit'],
      required: true
    },
    points: {
      type: Number,
      required: true,
      min: 1
    },
    earnedAt: {
      type: Date,
      default: Date.now
    },
    description: String
  }],
  achievements: [{
    type: {
      type: String,
      enum: [
        'first-milestone', 'memory-keeper', 'goal-achiever', 'communicator',
        'romantic', 'adventurer', 'planner', 'supporter', 'consistent',
        'grateful', 'growth-mindset', 'team-player', 'creative', 'resilient'
      ],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    icon: String,
    points: {
      type: Number,
      required: true
    },
    unlockedAt: {
      type: Date,
      default: Date.now
    },
    rarity: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary'],
      default: 'common'
    }
  }],
  seasonalEvents: [{
    season: {
      type: String,
      enum: ['spring', 'summer', 'autumn', 'winter'],
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    specialRewards: [{
      type: String,
      description: String,
      earnedAt: Date
    }],
    isActive: {
      type: Boolean,
      default: false
    }
  }],
  streaks: {
    dailyCheckin: {
      current: {
        type: Number,
        default: 0
      },
      longest: {
        type: Number,
        default: 0
      },
      lastCheckin: Date
    },
    weeklyGoals: {
      current: {
        type: Number,
        default: 0
      },
      longest: {
        type: Number,
        default: 0
      }
    },
    monthlyMilestones: {
      current: {
        type: Number,
        default: 0
      },
      longest: {
        type: Number,
        default: 0
      }
    }
  },
  customizations: {
    treeType: {
      type: String,
      enum: ['oak', 'cherry', 'maple', 'willow', 'pine', 'bamboo'],
      default: 'oak'
    },
    environment: {
      type: String,
      enum: ['forest', 'garden', 'mountain', 'beach', 'meadow'],
      default: 'garden'
    },
    season: {
      type: String,
      enum: ['spring', 'summer', 'autumn', 'winter'],
      default: 'spring'
    },
    decorations: [{
      type: String,
      unlockedAt: Date
    }]
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total growth items
GrowthTrackerSchema.virtual('totalGrowthItems').get(function() {
  return this.leavesCount + this.flowersCount + this.fruitsCount;
});

// Virtual for tree health
GrowthTrackerSchema.virtual('treeHealth').get(function() {
  const total = this.totalGrowthItems;
  if (total >= 100) return 'flourishing';
  if (total >= 50) return 'healthy';
  if (total >= 20) return 'growing';
  if (total >= 5) return 'young';
  return 'seedling';
});

// Virtual for next level progress
GrowthTrackerSchema.virtual('nextLevelProgress').get(function() {
  const pointsForNextLevel = this.treeLevel * 100;
  const currentLevelPoints = (this.treeLevel - 1) * 100;
  const progressPoints = this.totalPoints - currentLevelPoints;
  const neededPoints = pointsForNextLevel - currentLevelPoints;
  
  return {
    current: progressPoints,
    needed: neededPoints,
    percentage: Math.min(100, Math.round((progressPoints / neededPoints) * 100))
  };
});

// Virtual for achievement count by rarity
GrowthTrackerSchema.virtual('achievementsByRarity').get(function() {
  const counts = { common: 0, rare: 0, epic: 0, legendary: 0 };
  this.achievements.forEach(achievement => {
    counts[achievement.rarity]++;
  });
  return counts;
});

// Method to add growth item
GrowthTrackerSchema.methods.addGrowthItem = function(type, points, description, milestoneId = null) {
  // Add to appropriate counter
  switch (type) {
    case 'leaf':
      this.leavesCount++;
      break;
    case 'flower':
      this.flowersCount++;
      break;
    case 'fruit':
      this.fruitsCount++;
      break;
  }
  
  // Add to milestones earned
  this.milestonesEarned.push({
    milestoneId,
    type,
    points,
    description
  });
  
  // Update total points
  this.totalPoints += points;
  
  // Check for level up
  this.checkLevelUp();
  
  // Update last updated
  this.lastUpdated = new Date();
  
  return this.save();
};

// Method to unlock achievement
GrowthTrackerSchema.methods.unlockAchievement = function(achievementData) {
  // Check if achievement already exists
  const exists = this.achievements.some(a => a.type === achievementData.type);
  
  if (!exists) {
    this.achievements.push(achievementData);
    this.totalPoints += achievementData.points;
    this.checkLevelUp();
    this.lastUpdated = new Date();
  }
  
  return this.save();
};

// Method to check and handle level up
GrowthTrackerSchema.methods.checkLevelUp = function() {
  const newLevel = Math.floor(this.totalPoints / 100) + 1;
  
  if (newLevel > this.treeLevel && newLevel <= 10) {
    this.treeLevel = newLevel;
    
    // Unlock level-based rewards
    this.unlockLevelRewards(newLevel);
  }
};

// Method to unlock level rewards
GrowthTrackerSchema.methods.unlockLevelRewards = function(level) {
  const levelRewards = {
    2: { decoration: 'bird-nest', points: 50 },
    3: { decoration: 'butterfly', points: 75 },
    4: { decoration: 'swing', points: 100 },
    5: { decoration: 'fairy-lights', points: 125 },
    6: { decoration: 'tree-house', points: 150 },
    7: { decoration: 'wind-chimes', points: 175 },
    8: { decoration: 'garden-gnome', points: 200 },
    9: { decoration: 'fountain', points: 225 },
    10: { decoration: 'rainbow', points: 250 }
  };
  
  const reward = levelRewards[level];
  if (reward) {
    this.customizations.decorations.push({
      type: reward.decoration,
      unlockedAt: new Date()
    });
    
    this.totalPoints += reward.points;
  }
};

// Method to update streak
GrowthTrackerSchema.methods.updateStreak = function(streakType, increment = true) {
  const streak = this.streaks[streakType];
  
  if (increment) {
    streak.current++;
    if (streak.current > streak.longest) {
      streak.longest = streak.current;
    }
  } else {
    streak.current = 0;
  }
  
  if (streakType === 'dailyCheckin') {
    streak.lastCheckin = new Date();
  }
  
  return this.save();
};

// Method to change tree customization
GrowthTrackerSchema.methods.updateCustomization = function(customizationType, value) {
  this.customizations[customizationType] = value;
  this.lastUpdated = new Date();
  return this.save();
};

// Static method to get leaderboard
GrowthTrackerSchema.statics.getLeaderboard = function(limit = 10) {
  return this.find({})
    .sort({ totalPoints: -1, treeLevel: -1 })
    .limit(limit)
    .populate('userId', 'name');
};

// Static method to get growth statistics
GrowthTrackerSchema.statics.getGrowthStats = function(userId) {
  return this.findOne({ userId })
    .populate('userId', 'name stats');
};

// Indexes for better query performance
GrowthTrackerSchema.index({ userId: 1 }, { unique: true });
GrowthTrackerSchema.index({ totalPoints: -1 });
GrowthTrackerSchema.index({ treeLevel: -1 });

module.exports = mongoose.model('GrowthTracker', GrowthTrackerSchema);
