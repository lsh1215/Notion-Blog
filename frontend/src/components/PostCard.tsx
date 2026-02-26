"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/lib/notion";

interface PostCardProps {
  post: BlogPost;
}

export function PostCard({ post }: PostCardProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = post.coverImage && !imgError;

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="overflow-hidden rounded-2xl bg-surface-subtle shadow-card transition-shadow duration-200 hover:shadow-card-hover">
        {showImage && (
          <div className="relative aspect-[2/1] w-full overflow-hidden bg-surface-subtle">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              onError={() => setImgError(true)}
            />
          </div>
        )}
        <div className="flex flex-col gap-3 p-6">
          {post.category && (
            <span className="text-xs font-medium text-accent-violet">
              {post.category}
            </span>
          )}
          <h2 className="text-lg font-semibold tracking-heading text-ink transition-colors group-hover:text-accent-violet">
            {post.title}
          </h2>
          <p className="line-clamp-2 text-sm leading-relaxed text-ink-secondary">
            {post.description}
          </p>
          <time
            dateTime={post.publishedDate}
            className="text-xs tracking-ui text-ink-muted"
          >
            {formatDate(post.publishedDate)}
          </time>
        </div>
      </article>
    </Link>
  );
}
