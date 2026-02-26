---
title: Documentation Conventions
date: 2026-02-26
---

# 프로젝트 폴더 구조 및 문서 컨벤션

## 프로젝트 루트 구조

```
Notion-Blog/
├── frontend/               # 프론트엔드 (Next.js) — 모든 FE 코드는 여기
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── next.config.ts
├── skills/                  # AI 스킬 매뉴얼
├── scripts/                 # 훅 스크립트
├── docs/                    # 프로젝트 문서
└── .gitignore
```

> **규칙**: 프론트엔드 관련 작업(컴포넌트, 페이지, 스타일, 패키지 설치 등)은
> 반드시 `frontend/` 디렉토리 안에서 수행한다. 루트에 src/, node_modules/ 등을 두지 않는다.

## docs/ 디렉토리 구조

```
docs/
├── CONVENTIONS.md          # 이 파일 (문서 작성 규칙)
├── brainstorms/            # 아이디어, 브레인스토밍 기록
├── plans/                  # PRD, 구현 계획, 아키텍처 설계
├── specs/                  # 기술 명세 (API 스펙, DB 스키마 등)
└── solutions/              # 해결한 문제 기록
    └── patterns/           # 반복되는 패턴, 공통 솔루션
```

## 어떤 문서를 어디에 넣는가

| 폴더 | 용도 | 예시 |
|------|------|------|
| `brainstorms/` | 초기 아이디어, 기능 구상, 비교 분석 | `cms-comparison.md`, `design-inspiration.md` |
| `plans/` | PRD, 구현 계획, 마일스톤 | `notion-blog-prd.md`, `v2-migration-plan.md` |
| `specs/` | 기술 명세, API 문서, 스키마 정의 | `notion-api-spec.md`, `database-schema.md` |
| `solutions/` | 해결한 버그, 트러블슈팅 기록 | `notion-rate-limit-fix.md` |
| `solutions/patterns/` | 자주 반복되는 패턴, 공통 해결책 | `common-solutions.md` |

## 문서 작성 규칙

### 파일명
- kebab-case 사용: `notion-blog-prd.md`
- solutions/ 하위: `[증상]-[모듈]-YYYYMMDD.md` (예: `image-load-fail-NotionRenderer-20260226.md`)

### YAML Frontmatter (필수)
모든 문서에 아래 frontmatter 포함:

```yaml
---
title: 문서 제목
type: brainstorm | plan | spec | solution
status: draft | active | completed | archived
date: YYYY-MM-DD
origin: docs/brainstorms/source.md   # plan인 경우, 원본 brainstorm 참조
---
```

## 문서 흐름

```
brainstorm → plan → (구현) → solution
```

1. **Brainstorm**: 아이디어 기록
2. **Plan**: brainstorm을 기반으로 PRD/구현 계획 작성 (origin 필드로 원본 참조)
3. **구현**: plan에 따라 코드 작성
4. **Solution**: 구현 중 해결한 문제 기록, 3회 이상 반복 시 patterns/로 승격
