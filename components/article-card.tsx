import Link from "next/link";
import type { HomeLatestArticlesQueryResult } from "@/sanity/types.gen";

type Card = NonNullable<HomeLatestArticlesQueryResult>[number];

export function ArticleCard({ card }: { card: Card }) {
  const date = card.publishedAt ? new Date(card.publishedAt).toLocaleDateString("en-GB") : "";
  return (
    <Link
      href={`/writing/${card.slug?.current}`}
      className="block border-b border-line-editorial-light py-5 last:border-b-0 dark-editorial:border-line-editorial-dark"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-lg font-medium">{card.title}</h3>
        {date && (
          <time className="shrink-0 font-mono text-xs text-muted-editorial-light dark-editorial:text-muted-editorial-dark">
            {date}
          </time>
        )}
      </div>
      {card.excerpt && (
        <p className="mt-2 text-sm leading-relaxed text-muted-editorial-light dark-editorial:text-muted-editorial-dark">
          {card.excerpt}
        </p>
      )}
      {card.series?.title && (
        <p className="mt-2 font-mono text-xs uppercase tracking-wide text-accent-editorial">
          {card.series.title}
        </p>
      )}
    </Link>
  );
}
