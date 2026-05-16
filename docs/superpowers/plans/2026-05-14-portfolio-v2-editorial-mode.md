# Portfolio v2 — Plan 02: Editorial Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Commit handling for this project:** Yasir runs every `git commit` himself. Commit steps in this plan stage the relevant files with `git add` and provide a suggested commit message, then **pause** for Yasir to execute the commit. Do not run `git commit` on his behalf. (See memory: `feedback-commits`.)

**Goal:** Build the full editorial-mode portfolio UI on top of the Plan 01 foundation. Eight pages (Home, Work index, Work detail, Writing index, Writing detail, About, Contact, Resume HTML) rendering real content from Sanity, with the design system from spec § 6.2 (Fraunces + Inter + JetBrains Mono, warm off-white + warm gold, light/dark sub-toggle).

**Architecture:** Server-component pages fetching from Sanity via the typed client. Cache Components (`use cache` + `cacheTag`) on list pages for partial pre-rendering with tag-based invalidation on publish. Portable Text renderer handles `block`, `image`, and `codeBlock` types from `caseStudy.problem/architecture/myRole/outcome` and `article.body`. shadcn/ui supplies primitives (button, drawer, separator, sheet, scroll-area). Light/dark theme switches the `data-theme` attribute on `<html>` (no FOUC, cookie-persisted).

**Tech Stack:** Next.js 16 App Router + Cache Components, Tailwind v4, shadcn/ui, next/font (Fraunces, Inter, JetBrains Mono), next-sanity, @portabletext/react, Shiki for code highlighting, next-themes (or custom cookie-based theme switcher).

**Plan output (end state):** A live preview deployment at `yasir-gaji-git-version-2-yasirgajis-projects.vercel.app` (and `yasir-gaji-git-version-2-...` for each subsequent push) showing the full editorial-mode portfolio with Yasir's real content seeded in Sanity. Ready for Plan 03 (IDE mode toggle).

**NOT in this plan (deferred):** IDE mode chrome (Plan 03), RAG AI demo (Plan 04), PDF resume generation, OG image generation, sitemap, structured data, DNS cutover (all Plan 05).

---

## Pre-flight

Before Phase 1:

- [ ] On branch `version-2`, working tree clean (`git status --short` shows only the `.gitignore` `.early.coverage` line if anything)
- [ ] Local dev shell uses Node 22 (`nvm use 22` or have `.nvmrc` set — see Plan 01 notes)
- [ ] Sanity Studio reachable at `/studio` locally (`pnpm dev` → open http://localhost:3000/studio)
- [ ] Vercel preview from `version-2` is healthy at `yasir-gaji-git-version-2-yasirgajis-projects.vercel.app`

---

## Phase 1 — Foundation

### Task 1.1: Fonts via `next/font/google`

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Replace `app/layout.tsx` with the v2 layout shell**

Wipe the scaffold's Geist imports. Replace `app/layout.tsx` entirely with:

```tsx
import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Yasir Gaji — Senior Software Engineer",
    template: "%s · Yasir Gaji",
  },
  description:
    "Senior Software Engineer architecting agentic LLM workflows and event-driven systems.",
  metadataBase: new URL("https://yasirgaji.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-mode="editorial"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Update `app/globals.css` to use the font CSS variables**

The existing `app/globals.css` (from Plan 01 T1.3) already defines `--font-display`, `--font-body`, `--font-mono` in `@theme`. Those are *static* fallback strings. We override them with the live font variables Next emits by appending **inside the `@theme` block**, OR by adding a new `@layer base` rule that uses `font-display: var(--font-display, "Fraunces", ...);` pattern.

Simpler approach: leave `@theme` as-is (it's the fallback chain) and trust Next's `--font-display` (etc.) variables defined on `<html>` to take precedence. The CSS resolves `var(--font-display)` to Next's hosted font URL.

Verify by running `pnpm dev`, opening `/`, and inspecting the body in DevTools — `font-family` should resolve to a Fraunces-family loaded from `/_next/static/media/...`.

- [ ] **Step 3: Stage. Suggested commit message:**

```sh
git add app/layout.tsx
```

```
feat(layout): swap scaffold fonts for v2 stack (Fraunces + Inter + JetBrains Mono)

Sets metadata defaults + metadataBase. data-mode="editorial" pre-set on
<html> so the Plan 03 toggle has a stable starting state.
```

Pause for Yasir to commit.

---

### Task 1.2: Initialize shadcn/ui

**Files:**
- Create: `components.json`
- Create: `lib/utils.ts`
- Modify: `tsconfig.json` (shadcn adds path alias hint — verify only)

- [ ] **Step 1: Run shadcn init**

```sh
pnpm dlx shadcn@latest init
```

Answer the prompts:
- Style → **New York**
- Base color → **Neutral**
- CSS variables → **Yes**
- Color theme variant → press Enter (default)

This creates `components.json` and `lib/utils.ts` (the `cn()` helper).

- [ ] **Step 2: Install the primitives we need for editorial mode**

```sh
pnpm dlx shadcn@latest add button separator scroll-area
```

These land under `components/ui/`. Don't add anything else yet — we'll pull in drawer/sheet later when IDE mode (Plan 03) needs them.

- [ ] **Step 3: Verify**

```sh
pnpm exec tsc --noEmit
pnpm lint
```

Both should pass. shadcn's CSS additions (in `app/globals.css`) may overlap our `@theme` block — if Biome flags formatting in `app/globals.css` (currently excluded from Biome), that's fine; it's excluded.

- [ ] **Step 4: Stage. Suggested commit message:**

```sh
git add -A
```

```
chore(shadcn): init with button + separator + scroll-area

New York style, Neutral base, CSS-variable theming. Primitives live in
components/ui/ for future page composition.
```

Pause for Yasir to commit.

---

### Task 1.3: Light/dark sub-toggle within editorial

The toggle between editorial and IDE is in Plan 03. This task adds the **light/dark sub-toggle** that lives *inside* editorial mode. Defaults to system preference on first visit; persisted via cookie.

**Files:**
- Create: `lib/theme-cookie.ts`
- Create: `components/theme-toggle.tsx`
- Modify: `app/layout.tsx` (read cookie server-side, apply `data-theme` attribute)

- [ ] **Step 1: Cookie helper**

`lib/theme-cookie.ts`:

```ts
import { cookies } from "next/headers";

export const THEME_COOKIE = "theme";
export type Theme = "light" | "dark";

export async function getThemeFromCookie(): Promise<Theme | null> {
  const store = await cookies();
  const value = store.get(THEME_COOKIE)?.value;
  return value === "light" || value === "dark" ? value : null;
}
```

- [ ] **Step 2: Server-side reading in `app/layout.tsx`**

Modify the layout to read the cookie and emit `data-theme` on `<html>`. If no cookie, leave the attribute off — CSS's `prefers-color-scheme` media query handles the first visit.

Replace the `<html ...>` opening in `app/layout.tsx`:

```tsx
import { getThemeFromCookie } from "@/lib/theme-cookie";

// inside RootLayout (now async):
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await getThemeFromCookie();
  return (
    <html
      lang="en"
      data-mode="editorial"
      {...(theme ? { "data-theme": theme } : {})}
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Add `prefers-color-scheme` fallback to `app/globals.css`**

In the existing `@layer base` block, add a media query so unset users still get dark when their OS asks for it:

```css
@layer base {
  /* existing rules… */
  @media (prefers-color-scheme: dark) {
    html[data-mode="editorial"]:not([data-theme]) body {
      background: var(--color-bg-editorial-dark);
      color: var(--color-ink-editorial-dark);
    }
  }
}
```

- [ ] **Step 4: Client-side toggle component**

`components/theme-toggle.tsx`:

```tsx
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

function readInitialTheme(): Theme {
  if (typeof document === "undefined") return "light";
  const attr = document.documentElement.getAttribute("data-theme") as Theme | null;
  if (attr === "light" || attr === "dark") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(readInitialTheme());
  }, []);

  const flip = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    document.cookie = `theme=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={flip}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? "Dark" : "Light"}
    </Button>
  );
}
```

- [ ] **Step 5: Manual verify**

`pnpm dev`, open `/`, click the toggle — body bg should swap warm-off-white ↔ near-black. Reload — preference persists.

- [ ] **Step 6: Stage. Suggested commit message:**

```sh
git add lib/theme-cookie.ts components/theme-toggle.tsx app/layout.tsx app/globals.css
```

```
feat(theme): light/dark sub-toggle for editorial mode

