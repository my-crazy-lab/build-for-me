/**
 * Peer Review System Utilities for Reviewly Application
 * 
 * Utilities for managing anonymous peer reviews, feedback distribution,
 * anonymity protection, and review aggregation.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

// Types for peer review system
export interface PeerReviewRequest {
  id: string;
  revieweeId: string;
  revieweeName: string;
  revieweeRole: string;
  revieweeDepartment: string;
  requestedBy: string; // HR or manager ID
  requestedAt: Date;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'expired';
  reviewType: 'quarterly' | 'annual' | 'project_based' | 'ad_hoc';
  anonymityLevel: 'fully_anonymous' | 'role_visible' | 'department_visible';
  selectedReviewers: string[]; // User IDs
  completedReviews: string[]; // Review IDs
  instructions?: string;
  customQuestions?: PeerReviewQuestion[];
}

export interface PeerReviewQuestion {
  id: string;
  type: 'rating' | 'text' | 'multiple_choice' | 'ranking';
  category: 'technical' | 'communication' | 'leadership' | 'collaboration' | 'general';
  question: string;
  required: boolean;
  options?: string[]; // For multiple choice
  ratingScale?: {
    min: number;
    max: number;
    labels: string[];
  };
}

export interface PeerReview {
  id: string;
  requestId: string;
  reviewerId: string; // Encrypted/anonymized
  revieweeId: string;
  submittedAt: Date;
  responses: PeerReviewResponse[];
  overallRating: number;
  anonymityHash: string; // For tracking without revealing identity
  isAnonymous: boolean;
  reviewerMetadata?: {
    role?: string;
    department?: string;
    workRelationship?: 'direct_report' | 'peer' | 'manager' | 'cross_functional';
    collaborationFrequency?: 'daily' | 'weekly' | 'monthly' | 'rarely';
  };
}

export interface PeerReviewResponse {
  questionId: string;
  type: 'rating' | 'text' | 'multiple_choice' | 'ranking';
  value: string | number | string[];
  category: string;
}

export interface PeerReviewSummary {
  revieweeId: string;
  totalReviews: number;
  averageRating: number;
  categoryRatings: Record<string, {
    average: number;
    count: number;
    distribution: number[];
  }>;
  strengths: string[];
  improvementAreas: string[];
  commonThemes: string[];
  reviewerBreakdown: {
    byRole: Record<string, number>;
    byDepartment: Record<string, number>;
    byRelationship: Record<string, number>;
  };
  sentiment: 'positive' | 'neutral' | 'mixed' | 'negative';
  confidenceScore: number; // Based on number of reviews and consistency
}

// Default peer review questions
export const DEFAULT_PEER_REVIEW_QUESTIONS: PeerReviewQuestion[] = [
  {
    id: 'technical_competence',
    type: 'rating',
    category: 'technical',
    question: 'How would you rate this person\'s technical competence and expertise?',
    required: true,
    ratingScale: {
      min: 1,
      max: 5,
      labels: ['Poor', 'Below Average', 'Average', 'Good', 'Excellent']
    }
  },
  {
    id: 'communication_skills',
    type: 'rating',
    category: 'communication',
    question: 'How effectively does this person communicate with team members?',
    required: true,
    ratingScale: {
      min: 1,
      max: 5,
      labels: ['Poor', 'Below Average', 'Average', 'Good', 'Excellent']
    }
  },
  {
    id: 'collaboration',
    type: 'rating',
    category: 'collaboration',
    question: 'How well does this person collaborate and work with others?',
    required: true,
    ratingScale: {
      min: 1,
      max: 5,
      labels: ['Poor', 'Below Average', 'Average', 'Good', 'Excellent']
    }
  },
  {
    id: 'leadership_potential',
    type: 'rating',
    category: 'leadership',
    question: 'How would you rate this person\'s leadership skills and potential?',
    required: false,
    ratingScale: {
      min: 1,
      max: 5,
      labels: ['Poor', 'Below Average', 'Average', 'Good', 'Excellent']
    }
  },
  {
    id: 'strengths',
    type: 'text',
    category: 'general',
    question: 'What are this person\'s key strengths? Please provide specific examples.',
    required: true
  },
  {
    id: 'improvement_areas',
    type: 'text',
    category: 'general',
    question: 'What areas could this person improve? Please provide constructive feedback.',
    required: false
  },
  {
    id: 'work_relationship',
    type: 'multiple_choice',
    category: 'general',
    question: 'What best describes your working relationship with this person?',
    required: true,
    options: [
      'Direct report (they report to me)',
      'Peer/colleague (same level)',
      'Manager (I report to them)',
      'Cross-functional collaborator',
      'Occasional collaborator'
    ]
  },
  {
    id: 'collaboration_frequency',
    type: 'multiple_choice',
    category: 'general',
    question: 'How frequently do you work with this person?',
    required: true,
    options: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'This is our first collaboration']
  },
  {
    id: 'overall_feedback',
    type: 'text',
    category: 'general',
    question: 'Any additional feedback or comments you\'d like to share?',
    required: false
  }
];

// Utility functions
export const generateAnonymityHash = (reviewerId: string, requestId: string): string => {
  // Simple hash function for demo - in production, use proper cryptographic hash
  const combined = `${reviewerId}-${requestId}-${Date.now()}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
};

export const anonymizeReviewerInfo = (
  reviewerId: string,
  anonymityLevel: PeerReviewRequest['anonymityLevel'],
  reviewerData: any
): Partial<PeerReview['reviewerMetadata']> => {
  switch (anonymityLevel) {
    case 'fully_anonymous':
      return {
        workRelationship: reviewerData.workRelationship,
        collaborationFrequency: reviewerData.collaborationFrequency
      };
    case 'role_visible':
      return {
        role: reviewerData.role,
        workRelationship: reviewerData.workRelationship,
        collaborationFrequency: reviewerData.collaborationFrequency
      };
    case 'department_visible':
      return {
        role: reviewerData.role,
        department: reviewerData.department,
        workRelationship: reviewerData.workRelationship,
        collaborationFrequency: reviewerData.collaborationFrequency
      };
    default:
      return {};
  }
};

export const calculateOverallRating = (responses: PeerReviewResponse[]): number => {
  const ratingResponses = responses.filter(r => r.type === 'rating' && typeof r.value === 'number');
  if (ratingResponses.length === 0) return 0;
  
  const sum = ratingResponses.reduce((acc, r) => acc + (r.value as number), 0);
  return Math.round((sum / ratingResponses.length) * 10) / 10;
};

export const extractKeywords = (text: string): string[] => {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'
  ]);
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.has(word))
    .slice(0, 10);
};

export const identifyCommonThemes = (textResponses: string[]): string[] => {
  const allKeywords: string[] = [];
  textResponses.forEach(text => {
    allKeywords.push(...extractKeywords(text));
  });
  
  const keywordCounts: Record<string, number> = {};
  allKeywords.forEach(keyword => {
    keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
  });
  
  return Object.entries(keywordCounts)
    .filter(([, count]) => count >= 2) // Mentioned by at least 2 reviewers
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([keyword]) => keyword);
};

export const categorizeFeedback = (text: string): 'strength' | 'improvement' | 'neutral' => {
  const strengthKeywords = [
    'excellent', 'great', 'strong', 'good', 'effective', 'skilled', 'talented',
    'knowledgeable', 'reliable', 'helpful', 'collaborative', 'innovative'
  ];
  
  const improvementKeywords = [
    'improve', 'better', 'develop', 'enhance', 'work on', 'focus on', 'needs',
    'could', 'should', 'challenge', 'difficulty', 'struggle'
  ];
  
  const lowerText = text.toLowerCase();
  
  const strengthScore = strengthKeywords.reduce((score, keyword) => {
    return score + (lowerText.includes(keyword) ? 1 : 0);
  }, 0);
  
  const improvementScore = improvementKeywords.reduce((score, keyword) => {
    return score + (lowerText.includes(keyword) ? 1 : 0);
  }, 0);
  
  if (strengthScore > improvementScore) return 'strength';
  if (improvementScore > strengthScore) return 'improvement';
  return 'neutral';
};

export const generatePeerReviewSummary = (reviews: PeerReview[]): PeerReviewSummary => {
  if (reviews.length === 0) {
    throw new Error('Cannot generate summary with no reviews');
  }
  
  const revieweeId = reviews[0].revieweeId;
  const totalReviews = reviews.length;
  
  // Calculate average rating
  const averageRating = reviews.reduce((sum, review) => sum + review.overallRating, 0) / totalReviews;
  
  // Calculate category ratings
  const categoryRatings: Record<string, { average: number; count: number; distribution: number[] }> = {};
  
  reviews.forEach(review => {
    review.responses.forEach(response => {
      if (response.type === 'rating' && typeof response.value === 'number') {
        if (!categoryRatings[response.category]) {
          categoryRatings[response.category] = {
            average: 0,
            count: 0,
            distribution: [0, 0, 0, 0, 0] // For 1-5 rating scale
          };
        }
        
        const rating = response.value as number;
        categoryRatings[response.category].average += rating;
        categoryRatings[response.category].count += 1;
        categoryRatings[response.category].distribution[rating - 1] += 1;
      }
    });
  });
  
  // Finalize category averages
  Object.keys(categoryRatings).forEach(category => {
    categoryRatings[category].average = 
      categoryRatings[category].average / categoryRatings[category].count;
  });
  
  // Extract strengths and improvement areas
  const textResponses = reviews.flatMap(review => 
    review.responses
      .filter(r => r.type === 'text')
      .map(r => r.value as string)
      .filter(text => text.trim().length > 0)
  );
  
  const strengths: string[] = [];
  const improvementAreas: string[] = [];
  
  textResponses.forEach(text => {
    const category = categorizeFeedback(text);
    if (category === 'strength') {
      strengths.push(text);
    } else if (category === 'improvement') {
      improvementAreas.push(text);
    }
  });
  
  // Identify common themes
  const commonThemes = identifyCommonThemes(textResponses);
  
  // Calculate reviewer breakdown
  const reviewerBreakdown = {
    byRole: {} as Record<string, number>,
    byDepartment: {} as Record<string, number>,
    byRelationship: {} as Record<string, number>
  };
  
  reviews.forEach(review => {
    if (review.reviewerMetadata) {
      const { role, department, workRelationship } = review.reviewerMetadata;
      
      if (role) {
        reviewerBreakdown.byRole[role] = (reviewerBreakdown.byRole[role] || 0) + 1;
      }
      if (department) {
        reviewerBreakdown.byDepartment[department] = (reviewerBreakdown.byDepartment[department] || 0) + 1;
      }
      if (workRelationship) {
        reviewerBreakdown.byRelationship[workRelationship] = (reviewerBreakdown.byRelationship[workRelationship] || 0) + 1;
      }
    }
  });
  
  // Determine sentiment
  let sentiment: PeerReviewSummary['sentiment'] = 'neutral';
  if (averageRating >= 4) sentiment = 'positive';
  else if (averageRating <= 2.5) sentiment = 'negative';
  else if (strengths.length > improvementAreas.length) sentiment = 'positive';
  else if (improvementAreas.length > strengths.length) sentiment = 'mixed';
  
  // Calculate confidence score
  const confidenceScore = Math.min(1, (totalReviews / 5) * 0.8 + 0.2);
  
  return {
    revieweeId,
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    categoryRatings,
    strengths: strengths.slice(0, 5),
    improvementAreas: improvementAreas.slice(0, 3),
    commonThemes,
    reviewerBreakdown,
    sentiment,
    confidenceScore: Math.round(confidenceScore * 100) / 100
  };
};
