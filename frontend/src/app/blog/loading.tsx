export default function BlogLoading() {
  return (
    <section className="px-6 pb-24 pt-24 md:pt-32">
      <div className="mx-auto max-w-5xl">
        {/* Page Header Skeleton */}
        <div className="mb-12 flex flex-col items-center gap-4">
          {/* Title */}
          <div className="h-10 w-32 animate-pulse rounded-lg bg-surface-muted md:h-12 md:w-40" />
          {/* Description */}
          <div className="h-5 w-72 animate-pulse rounded-md bg-surface-muted md:w-80" />
        </div>

        {/* SearchBar Skeleton */}
        <div className="relative mb-10">
          <div className="h-11 w-full animate-pulse rounded-xl bg-surface-muted" />
        </div>

        {/* Post Card Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl bg-surface-subtle shadow-card"
            >
              {/* Cover image area — aspect-[2/1] */}
              <div className="relative aspect-[2/1] w-full animate-pulse bg-surface-muted" />

              {/* Card body */}
              <div className="flex flex-col gap-3 p-6">
                {/* Category — text-xs, narrow */}
                <div className="h-3 w-16 animate-pulse rounded bg-surface-muted" />

                {/* Title — text-lg, two lines */}
                <div className="flex flex-col gap-2">
                  <div className="h-5 w-full animate-pulse rounded bg-surface-muted" />
                  <div className="h-5 w-4/5 animate-pulse rounded bg-surface-muted" />
                </div>

                {/* Description — text-sm, line-clamp-2 */}
                <div className="flex flex-col gap-1.5">
                  <div className="h-4 w-full animate-pulse rounded bg-surface-muted" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-surface-muted" />
                </div>

                {/* Date — text-xs, short */}
                <div className="h-3 w-24 animate-pulse rounded bg-surface-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
