import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface/60">
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-lg font-extrabold tracking-[-0.03em] text-ink">sanghun.log</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-secondary">
              개발하며 마주친 질문과 배운 것을 오래 남길 수 있는 글로 정리합니다.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/archives" className="editorial-label text-ink-muted transition-colors hover:text-ink">
              Archive
            </Link>
            <span className="h-1 w-1 rounded-full bg-accent-violet" />
            <p className="editorial-label text-ink-muted">
              &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
