/**
 * Notification System Utilities for Reviewly Application
 * 
 * Comprehensive notification management including in-app notifications,
 * email reminders, push notifications, and notification scheduling.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

// Notification types and interfaces
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: NotificationCategory;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
  expiresAt?: Date;
  userId: string;
}

export type NotificationType = 
  | 'review_deadline'
  | 'feedback_received'
  | 'feedback_request'
  | 'goal_deadline'
  | 'milestone_achieved'
  | 'skill_progress'
  | 'team_update'
  | 'system_announcement'
  | 'reminder'
  | 'achievement_unlocked';

export type NotificationCategory = 
  | 'reviews'
  | 'feedback'
  | 'goals'
  | 'achievements'
  | 'team'
  | 'system'
  | 'reminders';

export interface NotificationPreferences {
  userId: string;
  inApp: {
    enabled: boolean;
    categories: NotificationCategory[];
    priority: ('low' | 'medium' | 'high' | 'urgent')[];
  };
  email: {
    enabled: boolean;
    categories: NotificationCategory[];
    frequency: 'immediate' | 'daily' | 'weekly';
    quietHours: {
      enabled: boolean;
      start: string; // HH:mm format
      end: string;   // HH:mm format
    };
  };
  push: {
    enabled: boolean;
    categories: NotificationCategory[];
    priority: ('medium' | 'high' | 'urgent')[];
  };
}

export interface NotificationTemplate {
  type: NotificationType;
  title: string;
  message: string;
  actionLabel?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: NotificationCategory;
}

// Notification templates
export const NOTIFICATION_TEMPLATES: Record<NotificationType, NotificationTemplate> = {
  review_deadline: {
    type: 'review_deadline',
    title: '📝 Review Deadline Approaching',
    message: 'Your {reviewType} review is due in {timeRemaining}. Complete it now to stay on track.',
    actionLabel: 'Complete Review',
    priority: 'high',
    category: 'reviews'
  },
  feedback_received: {
    type: 'feedback_received',
    title: '💬 New Feedback Received',
    message: 'You have received new feedback from {sender}. Check it out to see your progress.',
    actionLabel: 'View Feedback',
    priority: 'medium',
    category: 'feedback'
  },
  feedback_request: {
    type: 'feedback_request',
    title: '🤝 Feedback Request',
    message: '{requester} has requested your feedback. Your input helps them grow.',
    actionLabel: 'Provide Feedback',
    priority: 'medium',
    category: 'feedback'
  },
  goal_deadline: {
    type: 'goal_deadline',
    title: '🎯 Goal Deadline Reminder',
    message: 'Your goal "{goalTitle}" is due in {timeRemaining}. Time to make progress!',
    actionLabel: 'Update Goal',
    priority: 'medium',
    category: 'goals'
  },
  milestone_achieved: {
    type: 'milestone_achieved',
    title: '🎉 Milestone Achieved!',
    message: 'Congratulations! You have achieved the milestone: {milestoneTitle}',
    actionLabel: 'View Achievement',
    priority: 'low',
    category: 'achievements'
  },
  skill_progress: {
    type: 'skill_progress',
    title: '🚀 Skill Progress Update',
    message: 'Great progress on {skillName}! You have improved by {progressAmount} this period.',
    actionLabel: 'View Skills',
    priority: 'low',
    category: 'achievements'
  },
  team_update: {
    type: 'team_update',
    title: '👥 Team Update',
    message: '{updateMessage}',
    actionLabel: 'View Details',
    priority: 'medium',
    category: 'team'
  },
  system_announcement: {
    type: 'system_announcement',
    title: '📢 System Announcement',
    message: '{announcementMessage}',
    actionLabel: 'Learn More',
    priority: 'medium',
    category: 'system'
  },
  reminder: {
    type: 'reminder',
    title: '⏰ Reminder',
    message: '{reminderMessage}',
    actionLabel: 'Take Action',
    priority: 'medium',
    category: 'reminders'
  },
  achievement_unlocked: {
    type: 'achievement_unlocked',
    title: '🏆 Achievement Unlocked!',
    message: 'You have unlocked the "{achievementName}" achievement! {description}',
    actionLabel: 'View Achievements',
    priority: 'low',
    category: 'achievements'
  }
};

// Utility functions
export const formatTimeRemaining = (deadline: Date): string => {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  
  if (diff <= 0) return 'overdue';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
};

export const interpolateTemplate = (
  template: string,
  variables: Record<string, string>
): string => {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return variables[key] || match;
  });
};

export const createNotification = (
  type: NotificationType,
  userId: string,
  variables: Record<string, string> = {},
  overrides: Partial<Notification> = {}
): Notification => {
  const template = NOTIFICATION_TEMPLATES[type];
  const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id,
    type,
    title: interpolateTemplate(template.title, variables),
    message: interpolateTemplate(template.message, variables),
    priority: template.priority,
    category: template.category,
    timestamp: new Date(),
    read: false,
    actionLabel: template.actionLabel,
    userId,
    ...overrides
  };
};

export const getPriorityIcon = (priority: Notification['priority']): string => {
  switch (priority) {
    case 'urgent': return '🚨';
    case 'high': return '🔴';
    case 'medium': return '🟡';
    case 'low': return '🟢';
  }
};

export const getCategoryIcon = (category: NotificationCategory): string => {
  switch (category) {
    case 'reviews': return '📝';
    case 'feedback': return '💬';
    case 'goals': return '🎯';
    case 'achievements': return '🏆';
    case 'team': return '👥';
    case 'system': return '⚙️';
    case 'reminders': return '⏰';
  }
};

export const shouldShowNotification = (
  notification: Notification,
  preferences: NotificationPreferences
): boolean => {
  if (!preferences.inApp.enabled) return false;
  
  const categoryEnabled = preferences.inApp.categories.includes(notification.category);
  const priorityEnabled = preferences.inApp.priority.includes(notification.priority);
  
  return categoryEnabled && priorityEnabled;
};

export const isInQuietHours = (preferences: NotificationPreferences): boolean => {
  if (!preferences.email.quietHours.enabled) return false;
  
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  const start = preferences.email.quietHours.start;
  const end = preferences.email.quietHours.end;
  
  if (start <= end) {
    return currentTime >= start && currentTime <= end;
  } else {
    // Quiet hours span midnight
    return currentTime >= start || currentTime <= end;
  }
};

export const groupNotificationsByDate = (notifications: Notification[]): Record<string, Notification[]> => {
  const groups: Record<string, Notification[]> = {};
  
  notifications.forEach(notification => {
    const date = notification.timestamp.toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
  });
  
  return groups;
};

export const getNotificationStats = (notifications: Notification[]) => {
  const total = notifications.length;
  const unread = notifications.filter(n => !n.read).length;
  const byPriority = notifications.reduce((acc, n) => {
    acc[n.priority] = (acc[n.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const byCategory = notifications.reduce((acc, n) => {
    acc[n.category] = (acc[n.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    total,
    unread,
    read: total - unread,
    byPriority,
    byCategory
  };
};

// Default notification preferences
export const DEFAULT_NOTIFICATION_PREFERENCES: Omit<NotificationPreferences, 'userId'> = {
  inApp: {
    enabled: true,
    categories: ['reviews', 'feedback', 'goals', 'achievements', 'team', 'system', 'reminders'],
    priority: ['medium', 'high', 'urgent']
  },
  email: {
    enabled: true,
    categories: ['reviews', 'feedback', 'goals'],
    frequency: 'daily',
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    }
  },
  push: {
    enabled: false,
    categories: ['reviews', 'feedback'],
    priority: ['high', 'urgent']
  }
};

// Notification scheduling utilities
export const scheduleNotification = (
  type: NotificationType,
  userId: string,
  scheduledFor: Date,
  variables: Record<string, string> = {}
): string => {
  const notificationId = `scheduled-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // In a real implementation, this would integrate with a job scheduler
  // For now, we'll simulate with setTimeout for demo purposes
  const delay = scheduledFor.getTime() - Date.now();
  
  if (delay > 0) {
    setTimeout(() => {
      const notification = createNotification(type, userId, variables);
      // Trigger notification display
      window.dispatchEvent(new CustomEvent('newNotification', { detail: notification }));
    }, delay);
  }
  
  return notificationId;
};

export const scheduleReviewReminders = (
  userId: string,
  reviewDeadline: Date,
  reviewType: string = 'self-review'
): string[] => {
  const reminderIds: string[] = [];
  const now = new Date();
  
  // Schedule reminders at different intervals before deadline
  const reminderIntervals = [
    { days: 7, label: '1 week' },
    { days: 3, label: '3 days' },
    { days: 1, label: '1 day' },
    { hours: 2, label: '2 hours' }
  ];
  
  reminderIntervals.forEach(interval => {
    const reminderTime = new Date(reviewDeadline);

    if ('days' in interval && interval.days) {
      reminderTime.setDate(reminderTime.getDate() - interval.days);
    } else if ('hours' in interval && interval.hours) {
      reminderTime.setHours(reminderTime.getHours() - interval.hours);
    }
    
    if (reminderTime > now) {
      const id = scheduleNotification(
        'review_deadline',
        userId,
        reminderTime,
        {
          reviewType,
          timeRemaining: interval.label
        }
      );
      reminderIds.push(id);
    }
  });
  
  return reminderIds;
};
