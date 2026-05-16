import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { CaseStudyCard } from "@/components/case-study-card";
import { HeroQuote } from "@/components/hero-quote";
import { buttonVariants } from "@/components/ui/button";
import { client } from "@/sanity/lib/client";
import {
  homeFeaturedQuery,
  homeLatestArticlesQuery,
  siteSettingsQuery,
} from "@/sanity/lib/queries";

export default async function HomePage() {
  const [settings, featured, latest] = await Promise.all([
    client.fetch(siteSettingsQuery),
    client.fetch(homeFeaturedQuery),
    client.fetch(homeLatestArticlesQuery),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <section>
        <h1 className="font-display text-4xl font-medium leading-tight md:text-5xl">Yasir Gaji</h1>
        <p className="mt-3 text-lg text-muted-editorial-light dark-editorial:text-muted-editorial-dark">
          Senior Software Engineer · Applied AI & Backend Architecture
        </p>
        {settings?.bio && <p className="mt-6 text-lg leading-relaxed">{settings.bio}</p>}
        <HeroQuote />
      </section>

      {featured && featured.length > 0 && (
        <section className="mt-20">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-medium">Currently shipping</h2>
            <Link href="/work" className="text-sm underline underline-offset-4">
              All work →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {featured.map((c) => (
              <CaseStudyCard key={c._id} card={c} />
            ))}
          </div>
        </section>
      )}

      {latest && latest.length > 0 && (
        <section className="mt-20">
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-medium">Recent writing</h2>
            <Link href="/writing" className="text-sm underline underline-offset-4">
              All writing →
            </Link>
          </div>
          <div>
            {latest.map((a) => (
              <ArticleCard key={a._id} card={a} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-20 rounded-md border border-line-editorial-light p-8 text-center dark-editorial:border-line-editorial-dark">
        <h2 className="font-display text-2xl font-medium">
          Available for senior IC + AI architect roles
        </h2>
        <p className="mt-3 text-muted-editorial-light dark-editorial:text-muted-editorial-dark">
          15-minute intro, no slides, real questions only.
        </p>
        {settings?.calcomUrl ? (
          <a
            href={settings.calcomUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "default", className: "mt-5" })}
          >
            Book a call
          </a>
        ) : (
          <Link
            href="/contact"
            className={buttonVariants({ variant: "default", className: "mt-5" })}
          >
            Get in touch
          </Link>
        )}
      </section>
    </div>
  );
}
