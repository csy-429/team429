'use client';

import { ExpBar } from './ExpBar';
import type { User, MonsterProgress } from '@/types';

interface PlayerStatsProps {
  userData: User;
  progressMap: Record<string, MonsterProgress>;
}

export function PlayerStats({ userData, progressMap }: PlayerStatsProps) {
  const defeatedCount     = Object.values(progressMap).filter(p => p.defeated).length;
  const watchedLessons   = Object.values(progressMap).reduce((acc, p) => acc + (p.watchedLessonIds ?? []).length, 0);
  const completedQuizzes = Object.values(progressMap).reduce((acc, p) => acc + (p.completedQuizIds ?? []).length, 0);

  const stats = [
    { icon: '☠️', label: '처치한 몬스터', value: defeatedCount },
    { icon: '📺', label: '시청한 레슨',   value: watchedLessons },
    { icon: '✅', label: '맞힌 퀴즈',     value: completedQuizzes },
    { icon: '⭐', label: '총 EXP',        value: userData.exp.toLocaleString() },
  ];

  return (
    <div>
      {/* 아바타 + 레벨 */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gray-800 border-2 border-indigo-500 flex items-center justify-center text-4xl overflow-hidden">
            {userData.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={userData.photoURL} alt="" className="w-full h-full object-cover" />
            ) : '🧙'}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full px-2 py-0.5 text-xs font-bold text-white border-2 border-gray-950">
            Lv.{userData.level}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{userData.displayName}</h2>
          <p className="text-sm text-gray-500">{userData.email}</p>
        </div>
      </div>

      {/* EXP 바 */}
      <div className="bg-gray-900 rounded-2xl p-4 mb-4 border border-gray-800">
        <ExpBar exp={userData.exp} level={userData.level} />
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(stat => (
          <div key={stat.label} className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
