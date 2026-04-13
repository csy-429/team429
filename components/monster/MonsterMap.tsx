'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMonsters, getLessonsForMonster } from '@/lib/firebase/firestore';
import { MonsterDetailPanel } from './MonsterDetailPanel';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useGame } from '@/contexts/GameContext';
import type { Monster } from '@/types';

const SUBJECT_LABEL: Record<string, string> = {
  math: '수학',
  science: '과학',
  coding: '코딩',
};

export function MonsterMap({ defaultSubject }: { defaultSubject: string }) {
  const { userData } = useGame();
  const { progress } = useUserProgress();
  const router = useRouter();

  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [selected, setSelected] = useState<Monster | null>(null);
  const [tooltipMonster, setTooltipMonster] = useState<Monster | null>(null);
  const [lessonTitles, setLessonTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMonsters().then(data => {
      setMonsters(data);
      setLoading(false);
    });
  }, []);

  function handlePinClick(monster: Monster) {
    if (tooltipMonster?.id === monster.id) {
      setTooltipMonster(null);
      return;
    }
    setTooltipMonster(monster);
  }

  async function handleEnter(monster: Monster) {
    setTooltipMonster(null);
    setSelected(monster);
    const lessons = await getLessonsForMonster(monster.id);
    setLessonTitles(lessons.map(l => l.title));
  }

  const filtered = monsters.filter(m => m.subject === defaultSubject);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-4xl animate-bounce">🐉</div>
      </div>
    );
  }

  return (
    <>
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 pt-6 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-gray-300 hover:text-white text-xl">
            ←
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {SUBJECT_LABEL[defaultSubject]} 구역
            </h1>
            <p className="text-sm text-gray-400">몬스터를 클릭해 도전하세요</p>
          </div>
        </div>
        {userData && (
          <div className="text-right">
            <div className="text-xs text-gray-400">레벨</div>
            <div className="text-2xl font-bold text-indigo-400">Lv.{userData.level}</div>
          </div>
        )}
      </div>

      {/* 맵 영역 */}
      <div
        className="relative w-full"
        style={{ height: 'calc(100vh - 100px)' }}
        onClick={() => setTooltipMonster(null)}
      >
        {filtered.map(monster => {
          const isCleared = progress[monster.id]?.defeated;
          const isLocked = userData && monster.requiredLevel > userData.level;
          const isActive = tooltipMonster?.id === monster.id;

          return (
            <div
              key={monster.id}
              className="absolute"
              style={{
                left: `${monster.position?.x ?? 50}%`,
                top: `${monster.position?.y ?? 50}%`,
                transform: 'translate(-50%, -100%)',
                zIndex: isActive ? 20 : 10,
              }}
              onClick={e => {
                e.stopPropagation();
                handlePinClick(monster);
              }}
            >
              {/* 말풍선 툴팁 */}
              {isActive && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-44 bg-gray-900 border border-gray-700 rounded-xl p-3 shadow-xl">
                  <div className="text-xs text-gray-400 mb-0.5">{SUBJECT_LABEL[monster.subject]}</div>
                  <div className="font-bold text-white text-sm mb-1">{monster.name}</div>
                  <div className="text-xs text-gray-400 mb-2">{monster.difficulty}</div>
                  {isLocked ? (
                    <div className="text-xs text-gray-500">
                      🔒 Lv.{monster.requiredLevel} 필요
                    </div>
                  ) : (
                    <button
                      onClick={e => { e.stopPropagation(); handleEnter(monster); }}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-1.5 rounded-lg transition"
                    >
                      입장하기 →
                    </button>
                  )}
                  {/* 말풍선 꼬리 */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
                    style={{
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '6px solid #374151',
                    }}
                  />
                </div>
              )}

              {/* 핀 */}
              <div className={`flex flex-col items-center cursor-pointer transition-transform duration-150 ${isActive ? 'scale-125' : 'hover:scale-110'}`}>
                <div className={`
                  w-14 h-14 rounded-full rounded-br-none rotate-45
                  flex items-center justify-center shadow-lg border-2
                  ${isCleared
                    ? 'bg-gray-600 border-gray-500'
                    : isLocked
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-red-500 border-red-300'}
                `}>
                  <span className="text-2xl -rotate-45">
                    {isLocked ? '🔒' : '👾'}
                  </span>
                </div>
                <div className="w-2 h-2 bg-black/30 rounded-full mt-0.5 blur-sm" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 상세 패널 */}
      {selected && (
        <MonsterDetailPanel
          monster={selected}
          lessonTitles={lessonTitles}
          progress={progress[selected.id]}
          userData={userData}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}