import { PLAYER_INITIAL_LIVES } from '@/constants/game';
import type { BattleState, BattlePhase, BossQuestion } from '@/types';

export function initBattleState(questions: BossQuestion[], monsterHp: number): BattleState {
  // 질문 배열 셔플
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return {
    phase: 'intro',
    monsterHp,
    monsterMaxHp: monsterHp,
    playerHp: PLAYER_INITIAL_LIVES,
    playerMaxHp: PLAYER_INITIAL_LIVES,
    currentQuestionIndex: 0,
    questions: shuffled,
    answerResult: null,
    streakCount: 0,
  };
}

export type BattleAction =
  | { type: 'START' }
  | { type: 'SUBMIT_ANSWER'; index: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'RESET'; questions: BossQuestion[]; monsterHp: number };

export function battleReducer(state: BattleState, action: BattleAction): BattleState {
  switch (action.type) {
    case 'START':
      return { ...state, phase: 'playerTurn' };

    case 'SUBMIT_ANSWER': {
      const question = state.questions[state.currentQuestionIndex];
      const isCorrect = action.index === question.correctIndex;

      if (isCorrect) {
        const newMonsterHp = Math.max(0, state.monsterHp - question.damage);
        const nextPhase: BattlePhase = newMonsterHp <= 0 ? 'victory' : 'playerAttack';
        return {
          ...state,
          phase: nextPhase,
          monsterHp: newMonsterHp,
          answerResult: 'correct',
          streakCount: state.streakCount + 1,
        };
      } else {
        const newPlayerHp = state.playerHp - 1;
        const nextPhase: BattlePhase = newPlayerHp <= 0 ? 'defeat' : 'monsterAttack';
        return {
          ...state,
          phase: nextPhase,
          playerHp: newPlayerHp,
          answerResult: 'incorrect',
          streakCount: 0,
        };
      }
    }

    case 'NEXT_QUESTION': {
      if (state.phase === 'victory' || state.phase === 'defeat') return state;
      const nextIndex = state.currentQuestionIndex + 1;
      // 문제를 모두 소진했지만 몬스터 HP가 남은 경우 → 첫 문제부터 재순환
      const wrappedIndex = nextIndex % state.questions.length;
      return {
        ...state,
        phase: 'playerTurn',
        currentQuestionIndex: wrappedIndex,
        answerResult: null,
      };
    }

    case 'RESET':
      return initBattleState(action.questions, action.monsterHp);

    default:
      return state;
  }
}
