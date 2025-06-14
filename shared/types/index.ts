// ============================================================================
// SHARED TYPES FOR INSTATUS CLONE
// ============================================================================

// Base Types
export type UUID = string;
export type Timestamp = Date | string;

// ============================================================================
// USER MANAGEMENT
// ============================================================================

export interface User {
  id: UUID;
  email: string;
  name: string;
  password_hash?: string; // Only for backend
  role: UserRole;
  created_at: Timestamp;
  updated_at: Timestamp;
  email_verified: boolean;
  avatar_url?: string;
  preferences: UserPreferences;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface UserPreferences {
  language: 'en' | 'vi';
  theme: 'light' | 'dark';
  timezone: string;
  email_notifications: boolean;
  sms_notifications: boolean;
}

// ============================================================================
// PROJECT MANAGEMENT
// ============================================================================

export interface Project {
  id: UUID;
  user_id: UUID;
  name: string;
  slug: string;
  description?: string;
  is_private: boolean;
  custom_domain?: string;
  branding: ProjectBranding;
  created_at: Timestamp;
  updated_at: Timestamp;
  
  // Relations (populated when needed)
  user?: User;
  components?: Component[];
  incidents?: Incident[];
  subscribers?: Subscriber[];
  uptime_checks?: UptimeCheck[];
}

export interface ProjectBranding {
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  text_color: string;
  font_family: string;
  custom_css?: string;
  favicon_url?: string;
}

// ============================================================================
// COMPONENT MANAGEMENT
// ============================================================================

export interface Component {
  id: UUID;
  project_id: UUID;
  name: string;
  description?: string;
  status: ComponentStatus;
  position: number;
  created_at: Timestamp;
  updated_at: Timestamp;
  
  // Relations
  project?: Project;
  uptime_checks?: UptimeCheck[];
}

export enum ComponentStatus {
  OPERATIONAL = 'operational',
  DEGRADED = 'degraded',
  PARTIAL_OUTAGE = 'partial_outage',
  MAJOR_OUTAGE = 'major_outage',
  MAINTENANCE = 'maintenance'
}

export const COMPONENT_STATUS_COLORS = {
  [ComponentStatus.OPERATIONAL]: '#10b981',
  [ComponentStatus.DEGRADED]: '#f59e0b',
  [ComponentStatus.PARTIAL_OUTAGE]: '#ef4444',
  [ComponentStatus.MAJOR_OUTAGE]: '#dc2626',
  [ComponentStatus.MAINTENANCE]: '#6b7280'
} as const;

export const COMPONENT_STATUS_LABELS = {
  [ComponentStatus.OPERATIONAL]: 'Operational',
  [ComponentStatus.DEGRADED]: 'Degraded Performance',
  [ComponentStatus.PARTIAL_OUTAGE]: 'Partial Outage',
  [ComponentStatus.MAJOR_OUTAGE]: 'Major Outage',
  [ComponentStatus.MAINTENANCE]: 'Under Maintenance'
} as const;

// ============================================================================
// INCIDENT MANAGEMENT
// ============================================================================

export interface Incident {
  id: UUID;
  project_id: UUID;
  title: string;
  content: string;
  status: IncidentStatus;
  impact: IncidentImpact;
  start_time: Timestamp;
  end_time?: Timestamp;
  created_at: Timestamp;
  updated_at: Timestamp;
  
  // Relations
  project?: Project;
  updates?: IncidentUpdate[];
  affected_components?: UUID[];
}

export enum IncidentStatus {
  INVESTIGATING = 'investigating',
  IDENTIFIED = 'identified',
  MONITORING = 'monitoring',
  RESOLVED = 'resolved'
}

export enum IncidentImpact {
  NONE = 'none',
  MINOR = 'minor',
  MAJOR = 'major',
  CRITICAL = 'critical'
}

export interface IncidentUpdate {
  id: UUID;
  incident_id: UUID;
  status: IncidentStatus;
  content: string;
  created_at: Timestamp;
  
  // Relations
  incident?: Incident;
}

export const INCIDENT_STATUS_COLORS = {
  [IncidentStatus.INVESTIGATING]: '#ef4444',
  [IncidentStatus.IDENTIFIED]: '#f59e0b',
  [IncidentStatus.MONITORING]: '#3b82f6',
  [IncidentStatus.RESOLVED]: '#10b981'
} as const;

export const INCIDENT_IMPACT_COLORS = {
  [IncidentImpact.NONE]: '#6b7280',
  [IncidentImpact.MINOR]: '#f59e0b',
  [IncidentImpact.MAJOR]: '#ef4444',
  [IncidentImpact.CRITICAL]: '#dc2626'
} as const;

// ============================================================================
// SUBSCRIBER MANAGEMENT
// ============================================================================

export interface Subscriber {
  id: UUID;
  project_id: UUID;
  email?: string;
  phone?: string;
  notify_by: NotificationChannel[];
  is_verified: boolean;
  verification_token?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  
  // Relations
  project?: Project;
}

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  SLACK = 'slack',
  WEBHOOK = 'webhook',
  DISCORD = 'discord'
}

// ============================================================================
// NOTIFICATION SYSTEM
// ============================================================================

