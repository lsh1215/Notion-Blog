---
title: AI 워크플로우 시스템 아키텍처
type: plan
status: draft
date: 2026-02-26
---

# AI 워크플로우 시스템 아키텍처

## 문제

AI에게 코드를 작성시키면 3가지 문제가 반복된다:
1. **규칙 무시**: 매뉴얼을 줘도 읽지 않거나 무시한다
2. **기억 상실**: 대화가 길어지면 뭘 하고 있었는지 잊는다
3. **자기 검증 실패**: "다 했습니다"라고 하지만 실수투성이다

## 해결: 4개 시스템

```
┌─────────────────────────────────────────────────────┐
│                  사용자가 프롬프트 입력                 │
└──────────────────────┬──────────────────────────────┘
                       ▼
        ┌──────────────────────────┐
        │  ① 자동 매뉴얼 시스템      │  UserPromptSubmit 훅
        │  프롬프트 분석 → 스킬 주입   │  → 키워드/의도/경로 매칭
        └──────────────┬───────────┘  → 관련 스킬 강제 로딩
                       ▼
        ┌──────────────────────────┐
        │  ② 작업 기억 시스템        │  /project:start-task 커맨드
        │  계획서 + 맥락노트 + 체크   │  → .tasks/current/ 에 문서 생성
        └──────────────┬───────────┘  → 매 턴마다 체크리스트 갱신
                       ▼
        ┌──────────────────────────┐
        │      AI가 코드 작성        │
        └──────────────┬───────────┘
                       ▼
        ┌──────────────────────────┐
        │  ③ 자동 품질 검사 시스템    │  Stop 훅
        │  수정 내역 기록 + 셀프체크   │  → 빠뜨린 항목 리마인드
        └──────────────┬───────────┘  → 체크리스트 업데이트 강제
                       ▼
        ┌──────────────────────────┐
        │  ④ 전문 에이전트 시스템     │  /project:review 커맨드
        │  역할별 AI 팀원 검토       │  → 코드리뷰/보안/테스트 분리
        └──────────────────────────┘
```

---

## 디렉토리 구조

```
Notion-Blog/
├── .claude/
│   ├── CLAUDE.md                    # 프로젝트 규칙 (항상 로딩됨)
│   ├── settings.json                # 훅 설정
│   └── commands/                    # 슬래시 커맨드 (/project:xxx)
│       ├── start-task.md            # 작업 시작 → 기억 문서 생성
│       ├── check.md                 # 셀프 품질 검사
│       └── review.md               # 코드 리뷰 요청
│
├── skills/                          # ① 스킬 매뉴얼 (버전 관리됨)
│   ├── index.md                     # 마스터 인덱스 (훅이 먼저 읽는 파일)
│   ├── frontend/
│   │   ├── index.md                 # 프론트엔드 목차
│   │   └── chapters/
│   │       ├── components.md        # 컴포넌트 규칙
│   │       ├── styling.md           # 스타일링 규칙
│   │       └── nextjs.md            # Next.js 규칙
│   ├── backend/
│   │   ├── index.md
│   │   └── chapters/
│   │       ├── api-design.md
│   │       ├── error-handling.md
│   │       └── security.md
│   └── common/
│       ├── index.md
│       └── chapters/
│           ├── git.md
│           ├── testing.md
│           └── naming.md
│
├── scripts/                         # 훅 스크립트
│   └── hooks/
│       ├── skill-activator.sh       # ① 프롬프트 분석 → 스킬 주입
│       └── quality-check.sh         # ③ 작업 완료 시 품질 체크
│
├── .tasks/                          # ② 작업 기억 (gitignored)
│   └── current/
│       ├── plan.md                  # 설계도
│       ├── context.md               # 시방서
│       └── checklist.md             # 공정표
│
├── docs/                            # 프로젝트 문서
│   ├── plans/
│   ├── brainstorms/
│   ├── specs/
│   └── solutions/
│
└── frontend/                        # 프론트엔드 (Next.js)
    ├── src/                         # 소스 코드
    ├── public/                      # 정적 파일
    ├── package.json
    └── next.config.ts
```

---

## 시스템 1: 자동 매뉴얼 (스킬 자동 활성화)

