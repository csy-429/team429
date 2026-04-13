'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { SUBJECT_COLORS, DIFFICULTY_STARS, DIFFICULTY_LABELS } from '@/constants/game';
import type { Monster, MonsterProgress, User } from '@/types';

interface MonsterDetailPanelProps {
  monster: Monster;
  lessonTitles: string[];
  progress?: MonsterProgress;
  userData: User | null;
  onClose: () => void;
}

export function MonsterDetailPanel({
  monster,
  lessonTitles,
  progress,
  userData,
  onClose,
}: MonsterDetailPanelProps) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);

  const meetsLevel = userData ? userData.level >= monster.requiredLevel : false;
  const meetsExp   = userData ? userData.exp   >= monster.requiredExp   : false;
  const canBattle  = meetsLevel && meetsExp;

  const stars = DIFFICULTY_STARS[monster.difficulty];
  const subjectColor = SUBJECT_COLORS[monster.subject];

  // 바깥 클릭 닫기
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end">
      <div
        ref={panelRef}
        className="w-full bg-gray-900 rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto border-t border-gray-800"
      >
        {/* 드래그 핸들 */}
        <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto mb-5" />

        {/* 헤더 */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-20 h-20 rounded-2xl bg-gray-800 flex items-center justify-center text-5xl shrink-0">
            {monster.spriteUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={monster.spriteUrl} alt={monster.name} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              monster.subject === 'math' ? '🐉' : monster.subject === 'science' ? '👻' : '💀'
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full text-white', subjectColor.bg)}>
                {monster.subject === 'math' ? '수학' : monster.subject === 'science' ? '과학' : '코딩'}
              </span>
              <span className="text-xs text-gray-500">{DIFFICULTY_LABELS[monster.difficulty]}</span>
            </div>
            <h2 className="text-xl font-bold text-white">{monster.name}</h2>
            <div className="flex gap-0.5 mt-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} className={i < stars ? 'text-yellow-400' : 'text-gray-700'}>★</span>
              ))}
            </div>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-5">{monster.description}</p>

        {/* 전투 요건 */}
        <div className="bg-gray-800 rounded-2xl p-4 mb-5">
          <h3 className="text-sm font-bold text-gray-300 mb-3">⚔️ 전투 요건</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">필요 레벨</span>
              <span className={cn('font-bold', meetsLevel ? 'text-green-400' : 'text-red-400')}>
                Lv.{monster.requiredLevel}
                {userData && (
                  <span className="text-gray-500 font-normal ml-1">(현재 {userData.level})</span>
                )}
              </span>
            </div>
            {monster.requiredExp > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">필요 EXP</span>
                <span className={cn('font-bold', meetsExp ? 'text-green-400' : 'text-red-400')}>
                  {monster.requiredExp.toLocaleString()}
                  {userData && (
                    <span className="text-gray-500 font-normal ml-1">
                      (현재 {userData.exp.toLocaleString()})
                    </span>
                  )}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">보상 EXP</span>
              <span className="text-yellow-400 font-bold">+{monster.expReward} EXP</span>
            </div>
          </div>
        </div>

        {/* 레슨 목록 */}
        {lessonTitles.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-300 mb-3">📚 학습 목록</h3>
            <div className="space-y-2">
              {lessonTitles.map((title, i) => {
                const lessonId = monster.lessonIds[i];
                const watched = progress?.watchedLessonIds?.includes(lessonId) ?? false;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3"
                  >
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0',
                      watched ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-500'
                    )}>
                      {watched ? '✓' : i + 1}
                    </div>
                    <span className={cn('text-sm', watched ? 'text-green-400' : 'text-gray-300')}>
                      {title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA 버튼 */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => router.push(`/monster/${monster.id}/study`)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-2xl transition"
          >
            📖 학습하기
          </button>
          <button
            onClick={() => canBattle && router.push(`/monster/${monster.id}/battle`)}
            disabled={!canBattle}
            className={cn(
              'font-semibold py-3.5 rounded-2xl transition',
              canBattle
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            )}
          >
            ⚔️ 전투하기
          </button>
        </div>
        {!canBattle && (
          <p className="text-center text-xs text-gray-600 mt-2">
            {!meetsLevel ? `Lv.${monster.requiredLevel}이 되면 전투 가능` : `EXP ${monster.requiredExp}이 필요해요`}
          </p>
        )}
      </div>
    </div>
  );
}
