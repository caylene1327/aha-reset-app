export type DayId = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type AppView = 'landing' | 'onboarding' | 'dashboard' | 'day' | 'comparison' | 'completion';

export interface DayContent {
  day: DayId;
  theme: string;
  title: string;
  summary: string;
  prompt: string;
  exercise: string;
  reflectionCheckpoint: string;
  milestoneMessage: string;
  subtitle?: string;
  themeSub?: string;
}

export interface JournalEntry {
  dayId: DayId;
  response: string;
  timestamp: number;
}

export interface UserProgress {
  completedDays: DayId[];
  currentDay: DayId;
  startedAt: number;
  streakActive: boolean;
  journalEntries: JournalEntry[];
}

export interface OnboardingStep {
  icon: string;
  title: string;
  body: string;
}