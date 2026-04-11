'use client';

import { useCallback, useEffect, useReducer, useRef } from 'react';
import { initBattleState, battleReducer } from '@/lib/game/battleEngine';
import type { BossQuestion } from '@/types';

interface UseBattleOptions {
  questions: BossQuestion[];
  monsterHp: number;
  onVictory: () => void;
  onDefeat: () => void;
}

export function useBattle({ questions, monsterHp, onVictory, onDefeat }: UseBattleOptions) {
  const [state, dispatch] = useReducer(battleReducer, initBattleState(questions, monsterHp));

  const victoryCalledRef = useRef(false);
  const defeatCalledRef  = useRef(false);

  useEffect(() => {
    if (state.phase === 'victory' && !victoryCalledRef.current) {
      victoryCalledRef.current = true;
      onVictory();
    }
    if (state.phase === 'defeat' && !defeatCalledRef.current) {
      defeatCalledRef.current = true;
      onDefeat();
    }
  }, [state.phase, onVictory, onDefeat]);

  // 공격/피격 애니메이션 후 다음 문제로 자동 전환 (1.5초)
  useEffect(() => {
    if (state.phase === 'playerAttack' || state.phase === 'monsterAttack') {
      const timer = setTimeout(() => dispatch({ type: 'NEXT_QUESTION' }), 1500);
      return () => clearTimeout(timer);
    }
  }, [state.phase, state.currentQuestionIndex]);

  const startBattle = useCallback(() => dispatch({ type: 'START' }), []);

  const submitAnswer = useCallback((index: number) => {
    if (state.phase !== 'playerTurn') return;
    dispatch({ type: 'SUBMIT_ANSWER', index });
  }, [state.phase]);

  const resetBattle = useCallback(() => {
    victoryCalledRef.current = false;
    defeatCalledRef.current  = false;
    dispatch({ type: 'RESET', questions, monsterHp });
  }, [questions, monsterHp]);

  return { state, startBattle, submitAnswer, resetBattle };
}
