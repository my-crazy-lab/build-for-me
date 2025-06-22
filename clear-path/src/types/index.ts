export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  settings: UserSettings;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  chartType: 'bar' | 'pie' | 'line';
  availableHoursPerWeek: number;
  showModules: {
    goals: boolean;
    timeTracking: boolean;
    motivation: boolean;
    notes: boolean;
  };
  notifications: {
    weeklyReview: boolean;
    goalDeadlines: boolean;
    timeWarnings: boolean;
  };
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  priority: Priority;
  status: GoalStatus;
  deadline?: Date;
  estimatedHours: number;
  spentHours: number;
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
  notes: Note[];
  subtasks: Subtask[];
  tags: string[];
}

export interface GoalCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  attachments?: Attachment[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export interface TimeEntry {
  id: string;
  goalId: string;
  duration: number; // in minutes
  description?: string;
  date: Date;
  createdAt: Date;
}

export interface WeeklyReview {
  id: string;
  weekStartDate: Date;
  winOfTheWeek: string;
  challenges: string;
  nextWeekFocus: string[];
  goalProgress: { goalId: string; progress: number }[];
  createdAt: Date;
}

export interface MotivationalQuote {
  id: string;
  text: string;
  author: string;
  category: string;
}

export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type GoalStatus = 'active' | 'paused' | 'completed' | 'archived';

export interface DashboardStats {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  totalHoursSpent: number;
  averageProgress: number;
  upcomingDeadlines: Goal[];
  overloadedGoals: Goal[];
  neglectedGoals: Goal[];
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TimelineEvent {
  id: string;
  goalId: string;
  title: string;
  date: Date;
  type: 'deadline' | 'milestone' | 'review';
  completed: boolean;
}

export interface FocusSession {
  id: string;
  goalIds: string[];
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
}

// Context types
export interface AppContextType {
  user: User | null;
  goals: Goal[];
  categories: GoalCategory[];
  timeEntries: TimeEntry[];
  weeklyReviews: WeeklyReview[];
  focusSession: FocusSession | null;
  isLoading: boolean;
  error: string | null;
}

// Action types for context
export type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_GOALS'; payload: Goal[] }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: Goal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: GoalCategory[] }
  | { type: 'ADD_TIME_ENTRY'; payload: TimeEntry }
  | { type: 'START_FOCUS_SESSION'; payload: FocusSession }
  | { type: 'END_FOCUS_SESSION' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };
