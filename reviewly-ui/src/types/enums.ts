/**
 * Core Enums for Reviewly Application
 * 
 * This file contains all the TypeScript enums used throughout the application
 * for consistent type definitions and better code maintainability. These enums
 * define various states, types, and categories used across the system.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

// User related enums
export enum UserRole {
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
  HR = 'hr',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto'
}

// Company related enums
export enum CompanySize {
  STARTUP = 'startup', // 1-10 employees
  SMALL = 'small', // 11-50 employees
  MEDIUM = 'medium', // 51-200 employees
  LARGE = 'large', // 201-1000 employees
  ENTERPRISE = 'enterprise' // 1000+ employees
}

export enum ReviewCycle {
  QUARTERLY = 'quarterly',
  SEMI_ANNUAL = 'semi_annual',
  ANNUAL = 'annual',
  CUSTOM = 'custom'
}

// Review related enums
export enum ReviewStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  SELF_REVIEW_COMPLETE = 'self_review_complete',
  PEER_REVIEW_PENDING = 'peer_review_pending',
  PEER_REVIEW_COMPLETE = 'peer_review_complete',
  MANAGER_REVIEW_PENDING = 'manager_review_pending',
  MANAGER_REVIEW_COMPLETE = 'manager_review_complete',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

export enum QuestionType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  MULTIPLE_CHOICE = 'multiple_choice',
  CHECKBOX = 'checkbox',
  RATING = 'rating',
  SCALE = 'scale',
  DATE = 'date',
  FILE_UPLOAD = 'file_upload'
}

// Skill related enums
export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
  MASTER = 'master'
}

// Goal related enums
export enum GoalCategory {
  PROFESSIONAL = 'professional',
  TECHNICAL = 'technical',
  LEADERSHIP = 'leadership',
  PERSONAL = 'personal',
  TEAM = 'team',
  COMPANY = 'company'
}

export enum GoalStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  ON_TRACK = 'on_track',
  AT_RISK = 'at_risk',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  OVERDUE = 'overdue'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Feedback related enums
export enum FeedbackType {
  POSITIVE = 'positive',
  CONSTRUCTIVE = 'constructive',
  GENERAL = 'general',
  PEER_REVIEW = 'peer_review',
  MANAGER_FEEDBACK = 'manager_feedback',
  SELF_REFLECTION = 'self_reflection'
}

// Integration related enums
export enum IntegrationType {
  GITHUB = 'github',
  JIRA = 'jira',
  NOTION = 'notion',
  SLACK = 'slack',
  TRELLO = 'trello',
  ASANA = 'asana'
}

export enum IntegrationSource {
  GITHUB = 'github',
  JIRA = 'jira',
  NOTION = 'notion',
  SLACK = 'slack',
  MANUAL = 'manual'
}

export enum ImportDataType {
  COMMIT = 'commit',
  PULL_REQUEST = 'pull_request',
  ISSUE = 'issue',
  COMMENT = 'comment',
  PAGE = 'page',
  TASK = 'task',
  PROJECT = 'project',
  DOCUMENT = 'document'
}

// Gamification related enums
export enum BadgeType {
  SKILL_MASTERY = 'skill_mastery',
  GOAL_ACHIEVEMENT = 'goal_achievement',
  PEER_RECOGNITION = 'peer_recognition',
  CONSISTENCY = 'consistency',
  LEADERSHIP = 'leadership',
  INNOVATION = 'innovation',
  COLLABORATION = 'collaboration',
  MILESTONE = 'milestone'
}

export enum BadgeRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

// Notification related enums
export enum NotificationType {
  REVIEW_DEADLINE = 'review_deadline',
  FEEDBACK_RECEIVED = 'feedback_received',
  GOAL_MILESTONE = 'goal_milestone',
  BADGE_EARNED = 'badge_earned',
  PEER_REQUEST = 'peer_request',
  MANAGER_REVIEW = 'manager_review',
  SYSTEM_UPDATE = 'system_update',
  REMINDER = 'reminder'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// Analytics related enums
export enum MetricType {
  PERFORMANCE_SCORE = 'performance_score',
  SKILL_GROWTH = 'skill_growth',
  GOAL_COMPLETION = 'goal_completion',
  PEER_FEEDBACK = 'peer_feedback',
  ENGAGEMENT = 'engagement',
  PRODUCTIVITY = 'productivity'
}

export enum TrendDirection {
  UP = 'up',
  DOWN = 'down',
  STABLE = 'stable'
}

export enum ComparisonType {
  TEAM = 'team',
  DEPARTMENT = 'department',
  COMPANY = 'company',
  INDUSTRY = 'industry'
}

// Export related enums
export enum ExportFormat {
  PDF = 'pdf',
  WORD = 'word',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json'
}

export enum ReportType {
  INDIVIDUAL_REVIEW = 'individual_review',
  TEAM_SUMMARY = 'team_summary',
  DEPARTMENT_ANALYTICS = 'department_analytics',
  COMPANY_OVERVIEW = 'company_overview',
  SKILL_MATRIX = 'skill_matrix',
  GOAL_TRACKING = 'goal_tracking',
  SALARY_BENCHMARK = 'salary_benchmark'
}

// Language and localization enums
export enum SupportedLanguage {
  ENGLISH = 'en',
  SPANISH = 'es',
  FRENCH = 'fr',
  GERMAN = 'de',
  ITALIAN = 'it',
  PORTUGUESE = 'pt',
  CHINESE = 'zh',
  JAPANESE = 'ja',
  KOREAN = 'ko',
  RUSSIAN = 'ru'
}

// API related enums
export enum ApiStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  LOADING = 'loading',
  IDLE = 'idle'
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

// UI related enums
export enum ComponentSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

export enum ComponentVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info'
}

export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

// Chart and visualization enums
export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
  DOUGHNUT = 'doughnut',
  RADAR = 'radar',
  SCATTER = 'scatter',
  AREA = 'area'
}

export enum TimeRange {
  LAST_WEEK = 'last_week',
  LAST_MONTH = 'last_month',
  LAST_QUARTER = 'last_quarter',
  LAST_YEAR = 'last_year',
  CUSTOM = 'custom'
}

// Permission and access control enums
export enum Permission {
  READ_OWN_REVIEWS = 'read_own_reviews',
  WRITE_OWN_REVIEWS = 'write_own_reviews',
  READ_TEAM_REVIEWS = 'read_team_reviews',
  WRITE_TEAM_REVIEWS = 'write_team_reviews',
  READ_ALL_REVIEWS = 'read_all_reviews',
  WRITE_ALL_REVIEWS = 'write_all_reviews',
  MANAGE_USERS = 'manage_users',
  MANAGE_COMPANIES = 'manage_companies',
  MANAGE_INTEGRATIONS = 'manage_integrations',
  VIEW_ANALYTICS = 'view_analytics',
  EXPORT_DATA = 'export_data',
  MANAGE_SETTINGS = 'manage_settings'
}

export enum AccessLevel {
  NONE = 'none',
  READ = 'read',
  WRITE = 'write',
  ADMIN = 'admin'
}

// Validation related enums
export enum ValidationRule {
  REQUIRED = 'required',
  MIN_LENGTH = 'min_length',
  MAX_LENGTH = 'max_length',
  EMAIL = 'email',
  URL = 'url',
  PHONE = 'phone',
  DATE = 'date',
  NUMBER = 'number',
  POSITIVE_NUMBER = 'positive_number',
  PERCENTAGE = 'percentage'
}

// Error related enums
export enum ErrorType {
  VALIDATION_ERROR = 'validation_error',
  AUTHENTICATION_ERROR = 'authentication_error',
  AUTHORIZATION_ERROR = 'authorization_error',
  NOT_FOUND_ERROR = 'not_found_error',
  SERVER_ERROR = 'server_error',
  NETWORK_ERROR = 'network_error',
  TIMEOUT_ERROR = 'timeout_error',
  UNKNOWN_ERROR = 'unknown_error'
}
