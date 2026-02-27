"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PostCard } from "./PostCard";
import type { BlogPost } from "@/lib/notion";

interface SearchBarProps {
  children?: React.ReactNode;
}

export function SearchBar({ children }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BlogPost[] | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const abortRef = useRef<AbortController>(undefined);

  const search = useCallback(async (q: string) => {
    abortRef.current?.abort();

    if (!q.trim()) {
      setResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(
        `/api/posts?q=${encodeURIComponent(q.trim())}`,
        { signal: controller.signal }
      );
      const data = await res.json();
      setResults(data.posts);
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setResults([]);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => clearTimeout(debounceRef.current);
  }, [query, search]);

  const isActive = query.trim().length > 0;

  return (
    <div>
      {/* Search Input */}
      <div className="relative mb-10">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <svg
            className="h-5 w-5 text-ink-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="제목, 설명, 태그, 카테고리로 검색..."
          className="w-full rounded-xl border border-surface-border bg-surface-subtle py-3 pl-12 pr-10 text-sm text-ink placeholder:text-ink-muted transition-colors focus:border-accent-violet focus:outline-none"
        />
        {isActive && (
          <button
            onClick={() => setQuery("")}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-ink-muted hover:text-ink"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results (replaces children when active) */}
      {isActive ? (
        <div>
          {loading ? (
            <p className="py-12 text-center text-sm text-ink-muted">검색 중...</p>
          ) : results && results.length > 0 ? (
            <>
              <p className="mb-6 text-sm text-ink-muted">
                {results.length}개의 글을 찾았습니다
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </>
          ) : results ? (
            <p className="py-12 text-center text-sm text-ink-muted">
              &ldquo;{query}&rdquo;에 대한 검색 결과가 없습니다
            </p>
          ) : null}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
