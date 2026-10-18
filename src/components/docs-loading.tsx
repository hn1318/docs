import { Loader2 } from 'lucide-react';

/**
 * Skeleton shown while a docs page is being fetched.
 *
 * Rendered by `loading.tsx` inside the docs layout, so the sidebar / header
 * stay put and only the article column is replaced by placeholders.
 * The shimmer + spinner make a slow navigation feel intentional instead of
 * looking like the click did nothing.
 */
export function DocsLoading() {
  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8" aria-busy="true" aria-live="polite">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-2 text-xs text-fd-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          <span className="h-3 w-16 animate-pulse rounded bg-fd-muted" />
        </div>

        {/* title + description */}
        <div className="mt-6 h-9 w-2/5 animate-pulse rounded-lg bg-fd-muted" />
        <div className="mt-4 h-4 w-3/5 animate-pulse rounded bg-fd-muted/60" />

        {/* body paragraphs */}
        <div className="mt-10 space-y-3">
          {[92, 100, 84, 96, 72].map((w, i) => (
            <div
              key={i}
              className="h-3.5 animate-pulse rounded bg-fd-muted/50"
              style={{ width: `${w}%`, animationDelay: `${i * 90}ms` }}
            />
          ))}
        </div>

        <div className="mt-8 space-y-3">
          <div className="h-5 w-1/4 animate-pulse rounded bg-fd-muted" />
          {[88, 96, 76].map((w, i) => (
            <div
              key={i}
              className="h-3.5 animate-pulse rounded bg-fd-muted/50"
              style={{ width: `${w}%`, animationDelay: `${i * 90}ms` }}
            />
          ))}
        </div>

        {/* code-ish block */}
        <div className="mt-8 h-24 animate-pulse rounded-xl border border-fd-border bg-fd-muted/30" />
      </div>
    </div>
  );
}
