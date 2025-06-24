/**
 * Salary Benchmark Utilities for Reviewly Application
 * 
 * Utilities for managing salary benchmarks, market data comparison,
 * compensation analysis, and pay equity assessment.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

// Types for salary benchmark system
export interface SalaryBenchmark {
  id: string;
  jobTitle: string;
  department: string;
  level: string;
  location: string;
  currency: string;
  marketData: MarketSalaryData;
  internalData: InternalSalaryData;
  lastUpdated: Date;
  dataSource: string;
  confidence: 'low' | 'medium' | 'high';
  sampleSize: number;
}

export interface MarketSalaryData {
  percentile10: number;
  percentile25: number;
  percentile50: number; // Median
  percentile75: number;
  percentile90: number;
  average: number;
  min: number;
  max: number;
}

export interface InternalSalaryData {
  currentEmployees: number;
  averageSalary: number;
  minSalary: number;
  maxSalary: number;
  medianSalary: number;
  salaryRange: {
    min: number;
    max: number;
  };
}

export interface CompensationAnalysis {
  benchmarkId: string;
  jobTitle: string;
  competitiveness: 'below_market' | 'at_market' | 'above_market';
  marketPosition: number; // Percentile position
  payGap: number; // Difference from market median
  payGapPercentage: number;
  recommendations: CompensationRecommendation[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface CompensationRecommendation {
  type: 'increase' | 'maintain' | 'review' | 'market_adjustment';
  priority: 'high' | 'medium' | 'low';
  description: string;
  suggestedAction: string;
  estimatedCost?: number;
  timeline: string;
}

export interface BenchmarkFilter {
  department?: string;
  level?: string;
  location?: string;
  jobTitle?: string;
  competitiveness?: string;
  lastUpdated?: {
    from: Date;
    to: Date;
  };
}

export interface PayEquityAnalysis {
  overallEquityScore: number; // 0-100
  genderPayGap: number;
  departmentAnalysis: DepartmentEquityAnalysis[];
  levelAnalysis: LevelEquityAnalysis[];
  recommendations: string[];
  riskAreas: string[];
}

export interface DepartmentEquityAnalysis {
  department: string;
  equityScore: number;
  averageSalary: number;
  payGap: number;
  employeeCount: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface LevelEquityAnalysis {
  level: string;
  equityScore: number;
  averageSalary: number;
  payRange: {
    min: number;
    max: number;
  };
  employeeCount: number;
}

// Utility functions
export const calculateMarketPosition = (
  currentSalary: number,
  marketData: MarketSalaryData
): number => {
  if (currentSalary <= marketData.percentile10) return 10;
  if (currentSalary <= marketData.percentile25) return 25;
  if (currentSalary <= marketData.percentile50) return 50;
  if (currentSalary <= marketData.percentile75) return 75;
  if (currentSalary <= marketData.percentile90) return 90;
  return 95;
};

export const calculateCompetitiveness = (
  currentSalary: number,
  marketData: MarketSalaryData
): CompensationAnalysis['competitiveness'] => {
  const marketPosition = calculateMarketPosition(currentSalary, marketData);
  
  if (marketPosition < 40) return 'below_market';
  if (marketPosition > 60) return 'above_market';
  return 'at_market';
};

export const calculatePayGap = (
  currentSalary: number,
  marketMedian: number
): { gap: number; percentage: number } => {
  const gap = currentSalary - marketMedian;
  const percentage = (gap / marketMedian) * 100;
  
  return { gap, percentage };
};

export const generateCompensationRecommendations = (
  analysis: Omit<CompensationAnalysis, 'recommendations'>
): CompensationRecommendation[] => {
  const recommendations: CompensationRecommendation[] = [];
  
  switch (analysis.competitiveness) {
    case 'below_market':
      recommendations.push({
        type: 'increase',
        priority: 'high',
        description: 'Current salary is below market rate',
        suggestedAction: `Consider salary adjustment to reach market median (${Math.abs(analysis.payGap).toLocaleString()} increase)`,
        estimatedCost: Math.abs(analysis.payGap),
        timeline: 'Next review cycle'
      });
      break;
      
    case 'above_market':
      recommendations.push({
        type: 'maintain',
        priority: 'low',
        description: 'Current salary is above market rate',
        suggestedAction: 'Monitor market trends and maintain current compensation',
        timeline: 'Annual review'
      });
      break;
      
    case 'at_market':
      recommendations.push({
        type: 'maintain',
        priority: 'medium',
        description: 'Current salary is competitive with market',
        suggestedAction: 'Continue current compensation strategy',
        timeline: 'Regular monitoring'
      });
      break;
  }
  
  // Additional recommendations based on market position
  if (analysis.marketPosition < 25) {
    recommendations.push({
      type: 'review',
      priority: 'high',
      description: 'Salary is in bottom quartile',
      suggestedAction: 'Urgent review needed to prevent retention risk',
      timeline: 'Immediate'
    });
  }
  
  return recommendations;
};

export const analyzeBenchmark = (
  benchmark: SalaryBenchmark,
  currentSalary: number
): CompensationAnalysis => {
  const competitiveness = calculateCompetitiveness(currentSalary, benchmark.marketData);
  const marketPosition = calculateMarketPosition(currentSalary, benchmark.marketData);
  const { gap, percentage } = calculatePayGap(currentSalary, benchmark.marketData.percentile50);
  
  const baseAnalysis = {
    benchmarkId: benchmark.id,
    jobTitle: benchmark.jobTitle,
    competitiveness,
    marketPosition,
    payGap: gap,
    payGapPercentage: percentage,
    riskLevel: (marketPosition < 25 ? 'high' : marketPosition < 40 ? 'medium' : 'low') as 'low' | 'medium' | 'high'
  };
  
  return {
    ...baseAnalysis,
    recommendations: generateCompensationRecommendations(baseAnalysis)
  };
};

export const calculatePayEquity = (
  benchmarks: SalaryBenchmark[],
  employeeData: any[]
): PayEquityAnalysis => {
  // Mock implementation - in real scenario, this would analyze actual employee data
  const departmentAnalysis: DepartmentEquityAnalysis[] = [
    {
      department: 'Engineering',
      equityScore: 85,
      averageSalary: 95000,
      payGap: 5000,
      employeeCount: 45,
      riskLevel: 'low'
    },
    {
      department: 'Sales',
      equityScore: 72,
      averageSalary: 78000,
      payGap: 12000,
      employeeCount: 32,
      riskLevel: 'medium'
    },
    {
      department: 'Marketing',
      equityScore: 90,
      averageSalary: 68000,
      payGap: 2000,
      employeeCount: 28,
      riskLevel: 'low'
    }
  ];
  
  const levelAnalysis: LevelEquityAnalysis[] = [
    {
      level: 'Junior',
      equityScore: 88,
      averageSalary: 55000,
      payRange: { min: 45000, max: 65000 },
      employeeCount: 35
    },
    {
      level: 'Mid-Level',
      equityScore: 82,
      averageSalary: 75000,
      payRange: { min: 65000, max: 85000 },
      employeeCount: 48
    },
    {
      level: 'Senior',
      equityScore: 79,
      averageSalary: 105000,
      payRange: { min: 90000, max: 120000 },
      employeeCount: 22
    }
  ];
  
  const overallEquityScore = Math.round(
    departmentAnalysis.reduce((sum, dept) => sum + dept.equityScore, 0) / departmentAnalysis.length
  );
  
  return {
    overallEquityScore,
    genderPayGap: 8.5, // Mock data
    departmentAnalysis,
    levelAnalysis,
    recommendations: [
      'Review compensation for Sales department',
      'Implement standardized salary bands',
      'Conduct annual pay equity audit',
      'Provide manager training on compensation decisions'
    ],
    riskAreas: [
      'Sales department pay gap',
      'Senior level compensation variance',
      'Gender pay disparity in leadership roles'
    ]
  };
};

export const filterBenchmarks = (
  benchmarks: SalaryBenchmark[],
  filters: BenchmarkFilter
): SalaryBenchmark[] => {
  return benchmarks.filter(benchmark => {
    if (filters.department && benchmark.department !== filters.department) return false;
    if (filters.level && benchmark.level !== filters.level) return false;
    if (filters.location && benchmark.location !== filters.location) return false;
    if (filters.jobTitle && !benchmark.jobTitle.toLowerCase().includes(filters.jobTitle.toLowerCase())) return false;
    
    if (filters.competitiveness) {
      const analysis = analyzeBenchmark(benchmark, benchmark.internalData.averageSalary);
      if (analysis.competitiveness !== filters.competitiveness) return false;
    }
    
    if (filters.lastUpdated) {
      const updateDate = benchmark.lastUpdated;
      if (updateDate < filters.lastUpdated.from || updateDate > filters.lastUpdated.to) return false;
    }
    
    return true;
  });
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

export const getCompetitivenessColor = (competitiveness: CompensationAnalysis['competitiveness']): string => {
  switch (competitiveness) {
    case 'below_market': return 'var(--color-danger)';
    case 'above_market': return 'var(--color-success)';
    case 'at_market': return 'var(--color-info)';
  }
};

export const getRiskLevelColor = (riskLevel: 'low' | 'medium' | 'high'): string => {
  switch (riskLevel) {
    case 'high': return 'var(--color-danger)';
    case 'medium': return 'var(--color-warning)';
    case 'low': return 'var(--color-success)';
  }
};

export const getConfidenceColor = (confidence: 'low' | 'medium' | 'high'): string => {
  switch (confidence) {
    case 'high': return 'var(--color-success)';
    case 'medium': return 'var(--color-warning)';
    case 'low': return 'var(--color-danger)';
  }
};

// Mock data for demonstration
export const MOCK_SALARY_BENCHMARKS: SalaryBenchmark[] = [
  {
    id: 'bench-001',
    jobTitle: 'Software Engineer',
    department: 'Engineering',
    level: 'Mid-Level',
    location: 'San Francisco, CA',
    currency: 'USD',
    marketData: {
      percentile10: 85000,
      percentile25: 95000,
      percentile50: 110000,
      percentile75: 125000,
      percentile90: 140000,
      average: 112000,
      min: 75000,
      max: 160000
    },
    internalData: {
      currentEmployees: 12,
      averageSalary: 105000,
      minSalary: 95000,
      maxSalary: 115000,
      medianSalary: 105000,
      salaryRange: {
        min: 90000,
        max: 120000
      }
    },
    lastUpdated: new Date('2024-12-01'),
    dataSource: 'Glassdoor, PayScale, Internal Survey',
    confidence: 'high',
    sampleSize: 1250
  },
  {
    id: 'bench-002',
    jobTitle: 'Product Manager',
    department: 'Product',
    level: 'Senior',
    location: 'New York, NY',
    currency: 'USD',
    marketData: {
      percentile10: 120000,
      percentile25: 135000,
      percentile50: 155000,
      percentile75: 175000,
      percentile90: 195000,
      average: 158000,
      min: 110000,
      max: 220000
    },
    internalData: {
      currentEmployees: 8,
      averageSalary: 148000,
      minSalary: 135000,
      maxSalary: 165000,
      medianSalary: 150000,
      salaryRange: {
        min: 130000,
        max: 170000
      }
    },
    lastUpdated: new Date('2024-11-15'),
    dataSource: 'Radford, Compensia, Market Research',
    confidence: 'high',
    sampleSize: 890
  },
  {
    id: 'bench-003',
    jobTitle: 'Marketing Specialist',
    department: 'Marketing',
    level: 'Junior',
    location: 'Austin, TX',
    currency: 'USD',
    marketData: {
      percentile10: 45000,
      percentile25: 52000,
      percentile50: 60000,
      percentile75: 68000,
      percentile90: 75000,
      average: 61000,
      min: 40000,
      max: 85000
    },
    internalData: {
      currentEmployees: 6,
      averageSalary: 58000,
      minSalary: 52000,
      maxSalary: 65000,
      medianSalary: 58000,
      salaryRange: {
        min: 50000,
        max: 70000
      }
    },
    lastUpdated: new Date('2024-10-30'),
    dataSource: 'Indeed, LinkedIn Salary Insights',
    confidence: 'medium',
    sampleSize: 420
  }
];
