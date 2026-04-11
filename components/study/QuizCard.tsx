'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { ExpPopup } from './ExpPopup';
import type { QuizQuestion } from '@/types';

interface QuizCardProps {
  question: QuizQuestion;
  lessonTitle: string;
  isCompleted: boolean;
  onCorrect: (questionId: string) => void;
}

export function QuizCard({ question, lessonTitle, isCompleted, onCorrect }: QuizCardProps) {
  const [selected, setSelected]   = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const answered    = selected !== null || isCompleted;
  const wasCorrect  = isCompleted ? true : selected === question.correctIndex;

  function handleSelect(i: number) {
    if (answered) return;
    setSelected(i);
    if (i === question.correctIndex) {
      setShowPopup(true);
      onCorrect(question.id);
    }
  }

  function getOptionStyle(i: number) {
    if (!answered) return 'bg-gray-800 border-gray-700 text-white hover:border-gray-500';
    if (i === question.correctIndex) return 'bg-green-900/40 border-green-500 text-green-300';
    if (i === selected) return 'bg-red-900/40 border-red-500 text-red-300';
    return 'bg-gray-800 border-gray-700 text-gray-500';
  }

  return (
    <div className="shorts-slide relative bg-gray-950 flex flex-col justify-center p-5">
      {showPopup && (
        <ExpPopup amount={question.expReward} onDone={() => setShowPopup(false)} />
      )}

      {/* 레슨 태그 */}
      <div className="text-xs text-gray-500 mb-4 text-center">📖 {lessonTitle}</div>

      {/* 문제 */}
      <div className="bg-gray-900 rounded-2xl p-5 mb-5 border border-gray-800">
        <div className="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-wide">Quiz</div>
        <p className="text-white font-semibold text-lg leading-snug">{question.question}</p>
        <div className="text-right mt-2 text-xs text-yellow-400">+{question.expReward} EXP</div>
      </div>

      {/* 선택지 */}
      <div className="space-y-2.5">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={answered}
            className={cn(
              'w-full text-left px-4 py-3.5 rounded-2xl border text-sm font-medium transition active:scale-98',
              getOptionStyle(i)
            )}
          >
            <span className="font-bold mr-2 text-gray-400">
              {['A', 'B', 'C', 'D'][i]}.
            </span>
            {opt}
          </button>
        ))}
      </div>

      {/* 해설 */}
      {answered && (
        <div className={cn(
          'mt-4 p-4 rounded-2xl text-sm',
          wasCorrect ? 'bg-green-900/20 border border-green-800 text-green-300' : 'bg-red-900/20 border border-red-800 text-red-300'
        )}>
          <div className="font-bold mb-1">{wasCorrect ? '✅ 정답!' : '❌ 오답'}</div>
          <p className="text-gray-300">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
