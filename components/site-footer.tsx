import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";

export async function SiteFooter() {
  const data = await client.fetch(siteSettingsQuery);
  const s = data?.socials;
  return (
    <footer className="mt-24 border-t border-[var(--color-line-editorial-light)] dark-editorial:border-[var(--color-line-editorial-dark)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10 text-sm text-[var(--color-muted-editorial-light)] sm:flex-row sm:items-center sm:justify-between dark-editorial:text-[var(--color-muted-editorial-dark)]">
        <p>
          © {new Date().getFullYear()} Yasir Gaji. {data?.location ?? ""}
        </p>
        <div className="flex gap-4">
          {s?.github && <a href={s.github}>GitHub</a>}
          {s?.linkedin && <a href={s.linkedin}>LinkedIn</a>}
          {s?.medium && <a href={s.medium}>Medium</a>}
          {s?.twitter && <a href={s.twitter}>X</a>}
          {s?.email && <a href={`mailto:${s.email}`}>Email</a>}
        </div>
      </div>
    </footer>
  );
}
