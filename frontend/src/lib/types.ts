export type Skill = 'L' | 'R' | 'W' | 'S';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type BandRange = string; // e.g. "6.0 - 7.0"

export interface VideoLecture {
  id: string;
  title: string;
  description?: string;
  sourcePath?: string;
  vimeoId?: string;
  videoProvider?: "youtube" | "vimeo";
  youtubeLink?: string;
  youtubeId?: string;
  embedUrl?: string;
  task?: string | null;
  module?: string | null;
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
  type: string;
  englishMeaning: string;
  banglaMeaning: string;
  sentence: string;
  sentenceBanglaMeaning: string;
  masteryLevel: 0 | 1 | 2 | 3 | 4;
  group: VocabularyGroup;
}

export type VocabularyGroup = string;

export type VocabQuizAnswerType = "mcq" | "input";

export interface VocabQuizQuestion {
  id: string;
  wordId: string;
  word: string;
  type: string;
  typeLabel: string;
  answerType: VocabQuizAnswerType;
  prompt: string;
  options?: string[];
}

export interface VocabQuizGradedAnswer {
  questionId: string;
  label?: string;
  type?: string;
  prompt: string;
  answer: string;
  correctAnswer: string;
  isCorrect: boolean;
  score: number;
}

export interface VocabQuizResult {
  testNo: number;
  group: string;
  score: number;
  rawScore: {
    correct: number;
    total: number;
  };
  answers: Record<string, string>;
  gradedAnswers: VocabQuizGradedAnswer[];
  durationSeconds?: number | null;
}

export interface VocabQuizAttempt {
  id: string;
  testNo: number;
  status: "draft" | "active" | "submitted";
  selectedQuestions: VocabQuizQuestion[];
  answers: Record<string, string>;
  score: number | null;
  result: VocabQuizResult | null;
  timeLimitSeconds: number;
  createdAt?: string | null;
  submittedAt?: string | null;
}

export interface VocabQuizStartResponse {
  attempt: VocabQuizAttempt;
  group: string;
  testNo: number;
  timeLimitSeconds: number;
  selectedQuestionIds: string[];
  signature: string;
}

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

export interface PlanSummary {
  title: string;
  slug: string;
  partCount: number;
  unit: "Day" | "Week" | "Month" | "Part";
}

export interface PlanPart {
  key: string;
  title: string;
  video_lectures: string;
  practise_questions: string;
  vocab_practise: string;
  mock?: string;
}

export interface TimelinePlan extends PlanSummary {
  parts: PlanPart[];
}

export interface UserPlanProgress {
  followingPlans: string[];
  completed: Record<string, string[]>;
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
  label?: string;
  prompt: string;
  type: string;
  options?: string[];
  superCategory?: string;
  title?: string;
  theme?: string;
  rules?: string[];
  parentId?: string;
  parentNumber?: number;
  modelAnswer?: string;
  answer?: string;
  targetWords?: number;
  taskType?: "task1" | "task2";
  visualType?: string;
  data?: {
    columns?: string[];
    rows?: string[][];
  };
  essayType?: string;
}

export interface TestSection {
  id: string;
  name: string;
  skill: Skill;
  position: number;
  timeLimitSeconds: number;
  taskType?: "task1" | "task2";
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
  score: number | null;
  scoringMode: "basic" | "saved" | "partial" | "admin";
  rawScore?: {
    answered?: number;
    mcqEarned?: number;
    mcqTotal?: number;
    audioEarned?: number | null;
    audioTotal?: number;
    earned?: number;
    total?: number;
  };
  criteria: { name: string; score: number | null }[];
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

export type TypingExerciseKind = "warmup" | "guided" | "challenge";

export interface TypingExercise {
  id: string;
  kind: TypingExerciseKind;
  title: string;
  text: string;
  rounds: string[];
  guidance: string;
}

export interface TypingLessonProgress {
  completed: boolean;
  attemptCount: number;
  bestWpm: number | null;
  bestAccuracy: number | null;
  lastAttemptAt: string | null;
  keyErrors: Record<string, number>;
}

export interface TypingLesson {
  id: string;
  day: number;
  title: string;
  focus: string;
  keys: string[];
  durationMinutes: number;
  targetAccuracy: number;
  targetWpm: number;
  instructions: string[];
  exercises: TypingExercise[];
  locked: boolean;
  progress: TypingLessonProgress;
}

export interface TypingCourse {
  lessons: TypingLesson[];
  summary: {
    completedLessons: number;
    totalLessons: number;
    progressPercent: number;
    nextLessonId: string | null;
    weakKeys: { key: string; errors: number }[];
    baselineWpm: number | null;
    graduationWpm: number | null;
  };
}

export interface TypingLessonAttemptResult {
  id: string;
  lessonId: string;
  wpm: number;
  accuracy: number;
  durationSeconds: number;
  passed: boolean;
  keyErrors: Record<string, number>;
  createdAt: string;
}

export interface VocabularyGroupSummary {
  group: VocabularyGroup;
  wordCount: number;
  mastery: number;
}

export type VocabularyCategorySummary = VocabularyGroupSummary;
