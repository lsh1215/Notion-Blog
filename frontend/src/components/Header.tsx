"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { href: "/blog", label: "Posts" },
  { href: "/categories", label: "Topics" },
  { href: "/tags", label: "Tags" },
  { href: "/archives", label: "Archives" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border/80 bg-surface/70 backdrop-blur-xl">
      <a
        href="#main"
        className="sr-only rounded bg-ink px-4 py-2 text-surface focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        본문으로 건너뛰기
      </a>
      <div className="mx-auto flex h-[76px] max-w-6xl items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 text-base font-extrabold tracking-[-0.03em] text-ink"
        >
          <span className="h-3 w-3 rounded-full bg-accent-violet shadow-[0_0_0_5px_var(--color-accent-violet-light)] transition-transform group-hover:scale-110" />
          sanghun.log
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden items-center rounded-full border border-surface-border bg-surface/85 p-1.5 shadow-[0_8px_24px_rgba(10,10,15,0.06)] md:flex">
            <nav className="flex items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-[13px] font-medium tracking-ui transition-colors ${
                    isActive(link.href)
                      ? "bg-ink text-surface"
                      : "text-ink-secondary hover:bg-surface-muted hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <span className="mx-1 h-5 w-px bg-surface-border" />
            <ThemeToggle />
          </div>

          <div className="md:hidden">
            <ThemeToggle />
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-surface-border bg-surface transition-colors hover:bg-surface-subtle md:hidden"
            aria-label="Toggle menu"
          >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {mobileOpen ? (
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            ) : (
              <>
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-surface-border bg-surface/95 px-5 py-4 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-xl px-3 py-3 text-sm font-medium tracking-ui transition-colors ${
                  isActive(link.href)
                    ? "bg-surface-muted text-ink"
                    : "text-ink-muted hover:bg-surface-subtle hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
