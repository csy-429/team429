/**
 * Firestore 시드 스크립트
 *
 * 사용법:
 *   1. .env.local에 FIREBASE_ADMIN_CREDENTIAL 설정
 *   2. npm install -D ts-node @types/node firebase-admin
 *   3. npx ts-node --project tsconfig.json scripts/seed.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as admin from 'firebase-admin';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const credential = process.env.FIREBASE_ADMIN_CREDENTIAL
  ? JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIAL)
  : null;

if (!credential) {
  console.error('❌ .env.local에 FIREBASE_ADMIN_CREDENTIAL을 한 줄 JSON으로 입력해주세요.');
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert(credential) });
const db = admin.firestore();

// ─────────────────────────────────────────────────────────────
// 시드 데이터
// ─────────────────────────────────────────────────────────────

const MONSTERS = [
  {
    id: 'fraction-dragon',
    name: '분수 드래곤',
    subject: 'math',
    difficulty: 'easy',
    description: '분수의 기초를 지배하는 드래곤. 덧셈과 곱셈을 마스터해야 쓰러뜨릴 수 있다.',
    spriteUrl: '',
    requiredLevel: 1,
    requiredExp: 0,
    hp: 100,
    expReward: 80,
    lessonIds: ['lesson-fraction-1', 'lesson-fraction-2', 'lesson-fraction-3'],
    order: 1,
  },
  {
    id: 'photosynthesis-phantom',
    name: '광합성 유령',
    subject: 'science',
    difficulty: 'medium',
    description: '태양 에너지로 살아가는 식물의 화신. 광합성 원리를 이해해야 물리칠 수 있다.',
    spriteUrl: '',
    requiredLevel: 2,
    requiredExp: 100,
    hp: 100,
    expReward: 120,
    lessonIds: ['lesson-photo-1', 'lesson-photo-2', 'lesson-photo-3'],
    order: 2,
  },
  {
    id: 'loop-lich',
    name: '루프 리치',
    subject: 'coding',
    difficulty: 'medium',
    description: '무한 반복의 저주를 지닌 언데드 마법사. 반복문을 이해해야 봉인할 수 있다.',
    spriteUrl: '',
    requiredLevel: 2,
    requiredExp: 100,
    hp: 100,
    expReward: 120,
    lessonIds: ['lesson-loop-1', 'lesson-loop-2', 'lesson-loop-3'],
    order: 3,
  },
  {
    id: 'pythagorean-golem',
    name: '피타고라스 골렘',
    subject: 'math',
    difficulty: 'medium',
    description: '직각삼각형의 비밀을 품은 고대 석상. a² + b² = c²을 이해해야 균열을 낼 수 있다.',
    spriteUrl: '',
    requiredLevel: 2,
    requiredExp: 100,
    hp: 100,
    expReward: 120,
    lessonIds: ['lesson-pyth-1', 'lesson-pyth-2', 'lesson-pyth-3'],
    order: 4,
  },
];

const LESSONS = [
  // 분수 드래곤 레슨 (유튜브 Khan Academy Shorts IDs)
  {
    id: 'lesson-fraction-1',
    monsterId: 'fraction-dragon',
    title: '분수란 무엇인가?',
    subject: 'math',
    youtubeVideoId: 'n0FZhQ_GkKw', // Khan Academy: What is a fraction?
    durationSeconds: 180,
    expReward: 20,
    order: 1,
  },
  {
    id: 'lesson-fraction-2',
    monsterId: 'fraction-dragon',
    title: '분수의 덧셈과 뺄셈',
    subject: 'math',
    youtubeVideoId: 'jkMy-whnl4Y', // Khan Academy: Adding fractions
    durationSeconds: 240,
    expReward: 25,
    order: 2,
  },
  {
    id: 'lesson-fraction-3',
    monsterId: 'fraction-dragon',
    title: '분수의 곱셈',
    subject: 'math',
    youtubeVideoId: 'p4G4nQDJwpY', // Khan Academy: Multiplying fractions
    durationSeconds: 200,
    expReward: 25,
    order: 3,
  },
  // 광합성 유령 레슨
  {
    id: 'lesson-photo-1',
    monsterId: 'photosynthesis-phantom',
    title: '광합성이란?',
    subject: 'science',
    youtubeVideoId: 'uixA8ZXx0KU', // Khan Academy: Introduction to photosynthesis
    durationSeconds: 360,
    expReward: 30,
    order: 1,
  },
  {
    id: 'lesson-photo-2',
    monsterId: 'photosynthesis-phantom',
    title: '명반응: 빛 에너지를 화학 에너지로',
    subject: 'science',
    youtubeVideoId: 'GR2GA7chA_c', // Khan Academy: Light reactions
    durationSeconds: 420,
    expReward: 35,
    order: 2,
  },
  {
    id: 'lesson-photo-3',
    monsterId: 'photosynthesis-phantom',
    title: '캘빈 회로: 탄소 고정',
    subject: 'science',
    youtubeVideoId: 'slm6D2VEXYs', // Khan Academy: Calvin cycle
    durationSeconds: 380,
    expReward: 35,
    order: 3,
  },
  // 피타고라스 골렘 레슨
  {
    id: 'lesson-pyth-1',
    monsterId: 'pythagorean-golem',
    title: '피타고라스 정리란?',
    subject: 'math',
    youtubeVideoId: 'AA6RfgP-AHU', // Khan Academy: Introduction to the Pythagorean theorem
    durationSeconds: 280,
    expReward: 25,
    order: 1,
  },
  {
    id: 'lesson-pyth-2',
    monsterId: 'pythagorean-golem',
    title: '피타고라스 정리로 빗변 구하기',
    subject: 'math',
    youtubeVideoId: 'rRmMdVOkRZs', // Khan Academy: Finding hypotenuse
    durationSeconds: 320,
    expReward: 30,
    order: 2,
  },
  {
    id: 'lesson-pyth-3',
    monsterId: 'pythagorean-golem',
    title: '피타고라스 정리 실생활 응용',
    subject: 'math',
    youtubeVideoId: '9Q1HNmcL0UY', // Khan Academy: Pythagorean theorem application
    durationSeconds: 360,
    expReward: 30,
    order: 3,
  },
  // 루프 리치 레슨
  {
    id: 'lesson-loop-1',
    monsterId: 'loop-lich',
    title: '반복문이란?',
    subject: 'coding',
    youtubeVideoId: 'wxds6MAtUcc', // CS concepts: What is a loop
    durationSeconds: 200,
    expReward: 30,
    order: 1,
  },
  {
    id: 'lesson-loop-2',
    monsterId: 'loop-lich',
    title: 'for 반복문',
    subject: 'coding',
    youtubeVideoId: 'D0Ca6GGQXN0', // For loops explained
    durationSeconds: 300,
    expReward: 35,
    order: 2,
  },
  {
    id: 'lesson-loop-3',
    monsterId: 'loop-lich',
    title: 'while 반복문',
    subject: 'coding',
    youtubeVideoId: 'PcGl4BHqJXQ', // While loops explained
    durationSeconds: 280,
    expReward: 35,
    order: 3,
  },
];

const QUIZ_QUESTIONS = [
  // 분수 드래곤 퀴즈
  {
    id: 'quiz-frac-1-1',
    lessonId: 'lesson-fraction-1',
    question: '분수 3/4에서 분모(아랫수)는 무엇인가요?',
    options: ['3', '4', '7', '1'],
    correctIndex: 1,
    explanation: '분모는 전체를 몇 등분했는지 나타내는 아랫수입니다. 3/4에서 분모는 4입니다.',
    expReward: 10,
    order: 1,
  },
  {
    id: 'quiz-frac-1-2',
    lessonId: 'lesson-fraction-1',
    question: '피자 한 판을 8조각으로 나눠 3조각을 먹었다면 먹은 양은?',
    options: ['3/5', '5/8', '3/8', '8/3'],
    correctIndex: 2,
    explanation: '전체 8조각 중 3조각 = 3/8입니다.',
    expReward: 10,
    order: 2,
  },
  {
    id: 'quiz-frac-2-1',
    lessonId: 'lesson-fraction-2',
    question: '1/4 + 1/4 = ?',
    options: ['2/8', '1/2', '2/4', '1/4'],
    correctIndex: 1,
    explanation: '분모가 같으면 분자끼리 더합니다. 1/4 + 1/4 = 2/4 = 1/2입니다.',
    expReward: 12,
    order: 1,
  },
  {
    id: 'quiz-frac-2-2',
    lessonId: 'lesson-fraction-2',
    question: '3/5 - 1/5 = ?',
    options: ['2/10', '4/5', '2/0', '2/5'],
    correctIndex: 3,
    explanation: '분모가 같으면 분자끼리 빼면 됩니다. 3/5 - 1/5 = 2/5.',
    expReward: 12,
    order: 2,
  },
  {
    id: 'quiz-frac-3-1',
    lessonId: 'lesson-fraction-3',
    question: '1/2 × 1/3 = ?',
    options: ['2/6', '1/6', '2/3', '3/2'],
    correctIndex: 1,
    explanation: '분수 곱셈은 분자끼리, 분모끼리 곱합니다. 1×1=1, 2×3=6 → 1/6.',
    expReward: 12,
    order: 1,
  },
  {
    id: 'quiz-frac-3-2',
    lessonId: 'lesson-fraction-3',
    question: '2/3 × 3/4 = ?',
    options: ['5/7', '6/12', '1/2', '6/7'],
    correctIndex: 2,
    explanation: '2×3=6, 3×4=12 → 6/12 = 1/2로 약분됩니다.',
    expReward: 12,
    order: 2,
  },
  // 광합성 유령 퀴즈
  {
    id: 'quiz-photo-1-1',
    lessonId: 'lesson-photo-1',
    question: '광합성의 원료(입력)가 아닌 것은?',
    options: ['이산화탄소', '빛', '물', '산소'],
    correctIndex: 3,
    explanation: '광합성 원료는 CO₂, 물, 빛 에너지입니다. 산소는 부산물(결과물)입니다.',
    expReward: 15,
    order: 1,
  },
  {
    id: 'quiz-photo-1-2',
    lessonId: 'lesson-photo-1',
    question: '광합성은 식물의 어느 세포 소기관에서 일어나나요?',
    options: ['미토콘드리아', '리보솜', '엽록체', '세포핵'],
    correctIndex: 2,
    explanation: '광합성은 엽록소가 있는 엽록체에서 일어납니다.',
    expReward: 15,
    order: 2,
  },
  {
    id: 'quiz-photo-2-1',
    lessonId: 'lesson-photo-2',
    question: '명반응에서 빛 에너지는 무엇으로 전환되나요?',
    options: ['포도당', 'ATP와 NADPH', '이산화탄소', '산소'],
    correctIndex: 1,
    explanation: '명반응에서 빛 에너지는 ATP와 NADPH라는 화학 에너지로 전환됩니다.',
    expReward: 15,
    order: 1,
  },
  {
    id: 'quiz-photo-2-2',
    lessonId: 'lesson-photo-2',
    question: '명반응 과정에서 방출되는 기체는?',
    options: ['이산화탄소', '질소', '수소', '산소'],
    correctIndex: 3,
    explanation: '명반응에서 물이 분해되면서 산소(O₂)가 방출됩니다.',
    expReward: 15,
    order: 2,
  },
  {
    id: 'quiz-photo-3-1',
    lessonId: 'lesson-photo-3',
    question: '캘빈 회로의 최종 산물은?',
    options: ['ATP', '포도당(G3P)', '물', '산소'],
    correctIndex: 1,
    explanation: '캘빈 회로에서 CO₂가 고정되어 G3P(포도당 전구체)가 만들어집니다.',
    expReward: 15,
    order: 1,
  },
  {
    id: 'quiz-photo-3-2',
    lessonId: 'lesson-photo-3',
    question: '캘빈 회로는 어느 단계에서 진행되나요?',
    options: ['명반응', '암반응', '산화적 인산화', '해당과정'],
    correctIndex: 1,
    explanation: '캘빈 회로는 빛이 필요 없는 암반응(스트로마)에서 진행됩니다.',
    expReward: 15,
    order: 2,
  },
  // 피타고라스 골렘 퀴즈
  {
    id: 'quiz-pyth-1-1',
    lessonId: 'lesson-pyth-1',
    question: '피타고라스 정리를 올바르게 나타낸 식은? (c가 빗변)',
    options: ['a + b = c', 'a² + b² = c²', 'a² - b² = c²', 'a × b = c²'],
    correctIndex: 1,
    explanation: '직각삼각형에서 두 직각변의 제곱의 합은 빗변의 제곱과 같습니다: a² + b² = c².',
    expReward: 12,
    order: 1,
  },
  {
    id: 'quiz-pyth-1-2',
    lessonId: 'lesson-pyth-1',
    question: '피타고라스 정리는 어떤 삼각형에서만 성립하나요?',
    options: ['예각삼각형', '둔각삼각형', '직각삼각형', '정삼각형'],
    correctIndex: 2,
    explanation: '피타고라스 정리는 직각(90°)이 있는 직각삼각형에서만 성립합니다.',
    expReward: 12,
    order: 2,
  },
  {
    id: 'quiz-pyth-2-1',
    lessonId: 'lesson-pyth-2',
    question: '직각삼각형에서 두 직각변의 길이가 3, 4일 때 빗변의 길이는?',
    options: ['5', '6', '7', '12'],
    correctIndex: 0,
    explanation: '3² + 4² = 9 + 16 = 25 = 5². 빗변 = 5. (3-4-5 피타고라스 수)',
    expReward: 15,
    order: 1,
  },
  {
    id: 'quiz-pyth-2-2',
    lessonId: 'lesson-pyth-2',
    question: '빗변이 13, 한 직각변이 5인 직각삼각형의 나머지 변의 길이는?',
    options: ['8', '10', '12', '14'],
    correctIndex: 2,
    explanation: '5² + b² = 13² → 25 + b² = 169 → b² = 144 → b = 12.',
    expReward: 15,
    order: 2,
  },
  {
    id: 'quiz-pyth-3-1',
    lessonId: 'lesson-pyth-3',
    question: '가로 6m, 세로 8m인 직사각형 방의 대각선 길이는?',
    options: ['10m', '12m', '14m', '7m'],
    correctIndex: 0,
    explanation: '6² + 8² = 36 + 64 = 100 = 10². 대각선 = 10m.',
    expReward: 15,
    order: 1,
  },
  {
    id: 'quiz-pyth-3-2',
    lessonId: 'lesson-pyth-3',
    question: '5m 사다리를 벽에 세울 때 바닥에서 3m 떨어지면 벽을 몇 m 오를 수 있나요?',
    options: ['2m', '3m', '4m', '5m'],
    correctIndex: 2,
    explanation: '3² + h² = 5² → 9 + h² = 25 → h² = 16 → h = 4m.',
    expReward: 15,
    order: 2,
  },
  // 루프 리치 퀴즈
  {
    id: 'quiz-loop-1-1',
    lessonId: 'lesson-loop-1',
    question: '반복문이 필요한 상황은?',
    options: [
      '변수를 한 번 선언할 때',
      '같은 코드를 여러 번 실행할 때',
      '조건에 따라 분기할 때',
      '함수를 정의할 때',
    ],
    correctIndex: 1,
    explanation: '반복문은 동일한 코드 블록을 여러 번 실행해야 할 때 사용합니다.',
    expReward: 15,
    order: 1,
  },
  {
    id: 'quiz-loop-1-2',
    lessonId: 'lesson-loop-1',
    question: '반복문을 사용하지 않고 "안녕"을 100번 출력하면?',
    options: [
      '더 빠르다',
      '코드가 100줄이 된다',
      '오류가 발생한다',
      '자동으로 반복된다',
    ],
    correctIndex: 1,
    explanation: '반복문 없이 100번 출력하려면 print("안녕")을 100번 써야 해 코드가 매우 길어집니다.',
    expReward: 15,
    order: 2,
  },
  {
    id: 'quiz-loop-2-1',
    lessonId: 'lesson-loop-2',
    question: 'for i in range(5)가 반복하는 횟수는?',
    options: ['4번', '5번', '6번', '무한히'],
    correctIndex: 1,
    explanation: 'range(5)는 0,1,2,3,4로 총 5번 반복합니다.',
    expReward: 15,
    order: 1,
  },
  {
    id: 'quiz-loop-2-2',
    lessonId: 'lesson-loop-2',
    question: 'for 반복문에서 반복 횟수는?',
    options: ['실행 전에 알 수 없다', '항상 무한하다', '미리 정해져 있다', '1번만 실행된다'],
    correctIndex: 2,
    explanation: 'for 반복문은 반복 횟수가 시작 전에 정해져 있습니다.',
    expReward: 15,
    order: 2,
  },
  {
    id: 'quiz-loop-3-1',
    lessonId: 'lesson-loop-3',
    question: 'while 반복문이 종료되려면?',
    options: [
      '항상 10번 실행 후 종료',
      '조건이 False가 될 때',
      '조건이 True가 될 때',
      'break 없이는 종료 불가',
    ],
    correctIndex: 1,
    explanation: 'while 반복문은 조건식이 False가 되면 종료됩니다.',
    expReward: 15,
    order: 1,
  },
  {
    id: 'quiz-loop-3-2',
    lessonId: 'lesson-loop-3',
    question: '무한 루프(infinite loop)가 발생하는 원인은?',
    options: [
      '조건이 항상 True인 채로 업데이트 없음',
      'range()를 사용해서',
      '변수를 초기화해서',
      'break를 사용해서',
    ],
    correctIndex: 0,
    explanation: '조건이 절대 False가 되지 않으면 무한 루프에 빠집니다.',
    expReward: 15,
    order: 2,
  },
];

const BOSS_QUESTIONS = [
  // 분수 드래곤 보스 문제
  {
    id: 'boss-frac-1',
    monsterId: 'fraction-dragon',
    question: '2/3 + 1/4 를 계산하면? (분모를 통분하세요)',
    options: ['3/7', '11/12', '8/12', '3/12'],
    correctIndex: 1,
    explanation: '공통분모 12: 2/3 = 8/12, 1/4 = 3/12 → 8/12 + 3/12 = 11/12.',
    damage: 25,
    order: 1,
  },
  {
    id: 'boss-frac-2',
    monsterId: 'fraction-dragon',
    question: '3/4 × 8/9 = ?',
    options: ['11/13', '24/36', '2/3', '12/36'],
    correctIndex: 2,
    explanation: '3×8=24, 4×9=36 → 24/36 = 2/3으로 약분됩니다.',
    damage: 25,
    order: 2,
  },
  {
    id: 'boss-frac-3',
    monsterId: 'fraction-dragon',
    question: '5/6 - 1/4 = ?',
    options: ['4/2', '7/12', '4/12', '5/12'],
    correctIndex: 1,
    explanation: '공통분모 12: 5/6=10/12, 1/4=3/12 → 10/12-3/12=7/12.',
    damage: 25,
    order: 3,
  },
  {
    id: 'boss-frac-4',
    monsterId: 'fraction-dragon',
    question: '어느 수에 2/5를 곱했더니 4/15가 됐다. 원래 수는?',
    options: ['2/3', '8/75', '2/5', '1/3'],
    correctIndex: 0,
    explanation: '? × 2/5 = 4/15 → ? = 4/15 ÷ 2/5 = 4/15 × 5/2 = 20/30 = 2/3.',
    damage: 25,
    order: 4,
  },
  {
    id: 'boss-frac-5',
    monsterId: 'fraction-dragon',
    question: '1/2 + 1/3 + 1/6 = ?',
    options: ['3/11', '1', '6/11', '5/6'],
    correctIndex: 1,
    explanation: '공통분모 6: 3/6+2/6+1/6 = 6/6 = 1.',
    damage: 25,
    order: 5,
  },
  // 광합성 유령 보스 문제
  {
    id: 'boss-photo-1',
    monsterId: 'photosynthesis-phantom',
    question: '광합성의 화학식에서 생성되는 두 가지 물질은?',
    options: [
      'CO₂와 H₂O',
      '포도당(C₆H₁₂O₆)과 O₂',
      'ATP와 NADPH',
      'CO₂와 ATP',
    ],
    correctIndex: 1,
    explanation: '6CO₂+6H₂O+빛에너지 → C₆H₁₂O₆+6O₂. 생성물은 포도당과 산소입니다.',
    damage: 25,
    order: 1,
  },
  {
    id: 'boss-photo-2',
    monsterId: 'photosynthesis-phantom',
    question: '엽록체에서 명반응이 일어나는 구조물은?',
    options: ['스트로마', '틸라코이드 막', '세포벽', '미토콘드리아 기질'],
    correctIndex: 1,
    explanation: '명반응(빛 반응)은 틸라코이드 막에서, 캘빈 회로는 스트로마에서 일어납니다.',
    damage: 25,
    order: 2,
  },
  {
    id: 'boss-photo-3',
    monsterId: 'photosynthesis-phantom',
    question: '캘빈 회로에서 CO₂ 1분자를 고정하려면 RuBP 분자가 몇 개 필요한가요?',
    options: ['1', '2', '3', '5'],
    correctIndex: 0,
    explanation: 'CO₂ 1분자는 RuBP(5탄소) 1분자와 결합해 6탄소 중간체를 형성합니다.',
    damage: 25,
    order: 3,
  },
  {
    id: 'boss-photo-4',
    monsterId: 'photosynthesis-phantom',
    question: '광합성 속도를 높이는 환경 요인이 아닌 것은?',
    options: ['빛 세기 증가', 'CO₂ 농도 증가', '적정 온도 유지', '산소 농도 증가'],
    correctIndex: 3,
    explanation: '산소 농도 증가는 광합성 속도를 높이지 않습니다. 오히려 광호흡을 촉진할 수 있습니다.',
    damage: 25,
    order: 4,
  },
  {
    id: 'boss-photo-5',
    monsterId: 'photosynthesis-phantom',
    question: '식물이 광합성으로 만든 포도당의 주요 용도가 아닌 것은?',
    options: ['에너지원 (호흡)', '셀룰로오스 합성', '광합성 자체 연료', '전분 저장'],
    correctIndex: 2,
    explanation: '포도당은 에너지원·구조물·저장에 쓰이지만, 광합성의 원료는 CO₂와 물입니다.',
    damage: 25,
    order: 5,
  },
  // 피타고라스 골렘 보스 문제
  {
    id: 'boss-pyth-1',
    monsterId: 'pythagorean-golem',
    question: '두 직각변이 각각 8과 15인 직각삼각형의 빗변 길이는?',
    options: ['16', '17', '18', '23'],
    correctIndex: 1,
    explanation: '8² + 15² = 64 + 225 = 289 = 17². 빗변 = 17.',
    damage: 25,
    order: 1,
  },
  {
    id: 'boss-pyth-2',
    monsterId: 'pythagorean-golem',
    question: '빗변 26, 한 직각변 10인 직각삼각형의 나머지 변의 길이는?',
    options: ['20', '22', '24', '28'],
    correctIndex: 2,
    explanation: '10² + b² = 26² → 100 + b² = 676 → b² = 576 → b = 24.',
    damage: 25,
    order: 2,
  },
  {
    id: 'boss-pyth-3',
    monsterId: 'pythagorean-golem',
    question: '다음 세 수 중 피타고라스 수(직각삼각형의 세 변)가 아닌 것은?',
    options: ['3, 4, 5', '5, 12, 13', '6, 8, 10', '4, 6, 8'],
    correctIndex: 3,
    explanation: '4²+6²=16+36=52 ≠ 8²=64. 나머지는 모두 피타고라스 수입니다.',
    damage: 25,
    order: 3,
  },
  {
    id: 'boss-pyth-4',
    monsterId: 'pythagorean-golem',
    question: '정사각형의 한 변이 1일 때, 대각선 길이를 올바르게 표현한 것은?',
    options: ['1', '√2', '2', '√3'],
    correctIndex: 1,
    explanation: '1² + 1² = 2 → 대각선 = √2. 정사각형 대각선 = 한 변 × √2.',
    damage: 25,
    order: 4,
  },
  {
    id: 'boss-pyth-5',
    monsterId: 'pythagorean-golem',
    question: '좌표평면에서 점 A(0,0)과 B(6,8) 사이의 거리는?',
    options: ['8', '10', '12', '14'],
    correctIndex: 1,
    explanation: '거리 = √(6²+8²) = √(36+64) = √100 = 10. 피타고라스 정리의 좌표 적용.',
    damage: 25,
    order: 5,
  },
  // 루프 리치 보스 문제
  {
    id: 'boss-loop-1',
    monsterId: 'loop-lich',
    question: 'range(2, 10, 2)가 생성하는 숫자는?',
    options: ['2,4,6,8,10', '2,4,6,8', '2,3,4,...,9', '0,2,4,6,8'],
    correctIndex: 1,
    explanation: 'range(시작, 끝(미포함), 간격): 2,4,6,8 — 10은 포함되지 않습니다.',
    damage: 25,
    order: 1,
  },
  {
    id: 'boss-loop-2',
    monsterId: 'loop-lich',
    question: 'while 반복문에서 break의 역할은?',
    options: [
      '현재 반복만 건너뜀',
      '반복문을 즉시 종료',
      '조건을 True로 만듦',
      '반복 횟수를 1 증가',
    ],
    correctIndex: 1,
    explanation: 'break는 반복문을 즉시 탈출합니다. continue는 현재 반복만 건너뜁니다.',
    damage: 25,
    order: 2,
  },
  {
    id: 'boss-loop-3',
    monsterId: 'loop-lich',
    question: '다음 코드의 출력 결과는?\n\nfor i in range(3):\n    print(i * 2)',
    options: ['0 2 4', '1 3 5', '0 1 2', '2 4 6'],
    correctIndex: 0,
    explanation: 'range(3)은 0,1,2. 각각 ×2 하면 0,2,4.',
    damage: 25,
    order: 3,
  },
  {
    id: 'boss-loop-4',
    monsterId: 'loop-lich',
    question: '중첩 반복문(nested loop)에서 바깥 루프 1회당 안쪽 루프는 몇 번 실행?',
    options: ['1번', '바깥 루프 횟수만큼', '전체 횟수', '안쪽 루프 전체'],
    correctIndex: 3,
    explanation: '바깥 루프 1회마다 안쪽 루프 전체가 처음부터 끝까지 실행됩니다.',
    damage: 25,
    order: 4,
  },
  {
    id: 'boss-loop-5',
    monsterId: 'loop-lich',
    question: '1부터 100까지의 합을 구하는 for 루프에서 적절한 range()는?',
    options: ['range(100)', 'range(1, 100)', 'range(1, 101)', 'range(0, 100)'],
    correctIndex: 2,
    explanation: '100을 포함하려면 range(1, 101)이 필요합니다. range(1,100)은 99까지만.',
    damage: 25,
    order: 5,
  },
];

// ─────────────────────────────────────────────────────────────
// 시드 실행
// ─────────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱 시드 시작...\n');
  const batch = db.batch();

  // 몬스터
  for (const monster of MONSTERS) {
    const { id, ...data } = monster;
    batch.set(db.collection('monsters').doc(id), data);
    console.log(`  ✅ monster: ${monster.name}`);
  }

  // 레슨
  for (const lesson of LESSONS) {
    const { id, ...data } = lesson;
    batch.set(db.collection('lessons').doc(id), data);
    console.log(`  ✅ lesson: ${lesson.title}`);
  }

  // 퀴즈 문제
  for (const q of QUIZ_QUESTIONS) {
    const { id, ...data } = q;
    batch.set(db.collection('quizQuestions').doc(id), data);
    console.log(`  ✅ quiz: ${q.id}`);
  }

  // 보스 문제
  for (const q of BOSS_QUESTIONS) {
    const { id, ...data } = q;
    batch.set(db.collection('bossQuestions').doc(id), data);
    console.log(`  ✅ boss: ${q.id}`);
  }

  await batch.commit();
  console.log('\n🎉 시드 완료!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ 시드 실패:', err);
  process.exit(1);
});