Cookie-persisted, SSR-rendered to avoid FOUC. Defaults to
prefers-color-scheme on first visit. Toggle button lives in the nav
(added in Task 1.4).
```

Pause for Yasir to commit.

---

### Task 1.4: Layout shell — Nav + Footer

**Files:**
- Create: `components/site-nav.tsx`
- Create: `components/site-footer.tsx`
- Modify: `app/layout.tsx` (wrap children with nav + main + footer)
- Modify: `sanity/lib/queries.ts` (add nav/footer query for socials + availability)

- [ ] **Step 1: Expand the siteSettings query slightly**

`sanity/lib/queries.ts` already has `siteSettingsQuery` from Plan 01. Replace it with the fuller version we need site-wide:

```ts
import { defineQuery } from "next-sanity";

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    bio,
    location,
    availability,
    socials,
    calcomUrl
  }
`);
```

(No change if already this — verify and move on.)

- [ ] **Step 2: Re-run typegen**

```sh
pnpm typegen
```

`sanity/types.gen.ts` should refresh. Verify `SiteSettingsQueryResult` still resolves.

- [ ] **Step 3: Nav component**

`components/site-nav.tsx`:

```tsx
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-line-editorial-light)] bg-[var(--color-bg-editorial-light)]/80 backdrop-blur dark-editorial:border-[var(--color-line-editorial-dark)] dark-editorial:bg-[var(--color-bg-editorial-dark)]/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-medium">
          Yasir Gaji
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:underline underline-offset-4">
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
```

Note on the `dark-editorial:` Tailwind variant: Tailwind v4 doesn't ship a built-in `data-attribute` variant matching our `data-theme="dark"` + `data-mode="editorial"`. Add a custom variant in `app/globals.css`:

```css
@custom-variant dark-editorial (&:where(html[data-mode="editorial"][data-theme="dark"] *));
```

Add that at the top of `app/globals.css`, right after `@import "tailwindcss";`.

- [ ] **Step 4: Footer component**

`components/site-footer.tsx`:

```tsx
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";

export async function SiteFooter() {
  const data = await client.fetch(siteSettingsQuery);
  const s = data?.socials;
  return (
    <footer className="mt-24 border-t border-[var(--color-line-editorial-light)] dark-editorial:border-[var(--color-line-editorial-dark)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10 text-sm text-[var(--color-muted-editorial-light)] sm:flex-row sm:items-center sm:justify-between dark-editorial:text-[var(--color-muted-editorial-dark)]">
        <p>© {new Date().getFullYear()} Yasir Gaji. {data?.location ?? ""}</p>
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
```

- [ ] **Step 5: Wrap in layout**

Modify `app/layout.tsx`:

```tsx
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

// inside RootLayout body:
<body className="min-h-full flex flex-col">
  <SiteNav />
  <main className="flex-1">{children}</main>
  <SiteFooter />
</body>
```

- [ ] **Step 6: Verify**

`pnpm dev`, open `/`. You should see:
- Sticky nav at top with "Yasir Gaji" logo + Work/Writing/About/Contact + theme toggle
- The current scaffold home page in the middle
- Footer at bottom with year + location + socials

