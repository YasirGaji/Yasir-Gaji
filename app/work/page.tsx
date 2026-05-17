import { CaseStudyCard } from "@/components/case-study-card";
import { client } from "@/sanity/lib/client";
import { allCaseStudiesQuery } from "@/sanity/lib/queries";

export const metadata = {
  title: "Work",
  description: "Selected case studies — Applied AI, backend, founder.",
};

export default async function WorkIndexPage() {
  const cases = await client.fetch(allCaseStudiesQuery);
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-medium md:text-5xl">Work</h1>
        <p className="mt-3 text-lg text-muted-editorial-light dark-editorial:text-muted-editorial-dark">
          Selected case studies. Each one details the problem, architecture, my role, and outcome.
        </p>
      </header>

      {cases && cases.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <CaseStudyCard key={c._id} card={c} />
          ))}
        </div>
      ) : (
        <p className="mt-12 italic">No case studies published yet.</p>
      )}
    </div>
  );
}
