import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@/components/portable-text";
import { StackTag } from "@/components/stack-tag";
import { Separator } from "@/components/ui/separator";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { allCaseStudySlugsQuery, caseStudyBySlugQuery } from "@/sanity/lib/queries";

export async function generateStaticParams() {
  const slugs = await client.fetch(allCaseStudySlugsQuery);
  return (slugs ?? []).filter((s): s is string => !!s).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await client.fetch(caseStudyBySlugQuery, { slug });
  if (!data) return {};
  return {
    title: data.title ?? "Case study",
    description: data.role ? `${data.role} at ${data.company ?? ""}`.trim() : undefined,
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await client.fetch(caseStudyBySlugQuery, { slug });
  if (!data) notFound();

  const hero = data.heroImage?.asset ? urlForImage(data.heroImage).width(1600).url() : null;
  const start = data.startDate ? new Date(data.startDate).getFullYear() : "";
  const end = data.endDate ? new Date(data.endDate).getFullYear() : "present";

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <header>
        <p className="font-mono text-sm uppercase tracking-wide text-accent-editorial">
          {data.role}
          {data.company && ` · ${data.company}`}
        </p>
        <h1 className="mt-3 font-display text-4xl font-medium leading-tight md:text-5xl">
          {data.title}
        </h1>
        <p className="mt-3 text-sm text-muted-editorial-light dark-editorial:text-muted-editorial-dark">
          {start} – {end}
        </p>
        {data.stack && data.stack.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {data.stack.map((t) => (
              <StackTag key={t}>{t}</StackTag>
            ))}
          </ul>
        )}
      </header>

      {hero && (
        <Image
          src={hero}
          alt={data.title ?? ""}
          width={1600}
          height={1000}
          className="mt-10 rounded-md"
          priority
        />
      )}

      {data.problem && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium">Problem</h2>
          <PortableText value={data.problem} />
        </section>
      )}

      {data.architecture && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium">Architecture</h2>
          <PortableText value={data.architecture} />
        </section>
      )}

      {data.myRole && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium">My role</h2>
          <PortableText value={data.myRole} />
        </section>
      )}

      {data.outcome && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium">Outcome</h2>
          <PortableText value={data.outcome} />
        </section>
      )}

      {data.liveUrl && (
        <p className="mt-10">
          <a
            href={data.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-accent-editorial"
          >
            Live: {data.liveUrl} →
          </a>
        </p>
      )}

      {data.relatedArticles && data.relatedArticles.length > 0 && (
        <>
          <Separator className="my-16" />
          <section>
            <h2 className="font-display text-xl font-medium">Related writing</h2>
            <ul className="mt-4 space-y-3">
              {data.relatedArticles.map((a) => (
                <li key={a._id}>
                  <Link
                    href={`/writing/${a.slug?.current}`}
                    className="underline underline-offset-4"
                  >
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </article>
  );
}
