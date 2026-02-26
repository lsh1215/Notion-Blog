import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "프로젝트 포트폴리오입니다.",
};

export default function PortfolioPage() {
  return (
    <section className="px-6 pb-24 pt-24 md:pt-32">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-display text-ink md:text-5xl">
            Portfolio
          </h1>
          <p className="mt-4 text-lg text-ink-secondary">
            그동안 진행한 프로젝트들을 소개합니다.
          </p>
          <div className="mt-16 rounded-2xl border border-surface-border bg-surface-subtle p-12">
            <p className="text-sm text-ink-muted">
              준비 중입니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
