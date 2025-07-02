/**
 * Career Matrix and Progress Tracking Utilities for Reviewly Application
 * 
 * Utilities for managing competency frameworks, skill progression tracking,
 * career path visualization, and development planning.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

// Types for career matrix system
export interface CompetencyLevel {
  level: number;
  name: string;
  description: string;
  indicators: string[];
  requirements?: string[];
}

export interface Competency {
  id: string;
  name: string;
  category: CompetencyCategory;
  description: string;
  levels: CompetencyLevel[];
  weight: number; // Importance weight for role
  isCore: boolean; // Core vs. optional competency
}

export type CompetencyCategory = 
  | 'technical'
  | 'leadership'
  | 'communication'
  | 'problem_solving'
  | 'collaboration'
  | 'innovation'
  | 'business_acumen'
  | 'project_management';

export interface SkillAssessment {
  competencyId: string;
  currentLevel: number;
  targetLevel: number;
  assessedAt: Date;
  assessedBy: 'self' | 'manager' | 'peer' | 'system';
  evidence: string[];
  confidence: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface CareerPath {
  id: string;
  name: string;
  description: string;
  levels: CareerLevel[];
  requiredCompetencies: string[]; // Competency IDs
  optionalCompetencies: string[];
}

export interface CareerLevel {
  level: number;
  title: string;
  description: string;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  competencyRequirements: Record<string, number>; // competencyId -> required level
  typicalExperience: string;
  responsibilities: string[];
}

export interface ProgressSnapshot {
  id: string;
  userId: string;
  careerPathId: string;
  currentLevel: number;
  assessments: SkillAssessment[];
  createdAt: Date;
  reviewPeriod: string;
  overallScore: number;
  readinessForPromotion: 'not_ready' | 'developing' | 'ready' | 'overqualified';
}

export interface DevelopmentPlan {
  id: string;
  userId: string;
  competencyId: string;
  currentLevel: number;
  targetLevel: number;
  targetDate: Date;
  actions: DevelopmentAction[];
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  progress: number; // 0-100
}

export interface DevelopmentAction {
  id: string;
  type: 'training' | 'project' | 'mentoring' | 'reading' | 'certification' | 'other';
  title: string;
  description: string;
  estimatedHours: number;
  dueDate?: Date;
  completed: boolean;
  completedAt?: Date;
  resources?: string[];
}

// Default competency frameworks
export const TECHNICAL_COMPETENCIES: Competency[] = [
  {
    id: 'programming',
    name: 'Programming & Development',
    category: 'technical',
    description: 'Ability to write, debug, and maintain code effectively',
    weight: 0.9,
    isCore: true,
    levels: [
      {
        level: 1,
        name: 'Beginner',
        description: 'Basic programming knowledge',
        indicators: [
          'Can write simple scripts and functions',
          'Understands basic programming concepts',
          'Requires guidance for complex tasks'
        ]
      },
      {
        level: 2,
        name: 'Developing',
        description: 'Growing programming skills',
        indicators: [
          'Can implement features with minimal guidance',
          'Understands code structure and patterns',
          'Can debug simple issues independently'
        ]
      },
      {
        level: 3,
        name: 'Proficient',
        description: 'Solid programming abilities',
        indicators: [
          'Can design and implement complex features',
          'Writes clean, maintainable code',
          'Can mentor junior developers'
        ]
      },
      {
        level: 4,
        name: 'Advanced',
        description: 'Expert-level programming skills',
        indicators: [
          'Designs system architecture',
          'Optimizes performance and scalability',
          'Leads technical decisions'
        ]
      },
      {
        level: 5,
        name: 'Expert',
        description: 'Industry-leading expertise',
        indicators: [
          'Innovates new solutions and approaches',
          'Influences technology strategy',
          'Recognized as technical authority'
        ]
      }
    ]
  },
  {
    id: 'system_design',
    name: 'System Design & Architecture',
    category: 'technical',
    description: 'Ability to design scalable and maintainable systems',
    weight: 0.8,
    isCore: true,
    levels: [
      {
        level: 1,
        name: 'Beginner',
        description: 'Basic understanding of system components',
        indicators: [
          'Understands basic system components',
          'Can follow existing architectural patterns',
          'Requires guidance for design decisions'
        ]
      },
      {
        level: 2,
        name: 'Developing',
        description: 'Growing system design skills',
        indicators: [
          'Can design simple systems',
          'Understands common design patterns',
          'Considers scalability in designs'
        ]
      },
      {
        level: 3,
        name: 'Proficient',
        description: 'Solid system design abilities',
        indicators: [
          'Designs complex, scalable systems',
          'Balances trade-offs effectively',
          'Documents architecture clearly'
        ]
      },
      {
        level: 4,
        name: 'Advanced',
        description: 'Expert system design skills',
        indicators: [
          'Designs enterprise-scale systems',
          'Optimizes for performance and cost',
          'Influences architectural standards'
        ]
      },
      {
        level: 5,
        name: 'Expert',
        description: 'Industry-leading architecture expertise',
        indicators: [
          'Defines technology strategy',
          'Innovates architectural approaches',
          'Recognized as architecture authority'
        ]
      }
    ]
  }
];

export const LEADERSHIP_COMPETENCIES: Competency[] = [
  {
    id: 'team_leadership',
    name: 'Team Leadership',
    category: 'leadership',
    description: 'Ability to lead and inspire teams effectively',
    weight: 0.9,
    isCore: false,
    levels: [
      {
        level: 1,
        name: 'Individual Contributor',
        description: 'Focuses on individual contributions',
        indicators: [
          'Completes assigned tasks effectively',
          'Collaborates well with team members',
          'Shows initiative in own work'
        ]
      },
      {
        level: 2,
        name: 'Emerging Leader',
        description: 'Beginning to show leadership qualities',
        indicators: [
          'Helps onboard new team members',
          'Takes ownership of small projects',
          'Provides guidance to peers when needed'
        ]
      },
      {
        level: 3,
        name: 'Team Lead',
        description: 'Leads small teams or projects',
        indicators: [
          'Manages team of 2-5 people',
          'Sets clear goals and expectations',
          'Provides regular feedback and coaching'
        ]
      },
      {
        level: 4,
        name: 'Manager',
        description: 'Manages larger teams and complex projects',
        indicators: [
          'Manages team of 5-15 people',
          'Develops team members careers',
          'Drives organizational initiatives'
        ]
      },
      {
        level: 5,
        name: 'Senior Leader',
        description: 'Strategic leadership across organization',
        indicators: [
          'Leads multiple teams or departments',
          'Shapes organizational culture',
          'Influences company strategy'
        ]
      }
    ]
  }
];

// Utility functions
export const calculateOverallScore = (assessments: SkillAssessment[], competencies: Competency[]): number => {
  if (assessments.length === 0) return 0;
  
  let totalWeightedScore = 0;
  let totalWeight = 0;
  
  assessments.forEach(assessment => {
    const competency = competencies.find(c => c.id === assessment.competencyId);
    if (competency) {
      const weight = competency.weight;
      const score = (assessment.currentLevel / competency.levels.length) * 100;
      totalWeightedScore += score * weight;
      totalWeight += weight;
    }
  });
  
  return totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;
};

export const assessPromotionReadiness = (
  assessments: SkillAssessment[],
  careerPath: CareerPath,
  currentLevel: number
): ProgressSnapshot['readinessForPromotion'] => {
  const nextLevel = careerPath.levels.find(l => l.level === currentLevel + 1);
  if (!nextLevel) return 'overqualified';
  
  const requirements = nextLevel.competencyRequirements;
  const metRequirements = Object.entries(requirements).filter(([competencyId, requiredLevel]) => {
    const assessment = assessments.find(a => a.competencyId === competencyId);
    return assessment && assessment.currentLevel >= requiredLevel;
  });
  
  const readinessPercentage = metRequirements.length / Object.keys(requirements).length;
  
  if (readinessPercentage >= 0.9) return 'ready';
  if (readinessPercentage >= 0.7) return 'developing';
  return 'not_ready';
};

export const identifySkillGaps = (
  assessments: SkillAssessment[],
  careerPath: CareerPath,
  targetLevel: number
): Array<{ competencyId: string; currentLevel: number; requiredLevel: number; gap: number }> => {
  const targetLevelData = careerPath.levels.find(l => l.level === targetLevel);
  if (!targetLevelData) return [];
  
  const gaps: Array<{ competencyId: string; currentLevel: number; requiredLevel: number; gap: number }> = [];
  
  Object.entries(targetLevelData.competencyRequirements).forEach(([competencyId, requiredLevel]) => {
    const assessment = assessments.find(a => a.competencyId === competencyId);
    const currentLevel = assessment?.currentLevel || 0;
    
    if (currentLevel < requiredLevel) {
      gaps.push({
        competencyId,
        currentLevel,
        requiredLevel,
        gap: requiredLevel - currentLevel
      });
    }
  });
  
  return gaps.sort((a, b) => b.gap - a.gap);
};

export const generateDevelopmentSuggestions = (
  competencyId: string,
  currentLevel: number,
  targetLevel: number
): DevelopmentAction[] => {
  const suggestions: DevelopmentAction[] = [];
  
  // Generic suggestions based on competency type and level gap
  const levelGap = targetLevel - currentLevel;
  
  if (levelGap >= 1) {
    suggestions.push({
      id: `training-${competencyId}`,
      type: 'training',
      title: 'Attend relevant training course',
      description: `Complete training to advance from level ${currentLevel} to ${targetLevel}`,
      estimatedHours: levelGap * 20,
      completed: false
    });
  }
  
  if (levelGap >= 2) {
    suggestions.push({
      id: `mentoring-${competencyId}`,
      type: 'mentoring',
      title: 'Find a mentor',
      description: 'Work with an experienced mentor to accelerate skill development',
      estimatedHours: levelGap * 10,
      completed: false
    });
  }
  
  suggestions.push({
    id: `project-${competencyId}`,
    type: 'project',
    title: 'Take on stretch assignment',
    description: 'Volunteer for projects that require higher skill levels',
    estimatedHours: levelGap * 40,
    completed: false
  });
  
  return suggestions;
};

export const calculateProgressPercentage = (
  currentLevel: number,
  targetLevel: number,
  maxLevel: number
): number => {
  if (targetLevel <= currentLevel) return 100;
  
  const progress = (currentLevel / targetLevel) * 100;
  return Math.min(100, Math.max(0, progress));
};

export const getCompetencyColor = (category: CompetencyCategory): string => {
  const colors: Record<CompetencyCategory, string> = {
    technical: '#3B82F6',
    leadership: '#8B5CF6',
    communication: '#10B981',
    problem_solving: '#F59E0B',
    collaboration: '#EF4444',
    innovation: '#EC4899',
    business_acumen: '#6366F1',
    project_management: '#84CC16'
  };
  
  return colors[category] || '#6B7280';
};

export const formatCompetencyLevel = (level: number, maxLevel: number): string => {
  const percentage = (level / maxLevel) * 100;
  
  if (percentage >= 90) return 'Expert';
  if (percentage >= 70) return 'Advanced';
  if (percentage >= 50) return 'Proficient';
  if (percentage >= 30) return 'Developing';
  return 'Beginner';
};
