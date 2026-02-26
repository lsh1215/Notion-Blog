import Link from "next/link";
import { getAllCategories, getPostCountByCategory } from "@/lib/mock-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description: "카테고리별로 분류된 블로그 글을 확인하세요.",
};

export default function CategoriesPage() {
  const categories = getAllCategories();
  const counts = getPostCountByCategory();

  return (
    <section className="px-6 pb-24 pt-24 md:pt-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-semibold tracking-display text-ink md:text-5xl">
            Categories
          </h1>
          <p className="mt-4 text-lg text-ink-secondary">
            주제별로 글을 모아 보았습니다.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/categories/${encodeURIComponent(category)}`}
              className="group flex items-center justify-between rounded-2xl border border-surface-border p-6 transition-all hover:border-accent-violet/30 hover:shadow-card"
            >
              <div>
                <h2 className="text-lg font-semibold tracking-heading text-ink group-hover:text-accent-violet">
                  {category}
                </h2>
              </div>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-violet-light text-sm font-medium text-accent-violet">
                {counts[category]}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
