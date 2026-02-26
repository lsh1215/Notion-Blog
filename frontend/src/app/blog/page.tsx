import { PostGrid } from "@/components/PostGrid";
import { getPaginatedPosts } from "@/lib/notion";

const INITIAL_COUNT = 15;

export default async function BlogPage() {
  const { posts, total } = await getPaginatedPosts(0, INITIAL_COUNT);

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

        {/* Post Grid */}
        {posts.length > 0 ? (
          <PostGrid initialPosts={posts} total={total} />
        ) : (
          <div className="py-20 text-center">
            <p className="text-ink-muted">아직 글이 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
}
