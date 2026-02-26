export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  publishedDate: string;
  category: string;
  tags: string[];
  status: "Published" | "Draft";
  coverImage?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  period: string;
  role: string;
  techStack: string[];
  coverImage?: string;
  links?: { label: string; url: string }[];
}

export const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "Next.js App Router로 블로그 만들기",
    slug: "nextjs-app-router-blog",
    description:
      "Next.js 14의 App Router를 사용하여 Notion을 CMS로 활용하는 블로그를 구축하는 과정을 소개합니다.",
    publishedDate: "2025-12-15",
    category: "Frontend",
    tags: ["Next.js", "React", "Tutorial"],
    status: "Published",
    coverImage: "https://picsum.photos/seed/post1/800/400",
  },
  {
    id: "2",
    title: "TypeScript 타입 시스템 깊게 이해하기",
    slug: "typescript-type-system-deep-dive",
    description:
      "TypeScript의 고급 타입 기능인 Conditional Types, Mapped Types, Template Literal Types를 실전 예제와 함께 알아봅니다.",
    publishedDate: "2025-11-20",
    category: "Programming",
    tags: ["TypeScript", "Programming"],
    status: "Published",
    coverImage: "https://picsum.photos/seed/post2/800/400",
  },
  {
    id: "3",
    title: "Tailwind CSS v4 마이그레이션 가이드",
    slug: "tailwind-css-v4-migration",
    description:
      "Tailwind CSS v3에서 v4로 마이그레이션할 때 알아야 할 주요 변경사항과 새로운 기능을 정리합니다.",
    publishedDate: "2025-10-05",
    category: "Frontend",
    tags: ["CSS", "Tailwind"],
    status: "Published",
    coverImage: "https://picsum.photos/seed/post3/800/400",
  },
  {
    id: "4",
    title: "효율적인 Git 워크플로우 구축하기",
    slug: "efficient-git-workflow",
    description:
      "팀 프로젝트에서 Git 브랜치 전략, 커밋 컨벤션, 코드 리뷰 프로세스를 어떻게 설계하면 좋은지 다룹니다.",
    publishedDate: "2025-09-12",
    category: "DevOps",
    tags: ["Git", "DevOps"],
    status: "Published",
    coverImage: "https://picsum.photos/seed/post4/800/400",
  },
  {
    id: "5",
    title: "Notion API 활용 가이드",
    slug: "notion-api-guide",
    description:
      "Notion API를 사용하여 데이터베이스를 프로그래밍 방식으로 다루는 방법과 실용적인 활용 사례를 소개합니다.",
    publishedDate: "2025-08-28",
    category: "Backend",
    tags: ["Notion", "API"],
    status: "Published",
    coverImage: "https://picsum.photos/seed/post5/800/400",
  },
  {
    id: "6",
    title: "React Server Components 이해하기",
    slug: "react-server-components",
    description:
      "React Server Components가 무엇이고 왜 필요한지, 기존 CSR/SSR과 어떻게 다른지 살펴봅니다.",
    publishedDate: "2025-07-15",
    category: "Frontend",
    tags: ["React", "Next.js"],
    status: "Published",
    coverImage: "https://picsum.photos/seed/post6/800/400",
  },
  {
    id: "7",
    title: "Docker로 개발 환경 통일하기",
    slug: "docker-dev-environment",
    description:
      "Docker Compose를 활용하여 팀원 모두가 동일한 개발 환경에서 작업할 수 있도록 세팅하는 방법입니다.",
    publishedDate: "2024-06-10",
    category: "DevOps",
    tags: ["Docker", "DevOps"],
    status: "Published",
    coverImage: "https://picsum.photos/seed/post7/800/400",
  },
  {
    id: "8",
    title: "REST API 설계 원칙",
    slug: "rest-api-design-principles",
    description:
      "RESTful API를 설계할 때 지켜야 할 원칙과 실무에서 자주 하는 실수를 정리합니다.",
    publishedDate: "2024-03-22",
    category: "Backend",
    tags: ["API", "Backend"],
    status: "Published",
    coverImage: "https://picsum.photos/seed/post8/800/400",
  },
];