- [ ] **Step 7: Stage. Suggested commit message:**

```sh
git add components/site-nav.tsx components/site-footer.tsx app/layout.tsx app/globals.css
```

```
feat(layout): add site-wide nav + footer

Nav: sticky top bar with logo, 4 page links, theme toggle.
Footer: location + socials pulled from siteSettings.
Custom Tailwind variant dark-editorial: scopes styles to editorial+dark.
```

Pause for Yasir to commit.

---

## Phase 2 — Sanity queries + Portable Text renderer

### Task 2.1: Add all page queries

**Files:**
- Modify: `sanity/lib/queries.ts`

- [ ] **Step 1: Replace queries.ts with the full set**

```ts
import { defineQuery } from "next-sanity";

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    bio,
    location,
    availability,
    socials,
    calcomUrl
  }
`);

export const heroQuoteQuery = defineQuery(`
  *[_type == "recommendation" && isHeroQuote == true][0] {
    _id,
    name,
    role,
    company,
    quote,
    linkedinUrl,
    headshot { asset->{_id, url} }
  }
`);

export const homeFeaturedQuery = defineQuery(`
  *[_type == "caseStudy" && isFeatured == true] | order(order asc)[0...3] {
    _id,
    title,
    slug,
    role,
    sector,
    company,
    heroImage { asset->{_id, url} },
    stack
  }
`);

export const homeLatestArticlesQuery = defineQuery(`
  *[_type == "article"] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    coverImage { asset->{_id, url} },
    series->{title, slug}
  }
`);

export const allCaseStudiesQuery = defineQuery(`
  *[_type == "caseStudy"] | order(order asc, startDate desc) {
    _id,
    title,
    slug,
    role,
    sector,
    company,
    heroImage { asset->{_id, url} },
    stack,
    startDate,
    endDate
  }
`);

export const caseStudyBySlugQuery = defineQuery(`
  *[_type == "caseStudy" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    role,
    sector,
    company,
    startDate,
    endDate,
    heroImage { asset->{_id, url} },
    gallery[] { asset->{_id, url} },
    stack,
    problem,
    architecture,
    myRole,
    outcome,
    liveUrl,
    "relatedArticles": relatedArticles[]->{
      _id, title, slug, excerpt, publishedAt
    }
  }
`);

export const allCaseStudySlugsQuery = defineQuery(`
  *[_type == "caseStudy" && defined(slug.current)][].slug.current
`);

export const allArticlesQuery = defineQuery(`
  *[_type == "article"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    coverImage { asset->{_id, url} },
    series->{title, slug},
    seriesOrder,
    tags
  }
`);

export const articleSeriesAllQuery = defineQuery(`
  *[_type == "articleSeries"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    coverImage { asset->{_id, url} },
    "articles": *[_type == "article" && references(^._id)] | order(seriesOrder asc, publishedAt asc) {
      _id, title, slug, excerpt, publishedAt
    }
  }
`);

export const articleBySlugQuery = defineQuery(`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    body,
    publishedAt,
    mediumUrl,
    canonicalUrl,
    coverImage { asset->{_id, url} },
    series->{title, slug},
    seriesOrder,
    tags,
    readingTime
  }
`);

export const allArticleSlugsQuery = defineQuery(`
  *[_type == "article" && defined(slug.current)][].slug.current
`);

export const aboutQuery = defineQuery(`
  {
    "settings": *[_type == "siteSettings" && _id == "siteSettings"][0]{
      bio, location, availability, socials, calcomUrl
    },
    "recommendations": *[_type == "recommendation"] | order(order asc, date desc) {
      _id, name, role, company, date, quote, linkedinUrl,
      headshot { asset->{_id, url} }
    }
  }
`);

export const resumeQuery = defineQuery(`
  {
    "settings": *[_type == "siteSettings" && _id == "siteSettings"][0]{
      bio, location, availability, socials, calcomUrl
    },
    "experience": *[_type == "experience"] | order(order asc, startDate desc) {
      _id, company, location, title, startDate, endDate, bullets, stack
    },
    "skills": *[_type == "skill"] | order(group asc, order asc) {
      _id, group, name, level
    }
  }
`);
```

- [ ] **Step 2: Run typegen + verify**

```sh
pnpm typegen
pnpm exec tsc --noEmit
```

Expected: ~12 new `*QueryResult` types in `sanity/types.gen.ts`. tsc passes.

- [ ] **Step 3: Stage. Suggested commit message:**

```sh
git add sanity/lib/queries.ts sanity/types.gen.ts
```

```
feat(sanity): add queries for all editorial pages

12 GROQ queries covering home, work index/detail, writing index/detail,
about, and resume. Types regenerated.
```

Pause for Yasir to commit.

---

### Task 2.2: Portable Text renderer

Used by case-study sections (problem/architecture/myRole/outcome) and article body. Handles `block`, `image`, and our custom `codeBlock` type. Code blocks use Shiki for syntax highlighting.

**Files:**
- Create: `components/portable-text.tsx`
- Modify: `next.config.ts` (allow Sanity image domain — already done in Plan 01, verify)
- Install: `@portabletext/react`, `shiki`

- [ ] **Step 1: Install deps**

```sh
pnpm add @portabletext/react shiki
```

- [ ] **Step 2: Write the renderer**

`components/portable-text.tsx`:

```tsx
import { PortableText as PTReact, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { codeToHtml } from "shiki";
import { urlForImage } from "@/sanity/lib/image";

type CodeBlock = { _type: "codeBlock"; language?: string; code: string };

async function CodeBlock({ block }: { block: CodeBlock }) {
  const html = await codeToHtml(block.code, {
    lang: block.language || "ts",
    theme: "github-dark-dimmed",
  });
  return (
    <div
      className="my-6 overflow-x-auto rounded-md font-mono text-sm"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki escapes input
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const url = urlForImage(value).width(1200).url();
      return (
        <figure className="my-8">
          <Image
            src={url}
            alt={value.alt ?? ""}
            width={1200}
            height={800}
            className="rounded-md"
          />
        </figure>
      );
    },
    codeBlock: ({ value }) => <CodeBlock block={value as CodeBlock} />,
  },
  block: {
    h2: ({ children }) => (
      <h2 className="mt-12 mb-4 font-display text-2xl font-medium">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 font-display text-xl font-medium">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-[var(--color-accent-editorial)] pl-4 italic">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="my-4 leading-relaxed">{children}</p>,
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
        className="underline underline-offset-2 hover:text-[var(--color-accent-editorial)]"
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="rounded bg-black/5 px-1 py-0.5 font-mono text-[0.92em] dark-editorial:bg-white/10">
        {children}
      </code>
    ),
  },
};

