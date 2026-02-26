import Link from "next/link";
import { getPostsByYear } from "@/lib/notion";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Archives",
  description: "시간순으로 정렬된 모든 글을 확인하세요.",
};

export default async function ArchivesPage() {
  const postsByYear = await getPostsByYear();
  const years = Object.keys(postsByYear).sort((a, b) => b.localeCompare(a));
  const totalPosts = Object.values(postsByYear).flat().length;

  return (
    <section className="px-6 pb-24 pt-24 md:pt-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-semibold tracking-display text-ink md:text-5xl">
            Archives
          </h1>
          <p className="mt-4 text-lg text-ink-secondary">
            총 {totalPosts}개의 글이 있습니다.
          </p>
        </div>

        <div className="space-y-12">
          {years.map((year) => (
            <div key={year}>
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-2xl font-bold tracking-heading text-ink">
                  {year}
                </h2>
                <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-ink-muted">
                  {postsByYear[year].length}
                </span>
              </div>
              <div className="space-y-1">
                {postsByYear[year].map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex items-baseline gap-4 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-subtle"
                  >
                    <time
                      dateTime={post.publishedDate}
                      className="w-36 shrink-0 text-sm tabular-nums text-ink-muted"
                    >
                      {formatDate(post.publishedDate)}
                    </time>
                    <span className="min-w-0 truncate text-sm font-medium text-ink group-hover:text-accent-violet">
                      {post.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
