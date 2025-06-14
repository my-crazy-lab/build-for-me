export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: 'en' | 'vi';
  theme: 'light' | 'dark';
  currency: string;
  jarAllocations: JarAllocations;
}

export interface JarAllocations {
  necessities: number; // 55%
  education: number;   // 10%
  longterm: number;    // 10%
  play: number;        // 10%
  financial: number;   // 10%
  give: number;        // 5%
}

export interface Jar {
  id: keyof JarAllocations;
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  color: string;
  icon: string;
  defaultPercentage: number;
  currentBalance: number;
  allocated: number;
  spent: number;
}

export interface Income {
  id: string;
  amount: number;
  source: string;
  date: Date;
  description?: string;
  userId: string;
}

export interface Expense {
  id: string;
  amount: number;
  jarId: keyof JarAllocations;
  category: string;
  description: string;
  date: Date;
  userId: string;
}

export interface FinancialGoal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  jarId: keyof JarAllocations;
  targetDate: Date;
  userId: string;
  isCompleted: boolean;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: Date;
  jarId?: keyof JarAllocations;
  category?: string;
  userId: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  totalBalance: number;
  jarBalances: Record<keyof JarAllocations, number>;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
}

export interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  date: Date;
  isRead: boolean;
  userId: string;
}

export interface ReportData {
  period: 'week' | 'month' | 'quarter' | 'year';
  startDate: Date;
  endDate: Date;
  incomeData: Array<{ date: string; amount: number }>;
  expenseData: Array<{ date: string; amount: number; jarId: keyof JarAllocations }>;
  jarDistribution: Record<keyof JarAllocations, number>;
  trends: {
    incomeGrowth: number;
    expenseGrowth: number;
    savingsGrowth: number;
  };
}

export const DEFAULT_JAR_ALLOCATIONS: JarAllocations = {
  necessities: 55,
  education: 10,
  longterm: 10,
  play: 10,
  financial: 10,
  give: 5,
};

export const JAR_COLORS = {
  necessities: '#ef4444',
  education: '#3b82f6',
  longterm: '#10b981',
  play: '#f59e0b',
  financial: '#8b5cf6',
  give: '#ec4899',
} as const;
