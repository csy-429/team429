'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMonster, getBossQuestionsForMonster, getMonsterProgress } from '@/lib/firebase/firestore';
import { addExp } from '@/lib/game/expSystem';
import { BattleArena } from '@/components/battle/BattleArena';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Monster, BossQuestion } from '@/types';

export default function BattlePage() {
  const { monsterId }    = useParams<{ monsterId: string }>();
  const router           = useRouter();
  const { firebaseUser } = useAuth();
  const { userData }     = useGame();

  const [monster,   setMonster]   = useState<Monster | null>(null);
  const [questions, setQuestions] = useState<BossQuestion[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [blocked,   setBlocked]   = useState(false);

  useEffect(() => {
    if (!firebaseUser || !userData) return;

    async function load() {
      const [m, qs] = await Promise.all([
        getMonster(monsterId),
        getBossQuestionsForMonster(monsterId),
      ]);

      if (!m) { router.replace('/'); return; }

      // 전투 요건 확인
      if (userData!.level < m.requiredLevel || userData!.exp < m.requiredExp) {
        setBlocked(true);
        setMonster(m);
        setLoading(false);
        return;
      }

      setMonster(m);
      setQuestions(qs);
      setLoading(false);
    }

    load();
  }, [monsterId, firebaseUser, userData, router]);

  async function handleVictory() {
    if (!firebaseUser || !monster) return;

    await addExp(firebaseUser.uid, monster.expReward, 'monster_defeat', monster.id);

    const progRef = doc(db, 'users', firebaseUser.uid, 'progress', monsterId);
    await setDoc(
      progRef,
      { defeated: true, defeatedAt: serverTimestamp() },
      { merge: true }
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-4xl animate-spin">⚔️</div>
      </div>
    );
  }

  if (blocked && monster) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-white mb-2">전투 불가</h2>
        <p className="text-gray-400 mb-2">
          {userData && userData.level < monster.requiredLevel
            ? `Lv.${monster.requiredLevel}이 필요해요 (현재 Lv.${userData.level})`
            : `EXP ${monster.requiredExp}이 필요해요`}
        </p>
        <p className="text-gray-600 text-sm mb-8">학습을 통해 경험치를 쌓아보세요!</p>
        <Link
          href={`/monster/${monsterId}/study`}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-2xl transition"
        >
          학습하러 가기
        </Link>
      </div>
    );
  }

  if (!monster || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-8 text-center">
        <div className="text-5xl mb-4">📭</div>
        <p className="text-gray-400">배틀 문제가 없어요</p>
        <Link href="/" className="mt-4 text-indigo-400">지도로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 뒤로가기 버튼 */}
      <div className="fixed top-0 left-0 right-0 z-30 px-4 pt-safe pt-4">
        <Link href={`/monster/${monsterId}`} className="text-white/50 hover:text-white text-2xl">
          ←
        </Link>
      </div>

      <BattleArena
        monster={monster}
        questions={questions}
        onVictory={handleVictory}
      />
    </div>
  );
}
