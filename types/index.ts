import { Timestamp } from 'firebase/firestore';

// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  level: number;
  exp: number;
  createdAt: Timestamp;
  lastActiveAt: Timestamp;
}

// ─── Monster ──────────────────────────────────────────────────────────────────
export type Subject = 'math' | 'science' | 'coding';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'boss';

export interface Monster {
  id: string;
  name: string;
  subject: Subject;
  difficulty: Difficulty;
  description: string;
  spriteUrl: string;
  requiredLevel: number;
  requiredExp: number;
  hp: number;
  expReward: number;
  lessonIds: string[];
  order: number;
}

// ─── Lesson ───────────────────────────────────────────────────────────────────
export interface Lesson {
  id: string;
  monsterId: string;
  title: string;
  subject: Subject;
  youtubeVideoId: string;
  durationSeconds: number;
  expReward: number;
  order: number;
}

// ─── Quiz Question ────────────────────────────────────────────────────────────
export interface QuizQuestion {
  id: string;
  lessonId: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  expReward: number;
  order: number;
}

// ─── Boss Question ────────────────────────────────────────────────────────────
export interface BossQuestion {
  id: string;
  monsterId: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  damage: number;
  order: number;
}

// ─── User Progress ────────────────────────────────────────────────────────────
export interface MonsterProgress {
  monsterId: string;
  watchedLessonIds: string[];
  completedQuizIds: string[];
  battleAttempts: number;
  defeated: boolean;
  defeatedAt: Timestamp | null;
}

// ─── EXP Event ────────────────────────────────────────────────────────────────
export type ExpEventType = 'video_watch' | 'quiz_correct' | 'monster_defeat';

export interface ExpEvent {
  id: string;
  type: ExpEventType;
  sourceId: string;
  amount: number;
  createdAt: Timestamp;
}

// ─── Feed ─────────────────────────────────────────────────────────────────────
export type FeedItem =
  | { type: 'video'; lesson: Lesson }
  | { type: 'quiz'; question: QuizQuestion; lessonId: string };

// ─── Battle ───────────────────────────────────────────────────────────────────
export type BattlePhase =
  | 'intro'
  | 'playerTurn'
  | 'playerAttack'
  | 'monsterAttack'
  | 'victory'
  | 'defeat';

export interface BattleState {
  phase: BattlePhase;
  monsterHp: number;
  monsterMaxHp: number;
  playerHp: number;
  playerMaxHp: number;
  currentQuestionIndex: number;
  questions: BossQuestion[];
  answerResult: 'correct' | 'incorrect' | null;
  streakCount: number;
}
