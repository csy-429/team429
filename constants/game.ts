export const LEVEL_EXP_THRESHOLDS = [
  0,     // Level 1
  100,   // Level 2
  250,   // Level 3
  500,   // Level 4
  900,   // Level 5
  1400,  // Level 6
  2100,  // Level 7
  3000,  // Level 8
  4200,  // Level 9
  6000,  // Level 10
];

export const MAX_LEVEL = 10;

// 영상의 이 비율 이상 시청 시 완료로 처리
export const VIDEO_WATCH_THRESHOLD = 0.85;

// 배틀 시 플레이어 초기 목숨 수
export const PLAYER_INITIAL_LIVES = 3;

// 과목별 색상
export const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  math:    { bg: 'bg-blue-500',   text: 'text-blue-500',   border: 'border-blue-500' },
  science: { bg: 'bg-green-500',  text: 'text-green-500',  border: 'border-green-500' },
  coding:  { bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-500' },
};

export const SUBJECT_LABELS: Record<string, string> = {
  math:    '수학',
  science: '과학',
  coding:  '코딩',
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  easy:   '쉬움',
  medium: '보통',
  hard:   '어려움',
  boss:   '보스',
};

export const DIFFICULTY_STARS: Record<string, number> = {
  easy:   1,
  medium: 2,
  hard:   3,
  boss:   4,
};
