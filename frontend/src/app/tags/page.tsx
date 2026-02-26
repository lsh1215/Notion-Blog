import Link from "next/link";
import { getAllTags, getPostCountByTag } from "@/lib/notion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags",
  description: "태그별로 분류된 블로그 글을 확인하세요.",
};

export default async function TagsPage() {
  const tags = await getAllTags();
  const counts = await getPostCountByTag();

  // Sort by count descending for visual weight
  const sortedTags = [...tags].sort(
    (a, b) => (counts[b] || 0) - (counts[a] || 0)
  );

  return (
    <section className="px-6 pb-24 pt-24 md:pt-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-semibold tracking-display text-ink md:text-5xl">
            Tags
          </h1>
          <p className="mt-4 text-lg text-ink-secondary">
            태그를 클릭하면 관련 글을 볼 수 있습니다.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {sortedTags.map((tag) => {
            const count = counts[tag] || 0;
            // Scale font size based on count
            const sizeClass =
              count >= 3
                ? "text-base px-5 py-2.5"
                : count >= 2
                  ? "text-sm px-4 py-2"
                  : "text-xs px-3 py-1.5";

            return (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className={`inline-flex items-center gap-1.5 rounded-full bg-accent-violet-light text-accent-violet transition-colors hover:bg-accent-violet hover:text-white ${sizeClass}`}
              >
                <span className="font-medium">{tag}</span>
                <span className="opacity-60">({count})</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
