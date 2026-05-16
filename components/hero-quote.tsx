import { client } from "@/sanity/lib/client";
import { heroQuoteQuery } from "@/sanity/lib/queries";

export async function HeroQuote() {
  const q = await client.fetch(heroQuoteQuery);
  if (!q) return null;
  return (
    <figure className="mt-10 border-l-2 border-accent-editorial pl-6">
      <blockquote className="text-lg leading-relaxed text-muted-editorial-light dark-editorial:text-muted-editorial-dark">
        &ldquo;{q.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-3 text-sm">
        — <strong>{q.name}</strong>
        {q.role && `, ${q.role}`}
        {q.company && ` @ ${q.company}`}
      </figcaption>
    </figure>
  );
}
