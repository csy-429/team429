'use client';

import { cn } from '@/lib/utils/cn';
import type { BossQuestion, BattlePhase } from '@/types';

interface BattleQuestionProps {
  question: BossQuestion;
  phase: BattlePhase;
  onAnswer: (index: number) => void;
}

export function BattleQuestion({ question, phase, onAnswer }: BattleQuestionProps) {
  const disabled   = phase !== 'playerTurn';
  const answered   = phase === 'playerAttack' || phase === 'monsterAttack';

  function getStyle(i: number) {
    if (!answered) {
      return disabled
        ? 'bg-gray-800 border-gray-700 text-gray-500'
        : 'bg-gray-800 border-gray-700 text-white hover:border-indigo-500 active:scale-98';
    }
    if (i === question.correctIndex) return 'bg-green-900/40 border-green-500 text-green-300';
    return 'bg-gray-800 border-gray-700 text-gray-600';
  }

  return (
    <div className="w-full">
      <div className="bg-gray-800/80 rounded-2xl p-4 mb-4 border border-gray-700">
        <div className="text-xs text-red-400 font-bold mb-2 uppercase tracking-wide">
          ⚔️ Boss Question — {question.damage} 데미지
        </div>
        <p className="text-white font-semibold leading-snug">{question.question}</p>
      </div>

      <div className="space-y-2.5">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => !disabled && onAnswer(i)}
            disabled={disabled}
            className={cn(
              'w-full text-left px-4 py-3.5 rounded-2xl border text-sm font-medium transition',
              getStyle(i)
            )}
          >
            <span className="font-bold mr-2 text-gray-500">{['A', 'B', 'C', 'D'][i]}.</span>
            {opt}
          </button>
        ))}
      </div>

      {/* 해설 */}
      {answered && (
        <div className="mt-3 p-3 bg-gray-800/60 rounded-xl text-xs text-gray-400">
          {question.explanation}
        </div>
      )}
    </div>
  );
}
