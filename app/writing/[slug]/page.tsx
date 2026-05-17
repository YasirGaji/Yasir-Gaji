import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@/components/portable-text";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { allArticleSlugsQuery, articleBySlugQuery } from "@/sanity/lib/queries";

export async function generateStaticParams() {
  const slugs = await client.fetch(allArticleSlugsQuery);
  return (slugs ?? []).filter((s): s is string => !!s).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await client.fetch(articleBySlugQuery, { slug });
  if (!data) return {};
  return {
    title: data.title ?? "Article",
    description: data.excerpt ?? undefined,
    alternates: data.canonicalUrl ? { canonical: data.canonicalUrl } : undefined,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await client.fetch(articleBySlugQuery, { slug });
  if (!data) notFound();

  const cover = data.coverImage?.asset ? urlForImage(data.coverImage).width(1600).url() : null;
  const date = data.publishedAt
    ? new Date(data.publishedAt).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <article className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <header>
        {data.series?.title && (
          <Link
            href={`/writing#${data.series.slug?.current}`}
            className="font-mono text-sm uppercase tracking-wide text-accent-editorial"
          >
            {data.series.title}
          </Link>
        )}
        <h1 className="mt-3 font-display text-4xl font-medium leading-tight md:text-5xl">
          {data.title}
        </h1>
        <p className="mt-3 text-sm text-muted-editorial-light dark-editorial:text-muted-editorial-dark">
          {date}
          {data.readingTime && ` · ${data.readingTime} min read`}
        </p>
      </header>

      {cover && (
        <Image
          src={cover}
          alt={data.title ?? ""}
          width={1600}
          height={900}
          className="mt-8 rounded-md"
          priority
        />
      )}

      <div className="mt-10">
        <PortableText value={data.body} />
      </div>

      {data.mediumUrl && (
        <p className="mt-12 text-sm text-muted-editorial-light dark-editorial:text-muted-editorial-dark">
          Also published on{" "}
          <a
            href={data.mediumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            Medium
          </a>
          .
        </p>
      )}
    </article>
  );
}
