'use client';

import { useCallback } from 'react';
import { useBattle } from '@/hooks/useBattle';
import { MonsterHealthBar } from './MonsterHealthBar';
import { PlayerHealthBar } from './PlayerHealthBar';
import { BattleQuestion } from './BattleQuestion';
import { AttackAnimation } from './AttackAnimation';
import { BattleResult } from './BattleResult';
import type { Monster, BossQuestion } from '@/types';

interface BattleArenaProps {
  monster: Monster;
  questions: BossQuestion[];
  onVictory: () => void;
}

export function BattleArena({ monster, questions, onVictory }: BattleArenaProps) {
  const { state, startBattle, submitAnswer, resetBattle } = useBattle({
    questions,
    monsterHp: monster.hp,
    onVictory,
    onDefeat: () => {},
  });

  const currentQuestion = state.questions[state.currentQuestionIndex];

  if (state.phase === 'victory') {
    return (
      <BattleResult
        type="victory"
        expReward={monster.expReward}
        monsterName={monster.name}
      />
    );
  }

  if (state.phase === 'defeat') {
    return (
      <BattleResult
        type="defeat"
        monsterName={monster.name}
        onRetry={resetBattle}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black flex flex-col">
      {/* HP 바 영역 */}
      <div className="px-4 pt-14 pb-3 bg-black/40 border-b border-gray-800">
        <MonsterHealthBar
          current={state.monsterHp}
          max={state.monsterMaxHp}
          monsterName={monster.name}
        />
      </div>

      {/* 몬스터 + 애니메이션 */}
      <div className="relative flex-1 flex items-center justify-center py-8">
        <div className={`text-center transition-all ${
          state.phase === 'monsterAttack' ? 'animate-shake' : ''
        }`}>
          <div className="text-[8rem] leading-none mb-2">
            {monster.spriteUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={monster.spriteUrl}
                alt={monster.name}
                className="w-40 h-40 object-contain mx-auto"
              />
            ) : (
              monster.subject === 'math' ? '🐉' : monster.subject === 'science' ? '👻' : '💀'
            )}
          </div>
          <p className="text-gray-500 text-sm">{monster.name}</p>
        </div>

        <AttackAnimation
          type="player"
          visible={state.phase === 'playerAttack'}
        />
        <AttackAnimation
          type="monster"
          visible={state.phase === 'monsterAttack'}
        />
      </div>

      {/* 플레이어 HP */}
      <div className="px-4 pb-2">
        <PlayerHealthBar current={state.playerHp} max={state.playerMaxHp} />
      </div>

      {/* 문제 영역 */}
      <div className="px-4 pb-8">
        {state.phase === 'intro' ? (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-white mb-2">{monster.name}</h2>
            <p className="text-gray-400 mb-6">{monster.description}</p>
            <button
              onClick={startBattle}
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-2xl text-lg transition"
            >
              ⚔️ 전투 시작!
            </button>
          </div>
        ) : currentQuestion ? (
          <BattleQuestion
            question={currentQuestion}
            phase={state.phase}
            onAnswer={submitAnswer}
          />
        ) : null}
      </div>
    </div>
  );
}
