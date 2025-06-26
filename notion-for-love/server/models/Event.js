/**
 * Love Journey - Event Model
 * 
 * MongoDB schema for calendar events including anniversaries,
 * date nights, and important relationship milestones with reminders.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Event must belong to a user']
  },
  title: {
    type: String,
    required: [true, 'Please add an event title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  date: {
    type: Date,
    required: function() {
      // Date is required only for confirmed and planning events
      return this.status === 'confirmed' || this.status === 'planning';
    }
  },
  endDate: {
    type: Date
  },
  isAllDay: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['confirmed', 'planning', 'idea', 'bucket-list', 'completed', 'cancelled'],
    default: 'planning',
    required: [true, 'Please specify event status']
  },
  type: {
    type: String,
    enum: [
      'anniversary', 'birthday', 'date-night', 'family', 'travel',
      'milestone', 'appointment', 'celebration', 'reminder', 'other',
      'dinner', 'activity', 'adventure', 'romantic', 'fun'
    ],
    required: [true, 'Please specify event type']
  },
  location: {
    name: String,
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  reminders: [{
    method: {
      type: String,
      enum: ['email', 'push', 'sms'],
      required: true
    },
    offsetMinutes: {
      type: Number,
      required: true,
      min: 0
    },
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date
  }],
  attendees: [{
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'maybe'],
      default: 'pending'
    },
    respondedAt: Date
  }],
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    interval: {
      type: Number,
      min: 1
    },
    endDate: Date,
    daysOfWeek: [{
      type: Number,
      min: 0,
      max: 6
    }],
    dayOfMonth: Number,
    monthOfYear: Number
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  color: {
    type: String,
    default: '#A57B5B'
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    maxlength: [2000, 'Notes cannot be more than 2000 characters']
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'document', 'link'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    filename: String,
    title: String
  }],
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Event must have a creator']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for event duration
EventSchema.virtual('duration').get(function() {
  if (!this.endDate) return null;
  
  const start = new Date(this.date);
  const end = new Date(this.endDate);
  const diffMs = end - start;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return { hours: diffHours, minutes: diffMinutes };
});

// Virtual for days until event
EventSchema.virtual('daysUntilEvent').get(function() {
  const now = new Date();
  const eventDate = new Date(this.date);
  const diffTime = eventDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
});

// Virtual for event status
EventSchema.virtual('eventStatus').get(function() {
  const now = new Date();
  const eventDate = new Date(this.date);
  const endDate = this.endDate ? new Date(this.endDate) : eventDate;
  
  if (now > endDate) return 'past';
  if (now >= eventDate && now <= endDate) return 'ongoing';
  
  const daysUntil = this.daysUntilEvent;
  if (daysUntil === 0) return 'today';
  if (daysUntil === 1) return 'tomorrow';
  if (daysUntil <= 7) return 'this-week';
  if (daysUntil <= 30) return 'this-month';
  
  return 'future';
});

// Virtual for formatted date
EventSchema.virtual('formattedDate').get(function() {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  if (!this.isAllDay) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return this.date.toLocaleDateString('en-US', options);
});

// Method to add attendee
EventSchema.methods.addAttendee = function(userId, status = 'pending') {
  const existingAttendee = this.attendees.find(a => a.userId.equals(userId));
  
  if (!existingAttendee) {
    this.attendees.push({ userId, status });
  } else {
    existingAttendee.status = status;
    existingAttendee.respondedAt = new Date();
  }
  
  return this.save();
};

// Method to update attendee status
EventSchema.methods.updateAttendeeStatus = function(userId, status) {
  const attendee = this.attendees.find(a => a.userId.equals(userId));
  
  if (attendee) {
    attendee.status = status;
    attendee.respondedAt = new Date();
  }
  
  return this.save();
};

// Method to add reminder
EventSchema.methods.addReminder = function(method, offsetMinutes) {
  this.reminders.push({ method, offsetMinutes });
  return this.save();
};

// Static method to get upcoming events
EventSchema.statics.getUpcoming = function(userId, days = 30) {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  return this.find({
    userId,
    date: {
      $gte: now,
      $lte: futureDate
    }
  }).sort({ date: 1 });
};

// Static method to get events by date range
EventSchema.statics.getByDateRange = function(userId, startDate, endDate) {
  return this.find({
    userId,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: 1 });
};

// Static method to get events by type
EventSchema.statics.getByType = function(userId, type) {
  return this.find({
    userId,
    type
  }).sort({ date: -1 });
};

// Static method to get events needing reminders
EventSchema.statics.getEventsNeedingReminders = function() {
  const now = new Date();
  
  return this.find({
    'reminders.sent': false,
    date: { $gt: now }
  }).populate('userId attendees.userId');
};

// Indexes for better query performance
EventSchema.index({ userId: 1, date: 1 });
EventSchema.index({ userId: 1, type: 1 });
EventSchema.index({ 'attendees.userId': 1 });
EventSchema.index({ createdBy: 1 });
EventSchema.index({ date: 1, 'reminders.sent': 1 });

module.exports = mongoose.model('Event', EventSchema);
