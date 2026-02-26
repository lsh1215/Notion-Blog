export function Footer() {
  return (
    <footer className="bg-dark-bg text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="font-display text-lg font-bold">Blog</p>
          <p className="text-sm text-white/50">
            개발과 기술에 대한 생각을 기록합니다.
          </p>
          <div className="h-px w-full max-w-xs bg-dark-border" />
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