export interface Notification {
  id: UUID;
  incident_id?: UUID;
  project_id: UUID;
  channel: NotificationChannel;
  recipient: string;
  subject: string;
  content: string;
  status: NotificationStatus;
  sent_at?: Timestamp;
  retry_count: number;
  error_message?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  
  // Relations
  incident?: Incident;
  project?: Project;
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  RETRYING = 'retrying'
}

// ============================================================================
// MONITORING SYSTEM
// ============================================================================

export interface UptimeCheck {
  id: UUID;
  project_id: UUID;
  component_id?: UUID;
  name: string;
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: string;
  timeout: number;
  interval: number; // in seconds
  expected_status_codes: number[];
  keyword_check?: string;
  is_active: boolean;
  last_status: UptimeStatus;
  last_checked_at?: Timestamp;
  created_at: Timestamp;
  updated_at: Timestamp;
  
  // Relations
  project?: Project;
  component?: Component;
  logs?: UptimeLog[];
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS'
}

export enum UptimeStatus {
  UP = 'up',
  DOWN = 'down',
  UNKNOWN = 'unknown'
}

export interface UptimeLog {
  id: UUID;
  uptime_check_id: UUID;
  status: UptimeStatus;
  response_time_ms?: number;
  status_code?: number;
  error_message?: string;
  checked_at: Timestamp;
  
  // Relations
  uptime_check?: UptimeCheck;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// ============================================================================
// DASHBOARD & ANALYTICS
// ============================================================================

export interface DashboardStats {
  total_projects: number;
  total_components: number;
  total_incidents: number;
  total_subscribers: number;
  uptime_percentage: number;
  incidents_this_month: number;
  avg_response_time: number;
  status_distribution: Record<ComponentStatus, number>;
}

export interface UptimeStats {
  uptime_percentage: number;
  total_checks: number;
  successful_checks: number;
  failed_checks: number;
  avg_response_time: number;
  incidents_count: number;
  last_incident?: Timestamp;
}

export interface ProjectStats {
  uptime_percentage: number;
  total_incidents: number;
  total_subscribers: number;
  avg_response_time: number;
  status_distribution: Record<ComponentStatus, number>;
  uptime_history: UptimeHistoryPoint[];
}

export interface UptimeHistoryPoint {
  date: string;
  uptime_percentage: number;
  avg_response_time: number;
  incidents_count: number;
}

// ============================================================================
// FORM & VALIDATION TYPES
// ============================================================================

export interface CreateProjectRequest {
  name: string;
  slug: string;
  description?: string;
  is_private: boolean;
  branding?: Partial<ProjectBranding>;
}

export interface UpdateProjectRequest {
  name?: string;
  slug?: string;
  description?: string;
  is_private?: boolean;
  custom_domain?: string;
  branding?: Partial<ProjectBranding>;
}

export interface CreateComponentRequest {
  name: string;
  description?: string;
  status: ComponentStatus;
}

export interface CreateIncidentRequest {
  title: string;
  content: string;
  status: IncidentStatus;
  impact: IncidentImpact;
  affected_components?: UUID[];
}

export interface CreateUptimeCheckRequest {
  name: string;
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  timeout: number;
  interval: number;
  expected_status_codes: number[];
  keyword_check?: string;
  component_id?: UUID;
}

export interface SubscribeRequest {
  email?: string;
  phone?: string;
  notify_by: NotificationChannel[];
}

// ============================================================================
// WEBSOCKET EVENTS
// ============================================================================

export interface WebSocketEvent {
  type: WebSocketEventType;
  data: any;
  project_id?: UUID;
  timestamp: Timestamp;
}

export enum WebSocketEventType {
  COMPONENT_STATUS_CHANGED = 'component_status_changed',
  INCIDENT_CREATED = 'incident_created',
  INCIDENT_UPDATED = 'incident_updated',
  INCIDENT_RESOLVED = 'incident_resolved',
  UPTIME_CHECK_FAILED = 'uptime_check_failed',
  UPTIME_CHECK_RECOVERED = 'uptime_check_recovered',
  NEW_SUBSCRIBER = 'new_subscriber'
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const DEFAULT_PROJECT_BRANDING: ProjectBranding = {
  primary_color: '#3b82f6',
  secondary_color: '#1e40af',
  background_color: '#ffffff',
  text_color: '#1f2937',
  font_family: 'Inter, sans-serif'
};

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  language: 'en',
  theme: 'light',
  timezone: 'UTC',
  email_notifications: true,
  sms_notifications: false
};

export const UPTIME_CHECK_INTERVALS = [
  { label: '30 seconds', value: 30 },
  { label: '1 minute', value: 60 },
  { label: '5 minutes', value: 300 },
  { label: '10 minutes', value: 600 },
  { label: '30 minutes', value: 1800 },
  { label: '1 hour', value: 3600 }
] as const;

export const NOTIFICATION_RETRY_ATTEMPTS = 3;
export const NOTIFICATION_RETRY_DELAY = 60; // seconds

export const MAX_PROJECTS_PER_USER = 10;
export const MAX_COMPONENTS_PER_PROJECT = 50;
export const MAX_UPTIME_CHECKS_PER_PROJECT = 20;
