---
title: Notion Blog
type: plan
status: active
date: 2026-02-26
---

# Notion Blog - PRD (Product Requirements Document)

## Overview

Next.js 기반 개인 블로그. Notion을 CMS로 활용하여 노션 데이터베이스에 작성한 글을 블로그로 렌더링한다.
기존 블로그에서 마이그레이션한 글의 원래 게시일을 보존하기 위해 노션의 `Created time`이 아닌 커스텀 Date 속성("게시일")을 사용한다.

## Project Structure

- **프론트엔드 코드**: `frontend/` 디렉토리에 위치 (모든 Next.js 관련 파일)
- **문서**: `docs/` 디렉토리
- **스킬**: `skills/` 디렉토리
- **훅 스크립트**: `scripts/hooks/` 디렉토리

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **CMS**: Notion API (`@notionhq/client`)
- **Deployment**: Vercel (예정)

## Notion Database Schema

| 속성 이름 | 타입 | 용도 |
|-----------|------|------|
| 제목 | Title | 글 제목 |
| 게시일 | Date | 원래 블로그 게시 날짜 (수동 입력) |
| 카테고리 | Select | 대분류 (Frontend, Backend, DevOps 등) |
| 태그 | Multi-select | 세부 태그 |
| 상태 | Select | Draft / Published |
| 설명 | Rich text | 미리보기용 요약 |

---

## Progress Summary

| US | 제목 | 상태 | 비고 |
|----|------|------|------|
| US-001 | Next.js 프로젝트 초기화 | ✅ 완료 | Next.js 16 + TS + Tailwind v4 |
| US-002 | Notion API 연동 및 타입 정의 | ✅ 완료 | @notionhq/client v5 + notion.ts 모듈 |
| US-003 | 포스트 목록 조회 기능 | ✅ 완료 | dataSources.query API, 60초 캐시 |
| US-004 | 포스트 상세 페이지 (블록 렌더링) | ✅ 완료 | 16가지 블록 타입 렌더링 |
| US-005 | 블로그 홈페이지 UI | ✅ 완료 | 히어로 + 최근 포스트 그리드, 카드에 카테고리 표시 |
| US-006 | 포스트 상세 페이지 UI | ✅ 완료 | prose 타이포그래피, 코드블록 (구문강조 미적용) |
| US-007 | 태그 필터링 기능 | 🔄 변경됨 | 블로그 페이지에서 TagFilter 제거, 태그 페이지에서만 사용 |
| US-008 | SEO 및 메타데이터 | ⏳ 부분 완료 | Metadata API 적용, sitemap/robots 미구현 |
| US-009 | 카테고리 페이지 | ✅ 완료 | 카테고리 목록 + 상세 페이지 |
| US-010 | 태그 클라우드 페이지 | ✅ 완료 | 글 개수 기반 크기 조절 |
| US-011 | 아카이브 페이지 | ✅ 완료 | 연도별 그룹핑 |
| US-012 | 소개(About) 페이지 | ✅ 완료 | 프로필, 스킬, 연락처 |
| US-013 | 포트폴리오 페이지 | ✅ 완료 | 목록 + 상세 (Notion 연동 대기) |

---

## User Stories

### US-001: Next.js 프로젝트 초기화 ✅

- **설명**: Next.js + TypeScript + Tailwind CSS 프로젝트를 생성한다.
- **Acceptance Criteria**:
  - [x] Next.js 14+ App Router 프로젝트 생성
  - [x] TypeScript 설정 완료
  - [x] Tailwind CSS 설정 완료
  - [x] dev 서버가 정상 실행됨
- **구현 파일**: `frontend/package.json`, `frontend/tsconfig.json`, `frontend/next.config.ts`

### US-002: Notion API 연동 및 타입 정의 ✅

- **설명**: Notion API에 연결하고 블로그 데이터베이스에 맞는 타입을 정의한다.
- **Acceptance Criteria**:
  - [x] `@notionhq/client` 패키지 설치 (v5.9.0)
  - [x] Notion 클라이언트 초기화 모듈 생성
  - [x] 블로그 포스트 타입 정의 (제목, 게시일, 카테고리, 태그, 상태, 설명)
  - [x] 환경변수 템플릿(`.env.example`) 생성
- **구현 파일**: `frontend/src/lib/notion.ts`, `frontend/.env.example`
- **비고**: SDK v5에서는 `dataSources.query()` API 사용 (data_source_id 필요)

### US-003: 포스트 목록 조회 기능 ✅

- **설명**: 게시일 기준으로 정렬된 포스트 목록을 조회한다.
- **Acceptance Criteria**:
  - [x] Notion 데이터베이스에서 상태가 Published인 글만 조회
  - [x] 게시일(커스텀 Date 속성) 기준 내림차순 정렬
  - [x] 포스트 목록 데이터 fetching 함수 구현
  - [x] 게시일 속성으로 날짜 표시
- **구현 파일**: `frontend/src/lib/notion.ts` (`getAllPosts`, `getPostsByCategory`, `getPostsByTag` 등)
- **비고**: 모듈 레벨 캐시 (60초 TTL), 32개 블로그 포스트 / 9개 카테고리 확인

### US-004: 포스트 상세 페이지 (Notion 블록 렌더링) ✅

- **설명**: Notion 페이지의 블록들을 HTML로 렌더링하여 글 전문을 표시한다.
- **Acceptance Criteria**:
  - [x] Notion 페이지 블록 조회 함수 구현 (`getPageBlocks`)
  - [x] 주요 블록 타입 렌더링 (paragraph, heading, list, code, image, quote, callout, divider + toggle, table, bookmark, embed, video, equation)
  - [x] 동적 라우팅 (`/blog/[slug]`) 구현
