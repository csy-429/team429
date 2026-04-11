import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  Unsubscribe,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from './config';
import type { Monster, Lesson, QuizQuestion, BossQuestion, MonsterProgress, User } from '@/types';

// ─── Monsters ─────────────────────────────────────────────────────────────────
export async function getMonsters(): Promise<Monster[]> {
  const q = query(collection(db, 'monsters'), orderBy('order'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Monster));
}

export async function getMonster(monsterId: string): Promise<Monster | null> {
  const snap = await getDoc(doc(db, 'monsters', monsterId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Monster;
}

// ─── Lessons ──────────────────────────────────────────────────────────────────
export async function getLessonsForMonster(monsterId: string): Promise<Lesson[]> {
  const q = query(
    collection(db, 'lessons'),
    where('monsterId', '==', monsterId),
    orderBy('order')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Lesson));
}

// ─── Quiz Questions ───────────────────────────────────────────────────────────
export async function getQuizQuestionsForLesson(lessonId: string): Promise<QuizQuestion[]> {
  const q = query(
    collection(db, 'quizQuestions'),
    where('lessonId', '==', lessonId),
    orderBy('order')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as QuizQuestion));
}

// ─── Boss Questions ───────────────────────────────────────────────────────────
export async function getBossQuestionsForMonster(monsterId: string): Promise<BossQuestion[]> {
  const q = query(
    collection(db, 'bossQuestions'),
    where('monsterId', '==', monsterId),
    orderBy('order')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as BossQuestion));
}

// ─── User ─────────────────────────────────────────────────────────────────────
export async function getUserDoc(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return snap.data() as User;
}

export function subscribeToUser(uid: string, callback: (user: User | null) => void): Unsubscribe {
  return onSnapshot(doc(db, 'users', uid), (snap) => {
    callback(snap.exists() ? (snap.data() as User) : null);
  });
}

// ─── User Progress ────────────────────────────────────────────────────────────
export async function getMonsterProgress(uid: string, monsterId: string): Promise<MonsterProgress | null> {
  const snap = await getDoc(doc(db, 'users', uid, 'progress', monsterId));
  if (!snap.exists()) return null;
  return snap.data() as MonsterProgress;
}

export function subscribeToAllProgress(
  uid: string,
  callback: (progress: Record<string, MonsterProgress>) => void
): Unsubscribe {
  return onSnapshot(collection(db, 'users', uid, 'progress'), (snap: QuerySnapshot<DocumentData>) => {
    const map: Record<string, MonsterProgress> = {};
    snap.docs.forEach(d => {
      map[d.id] = d.data() as MonsterProgress;
    });
    callback(map);
  });
}
