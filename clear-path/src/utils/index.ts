import type { Goal, DashboardStats, ChartData, TimeEntry, MotivationalQuote } from '../types';
import { format, isAfter, isBefore, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date): string {
  return format(date, 'MMM dd, yyyy');
}

export function formatDateTime(date: Date): string {
  return format(date, 'MMM dd, yyyy HH:mm');
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  
  if (mins === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${mins}m`;
}

export function calculateProgress(goal: Goal): number {
  if (goal.estimatedHours === 0) return 0;
  return Math.min(100, (goal.spentHours / goal.estimatedHours) * 100);
}

export function getDaysUntilDeadline(deadline: Date): number {
  const today = new Date();
  const diffTime = deadline.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function isOverdue(deadline: Date): boolean {
  return isAfter(new Date(), deadline);
}

export function isUpcoming(deadline: Date, days: number = 7): boolean {
  const today = new Date();
  const futureDate = addDays(today, days);
  return isAfter(deadline, today) && isBefore(deadline, futureDate);
}

export function calculateDashboardStats(
  goals: Goal[],
  timeEntries: TimeEntry[]
): DashboardStats {
  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');
  
  const totalHoursSpent = timeEntries.reduce((total, entry) => total + (entry.duration / 60), 0);
  
  const averageProgress = goals.length > 0 
    ? goals.reduce((sum, goal) => sum + calculateProgress(goal), 0) / goals.length
    : 0;

  const upcomingDeadlines = goals
    .filter(g => g.deadline && isUpcoming(g.deadline))
    .sort((a, b) => (a.deadline!.getTime() - b.deadline!.getTime()));

  const overloadedGoals = goals.filter(g => {
    const progress = calculateProgress(g);
    const daysLeft = g.deadline ? getDaysUntilDeadline(g.deadline) : Infinity;
    const hoursLeft = g.estimatedHours - g.spentHours;
    const hoursPerDay = daysLeft > 0 ? hoursLeft / daysLeft : 0;
    return hoursPerDay > 3; // More than 3 hours per day needed
  });

  const neglectedGoals = goals.filter(g => {
    const lastEntry = timeEntries
      .filter(e => e.goalId === g.id)
      .sort((a, b) => b.date.getTime() - a.date.getTime())[0];
    
    if (!lastEntry) return true;
    
    const daysSinceLastEntry = getDaysUntilDeadline(lastEntry.date);
    return daysSinceLastEntry > 7; // No activity for more than 7 days
  });

  return {
    totalGoals: goals.length,
    activeGoals: activeGoals.length,
    completedGoals: completedGoals.length,
    totalHoursSpent,
    averageProgress,
    upcomingDeadlines,
    overloadedGoals,
    neglectedGoals,
  };
}

export function getTimeAllocationData(goals: Goal[]): ChartData[] {
  const categoryData: { [key: string]: number } = {};
  
  goals.forEach(goal => {
    const categoryName = goal.category.name;
    categoryData[categoryName] = (categoryData[categoryName] || 0) + goal.spentHours;
  });

  return Object.entries(categoryData).map(([name, value]) => ({
    name,
    value: Math.round(value * 100) / 100, // Round to 2 decimal places
  }));
}

export function getProgressData(goals: Goal[]): ChartData[] {
  return goals.map(goal => ({
    name: goal.title.length > 20 ? goal.title.substring(0, 20) + '...' : goal.title,
    value: calculateProgress(goal),
    color: goal.category.color,
  }));
}

export function getWeeklyTimeData(timeEntries: TimeEntry[]): ChartData[] {
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  
  const weeklyEntries = timeEntries.filter(entry => 
    isAfter(entry.date, weekStart) && isBefore(entry.date, weekEnd)
  );

  const dailyData: { [key: string]: number } = {};
  
  for (let i = 0; i < 7; i++) {
    const day = addDays(weekStart, i);
    const dayName = format(day, 'EEE');
    dailyData[dayName] = 0;
  }

  weeklyEntries.forEach(entry => {
    const dayName = format(entry.date, 'EEE');
    dailyData[dayName] += entry.duration / 60; // Convert to hours
  });

  return Object.entries(dailyData).map(([name, value]) => ({
    name,
    value: Math.round(value * 100) / 100,
  }));
}

export function generateSmartSuggestions(
  goals: Goal[],
  availableHoursPerWeek: number
): string[] {
  const suggestions: string[] = [];
  const stats = calculateDashboardStats(goals, []);

  // Check for overloaded schedule
  const totalEstimatedHours = goals
    .filter(g => g.status === 'active')
    .reduce((sum, goal) => sum + (goal.estimatedHours - goal.spentHours), 0);

  if (totalEstimatedHours > availableHoursPerWeek * 4) { // 4 weeks ahead
    suggestions.push('Your schedule seems overloaded. Consider reducing scope or extending deadlines.');
  }

  // Check for neglected goals
  if (stats.neglectedGoals.length > 0) {
    suggestions.push(`You have ${stats.neglectedGoals.length} goals that haven't been worked on recently.`);
  }

  // Check for upcoming deadlines
  if (stats.upcomingDeadlines.length > 0) {
    suggestions.push(`${stats.upcomingDeadlines.length} goals have deadlines coming up this week.`);
  }

  // Progress suggestions
  if (stats.averageProgress < 25) {
    suggestions.push('Consider breaking down your goals into smaller, more manageable tasks.');
  }

  // Time allocation suggestions
  const activeGoals = goals.filter(g => g.status === 'active');
  if (activeGoals.length > 5) {
    suggestions.push('Focus on 3-5 goals at a time for better results.');
  }

  return suggestions;
}

