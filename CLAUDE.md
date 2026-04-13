# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

---

## Commands

```bash
npm run dev       # 개발 서버 (http://localhost:3000)
npm run build     # 프로덕션 빌드 (빌드 성공 여부 최종 확인용)
npx tsc --noEmit  # 타입 체크 단독 실행

# Firestore 보안 규칙 배포
firebase deploy --only firestore:rules

# 시드 데이터 업로드 (scripts/는 tsconfig에서 제외됨, tsx 사용)
npx tsx scripts/seed.ts
```

> `scripts/` 디렉터리는 `tsconfig.json`의 `exclude`에 포함되어 있어 `tsc`로 검사되지 않는다.

---

## Architecture

### 핵심 데이터 흐름

```
Firebase Auth
  └─ AuthContext (contexts/AuthContext.tsx)
       └─ GameContext (contexts/GameContext.tsx)  ← Firestore onSnapshot으로 User 실시간 구독
            └─ 각 페이지 / 훅
```

모든 Firebase 초기화는 `lib/firebase/config.ts` 한 곳에서만 수행한다.  
`auth`와 `db`는 이 파일에서만 export되며, 다른 모든 파일은 이를 import해 사용한다.

**SSR 주의**: Firebase Client SDK는 브라우저 전용이다.  
`app/layout.tsx`는 `ClientProviders`(동적 import + `ssr: false`)로 Firebase 초기화가 빌드 타임에 실행되는 것을 막는다.  
Firebase를 사용하는 모든 페이지에는 `export const dynamic = 'force-dynamic'`이 필요하다.

---

### 라우팅 구조

```
app/
  page.tsx                          → 로그인 상태 분기 (→/map 또는 →/login)
  (auth)/login/                     → 인증 없이 접근 가능
  (game)/layout.tsx                 → 인증 게이트 + BottomNav (미인증 시 →/login)
  (game)/page.tsx                   → redirect('/map') — 라우트 충돌 방지용 (삭제 금지)
  (game)/map/                       → WorldMap: 과목 구역 선택 (수학/과학/코딩 카드)
  (game)/map/[subject]/             → MonsterMap: 핀 기반 몬스터 배치 (배경: /maps/{subject}.png)
  (game)/monster/[monsterId]/       → MonsterDetailPanel
  (game)/monster/[monsterId]/study/ → ShortsFeed (YouTube + 퀴즈)
  (game)/monster/[monsterId]/battle/→ BattleArena
  (game)/profile/                   → PlayerStats + EXP 바
```

`(auth)`, `(game)` 은 URL에 영향을 주지 않는 Route Group이다.

**`app/(game)/page.tsx`는 반드시 유지해야 한다.**  
`app/page.tsx`와 `app/(game)/page.tsx`는 둘 다 `/`로 매핑되어 충돌이 발생할 수 있다.  
`(game)/page.tsx`에서 `redirect('/map')`을 수행함으로써 이 충돌을 우회한다.  
이 파일을 삭제하면 Next.js 빌드 에러가 발생한다.

**맵 2단계 구조**

```
/map            → WorldMap (components/monster/WorldMap.tsx)
                  과목 카드 클릭 → /map/[subject]

/map/[subject]  → SubjectMapPage (app/(game)/map/[subject]/page.tsx)
                  배경: public/maps/{subject}.png
                  <MonsterMap defaultSubject={subject} /> 렌더링
```

`MonsterMap` 컴포넌트는 `defaultSubject: string` prop을 받아 해당 과목의 몬스터만 핀으로 표시한다.

---

### Firestore 컬렉션 구조

| 컬렉션 | 쓰기 권한 |
|--------|-----------|
| `/users/{uid}` | 본인만 |
| `/users/{uid}/progress/{monsterId}` | 본인만 (upsert, `setDoc + merge: true`) |
| `/users/{uid}/expEvents/{id}` | 본인 create 전용 (update/delete 불가) |
| `/monsters`, `/lessons`, `/quizQuestions`, `/bossQuestions` | 인증된 유저 read-only |

**EXP 업데이트는 반드시 `lib/game/expSystem.ts`의 `addExp()`를 통해서만 해야 한다.**  
내부적으로 Firestore 트랜잭션으로 `users/{uid}.exp`와 `.level`을 원자적으로 갱신하고, `expEvents` 로그를 append한다.