export const mockPortfolioProjects: PortfolioProject[] = [
  {
    id: "p1",
    title: "Notion Blog",
    slug: "notion-blog",
    description:
      "Notion을 CMS로 활용한 개인 블로그. Next.js App Router와 Tailwind CSS로 구축.",
    period: "2025.12 - 현재",
    role: "풀스택 개발",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Notion API"],
    coverImage: "https://picsum.photos/seed/proj1/800/400",
    links: [{ label: "GitHub", url: "#" }],
  },
  {
    id: "p2",
    title: "Task Management App",
    slug: "task-management-app",
    description:
      "실시간 협업이 가능한 태스크 관리 애플리케이션. 드래그 앤 드롭 칸반 보드 지원.",
    period: "2025.06 - 2025.09",
    role: "프론트엔드 개발",
    techStack: ["React", "TypeScript", "Zustand", "Supabase"],
    coverImage: "https://picsum.photos/seed/proj2/800/400",
    links: [
      { label: "GitHub", url: "#" },
      { label: "Demo", url: "#" },
    ],
  },
  {
    id: "p3",
    title: "E-Commerce API",
    slug: "ecommerce-api",
    description:
      "결제, 재고 관리, 주문 처리를 지원하는 이커머스 백엔드 API 서버.",
    period: "2025.01 - 2025.05",
    role: "백엔드 개발",
    techStack: ["Node.js", "Express", "PostgreSQL", "Redis"],
    coverImage: "https://picsum.photos/seed/proj3/800/400",
    links: [{ label: "GitHub", url: "#" }],
  },
];

export const mockPostContent = `
프로그래밍 세계에서 가장 중요한 것 중 하나는 **꾸준한 학습**입니다. 새로운 기술이 끊임없이 등장하고, 기존 도구들도 계속 발전합니다.

## 시작하기 전에

이 글에서는 실전 프로젝트를 통해 핵심 개념을 다룹니다. 코드를 직접 따라 치면서 읽으면 더 효과적입니다.

### 프로젝트 구조

먼저 프로젝트의 기본 구조를 살펴보겠습니다:

\`\`\`typescript
// src/lib/notion.ts
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function getPosts() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: "상태",
      select: { equals: "Published" },
    },
    sorts: [
      { property: "게시일", direction: "descending" },
    ],
  });
  return response.results;
}
\`\`\`

## 핵심 개념

> 좋은 소프트웨어는 단순함에서 시작됩니다. 복잡한 문제를 단순한 조각으로 나누는 능력이 핵심입니다.

몇 가지 핵심 포인트를 정리하면:

1. **타입 안전성**: TypeScript로 런타임 에러를 사전에 방지
2. **컴포넌트 설계**: 재사용 가능한 작은 단위로 분리
3. **데이터 흐름**: 서버에서 클라이언트로의 단방향 흐름 유지

### 실전 예제

\`inline code\` 형태로 간단한 코드를 본문에 포함할 수도 있습니다.

| 기능 | 설명 | 상태 |
|------|------|------|
| SSR | 서버 사이드 렌더링 | ✅ 완료 |
| ISR | 점진적 정적 재생성 | ✅ 완료 |
| API Routes | 서버리스 API | 🚧 진행 중 |

---

## 마무리

이 글에서 다룬 내용을 정리하면:

- 프로젝트 초기 설정 방법
- 핵심 아키텍처 패턴
- 실전 코드 예제

다음 글에서는 더 심화된 내용을 다루겠습니다. 질문이 있으시면 댓글로 남겨주세요!
`;

// --- Helper functions ---

export function getPostBySlug(slug: string): BlogPost | undefined {
  return mockPosts.find((post) => post.slug === slug);
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  mockPosts.forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}

export function getAllCategories(): string[] {
  const catSet = new Set<string>();
  mockPosts.forEach((post) => catSet.add(post.category));
  return Array.from(catSet).sort();
}

export function getPostsByTag(tag: string): BlogPost[] {
  return mockPosts.filter((post) => post.tags.includes(tag));
}

export function getPostsByCategory(category: string): BlogPost[] {
  return mockPosts.filter((post) => post.category === category);
}

export function getPostCountByTag(): Record<string, number> {
  const counts: Record<string, number> = {};
  mockPosts.forEach((post) =>
    post.tags.forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
    })
  );
  return counts;
}

export function getPostCountByCategory(): Record<string, number> {
  const counts: Record<string, number> = {};
  mockPosts.forEach((post) => {
    counts[post.category] = (counts[post.category] || 0) + 1;
  });
  return counts;
}

export function getPostsByYear(): Record<string, BlogPost[]> {
  const grouped: Record<string, BlogPost[]> = {};
  mockPosts.forEach((post) => {
    const year = post.publishedDate.slice(0, 4);
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(post);
  });
  return grouped;
}

export function getPortfolioBySlug(
  slug: string
): PortfolioProject | undefined {
  return mockPortfolioProjects.find((p) => p.slug === slug);
}
