'use client';

import { getExpProgress } from '@/lib/game/expSystem';
import { MAX_LEVEL } from '@/constants/game';

interface ExpBarProps {
  exp: number;
  level: number;
}

export function ExpBar({ exp, level }: ExpBarProps) {
  const { currentLevelExp, neededExp, percentage } = getExpProgress(exp);
  const isMaxLevel = level >= MAX_LEVEL;

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>EXP</span>
        {isMaxLevel ? (
          <span className="text-yellow-400 font-bold">MAX</span>
        ) : (
          <span>{currentLevelExp.toLocaleString()} / {neededExp.toLocaleString()}</span>
        )}
      </div>
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
