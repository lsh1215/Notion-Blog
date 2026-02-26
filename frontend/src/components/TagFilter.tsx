"use client";

import { useRouter } from "next/navigation";
import { Tag } from "@/components/Tag";

interface TagFilterProps {
  tags: string[];
  activeTag?: string;
}

export function TagFilter({ tags, activeTag }: TagFilterProps) {
  const router = useRouter();

  const handleTagClick = (tag: string) => {
    if (activeTag === tag) {
      router.push("/blog");
    } else {
      router.push(`/blog?tag=${encodeURIComponent(tag)}`);
    }
  };

  return (
    <div className="mb-10 flex flex-wrap items-center gap-2">
      <button
        onClick={() => router.push("/blog")}
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          !activeTag
            ? "bg-accent-violet text-white"
            : "bg-surface-muted text-ink-secondary hover:bg-surface-border"
        }`}
      >
        전체
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          className="cursor-pointer"
        >
          <Tag label={tag} active={activeTag === tag} />
        </button>
      ))}
    </div>
  );
}
