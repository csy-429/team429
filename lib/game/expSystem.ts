import {
  doc,
  runTransaction,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { LEVEL_EXP_THRESHOLDS, MAX_LEVEL } from '@/constants/game';
import type { ExpEventType } from '@/types';

export function getLevelFromExp(exp: number): number {
  let level = 1;
  for (let i = 1; i < LEVEL_EXP_THRESHOLDS.length; i++) {
    if (exp >= LEVEL_EXP_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return Math.min(level, MAX_LEVEL);
}

export function getExpForNextLevel(level: number): number {
  if (level >= MAX_LEVEL) return 0;
  return LEVEL_EXP_THRESHOLDS[level]; // threshold for level+1
}

export function getExpProgress(exp: number): {
  currentLevelExp: number;
  neededExp: number;
  percentage: number;
  level: number;
} {
  const level = getLevelFromExp(exp);
  if (level >= MAX_LEVEL) {
    return { currentLevelExp: exp, neededExp: 0, percentage: 100, level };
  }
  const currentFloor = LEVEL_EXP_THRESHOLDS[level - 1];
  const nextFloor    = LEVEL_EXP_THRESHOLDS[level];
  const currentLevelExp = exp - currentFloor;
  const neededExp       = nextFloor - currentFloor;
  const percentage      = Math.min(100, Math.floor((currentLevelExp / neededExp) * 100));
  return { currentLevelExp, neededExp, percentage, level };
}

export async function addExp(
  uid: string,
  amount: number,
  type: ExpEventType,
  sourceId: string
): Promise<{ newExp: number; newLevel: number; leveledUp: boolean }> {
  const userRef = doc(db, 'users', uid);

  const result = await runTransaction(db, async (tx) => {
    const snap = await tx.get(userRef);
    if (!snap.exists()) throw new Error('User not found');

    const data = snap.data();
    const oldExp   = data.exp as number;
    const oldLevel = data.level as number;
    const newExp   = oldExp + amount;
    const newLevel = getLevelFromExp(newExp);

    tx.update(userRef, { exp: newExp, level: newLevel });
    return { newExp, newLevel, leveledUp: newLevel > oldLevel };
  });

  // expEvents는 트랜잭션 밖에서 append
  await addDoc(collection(db, 'users', uid, 'expEvents'), {
    type,
    sourceId,
    amount,
    createdAt: serverTimestamp(),
  });

  return result;
}
