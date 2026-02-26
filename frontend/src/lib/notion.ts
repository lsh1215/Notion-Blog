import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

// ─────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// Notion Client
// ─────────────────────────────────────────────

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

// ─────────────────────────────────────────────
// Type Guards
// ─────────────────────────────────────────────

function isPageObjectResponse(obj: unknown): obj is PageObjectResponse {
  return (
    typeof obj === "object" &&
    obj !== null &&
    (obj as PageObjectResponse).object === "page" &&
    "properties" in (obj as PageObjectResponse)
  );
}

// ─────────────────────────────────────────────
// Property Extraction Helpers
// ─────────────────────────────────────────────

type PageProperties = PageObjectResponse["properties"];

function extractTitle(properties: PageProperties): string {
  const prop = properties["Name"];
  if (prop?.type === "title") {
    return prop.title.map((t) => t.plain_text).join("") || "";
  }
  return "";
}

function extractDate(properties: PageProperties): string {
  const prop = properties["게시일"];
  if (prop?.type === "date" && prop.date?.start) {
    return prop.date.start;
  }
  return "";
}

function extractCategory(properties: PageProperties): string {
  const prop = properties["카테고리"];
  if (prop?.type === "select" && prop.select?.name) {
    return prop.select.name;
  }
  return "";
}

function extractTags(properties: PageProperties): string[] {
  const prop = properties["태그"];
  if (prop?.type === "multi_select") {
    return prop.multi_select.map((t) => t.name);
  }
  return [];
}

function extractStatus(properties: PageProperties): "Published" | "Draft" {
  const prop = properties["상태"];
  if (prop?.type === "select" && prop.select?.name) {
    const name = prop.select.name;
    if (name === "Published" || name === "Draft") return name;
  }
  return "Draft";
}

function extractDescription(properties: PageProperties): string {
  const prop = properties["설명"];
  if (prop?.type === "rich_text") {
    return prop.rich_text.map((t) => t.plain_text).join("") || "";
  }
  return "";
}

function extractCoverImage(page: PageObjectResponse): string | undefined {
  // NOTE: Notion S3 image URLs expire after ~1 hour.
  // TODO: Proxy or re-sign these URLs before serving to clients.
  const cover = page.cover;
  if (!cover) return undefined;
  if (cover.type === "external") return cover.external.url;
  if (cover.type === "file") return cover.file.url;
  return undefined;
}

function pageToPost(page: PageObjectResponse): BlogPost {
  const id = page.id;
  // Use page id (dashes removed) as the slug since Notion pages don't have slug fields
  const slug = id.replace(/-/g, "");
  return {
    id,
    slug,
    title: extractTitle(page.properties),
    description: extractDescription(page.properties),
    publishedDate: extractDate(page.properties),
    category: extractCategory(page.properties),
    tags: extractTags(page.properties),
    status: extractStatus(page.properties),
    coverImage: extractCoverImage(page),
  };
}

// ─────────────────────────────────────────────
// Module-level cache for getAllPosts
// Avoids hitting the Notion API on every derived call within the same Node.js process.
// ─────────────────────────────────────────────

let _postsCache: BlogPost[] | null = null;
let _postsCacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

async function fetchAllPosts(): Promise<BlogPost[]> {
  const now = Date.now();
  if (_postsCache && now - _postsCacheTime < CACHE_TTL_MS) {
    return _postsCache;
  }

  try {
    const results: BlogPost[] = [];
    let cursor: string | undefined = undefined;

    do {
      const response = await notion.dataSources.query({
        data_source_id: DATABASE_ID,
        filter: {
          property: "상태",
          select: { equals: "Published" },
        },
        sorts: [{ property: "게시일", direction: "descending" }],
        start_cursor: cursor,
        page_size: 100,
      });

      for (const item of response.results) {
        if (isPageObjectResponse(item)) {
          results.push(pageToPost(item));
        }
      }

      cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
    } while (cursor);

    // For posts without a cover image, try to extract the first image block
    const postsWithoutCover = results.filter((p) => !p.coverImage);
    if (postsWithoutCover.length > 0) {
      const imageResults = await Promise.all(
        postsWithoutCover.map((p) => extractFirstImage(p.id))
      );
      postsWithoutCover.forEach((post, i) => {
        if (imageResults[i]) {
          post.coverImage = imageResults[i];
        }
      });
    }

    _postsCache = results;
    _postsCacheTime = now;
    return _postsCache;
  } catch (error) {
    console.error("[notion] getAllPosts error:", error);
    return [];
  }
}

// ─────────────────────────────────────────────
// Core Fetching Functions
// ─────────────────────────────────────────────

