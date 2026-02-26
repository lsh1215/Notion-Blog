import { PostCard } from "@/components/PostCard";
import {
  getAllCategories,
  getPostsByCategory,
} from "@/lib/mock-data";
import Link from "next/link";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return getAllCategories().map((c) => ({ category: c }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  return {
    title: decoded,
    description: `${decoded} 카테고리의 글 모음`,
  };
}

export default async function CategoryDetailPage({
  params,
}: CategoryPageProps) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const posts = getPostsByCategory(decoded);

  return (
    <section className="px-6 pb-24 pt-24 md:pt-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
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
            전체 카테고리
          </Link>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-display text-ink md:text-4xl">
            {decoded}
          </h1>
          <p className="mt-2 text-ink-secondary">
            {posts.length}개의 글이 있습니다.
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-ink-muted">
            이 카테고리에 글이 없습니다.
          </p>
        )}
      </div>
    </section>
  );
}
