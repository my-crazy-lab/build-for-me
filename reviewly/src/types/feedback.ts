/**
 * Feedback Types for Reviewly Application
 * 
 * Type definitions for peer feedback, feedback collection,
 * and feedback management.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

export interface Feedback {
  id: string;
  fromUserId: string;
  toUserId: string;
  type: 'peer' | 'manager' | 'direct_report' | 'cross_functional';
  isAnonymous: boolean;
  period: string;
  ratings: FeedbackRatings;
  comments: FeedbackComments;
  createdAt: Date;
  status: 'draft' | 'submitted' | 'reviewed';
}

export interface FeedbackRatings {
  technical_skills: number;
  communication: number;
  leadership: number;
  collaboration: number;
  problem_solving: number;
}

export interface FeedbackComments {
  strengths: string;
  improvements: string;
  overall: string;
}

export interface FeedbackRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  dueDate: Date;
  status: 'pending' | 'completed' | 'declined';
  createdAt: Date;
}

export interface FeedbackSummary {
  userId: string;
  period: string;
  totalReceived: number;
  averageRatings: FeedbackRatings;
  commonThemes: {
    strengths: string[];
    improvements: string[];
  };
  feedbackSources: {
    peers: number;
    managers: number;
    directReports: number;
    crossFunctional: number;
  };
}
