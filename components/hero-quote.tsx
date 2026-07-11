import { client } from "@/sanity/lib/client";
import { heroQuoteQuery } from "@/sanity/lib/queries";

function ExternalLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

export async function HeroQuote() {
  const q = await client.fetch(heroQuoteQuery);
  if (!q) return null;

  const quote = <>&ldquo;{q.quote}&rdquo;</>;

  return (
    <figure className="mt-10 border-l-2 border-accent-editorial pl-6">
      <blockquote className="text-lg leading-relaxed text-muted-editorial-light dark-editorial:text-muted-editorial-dark">
        {q.recommendationUrl ? (
          <ExternalLink href={q.recommendationUrl}>{quote}</ExternalLink>
        ) : (
          quote
        )}
      </blockquote>
      <figcaption className="mt-3 text-sm">
        —{" "}
        {q.linkedinUrl ? (
          <ExternalLink
            href={q.linkedinUrl}
            className="underline underline-offset-4 hover:text-accent-editorial"
          >
            <strong>{q.name}</strong>
          </ExternalLink>
        ) : (
          <strong>{q.name}</strong>
        )}
        {q.role && `, ${q.role}`}
        {q.company && (
          <>
            {" @ "}
            {q.companyUrl ? (
              <ExternalLink
                href={q.companyUrl}
                className="underline underline-offset-4 hover:text-accent-editorial"
              >
                {q.company}
              </ExternalLink>
            ) : (
              q.company
            )}
          </>
        )}
      </figcaption>
    </figure>
  );
}
