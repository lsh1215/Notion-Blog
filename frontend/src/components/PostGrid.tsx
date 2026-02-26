"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PostCard } from "./PostCard";
import type { BlogPost } from "@/lib/notion";

interface PostGridProps {
  initialPosts: BlogPost[];
  total: number;
}

const LOAD_SIZE = 3;

export function PostGrid({ initialPosts, total }: PostGridProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasMore = posts.length < total;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/posts?offset=${posts.length}&limit=${LOAD_SIZE}`
      );
      const data = await res.json();
      setPosts((prev) => [...prev, ...data.posts]);
    } finally {
      setLoading(false);
    }
  }, [posts.length, loading, hasMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className="mt-12 flex justify-center">
          {loading && (
            <p className="text-sm text-ink-muted">불러오는 중...</p>
          )}
        </div>
      )}
    </>
  );
}
