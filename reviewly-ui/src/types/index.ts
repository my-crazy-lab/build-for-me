/**
 * Types Index File for Reviewly Application
 * 
 * This file serves as the main entry point for all type definitions in the application.
 * It re-exports all interfaces and enums to provide a clean and organized way to
 * import types throughout the codebase.
 * 
 * Usage:
 * import type { User, Review, UserRole, ReviewStatus } from 'types';
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

// Re-export all interfaces
export type {
  // Base interfaces
  BaseEntity,
  
  // User related interfaces
  User,
  UserCompany,
  UserPreferences,
  NotificationSettings,
  
  // Company related interfaces
  Company,
  Department,
  CompanySettings,
  
  // Review related interfaces
  Review,
  SelfReview,
  ReviewSection,
  ReviewQuestion,
  ReviewResponse,
  ImportedData,
  PeerReview,
  ManagerReview,
  ReviewSummary,
  
  // Skill related interfaces
  Skill,
  SkillCategory,
  SkillAssessment,
  
  // Goal related interfaces
  Goal,
  Milestone,
  
  // Feedback related interfaces
  Feedback,
  SentimentScore,
  
  // Integration related interfaces
  Integration,
  IntegrationSettings,
  GitHubSettings,
  JiraSettings,
  NotionSettings,
  
  // Gamification related interfaces
  Badge,
  BadgeCriteria,
  UserBadge,
  
  // Analytics and reporting interfaces
  AnalyticsData,
  PerformanceMetrics,
  TrendData,
  ComparisonData,
  
  // Salary and compensation interfaces
  SalaryBenchmark,
  CompensationRecommendation,
  
  // Utility interfaces
  Attachment,
  ReviewPeriod,
  PerformanceRating,
  
  // API Response interfaces
  ApiResponse,
  PaginatedResponse
} from './interfaces';

// Re-export all enums
export {
  // User related enums
  UserRole,
  ThemeMode,

  // Company related enums
  CompanySize,
  ReviewCycle,

  // Review related enums
  ReviewStatus,
  QuestionType,

  // Skill related enums
  SkillLevel,

  // Goal related enums
  GoalCategory,
  GoalStatus,
  Priority,

  // Feedback related enums
  FeedbackType,

  // Integration related enums
  IntegrationType,
  IntegrationSource,
  ImportDataType,

  // Gamification related enums
  BadgeType,
  BadgeRarity,

  // Notification related enums
  NotificationType,
  NotificationPriority,

  // Analytics related enums
  MetricType,
  TrendDirection,
  ComparisonType,

  // Export related enums
  ExportFormat,
  ReportType,

  // Language and localization enums
  SupportedLanguage,

  // API related enums
  ApiStatus,

  // UI related enums
  ComponentSize,
  ComponentVariant,
  LoadingState,

  // Chart and visualization enums
  ChartType,
  TimeRange,

  // Permission and access control enums
  Permission,
  AccessLevel,

  // Validation related enums
  ValidationRule,

  // Error related enums
  ErrorType
} from './enums';

// Additional utility types
export type ID = string;
export type Timestamp = Date;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Form related types
export type FormField<T> = {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
};

export type FormState<T> = {
  [K in keyof T]: FormField<T[K]>;
};

// API related types
export type RequestConfig = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
};

export type ApiError = {
  type: string;
  message: string;
  code?: string;
  details?: any;
};

// Component prop types
export type ComponentProps<T = {}> = T & {
  className?: string;
  children?: React.ReactNode;
};

export type ButtonProps = ComponentProps<{
  variant?: string;
  size?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}>;

export type InputProps = ComponentProps<{
  type?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  onChange?: (value: string) => void;
}>;

// Chart data types
export type ChartDataPoint = {
  x: string | number | Date;
  y: number;
  label?: string;
  color?: string;
};

export type ChartSeries = {
  name: string;
  data: ChartDataPoint[];
  color?: string;
};

export type ChartConfig = {
  type: string;
  series: ChartSeries[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  responsive?: boolean;
};

// Filter and search types
export type FilterOption = {
  label: string;
  value: string | number;
  count?: number;
};

export type SortOption = {
  field: string;
  direction: 'asc' | 'desc';
};

export type SearchFilters = {
  query?: string;
  filters?: Record<string, any>;
  sort?: SortOption;
  page?: number;
  limit?: number;
};

// Navigation and routing types
export type RouteConfig = {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  protected?: boolean;
  roles?: string[];
  permissions?: string[];
};

export type NavigationItem = {
  label: string;
  path: string;
  icon?: string;
  children?: NavigationItem[];
  roles?: string[];
  permissions?: string[];
};

// Theme and styling types
export type ColorPalette = {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  shadow: string;
};

export type ThemeConfig = {
  mode: string;
  colors: ColorPalette;
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      bold: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
};

// Validation types
export type ValidationSchema<T> = {
  [K in keyof T]?: string[];
};

export type ValidationResult = {
  isValid: boolean;
  errors: Record<string, string>;
};

// Event types
export type AppEvent = {
  type: string;
  payload?: any;
  timestamp: Date;
  userId?: string;
};

export type EventHandler<T = any> = (event: AppEvent & { payload: T }) => void;

// Storage types
export type StorageKey = string;
export type StorageValue = string | number | boolean | object | null;

export type StorageAdapter = {
  get: (key: StorageKey) => StorageValue | null;
  set: (key: StorageKey, value: StorageValue) => void;
  remove: (key: StorageKey) => void;
  clear: () => void;
};

// Internationalization types
export type TranslationKey = string;
export type TranslationParams = Record<string, string | number>;
export type TranslationFunction = (key: TranslationKey, params?: TranslationParams) => string;

export type LocaleConfig = {
  code: string;
  name: string;
  flag: string;
  rtl?: boolean;
};

// Mock data types for development
export type MockDataConfig = {
  users: number;
  companies: number;
  reviews: number;
  skills: number;
  goals: number;
  feedback: number;
};

// Development and testing types
export type TestUser = {
  email: string;
  password: string;
  role: string;
  name: string;
};

export type FeatureFlag = {
  name: string;
  enabled: boolean;
  description?: string;
  rolloutPercentage?: number;
};