---

### 게임 핵심 로직

**EXP / 레벨** (`lib/game/expSystem.ts`, `constants/game.ts`)
- 레벨 임계값: `LEVEL_EXP_THRESHOLDS = [0, 100, 250, 500, 900, 1400, 2100, 3000, 4200, 6000]`
- `addExp(uid, amount, type, sourceId)` → `{ newExp, newLevel, leveledUp }` 반환

**배틀 엔진** (`lib/game/battleEngine.ts`)
- 순수 함수 reducer(`battleReducer`) + `initBattleState`로 구성
- 페이즈 순서: `intro → playerTurn → playerAttack|monsterAttack → victory|defeat`
- 문제를 모두 소진하면 재순환 (`wrappedIndex = nextIndex % questions.length`)
- 실제 페이즈 전환 타이머(1.5초)는 `hooks/useBattle.ts`에서 관리

**배틀 애니메이션** (`app/globals.css`, `components/battle/BattleArena.tsx`)  
`AttackAnimation` 컴포넌트는 현재 `return null`(빈 껍데기)이다. 애니메이션은 `BattleArena`에서 CSS 클래스로 직접 적용한다:
- 정답(플레이어 공격): 몬스터 div에 `animate-monster-hit` → 빨간 피격 + 흔들림
- 오답(몬스터 공격): 화면 전체 오버레이 div에 `animate-red-noise` → 빨간 노이즈 플래시

모든 `@keyframes`는 `globals.css`에 정의되어 있다.

**영상 완료 감지** (`hooks/useVideoCompletion.ts`)
- YouTube IFrame API를 동적 로드 (스크립트 중복 방지)
- 2초 폴링으로 `getCurrentTime() / getDuration() >= 0.85` 감지 (상수: `VIDEO_WATCH_THRESHOLD`)
- `onStateChange(ENDED)` 이벤트도 백업으로 리스닝

---

### Firestore 진행 상황 저장 패턴

`ShortsFeed`에서 영상 완료 또는 퀴즈 정답 시:

```ts
await setDoc(
  doc(db, 'users', uid, 'progress', monsterId),
  { watchedLessonIds: arrayUnion(lessonId), ... },
  { merge: true }   // ← 항상 merge, 덮어쓰기 금지
);
```

---

### Monster 타입 확장 주의

`types/index.ts`의 `Monster` 인터페이스에는 `position?: { x: number; y: number }`가 있다.  
핀 맵(`MonsterMap`)에서 `monster.position?.x`로 CSS `left/top`을 계산한다.  
시드 데이터에서 이 값을 채워야 핀이 올바른 위치에 표시된다.

---

### Firestore 데이터 방어적 접근

`MonsterProgress`의 `watchedLessonIds`, `completedQuizIds`는 문서가 처음 생성되기 전에는 존재하지 않을 수 있다.  
이 배열 필드에 접근할 때는 항상 optional chaining을 사용해야 한다:

```ts
progress?.watchedLessonIds?.includes(lessonId) ?? false
progress?.completedQuizIds?.length ?? 0
monster.lessonIds?.length ?? 0
```

---

### Firebase Hosting 배포

Next.js를 Firebase Hosting에 배포할 때는 Web Frameworks 실험 기능이 필요하다:

```bash
firebase experiments:enable webframeworks
firebase init hosting   # 프레임워크 자동 감지 → Next.js 선택
firebase deploy
```

---

### 콘텐츠 추가 방법

몬스터·레슨·퀴즈는 모두 `scripts/seed.ts`에서 정의한 후 `npx tsx scripts/seed.ts`로 Firestore에 업로드한다.  
`FIREBASE_ADMIN_CREDENTIAL` 환경 변수(서비스 계정 JSON)가 `.env.local`에 설정되어 있어야 한다.

몬스터를 추가할 때 반드시 포함해야 할 필드:
- `position: { x: number, y: number }` — 핀 맵 좌표 (백분율, 0~100). 없으면 기본값 50%로 겹침
- `subject`: `'math' | 'science' | 'coding'` — `/map/[subject]` 라우트와 매핑됨

과목을 새로 추가하려면 `WorldMap.tsx`의 `SUBJECTS` 배열, `/map/[subject]/page.tsx`의 `VALID_SUBJECTS`, `BG` 맵 세 곳을 모두 수정해야 한다.