export const motivationalQuotes: MotivationalQuote[] = [
  {
    id: '1',
    text: 'The way to get started is to quit talking and begin doing.',
    author: 'Walt Disney',
    category: 'motivation',
  },
  {
    id: '2',
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    author: 'Winston Churchill',
    category: 'perseverance',
  },
  {
    id: '3',
    text: 'The future belongs to those who believe in the beauty of their dreams.',
    author: 'Eleanor Roosevelt',
    category: 'dreams',
  },
  {
    id: '4',
    text: 'It is during our darkest moments that we must focus to see the light.',
    author: 'Aristotle',
    category: 'focus',
  },
  {
    id: '5',
    text: 'Believe you can and you\'re halfway there.',
    author: 'Theodore Roosevelt',
    category: 'confidence',
  },
  {
    id: '6',
    text: 'The only impossible journey is the one you never begin.',
    author: 'Tony Robbins',
    category: 'beginning',
  },
  {
    id: '7',
    text: 'Success is walking from failure to failure with no loss of enthusiasm.',
    author: 'Winston Churchill',
    category: 'resilience',
  },
  {
    id: '8',
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    category: 'passion',
  },
];

export function getRandomQuote(category?: string): MotivationalQuote {
  const filteredQuotes = category 
    ? motivationalQuotes.filter(q => q.category === category)
    : motivationalQuotes;
  
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  return filteredQuotes[randomIndex];
}

export function exportData(goals: Goal[], timeEntries: TimeEntry[]): string {
  const data = {
    goals,
    timeEntries,
    exportedAt: new Date().toISOString(),
  };
  
  return JSON.stringify(data, null, 2);
}

export function importData(jsonString: string): { goals: Goal[]; timeEntries: TimeEntry[] } {
  try {
    const data = JSON.parse(jsonString);
    
    const goals = data.goals.map((goal: any) => ({
      ...goal,
      createdAt: new Date(goal.createdAt),
      updatedAt: new Date(goal.updatedAt),
      deadline: goal.deadline ? new Date(goal.deadline) : undefined,
    }));

    const timeEntries = data.timeEntries.map((entry: any) => ({
      ...entry,
      date: new Date(entry.date),
      createdAt: new Date(entry.createdAt),
    }));

    return { goals, timeEntries };
  } catch (error) {
    throw new Error('Invalid data format');
  }
}
