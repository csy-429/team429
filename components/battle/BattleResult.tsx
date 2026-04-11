'use client';

import { useRouter } from 'next/navigation';

interface BattleResultProps {
  type: 'victory' | 'defeat';
  expReward?: number;
  monsterName: string;
  onRetry?: () => void;
}

export function BattleResult({ type, expReward, monsterName, onRetry }: BattleResultProps) {
  const router = useRouter();

  if (type === 'victory') {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-8 text-center">
        <div className="text-7xl mb-4 animate-bounce">🏆</div>
        <h2 className="text-3xl font-bold text-yellow-400 mb-2">승리!</h2>
        <p className="text-gray-300 mb-2">{monsterName}을(를) 처치했어요!</p>
        {expReward && (
          <div className="bg-yellow-400/20 border border-yellow-400/40 rounded-2xl px-6 py-3 mb-8">
            <span className="text-yellow-300 font-bold text-xl">+{expReward} EXP</span>
          </div>
        )}
        <button
          onClick={() => router.push('/')}
          className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-2xl text-lg transition"
        >
          지도로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-8 text-center">
      <div className="text-7xl mb-4">💀</div>
      <h2 className="text-3xl font-bold text-red-400 mb-2">패배...</h2>
      <p className="text-gray-400 mb-8">
        더 많이 학습하고 다시 도전해보세요!<br />
        {monsterName}은(는) 아직 살아있어요.
      </p>
      <div className="flex gap-3 w-full max-w-xs">
        <button
          onClick={onRetry}
          className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-2xl transition"
        >
          다시 도전
        </button>
        <button
          onClick={() => router.push('/')}
          className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-3.5 rounded-2xl transition"
        >
          지도로
        </button>
      </div>
    </div>
  );
}
