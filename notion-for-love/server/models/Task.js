/**
 * Love Journey - Task Model
 * 
 * MongoDB schema for tasks in the couple's planning board.
 * Supports Kanban-style workflow with assignment and categorization.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  relationshipId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Relationship',
    required: [true, 'Task must belong to a relationship']
  },
  title: {
    type: String,
    required: [true, 'Please add a task title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  status: {
    type: String,
    enum: ['todo', 'planning', 'in-progress', 'done'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: [
      'household', 'finances', 'romantic', 'family', 'health',
      'travel', 'career', 'social', 'personal', 'other'
    ],
    default: 'other'
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  dueDate: {
    type: Date
  },
  completedDate: {
    type: Date
  },
  estimatedHours: {
    type: Number,
    min: 0
  },
  actualHours: {
    type: Number,
    min: 0
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  goalId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Goal'
  },
  subtasks: [{
    title: {
      type: String,
      required: true,
      maxlength: [100, 'Subtask title cannot be more than 100 characters']
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    completedAt: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
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
    title: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      maxlength: [500, 'Comment cannot be more than 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  position: {
    type: Number,
    default: 0
  },
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
    endDate: Date
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Task must have a creator']
  },
  lastEditedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  lastEditedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for days until due date
TaskSchema.virtual('daysUntilDue').get(function() {
  if (!this.dueDate) return null;
  
  const now = new Date();
  const due = new Date(this.dueDate);
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
});

// Virtual for subtask completion percentage
TaskSchema.virtual('subtaskProgress').get(function() {
  if (!this.subtasks || this.subtasks.length === 0) return 100;
  
  const completedSubtasks = this.subtasks.filter(st => st.isCompleted).length;
  return Math.round((completedSubtasks / this.subtasks.length) * 100);
});

// Virtual for status display
TaskSchema.virtual('statusDisplay').get(function() {
  if (this.status === 'done') return 'Completed';
  
  if (this.dueDate) {
    const daysUntil = this.daysUntilDue;
    if (daysUntil < 0) return 'Overdue';
    if (daysUntil === 0) return 'Due Today';
    if (daysUntil <= 3) return 'Due Soon';
  }
  
  const statusMap = {
    'todo': 'To Do',
    'planning': 'Planning',
    'in-progress': 'In Progress'
  };
  
  return statusMap[this.status] || this.status;
});

// Pre-save middleware
TaskSchema.pre('save', function(next) {
  // Update lastEditedAt if modified
  if (this.isModified() && !this.isNew) {
    this.lastEditedAt = new Date();
  }
  
  // Set completed date when status changes to done
  if (this.isModified('status') && this.status === 'done' && !this.completedDate) {
    this.completedDate = new Date();
  }
  
  // Clear completed date if status changes from done
  if (this.isModified('status') && this.status !== 'done' && this.completedDate) {
    this.completedDate = undefined;
  }
  
  next();
});

// Method to add subtask
TaskSchema.methods.addSubtask = function(title) {
  this.subtasks.push({ title });
  return this.save();
};

// Method to complete subtask
TaskSchema.methods.completeSubtask = function(subtaskId) {
  const subtask = this.subtasks.id(subtaskId);
  if (subtask) {
    subtask.isCompleted = true;
    subtask.completedAt = new Date();
    
    // Check if all subtasks are completed
    const allCompleted = this.subtasks.every(st => st.isCompleted);
    if (allCompleted && this.status !== 'done') {
      this.status = 'done';
    }
  }
  return this.save();
};

// Method to add comment
TaskSchema.methods.addComment = function(userId, text) {
  this.comments.push({ userId, text });
  return this.save();
};

// Method to move task (update position and status)
TaskSchema.methods.moveTo = function(newStatus, newPosition) {
  this.status = newStatus;
  this.position = newPosition;
  return this.save();
};

// Method to assign task
TaskSchema.methods.assignTo = function(userId) {
  this.assignedTo = userId;
  return this.save();
};

// Static method to get tasks by status
TaskSchema.statics.getByStatus = function(relationshipId, status) {
  return this.find({ relationshipId, status })
    .sort({ position: 1, createdAt: -1 })
    .populate('assignedTo', 'name avatar')
    .populate('createdBy', 'name avatar');
};

// Static method to get tasks by assignee
TaskSchema.statics.getByAssignee = function(relationshipId, userId) {
  return this.find({ relationshipId, assignedTo: userId })
    .sort({ dueDate: 1, createdAt: -1 });
};

// Static method to get overdue tasks
TaskSchema.statics.getOverdue = function(relationshipId) {
  return this.find({
    relationshipId,
    status: { $ne: 'done' },
    dueDate: { $lt: new Date() }
  }).sort({ dueDate: 1 });
};

// Static method to get tasks for Kanban board
TaskSchema.statics.getKanbanBoard = function(relationshipId) {
  return this.find({ relationshipId })
    .sort({ status: 1, position: 1, createdAt: -1 })
    .populate('assignedTo', 'name avatar')
    .populate('createdBy', 'name avatar');
};

// Indexes for better query performance
TaskSchema.index({ relationshipId: 1, status: 1, position: 1 });
TaskSchema.index({ relationshipId: 1, assignedTo: 1 });
TaskSchema.index({ relationshipId: 1, dueDate: 1 });
TaskSchema.index({ goalId: 1 });
TaskSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Task', TaskSchema);
