import { notFound } from "next/navigation";
import Link from "next/link";
import { Tag } from "@/components/Tag";
import { formatDate } from "@/lib/utils";
import { getPostBySlug, getPageBlocks } from "@/lib/notion";
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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const blocks = await getPageBlocks(post.id);

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

        {/* Content */}
        <div className="prose">
          <NotionRenderer blocks={blocks} />
        </div>
      </div>
    </article>
  );
}
