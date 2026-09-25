import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { getPostsBySlugs, getPublishedPostStats } from "@/lib/notion";

export const revalidate = 1800;

const FEATURED_POST_SLUGS = [
  "3b83187fa1c9812e818df0c28862006a",
  "3973187fa1c981849c4beadbd91891be",
  "3cf3187fa1c981d78a22fec8c6ec5a06",
  "3cf3187fa1c981ebad30cbfbb088b54a",
  "3c53187fa1c981ce825edf7ffee02c0e",
];

export default async function Home() {
  const publishedStats = await getPublishedPostStats();
  const featuredPosts = await getPostsBySlugs(FEATURED_POST_SLUGS);
  const year = new Date().getFullYear();
  const sinceYear = publishedStats.sinceYear ?? String(year);

  return (
    <>
      <section className="px-5 pb-20 pt-20 md:px-8 md:pb-28 md:pt-28">
        <div className="mx-auto max-w-6xl">
          <p className="editorial-label flex items-center gap-3 text-accent-violet">
            <span className="h-1.5 w-1.5 rounded-full bg-[#cf6fad]" />
            Notes · Seoul · {year}
          </p>

          <h1 className="mt-8 max-w-6xl text-[clamp(3.25rem,6.1vw,5.75rem)] font-black leading-[0.92] tracking-display text-ink lg:whitespace-nowrap">
            THINK.<br className="lg:hidden" />
            <span className="display-gradient">BUILD,</span><br className="lg:hidden" />
            SHARE<span className="text-accent-violet">.</span>
          </h1>

          <div className="mt-10 grid gap-10 border-t border-surface-border pt-7 md:grid-cols-[1fr_auto] md:items-end">
            <div className="max-w-2xl">
              <p className="text-base leading-7 text-ink-secondary md:text-lg md:leading-8">
                Sanghun Lee&apos;s engineering blog about MSA, backend systems,
                <br className="hidden sm:block" /> data pipelines, and open-source software.
              </p>
              <Link
                href="/blog"
                className="mt-6 inline-flex items-center gap-3 text-sm font-bold text-ink transition-colors hover:text-accent-violet"
              >
                모든 글 보기
                <span aria-hidden="true" className="text-lg">→</span>
              </Link>
            </div>

            <dl className="grid grid-cols-2 gap-10">
              <div>
                <dd className="text-2xl font-black tracking-heading text-ink">{publishedStats.count}</dd>
                <dt className="editorial-label mt-1 text-ink-muted">Posts</dt>
              </div>
              <div>
                <dd className="text-2xl font-black tracking-heading text-ink">{sinceYear}</dd>
                <dt className="editorial-label mt-1 text-ink-muted">Since</dt>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="px-5 pb-28 md:px-8 md:pb-36">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 border-b border-surface-border pb-5 md:mb-10 md:flex md:items-end md:gap-6">
            <div>
              <p className="editorial-label mb-2 text-ink-muted">
                {String(featuredPosts.length).padStart(2, "0")} / 06 · Major entries
              </p>
              <h2 className="max-w-full text-3xl font-black leading-tight tracking-display text-ink sm:text-4xl md:text-5xl">
                Major <span className="editorial-serif text-ink-secondary">work &amp; writing</span>
              </h2>
            </div>
            <span className="mb-3 hidden h-px flex-1 bg-surface-border md:block" />
            <Link
              href="/blog"
              className="editorial-label mb-3 ml-auto hidden whitespace-nowrap text-ink-muted transition-colors hover:text-ink sm:block"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index + 1} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
