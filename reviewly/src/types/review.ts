/**
 * Review Types for Reviewly Application
 * 
 * Type definitions for self-reviews, review sections,
 * and review management.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

export interface SelfReview {
  id: string;
  userId: string;
  period: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'approved';
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  sections: ReviewSections;
  overallRating?: number;
  managerFeedback?: string;
}

export interface ReviewSections {
  tasks: ReviewSection;
  achievements: ReviewSection;
  skills: ReviewSection;
  feedback: ReviewSection;
  goals: ReviewSection;
  reflection: ReviewSection;
}

export interface ReviewSection {
  completed: boolean;
  content: string;
}

export interface ReviewTemplate {
  id: string;
  name: string;
  description: string;
  sections: TemplateSectionConfig[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateSectionConfig {
  id: string;
  title: string;
  description: string;
  type: 'text' | 'rating' | 'list' | 'goals';
  required: boolean;
  placeholder?: string;
  maxLength?: number;
  options?: string[];
}
