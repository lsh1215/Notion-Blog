"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/lib/notion";

interface PostCardProps {
  post: BlogPost;
  index?: number;
}

export function PostCard({ post, index }: PostCardProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = post.coverImage && !imgError;

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface/75 shadow-card backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-accent-violet/40 group-hover:shadow-card-hover">
        {showImage && (
          <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-surface-border bg-surface-subtle">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover saturate-[0.85] transition duration-500 group-hover:scale-[1.035] group-hover:saturate-100"
              onError={() => setImgError(true)}
            />
          </div>
        )}
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <span className="editorial-label text-accent-violet">
              {post.category ? `# ${post.category}` : "# Note"}
            </span>
            {index && (
              <span className="font-mono text-xs text-ink-muted">{String(index).padStart(2, "0")}</span>
            )}
          </div>
          <h2 className="text-xl font-extrabold leading-snug tracking-heading text-ink transition-colors group-hover:text-accent-violet">
            {post.title}
          </h2>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink-secondary">
            {post.description}
          </p>
          <time
            dateTime={post.publishedDate}
            className="editorial-label mt-7 block border-t border-surface-border pt-4 text-ink-muted"
          >
            {formatDate(post.publishedDate)}
          </time>
        </div>
      </article>
    </Link>
  );
}