- **구현 파일**: `frontend/src/app/blog/[slug]/page.tsx`, `frontend/src/lib/notion-renderer.tsx`
- **비고**: 16가지 블록 타입 지원, rich text 스타일링 (bold, italic, strikethrough, underline, code, color, link)

### US-005: 블로그 홈페이지 UI ✅

- **설명**: 포스트 카드 목록이 있는 깔끔한 홈페이지를 구현한다.
- **Acceptance Criteria**:
  - [x] 포스트 카드 컴포넌트 (제목, 게시일, 카테고리, 설명 표시)
  - [x] 반응형 레이아웃 (모바일/데스크톱)
  - [x] 게시일 한국어 날짜 형식 포맷팅
  - [x] 카테고리 표시 (태그 대신)
- **구현 파일**: `frontend/src/app/page.tsx`, `frontend/src/components/PostCard.tsx`
- **비고**: 카드에서 태그 대신 카테고리를 표시하도록 변경

### US-006: 포스트 상세 페이지 UI 및 레이아웃 ✅

- **설명**: 읽기 편한 타이포그래피와 레이아웃으로 포스트 상세 페이지를 구현한다.
- **Acceptance Criteria**:
  - [x] 포스트 헤더 (제목, 게시일, 태그)
  - [x] 본문 타이포그래피 스타일링
  - [ ] 코드 블록 구문 강조 (syntax highlighting) — 기본 스타일만 적용
  - [x] 이미지 최적화 (Next.js Image)
  - [x] 홈으로 돌아가기 네비게이션
- **구현 파일**: `frontend/src/app/blog/[slug]/page.tsx`, `frontend/src/app/globals.css` (.prose)

### US-007: 태그 필터링 기능 🔄

- **설명**: 태그를 클릭하면 해당 태그의 글만 필터링하여 보여준다.
- **Acceptance Criteria**:
  - [x] 태그별 포스트 필터링 구현 (태그 페이지에서)
  - [x] 태그 목록 표시 (태그 페이지에서)
  - [~] 블로그 페이지의 TagFilter 제거 (사용자 요청)
  - [x] URL 기반 필터 상태 유지
- **구현 파일**: `frontend/src/app/tags/page.tsx`
- **비고**: 블로그 페이지(`/blog`)에서 TagFilter 컴포넌트 제거. 태그 필터링은 태그 페이지(`/tags`)에서만 사용

### US-008: SEO 및 메타데이터 ⏳

- **설명**: 검색 엔진 최적화를 위한 메타데이터를 설정한다.
- **Acceptance Criteria**:
  - [x] Next.js Metadata API 활용
  - [x] 포스트별 동적 title, description, og:image
  - [ ] sitemap.xml 생성
  - [ ] robots.txt 설정
- **구현 파일**: 각 page.tsx의 `generateMetadata` / `metadata`

### US-009: 카테고리 페이지 ✅

- **설명**: 카테고리별로 글을 분류하여 보여주는 페이지를 구현한다.
- **Acceptance Criteria**:
  - [x] 카테고리 목록 페이지 (글 개수 표시)
  - [x] 카테고리별 상세 페이지 (해당 카테고리 포스트 그리드)
- **구현 파일**: `frontend/src/app/categories/page.tsx`, `frontend/src/app/categories/[category]/page.tsx`

### US-010: 태그 클라우드 페이지 ✅

- **설명**: 모든 태그를 한눈에 볼 수 있는 태그 클라우드 페이지를 구현한다.
- **Acceptance Criteria**:
  - [x] 태그 목록 표시 (글 개수 기반 크기 조절)
  - [x] 태그 클릭 시 해당 태그의 글 목록으로 이동
- **구현 파일**: `frontend/src/app/tags/page.tsx`

### US-011: 아카이브 페이지 ✅

- **설명**: 모든 글을 시간순으로 정렬하여 연도별로 보여주는 페이지를 구현한다.
- **Acceptance Criteria**:
  - [x] 연도별 그룹핑
  - [x] 날짜 + 제목 리스트
  - [x] 전체 글 개수 표시
- **구현 파일**: `frontend/src/app/archives/page.tsx`

### US-012: 소개(About) 페이지 ✅

- **설명**: 블로그 운영자 소개 페이지를 구현한다.
- **Acceptance Criteria**:
  - [x] 프로필 영역
  - [x] 스킬 목록
  - [x] 연락처 링크
  - [x] 블로그 기술 스택 소개
- **구현 파일**: `frontend/src/app/about/page.tsx`

### US-013: 포트폴리오 페이지 ✅

- **설명**: 노션 기반 포트폴리오 목록과 상세 페이지를 구현한다.
- **Acceptance Criteria**:
  - [x] 포트폴리오 목록 (가로형 카드, 기술스택 표시)
  - [x] 포트폴리오 상세 페이지 (노션 콘텐츠 렌더링)
  - [x] 외부 링크 (GitHub, Demo 등)
- **구현 파일**: `frontend/src/app/portfolio/page.tsx`, `frontend/src/app/portfolio/[slug]/page.tsx`
- **대기 사항**: Notion 포트폴리오 데이터베이스 연동

---

## 완료된 단계

1. ~~`@notionhq/client` 설치 및 Notion 클라이언트 모듈 생성~~ ✅
2. ~~mock-data.ts → Notion API 호출로 교체~~ ✅
3. ~~markdown.ts → Notion 블록 렌더러로 교체~~ ✅

## 다음 단계

1. 코드 구문 강조 — shiki로 언어별 색상 구분 (C, Java 등 노션에서 설정한 언어 반영)
2. 토글 블록 자식 콘텐츠 로드 — has_children 블록 재귀 fetch
3. 다크 모드 지원