### 스킬 파일 구조

**`skills/index.md`** (마스터 인덱스):
```markdown
# Skills Index

## 활성화 규칙
| 스킬 | 키워드 | 파일 경로 패턴 | 의도 |
|------|--------|---------------|------|
| frontend | component, page, layout, ui, css, tailwind | src/app/**, src/components/** | UI 작업 |
| backend | api, notion, fetch, server, database | src/lib/**, src/app/api/** | 서버 작업 |
| common/git | commit, branch, merge, pr | - | git 작업 |
| common/testing | test, spec, jest, vitest | **/*.test.*, **/*.spec.* | 테스트 작업 |
```

**`skills/frontend/index.md`** (프론트엔드 목차):
```markdown
# Frontend Skill

이 스킬의 모든 규칙을 따라야 합니다.

## 지금 작업에 해당하는 챕터만 읽으세요:
- 컴포넌트 작업 → Read skills/frontend/chapters/components.md
- 스타일링 작업 → Read skills/frontend/chapters/styling.md
- Next.js 라우팅/SSR → Read skills/frontend/chapters/nextjs.md
```

**`skills/frontend/chapters/components.md`** (상세 챕터):
```markdown
# Component Rules

## 필수 규칙
1. 모든 컴포넌트는 src/components/ 하위에 생성
2. 파일명은 PascalCase: PostCard.tsx
3. Props는 interface로 정의, 컴포넌트명 + Props: PostCardProps
4. ...
```

### 활성화 메커니즘: `scripts/hooks/skill-activator.sh`

```bash
#!/bin/bash
INPUT=$(cat)
PROMPT=$(echo "$INPUT" | jq -r '.prompt // .message.content // ""' 2>/dev/null)

[ -z "$PROMPT" ] && echo '{"continue": true}' && exit 0

PROMPT_LOWER=$(echo "$PROMPT" | tr '[:upper:]' '[:lower:]')
SKILLS_DIR="./skills"
MESSAGES=""

# 키워드 매칭: 프론트엔드
if echo "$PROMPT_LOWER" | grep -qE '\b(component|page|layout|ui|css|tailwind|style)\b'; then
  MESSAGES="${MESSAGES}[AUTO-SKILL] 프론트엔드 작업 감지. skills/frontend/index.md를 먼저 읽고 해당 챕터를 확인한 후 작업하세요.\n"
fi

# 키워드 매칭: 백엔드
if echo "$PROMPT_LOWER" | grep -qE '\b(api|notion|fetch|server|database|서버)\b'; then
  MESSAGES="${MESSAGES}[AUTO-SKILL] 백엔드 작업 감지. skills/backend/index.md를 먼저 읽고 해당 챕터를 확인한 후 작업하세요.\n"
fi

# 키워드 매칭: 테스트
if echo "$PROMPT_LOWER" | grep -qE '\b(test|spec|jest|vitest|테스트)\b'; then
  MESSAGES="${MESSAGES}[AUTO-SKILL] 테스트 작업 감지. skills/common/chapters/testing.md를 읽은 후 작업하세요.\n"
fi

if [ -n "$MESSAGES" ]; then
  ESCAPED=$(echo -e "$MESSAGES" | jq -Rs .)
  echo "{\"continue\": true, \"message\": $ESCAPED}"
else
  echo '{"continue": true}'
fi
exit 0
```

### .claude/settings.json 훅 등록

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash ./scripts/hooks/skill-activator.sh"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash ./scripts/hooks/quality-check.sh"
          }
        ]
      }
    ]
  }
}
```

---

## 시스템 2: 작업 기억 (3개 문서)

### `/project:start-task` 커맨드

`.claude/commands/start-task.md`:
```markdown
새로운 작업을 시작합니다. 코드를 작성하기 전에 반드시 아래 3개 문서를 먼저 생성하세요.

## 1단계: .tasks/current/ 디렉토리 생성

## 2단계: 3개 문서 작성

### plan.md (설계도)
- 작업 목표 (한 줄)
- 구현할 것 목록
- 완료 조건
- 예상 변경 파일

### context.md (시방서)
- 이 작업의 배경과 이유
- 관련 코드 위치 (파일 경로)
- 참고한 문서나 자료
- 핵심 결정 사항과 그 이유

