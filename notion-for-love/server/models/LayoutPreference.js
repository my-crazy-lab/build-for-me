/**
 * Love Journey - Layout Preference Model
 * 
 * MongoDB schema for storing customizable dashboard layout preferences
 * allowing couples to personalize their Love Journey experience.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

const mongoose = require('mongoose');

const LayoutPreferenceSchema = new mongoose.Schema({
  relationshipId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Relationship',
    required: [true, 'Layout preference must belong to a relationship'],
    unique: true
  },
  layoutConfig: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    colorScheme: {
      type: String,
      enum: ['earthy-neutrals', 'romantic-pink', 'ocean-blue', 'forest-green', 'sunset-orange'],
      default: 'earthy-neutrals'
    },
    layout: {
      type: String,
      enum: ['minimal', 'timeline-focused', 'memory-first', 'custom'],
      default: 'custom'
    },
    modules: [{
      id: {
        type: String,
        required: true,
        enum: [
          'milestone-timeline', 'shared-goals', 'memory-highlights', 
          'planning-board', 'emotion-tracker', 'love-calendar', 
          'growth-tracker', 'time-capsule', 'health-checkins',
          'quick-stats', 'recent-activity', 'upcoming-events'
        ]
      },
      position: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 }
      },
      size: {
        width: { type: Number, default: 1 },
        height: { type: Number, default: 1 }
      },
      isVisible: {
        type: Boolean,
        default: true
      },
      settings: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
      }
    }],
    gridSettings: {
      columns: {
        type: Number,
        default: 12,
        min: 1,
        max: 24
      },
      rowHeight: {
        type: Number,
        default: 100,
        min: 50,
        max: 200
      },
      margin: {
        type: Number,
        default: 10,
        min: 0,
        max: 50
      },
      padding: {
        type: Number,
        default: 10,
        min: 0,
        max: 50
      }
    },
    sidebar: {
      isCollapsed: {
        type: Boolean,
        default: false
      },
      position: {
        type: String,
        enum: ['left', 'right'],
        default: 'left'
      },
      width: {
        type: Number,
        default: 250,
        min: 200,
        max: 400
      }
    },
    navigation: {
      style: {
        type: String,
        enum: ['sidebar', 'topbar', 'floating'],
        default: 'sidebar'
      },
      showLabels: {
        type: Boolean,
        default: true
      },
      compactMode: {
        type: Boolean,
        default: false
      }
    },
    animations: {
      enabled: {
        type: Boolean,
        default: true
      },
      speed: {
        type: String,
        enum: ['slow', 'normal', 'fast'],
        default: 'normal'
      },
      reducedMotion: {
        type: Boolean,
        default: false
      }
    },
    accessibility: {
      highContrast: {
        type: Boolean,
        default: false
      },
      largeText: {
        type: Boolean,
        default: false
      },
      screenReader: {
        type: Boolean,
        default: false
      }
    }
  },
  presets: [{
    name: {
      type: String,
      required: true,
      maxlength: [50, 'Preset name cannot be more than 50 characters']
    },
    description: String,
    config: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  customizations: {
    fonts: {
      primary: {
        type: String,
        default: 'Inter'
      },
      secondary: {
        type: String,
        default: 'Playfair Display'
      },
      size: {
        type: String,
        enum: ['small', 'medium', 'large'],
        default: 'medium'
      }
    },
    spacing: {
      type: String,
      enum: ['compact', 'normal', 'spacious'],
      default: 'normal'
    },
    borderRadius: {
      type: String,
      enum: ['none', 'small', 'medium', 'large'],
      default: 'medium'
    },
    shadows: {
      type: String,
      enum: ['none', 'subtle', 'medium', 'strong'],
      default: 'medium'
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for active modules count
LayoutPreferenceSchema.virtual('activeModulesCount').get(function() {
  return this.layoutConfig.modules.filter(module => module.isVisible).length;
});

// Virtual for layout complexity
LayoutPreferenceSchema.virtual('layoutComplexity').get(function() {
  const moduleCount = this.activeModulesCount;
  if (moduleCount <= 3) return 'simple';
  if (moduleCount <= 6) return 'moderate';
  if (moduleCount <= 9) return 'complex';
  return 'advanced';
});

// Method to add module
LayoutPreferenceSchema.methods.addModule = function(moduleData) {
  // Check if module already exists
  const existingModule = this.layoutConfig.modules.find(m => m.id === moduleData.id);
  
  if (!existingModule) {
    this.layoutConfig.modules.push(moduleData);
    this.updatedAt = new Date();
  }
  
  return this.save();
};

// Method to update module
LayoutPreferenceSchema.methods.updateModule = function(moduleId, updates) {
  const module = this.layoutConfig.modules.find(m => m.id === moduleId);
  
  if (module) {
    Object.assign(module, updates);
    this.updatedAt = new Date();
  }
  
  return this.save();
};

// Method to remove module
LayoutPreferenceSchema.methods.removeModule = function(moduleId) {
  this.layoutConfig.modules = this.layoutConfig.modules.filter(m => m.id !== moduleId);
  this.updatedAt = new Date();
  return this.save();
};

// Method to toggle module visibility
LayoutPreferenceSchema.methods.toggleModuleVisibility = function(moduleId) {
  const module = this.layoutConfig.modules.find(m => m.id === moduleId);
  
  if (module) {
    module.isVisible = !module.isVisible;
    this.updatedAt = new Date();
  }
  
  return this.save();
};

// Method to save preset
LayoutPreferenceSchema.methods.savePreset = function(name, description, config) {
  // Remove existing default if this is being set as default
  if (config.isDefault) {
    this.presets.forEach(preset => {
      preset.isDefault = false;
    });
  }
  
  this.presets.push({
    name,
    description,
    config,
    isDefault: config.isDefault || false
  });
  
  return this.save();
};

// Method to apply preset
LayoutPreferenceSchema.methods.applyPreset = function(presetId) {
  const preset = this.presets.id(presetId);
  
  if (preset) {
    this.layoutConfig = { ...this.layoutConfig, ...preset.config };
    this.updatedAt = new Date();
  }
  
  return this.save();
};

// Method to reset to default layout
LayoutPreferenceSchema.methods.resetToDefault = function() {
  const defaultConfig = {
    theme: 'system',
    colorScheme: 'earthy-neutrals',
    layout: 'custom',
    modules: [
      { id: 'milestone-timeline', position: { x: 0, y: 0 }, size: { width: 6, height: 2 }, isVisible: true },
      { id: 'shared-goals', position: { x: 6, y: 0 }, size: { width: 6, height: 2 }, isVisible: true },
      { id: 'memory-highlights', position: { x: 0, y: 2 }, size: { width: 4, height: 2 }, isVisible: true },
      { id: 'emotion-tracker', position: { x: 4, y: 2 }, size: { width: 4, height: 2 }, isVisible: true },
      { id: 'growth-tracker', position: { x: 8, y: 2 }, size: { width: 4, height: 2 }, isVisible: true }
    ]
  };
  
  this.layoutConfig = { ...this.layoutConfig, ...defaultConfig };
  this.updatedAt = new Date();
  
  return this.save();
};

// Static method to get default layout
LayoutPreferenceSchema.statics.getDefaultLayout = function() {
  return {
    theme: 'system',
    colorScheme: 'earthy-neutrals',
    layout: 'custom',
    modules: [
      { id: 'milestone-timeline', position: { x: 0, y: 0 }, size: { width: 6, height: 2 }, isVisible: true },
      { id: 'shared-goals', position: { x: 6, y: 0 }, size: { width: 6, height: 2 }, isVisible: true },
      { id: 'memory-highlights', position: { x: 0, y: 2 }, size: { width: 4, height: 2 }, isVisible: true },
      { id: 'emotion-tracker', position: { x: 4, y: 2 }, size: { width: 4, height: 2 }, isVisible: true },
      { id: 'growth-tracker', position: { x: 8, y: 2 }, size: { width: 4, height: 2 }, isVisible: true }
    ],
    gridSettings: {
      columns: 12,
      rowHeight: 100,
      margin: 10,
      padding: 10
    }
  };
};

// Indexes for better query performance
LayoutPreferenceSchema.index({ relationshipId: 1 }, { unique: true });

module.exports = mongoose.model('LayoutPreference', LayoutPreferenceSchema);
