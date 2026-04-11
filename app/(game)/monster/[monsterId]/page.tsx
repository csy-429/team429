'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMonster, getLessonsForMonster, getMonsterProgress } from '@/lib/firebase/firestore';
import { MonsterDetailPanel } from '@/components/monster/MonsterDetailPanel';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';
import type { Monster, MonsterProgress } from '@/types';

export default function MonsterDetailPage() {
  const { monsterId }    = useParams<{ monsterId: string }>();
  const router           = useRouter();
  const { firebaseUser } = useAuth();
  const { userData }     = useGame();

  const [monster,      setMonster]      = useState<Monster | null>(null);
  const [lessonTitles, setLessonTitles] = useState<string[]>([]);
  const [progress,     setProgress]     = useState<MonsterProgress | undefined>(undefined);

  useEffect(() => {
    if (!firebaseUser) return;
    async function load() {
      const [m, lessons, prog] = await Promise.all([
        getMonster(monsterId),
        getLessonsForMonster(monsterId),
        getMonsterProgress(firebaseUser!.uid, monsterId),
      ]);
      if (!m) { router.replace('/'); return; }
      setMonster(m);
      setLessonTitles(lessons.map(l => l.title));
      setProgress(prog ?? undefined);
    }
    load();
  }, [monsterId, firebaseUser, router]);

  if (!monster) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-4xl animate-spin">⚔️</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="fixed top-0 left-0 right-0 z-30 px-4 pt-safe pt-4">
        <Link href="/" className="text-white/50 hover:text-white text-2xl">←</Link>
      </div>
      <MonsterDetailPanel
        monster={monster}
        lessonTitles={lessonTitles}
        progress={progress}
        userData={userData}
        onClose={() => router.push('/')}
      />
    </div>
  );
}
