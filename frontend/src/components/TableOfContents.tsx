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

interface ContentsGroup {
  parent: TableOfContentsItem;
  children: TableOfContentsItem[];
}

function groupContents(items: TableOfContentsItem[]): ContentsGroup[] {
  const topLevel = Math.min(...items.map((item) => item.level));
  const groups: ContentsGroup[] = [];

  for (const item of items) {
    if (item.level === topLevel || groups.length === 0) {
      groups.push({ parent: item, children: [] });
    } else {
      groups.at(-1)?.children.push(item);
    }
  }

  return groups;
}

function DesktopContentsLinks({
  items,
  activeId,
}: {
  items: TableOfContentsItem[];
  activeId: string;
}) {
  return (
    <ol className="border-l border-surface-border">
      {groupContents(items).map(({ parent, children }) => {
        const isParentActive = parent.id === activeId;
        const hasActiveChild = children.some((child) => child.id === activeId);

        return (
          <li key={parent.id} className="group/toc">
            <a
              href={`#${parent.id}`}
              aria-current={isParentActive ? "location" : undefined}
              className={`-ml-px flex items-center justify-between gap-2 border-l py-2 pl-3 pr-2 text-sm leading-5 transition-colors ${
                isParentActive
                  ? "border-accent-violet font-semibold text-accent-violet"
                  : hasActiveChild
                    ? "border-accent-violet font-semibold text-ink"
                    : "border-transparent font-medium text-ink-muted hover:border-ink-muted hover:text-ink"
              }`}
            >
              <span>{parent.text}</span>
              {children.length > 0 && (
                <svg
                  className={`h-3 w-3 shrink-0 transition-transform duration-200 group-hover/toc:rotate-180 group-focus-within/toc:rotate-180 ${
                    hasActiveChild ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="m3 4.5 3 3 3-3"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </a>

            {children.length > 0 && (
              <ol
                className={`ml-3 max-h-0 overflow-hidden border-l border-surface-border/70 opacity-0 transition-[max-height,opacity] duration-200 group-hover/toc:max-h-96 group-hover/toc:opacity-100 group-focus-within/toc:max-h-96 group-focus-within/toc:opacity-100 ${
                  hasActiveChild ? "max-h-96 opacity-100" : ""
                }`}
              >
                {children.map((child) => {
                  const isActive = child.id === activeId;
                  const indentation = child.level > parent.level + 1 ? "pl-6" : "pl-4";

                  return (
                    <li key={child.id}>
                      <a
                        href={`#${child.id}`}
                        aria-current={isActive ? "location" : undefined}
                        className={`-ml-px block border-l py-1.5 pr-2 text-xs leading-5 transition-colors ${indentation} ${
                          isActive
                            ? "border-accent-violet font-medium text-accent-violet"
                            : "border-transparent text-ink-muted hover:border-ink-muted hover:text-ink"
                        }`}
                      >
                        {child.text}
                      </a>
                    </li>
                  );
                })}
              </ol>
            )}
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
      <DesktopContentsLinks items={items} activeId={activeId} />
    </nav>
  );
}
