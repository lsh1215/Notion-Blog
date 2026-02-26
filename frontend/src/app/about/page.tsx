import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "블로그 소개와 운영자 정보입니다.",
};

export default function AboutPage() {
  return (
    <section className="px-6 pb-24 pt-24 md:pt-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-semibold tracking-display text-ink md:text-5xl">
            About
          </h1>
        </div>

        <div className="prose mx-auto">
          {/* Profile */}
          <div className="mb-12 flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-violet-light to-surface-muted">
              <span className="text-3xl font-bold text-accent-violet">L</span>
            </div>
            <div>
              <h2 className="mt-0 mb-1">안녕하세요!</h2>
              <p className="text-ink-secondary mt-0">
                개발과 기술에 관심이 많은 개발자입니다.
                이 블로그에서는 개발하면서 배운 것들과 생각을 정리합니다.
              </p>
            </div>
          </div>

          <hr />

          <h2>Skills</h2>
          <div className="flex flex-wrap gap-2 not-prose">
            {[
              "TypeScript",
              "React",
              "Next.js",
              "Node.js",
              "Tailwind CSS",
              "PostgreSQL",
              "Docker",
              "Git",
            ].map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-surface-muted px-3 py-1 text-sm font-medium text-ink-secondary"
              >
                {skill}
              </span>
            ))}
          </div>

          <h2>Contact</h2>
          <ul>
            <li>
              GitHub:{" "}
              <a
                href="https://github.com/lsh1215"
                target="_blank"
                rel="noopener noreferrer"
              >
                @lsh1215
              </a>
            </li>
            <li>Blog: 이 사이트</li>
          </ul>

          <hr />

          <h2>About This Blog</h2>
          <p>
            이 블로그는 <strong>Next.js</strong>와 <strong>Notion API</strong>를
            사용하여 구축되었습니다. 노션에 글을 작성하면 자동으로 블로그에
            반영됩니다.
          </p>
          <ul>
            <li>Framework: Next.js (App Router)</li>
            <li>Styling: Tailwind CSS</li>
            <li>CMS: Notion</li>
            <li>Deploy: Vercel</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
