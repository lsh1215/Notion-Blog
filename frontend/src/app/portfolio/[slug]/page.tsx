import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getPortfolioBySlug,
  mockPortfolioProjects,
  mockPostContent,
} from "@/lib/mock-data";
import { renderMarkdown } from "@/lib/markdown";
import type { Metadata } from "next";

interface PortfolioDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return mockPortfolioProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PortfolioDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getPortfolioBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function PortfolioDetailPage({
  params,
}: PortfolioDetailPageProps) {
  const { slug } = await params;
  const project = getPortfolioBySlug(slug);

  if (!project) {
    notFound();
  }

  const contentHtml = renderMarkdown(mockPostContent);

  return (
    <article className="px-6 pb-24 pt-24 md:pt-32">
      <div className="mx-auto max-w-3xl">
        {/* Back link */}
        <Link
          href="/portfolio"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="rotate-180"
          >
            <path
              d="M6 3l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          포트폴리오로 돌아가기
        </Link>

        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-display text-ink md:text-4xl">
            {project.title}
          </h1>
          <p className="mt-4 text-lg text-ink-secondary">
            {project.description}
          </p>

          {/* Meta info */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-ink-muted">
            <span>{project.period}</span>
            <span className="text-surface-border">|</span>
            <span>{project.role}</span>
          </div>

          {/* Tech stack */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-accent-violet-light px-3 py-1 text-xs font-medium text-accent-violet"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Links */}
          {project.links && project.links.length > 0 && (
            <div className="mt-4 flex gap-3">
              {project.links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-surface-border px-4 py-1.5 text-sm font-medium text-ink-secondary transition-colors hover:border-accent-violet hover:text-accent-violet"
                >
                  {link.label}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M5 2h7v7M12 2L2 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </header>

        {/* Cover Image */}
        {project.coverImage && (
          <div className="relative mb-12 aspect-[2/1] w-full overflow-hidden rounded-2xl">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        {/* Content — will be replaced with Notion block renderer */}
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </article>
  );
}
