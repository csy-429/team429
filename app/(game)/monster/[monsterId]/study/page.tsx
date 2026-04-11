'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getLessonsForMonster,
  getQuizQuestionsForLesson,
  getMonsterProgress,
} from '@/lib/firebase/firestore';
import { ShortsFeed } from '@/components/study/ShortsFeed';
import { useAuth } from '@/contexts/AuthContext';
import type { FeedItem, MonsterProgress, Lesson } from '@/types';

export default function StudyPage() {
  const { monsterId } = useParams<{ monsterId: string }>();
  const router        = useRouter();
  const { firebaseUser } = useAuth();

  const [items,    setItems]    = useState<FeedItem[]>([]);
  const [progress, setProgress] = useState<MonsterProgress | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [lessonCount, setLessonCount] = useState(0);

  useEffect(() => {
    if (!firebaseUser) return;

    async function load() {
      const [lessons, prog] = await Promise.all([
        getLessonsForMonster(monsterId),
        getMonsterProgress(firebaseUser!.uid, monsterId),
      ]);
      setLessonCount(lessons.length);
      setProgress(prog);

      // 레슨마다 퀴즈를 붙여 FeedItem 배열 구성
      const feed: FeedItem[] = [];
      for (const lesson of lessons) {
        feed.push({ type: 'video', lesson });
        const quizzes = await getQuizQuestionsForLesson(lesson.id);
        quizzes.forEach(q => feed.push({ type: 'quiz', question: q, lessonId: lesson.id }));
      }
      setItems(feed);
      setLoading(false);
    }

    load();
  }, [monsterId, firebaseUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-4xl animate-bounce">📺</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 상단 헤더 (고정) */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 pt-safe pt-4 pb-3 bg-gradient-to-b from-black/70 to-transparent">
        <Link href={`/monster/${monsterId}`} className="text-white/70 hover:text-white text-2xl leading-none">
          ←
        </Link>
        <span className="text-sm text-white/70">
          레슨 {lessonCount}개
        </span>
        <div className="w-6" />
      </div>

      {items.length === 0 ? (
        <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 p-8">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-center">아직 등록된 레슨이 없어요</p>
        </div>
      ) : (
        <ShortsFeed
          monsterId={monsterId}
          items={items}
          progress={progress}
          onAllLessonsWatched={() => router.push('/')}
        />
      )}
    </div>
  );
}
