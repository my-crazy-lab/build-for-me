/**
 * HR Analytics Utilities for Reviewly Application
 * 
 * Utilities for HR and manager analytics including team performance,
 * aggregated metrics, talent insights, and management reporting.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

// Types for HR analytics
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  managerId?: string;
  hireDate: Date;
  lastReviewDate?: Date;
  nextReviewDue?: Date;
  performanceRating: number; // 1-5 scale
  skillsCount: number;
  completedReviews: number;
  pendingActions: number;
  riskLevel: 'low' | 'medium' | 'high';
  avatar?: string;
}

export interface TeamAnalytics {
  teamId: string;
  teamName: string;
  managerId: string;
  memberCount: number;
  averagePerformance: number;
  reviewCompletionRate: number;
  skillDevelopmentTrend: 'improving' | 'stable' | 'declining';
  topPerformers: TeamMember[];
  atRiskMembers: TeamMember[];
  upcomingReviews: TeamMember[];
  keyMetrics: {
    totalReviewsCompleted: number;
    averageSkillsPerMember: number;
    promotionReadiness: number;
    retentionRisk: number;
  };
}

export interface DepartmentInsights {
  departmentId: string;
  departmentName: string;
  totalEmployees: number;
  averagePerformance: number;
  skillGaps: SkillGap[];
  performanceDistribution: {
    excellent: number; // 4.5-5.0
    good: number;      // 3.5-4.4
    average: number;   // 2.5-3.4
    below: number;     // 1.5-2.4
    poor: number;      // 1.0-1.4
  };
  trends: {
    performanceTrend: 'improving' | 'stable' | 'declining';
    skillDevelopmentTrend: 'improving' | 'stable' | 'declining';
    engagementTrend: 'improving' | 'stable' | 'declining';
  };
}

export interface SkillGap {
  skillName: string;
  category: string;
  currentLevel: number;
  requiredLevel: number;
  affectedEmployees: number;
  priority: 'high' | 'medium' | 'low';
  recommendedActions: string[];
}

export interface TalentInsight {
  type: 'high_performer' | 'flight_risk' | 'promotion_ready' | 'skill_gap' | 'development_opportunity';
  employeeId: string;
  employeeName: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  recommendedActions: string[];
  dueDate?: Date;
  impact: 'high' | 'medium' | 'low';
}

export interface HRMetrics {
  totalEmployees: number;
  activeReviews: number;
  completedReviews: number;
  overdue: number;
  averageCompletionTime: number; // in days
  satisfactionScore: number;
  retentionRate: number;
  promotionRate: number;
  skillDevelopmentHours: number;
  benchmarkComparison: {
    industry: string;
    performanceVsIndustry: number; // percentage difference
    retentionVsIndustry: number;
    developmentVsIndustry: number;
  };
}

export interface PerformanceAlert {
  id: string;
  type: 'overdue_review' | 'low_performance' | 'skill_gap' | 'retention_risk' | 'promotion_opportunity';
  employeeId: string;
  employeeName: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  createdAt: Date;
  actionRequired: boolean;
  suggestedActions: string[];
}

// Utility functions
export const calculateTeamPerformance = (members: TeamMember[]): number => {
  if (members.length === 0) return 0;
  const total = members.reduce((sum, member) => sum + member.performanceRating, 0);
  return Math.round((total / members.length) * 10) / 10;
};

export const calculateReviewCompletionRate = (members: TeamMember[]): number => {
  if (members.length === 0) return 0;
  const completed = members.filter(member => member.lastReviewDate).length;
  return Math.round((completed / members.length) * 100);
};

export const identifyTopPerformers = (members: TeamMember[], count: number = 3): TeamMember[] => {
  return members
    .filter(member => member.performanceRating >= 4.0)
    .sort((a, b) => b.performanceRating - a.performanceRating)
    .slice(0, count);
};

export const identifyAtRiskMembers = (members: TeamMember[]): TeamMember[] => {
  return members.filter(member => 
    member.riskLevel === 'high' || 
    member.performanceRating < 2.5 ||
    member.pendingActions > 3
  );
};

export const getUpcomingReviews = (members: TeamMember[], daysAhead: number = 30): TeamMember[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + daysAhead);
  
  return members.filter(member => 
    member.nextReviewDue && member.nextReviewDue <= cutoffDate
  ).sort((a, b) => 
    (a.nextReviewDue?.getTime() || 0) - (b.nextReviewDue?.getTime() || 0)
  );
};

export const calculateSkillDevelopmentTrend = (
  currentPeriod: number,
  previousPeriod: number
): 'improving' | 'stable' | 'declining' => {
  const change = ((currentPeriod - previousPeriod) / previousPeriod) * 100;
  
  if (change > 5) return 'improving';
  if (change < -5) return 'declining';
  return 'stable';
};

export const generateTalentInsights = (members: TeamMember[]): TalentInsight[] => {
  const insights: TalentInsight[] = [];
  
  // High performers
  const highPerformers = members.filter(m => m.performanceRating >= 4.5);
  highPerformers.forEach(member => {
    insights.push({
      type: 'high_performer',
      employeeId: member.id,
      employeeName: member.name,
      description: `${member.name} consistently delivers exceptional performance (${member.performanceRating}/5)`,
      priority: 'medium',
      recommendedActions: [
        'Consider for leadership opportunities',
        'Assign mentoring responsibilities',
        'Discuss career advancement'
      ],
      impact: 'high'
    });
  });
  
  // Flight risk
  const flightRisk = members.filter(m => m.riskLevel === 'high');
  flightRisk.forEach(member => {
    insights.push({
      type: 'flight_risk',
      employeeId: member.id,
      employeeName: member.name,
      description: `${member.name} shows signs of disengagement and may be at risk of leaving`,
      priority: 'high',
      recommendedActions: [
        'Schedule one-on-one meeting',
        'Review compensation and benefits',
        'Discuss career development opportunities'
      ],
      impact: 'high',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week
    });
  });
  
  // Promotion ready
  const promotionReady = members.filter(m => 
    m.performanceRating >= 4.0 && m.skillsCount >= 8
  );
  promotionReady.forEach(member => {
    insights.push({
      type: 'promotion_ready',
      employeeId: member.id,
      employeeName: member.name,
      description: `${member.name} demonstrates readiness for advancement`,
      priority: 'medium',
      recommendedActions: [
        'Review promotion criteria',
        'Discuss career path options',
        'Prepare development plan'
      ],
      impact: 'medium'
    });
  });
  
  return insights.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

export const generatePerformanceAlerts = (members: TeamMember[]): PerformanceAlert[] => {
  const alerts: PerformanceAlert[] = [];
  const now = new Date();
  
  members.forEach(member => {
    // Overdue reviews
    if (member.nextReviewDue && member.nextReviewDue < now) {
      const daysOverdue = Math.floor((now.getTime() - member.nextReviewDue.getTime()) / (1000 * 60 * 60 * 24));
      alerts.push({
        id: `overdue-${member.id}`,
        type: 'overdue_review',
        employeeId: member.id,
        employeeName: member.name,
        severity: daysOverdue > 14 ? 'critical' : 'warning',
        message: `Review is ${daysOverdue} days overdue`,
        createdAt: now,
        actionRequired: true,
        suggestedActions: ['Schedule review immediately', 'Send reminder to employee']
      });
    }
    
    // Low performance
    if (member.performanceRating < 2.5) {
      alerts.push({
        id: `performance-${member.id}`,
        type: 'low_performance',
        employeeId: member.id,
        employeeName: member.name,
        severity: member.performanceRating < 2.0 ? 'critical' : 'warning',
        message: `Performance rating below expectations (${member.performanceRating}/5)`,
        createdAt: now,
        actionRequired: true,
        suggestedActions: [
          'Create performance improvement plan',
          'Provide additional training',
          'Increase check-in frequency'
        ]
      });
    }
    
    // Retention risk
    if (member.riskLevel === 'high') {
      alerts.push({
        id: `retention-${member.id}`,
        type: 'retention_risk',
        employeeId: member.id,
        employeeName: member.name,
        severity: 'warning',
        message: 'High retention risk detected',
        createdAt: now,
        actionRequired: true,
        suggestedActions: [
          'Conduct stay interview',
          'Review compensation',
          'Discuss career development'
        ]
      });
    }
  });
  
  return alerts.sort((a, b) => {
    const severityOrder = { critical: 3, warning: 2, info: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });
};

export const calculateDepartmentInsights = (
  members: TeamMember[],
  departmentName: string
): DepartmentInsights => {
  const totalEmployees = members.length;
  const averagePerformance = calculateTeamPerformance(members);
  
  // Performance distribution
  const distribution = {
    excellent: members.filter(m => m.performanceRating >= 4.5).length,
    good: members.filter(m => m.performanceRating >= 3.5 && m.performanceRating < 4.5).length,
    average: members.filter(m => m.performanceRating >= 2.5 && m.performanceRating < 3.5).length,
    below: members.filter(m => m.performanceRating >= 1.5 && m.performanceRating < 2.5).length,
    poor: members.filter(m => m.performanceRating < 1.5).length,
  };
  
  // Mock skill gaps (in real implementation, this would come from actual skill assessments)
  const skillGaps: SkillGap[] = [
    {
      skillName: 'Leadership',
      category: 'Soft Skills',
      currentLevel: 2.5,
      requiredLevel: 4.0,
      affectedEmployees: Math.floor(totalEmployees * 0.6),
      priority: 'high',
      recommendedActions: ['Leadership training program', 'Mentoring assignments']
    },
    {
      skillName: 'Data Analysis',
      category: 'Technical',
      currentLevel: 3.0,
      requiredLevel: 4.0,
      affectedEmployees: Math.floor(totalEmployees * 0.4),
      priority: 'medium',
      recommendedActions: ['Data analytics course', 'Hands-on projects']
    }
  ];
  
  return {
    departmentId: departmentName.toLowerCase().replace(/\s+/g, '-'),
    departmentName,
    totalEmployees,
    averagePerformance,
    skillGaps,
    performanceDistribution: distribution,
    trends: {
      performanceTrend: 'improving', // Mock data
      skillDevelopmentTrend: 'stable',
      engagementTrend: 'improving'
    }
  };
};

export const formatTrendIcon = (trend: 'improving' | 'stable' | 'declining'): string => {
  switch (trend) {
    case 'improving': return '📈';
    case 'declining': return '📉';
    default: return '➡️';
  }
};

export const formatTrendColor = (trend: 'improving' | 'stable' | 'declining'): string => {
  switch (trend) {
    case 'improving': return 'var(--color-success)';
    case 'declining': return 'var(--color-danger)';
    default: return 'var(--color-text-secondary)';
  }
};

export const getPriorityColor = (priority: 'high' | 'medium' | 'low'): string => {
  switch (priority) {
    case 'high': return 'var(--color-danger)';
    case 'medium': return 'var(--color-warning)';
    case 'low': return 'var(--color-success)';
  }
};

export const getSeverityColor = (severity: 'critical' | 'warning' | 'info'): string => {
  switch (severity) {
    case 'critical': return 'var(--color-danger)';
    case 'warning': return 'var(--color-warning)';
    case 'info': return 'var(--color-info)';
  }
};
