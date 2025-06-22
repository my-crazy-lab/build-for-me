import type { Goal, TimeEntry } from '../types';

export const sampleGoals: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Learn React and TypeScript',
    description: 'Master modern React development with TypeScript for better web applications',
    category: { id: '3', name: 'Learning', color: '#f59e0b', icon: '📚' },
    priority: 'high',
    status: 'active',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    estimatedHours: 40,
    spentHours: 15.5,
    progress: 38,
    notes: [],
    subtasks: [
      { id: '1', title: 'Complete React fundamentals course', completed: true, createdAt: new Date(), completedAt: new Date() },
      { id: '2', title: 'Build a todo app with TypeScript', completed: true, createdAt: new Date(), completedAt: new Date() },
      { id: '3', title: 'Learn React hooks in depth', completed: false, createdAt: new Date() },
      { id: '4', title: 'Build a complex project', completed: false, createdAt: new Date() },
    ],
    tags: ['programming', 'web-development', 'frontend'],
  },
  {
    title: 'Run a Half Marathon',
    description: 'Train consistently to complete a 21km half marathon race',
    category: { id: '1', name: 'Health', color: '#22c55e', icon: '💪' },
    priority: 'medium',
    status: 'active',
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    estimatedHours: 60,
    spentHours: 22,
    progress: 37,
    notes: [],
    subtasks: [
      { id: '5', title: 'Run 5km without stopping', completed: true, createdAt: new Date(), completedAt: new Date() },
      { id: '6', title: 'Run 10km consistently', completed: true, createdAt: new Date(), completedAt: new Date() },
      { id: '7', title: 'Run 15km long run', completed: false, createdAt: new Date() },
      { id: '8', title: 'Complete race registration', completed: false, createdAt: new Date() },
    ],
    tags: ['fitness', 'running', 'endurance'],
  },
  {
    title: 'Get AWS Cloud Certification',
    description: 'Obtain AWS Solutions Architect Associate certification to advance career',
    category: { id: '2', name: 'Career', color: '#3b82f6', icon: '💼' },
    priority: 'urgent',
    status: 'active',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    estimatedHours: 80,
    spentHours: 35,
    progress: 44,
    notes: [],
    subtasks: [
      { id: '9', title: 'Complete AWS fundamentals course', completed: true, createdAt: new Date(), completedAt: new Date() },
      { id: '10', title: 'Practice with AWS console', completed: true, createdAt: new Date(), completedAt: new Date() },
      { id: '11', title: 'Take practice exams', completed: false, createdAt: new Date() },
      { id: '12', title: 'Schedule certification exam', completed: false, createdAt: new Date() },
    ],
    tags: ['aws', 'cloud', 'certification', 'career'],
  },
  {
    title: 'Build Emergency Fund',
    description: 'Save $10,000 for emergency expenses and financial security',
    category: { id: '5', name: 'Finance', color: '#8b5cf6', icon: '💰' },
    priority: 'high',
    status: 'active',
    deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    estimatedHours: 20,
    spentHours: 8,
    progress: 40,
    notes: [],
    subtasks: [
      { id: '13', title: 'Set up automatic savings transfer', completed: true, createdAt: new Date(), completedAt: new Date() },
      { id: '14', title: 'Create budget spreadsheet', completed: true, createdAt: new Date(), completedAt: new Date() },
      { id: '15', title: 'Save first $2,500', completed: false, createdAt: new Date() },
      { id: '16', title: 'Reach $5,000 milestone', completed: false, createdAt: new Date() },
    ],
    tags: ['savings', 'emergency-fund', 'financial-planning'],
  },
  {
    title: 'Learn Spanish Conversational Level',
    description: 'Achieve conversational fluency in Spanish for travel and personal growth',
    category: { id: '3', name: 'Learning', color: '#f59e0b', icon: '📚' },
    priority: 'medium',
    status: 'paused',
    deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months from now
    estimatedHours: 100,
    spentHours: 25,
    progress: 25,
    notes: [],
    subtasks: [
      { id: '17', title: 'Complete Duolingo Spanish tree', completed: true, createdAt: new Date(), completedAt: new Date() },
      { id: '18', title: 'Watch Spanish movies with subtitles', completed: false, createdAt: new Date() },
      { id: '19', title: 'Have 10 conversations with native speakers', completed: false, createdAt: new Date() },
      { id: '20', title: 'Take Spanish proficiency test', completed: false, createdAt: new Date() },
    ],
    tags: ['language', 'spanish', 'conversation'],
  },
  {
    title: 'Write a Personal Blog',
    description: 'Start and maintain a personal blog about technology and personal development',
    category: { id: '4', name: 'Personal', color: '#ef4444', icon: '❤️' },
    priority: 'low',
    status: 'completed',
    deadline: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    estimatedHours: 30,
    spentHours: 32,
    progress: 100,
    notes: [],
    subtasks: [
      { id: '21', title: 'Choose blogging platform', completed: true, createdAt: new Date(), completedAt: new Date() },
      { id: '22', title: 'Design blog layout', completed: true, createdAt: new Date(), completedAt: new Date() },
      { id: '23', title: 'Write first 5 blog posts', completed: true, createdAt: new Date(), completedAt: new Date() },
      { id: '24', title: 'Set up analytics and SEO', completed: true, createdAt: new Date(), completedAt: new Date() },
    ],
    tags: ['writing', 'blog', 'content-creation'],
  },
];

export const sampleTimeEntries: Omit<TimeEntry, 'id' | 'createdAt'>[] = [
  {
    goalId: 'goal-1', // Will be replaced with actual goal IDs
    duration: 120, // 2 hours
    description: 'Completed React hooks tutorial',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    goalId: 'goal-1',
    duration: 90, // 1.5 hours
    description: 'Built todo app component',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    goalId: 'goal-2',
    duration: 60, // 1 hour
    description: '5km morning run',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    goalId: 'goal-2',
    duration: 75, // 1.25 hours
    description: '8km training run',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    goalId: 'goal-3',
    duration: 150, // 2.5 hours
    description: 'AWS EC2 and S3 practice',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    goalId: 'goal-3',
    duration: 120, // 2 hours
    description: 'AWS networking concepts study',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
  },
  {
    goalId: 'goal-4',
    duration: 30, // 0.5 hours
    description: 'Budget review and planning',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    goalId: 'goal-5',
    duration: 45, // 0.75 hours
    description: 'Spanish conversation practice',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
  },
];

export function initializeSampleData() {
  // Check if data already exists
  const existingGoals = localStorage.getItem('focusDashboard_goals');
  const existingTimeEntries = localStorage.getItem('focusDashboard_timeEntries');

  if (!existingGoals || JSON.parse(existingGoals).length === 0) {
    // Create goals with proper IDs
    const goalsWithIds = sampleGoals.map((goal, index) => ({
      ...goal,
      id: `goal-${index + 1}`,
      createdAt: new Date(Date.now() - (7 - index) * 24 * 60 * 60 * 1000), // Spread over last week
      updatedAt: new Date(Date.now() - (3 - (index % 4)) * 24 * 60 * 60 * 1000), // Recent updates
    }));

    localStorage.setItem('focusDashboard_goals', JSON.stringify(goalsWithIds));

    // Create time entries with proper goal IDs
    const timeEntriesWithIds = sampleTimeEntries.map((entry, index) => ({
      ...entry,
      id: `time-${index + 1}`,
      createdAt: entry.date,
    }));

    localStorage.setItem('focusDashboard_timeEntries', JSON.stringify(timeEntriesWithIds));
  }
}
