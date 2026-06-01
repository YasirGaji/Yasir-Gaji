import { PortableText } from "@/components/portable-text";
import { client } from "@/sanity/lib/client";
import { resumeQuery } from "@/sanity/lib/queries";
import type { ResumeQueryResult } from "@/sanity/types.gen";

export const metadata = {
  title: "Resume",
  description: "Yasir Gaji — Senior Software Engineer · Applied AI & Backend Architecture",
};

const groupTitles: Record<string, string> = {
  languages: "Languages",
  "applied-ai": "Applied AI",
  "backend-cloud": "Backend & Cloud",
  frontend: "Frontend",
};

type Skill = NonNullable<ResumeQueryResult["skills"]>[number];

export default async function ResumePage() {
  const data = await client.fetch(resumeQuery);
  const settings = data?.settings;
  const experience = data?.experience ?? [];
  const skills = data?.skills ?? [];

  const skillsByGroup = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    if (!s.group) return acc;
    const bucket = acc[s.group] ?? [];
    bucket.push(s);
    acc[s.group] = bucket;
    return acc;
  }, {});

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <header>
        <h1 className="font-display text-3xl font-medium">Yasir Gaji</h1>
        <p className="text-base">Senior Software Engineer · Applied AI & Backend Architecture</p>
        <p className="mt-1 text-sm text-muted-editorial-light dark-editorial:text-muted-editorial-dark">
          {settings?.location}
          {settings?.socials?.email && ` · ${settings.socials.email}`}
        </p>
      </header>

      {settings?.bio && (
        <section className="mt-8">
          <p className="leading-relaxed">{settings.bio}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-medium">Experience</h2>
          {experience.map((e) => {
            const start = e.startDate ? new Date(e.startDate).getFullYear() : "";
            const end = e.endDate ? new Date(e.endDate).getFullYear() : "Present";
            return (
              <div key={e._id} className="mt-6">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-medium">
                    {e.title} · {e.company}
                  </h3>
                  <p className="font-mono text-xs text-muted-editorial-light dark-editorial:text-muted-editorial-dark">
                    {start}–{end}
                  </p>
                </div>
                {e.location && (
                  <p className="text-sm text-muted-editorial-light dark-editorial:text-muted-editorial-dark">
                    {e.location}
                  </p>
                )}
                {e.bullets && <PortableText value={e.bullets} />}
                {e.stack && e.stack.length > 0 && (
                  <p className="mt-2 font-mono text-xs">{e.stack.join(" · ")}</p>
                )}
              </div>
            );
          })}
        </section>
      )}

      {Object.keys(skillsByGroup).length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-medium">Skills</h2>
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
            {Object.entries(skillsByGroup).map(([group, list]) => (
              <div key={group} className="contents">
                <dt className="font-medium">{groupTitles[group] ?? group}</dt>
                <dd>{list.map((s) => s.name).join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </article>
  );
}