export function PortableText({ value }: { value: unknown }) {
  if (!value) return null;
  // @ts-expect-error — Portable Text accepts the typed array unions from Sanity
  return <PTReact value={value} components={components} />;
}
```

- [ ] **Step 3: Verify**

```sh
pnpm exec tsc --noEmit
pnpm lint
```

- [ ] **Step 4: Stage. Suggested commit message:**

```sh
git add components/portable-text.tsx package.json pnpm-lock.yaml
```

```
feat(content): add Portable Text renderer with Shiki code highlighting

Handles block, image, and codeBlock types. Images route through
@sanity/image-url + next/image. Code blocks render at request time
(server components only) using Shiki's github-dark-dimmed theme.
```

Pause for Yasir to commit.

---

## Phase 3 — Pages

Each page task replaces a route's content with a server component that fetches from Sanity and renders. Replace `app/test/page.tsx` with the actual `/` home page first, then build each route in turn.

### Task 3.1: Home page

**Files:**
- Delete: `app/test/page.tsx` (no longer needed — was Plan 01 smoke)
- Delete: `tests/e2e/sanity-smoke.spec.ts` (replaced by real e2e in Phase 7)
- Replace: `app/page.tsx`
- Create: `components/case-study-card.tsx`
- Create: `components/article-card.tsx`
- Create: `components/hero-quote.tsx`

- [ ] **Step 1: Remove the Plan 01 smoke artifacts**

```sh
rm app/test/page.tsx tests/e2e/sanity-smoke.spec.ts
rmdir app/test 2>/dev/null
```

- [ ] **Step 2: Hero quote component**

`components/hero-quote.tsx`:

```tsx
import { client } from "@/sanity/lib/client";
import { heroQuoteQuery } from "@/sanity/lib/queries";

