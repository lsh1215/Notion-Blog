"use client";

import { useEffect, useRef, useState } from "react";
import type { TableOfContentsItem } from "@/lib/table-of-contents";

interface TableOfContentsProps {
  items: TableOfContentsItem[];
  variant: "desktop" | "mobile";
}

function ContentsLinks({
  items,
  activeId,
  onNavigate,
}: {
  items: TableOfContentsItem[];
  activeId: string;
  onNavigate?: () => void;
}) {
  return (
    <ol className="border-l border-surface-border">
      {items.map((item) => {
        const isActive = item.id === activeId;
        const indentation =
          item.level === 3 ? "pl-7" : item.level === 2 ? "pl-5" : "pl-3";

        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={isActive ? "location" : undefined}
              onClick={onNavigate}
              className={`-ml-px block border-l py-1.5 pr-2 text-sm leading-5 transition-colors ${indentation} ${
                isActive
                  ? "border-accent-violet font-medium text-accent-violet"
                  : "border-transparent text-ink-muted hover:border-ink-muted hover:text-ink"
              }`}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

export function TableOfContents({ items, variant }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (items.length === 0) return;

    let frame = 0;

    const updateActiveHeading = () => {
      frame = 0;
      const headingElements = items
        .map((item) => document.getElementById(item.id))
        .filter((element): element is HTMLElement => element !== null);

      if (headingElements.length === 0) return;

      const isAtPageBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

      if (isAtPageBottom) {
        setActiveId(headingElements.at(-1)?.id ?? items[0].id);
        return;
      }

      const current = [...headingElements]
        .reverse()
        .find((heading) => heading.getBoundingClientRect().top <= 128);

      setActiveId(current?.id ?? headingElements[0].id);
    };

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveHeading);
    };

    updateActiveHeading();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [items]);

  if (items.length === 0) return null;

  if (variant === "mobile") {
    return (
      <details
        ref={detailsRef}
        className="group mb-10 rounded-xl border border-surface-border bg-surface-subtle p-4 xl:hidden"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-ink [&::-webkit-details-marker]:hidden">
          <span>목차</span>
          <svg
            className="h-4 w-4 text-ink-muted transition-transform group-open:rotate-180"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="m4 6 4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </summary>
        <nav aria-label="글 목차" className="mt-4">
          <ContentsLinks
            items={items}
            activeId={activeId}
            onNavigate={() => {
              if (detailsRef.current) detailsRef.current.open = false;
            }}
          />
        </nav>
      </details>
    );
  }

  return (
    <nav aria-label="글 목차">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
        목차
      </p>
      <ContentsLinks items={items} activeId={activeId} />
    </nav>
  );
}
