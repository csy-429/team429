'use client';

import { useRouter } from 'next/navigation';

const SUBJECTS = [
  {
    key: 'math',
    label: '수학',
    emoji: '🐉',
    description: '분수, 피타고라스...',
    color: 'from-indigo-900 to-indigo-700',
    border: 'border-indigo-500',
    glow: 'shadow-indigo-500/50',
    position: 'top-[20%] left-[20%]',
  },
  {
    key: 'science',
    label: '과학',
    emoji: '👻',
    description: '광합성, 생태계...',
    color: 'from-emerald-900 to-emerald-700',
    border: 'border-emerald-500',
    glow: 'shadow-emerald-500/50',
    position: 'top-[20%] right-[20%]',
  },
  {
    key: 'coding',
    label: '코딩',
    emoji: '💀',
    description: '루프, 조건문...',
    color: 'from-purple-900 to-purple-700',
    border: 'border-purple-500',
    glow: 'shadow-purple-500/50',
    position: 'bottom-[25%] left-[35%]',
  },
] as const;

export function WorldMap() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-gray-950 overflow-hidden flex flex-col">
      {/* 배경 격자 */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* 헤더 */}
      <div className="relative z-10 px-6 pt-8 pb-4">
        <h1 className="text-3xl font-bold text-white">🗺️ 월드맵</h1>
        <p className="text-gray-400 text-sm mt-1">탐험할 구역을 선택하세요</p>
      </div>

      {/* 카드 목록 */}
      <div className="relative z-10 flex flex-col gap-4 px-6 pb-10 mt-4">
        {SUBJECTS.map((subject) => (
          <button
            key={subject.key}
            onClick={() => router.push(`/map/${subject.key}`)}
            className={`
              w-full text-left rounded-2xl border ${subject.border}
              bg-gradient-to-br ${subject.color}
              shadow-lg ${subject.glow}
              p-5 flex items-center gap-4
              hover:scale-[1.02] active:scale-[0.98]
              transition-transform duration-150
            `}
          >
            <div className="text-5xl">{subject.emoji}</div>
            <div>
              <div className="text-xl font-bold text-white">{subject.label} 구역</div>
              <div className="text-sm text-gray-300 mt-0.5">{subject.description}</div>
            </div>
            <div className="ml-auto text-gray-400 text-xl">→</div>
          </button>
        ))}
      </div>
    </div>
  );
}