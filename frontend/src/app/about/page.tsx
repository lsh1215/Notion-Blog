import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "블로그 소개와 운영자 정보입니다.",
};

export default function AboutPage() {
  return (
    <section className="px-6 pb-24 pt-24 md:pt-32">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-display text-ink md:text-5xl">
            About
          </h1>
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
