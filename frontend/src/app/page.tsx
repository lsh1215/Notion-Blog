import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { getAllPosts } from "@/lib/notion";

export default async function Home() {
  const posts = await getAllPosts();
  const recentPosts = posts.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="px-6 pb-20 pt-32 text-center md:pt-40">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-display text-ink md:text-5xl lg:text-[64px] lg:leading-[1.15]">
            생각을 기록하고
            <br />
            지식을 나눕니다
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-secondary">
            개발, 기술, 그리고 일상에서 배운 것들을 정리합니다.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center rounded-full bg-ink px-6 py-3 text-sm font-medium text-surface shadow-[inset_0px_2px_0px_0px_rgba(255,255,255,0.1)] transition-opacity hover:opacity-90"
            >
              글 둘러보기
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-sm font-medium text-accent-violet">Latest</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-heading text-ink md:text-3xl">
                최근 게시글
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            >
              전체 보기 &rarr;
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
