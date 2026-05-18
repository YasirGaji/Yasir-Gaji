import { buttonVariants } from "@/components/ui/button";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";

export const metadata = {
  title: "Contact",
  description: "Book a 15-minute intro or reach out via email.",
};

export default async function ContactPage() {
  const settings = await client.fetch(siteSettingsQuery);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <header>
        <h1 className="font-display text-4xl font-medium md:text-5xl">Contact</h1>
        <p className="mt-3 text-lg text-muted-editorial-light dark-editorial:text-muted-editorial-dark">
          Easiest is a 15-minute call. Or email.
        </p>
      </header>

      <section className="mt-10 space-y-4">
        {settings?.calcomUrl && (
          <a
            href={settings.calcomUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants()}
          >
            Book a 15-minute intro →
          </a>
        )}
        {settings?.socials?.email && (
          <p>
            <a
              href={`mailto:${settings.socials.email}`}
              className="underline underline-offset-4 hover:text-accent-editorial"
            >
              {settings.socials.email}
            </a>
          </p>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-medium">Elsewhere</h2>
        <ul className="mt-4 space-y-2">
          {settings?.socials?.github && (
            <li>
              <a href={settings.socials.github} className="underline underline-offset-4">
                GitHub
              </a>
            </li>
          )}
          {settings?.socials?.linkedin && (
            <li>
              <a href={settings.socials.linkedin} className="underline underline-offset-4">
                LinkedIn
              </a>
            </li>
          )}
          {settings?.socials?.medium && (
            <li>
              <a href={settings.socials.medium} className="underline underline-offset-4">
                Medium
              </a>
            </li>
          )}
          {settings?.socials?.twitter && (
            <li>
              <a href={settings.socials.twitter} className="underline underline-offset-4">
                X
              </a>
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
