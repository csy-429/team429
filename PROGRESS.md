# EduShorts — 개발 진행 현황

> 최종 업데이트: 2026-04-13

---

## 프로젝트 개요

수학·과학·코딩 학습 콘텐츠를 게이미피케이션으로 제공하는 쇼츠 플랫폼.
사용자는 몬스터를 사냥하기 위해 유튜브 쇼츠로 개념을 학습하고, 퀴즈로 이해도를 확인한 뒤, EXP/레벨이 충분하면 보스 문제 배틀로 몬스터를 처치한다.

**Stack**: Next.js 16 (App Router, TypeScript) + Firebase (Auth, Firestore) + YouTube IFrame API + Tailwind CSS

---

## 구현 완료 목록

### 기반 인프라
- [x] Next.js 16 App Router 프로젝트 생성 (TypeScript, Tailwind)
- [x] Firebase 설정 (`lib/firebase/config.ts`) — 클라이언트 SSR 방지 처리 (ClientProviders + `ssr: false`)
- [x] Firebase Auth — Google 로그인, 이메일/비밀번호 가입·로그인
- [x] Firestore 보안 규칙 (`firestore.rules`) — 본인 데이터 전용 쓰기, 게임 콘텐츠 읽기 전용
- [x] 환경 변수 설정 완료 (`NEXT_PUBLIC_FIREBASE_*`, `FIREBASE_ADMIN_CREDENTIAL`)
- [x] 시드 스크립트 (`scripts/seed.ts`) — 몬스터 3개, 레슨 9개, 퀴즈 18개, 보스문제 15개

### 라우팅 구조
```
/                          → 로그인 상태에 따라 /map 또는 /login으로 리디렉션
/login                     → Google + 이메일 로그인 페이지
/map                       → 월드맵 (과목 구역 선택: 수학/과학/코딩)
/map/[subject]             → 과목별 몬스터 핀 맵
/monster/[id]              → 몬스터 상세 패널
/monster/[id]/study        → 쇼츠 피드 + 퀴즈
/monster/[id]/battle       → 보스 배틀 아레나
/profile                   → 유저 스탯 + EXP 바
```

### 인증 / 세션
- [x] Google OAuth 로그인 (`signInWithPopup`)
- [x] 이메일/비밀번호 로그인·가입
- [x] 첫 로그인 시 Firestore `users/{uid}` 문서 자동 생성 (level:1, exp:0)
- [x] `AuthContext` — 앱 전체 인증 상태 실시간 구독
- [x] 미인증 시 `/login` 리디렉션 (게임 레이아웃 게이트)

### 월드맵 / 몬스터 맵
- [x] `WorldMap` — 과목 구역 카드 (수학/과학/코딩) → `/map/[subject]`로 이동
- [x] `MonsterMap` — 과목 맵에 핀(Pin) UI로 몬스터 배치
  - 클릭 시 말풍선 툴팁 (몬스터 이름, 난이도, "입장하기" 버튼)
  - 잠금 상태 (레벨 부족 시 🔒 표시)
  - 처치 완료 시 핀 회색 처리
- [x] `MonsterDetailPanel` — 슬라이드업 시트 (학습 목록, 요건, EXP 보상, 학습/전투 버튼)
- [x] `MonsterCard` — 리스트 뷰용 카드 (진행 바, 잠금 상태, 별점)
- [x] 과목별 배경 이미지 지원 (`/maps/math.png` 등 — 이미지 파일 추가 필요)

### EXP / 레벨 시스템
- [x] `expSystem.ts` — Firestore 트랜잭션으로 원자적 EXP 업데이트
  - `addExp(uid, amount, type, sourceId)` → 레벨업 여부 반환
  - `getLevelFromExp`, `getExpProgress` 유틸
- [x] `GameContext` — 유저 데이터 실시간 구독 (`onSnapshot`)
- [x] EXP 이벤트 로그 (`users/{uid}/expEvents`) — append-only
- [x] 레벨 임계값: `[0, 100, 250, 500, 900, 1400, 2100, 3000, 4200, 6000]`

### 쇼츠 피드 (핵심 학습 루프)
- [x] `ShortsFeed` — CSS `scroll-snap-type: y mandatory` 수직 스냅 스크롤
- [x] `VideoCard` — YouTube IFrame API 임베드
  - 85% 이상 시청 감지 (2초 폴링) → EXP 자동 지급
  - 영상 종료 이벤트(`onStateChange`) 백업 감지
- [x] `QuizCard` — 4지선다 퀴즈
  - 정답 시 EXP 지급 + 해설 표시
  - 오답 시 정답 하이라이트 + 해설 표시
- [x] `ExpPopup` — EXP 획득 시 플로팅 애니메이션 (+XX EXP ⭐)
- [x] Firestore 진행 상황 자동 저장 (`watchedLessonIds`, `completedQuizIds`)
- [x] 모든 레슨 완료 시 "지도로 돌아가기" 슬라이드 표시

### 배틀 시스템
- [x] `battleEngine.ts` — Reducer 기반 배틀 상태 머신
  - 페이즈: `intro → playerTurn → playerAttack/monsterAttack → victory/defeat`
  - 문제 배열 셔플, 소진 시 재순환
- [x] `useBattle` 훅 — 상태 관리 + 1.5초 자동 페이즈 전환
- [x] 배틀 진입 게이트 — 레벨/EXP 요건 미충족 시 차단 화면
- [x] `BattleArena` — 전투 화면
  - 정답 시 몬스터 빨간 피격 + 흔들림 (`animate-monster-hit`)
  - 오답 시 화면 전체 빨간 노이즈 오버레이 (`animate-red-noise`)
