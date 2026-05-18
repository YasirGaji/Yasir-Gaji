import Link from "next/link";
import { RecommendationCard } from "@/components/recommendation-card";
import { buttonVariants } from "@/components/ui/button";
import { client } from "@/sanity/lib/client";
import { aboutQuery } from "@/sanity/lib/queries";

export const metadata = {
  title: "About",
  description: "Who Yasir is, what he's building, and how he works.",
};

export default async function AboutPage() {
  const data = await client.fetch(aboutQuery);
  const settings = data?.settings;
  const recs = data?.recommendations ?? [];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <header>
        <h1 className="font-display text-4xl font-medium md:text-5xl">About</h1>
        {settings?.location && (
          <p className="mt-3 text-lg text-muted-editorial-light dark-editorial:text-muted-editorial-dark">
            {settings.location}
          </p>
        )}
      </header>

      {settings?.bio && <p className="mt-10 text-lg leading-relaxed">{settings.bio}</p>}

      {recs.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-medium">Recommendations</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {recs.map((r) => (
              <RecommendationCard key={r._id} rec={r} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-16">
        <h2 className="font-display text-2xl font-medium">Available for</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>Senior IC / Staff engineer roles in Applied AI or platform/backend</li>
          <li>Founding-engineer roles at AI-first startups</li>
          <li>Advisor / fractional architecture engagements</li>
        </ul>
        {settings?.calcomUrl ? (
          <a
            href={settings.calcomUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonVariants()} mt-6`}
          >
            Book a 15-minute intro →
          </a>
        ) : (
          <Link href="/contact" className={`${buttonVariants()} mt-6`}>
            Get in touch
          </Link>
        )}
      </section>
    </div>
  );
}
