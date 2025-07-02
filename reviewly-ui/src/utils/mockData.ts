/**
 * Mock Data Generators for Reviewly Application
 * 
 * Comprehensive mock data generation for testing and development
 * including users, reviews, feedback, analytics, and all features.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import type { User } from '../types/auth';
import type { SelfReview } from '../types/review';
import type { Feedback } from '../types/feedback';
import type { UserProgress } from '../utils/gamification';
import type { TeamMember } from '../utils/hrAnalytics';
import type { SalaryBenchmark } from '../utils/salaryBenchmark';

// Mock data generators
export class MockDataGenerator {
  private static instance: MockDataGenerator;
  private userCounter = 1;
  private reviewCounter = 1;
  private feedbackCounter = 1;

  static getInstance(): MockDataGenerator {
    if (!MockDataGenerator.instance) {
      MockDataGenerator.instance = new MockDataGenerator();
    }
    return MockDataGenerator.instance;
  }

  // User data generation
  generateUser(overrides: Partial<User> = {}): User {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Maria'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const departments = ['Engineering', 'Product', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design'];
    const roles = ['Software Engineer', 'Product Manager', 'Marketing Specialist', 'Sales Representative', 'HR Manager', 'Financial Analyst', 'Operations Manager', 'UX Designer'];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];

    return {
      id: `user-${this.userCounter++}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      name: `${firstName} ${lastName}`,
      avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
      role: role,
      department: department,
      isActive: Math.random() > 0.1, // 90% active
      lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Last year
      preferences: {
        theme: Math.random() > 0.5 ? 'light' : 'dark',
        language: Math.random() > 0.8 ? 'es' : 'en',
        notifications: {
          email: Math.random() > 0.3,
          push: Math.random() > 0.2,
          inApp: true
        }
      },
      ...overrides
    };
  }

  generateUsers(count: number): User[] {
    return Array.from({ length: count }, () => this.generateUser());
  }

  // Review data generation
  generateSelfReview(userId: string, overrides: Partial<SelfReview> = {}): SelfReview {
    const statuses: SelfReview['status'][] = ['draft', 'submitted', 'reviewed', 'approved'];
    const periods = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'];
    
    const tasks = [
      'Developed new user authentication system',
      'Led cross-functional team for product launch',
      'Implemented automated testing framework',
      'Conducted market research and analysis',
      'Optimized database performance',
      'Created comprehensive documentation',
      'Mentored junior team members',
      'Delivered client presentations'
    ];

    const achievements = [
      'Reduced system downtime by 40%',
      'Increased user engagement by 25%',
      'Completed project 2 weeks ahead of schedule',
      'Received positive client feedback',
      'Improved code coverage to 95%',
      'Successfully onboarded 5 new team members',
      'Implemented cost-saving measures',
      'Won internal innovation award'
    ];

    const skills = [
      'JavaScript/TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS',
      'Project Management', 'Leadership', 'Communication', 'Problem Solving',
      'Data Analysis', 'UI/UX Design', 'Agile Methodologies', 'DevOps'
    ];

    return {
      id: `review-${this.reviewCounter++}`,
      userId,
      period: periods[Math.floor(Math.random() * periods.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Last 90 days
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
      submittedAt: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,
      sections: {
        tasks: {
          completed: true,
          content: tasks.slice(0, Math.floor(Math.random() * 4) + 2).join('\n\n')
        },
        achievements: {
          completed: true,
          content: achievements.slice(0, Math.floor(Math.random() * 3) + 1).join('\n\n')
        },
        skills: {
          completed: true,
          content: skills.slice(0, Math.floor(Math.random() * 5) + 3).join(', ')
        },
        feedback: {
          completed: Math.random() > 0.2,
          content: 'Received positive feedback from team members and stakeholders. Areas for improvement include time management and delegation skills.'
        },
        goals: {
          completed: Math.random() > 0.3,
          content: 'Focus on developing leadership skills, learn new technologies, and contribute to team mentoring programs.'
        },
        reflection: {
          completed: Math.random() > 0.4,
          content: 'This period has been challenging but rewarding. I have grown significantly in my technical and interpersonal skills.'
        }
      },
      overallRating: Math.floor(Math.random() * 2) + 3.5, // 3.5-5.0
      managerFeedback: Math.random() > 0.5 ? 'Excellent performance this quarter. Keep up the great work!' : undefined,
      ...overrides
    };
  }

  generateSelfReviews(userIds: string[], reviewsPerUser: number = 3): SelfReview[] {
    const reviews: SelfReview[] = [];
    userIds.forEach(userId => {
      for (let i = 0; i < reviewsPerUser; i++) {
        reviews.push(this.generateSelfReview(userId));
      }
    });
    return reviews;
  }

  // Feedback data generation
  generateFeedback(fromUserId: string, toUserId: string, overrides: Partial<Feedback> = {}): Feedback {
    const types: Feedback['type'][] = ['peer', 'manager', 'direct_report', 'cross_functional'];
    const categories = ['technical_skills', 'communication', 'leadership', 'collaboration', 'problem_solving'];
    
    const comments = [
      'Excellent technical skills and attention to detail.',
      'Great communicator and team player.',
      'Shows strong leadership potential.',
      'Very reliable and delivers quality work.',
      'Could improve on time management.',
      'Excellent problem-solving abilities.',
      'Great mentor to junior team members.',
      'Innovative thinking and creative solutions.'
    ];

    return {
      id: `feedback-${this.feedbackCounter++}`,
      fromUserId,
      toUserId,
      type: types[Math.floor(Math.random() * types.length)],
      isAnonymous: Math.random() > 0.6,
      period: 'Q4 2024',
      ratings: {
        technical_skills: Math.floor(Math.random() * 2) + 3.5,
        communication: Math.floor(Math.random() * 2) + 3.5,
        leadership: Math.floor(Math.random() * 2) + 3.5,
        collaboration: Math.floor(Math.random() * 2) + 3.5,
        problem_solving: Math.floor(Math.random() * 2) + 3.5
      },
      comments: {
        strengths: comments.slice(0, Math.floor(Math.random() * 3) + 1).join(' '),
        improvements: Math.random() > 0.7 ? 'Could focus more on documentation and knowledge sharing.' : '',
        overall: comments[Math.floor(Math.random() * comments.length)]
      },
      createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000), // Last 60 days
      status: Math.random() > 0.2 ? 'submitted' : 'draft',
      ...overrides
    };
  }

  generateFeedbacks(userIds: string[], feedbacksPerUser: number = 5): Feedback[] {
    const feedbacks: Feedback[] = [];
    userIds.forEach(toUserId => {
      const otherUsers = userIds.filter(id => id !== toUserId);
      for (let i = 0; i < Math.min(feedbacksPerUser, otherUsers.length); i++) {
        const fromUserId = otherUsers[Math.floor(Math.random() * otherUsers.length)];
        feedbacks.push(this.generateFeedback(fromUserId, toUserId));
      }
    });
    return feedbacks;
  }

  // Gamification data generation
  generateUserProgress(userId: string): UserProgress {
    const totalPoints = Math.floor(Math.random() * 5000) + 1000;
    const experiencePoints = Math.floor(Math.random() * 10000) + 2000;
    const level = Math.floor(Math.sqrt(experiencePoints / 100)) + 1;
    
    return {
      userId,
      totalPoints,
      level,
      experiencePoints,
      nextLevelXP: (level * level) * 100,
      badges: [], // Would be populated based on achievements
      achievements: [], // Would be populated based on progress
      currentGoals: [],
      completedGoals: [],
      streaks: {
        currentReviewStreak: Math.floor(Math.random() * 30) + 1,
        longestReviewStreak: Math.floor(Math.random() * 60) + 10,
        currentSkillStreak: Math.floor(Math.random() * 20) + 1,
        longestSkillStreak: Math.floor(Math.random() * 40) + 5
      },
      stats: {
        totalReviews: Math.floor(Math.random() * 20) + 5,
        totalSkillsLearned: Math.floor(Math.random() * 15) + 3,
        totalFeedbackGiven: Math.floor(Math.random() * 30) + 10,
        totalFeedbackReceived: Math.floor(Math.random() * 25) + 8,
        averageRating: Math.random() * 1.5 + 3.5,
        daysActive: Math.floor(Math.random() * 200) + 50
      }
    };
  }

  // HR Analytics data generation
  generateTeamMember(user: User): TeamMember {
    const riskLevels: TeamMember['riskLevel'][] = ['low', 'medium', 'high'];
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      managerId: Math.random() > 0.8 ? undefined : `manager-${Math.floor(Math.random() * 5) + 1}`,
      hireDate: new Date(Date.now() - Math.random() * 1000 * 24 * 60 * 60 * 1000), // Last 3 years
      lastReviewDate: Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) : undefined,
      nextReviewDue: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000), // Next 60 days
      performanceRating: Math.random() * 2 + 3, // 3.0-5.0
      skillsCount: Math.floor(Math.random() * 10) + 5,
      completedReviews: Math.floor(Math.random() * 8) + 2,
      pendingActions: Math.floor(Math.random() * 5),
      riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
      avatar: user.avatar
    };
  }

  // Salary benchmark data generation
  generateSalaryBenchmark(overrides: Partial<SalaryBenchmark> = {}): SalaryBenchmark {
    const jobTitles = [
      'Software Engineer', 'Senior Software Engineer', 'Staff Software Engineer',
      'Product Manager', 'Senior Product Manager', 'Director of Product',
      'Marketing Manager', 'Senior Marketing Manager', 'Marketing Director',
      'Sales Representative', 'Senior Sales Representative', 'Sales Manager',
      'Data Analyst', 'Senior Data Analyst', 'Data Scientist',
      'UX Designer', 'Senior UX Designer', 'Design Manager'
    ];
    
    const departments = ['Engineering', 'Product', 'Marketing', 'Sales', 'Data', 'Design'];
    const levels = ['Junior', 'Mid-Level', 'Senior', 'Staff', 'Principal'];
    const locations = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA'];
    
    const baseSalary = Math.floor(Math.random() * 100000) + 60000; // 60k-160k base
    
    return {
      id: `benchmark-${Math.random().toString(36).substr(2, 9)}`,
      jobTitle: jobTitles[Math.floor(Math.random() * jobTitles.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      level: levels[Math.floor(Math.random() * levels.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      currency: 'USD',
      marketData: {
        percentile10: baseSalary * 0.8,
        percentile25: baseSalary * 0.9,
        percentile50: baseSalary,
        percentile75: baseSalary * 1.15,
        percentile90: baseSalary * 1.3,
        average: baseSalary * 1.05,
        min: baseSalary * 0.7,
        max: baseSalary * 1.5
      },
      internalData: {
        currentEmployees: Math.floor(Math.random() * 20) + 5,
        averageSalary: baseSalary * (0.9 + Math.random() * 0.2), // ±10% of market
        minSalary: baseSalary * 0.85,
        maxSalary: baseSalary * 1.2,
        medianSalary: baseSalary * 0.95,
        salaryRange: {
          min: baseSalary * 0.8,
          max: baseSalary * 1.25
        }
      },
      lastUpdated: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000), // Last 6 months
      dataSource: 'Glassdoor, PayScale, Internal Survey',
      confidence: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      sampleSize: Math.floor(Math.random() * 1000) + 200,
      ...overrides
    };
  }

  // Complete dataset generation
  generateCompleteDataset(userCount: number = 50) {
    const users = this.generateUsers(userCount);
    const userIds = users.map(u => u.id);
    
    return {
      users,
      reviews: this.generateSelfReviews(userIds, 3),
      feedbacks: this.generateFeedbacks(userIds, 5),
      userProgress: users.map(u => this.generateUserProgress(u.id)),
      teamMembers: users.map(u => this.generateTeamMember(u)),
      salaryBenchmarks: Array.from({ length: 20 }, () => this.generateSalaryBenchmark())
    };
  }

  // Reset counters for consistent testing
  reset() {
    this.userCounter = 1;
    this.reviewCounter = 1;
    this.feedbackCounter = 1;
  }
}

// Export singleton instance
export const mockDataGenerator = MockDataGenerator.getInstance();

// Predefined test datasets
export const TEST_DATASETS = {
  small: () => mockDataGenerator.generateCompleteDataset(10),
  medium: () => mockDataGenerator.generateCompleteDataset(25),
  large: () => mockDataGenerator.generateCompleteDataset(100)
};

// Specific test users for consistent testing
export const TEST_USERS = {
  admin: mockDataGenerator.generateUser({
    id: 'test-admin',
    email: 'admin@test.com',
    name: 'Test Admin',
    role: 'Administrator',
    department: 'IT'
  }),
  manager: mockDataGenerator.generateUser({
    id: 'test-manager',
    email: 'manager@test.com',
    name: 'Test Manager',
    role: 'Engineering Manager',
    department: 'Engineering'
  }),
  employee: mockDataGenerator.generateUser({
    id: 'test-employee',
    email: 'employee@test.com',
    name: 'Test Employee',
    role: 'Software Engineer',
    department: 'Engineering'
  })
};

// Test data for specific scenarios
export const SCENARIO_DATA = {
  newEmployee: {
    user: mockDataGenerator.generateUser({
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      lastLogin: new Date()
    }),
    reviews: [],
    feedbacks: []
  },
  
  highPerformer: {
    user: mockDataGenerator.generateUser(),
    reviews: [
      mockDataGenerator.generateSelfReview('high-performer', {
        overallRating: 4.8,
        status: 'approved'
      })
    ],
    userProgress: mockDataGenerator.generateUserProgress('high-performer')
  },
  
  needsImprovement: {
    user: mockDataGenerator.generateUser(),
    reviews: [
      mockDataGenerator.generateSelfReview('needs-improvement', {
        overallRating: 2.5,
        status: 'reviewed'
      })
    ]
  }
};
