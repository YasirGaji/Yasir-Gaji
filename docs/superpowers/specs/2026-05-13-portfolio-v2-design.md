# Yasir Gaji — Portfolio v2 Design

| | |
|---|---|
| **Status** | Draft (pending Yasir's review) |
| **Owner** | Yasir Gaji |
| **Date** | 2026-05-13 |
| **Branch target** | `version-2` (current `main` snapshotted to `version-1` first) |

---

## 1. Context

The current site at `yasirgaji.com` is a single 730-line static HTML page that frames Yasir as a generic frontend developer. It is missing every entity that defines his 2026 work — Benmore Technologies, Bookovia, Xenturylens, The Gold Metrics, JBPro — and contains a typo on his prior employer's country ("Isreal"). The brand strategist's audit confirmed: the site, LinkedIn headline, GitHub profile, and CV all read like a 2021 frontend portfolio, while behind the scenes Yasir is operating as a Senior GenAI + Backend Architect and dev-studio founder.

Portfolio v2 closes that gap. It is a multi-page Next.js 16 site with a Sanity CMS backbone, a dual-mode visual system (Editorial default / VS Code IDE alternate), and an embedded RAG demo that proves the GenAI claim rather than asserting it.

## 2. Goals

1. **Reposition** Yasir's public surface from "React frontend developer" to "Senior Software Engineer — Applied AI & Backend Architecture."
2. **Convert** hiring-manager inbound (Joseph-tier $4k/mo+ remote roles, AI architect roles).
3. **Serve as visa evidence** for the UK Global Talent Visa application before EOY 2026 — every claim citable, every artifact on a stable URL.
4. **Prove the GenAI claim** via a working RAG demo, not boilerplate.
5. **Eliminate manual CV/resume drift** — single source of truth in Sanity; PDF auto-generated.

## 3. Audiences

The site serves two co-primary audiences whose needs are different but not in conflict. Every design decision is evaluated against both.

| Tier | Audience | What they need from the site |
|---|---|---|
| Primary A | AI hiring managers (founders, eng leads at AI-first companies) | Proof of LLM work, citable case studies, recommendations from senior engineers, easy way to book a call |
| Primary B | UK Global Talent Visa reviewer (often non-technical) | Clear narrative, deep-linkable evidence per claim, recognition signals (recommendations), thought leadership (Gen AI Playbook) |
| Secondary | Recruiters | Fast skim, exact-match keywords, clear titles |
| Secondary | Xenturylens prospective clients | Studio-quality presentation, contact path |

**Tie-breaker rule when A and B conflict:** Primary B wins on the editorial mode (default), Primary A wins on the IDE mode (opt-in). Both render the same content; the mode toggle is how we serve both without compromise.

YC and VC investors for TGM are explicitly **not** an audience for this site — they will be served by a separate TGM landing page in a different repo.

## 4. Non-Goals (Out of Scope for v2)

- User accounts, comments, newsletter signup
- Multilingual content
- Xenturylens or TGM product content (separate repos / sites)
- Live trading / financial features
- Public CMS preview links for unpublished content (drafts visible only to author)
- Mobile-specific IDE mode (mobile is editorial-only)

## 5. Positioning & Narrative

**Headline:** Yasir Gaji — Senior Software Engineer · Applied AI & Backend Architecture

**Sub-headline:** Architecting agentic LLM workflows and event-driven systems. Currently at Benmore Technologies. Founder of The Gold Metrics. Co-founder of Xenturylens.

**Location string:** Lagos, Nigeria · Remote / Global Operations

**Hero quote (above-the-fold):**
> "Yasir consistently demonstrated strong technical ability… designing an intuitive, functional frontend by leveraging unique React libraries, collaborating with another technical team to implement a FastAPI backend, and making incredible progress by using LLM-driven workflows."
> — **Leo Smat**, Forward Deployed Engineer @ Benmore Technologies

**Narrative arc (used in About + meta descriptions):**
> Started in frontend at Lagos studios in 2021. Moved into full-stack at ISDS and Payrit. Crossed into Applied AI at Codygo (Worknet) — first hands-on with LangChain, RAG, Vercel AI SDK, agentic workflows. Now ships LLM-driven systems for an enterprise ERP at Benmore (JBPro / Arvoke). Building The Gold Metrics on the side — a fintech that digitises mineral-resources economics through education, AI, and gold-backed paper trading. Writes the Gen AI Playbook on Medium.

## 6. Visual System

### 6.1 Dual Mode (Editorial / IDE)

The site ships two complete visual treatments. Editorial is the default; IDE is opt-in via a toggle in the navigation bar. The toggle persists per user (cookie + localStorage), reads server-side on first paint to avoid FOUC, and is disabled below 1024px viewport (mobile is editorial-only).

Mode affects **chrome only** — navigation, hero treatment, code-block styling, AI demo placement, color palette, typography. Content (text, images, project order) is identical across modes.

Mode switch uses the **View Transitions API** for a smooth cross-fade; falls back to instant repaint on browsers without support.

### 6.2 Editorial Mode

Editorial mode has its own independent light/dark sub-toggle (orthogonal to the editorial/IDE mode toggle). On first visit, system preference is honored; user choice persists via cookie + localStorage and overrides system after that.

- **Sub-theme default:** match system; fallback Light.
- **Background (light):** `#FAF8F5` (warm off-white)
- **Background (dark):** `#0E0E0E` (near-black with slight warmth)
- **Ink:** `#1A1A1A` / `#F0EDE7`
- **Accent:** `#C9A24A` (warm gold — subtle thread to TGM brand)
- **Display font:** Fraunces (variable, serif, optical sizing)
- **Body font:** Inter (variable, sans)
- **Code/mono accents:** JetBrains Mono
- **Navigation:** Top bar, sticky, minimal. Logo (`YG`), 5 links (Work · Writing · About · Demo · Contact), mode toggle, light/dark toggle.
- **Hero:** Large display type, generous whitespace, Leo quote inline below sub-headline.
- **Code blocks:** Mono on subtle tinted background, syntax via Shiki, gold accent for keywords.
- **AI demo:** Floating bottom-right pill, expands to chat drawer.

### 6.3 IDE Mode

Match Yasir's actual VS Code setup to within visual indistinguishability. **Dark-only in v2** (matches his current `Dark 2026` default). A `Light 2026` variant can be added in v2.1 if requested — out of scope for launch.

- **Theme:** Dark 2026 (VS Code's 2026 default dark theme). Pull exact token colors from the published VS Code source.
- **Icon theme:** Material Icon Theme (MIT-licensed SVGs embedded as React components).
- **Layout:**
  - Top window chrome: macOS-style title bar with red/yellow/green dots, "yasirgaji.com — Visual Studio Code" title
  - Activity bar: vertical left rail with icons (Explorer · Search · Source Control · Run · Extensions · Account · Settings)
  - Primary sidebar: file tree showing pages as files (`home.tsx`, `about.tsx`, `work/`, `writing/`, `contact.tsx`)
  - Editor area: page content rendered as if inside a code editor — file tabs at top, breadcrumbs, line numbers along the gutter, content as syntactically-highlighted TSX-like blocks for code sections and rendered Markdown for prose
  - Bottom panel: collapsible Terminal containing the AI demo (REPL-style prompt + responses)
  - Status bar: branch (`main`), Live Server indicator, encoding (UTF-8), language (TSX), Prettier badge — playful but accurate
- **Typography:** JetBrains Mono throughout.
- **Mobile:** Disabled. Toggle hidden below 1024px; remembered preference re-applies when viewport returns to desktop.

### 6.4 Mode Toggle Mechanics

- Toggle component lives in the nav (editorial: small icon button; IDE: status-bar item).
- Persisted as `theme-mode` cookie (`editorial` | `ide`), `Path=/`, `SameSite=Lax`, 1-year TTL.
- Server reads cookie in `app/layout.tsx` and applies `data-mode="..."` to `<html>` before first paint.
- Client mirrors to `localStorage.theme-mode` for fast re-read.
- Tailwind v4 CSS variables switch entirely via `data-mode` attribute (no class swapping at runtime).
- Mobile: if viewport < 1024px, force `data-mode="editorial"` regardless of stored preference.

### 6.5 Motion

- **Library:** Framer Motion (Yasir has prior experience from the abandoned v2).
- **Mode switch:** View Transitions API (where supported).
- **Page transitions:** Soft cross-fade between routes via `next-view-transitions`.
- **Hero entrance:** Stagger reveal on first paint, no scroll-jacking.
- **Hover affordances:** Subtle 150ms ease-out lifts on cards.
- **Reduced motion:** All non-essential motion respects `prefers-reduced-motion`.

### 6.6 Typography

| Mode | Display | Body | Mono |
|---|---|---|---|
| Editorial | Fraunces (variable) | Inter (variable) | JetBrains Mono |
| IDE | JetBrains Mono | JetBrains Mono | JetBrains Mono |

All fonts self-hosted via `next/font/google` (no external requests at runtime).

### 6.7 Color tokens (Tailwind v4 `@theme`)

```css
@theme {
  /* Editorial */
  --color-bg-editorial-light: #FAF8F5;
  --color-bg-editorial-dark:  #0E0E0E;
  --color-ink-editorial-light: #1A1A1A;
  --color-ink-editorial-dark:  #F0EDE7;
  --color-accent-editorial:    #C9A24A;

  /* IDE — Dark 2026 derived */
  --color-bg-ide-editor:   #1F1F1F;
  --color-bg-ide-sidebar:  #181818;
  --color-bg-ide-activity: #141414;
  --color-bg-ide-statusbar:#005FB8;
  --color-fg-ide-default:  #CCCCCC;
  --color-fg-ide-keyword:  #C586C0;
  --color-fg-ide-string:   #CE9178;
  --color-fg-ide-function: #DCDCAA;
  --color-fg-ide-type:     #4EC9B0;
  --color-fg-ide-comment:  #6A9955;
}
```

(Exact token values will be cross-referenced against the VS Code source before commit.)

## 7. Information Architecture

```
/                    Home
/work                All case studies, filter chips
/work/[slug]         Case study detail
/writing             All articles, series grouping
/writing/[slug]      Article body
/about               Long-form narrative
/demo                RAG chat (full page, deep-linkable)
/resume              HTML resume + PDF download
/contact             Cal.com embed + email + socials
/og/[type]/[slug]    Dynamic OG image generation
/sitemap.xml         Auto-generated from Sanity content
/robots.txt          Static
```

### Page-by-page content blueprint

#### `/` Home
- Hero (headline + sub + Leo quote + primary CTA)
- Currently shipping: 3 cards (Benmore JBPro, Codygo Worknet, The Gold Metrics)
- Recent writing: 3 latest articles
- Demo callout: "Ask anything about my work →" → `/demo`
- Closing CTA: "Available for senior IC / AI architect roles" → Cal.com

#### `/work` Index
- Filter chips: All · Applied AI · Backend · Founder · Mobile · Frontend
- Grid of case-study cards (image, title, stack chips, role chip)
- Cards link to `/work/[slug]`

#### `/work/[slug]` Detail
- Hero image (Sanity-hosted)
- Title, role, dates, stack, sector
- **Problem** — what the team faced
- **Architecture** — system diagram or code excerpt
- **My role** — exact responsibilities
- **Stack** — annotated stack list
- **Outcome** — metrics where shareable, qualitative where not
- **Artifacts** — links to live URL, related writing, related case studies

**Case studies in v2 launch:**
1. `benmore-jbpro-erp` — FastAPI + LangChain + LLM-driven workflows · Senior SWE
2. `codygo-worknet-ai` — Agentic onboarding · RAG · LangChain · Vercel AI SDK · AI Engineer
3. `bookovia` — Supabase Edge Functions · Cloudflare R2 migration · Web App Engineer
4. `handymesh` — React + React Native + DigitalOcean + NestJS · Frontend (+ DevOps support)
5. `the-gold-metrics` — Fintech · Volatility Sniper · GVI · oz_equivalent · Founder
6. `xenturylens` — Dev studio · Nigerian exam LMS contract (₦1.7M) · Co-founder / Lead Engineer

Older works (Fazsion, TheYutes, Netphlix, Òonjẹ, Intech, Payrit, ISDS) surface as a compact "More work" grid at the bottom of `/work`, not full case studies. Their job is to show range and history; they should not dilute the senior narrative.

#### `/writing` Index
- Hero: "The Gen AI Playbook" series surfaced as the lead block
- Grid of all articles, newest first
- Series indicator on articles that belong to one

#### `/writing/[slug]` Article
- Native, canonical to `yasirgaji.com/writing/[slug]`
- Body in Portable Text → Shiki for code, Tailwind Typography for prose
- Footer: "Originally syndicated to Medium →" (where applicable)
- Closing CTA: same Cal.com link

#### `/about`
- Long-form narrative (per § 5)
- All 6 recommendations, prominently placed (not hidden in a carousel)
- "What I'm building" — Benmore, TGM, Xenturylens, JBPro
- "Speaking & writing" — Medium link, Gen AI Playbook callout
- "How I work" — short manifesto (~150 words)
- "Available for" — IC senior, AI architect, founding eng, advisor

#### `/demo`
- Full-page chat (deep-linkable)
- Same RAG backend as the embedded widget
- Suggested prompts: "Tell me about JBPro's architecture" · "What does Yasir know about RAG?" · "Show me his agentic work" · "Hire him for what?"
- Citation chips inline; click jumps to source page

#### `/resume`
- Rendered HTML resume (per § 10)
- "Download PDF" button → `/api/resume/pdf`
- Print stylesheet for browser-print path
- Versioned: `/resume?as-of=2026-05-13` keeps an immutable URL for visa applications

#### `/contact`
- Cal.com embed (15-min intro)
- Email (`mailto:`)
- LinkedIn, GitHub, Medium, X
- Optional: "Send a longer brief" textarea that opens a pre-filled mailto

## 8. Content Model — Sanity

8 document types. All defined in `sanity/schemas/` with TypeScript types generated via `sanity-codegen`.

### `caseStudy`
```ts
{
  _type: 'caseStudy',
  title: string,
  slug: { current: string },
  role: string,                 // "Senior Software Engineer"
  sector: 'applied-ai' | 'backend' | 'founder' | 'mobile' | 'frontend',
  company: reference (to a companyInfo singleton or inline),
  startDate: date,
  endDate: date | null,
  heroImage: image,
  gallery: image[],
  stack: string[],              // ["FastAPI", "LangChain", "Pinecone", ...]
  problem: portableText,
  architecture: portableText,   // supports code blocks, diagrams
  myRole: portableText,
  outcome: portableText,
  liveUrl: url | null,
  relatedArticles: reference[] (article),
  isFeatured: boolean,
  order: number,
}
```

### `article`
```ts
{
  _type: 'article',
  title: string,
  slug: { current: string },
  excerpt: text,
  body: portableText,
  publishedAt: datetime,
  series: reference (articleSeries) | null,
  seriesOrder: number | null,
  mediumUrl: url | null,
  canonicalUrl: url,             // defaults to https://yasirgaji.com/writing/[slug]
  coverImage: image,
  readingTime: number (auto-computed),
  tags: string[],
}
```

### `articleSeries`
```ts
{
  _type: 'articleSeries',
  title: string,                 // "The Gen AI Playbook"
  slug: { current: string },
  description: text,
  coverImage: image,
}
```

### `recommendation`
```ts
{
  _type: 'recommendation',
  name: string,
  role: string,
  company: string,
  date: date,
  quote: text,
  linkedinUrl: url,
  headshot: image | null,
  isHeroQuote: boolean,          // exactly one true at a time, validated
  order: number,
}
```

### `experience`
```ts
{
  _type: 'experience',
  company: string,
  location: string,
  title: string,
  startDate: date,
  endDate: date | null,
  bullets: portableText[],
  stack: string[],
  order: number,
}
```

### `skill`
```ts
{
  _type: 'skill',
  group: 'languages' | 'applied-ai' | 'backend-cloud' | 'frontend',
  name: string,
  level: 'core' | 'strong' | 'familiar',
  order: number,
}
```

### `siteSettings` (singleton)
```ts
{
  _type: 'siteSettings',
  bio: text,
  location: string,
  availability: 'available' | 'open-to-conversations' | 'not-looking',
  socials: { github, linkedin, medium, twitter, email },
  calcomUrl: url,
  cvPdfUrl: url,                 // auto-set by build pipeline
  resumeAsOf: date,
}
```

### `seoImage`
```ts
{
  _type: 'seoImage',
  forType: 'caseStudy' | 'article' | 'page',
  forSlug: string,
  image: image,
}
```

## 9. AI Demo — RAG

### 9.1 Indexed Sources

One Pinecone index, one namespace (`portfolio-v1`). Approximate sizes:

| Source | Documents | Chunks |
|---|---|---|
| Case studies | 6 launch + older | ~80 chunks |
| Articles (Gen AI Playbook + others) | ~15 | ~120 chunks |
| Recommendations | 6 | 6 chunks |
| CV / Resume fields | 1 composite doc | ~10 chunks |
| Site settings (bio, availability) | 1 | ~3 chunks |

Chunk strategy: ~500 tokens per chunk, 100-token overlap, semantic boundaries (paragraph-aware via Portable Text traversal).

### 9.2 Retrieval Pipeline

```
user input
   ↓
Gemini text-embedding-004
   ↓
Pinecone top-k (k=8, similarity threshold 0.5)
   ↓
context window assembly (cite-tagged: [source-type:slug])
   ↓
Gemini 2.5 Pro (with Flash failover via AI Gateway)
   ↓
streamed response → UI
```

### 9.3 Generation

System prompt enforces:
- "Only make claims supported by retrieved context. If you don't know, say so and offer a Cal.com link."
- "Every factual claim must end with a citation in the form `[1]`, `[2]`. The chunk metadata tells you the source slug."
- "Stay on topic: Yasir's work, writing, recommendations, availability. Decline politics, personal questions, anything outside the corpus."
- "Speak in first-person about Yasir's work where appropriate ('I shipped…') only when the retrieved chunk is itself first-person; otherwise speak in third-person ('Yasir built…')."

Model: `gemini-2.5-pro` default. Fallback: `gemini-2.5-flash` via Vercel AI Gateway routing if Pro returns 5xx or exceeds latency budget (8s).

### 9.4 UX

**Editorial widget:**
- Bottom-right floating button (gold accent, mono "Ask anything" label)
- Click → drawer slides up from right (max 480px wide, full height)
- Streaming response, citation chips render inline
- "Open full demo →" link to `/demo`

**IDE terminal:**
- Bottom panel of the IDE chrome, always visible
- REPL-style: `$ ask "your question"`
- Response streams as if `cat`ed
- Citations as `[ref:1]` tokens that hover-preview source

**Both:**
- Conversation history in `useState` only (no persistence across reloads in v2)
- Copy-to-clipboard on any AI response
- "Was this useful?" thumbs (logged to Vercel Analytics custom event)

### 9.5 Reindex

Sanity webhook → `/api/reindex` Vercel function → re-embed changed documents → upsert to Pinecone. Triggered on publish of `caseStudy`, `article`, `recommendation`, `experience`, `skill`, `siteSettings`. Idempotent: re-running is safe.

Manual trigger: `pnpm reindex` script for local dev.

### 9.6 Rate Limiting

Upstash Redis sliding-window: **20 messages per IP per 24h**. On hit:

> "You've hit the demo's daily limit. Want to keep the conversation going? Book a 15-min slot → [Cal.com link]"

This converts the rate-limit wall into a conversion event.

## 10. CV / Resume

Sanity is the single source of truth. `experience[]`, `skill[]`, and `siteSettings` feed the rendered output.

### Flow

```
Sanity (experience + skill + siteSettings)
   ↓
/resume route (server component) → renders HTML
   ↓
print stylesheet for browser-print
   ↓
/api/resume/pdf → Puppeteer-core + @sparticuz/chromium → styled PDF
   ↓
Vercel cache (24h)
```

### Layout

Single-page priority. Sections in order:
1. Header (name, title, location, contact line)
2. Summary (2 sentences, pulled from `siteSettings.bio`)
3. Selected experience (4–5 most recent `experience` docs)
4. Selected projects (3 starred `caseStudy` docs, condensed)
5. Skills (grouped per § 8 `skill.group`)
6. Education (added later if Yasir wants)
7. Recognition (recommendations + writing — 1-line each, link to portfolio)

PDF filename: `Yasir-Gaji-CV-{YYYY-MM}.pdf`, where `{YYYY-MM}` is the build date. Visa applications cite the latest version; if a previously-cited PDF needs to be preserved for the visa file, the applicant downloads and archives locally. Sanity's history API for time-travel queries is **out of scope for v2** (potential v2.1 enhancement).

## 11. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 App Router with Cache Components | App Router for nested layouts, Cache Components for PPR on `/work` + `/writing` |
| Hosting | Vercel | Sanity 1-click integration; first-party Next.js |
| CMS | Sanity (Free dev tier) | Single-user editing; upgrade if collaborators added |
| Vector DB | Pinecone (Free starter pod) | 1 index, 1 namespace |
| Embeddings | Gemini `text-embedding-004` | 768d, free tier sufficient for portfolio scale |
| LLM | Gemini 2.5 Pro (primary) + 2.5 Flash (failover) | Via `@ai-sdk/google` and Vercel AI Gateway |
| Booking | Cal.com embed | 15-min intro slot |
| Rate limiting | Upstash Redis | Auto-provisioned via Vercel Marketplace |
| Email | Plain `mailto:` | No form |
| Analytics | Vercel Analytics + Speed Insights | Custom events for AI demo |
| PDF | `puppeteer-core` + `@sparticuz/chromium` | Vercel function with extended memory |
| Image hosting | Sanity CDN | Migrate `i.ibb.co` images during build |
| Styling | Tailwind v4 + CSS variables | Theme switch via `data-mode` attribute |
| Components | shadcn/ui | Selective install: button, dialog, tabs, drawer, sheet, command |
| Icons | Material Icon Theme SVGs (IDE) + Lucide (editorial) | MIT-licensed |
| Fonts | next/font/google (self-hosted) | Fraunces, Inter, JetBrains Mono |
| Syntax | Shiki | "github-dark-dimmed" base, custom Dark 2026 grammar |
| Forms | None in v2 | — |
| Auth | None | — |
| Testing | Vitest (unit) + Playwright (e2e on critical paths) | Hero, mode toggle, AI demo, resume PDF |
| Lint | Biome | Faster than ESLint + Prettier combo |
| Package manager | pnpm | Lockfile committed |
| Node | 22 LTS | |

## 12. Migration Plan

### 12.1 Git

```sh
# Snapshot current main
git checkout main
git pull --rebase
git checkout -b version-1
git push -u origin version-1

# Delete the stale remote version2 branch
git push origin --delete version2

# Fresh start for v2
git checkout main
git checkout -b version-2
git push -u origin version-2

# All v2 work happens on version-2.
# When ready: PR version-2 → main, merge, deploy.
```

The old static site continues serving from `main` (via Netlify) throughout the build. Cutover happens at PR merge.

### 12.2 Content

Content migration is **content-rewrite**, not lift-and-shift, because the strategist's audit requires rewriting the bullet points and removing fluff.

1. Inventory existing surfaces: index.html, README, current CV PDF, Medium articles, LinkedIn experience entries.
2. Populate Sanity with **rewritten** content per § 5 narrative + § 3.1 strategist guidance ("Shipped X using Y to achieve Z" formula).
3. Migrate images: download from `i.ibb.co` URLs, upload to Sanity media library. Generate fresh assets for entities the current site lacks (Benmore, Bookovia, TGM placeholder).
4. Migrate articles: import each Medium article body, set `canonicalUrl` to yasirgaji.com, update Medium-side canonical (Medium → Story settings → "Add canonical link") to point back.
5. Reindex Pinecone after content is in.

### 12.3 DNS

1. Connect repo to Vercel; project name `yasirgaji-portfolio`.
2. Add `yasirgaji.com` as production domain in Vercel.
3. While `version-2` is in development, Vercel serves it from a `*.vercel.app` preview URL.
4. On merge to `main`, Vercel auto-deploys to production.
5. DNS cutover: update yasirgaji.com nameservers/A record from Netlify to Vercel.
6. Netlify project decommissioned 7 days post-cutover (window to roll back if needed).

## 13. Performance & SEO

- **Cache Components** on `/work`, `/writing` for PPR with `use cache` and `cacheTag` keyed to Sanity document `_id`.
- **Static-ish where possible:** case-study pages prerendered at build, revalidated on Sanity publish via tag-based invalidation (`updateTag`).
- **Image optimization:** Next.js `<Image>` + Sanity's `?w=&fm=auto` query parameters.
- **OG images:** `@vercel/og` at `/og/[type]/[slug]`. One template per type (caseStudy, article, home).
- **Sitemap:** generated from Sanity content at build; revalidates on publish.
- **Robots:** allow all; surface `/sitemap.xml`.
- **Meta:** per-page title, description, OG image; structured data (`Person`, `Article`, `BreadcrumbList`) on relevant pages.
- **Core Web Vitals targets:** LCP < 1.5s, INP < 200ms, CLS < 0.05.
- **Lighthouse target:** ≥95 on Performance, Accessibility, Best Practices, SEO.

## 14. Accessibility

- WCAG AA contrast in both modes (Dark 2026 base palette tested for AA-large; supplemental color overrides where it falls short).
- Full keyboard navigation, visible focus rings (mode-appropriate).
- Mode toggle exposed via `aria-pressed`.
- AI demo: live region for streamed responses; arrow-key navigation through message history; `Esc` closes the drawer.
- Reduced motion respected throughout.
- Semantic HTML; ARIA only where it adds value.
- Skip-to-content link in both modes.

## 15. Open Questions / Risks

1. **VS Code "Dark 2026" exact tokens** — to confirm against current VS Code source before commit. Risk: tokens drift if VS Code ships a 2027 update.
2. **Material Icon Theme SVG packaging** — bundle size budget. May need tree-shake / sprite sheet.
3. **Gemini 2.5 Pro cost at portfolio scale** — likely <$5/mo at typical traffic, but viral spike risk is real. Rate limit + Flash failover should cap exposure.
4. **PDF generation cold-start** — Puppeteer + Chromium on a Vercel function takes 1.5–3s cold. Acceptable for a CV download but worth caching aggressively.
5. **Visa-evidence stability** — visa applications can take months. URLs cited in the application must not break. Implication: case-study slugs are immutable once published; redirects required for any future rename.
6. **Sanity Free tier limits** — 100k API CDN requests / 5GB bandwidth / 10GB assets. Sufficient for v2 launch, monitor at 30 days.

## 16. Success Criteria

v2 ships successfully if:

1. **Repositioning:** A visitor lands on `/` and within 5 seconds correctly identifies Yasir as a "Senior Software Engineer working in Applied AI / Backend Architecture," not a frontend developer.
2. **Conversion path:** Cal.com bookings increase month-over-month vs. v1 (baseline: ~0).
3. **Visa readiness:** Every claim in Yasir's UK Global Talent Visa application links to a stable URL on yasirgaji.com with supporting evidence.
4. **AI proof:** The `/demo` page receives ≥1 message per visitor session on average (suggesting curiosity → engagement).
5. **No CV drift:** All future CV updates happen in Sanity. `/resume` PDF download always reflects latest.
6. **Lighthouse ≥95** across all four scores on `/`, `/work`, `/about`.

## 17. Implementation Order (for the upcoming plan)

The implementation plan (next document) will sequence the build as:

1. Git migration (snapshot main → version-1, delete remote version2, branch version-2)
2. Next.js 16 scaffold + Tailwind v4 + Biome + pnpm
3. Sanity project + schemas + initial content seeding
4. Editorial mode (static, no content yet): layout, fonts, theme tokens, light/dark
5. Sanity integration: case studies, articles, recommendations populated
6. IDE mode chrome (Activity Bar, sidebar, file tree, editor, terminal, status bar)
7. Mode toggle + cookie/SSR + View Transitions
8. AI demo: Pinecone index, embedding pipeline, retrieval, generation, citation UI
9. Demo UX surfaces: editorial widget + IDE terminal panel
10. Resume route + PDF generation
11. OG image generation
12. Sitemap, robots, structured data
13. Performance pass (Cache Components, image audit, font subset)
14. Accessibility pass (keyboard, contrast, ARIA, screen reader spot-checks)
15. Content rewrite (per strategist's bullet-point formula)
16. Final QA on staging URL
17. DNS cutover

Each step gets its own checkpoint in the implementation plan with verification commands.

---

**End of design spec.** Yasir to review and flag any changes before we proceed to writing the implementation plan via the `superpowers:writing-plans` skill.