- [x] `MonsterHealthBar` / `PlayerHealthBar` (하트 3개)
- [x] `BattleResult` — 승리(EXP 지급 + confetti), 패배(다시 도전) 화면
- [x] 승리 시 Firestore `MonsterProgress.defeated = true` 기록

### 프로필
- [x] `PlayerStats` — 레벨 배지, EXP 바, 4가지 통계 그리드
- [x] `ExpBar` — 현재 레벨 내 EXP 진행률 시각화
- [x] 로그아웃 버튼

### 데이터 모델 (Firestore)
```
/users/{uid}                          유저 프로필 (level, exp)
/users/{uid}/progress/{monsterId}     몬스터별 학습·배틀 진행 상황
/users/{uid}/expEvents/{id}           EXP 로그 (append-only)
/monsters/{id}                        몬스터 정의
/lessons/{id}                         유튜브 레슨
/quizQuestions/{id}                   레슨 퀴즈 (4지선다)
/bossQuestions/{id}                   배틀 보스 문제
```

Monster 타입에 `position?: { x: number; y: number }` 추가됨 — 핀 맵 좌표용

---

## 미완성 / 추가 개발 필요 항목

### 즉시 필요 (기능 동작을 위해)

| 항목 | 설명 |
|------|------|
| **Firestore Rules 배포** | `firebase deploy --only firestore:rules` |
| **시드 데이터 실행** | `FIREBASE_ADMIN_CREDENTIAL='...' npx ts-node scripts/seed.ts` |
| **몬스터 position 좌표 추가** | 시드 스크립트의 각 몬스터에 `position: { x, y }` 추가 (핀 위치) |
| **과목별 배경 이미지** | `public/maps/math.png`, `science.png`, `coding.png` 추가 |
| **Firebase Authentication 제공업체 활성화** | Console → Authentication → Google + 이메일/비밀번호 활성화 |

### 기능 개선

| 항목 | 현재 상태 | 개선 방향 |
|------|-----------|-----------|
| **레벨업 연출** | 구현 없음 | 레벨업 시 전체 화면 축하 모달 (confetti + 레벨업 사운드) |
| **몬스터 스프라이트** | 이모지 폴백 | 실제 몬스터 이미지 (`public/monsters/*.png` 또는 Firebase Storage) |
| **쇼츠 피드 자동 스크롤** | 수동 스크롤 | 영상 완료 / 퀴즈 제출 후 자동으로 다음 슬라이드 이동 |
| **배틀 BGM / 효과음** | 없음 | Howler.js 또는 Web Audio API로 효과음 추가 |
| **오프라인 지원** | 없음 | PWA + Firebase 오프라인 캐시 |
| **관리자 콘텐츠 등록** | 시드 스크립트만 | `/admin` 페이지 or Firebase Console에서 직접 등록 |
| **스트릭(연속 정답) 보너스** | `streakCount` 추적만 | 3연속 정답 시 EXP 1.5배 보너스 |

### 콘텐츠 확장

| 항목 | 현재 | 목표 |
|------|------|------|
| 몬스터 수 | 3개 (수학/과학/코딩 각 1개) | 과목별 5개 이상 (난이도 단계별) |
| 레슨 수 | 9개 (몬스터당 3개) | 몬스터당 5개 이상 |
| 유튜브 영상 | Khan Academy 링크 (영어) | 한국어 교육 채널 영상으로 교체 |
| 과목 | 3개 | 역사, 영어, 물리 추가 가능 |

### UX 개선

| 항목 | 설명 |
|------|------|
| **로딩 스켈레톤** | 몬스터 맵, 피드 로딩 중 스켈레톤 UI |
| **에러 바운더리** | Firebase 오류 시 사용자 친화적 에러 화면 |
| **빈 상태 (Empty State)** | 레슨 없는 몬스터, 진행 없는 프로필 등 |
| **뒤로가기 처리** | 배틀 중 나가기 시 확인 다이얼로그 |
| **다크모드만 지원** | 현재 다크 전용 — 라이트모드 지원 불필요하면 유지 |

---

## 배포 방법

### Firebase Hosting (권장)

```bash
# 1. firebase-tools 설치
npm install -g firebase-tools
firebase login

# 2. Next.js 자동 감지 모드 활성화
firebase experiments:enable webframeworks

# 3. 프로젝트 초기화 (이미 Firebase 프로젝트와 연결된 경우)
firebase init hosting
# → "Use an existing project" → edushorts-364c2 선택
# → 프레임워크 자동 감지 → Next.js 선택

# 4. 배포
firebase deploy
```

### Vercel (대안)

```bash
npm install -g vercel
vercel --prod
# → 환경 변수는 Vercel 대시보드에서 추가
```

---

## 환경 변수 현황

| 변수 | 상태 |
|------|------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ 설정됨 |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ 설정됨 |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ 설정됨 |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | ✅ 설정됨 |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ 설정됨 |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ✅ 설정됨 |
| `FIREBASE_ADMIN_CREDENTIAL` | ✅ 설정됨 (시드 스크립트용) |

---

## 다음 실행 순서

```bash
# 1. 시드 데이터 Firestore에 업로드
npm install -D ts-node firebase-admin @types/node
npx ts-node --project tsconfig.json scripts/seed.ts

# 2. Firestore 보안 규칙 배포
firebase deploy --only firestore:rules

# 3. 로컬 개발 서버 실행
npm run dev
# → http://localhost:3000

# 4. 배포
firebase deploy   # 또는 vercel --prod
```
