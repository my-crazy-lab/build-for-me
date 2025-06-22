import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { AppContextType, AppAction, User, Goal, GoalCategory, TimeEntry, WeeklyReview, FocusSession } from '../types';

const AppContext = createContext<{
  state: AppContextType;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

const initialState: AppContextType = {
  user: null,
  goals: [],
  categories: [
    { id: '1', name: 'Health', color: '#22c55e', icon: '💪' },
    { id: '2', name: 'Career', color: '#3b82f6', icon: '💼' },
    { id: '3', name: 'Learning', color: '#f59e0b', icon: '📚' },
    { id: '4', name: 'Personal', color: '#ef4444', icon: '❤️' },
    { id: '5', name: 'Finance', color: '#8b5cf6', icon: '💰' },
    { id: '6', name: 'Relationships', color: '#ec4899', icon: '👥' },
  ],
  timeEntries: [],
  weeklyReviews: [],
  focusSession: null,
  isLoading: false,
  error: null,
};

function appReducer(state: AppContextType, action: AppAction): AppContextType {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_GOALS':
      return { ...state, goals: action.payload };
    
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(goal =>
          goal.id === action.payload.id ? action.payload : goal
        ),
      };
    
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter(goal => goal.id !== action.payload),
      };
    
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    
    case 'ADD_TIME_ENTRY':
      return { ...state, timeEntries: [...state.timeEntries, action.payload] };
    
    case 'START_FOCUS_SESSION':
      return { ...state, focusSession: action.payload };
    
    case 'END_FOCUS_SESSION':
      return { ...state, focusSession: null };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedUser = localStorage.getItem('focusDashboard_user');
        const savedGoals = localStorage.getItem('focusDashboard_goals');
        const savedTimeEntries = localStorage.getItem('focusDashboard_timeEntries');
        const savedWeeklyReviews = localStorage.getItem('focusDashboard_weeklyReviews');

        if (savedUser) {
          dispatch({ type: 'SET_USER', payload: JSON.parse(savedUser) });
        }

        if (savedGoals) {
          const goals = JSON.parse(savedGoals).map((goal: any) => ({
            ...goal,
            createdAt: new Date(goal.createdAt),
            updatedAt: new Date(goal.updatedAt),
            deadline: goal.deadline ? new Date(goal.deadline) : undefined,
          }));
          dispatch({ type: 'SET_GOALS', payload: goals });
        }

        if (savedTimeEntries) {
          const timeEntries = JSON.parse(savedTimeEntries).map((entry: any) => ({
            ...entry,
            date: new Date(entry.date),
            createdAt: new Date(entry.createdAt),
          }));
          dispatch({ type: 'ADD_TIME_ENTRY', payload: timeEntries });
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('focusDashboard_user', JSON.stringify(state.user));
    }
  }, [state.user]);

  useEffect(() => {
    localStorage.setItem('focusDashboard_goals', JSON.stringify(state.goals));
  }, [state.goals]);

  useEffect(() => {
    localStorage.setItem('focusDashboard_timeEntries', JSON.stringify(state.timeEntries));
  }, [state.timeEntries]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Custom hooks for specific functionality
export function useGoals() {
  const { state, dispatch } = useApp();
  
  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGoal: Goal = {
      ...goal,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: [],
      subtasks: [],
      tags: [],
    };
    dispatch({ type: 'ADD_GOAL', payload: newGoal });
  };

  const updateGoal = (goal: Goal) => {
    const updatedGoal = { ...goal, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_GOAL', payload: updatedGoal });
  };

  const deleteGoal = (goalId: string) => {
    dispatch({ type: 'DELETE_GOAL', payload: goalId });
  };

  return {
    goals: state.goals,
    addGoal,
    updateGoal,
    deleteGoal,
  };
}

export function useTimeTracking() {
  const { state, dispatch } = useApp();

  const addTimeEntry = (goalId: string, duration: number, description?: string) => {
    const timeEntry: TimeEntry = {
      id: crypto.randomUUID(),
      goalId,
      duration,
      description,
      date: new Date(),
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_TIME_ENTRY', payload: timeEntry });

    // Update goal spent hours
    const goal = state.goals.find(g => g.id === goalId);
    if (goal) {
      const updatedGoal = {
        ...goal,
        spentHours: goal.spentHours + (duration / 60),
        updatedAt: new Date(),
      };
      dispatch({ type: 'UPDATE_GOAL', payload: updatedGoal });
    }
  };

  return {
    timeEntries: state.timeEntries,
    addTimeEntry,
  };
}

export function useFocusSession() {
  const { state, dispatch } = useApp();

  const startFocusSession = (goalIds: string[]) => {
    const session: FocusSession = {
      id: crypto.randomUUID(),
      goalIds,
      startTime: new Date(),
      isActive: true,
    };
    dispatch({ type: 'START_FOCUS_SESSION', payload: session });
  };

  const endFocusSession = () => {
    dispatch({ type: 'END_FOCUS_SESSION' });
  };

  return {
    focusSession: state.focusSession,
    startFocusSession,
    endFocusSession,
  };
}
