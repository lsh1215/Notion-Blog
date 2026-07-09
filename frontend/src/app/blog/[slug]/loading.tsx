export default function BlogPostLoading() {
  return (
    <article className="pb-24 pt-24 md:pt-28">
      {/* Back link */}
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-6 h-4 w-36 animate-pulse rounded-md bg-surface-muted" />
      </div>

      {/* Cover Image — wide cropped banner */}
      <div className="mx-auto mb-8 max-w-5xl px-6">
        <div className="h-40 w-full animate-pulse overflow-hidden rounded-2xl bg-surface-muted sm:h-48 md:h-56 lg:h-64" />
      </div>

      <div className="mx-auto max-w-3xl px-6">
        {/* Post Header — title → subtitle → tags */}
        <header className="mb-10">
          {/* Title — two lines */}
          <div className="space-y-3">
            <div className="h-9 w-full animate-pulse rounded-lg bg-surface-muted md:h-10 lg:h-[46px]" />
            <div className="h-9 w-4/5 animate-pulse rounded-lg bg-surface-muted md:h-10 lg:h-[46px]" />
          </div>

          {/* Description */}
          <div className="mt-4 h-6 w-3/4 animate-pulse rounded-md bg-surface-muted" />

          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            <div className="h-6 w-16 animate-pulse rounded-full bg-surface-muted" />
            <div className="h-6 w-20 animate-pulse rounded-full bg-surface-muted" />
            <div className="h-6 w-14 animate-pulse rounded-full bg-surface-muted" />
          </div>

          {/* Date */}
          <div className="mt-4 h-4 w-28 animate-pulse rounded-md bg-surface-muted" />
        </header>

        {/* Content — prose body */}
        <div className="space-y-10">
          {/* Paragraph block 1 */}
          <div className="space-y-2.5">
            <div className="h-[1.125rem] w-full animate-pulse rounded-md bg-surface-muted" />
            <div className="h-[1.125rem] w-full animate-pulse rounded-md bg-surface-muted" />
            <div className="h-[1.125rem] w-11/12 animate-pulse rounded-md bg-surface-muted" />
            <div className="h-[1.125rem] w-4/5 animate-pulse rounded-md bg-surface-muted" />
          </div>

          {/* Section heading */}
          <div className="h-7 w-2/5 animate-pulse rounded-lg bg-surface-muted" />

          {/* Paragraph block 2 */}
          <div className="space-y-2.5">
            <div className="h-[1.125rem] w-full animate-pulse rounded-md bg-surface-muted" />
            <div className="h-[1.125rem] w-full animate-pulse rounded-md bg-surface-muted" />
            <div className="h-[1.125rem] w-10/12 animate-pulse rounded-md bg-surface-muted" />
          </div>

          {/* Code block */}
          <div className="animate-pulse overflow-hidden rounded-xl bg-surface-muted p-5">
            <div className="space-y-2">
              <div className="h-3.5 w-3/5 rounded-sm bg-surface-border" />
              <div className="h-3.5 w-4/5 rounded-sm bg-surface-border" />
              <div className="h-3.5 w-1/2 rounded-sm bg-surface-border" />
              <div className="h-3.5 w-2/3 rounded-sm bg-surface-border" />
              <div className="h-3.5 w-3/4 rounded-sm bg-surface-border" />
            </div>
          </div>

          {/* Paragraph block 3 */}
          <div className="space-y-2.5">
            <div className="h-[1.125rem] w-full animate-pulse rounded-md bg-surface-muted" />
            <div className="h-[1.125rem] w-full animate-pulse rounded-md bg-surface-muted" />
            <div className="h-[1.125rem] w-9/12 animate-pulse rounded-md bg-surface-muted" />
            <div className="h-[1.125rem] w-full animate-pulse rounded-md bg-surface-muted" />
            <div className="h-[1.125rem] w-7/12 animate-pulse rounded-md bg-surface-muted" />
          </div>
        </div>
      </div>
    </article>
  );
}