### checklist.md (공정표)
- [ ] 할 일 목록 (체크박스)
- 각 항목은 하나의 작은 단위 작업
- 완료되면 [x]로 체크

## 3단계: 한 번에 1-2개 항목만 작업
체크리스트에서 다음 항목을 진행하고, 완료 시 checklist.md를 업데이트하세요.

작업 설명: $ARGUMENTS
```

### 매 턴 기억 유지

`.claude/CLAUDE.md`에 추가할 규칙:
```markdown
## 작업 기억 규칙
- .tasks/current/ 에 문서가 있으면 매 작업 전 checklist.md를 확인하세요
- 작업 완료 후 checklist.md의 해당 항목을 [x]로 업데이트하세요
- 새로운 결정을 내렸으면 context.md에 추가하세요
```

---

## 시스템 3: 자동 품질 검사

### `scripts/hooks/quality-check.sh` (Stop 훅)

```bash
#!/bin/bash
INPUT=$(cat)

# .tasks/current/checklist.md가 있는지 확인
if [ -f ".tasks/current/checklist.md" ]; then
  UNCHECKED=$(grep -c '^\- \[ \]' .tasks/current/checklist.md 2>/dev/null || echo "0")
  CHECKED=$(grep -c '^\- \[x\]' .tasks/current/checklist.md 2>/dev/null || echo "0")

  if [ "$UNCHECKED" -gt 0 ]; then
    echo "{\"continue\": true, \"message\": \"[QUALITY-CHECK] 체크리스트에 미완료 항목이 ${UNCHECKED}개 남아있습니다. 현재 작업한 항목을 체크하고, 다음 할 일을 사용자에게 안내하세요.\"}"
    exit 0
  fi
fi

echo '{"continue": true}'
exit 0
```

### `/project:check` 커맨드 (수동 품질 검사)

`.claude/commands/check.md`:
```markdown
현재 작업의 품질을 검사합니다.

## 검사 항목

1. **.tasks/current/checklist.md** 확인: 빠뜨린 항목이 있는지
2. **TypeScript 타입 체크**: `npx tsc --noEmit` 실행
3. **린트 검사**: `npm run lint` 실행
4. **스킬 규칙 준수**: 해당 스킬 매뉴얼을 다시 읽고 위반 사항 확인

## 보고 형식
- 통과 항목: ✅ 로 표시
- 실패 항목: ❌ + 구체적 수정 방안
- 경고 항목: ⚠️ + 확인 필요 사유
```

---

## 시스템 4: 전문 에이전트

이미 omc에 에이전트가 있으므로, 프로젝트 맞춤 커맨드로 호출:

### `/project:review` 커맨드

`.claude/commands/review.md`:
```markdown
코드 리뷰를 수행합니다. 아래 순서로 에이전트를 실행하세요.

## 1단계: 변경 파일 확인
`git diff --name-only`로 변경된 파일 목록을 확인합니다.

## 2단계: 코드 리뷰 에이전트 실행
Task 도구로 oh-my-claudecode:code-reviewer 에이전트를 실행하여 변경된 코드를 리뷰합니다.

## 3단계: 보안 리뷰 (해당 시)
API 엔드포인트, 인증, 사용자 입력 처리가 포함된 경우
Task 도구로 oh-my-claudecode:security-reviewer 에이전트를 실행합니다.

## 4단계: 결과 종합
각 에이전트의 리뷰 결과를 종합하여 보고서를 작성합니다:
- 발견된 문제 (심각도별 분류)
- 수정 제안
- 승인 여부 판정
```

---

## 구현 우선순위

| 순서 | 시스템 | 구현 내용 | 난이도 |
|------|--------|----------|--------|
| 1 | 스킬 디렉토리 | skills/ 구조 + index.md 작성 | 낮음 |
| 2 | 작업 기억 | /project:start-task 커맨드 | 낮음 |
| 3 | 자동 활성화 | skill-activator.sh 훅 | 중간 |
| 4 | 품질 검사 | quality-check.sh 훅 + /project:check | 중간 |
| 5 | 에이전트 리뷰 | /project:review 커맨드 | 낮음 |