export async function getAllPosts(): Promise<BlogPost[]> {
  return fetchAllPosts();
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  // slug is the page id with dashes removed; reconstruct dashed UUID for API
  const pageId =
    slug.length === 32
      ? `${slug.slice(0, 8)}-${slug.slice(8, 12)}-${slug.slice(12, 16)}-${slug.slice(16, 20)}-${slug.slice(20)}`
      : slug;

  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    if (isPageObjectResponse(page)) {
      return pageToPost(page);
    }
    return undefined;
  } catch (error) {
    console.error(`[notion] getPostBySlug(${slug}) error:`, error);
    return undefined;
  }
}

export async function getPageBlocks(
  pageId: string
): Promise<(BlockObjectResponse | PartialBlockObjectResponse)[]> {
  const blocks: (BlockObjectResponse | PartialBlockObjectResponse)[] = [];

  try {
    let cursor: string | undefined = undefined;

    do {
      const response = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
        page_size: 100,
      });

      blocks.push(...response.results);
      cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
    } while (cursor);

    // Recursively fetch children for blocks that have them (toggle, table, etc.)
    await fetchChildrenRecursive(blocks);
  } catch (error) {
    console.error(`[notion] getPageBlocks(${pageId}) error:`, error);
  }

  return blocks;
}

async function fetchChildrenRecursive(
  blocks: (BlockObjectResponse | PartialBlockObjectResponse)[]
): Promise<void> {
  const promises = blocks.map(async (block) => {
    if (!("has_children" in block) || !block.has_children) return;
    if (!("type" in block)) return;

    try {
      const children: (BlockObjectResponse | PartialBlockObjectResponse)[] = [];
      let cursor: string | undefined = undefined;

      do {
        const response = await notion.blocks.children.list({
          block_id: block.id,
          start_cursor: cursor,
          page_size: 100,
        });
        children.push(...response.results);
        cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
      } while (cursor);

      // Attach children to the block object for the renderer to access
      (block as any).children = children;

      // Recurse into children
      await fetchChildrenRecursive(children);
    } catch (error) {
      console.error(`[notion] fetchChildren(${block.id}) error:`, error);
    }
  });

  await Promise.all(promises);
}

// ─────────────────────────────────────────────
// Preview Image Fallback
// For posts without a cover image, fetch the first image block from the page.
// ─────────────────────────────────────────────

async function extractFirstImage(pageId: string): Promise<string | undefined> {
  try {
    let cursor: string | undefined = undefined;

    do {
      const response = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
        page_size: 100,
      });

      for (const block of response.results) {
        if (!("type" in block)) continue;
        if (block.type === "image") {
          const img = block.image;
          if (img.type === "file") return img.file.url;
          if (img.type === "external") return img.external.url;
        }
      }

      cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
    } while (cursor);
  } catch (error) {
    console.error(`[notion] extractFirstImage(${pageId}) error:`, error);
  }
  return undefined;
}

// ─────────────────────────────────────────────
// Derived Helpers (backed by getAllPosts + module cache)
// ─────────────────────────────────────────────

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tagSet = new Set<string>();
  posts.forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}

export async function getAllCategories(): Promise<string[]> {
  const posts = await getAllPosts();
  const catSet = new Set<string>();
  posts.forEach((post) => {
    if (post.category) catSet.add(post.category);
  });
  return Array.from(catSet).sort();
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.tags.includes(tag));
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.category === category);
}

export async function getPostCountByTag(): Promise<Record<string, number>> {
  const posts = await getAllPosts();
  const counts: Record<string, number> = {};
  posts.forEach((post) =>
    post.tags.forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
    })
  );
  return counts;
}

export async function getPostCountByCategory(): Promise<Record<string, number>> {
  const posts = await getAllPosts();
  const counts: Record<string, number> = {};
  posts.forEach((post) => {
    if (post.category) {
      counts[post.category] = (counts[post.category] || 0) + 1;
    }
  });
  return counts;
}

export async function getPostsByYear(): Promise<Record<string, BlogPost[]>> {
  const posts = await getAllPosts();
  const grouped: Record<string, BlogPost[]> = {};
  posts.forEach((post) => {
    const year = post.publishedDate ? post.publishedDate.slice(0, 4) : "Unknown";
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(post);
  });
  return grouped;
}

// ─────────────────────────────────────────────
// Portfolio (not yet implemented - DB not set up)
// ─────────────────────────────────────────────

// const PORTFOLIO_DATA_SOURCE_ID = process.env.NOTION_PORTFOLIO_DATABASE_ID!;

// export async function getAllPortfolioProjects(): Promise<PortfolioProject[]> { ... }
// export async function getPortfolioBySlug(slug: string): Promise<PortfolioProject | undefined> { ... }
