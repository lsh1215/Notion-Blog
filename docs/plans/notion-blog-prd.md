---
title: Notion Blog
type: plan
status: draft
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

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **CMS**: Notion API (`@notionhq/client`)
- **Deployment**: Vercel (예정)

## Notion Database Schema

| 속성 이름 | 타입 | 용도 |
|-----------|------|------|
| 제목 | Title | 글 제목 |
| 게시일 | Date | 원래 블로그 게시 날짜 (수동 입력) |
| 태그 | Multi-select | 카테고리/태그 |
| 상태 | Select | Draft / Published |
| 설명 | Rich text | 미리보기용 요약 |

---

## User Stories

### US-001: Next.js 프로젝트 초기화

- **설명**: Next.js + TypeScript + Tailwind CSS 프로젝트를 생성한다.
- **Acceptance Criteria**:
  - Next.js 14+ App Router 프로젝트 생성
  - TypeScript 설정 완료
  - Tailwind CSS 설정 완료
  - dev 서버가 정상 실행됨

### US-002: Notion API 연동 및 타입 정의

- **설명**: Notion API에 연결하고 블로그 데이터베이스에 맞는 타입을 정의한다.
- **Acceptance Criteria**:
  - `@notionhq/client` 패키지 설치
  - Notion 클라이언트 초기화 모듈 생성
  - 블로그 포스트 타입 정의 (제목, 게시일, 태그, 상태, 설명)
  - 환경변수 템플릿(`.env.example`) 생성 (`NOTION_TOKEN`, `NOTION_DATABASE_ID`)

### US-003: 포스트 목록 조회 기능

- **설명**: 게시일 기준으로 정렬된 포스트 목록을 조회한다. 마이그레이션된 글의 원래 날짜가 보존된다.
- **Acceptance Criteria**:
  - 상태가 Published인 글만 조회
  - 게시일(커스텀 Date 속성) 기준 내림차순 정렬
  - 포스트 목록 데이터 fetching 함수 구현
  - `Created time`이 아닌 게시일 속성으로 날짜 표시

### US-004: 포스트 상세 페이지 (Notion 블록 렌더링)

- **설명**: Notion 페이지의 블록들을 HTML로 렌더링하여 글 전문을 표시한다.
- **Acceptance Criteria**:
  - Notion 페이지 블록 조회 함수 구현
  - 주요 블록 타입 렌더링 (paragraph, heading, list, code, image, quote, callout, divider)
  - 동적 라우팅 (`/blog/[slug]`) 구현

### US-005: 블로그 홈페이지 UI

- **설명**: 포스트 카드 목록이 있는 깔끔한 홈페이지를 구현한다.
- **Acceptance Criteria**:
  - 포스트 카드 컴포넌트 (제목, 게시일, 태그, 설명 표시)
  - 반응형 레이아웃 (모바일/데스크톱)
  - 게시일 한국어 날짜 형식 포맷팅
  - 태그 스타일링

### US-006: 포스트 상세 페이지 UI 및 레이아웃

- **설명**: 읽기 편한 타이포그래피와 레이아웃으로 포스트 상세 페이지를 구현한다.
- **Acceptance Criteria**:
  - 포스트 헤더 (제목, 게시일, 태그)
  - 본문 타이포그래피 스타일링
  - 코드 블록 구문 강조 (syntax highlighting)
  - 이미지 최적화 (Next.js Image)
  - 홈으로 돌아가기 네비게이션

### US-007: 태그 필터링 기능

- **설명**: 태그를 클릭하면 해당 태그의 글만 필터링하여 보여준다.
- **Acceptance Criteria**:
  - 태그별 포스트 필터링 구현
  - 태그 목록 표시
  - 선택된 태그 하이라이트
  - URL query parameter로 필터 상태 유지

### US-008: SEO 및 메타데이터

- **설명**: 검색 엔진 최적화를 위한 메타데이터를 설정한다.
- **Acceptance Criteria**:
  - Next.js Metadata API 활용
  - 포스트별 동적 title, description, og:image
  - sitemap.xml 생성
  - robots.txt 설정