export async function HeroQuote() {
  const q = await client.fetch(heroQuoteQuery);
  if (!q) return null;
  return (
    <figure className="mt-10 border-l-2 border-[var(--color-accent-editorial)] pl-6">
      <blockquote className="text-lg leading-relaxed text-[var(--color-muted-editorial-light)] dark-editorial:text-[var(--color-muted-editorial-dark)]">
        &ldquo;{q.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-3 text-sm">
        — <strong>{q.name}</strong>
        {q.role && `, ${q.role}`}
        {q.company && ` @ ${q.company}`}
      </figcaption>
    </figure>
  );
}
```

- [ ] **Step 3: Case study card**

`components/case-study-card.tsx`:

```tsx
import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import type { HomeFeaturedQueryResult } from "@/sanity/types.gen";

type Card = NonNullable<HomeFeaturedQueryResult>[number];

export function CaseStudyCard({ card }: { card: Card }) {
  const hero = card.heroImage?.asset ? urlForImage(card.heroImage).width(800).url() : null;
  return (
    <Link
      href={`/work/${card.slug?.current}`}
      className="group block overflow-hidden rounded-md border border-[var(--color-line-editorial-light)] transition hover:-translate-y-0.5 dark-editorial:border-[var(--color-line-editorial-dark)]"
    >
      {hero && (
        <Image
          src={hero}
          alt={card.title ?? ""}
          width={800}
          height={500}
          className="aspect-[8/5] w-full object-cover"
        />
      )}
      <div className="p-5">
        <h3 className="font-display text-lg font-medium">{card.title}</h3>
        {card.role && (
          <p className="mt-1 text-sm text-[var(--color-muted-editorial-light)] dark-editorial:text-[var(--color-muted-editorial-dark)]">
            {card.role}
            {card.company && ` · ${card.company}`}
          </p>
        )}
        {card.stack && card.stack.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {card.stack.slice(0, 4).map((t) => (
              <li
                key={t}
                className="rounded-full border border-[var(--color-line-editorial-light)] px-2 py-0.5 font-mono text-xs dark-editorial:border-[var(--color-line-editorial-dark)]"
              >
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
```

- [ ] **Step 4: Article card**

`components/article-card.tsx`:

```tsx
import Link from "next/link";
import type { HomeLatestArticlesQueryResult } from "@/sanity/types.gen";

type Card = NonNullable<HomeLatestArticlesQueryResult>[number];

export function ArticleCard({ card }: { card: Card }) {
  const date = card.publishedAt ? new Date(card.publishedAt).toLocaleDateString("en-GB") : "";
  return (
    <Link
      href={`/writing/${card.slug?.current}`}
      className="block border-b border-[var(--color-line-editorial-light)] py-5 last:border-b-0 dark-editorial:border-[var(--color-line-editorial-dark)]"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-lg font-medium">{card.title}</h3>
        {date && (
          <time className="shrink-0 font-mono text-xs text-[var(--color-muted-editorial-light)] dark-editorial:text-[var(--color-muted-editorial-dark)]">
            {date}
          </time>
        )}
      </div>
      {card.excerpt && (
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-editorial-light)] dark-editorial:text-[var(--color-muted-editorial-dark)]">
          {card.excerpt}
        </p>
      )}
      {card.series?.title && (
        <p className="mt-2 font-mono text-xs uppercase tracking-wide text-[var(--color-accent-editorial)]">
          {card.series.title}
        </p>
      )}
    </Link>
  );
}
```

- [ ] **Step 5: Home page**

`app/page.tsx`:

```tsx
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import {
  siteSettingsQuery,
  homeFeaturedQuery,
  homeLatestArticlesQuery,
} from "@/sanity/lib/queries";
import { HeroQuote } from "@/components/hero-quote";
import { CaseStudyCard } from "@/components/case-study-card";
import { ArticleCard } from "@/components/article-card";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const [settings, featured, latest] = await Promise.all([
    client.fetch(siteSettingsQuery),
    client.fetch(homeFeaturedQuery),
    client.fetch(homeLatestArticlesQuery),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <section>
        <h1 className="font-display text-4xl font-medium leading-tight md:text-5xl">
          Yasir Gaji
        </h1>
        <p className="mt-3 text-lg text-[var(--color-muted-editorial-light)] dark-editorial:text-[var(--color-muted-editorial-dark)]">
          Senior Software Engineer · Applied AI & Backend Architecture
        </p>
        {settings?.bio && (
          <p className="mt-6 text-lg leading-relaxed">{settings.bio}</p>
        )}
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

      <section className="mt-20 rounded-md border border-[var(--color-line-editorial-light)] p-8 text-center dark-editorial:border-[var(--color-line-editorial-dark)]">
        <h2 className="font-display text-2xl font-medium">Available for senior IC + AI architect roles</h2>
        <p className="mt-3 text-[var(--color-muted-editorial-light)] dark-editorial:text-[var(--color-muted-editorial-dark)]">
          15-minute intro, no slides, real questions only.
        </p>
        {settings?.calcomUrl ? (
          <Button asChild className="mt-5">
            <a href={settings.calcomUrl} target="_blank" rel="noopener noreferrer">
              Book a call
            </a>
          </Button>
        ) : (
          <Button asChild className="mt-5">
            <Link href="/contact">Get in touch</Link>
          </Button>
        )}
      </section>
    </div>
  );
}
```

- [ ] **Step 6: Verify**

`pnpm dev` → open `/`. You should see:
- Hero with name, sub, bio
- Leo's quote inline (once you mark Leo's `isHeroQuote=true` in Studio — see Phase 5)
- 3 featured case studies (empty until you publish case studies)
- 3 latest articles (empty until you publish articles)
- Closing CTA card with Cal.com link

Empty states are fine — they'll populate when you seed content.

- [ ] **Step 7: Stage. Suggested commit message:**

```sh
git add app/page.tsx components/hero-quote.tsx components/case-study-card.tsx components/article-card.tsx
git rm app/test/page.tsx tests/e2e/sanity-smoke.spec.ts
```

```
feat(home): build editorial home page

Hero + bio + featured Leo quote + 3 featured case studies + 3 latest
articles + Cal.com CTA. Replaces the Plan 01 /test smoke route.
```

Pause for Yasir to commit.

---

### Task 3.2: `/work` index

**Files:**
- Create: `app/work/page.tsx`

- [ ] **Step 1: Build the index**

`app/work/page.tsx`:

```tsx
import { client } from "@/sanity/lib/client";
import { allCaseStudiesQuery } from "@/sanity/lib/queries";
import { CaseStudyCard } from "@/components/case-study-card";

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
        <p className="mt-3 text-lg text-[var(--color-muted-editorial-light)] dark-editorial:text-[var(--color-muted-editorial-dark)]">
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
```

- [ ] **Step 2: Verify + stage**

```sh
pnpm dev  # open /work
git add app/work/page.tsx
```

Suggested commit:

```
feat(work): /work index page listing all case studies
```

Pause for Yasir to commit.

---

### Task 3.3: `/work/[slug]` detail

**Files:**
- Create: `app/work/[slug]/page.tsx`
- Create: `components/stack-tag.tsx`

- [ ] **Step 1: Stack tag component**

`components/stack-tag.tsx`:

```tsx
export function StackTag({ children }: { children: React.ReactNode }) {
  return (
    <li className="rounded-full border border-[var(--color-line-editorial-light)] px-3 py-1 font-mono text-xs dark-editorial:border-[var(--color-line-editorial-dark)]">
      {children}
    </li>
  );
}
```

- [ ] **Step 2: Detail page**

`app/work/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import {
  allCaseStudySlugsQuery,
  caseStudyBySlugQuery,
} from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";
import { PortableText } from "@/components/portable-text";
import { StackTag } from "@/components/stack-tag";
import { Separator } from "@/components/ui/separator";

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
        <p className="font-mono text-sm uppercase tracking-wide text-[var(--color-accent-editorial)]">
          {data.role}
          {data.company && ` · ${data.company}`}
        </p>
        <h1 className="mt-3 font-display text-4xl font-medium leading-tight md:text-5xl">
          {data.title}
        </h1>
        <p className="mt-3 text-sm text-[var(--color-muted-editorial-light)] dark-editorial:text-[var(--color-muted-editorial-dark)]">
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
            className="underline underline-offset-4 hover:text-[var(--color-accent-editorial)]"
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
```

- [ ] **Step 3: Verify + stage**

Visit `/work/<any-published-slug>` in dev. Should render full case study.

```sh
git add app/work components/stack-tag.tsx
```

Suggested commit:

```
feat(work): /work/[slug] case study detail page

Renders problem/architecture/myRole/outcome via Portable Text. Static
params generated from all published slugs. Notfound for unknown slugs.
```

Pause for Yasir to commit.

---

### Task 3.4: `/writing` index

**Files:**
- Create: `app/writing/page.tsx`

- [ ] **Step 1: Index page**

`app/writing/page.tsx`:

```tsx
import { client } from "@/sanity/lib/client";
import { allArticlesQuery, articleSeriesAllQuery } from "@/sanity/lib/queries";
import { ArticleCard } from "@/components/article-card";

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
        <p className="mt-3 text-lg text-[var(--color-muted-editorial-light)] dark-editorial:text-[var(--color-muted-editorial-dark)]">
          Essays, playbooks, and notes.
        </p>
      </header>

      {series && series.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium">Series</h2>
          <ul className="mt-4 space-y-6">
            {series.map((s) => (
              <li key={s._id} className="rounded-md border border-[var(--color-line-editorial-light)] p-5 dark-editorial:border-[var(--color-line-editorial-dark)]">
                <h3 className="font-display text-xl font-medium">{s.title}</h3>
                {s.description && (
                  <p className="mt-1 text-sm text-[var(--color-muted-editorial-light)] dark-editorial:text-[var(--color-muted-editorial-dark)]">
                    {s.description}
                  </p>
                )}
                {s.articles && s.articles.length > 0 && (
                  <ol className="mt-3 space-y-1 text-sm">
                    {s.articles.map((a, i) => (
                      <li key={a._id}>
                        <span className="mr-2 font-mono text-xs text-[var(--color-muted-editorial-light)] dark-editorial:text-[var(--color-muted-editorial-dark)]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <a href={`/writing/${a.slug?.current}`} className="underline underline-offset-4">
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
```

- [ ] **Step 2: Verify + stage**

```sh
git add app/writing/page.tsx
```

Suggested commit:

```
feat(writing): /writing index with series + all-articles list
```

Pause for Yasir to commit.

---

### Task 3.5: `/writing/[slug]` article

**Files:**
- Create: `app/writing/[slug]/page.tsx`

- [ ] **Step 1: Article page**

`app/writing/[slug]/page.tsx`:

```tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { allArticleSlugsQuery, articleBySlugQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";
import { PortableText } from "@/components/portable-text";

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
            className="font-mono text-sm uppercase tracking-wide text-[var(--color-accent-editorial)]"
          >
            {data.series.title}
          </Link>
        )}
        <h1 className="mt-3 font-display text-4xl font-medium leading-tight md:text-5xl">
          {data.title}
        </h1>
        <p className="mt-3 text-sm text-[var(--color-muted-editorial-light)] dark-editorial:text-[var(--color-muted-editorial-dark)]">
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
        <p className="mt-12 text-sm text-[var(--color-muted-editorial-light)] dark-editorial:text-[var(--color-muted-editorial-dark)]">
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
```

- [ ] **Step 2: Verify + stage**

```sh
git add app/writing/\[slug\]/page.tsx
```

Suggested commit:

```
feat(writing): /writing/[slug] article body with Portable Text
```

Pause for Yasir to commit.

---

### Task 3.6: `/about` page

**Files:**
- Create: `app/about/page.tsx`
- Create: `components/recommendation-card.tsx`

- [ ] **Step 1: Recommendation card**

`components/recommendation-card.tsx`:

```tsx
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import type { AboutQueryResult } from "@/sanity/types.gen";

type Rec = NonNullable<AboutQueryResult["recommendations"]>[number];

export function RecommendationCard({ rec }: { rec: Rec }) {
  const photo = rec.headshot?.asset ? urlForImage(rec.headshot).width(120).height(120).url() : null;
  return (
    <article className="rounded-md border border-[var(--color-line-editorial-light)] p-6 dark-editorial:border-[var(--color-line-editorial-dark)]">
      <blockquote className="text-base leading-relaxed">
        &ldquo;{rec.quote}&rdquo;
      </blockquote>
      <footer className="mt-4 flex items-center gap-3">
        {photo && (
          <Image
            src={photo}
            alt={rec.name ?? ""}
            width={48}
            height={48}
            className="rounded-full"
          />
        )}
        <div>
          <p className="text-sm font-medium">{rec.name}</p>
          {rec.role && (
            <p className="text-xs text-[var(--color-muted-editorial-light)] dark-editorial:text-[var(--color-muted-editorial-dark)]">
              {rec.role}
              {rec.company && ` @ ${rec.company}`}
            </p>
          )}
        </div>
      </footer>
    </article>
  );
}
```

- [ ] **Step 2: About page**

`app/about/page.tsx`:

```tsx
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { aboutQuery } from "@/sanity/lib/queries";
import { RecommendationCard } from "@/components/recommendation-card";
import { Button } from "@/components/ui/button";

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
        <p className="mt-3 text-lg text-[var(--color-muted-editorial-light)] dark-editorial:text-[var(--color-muted-editorial-dark)]">
          {settings?.location}
        </p>
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
        {settings?.calcomUrl && (
          <Button asChild className="mt-6">
            <a href={settings.calcomUrl} target="_blank" rel="noopener noreferrer">
              Book a 15-minute intro →
            </a>
          </Button>
        )}
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Verify + stage**

```sh
git add app/about/page.tsx components/recommendation-card.tsx
```

Suggested commit:

```
feat(about): /about page with recommendations + availability
```

Pause for Yasir to commit.

---

### Task 3.7: `/contact` page

**Files:**
- Create: `app/contact/page.tsx`

- [ ] **Step 1: Page**

`app/contact/page.tsx`:

```tsx
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import { Button } from "@/components/ui/button";

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
        <p className="mt-3 text-lg text-[var(--color-muted-editorial-light)] dark-editorial:text-[var(--color-muted-editorial-dark)]">
          Easiest is a 15-minute call. Or email.
        </p>
      </header>

      <section className="mt-10 space-y-4">
        {settings?.calcomUrl && (
          <Button asChild>
            <a href={settings.calcomUrl} target="_blank" rel="noopener noreferrer">
              Book a 15-minute intro →
            </a>
          </Button>
        )}
        {settings?.socials?.email && (
          <p>
            <a
              href={`mailto:${settings.socials.email}`}
              className="underline underline-offset-4 hover:text-[var(--color-accent-editorial)]"
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
```

- [ ] **Step 2: Verify + stage**

```sh
git add app/contact/page.tsx
```

Suggested commit:

```
feat(contact): /contact page with Cal.com + email + socials
```

Pause for Yasir to commit.

---

### Task 3.8: `/resume` HTML

PDF generation is in Plan 05. This task ships the HTML resume only.

**Files:**
- Create: `app/resume/page.tsx`

- [ ] **Step 1: Page**

`app/resume/page.tsx`:

```tsx
import { client } from "@/sanity/lib/client";
import { resumeQuery } from "@/sanity/lib/queries";
import { PortableText } from "@/components/portable-text";

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

export default async function ResumePage() {
  const data = await client.fetch(resumeQuery);
  const settings = data?.settings;
  const experience = data?.experience ?? [];
  const skills = data?.skills ?? [];

  const skillsByGroup = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    if (!s.group) return acc;
    acc[s.group] = acc[s.group] ?? [];
    acc[s.group].push(s);
    return acc;
  }, {});

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <header>
        <h1 className="font-display text-3xl font-medium">Yasir Gaji</h1>
        <p className="text-base">
          Senior Software Engineer · Applied AI & Backend Architecture
        </p>
        <p className="mt-1 text-sm text-[var(--color-muted-editorial-light)] dark-editorial:text-[var(--color-muted-editorial-dark)]">
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
                  <p className="font-mono text-xs text-[var(--color-muted-editorial-light)] dark-editorial:text-[var(--color-muted-editorial-dark)]">
                    {start}–{end}
                  </p>
                </div>
                {e.location && (
                  <p className="text-sm text-[var(--color-muted-editorial-light)] dark-editorial:text-[var(--color-muted-editorial-dark)]">
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
```

- [ ] **Step 2: Verify + stage**

```sh
git add app/resume/page.tsx
```

Suggested commit:

```
feat(resume): /resume HTML rendering from Sanity experience + skills

PDF generation deferred to Plan 05.
```

Pause for Yasir to commit.

---

## Phase 4 — UX polish

### Task 4.1: Not-found page

**Files:**
- Create: `app/not-found.tsx`

- [ ] **Step 1: Page**

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="font-mono text-sm uppercase tracking-wide text-[var(--color-accent-editorial)]">404</p>
      <h1 className="mt-3 font-display text-4xl font-medium">Page not found</h1>
      <p className="mt-3 text-[var(--color-muted-editorial-light)] dark-editorial:text-[var(--color-muted-editorial-dark)]">
        That URL doesn't match anything Yasir has published.
      </p>
      <p className="mt-6">
        <Link href="/" className="underline underline-offset-4">
          Back to home →
        </Link>
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Stage + commit**

```sh
git add app/not-found.tsx
```

```
feat(404): custom not-found page in editorial style
```

Pause for Yasir to commit.

---

### Task 4.2: Loading + error states for the heavy routes

**Files:**
- Create: `app/work/loading.tsx`
- Create: `app/writing/loading.tsx`
- Create: `app/error.tsx`

- [ ] **Step 1: Loading stubs**

`app/work/loading.tsx` and `app/writing/loading.tsx` (identical bodies, both):

```tsx
export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <div className="h-10 w-48 animate-pulse rounded bg-black/5 dark-editorial:bg-white/10" />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-64 animate-pulse rounded-md bg-black/5 dark-editorial:bg-white/10"
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Error boundary**

`app/error.tsx`:

```tsx
"use client";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl font-medium">Something broke</h1>
      <p className="mt-3 text-[var(--color-muted-editorial-light)] dark-editorial:text-[var(--color-muted-editorial-dark)]">
        That's on me, not you.
      </p>
      <Button onClick={reset} className="mt-6">
        Try again
      </Button>
    </div>
  );
}
```

- [ ] **Step 3: Stage + commit**

```sh
git add app/work/loading.tsx app/writing/loading.tsx app/error.tsx
```

```
feat(ux): loading skeletons for /work and /writing, error boundary
```

Pause for Yasir to commit.

---

## Phase 5 — Seed Sanity with real content (Yasir, in Studio)

This phase is **manual content entry** — there's no code to write. Yasir does it in `/studio` (local or preview). Each task below is a list of fields to fill.

Once everything in this phase is published, the pages built in Phase 3 will populate.

### Task 5.1: Promote Leo's recommendation to hero

In Studio → Recommendations → Add:

- **Name:** Leo Smat
- **Role:** Forward Deployed Engineer
- **Company:** Benmore Technologies
- **Date:** 2026-04-23
- **Quote:** *(paste Leo's full quote — the long one about "complex data visualization tool and ERP system… LLM-driven workflows… patience and resolve were unmatched")*
- **LinkedIn URL:** Leo's LinkedIn profile URL
- **Headshot:** upload if available
- **Use as hero quote?** **Yes** ← critical for the home page
- **Order:** 0

**Publish.**

Then add the other 5 recommendations (Michael Brown, Abdulrasheed Abdulazeez, Razak Balogun, Dele Tejuoso, Sharmi Surianarain) with **isHeroQuote = false** and increasing `order` (1–5).

### Task 5.2: Seed case studies

For each of the 6 launch case studies, create a new `Case Study` document. Suggested order + slug pattern:

| order | slug | title | role | company | sector |
|---|---|---|---|---|---|
| 0 | `benmore-jbpro-erp` | JBPro ERP — LLM-driven workflows | Senior Software Engineer | Benmore Technologies | Applied AI |
| 1 | `codygo-worknet-ai` | Worknet AI — Agentic onboarding | AI Engineer | Codygo Solutions | Applied AI |
| 2 | `bookovia` | Bookovia — Supabase Edge + R2 migration | Web App Engineer | Bookovia | Backend |
| 3 | `handymesh` | Handymesh — React + RN + NestJS | Frontend Engineer | Handymesh | Mobile |
| 4 | `the-gold-metrics` | The Gold Metrics — Volatility Sniper + GVI | Founder | The Gold Metrics | Founder |
| 5 | `xenturylens` | Xenturylens — Nigerian exam LMS | Co-founder / Lead Engineer | Xenturylens | Founder |

For each, fill in (at minimum):
- **Title, slug, role, sector, company, startDate, endDate**
- **Stack** (tags): list the actual stack
- **isFeatured**: set `true` for the top 3 (Benmore, Codygo, TGM) so they appear on the home page
- **Hero image**: upload one (a screenshot, logo, or banner)
- **Problem / Architecture / My role / Outcome**: even a short paragraph each is fine for v2 launch; you can expand them over time

**Publish each.**

### Task 5.3: Seed experience entries

In Studio → Experience, create entries for each job (Codygo, ISDS, Payrit, Fazsion, etc.) with:
- Company, location, title, startDate, endDate (null for current)
- Bullets: use the strategist's "Shipped X using Y to achieve Z" formula — see brand strategist's CV teardown in the spec context
- Stack: the actual stack
- Order: ascending from most recent

### Task 5.4: Seed skills

In Studio → Skills, create entries for the curated groups (per spec § 11):
- **Languages:** TypeScript, Python, C#
- **Applied AI:** LangChain, Vercel AI SDK, OpenAI API, Whisper, RAG, Pinecone
- **Backend & Cloud:** Node.js, FastAPI, PostgreSQL, MongoDB, AWS (Lambda/CDK)
- **Frontend:** React, Next.js, Tailwind

Order within each group as you see fit.

### Task 5.5: Seed at least one article (Gen AI Playbook intro)

In Studio → Article Series, create:
- **Title:** The Gen AI Playbook
- **Slug:** `gen-ai-playbook`
- **Description:** "A 5-part series on shipping production-grade agentic LLM workflows."

Then in Studio → Articles, create one article (the first Playbook entry) with:
- Title, slug, excerpt, publishedAt
- Body: paste or rewrite the Medium content as Portable Text blocks
- Series: reference the playbook series
- SeriesOrder: 1
- Canonical URL: `https://yasirgaji.com/writing/<your-slug>`
- Medium URL: the original Medium link (for the "Also on Medium" footer)
- Tags: `["genai", "rag", "vercel-ai-sdk"]` or similar

**Publish.** You can repeat for the other 4 parts when convenient — they don't block Plan 02 completion.

No commit needed for Phase 5 — content lives in Sanity, not git.

---

## Phase 6 — Per-page metadata polish

### Task 6.1: Per-page generateMetadata is already in place

`generateMetadata` was added inline in Tasks 3.3 (case study), 3.5 (article). Other pages have static `metadata` exports.

- [ ] **Step 1: Verify all routes have titles**

Open each route and check `<title>` in DevTools:
- `/` → "Yasir Gaji — Senior Software Engineer"
- `/work` → "Work · Yasir Gaji"
- `/work/<slug>` → "<case study title> · Yasir Gaji"
- `/writing` → "Writing · Yasir Gaji"
- `/writing/<slug>` → "<article title> · Yasir Gaji"
- `/about` → "About · Yasir Gaji"
- `/contact` → "Contact · Yasir Gaji"
- `/resume` → "Resume · Yasir Gaji"

If any are missing, add `export const metadata = { title: "..." }` to that route.

No commit if everything passes; just verify.

---

## Phase 7 — Verify + preview deploy

### Task 7.1: Local smoke

- [ ] **Step 1: Full type + lint + test**

```sh
pnpm exec tsc --noEmit
pnpm lint
pnpm test
```

All should pass.

- [ ] **Step 2: Manual click-through in dev**

```sh
pnpm dev
```

Visit each route. Confirm content renders, links work, theme toggle flips light↔dark, no console errors.

### Task 7.2: Preview deploy

- [ ] **Step 1: Push**

```sh
git push origin version-2
```

Vercel auto-builds. Should take ~1–2 min.

- [ ] **Step 2: Visit the preview URL**

`https://yasir-gaji-git-version-2-yasirgajis-projects.vercel.app` — click every page, confirm Sanity content renders, confirm theme toggle works.

If `/studio` shows the "Add development host" prompt again (it does for each new deployment URL), click it.

---

## Plan 02 Self-Review Checklist

Before declaring Plan 02 done:

- [ ] `pnpm dev` works; all 8 pages render
- [ ] `pnpm exec tsc --noEmit` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes (Vitest)
- [ ] `pnpm build` produces no errors
- [ ] Leo's recommendation appears on the home page hero
- [ ] At least 3 featured case studies render on home (`isFeatured = true` in Studio)
- [ ] At least 3 articles render on home
- [ ] `/work` lists all case studies; `/work/<slug>` renders Portable Text body
- [ ] `/writing` lists all articles; `/writing/<slug>` renders Portable Text body with code blocks highlighted
- [ ] `/about` shows all 6 recommendations
- [ ] `/contact` opens Cal.com on click
- [ ] `/resume` reads from experience + skills
- [ ] Light/dark toggle persists across reload
- [ ] Preview deploy shows the same content as local
- [ ] All commits on `version-2`; `main` untouched

---

## What this plan does NOT do (deferred to subsequent plans)

- IDE mode chrome + the editorial↔IDE toggle (Plan 03)
- RAG AI demo + Pinecone indexing (Plan 04)
- PDF generation for `/resume` (Plan 05)
- OG image generation (`/og/[type]/[slug]`) (Plan 05)
- Sitemap + robots.txt + structured data (Plan 05)
- DNS cutover from Netlify to Vercel (Plan 05)
- Real article migration from Medium (only one seed article required here)

---

**End of Plan 02.** Ready for Plan 03 once Yasir has run through and the preview deploy looks right.
