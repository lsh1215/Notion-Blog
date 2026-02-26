import Link from "next/link";
import Image from "next/image";
import { mockPortfolioProjects } from "@/lib/mock-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "프로젝트 포트폴리오입니다.",
};

export default function PortfolioPage() {
  return (
    <section className="px-6 pb-24 pt-24 md:pt-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-semibold tracking-display text-ink md:text-5xl">
            Portfolio
          </h1>
          <p className="mt-4 text-lg text-ink-secondary">
            그동안 진행한 프로젝트들을 소개합니다.
          </p>
        </div>

        <div className="space-y-8">
          {mockPortfolioProjects.map((project) => (
            <Link
              key={project.id}
              href={`/portfolio/${project.slug}`}
              className="group block overflow-hidden rounded-2xl border border-surface-border bg-surface-subtle transition-all hover:border-accent-violet/30 hover:shadow-card-hover"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                {project.coverImage && (
                  <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-surface-subtle md:aspect-auto md:w-80">
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 320px"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-1 flex-col justify-center gap-3 p-6 md:p-8">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold tracking-heading text-ink group-hover:text-accent-violet">
                      {project.title}
                    </h2>
                    <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-xs text-ink-muted">
                      {project.role}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-ink-secondary">
                    {project.description}
                  </p>

                  <p className="text-xs text-ink-muted">{project.period}</p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-accent-violet-light px-2.5 py-0.5 text-xs font-medium text-accent-violet"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
