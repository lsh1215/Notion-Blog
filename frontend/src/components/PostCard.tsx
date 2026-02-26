import Link from "next/link";
import Image from "next/image";
import { Tag } from "@/components/Tag";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/lib/mock-data";

interface PostCardProps {
  post: BlogPost;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="overflow-hidden rounded-2xl shadow-card transition-shadow duration-200 hover:shadow-card-hover">
        {post.coverImage && (
          <div className="relative aspect-[2/1] w-full overflow-hidden bg-surface-subtle">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="flex flex-col gap-3 p-6">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
          <h2 className="text-lg font-semibold tracking-heading text-ink transition-colors group-hover:text-accent-violet">
            {post.title}
          </h2>
          <p className="line-clamp-2 text-sm leading-relaxed text-ink-secondary">
            {post.description}
          </p>
          <time
            dateTime={post.publishedDate}
            className="text-xs tracking-ui text-ink-muted"
          >
            {formatDate(post.publishedDate)}
          </time>
        </div>
      </article>
    </Link>
  );
}
