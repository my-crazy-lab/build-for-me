/**
 * Auto-Summary Engine for Reviewly Application
 * 
 * Intelligent categorization and summarization of user information
 * including tasks, achievements, skills, and feedback.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

// Types for auto-summary system
export interface SummaryItem {
  id: string;
  content: string;
  source: 'self-entered' | 'imported' | 'external';
  sourceDetails?: string;
  timestamp: Date;
  category?: string;
  subcategory?: string;
  importance: 'high' | 'medium' | 'low';
  keywords: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface CategorySummary {
  category: string;
  items: SummaryItem[];
  summary: string;
  keyPoints: string[];
  totalItems: number;
  importance: 'high' | 'medium' | 'low';
  trends: {
    growth: 'increasing' | 'stable' | 'decreasing';
    frequency: number;
    timespan: string;
  };
}

export interface AutoSummaryResult {
  categories: CategorySummary[];
  overallSummary: string;
  keyAchievements: string[];
  skillsHighlights: string[];
  areasForImprovement: string[];
  recommendations: string[];
  metadata: {
    totalItems: number;
    processedAt: Date;
    confidence: number;
  };
}

// Predefined categories and keywords
const CATEGORY_KEYWORDS = {
  'Technical Skills': [
    'programming', 'coding', 'development', 'software', 'algorithm', 'database',
    'api', 'framework', 'library', 'debugging', 'testing', 'deployment',
    'javascript', 'python', 'react', 'node', 'sql', 'git', 'docker'
  ],
  'Leadership': [
    'leadership', 'management', 'team', 'mentor', 'guide', 'lead', 'supervise',
    'delegate', 'motivate', 'inspire', 'coordinate', 'organize', 'facilitate'
  ],
  'Communication': [
    'communication', 'presentation', 'meeting', 'discussion', 'explain',
    'document', 'write', 'speak', 'collaborate', 'negotiate', 'feedback'
  ],
  'Problem Solving': [
    'problem', 'solution', 'solve', 'troubleshoot', 'debug', 'fix', 'resolve',
    'analyze', 'investigate', 'optimize', 'improve', 'enhance'
  ],
  'Project Management': [
    'project', 'planning', 'schedule', 'deadline', 'milestone', 'timeline',
    'budget', 'resource', 'scope', 'requirement', 'stakeholder', 'delivery'
  ],
  'Innovation': [
    'innovation', 'creative', 'new', 'idea', 'invention', 'design', 'prototype',
    'experiment', 'research', 'explore', 'discover', 'breakthrough'
  ],
  'Customer Focus': [
    'customer', 'client', 'user', 'service', 'support', 'satisfaction',
    'experience', 'feedback', 'requirement', 'need', 'expectation'
  ],
  'Quality Assurance': [
    'quality', 'testing', 'review', 'validation', 'verification', 'standard',
    'compliance', 'audit', 'process', 'procedure', 'best practice'
  ],
  'Learning & Development': [
    'learn', 'training', 'course', 'certification', 'skill', 'knowledge',
    'education', 'workshop', 'seminar', 'conference', 'study', 'research'
  ],
  'Collaboration': [
    'collaborate', 'teamwork', 'partnership', 'cooperation', 'support',
    'help', 'assist', 'share', 'contribute', 'participate', 'engage'
  ]
};

const ACHIEVEMENT_KEYWORDS = [
  'achieved', 'accomplished', 'completed', 'delivered', 'implemented',
  'launched', 'released', 'improved', 'increased', 'reduced', 'optimized',
  'exceeded', 'surpassed', 'won', 'earned', 'gained', 'success'
];

const SKILL_KEYWORDS = [
  'learned', 'developed', 'acquired', 'mastered', 'improved', 'enhanced',
  'strengthened', 'practiced', 'applied', 'utilized', 'demonstrated'
];

// Text processing utilities
export const extractKeywords = (text: string): string[] => {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
  
  const keywordCounts: { [key: string]: number } = {};
  
  words.forEach(word => {
    keywordCounts[word] = (keywordCounts[word] || 0) + 1;
  });
  
  return Object.entries(keywordCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
};

export const categorizeContent = (content: string): string => {
  const lowerContent = content.toLowerCase();
  let bestCategory = 'General';
  let maxScore = 0;
  
  Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
    const score = keywords.reduce((acc, keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = content.match(regex);
      return acc + (matches ? matches.length : 0);
    }, 0);
    
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category;
    }
  });
  
  return bestCategory;
};

export const assessImportance = (content: string, keywords: string[]): 'high' | 'medium' | 'low' => {
  const achievementScore = ACHIEVEMENT_KEYWORDS.reduce((acc, keyword) => {
    return acc + (content.toLowerCase().includes(keyword) ? 1 : 0);
  }, 0);
  
  const keywordScore = keywords.length;
  const lengthScore = content.length > 200 ? 2 : content.length > 100 ? 1 : 0;
  
  const totalScore = achievementScore * 3 + keywordScore + lengthScore;
  
  if (totalScore >= 8) return 'high';
  if (totalScore >= 4) return 'medium';
  return 'low';
};

export const analyzeSentiment = (content: string): 'positive' | 'neutral' | 'negative' => {
  const positiveWords = [
    'excellent', 'great', 'good', 'successful', 'achieved', 'improved',
    'effective', 'efficient', 'outstanding', 'exceptional', 'positive'
  ];
  
  const negativeWords = [
    'failed', 'poor', 'bad', 'difficult', 'challenging', 'problem',
    'issue', 'struggle', 'negative', 'disappointing', 'unsuccessful'
  ];
  
  const lowerContent = content.toLowerCase();
  
  const positiveScore = positiveWords.reduce((acc, word) => {
    return acc + (lowerContent.includes(word) ? 1 : 0);
  }, 0);
  
  const negativeScore = negativeWords.reduce((acc, word) => {
    return acc + (lowerContent.includes(word) ? 1 : 0);
  }, 0);
  
  if (positiveScore > negativeScore) return 'positive';
  if (negativeScore > positiveScore) return 'negative';
  return 'neutral';
};

// Main summarization functions
export const generateCategorySummary = (items: SummaryItem[]): string => {
  if (items.length === 0) return '';
  
  const keyPoints = items
    .filter(item => item.importance === 'high')
    .slice(0, 3)
    .map(item => item.content.substring(0, 100) + '...');
  
  const totalItems = items.length;
  const highImportanceCount = items.filter(item => item.importance === 'high').length;
  
  let summary = `This category contains ${totalItems} item${totalItems > 1 ? 's' : ''}`;
  
  if (highImportanceCount > 0) {
    summary += `, with ${highImportanceCount} high-importance item${highImportanceCount > 1 ? 's' : ''}`;
  }
  
  summary += '. ';
  
  if (keyPoints.length > 0) {
    summary += 'Key highlights include: ' + keyPoints.join('; ') + '.';
  }
  
  return summary;
};

export const extractKeyPoints = (items: SummaryItem[]): string[] => {
  return items
    .filter(item => item.importance === 'high')
    .slice(0, 5)
    .map(item => {
      const sentences = item.content.split(/[.!?]+/);
      return sentences[0]?.trim() || item.content.substring(0, 80) + '...';
    })
    .filter(point => point.length > 10);
};

export const analyzeGrowthTrends = (items: SummaryItem[]): CategorySummary['trends'] => {
  if (items.length === 0) {
    return { growth: 'stable', frequency: 0, timespan: '0 days' };
  }
  
  const sortedItems = items.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  const firstItem = sortedItems[0];
  const lastItem = sortedItems[sortedItems.length - 1];
  
  const timespan = Math.ceil((lastItem.timestamp.getTime() - firstItem.timestamp.getTime()) / (1000 * 60 * 60 * 24));
  const frequency = items.length / Math.max(timespan, 1);
  
  // Simple growth analysis based on recent vs older items
  const midpoint = Math.floor(items.length / 2);
  const recentItems = sortedItems.slice(midpoint);
  const olderItems = sortedItems.slice(0, midpoint);
  
  const recentHighImportance = recentItems.filter(item => item.importance === 'high').length;
  const olderHighImportance = olderItems.filter(item => item.importance === 'high').length;
  
  let growth: 'increasing' | 'stable' | 'decreasing' = 'stable';
  
  if (recentHighImportance > olderHighImportance * 1.2) {
    growth = 'increasing';
  } else if (recentHighImportance < olderHighImportance * 0.8) {
    growth = 'decreasing';
  }
  
  return {
    growth,
    frequency: Math.round(frequency * 10) / 10,
    timespan: `${timespan} days`
  };
};

// Main auto-summary function
export const generateAutoSummary = (items: SummaryItem[]): AutoSummaryResult => {
  // Process and categorize items
  const processedItems = items.map(item => ({
    ...item,
    category: item.category || categorizeContent(item.content),
    keywords: item.keywords.length > 0 ? item.keywords : extractKeywords(item.content),
    importance: item.importance || assessImportance(item.content, item.keywords),
    sentiment: item.sentiment || analyzeSentiment(item.content)
  }));
  
  // Group by category
  const categorizedItems: { [key: string]: SummaryItem[] } = {};
  processedItems.forEach(item => {
    const category = item.category || 'General';
    if (!categorizedItems[category]) {
      categorizedItems[category] = [];
    }
    categorizedItems[category].push(item);
  });
  
  // Generate category summaries
  const categories: CategorySummary[] = Object.entries(categorizedItems).map(([category, categoryItems]) => {
    const highImportanceCount = categoryItems.filter(item => item.importance === 'high').length;
    const categoryImportance: 'high' | 'medium' | 'low' = 
      highImportanceCount >= 3 ? 'high' :
      highImportanceCount >= 1 ? 'medium' : 'low';
    
    return {
      category,
      items: categoryItems,
      summary: generateCategorySummary(categoryItems),
      keyPoints: extractKeyPoints(categoryItems),
      totalItems: categoryItems.length,
      importance: categoryImportance,
      trends: analyzeGrowthTrends(categoryItems)
    };
  }).sort((a, b) => {
    const importanceOrder = { high: 3, medium: 2, low: 1 };
    return importanceOrder[b.importance] - importanceOrder[a.importance];
  });
  
  // Generate overall insights
  const allHighImportanceItems = processedItems.filter(item => item.importance === 'high');
  const keyAchievements = allHighImportanceItems
    .filter(item => ACHIEVEMENT_KEYWORDS.some(keyword => item.content.toLowerCase().includes(keyword)))
    .slice(0, 5)
    .map(item => item.content.split('.')[0] + '.');
  
  const skillsHighlights = allHighImportanceItems
    .filter(item => SKILL_KEYWORDS.some(keyword => item.content.toLowerCase().includes(keyword)))
    .slice(0, 3)
    .map(item => item.content.split('.')[0] + '.');
  
  const areasForImprovement = processedItems
    .filter(item => item.sentiment === 'negative' || item.content.toLowerCase().includes('improve'))
    .slice(0, 3)
    .map(item => item.content.split('.')[0] + '.');
  
  const recommendations = [
    'Continue building on your strongest skill areas',
    'Consider documenting your achievements for future reference',
    'Look for opportunities to apply your skills in new contexts'
  ];
  
  const overallSummary = `Based on ${processedItems.length} items analyzed, you have demonstrated strong performance across ${categories.length} key areas. Your highest activity is in ${categories[0]?.category || 'various areas'} with ${categories[0]?.totalItems || 0} items. ${keyAchievements.length > 0 ? `Notable achievements include significant progress in ${keyAchievements.length} key areas.` : ''}`;
  
  return {
    categories,
    overallSummary,
    keyAchievements,
    skillsHighlights,
    areasForImprovement,
    recommendations,
    metadata: {
      totalItems: processedItems.length,
      processedAt: new Date(),
      confidence: Math.min(0.95, 0.5 + (processedItems.length * 0.05))
    }
  };
};
