'use client';

import { useState, useEffect } from 'react';
import { getMonsters, getLessonsForMonster } from '@/lib/firebase/firestore';
import { MonsterCard } from './MonsterCard';
import { MonsterDetailPanel } from './MonsterDetailPanel';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useGame } from '@/contexts/GameContext';
import type { Monster } from '@/types';

const SUBJECT_TABS = [
  { key: 'all',     label: '전체' },
  { key: 'math',    label: '수학' },
  { key: 'science', label: '과학' },
  { key: 'coding',  label: '코딩' },
] as const;

type SubjectTab = (typeof SUBJECT_TABS)[number]['key'];

export function MonsterMap() {
  const { userData } = useGame();
  const { progress } = useUserProgress();

  const [monsters, setMonsters]           = useState<Monster[]>([]);
  const [activeTab, setActiveTab]         = useState<SubjectTab>('all');
  const [selected, setSelected]           = useState<Monster | null>(null);
  const [lessonTitles, setLessonTitles]   = useState<string[]>([]);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    getMonsters().then(data => {
      setMonsters(data);
      setLoading(false);
    });
  }, []);

  async function handleSelectMonster(monster: Monster) {
    setSelected(monster);
    const lessons = await getLessonsForMonster(monster.id);
    setLessonTitles(lessons.map(l => l.title));
  }

  const filtered = activeTab === 'all'
    ? monsters
    : monsters.filter(m => m.subject === activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-4xl animate-bounce">🐉</div>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 pt-6 pb-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-white">몬스터 사냥터</h1>
            <p className="text-sm text-gray-500">학습하고 몬스터를 처치하세요</p>
          </div>
          {userData && (
            <div className="text-right">
              <div className="text-xs text-gray-500">레벨</div>
              <div className="text-2xl font-bold text-indigo-400">Lv.{userData.level}</div>
            </div>
          )}
        </div>

        {/* 탭 */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {SUBJECT_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition ${
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 몬스터 그리드 */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <div className="text-5xl mb-3">🏜️</div>
            <p>등록된 몬스터가 없어요</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filtered.map(monster => (
              <MonsterCard
                key={monster.id}
                monster={monster}
                progress={progress[monster.id]}
                userData={userData}
                onClick={() => handleSelectMonster(monster)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 디테일 패널 */}
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
