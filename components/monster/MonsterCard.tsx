'use client';

import { cn } from '@/lib/utils/cn';
import { SUBJECT_COLORS, DIFFICULTY_STARS, DIFFICULTY_LABELS } from '@/constants/game';
import type { Monster, MonsterProgress, User } from '@/types';

interface MonsterCardProps {
  monster: Monster;
  progress?: MonsterProgress;
  userData: User | null;
  onClick: () => void;
}

export function MonsterCard({ monster, progress, userData, onClick }: MonsterCardProps) {
  const isDefeated = progress?.defeated ?? false;
  const meetsLevel = userData ? userData.level >= monster.requiredLevel : false;
  const meetsExp   = userData ? userData.exp   >= monster.requiredExp   : false;
  const isUnlocked = meetsLevel && meetsExp;

  const subjectColor = SUBJECT_COLORS[monster.subject];
  const stars        = DIFFICULTY_STARS[monster.difficulty];

  // 레슨 진행률
  const watchedCount = progress?.watchedLessonIds.length ?? 0;
  const totalLessons = monster.lessonIds?.length ?? 0;
  const studyPct     = totalLessons > 0 ? (watchedCount / totalLessons) * 100 : 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative w-full rounded-2xl border p-4 text-left transition active:scale-95',
        isDefeated
          ? 'bg-gray-800 border-yellow-500/40 opacity-70'
          : isUnlocked
          ? 'bg-gray-800 border-gray-700 hover:border-gray-500'
          : 'bg-gray-900 border-gray-800 opacity-60'
      )}
    >
      {/* 정복 배지 */}
      {isDefeated && (
        <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full w-7 h-7 flex items-center justify-center text-sm">
          ✓
        </div>
      )}

      {/* 잠금 아이콘 */}
      {!isUnlocked && (
        <div className="absolute top-3 right-3 text-gray-600 text-lg">🔒</div>
      )}

      {/* 몬스터 이미지 */}
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-xl bg-gray-700 flex items-center justify-center text-4xl shrink-0 overflow-hidden">
          {monster.spriteUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={monster.spriteUrl} alt={monster.name} className="w-full h-full object-cover" />
          ) : (
            monster.subject === 'math'    ? '🐉' :
            monster.subject === 'science' ? '👻' : '💀'
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', subjectColor.bg, 'text-white')}>
              {monster.subject === 'math' ? '수학' : monster.subject === 'science' ? '과학' : '코딩'}
            </span>
          </div>
          <h3 className="font-bold text-white truncate">{monster.name}</h3>
          <div className="flex items-center gap-1 mt-0.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className={i < stars ? 'text-yellow-400' : 'text-gray-700'}>★</span>
            ))}
            <span className="text-xs text-gray-500 ml-1">{DIFFICULTY_LABELS[monster.difficulty]}</span>
          </div>
        </div>
      </div>

      {/* 요건 / 진행률 */}
      {!isUnlocked ? (
        <div className="mt-3 text-xs text-gray-500 space-y-0.5">
          {!meetsLevel && <div>Lv.{monster.requiredLevel} 필요 (현재 Lv.{userData?.level ?? 1})</div>}
          {!meetsExp   && <div>{monster.requiredExp.toLocaleString()} EXP 필요</div>}
        </div>
      ) : totalLessons > 0 ? (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>학습 진행도</span>
            <span>{watchedCount}/{totalLessons}</span>
          </div>
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{ width: `${studyPct}%` }}
            />
          </div>
        </div>
      ) : null}
    </button>
  );
}
