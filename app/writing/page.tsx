import { ArticleCard } from "@/components/article-card";
import { client } from "@/sanity/lib/client";
import { allArticlesQuery, articleSeriesAllQuery } from "@/sanity/lib/queries";

export const metadata = {
  title: "Writing",
  description: "Essays, playbooks, and notes on Applied AI and backend systems.",
};

export default async function WritingIndexPage() {
  const [articles, series] = await Promise.all([
    client.fetch(allArticlesQuery),
    client.fetch(articleSeriesAllQuery),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <header>
        <h1 className="font-display text-4xl font-medium md:text-5xl">Writing</h1>
        <p className="mt-3 text-lg text-muted-editorial-light dark-editorial:text-muted-editorial-dark">
          Essays, playbooks, and notes.
        </p>
      </header>

      {series && series.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium">Series</h2>
          <ul className="mt-4 space-y-6">
            {series.map((s) => (
              <li
                key={s._id}
                className="rounded-md border border-line-editorial-light p-5 dark-editorial:border-line-editorial-dark"
              >
                <h3 className="font-display text-xl font-medium">{s.title}</h3>
                {s.description && (
                  <p className="mt-1 text-sm text-muted-editorial-light dark-editorial:text-muted-editorial-dark">
                    {s.description}
                  </p>
                )}
                {s.articles && s.articles.length > 0 && (
                  <ol className="mt-3 space-y-1 text-sm">
                    {s.articles.map((a, i) => (
                      <li key={a._id}>
                        <span className="mr-2 font-mono text-xs text-muted-editorial-light dark-editorial:text-muted-editorial-dark">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <a
                          href={`/writing/${a.slug?.current}`}
                          className="underline underline-offset-4"
                        >
                          {a.title}
                        </a>
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-16">
        <h2 className="font-display text-2xl font-medium">All articles</h2>
        {articles && articles.length > 0 ? (
          <div className="mt-4">
            {articles.map((a) => (
              <ArticleCard key={a._id} card={a} />
            ))}
          </div>
        ) : (
          <p className="mt-4 italic">No articles published yet.</p>
        )}
      </section>
    </div>
  );
}
