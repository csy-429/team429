'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { VideoCard } from './VideoCard';
import { QuizCard } from './QuizCard';
import { addExp } from '@/lib/game/expSystem';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/contexts/AuthContext';
import type { FeedItem, MonsterProgress } from '@/types';

interface ShortsFeedProps {
  monsterId: string;
  items: FeedItem[];
  progress: MonsterProgress | null;
  onAllLessonsWatched: () => void;
}

export function ShortsFeed({ monsterId, items, progress, onAllLessonsWatched }: ShortsFeedProps) {
  const { firebaseUser } = useAuth();
  const router = useRouter();

  const videoItems = items.filter(i => i.type === 'video');
  const watchedIds = progress?.watchedLessonIds ?? [];
  const allWatched = videoItems.length > 0 && videoItems.every(
    i => i.type === 'video' && watchedIds.includes(i.lesson.id)
  );

  const handleVideoComplete = useCallback(async (lessonId: string) => {
    if (!firebaseUser) return;

    const progRef = doc(db, 'users', firebaseUser.uid, 'progress', monsterId);
    const lessonItem = items.find(i => i.type === 'video' && i.lesson.id === lessonId);
    if (!lessonItem || lessonItem.type !== 'video') return;

    // EXP 지급
    await addExp(firebaseUser.uid, lessonItem.lesson.expReward, 'video_watch', lessonId);

    // 진행 상황 업데이트 (upsert)
    await setDoc(
      progRef,
      {
        monsterId,
        watchedLessonIds: arrayUnion(lessonId),
        completedQuizIds: arrayUnion(),
        battleAttempts: 0,
        defeated: false,
        defeatedAt: null,
      },
      { merge: true }
    );
  }, [firebaseUser, monsterId, items]);

  const handleQuizCorrect = useCallback(async (questionId: string) => {
    if (!firebaseUser) return;

    const quizItem = items.find(i => i.type === 'quiz' && i.question.id === questionId);
    if (!quizItem || quizItem.type !== 'quiz') return;

    // EXP 지급
    await addExp(firebaseUser.uid, quizItem.question.expReward, 'quiz_correct', questionId);

    // 진행 상황 업데이트
    const progRef = doc(db, 'users', firebaseUser.uid, 'progress', monsterId);
    await setDoc(
      progRef,
      {
        monsterId,
        watchedLessonIds: arrayUnion(),
        completedQuizIds: arrayUnion(questionId),
        battleAttempts: 0,
        defeated: false,
        defeatedAt: null,
      },
      { merge: true }
    );
  }, [firebaseUser, monsterId, items]);

  return (
    <div className="shorts-feed">
      {items.map((item, idx) => {
        if (item.type === 'video') {
          return (
            <VideoCard
              key={item.lesson.id}
              lesson={item.lesson}
              isWatched={watchedIds.includes(item.lesson.id)}
              onComplete={handleVideoComplete}
            />
          );
        } else {
          const lessonItem = items.slice(0, idx).reverse().find(i => i.type === 'video');
          const lessonTitle = lessonItem?.type === 'video' ? lessonItem.lesson.title : '';
          return (
            <QuizCard
              key={item.question.id}
              question={item.question}
              lessonTitle={lessonTitle}
              isCompleted={progress?.completedQuizIds.includes(item.question.id) ?? false}
              onCorrect={handleQuizCorrect}
            />
          );
        }
      })}

      {/* 모든 레슨 완료 시 배틀 유도 */}
      {allWatched && (
        <div className="shorts-slide flex flex-col items-center justify-center bg-gray-950 p-6">
          <div className="text-6xl mb-4">⚔️</div>
          <h2 className="text-2xl font-bold text-white mb-2">학습 완료!</h2>
          <p className="text-gray-400 text-center mb-8">
            이제 몬스터와 전투할 준비가 됐어요.<br />
            지도로 돌아가 배틀을 시작하세요!
          </p>
          <button
            onClick={() => router.push('/map')}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-2xl text-lg transition"
          >
            지도로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
}
