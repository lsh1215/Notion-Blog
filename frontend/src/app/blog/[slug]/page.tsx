import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Tag } from "@/components/Tag";
import { formatDate } from "@/lib/utils";
import { getPostBySlug, getTopLevelBlocks, hydrateBlockChildren } from "@/lib/notion";
import { NotionRenderer } from "@/lib/notion-renderer";
import type { Metadata } from "next";

// ISR: pages generated on first visit, revalidated every 30 minutes
export const revalidate = 1800;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedDate,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

/** Split blocks into sections at heading_1/heading_2 boundaries. */
function splitAtHeadings(blocks: any[]): any[][] {
  const sections: any[][] = [];
  let current: any[] = [];

  for (const block of blocks) {
    if (
      (block.type === "heading_1" || block.type === "heading_2") &&
      current.length > 0
    ) {
      sections.push(current);
      current = [];
    }
    current.push(block);
  }
  if (current.length > 0) {
    sections.push(current);
  }
  return sections;
}

/** Async RSC — hydrates children for its blocks, then renders. */
async function BlockSection({ blocks }: { blocks: any[] }) {
  await hydrateBlockChildren(blocks);
  return <NotionRenderer blocks={blocks} />;
}

/** Section skeleton shown while each section loads children. */
function SectionSkeleton() {
  return (
    <div className="animate-pulse space-y-3 py-2">
      <div className="h-4 rounded bg-surface-muted w-full" />
      <div className="h-4 rounded bg-surface-muted w-11/12" />
      <div className="h-4 rounded bg-surface-muted w-4/5" />
    </div>
  );
}

/** Skeleton shown while the initial top-level block fetch is in progress. */
function ContentSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="space-y-3">
        <div className="h-4 bg-surface-muted rounded w-full" />
        <div className="h-4 bg-surface-muted rounded w-5/6" />
        <div className="h-4 bg-surface-muted rounded w-4/5" />
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-surface-muted rounded w-full" />
        <div className="h-4 bg-surface-muted rounded w-3/4" />
      </div>
      <div className="h-32 bg-surface-muted rounded-lg w-full" />
      <div className="space-y-3">
        <div className="h-4 bg-surface-muted rounded w-full" />
        <div className="h-4 bg-surface-muted rounded w-11/12" />
        <div className="h-4 bg-surface-muted rounded w-4/6" />
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-surface-muted rounded w-full" />
        <div className="h-4 bg-surface-muted rounded w-5/6" />
      </div>
    </div>
  );
}

/** Fetches top-level blocks and streams sections independently. */
async function PostContent({ postId }: { postId: string }) {
  const blocks = await getTopLevelBlocks(postId);
  const sections = splitAtHeadings(blocks);

  return (
    <>
      {sections.map((section, i) => (
        <Suspense key={i} fallback={<SectionSkeleton />}>
          <BlockSection blocks={section} />
        </Suspense>
      ))}
    </>
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="px-6 pb-24 pt-24 md:pt-32">
      <div className="mx-auto max-w-3xl">
        {/* Back link */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="rotate-180"
          >
            <path
              d="M6 3l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          블로그로 돌아가기
        </Link>

        {/* Post Header */}
        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Tag key={tag} label={tag} asLink />
            ))}
          </div>
          <h1 className="text-3xl font-bold tracking-display text-ink md:text-4xl lg:text-[42px] lg:leading-[1.2]">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-ink-secondary">{post.description}</p>
          <time
            dateTime={post.publishedDate}
            className="mt-4 block text-sm text-ink-muted"
          >
            {formatDate(post.publishedDate)}
          </time>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative mb-12 aspect-[2/1] w-full overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Content - streams sections when ready */}
        <div className="prose">
          <Suspense fallback={<ContentSkeleton />}>
            <PostContent postId={post.id} />
          </Suspense>
        </div>
      </div>
    </article>
  );
}
