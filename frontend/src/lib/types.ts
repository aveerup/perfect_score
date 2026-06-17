export type Skill = 'L' | 'R' | 'W' | 'S';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type BandRange = string; // e.g. "6.0 - 7.0"

export interface VideoLecture {
  id: string;
  title: string;
  description?: string;
  vimeoId?: string;
  embedUrl?: string;
  skill: Skill;
  bandRange: BandRange;
  duration: string;
  watched: boolean;
  progress: number; // 0-100
  publishedAt?: string;
  upNext?: VideoLecture[];
}

export interface PracticeQuestionSet {
  id: string;
  title: string;
  skill: Skill;
  subType: string; // e.g. "Multiple Choice", "Map Labeling"
  difficulty: Difficulty;
  bandRange: BandRange;
  attempted: boolean;
  score?: string; // e.g. "36/40"
}

export interface VocabularyWord {
  id: string;
  word: string;
  definition: string;
  collocations: string[];
  example: string;
  masteryLevel: 0 | 1 | 2 | 3 | 4;
  category: VocabularyCategory;
}

export type VocabularyCategory = 
  | 'Technology' 
  | 'Health & Medicine' 
  | 'Education' 
  | 'Science & Innovation' 
  | 'Politics & Governance' 
  | 'Media & Communication' 
  | 'Economics & Finance' 
  | 'Urban Development' 
  | 'Social Life & Culture' 
  | 'Environment';

export interface MockTest {
  id: string;
  number: number;
  dateTaken: string | null;
  overallBand: number | null;
  scores: {
    L: number;
    R: number;
    W: number;
    S: number;
  } | null;
  status: 'attempted' | 'not-attempted';
}

export interface DashboardData {
  currentBand: number;
  targetBand: number;
  streak: number;
  errorLog: ErrorEntry[];
  recentSessions: SessionEntry[];
  practiceSchedule: ScheduleEntry[];
}

export interface ErrorEntry {
  id: string;
  questionId: string;
  skill: Skill;
  errorType: string;
  date: string;
}

export interface SessionEntry {
  id: string;
  type: string;
  duration: string;
  date: string;
}

export interface ScheduleEntry {
  id: string;
  day: string;
  task: string;
  completed: boolean;
}

export interface StudyPlan {
  tier: string;
  startDate: string;
  examDate: string;
  todayTasks: {
    id: string;
    title: string;
    feature: 'VIDEO' | 'PRACTICE' | 'VOCAB' | 'MOCK';
    estimatedTime: string;
    isPrimary: boolean;
    completed?: boolean;
  }[];
  days: {
    dayNumber: number;
    tasks: {
      id: string;
      title: string;
      skill: 'L' | 'R' | 'W' | 'S' | 'General';
      duration: string;
      completed: boolean;
    }[];
  }[];
}

export interface StudyDay {
  dayNumber: number;
  tasks: StudyTask[];
}

export interface StudyTask {
  id: string;
  title: string;
  skill: Skill | 'General';
  duration: string;
  completed: boolean;
}

export interface AuthProfile {
  id: string;
  email: string;
  name: string;
  role: "student" | "admin";
  location: string;
  timezone: string;
  targetBand: number;
  targetScore: number;
  currentAverage: number;
  currentBand: number;
  streak: number;
  joinDate: string;
  rowCreated?: string | null;
  lastLogin?: string | null;
}

export interface TestQuestion {
  id: string;
  number: number;
  prompt: string;
  type: string;
  options?: string[];
  targetWords?: number;
}

export interface TestSection {
  id: string;
  name: string;
  skill: Skill;
  position: number;
  timeLimitSeconds: number;
  passage?: string;
  audioUrl?: string;
  segments?: { id: string; label: string; timestamp: number }[];
  questions: TestQuestion[];
}

export interface TestDetail {
  id: string;
  title: string;
  testType: "practice" | "mock";
  skill?: Skill;
  subType?: string;
  difficulty?: Difficulty;
  bandRange?: string;
  timeLimitSeconds: number;
  sections: TestSection[];
}

export interface TestAttempt {
  id: string;
  testId: string;
  timeLeft: number;
  activeSection: string;
  answers: Record<string, string>;
}

export interface PracticeResult {
  practiceId: string;
  title: string;
  skill: Skill;
  score: number;
  scoringMode: "basic";
  criteria: { name: string; score: number }[];
  heatmap: number[];
  feedback: string[];
}

export interface MockResult {
  mockId: string;
  overallBand: number;
  scores: Record<Skill, number>;
  dateTaken: string;
  scoringMode: "basic";
  feedback: string;
}

export interface TypingPassage {
  id: string;
  title: string;
  type: string;
  content: string;
  bestWpm: number | null;
  bestAccuracy: number | null;
}

export interface VocabularyCategorySummary {
  category: VocabularyCategory;
  wordCount: number;
  mastery: number;
}
