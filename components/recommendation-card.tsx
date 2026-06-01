import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import type { AboutQueryResult } from "@/sanity/types.gen";

type Rec = NonNullable<AboutQueryResult["recommendations"]>[number];

export function RecommendationCard({ rec }: { rec: Rec }) {
  const photo = rec.headshot?.asset ? urlForImage(rec.headshot).width(120).height(120).url() : null;
  return (
    <article className="rounded-md border border-line-editorial-light p-6 dark-editorial:border-line-editorial-dark">
      <blockquote className="text-base leading-relaxed">&ldquo;{rec.quote}&rdquo;</blockquote>
      <footer className="mt-4 flex items-center gap-3">
        {photo && (
          <Image src={photo} alt={rec.name ?? ""} width={48} height={48} className="rounded-full" />
        )}
        <div>
          <p className="text-sm font-medium">{rec.name}</p>
          {rec.role && (
            <p className="text-xs text-muted-editorial-light dark-editorial:text-muted-editorial-dark">
              {rec.role}
              {rec.company && ` @ ${rec.company}`}
            </p>
          )}
        </div>
      </footer>
    </article>
  );
}
