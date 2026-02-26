import { Suspense } from "react";
import { PostCard } from "@/components/PostCard";
import { TagFilter } from "@/components/TagFilter";
import { mockPosts, getAllTags, getPostsByTag } from "@/lib/mock-data";

interface BlogPageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { tag } = await searchParams;
  const allTags = getAllTags();
  const posts = tag ? getPostsByTag(tag) : mockPosts;

  return (
    <section className="px-6 pb-24 pt-24 md:pt-32">
      <div className="mx-auto max-w-5xl">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-semibold tracking-display text-ink md:text-5xl">
            Blog
          </h1>
          <p className="mt-4 text-lg text-ink-secondary">
            개발과 기술에 대한 글을 모아두었습니다.
          </p>
        </div>

        {/* Tag Filter */}
        <Suspense fallback={null}>
          <TagFilter tags={allTags} activeTag={tag} />
        </Suspense>

        {/* Post Grid */}
        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-ink-muted">
              {tag ? `"${tag}" 태그의 글이 없습니다.` : "아직 글이 없습니다."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
