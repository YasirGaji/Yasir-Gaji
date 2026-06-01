import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";
import type { HomeFeaturedQueryResult } from "@/sanity/types.gen";

type Card = NonNullable<HomeFeaturedQueryResult>[number];

export function CaseStudyCard({ card }: { card: Card }) {
  const hero = card.heroImage?.asset ? urlForImage(card.heroImage).width(800).url() : null;
  return (
    <Link
      href={`/work/${card.slug?.current}`}
      className="group block overflow-hidden rounded-md border border-line-editorial-light transition hover:-translate-y-0.5 dark-editorial:border-line-editorial-dark"
    >
      {hero && (
        <Image
          src={hero}
          alt={card.title ?? ""}
          width={800}
          height={500}
          className="aspect-[8/5] w-full object-cover"
        />
      )}
      <div className="p-5">
        <h3 className="font-display text-lg font-medium">{card.title}</h3>
        {card.role && (
          <p className="mt-1 text-sm text-muted-editorial-light dark-editorial:text-muted-editorial-dark">
            {card.role}
            {card.company && ` · ${card.company}`}
          </p>
        )}
        {card.stack && card.stack.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {card.stack.slice(0, 4).map((t) => (
              <li
                key={t}
                className="rounded-full border border-line-editorial-light px-2 py-0.5 font-mono text-xs dark-editorial:border-line-editorial-dark"
              >
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
