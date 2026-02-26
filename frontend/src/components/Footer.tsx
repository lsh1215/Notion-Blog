export function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface-subtle">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="font-display text-lg font-bold text-ink">Blog</p>
          <p className="text-sm text-ink-secondary">
            개발과 기술에 대한 생각을 기록합니다.
          </p>
          <div className="h-px w-full max-w-xs bg-surface-border" />
          <p className="text-xs text-ink-muted">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
