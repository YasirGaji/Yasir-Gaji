# Portfolio v2 — Plan 01: Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Commit handling for this project:** Yasir runs every `git commit` himself. Commit steps in this plan stage the relevant files with `git add` and provide a suggested commit message, then **pause** for Yasir to execute the commit. Do not run `git commit` on his behalf. (See memory: `feedback-commits`.)

**Goal:** Establish the version-2 codebase: snapshot main as `version-1`, scaffold Next.js 16 + Tailwind v4 + Biome + pnpm on a fresh `version-2` branch, set up Sanity v3 with all 8 schemas + codegen + an embedded Studio at `/studio`, wire up Vitest + Playwright, link to Vercel for preview deployments, and prove the foundation works with a smoke test that fetches `siteSettings` from Sanity and renders it.

**Architecture:** Single Next.js 16 App Router app on pnpm. Sanity Studio embedded at `/studio` (same repo, same deployment). Schemas defined in `sanity/schemas/`, imported by both the Studio config and the runtime client. Type generation via `@sanity/codegen` writes types to `sanity/types.gen.ts` consumed app-wide. Tailwind v4 with `@theme` directive (CSS-variable-driven). Biome for lint/format (replaces ESLint+Prettier). Vitest for unit, Playwright for e2e.

**Tech Stack:** Next.js 16, pnpm, TypeScript 5, Tailwind v4, Biome, Sanity v3, `@sanity/codegen`, Vitest, Playwright, Vercel

**Plan output (end state):** A deployable Next.js site at a Vercel preview URL that renders one route (`/test`) showing data fetched from Sanity. No user-facing pages, no design — pure scaffold. All schemas defined and seeded with minimum content. Ready for Plan 02 (Editorial Mode) to start building the actual portfolio UI.

---

## Pre-flight

Before starting Task 0.1, confirm:

- [ ] You are in `/Users/yasirgaji/Downloads/Yasir-Gaji` (the existing repo)
- [ ] `git status` is clean enough that you don't lose work (the existing `M resources/.DS_Store` and the screenshot `?? "Screenshot 2026-05-13 at 07.04.35.png"` can stay untracked or be cleaned up separately)
- [ ] You have Node 22 LTS installed: `node --version` → `v22.x.x`
- [ ] You have pnpm installed: `pnpm --version` → `9.x.x` or newer (`npm i -g pnpm` if not)
- [ ] You have the Vercel CLI installed: `vercel --version` → `34.x.x` or newer (`npm i -g vercel` if not)
- [ ] You can sign in to Sanity: `npx -y sanity@latest login` (do later in Task 2.1)
- [ ] You have a GitHub token configured for `git push` (you've been pushing to this repo already, so this should be fine)

---

## Phase 0 — Migration

### Task 0.1: Snapshot `main` as `version-1` branch

**Files:** None (git operation only)

- [ ] **Step 1: Confirm clean enough working tree**

Run:
```sh
git status --short
```
Expected: only the pre-existing `M resources/.DS_Store` and `?? "Screenshot 2026-05-13 at 07.04.35.png"` and possibly `?? docs/` (the spec + this plan). If anything else is dirty, stash or commit it first (Yasir to decide).

- [ ] **Step 2: Make sure `main` is up to date with origin**

```sh
git checkout main
git pull --rebase origin main
```
Expected: `Already up to date.` or a clean rebase.

- [ ] **Step 3: Create `version-1` from `main`**

```sh
git checkout -b version-1
```
Expected: `Switched to a new branch 'version-1'`.

- [ ] **Step 4: Push `version-1` to origin**

```sh
git push -u origin version-1
```
Expected: branch pushed, upstream tracking set.

- [ ] **Step 5: Verify**

```sh
git branch -a | grep version-1
```
Expected: both local `version-1` and `remotes/origin/version-1` appear.

No commit step (no file changes).

---

### Task 0.2: Delete stale remote `version2` branch

**Files:** None (git operation only)

- [ ] **Step 1: Inspect the old `version2` branch to confirm there's nothing on it we want**

```sh
git log --oneline origin/version2 | head -20
```
Expected: list of commits ending around "stopping the 3d rendering for now". This is the abandoned Next.js + Chakra scaffold. Per design spec § 12.1, we are discarding it.

- [ ] **Step 2: Delete the remote branch**

```sh
git push origin --delete version2
```
Expected: `- [deleted]         version2`.

- [ ] **Step 3: Prune local refs**

```sh
git fetch --prune
git branch -a | grep version2
```
Expected: no output (the branch is gone everywhere).

---

### Task 0.3: Create fresh `version-2` branch from `main`

**Files:** None (git operation only)

- [ ] **Step 1: Ensure on `main`**

```sh
git checkout main
```

- [ ] **Step 2: Create `version-2` from `main`**

```sh
git checkout -b version-2
```
Expected: `Switched to a new branch 'version-2'`.

- [ ] **Step 3: Push `version-2` to origin**

```sh
git push -u origin version-2
```
Expected: branch pushed, upstream tracking set.

From this point forward, all work happens on `version-2`. `main` continues to serve the old static site via Netlify until the final PR merge in Plan 05.

---

## Phase 1 — Project Scaffold

### Task 1.1: Clear old static-site files from the `version-2` working tree

The current root has `index.html`, `outsourced/`, `resources/`, `.history/`, `.hintrc`, and `README.md` from v1. The full v1 source is preserved on the `version-1` branch (Task 0.1). Anything we need we can recover via `git checkout version-1 -- <path>`.

**Files:**
- Delete: `index.html`
- Delete: `outsourced/` (directory)
- Delete: `resources/` (directory)
- Delete: `.history/` (directory)
- Delete: `.hintrc`
- Modify: `README.md` (replace contents)
- Keep: `.gitignore` (will update in Task 1.2), `docs/`, `.git/`

- [ ] **Step 1: Confirm on `version-2`**

```sh
git branch --show-current
```
Expected: `version-2`.

- [ ] **Step 2: Remove old static-site assets**

```sh
rm -rf index.html outsourced resources .history .hintrc
```

- [ ] **Step 3: Replace `README.md` with a minimal placeholder**

Write to `README.md`:
```md
# yasirgaji.com

Personal portfolio of Yasir Gaji — Senior Software Engineer, Applied AI & Backend Architecture.

Built with Next.js 16, Sanity, Tailwind v4. Deployed on Vercel.

See `docs/superpowers/specs/2026-05-13-portfolio-v2-design.md` for the design.

## Develop

```sh
pnpm install
pnpm dev
```
```

- [ ] **Step 4: Verify clean root**

```sh
ls -la
```
Expected: `.git`, `.gitignore`, `docs`, `README.md`. (The untracked `Screenshot 2026-05-13 at 07.04.35.png` may still be present — leave it; not committed.)

- [ ] **Step 5: Stage. Suggested commit message:**

```sh
git add -A
```
```
chore: clear v1 static site files for v2 rebuild

v1 contents preserved on the version-1 branch. Recoverable via
`git checkout version-1 -- <path>` if needed during the rebuild.
```

Pause for Yasir to commit.

---

### Task 1.2: Initialize Next.js 16 app with pnpm

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `next-env.d.ts` (auto)
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Modify: `.gitignore`

- [ ] **Step 1: Scaffold Next.js 16 in place**

```sh
pnpm dlx create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --no-eslint \
  --use-pnpm \
  --turbopack \
  --skip-install
```

If `create-next-app` complains about a non-empty directory (because of `docs/`, `README.md`, `.git/`), it will prompt for confirmation; answer "Yes" / continue. The `--no-eslint` flag avoids ESLint scaffolding since we will install Biome in Task 1.4. If your installed version of `create-next-app` rejects any specific flag, omit just that flag and accept the interactive prompt's default; the only flag we strictly require is `--app`.

- [ ] **Step 2: Verify scaffold**

```sh
ls
```
Expected: `app/`, `public/`, `node_modules/` won't exist yet (we used `--skip-install`), but `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `next-env.d.ts` should all exist.

- [ ] **Step 3: Install dependencies**

```sh
pnpm install
```
Expected: a `pnpm-lock.yaml` and `node_modules/` materialize.

- [ ] **Step 4: Pin the Next.js version explicitly**

Open `package.json`, ensure `next` is `^16.0.0` (or whatever the latest 16.x is at install time). If it pulled in something older, force-update:
```sh
pnpm add next@latest react@latest react-dom@latest
```

- [ ] **Step 5: Tighten `tsconfig.json`**

Read the existing `tsconfig.json`. Inside the `"compilerOptions"` object (which already contains `"strict": true` from the scaffold), add these three new keys next to `"strict": true`:

```json
"noUncheckedIndexedAccess": true,
"noImplicitOverride": true,
"exactOptionalPropertyTypes": true
```

Do not remove or rename any existing keys. Verify by running `pnpm exec tsc --noEmit` — expected: no errors against the scaffolded code.

- [ ] **Step 6: Append to `.gitignore`**

Append to `.gitignore`:
```
# Sanity Studio
/sanity/dist

# Local env
.env
.env.local

# IDE
.idea
.vscode/.history

# OS
.DS_Store
```

- [ ] **Step 7: Smoke-test the dev server**

```sh
pnpm dev
```
Open http://localhost:3000 — see the default Next.js scaffold home page. `Ctrl+C` to stop.

- [ ] **Step 8: Stage. Suggested commit message:**

```sh
git add -A
```
```
chore: scaffold Next.js 16 with pnpm

create-next-app with TypeScript, Tailwind, App Router, Turbopack.
ESLint skipped (Biome will replace it). Strict TypeScript enabled.
```

Pause for Yasir to commit.

---

### Task 1.3: Configure Tailwind v4 with theme tokens

Next.js 16's default scaffold pulls in Tailwind, but we need to switch to the v4 `@theme` directive (CSS-variable-driven) per design spec § 6.7.

**Files:**
- Modify: `app/globals.css`
- Modify: `postcss.config.mjs` (verify)

- [ ] **Step 1: Confirm Tailwind v4 is installed**

```sh
pnpm list tailwindcss
```
Expected: `tailwindcss 4.x.x`. If older, `pnpm add tailwindcss@latest @tailwindcss/postcss@latest`.

- [ ] **Step 2: Replace `app/globals.css` with v4 + theme tokens stub**

```css
@import "tailwindcss";

@theme {
  /* Editorial — light */
  --color-bg-editorial-light: #FAF8F5;
  --color-ink-editorial-light: #1A1A1A;
  --color-muted-editorial-light: #6B6B6B;
  --color-line-editorial-light: #E6E1D8;

  /* Editorial — dark */
  --color-bg-editorial-dark: #0E0E0E;
  --color-ink-editorial-dark: #F0EDE7;
  --color-muted-editorial-dark: #8A8780;
  --color-line-editorial-dark: #1F1E1B;

  /* Editorial accent */
  --color-accent-editorial: #C9A24A;

  /* IDE — Dark 2026 derived */
  --color-bg-ide-editor: #1F1F1F;
  --color-bg-ide-sidebar: #181818;
  --color-bg-ide-activity: #141414;
  --color-bg-ide-statusbar: #005FB8;
  --color-fg-ide-default: #CCCCCC;
  --color-fg-ide-keyword: #C586C0;
  --color-fg-ide-string: #CE9178;
  --color-fg-ide-function: #DCDCAA;
  --color-fg-ide-type: #4EC9B0;
  --color-fg-ide-comment: #6A9955;

  /* Fonts */
  --font-display: "Fraunces", ui-serif, Georgia, serif;
  --font-body: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SF Mono", monospace;
}

@layer base {
  html {
    color-scheme: light dark;
  }
  body {
    background: var(--color-bg-editorial-light);
    color: var(--color-ink-editorial-light);
    font-family: var(--font-body);
  }
  html[data-mode="ide"] body {
    background: var(--color-bg-ide-editor);
    color: var(--color-fg-ide-default);
    font-family: var(--font-mono);
  }
  html[data-theme="dark"][data-mode="editorial"] body {
    background: var(--color-bg-editorial-dark);
    color: var(--color-ink-editorial-dark);
  }
}
```

- [ ] **Step 3: Verify Tailwind compiles**

```sh
pnpm dev
```
Open http://localhost:3000 — page should render with the warm off-white background (`#FAF8F5`). Stop the server.

- [ ] **Step 4: Stage. Suggested commit message:**

```sh
git add app/globals.css
```
```
feat(theme): add v2 color tokens for editorial + IDE modes

Defines all design-system tokens per spec § 6.7. `data-mode` and
`data-theme` attributes on <html> drive switching at the CSS-only
layer; React only writes the attributes.
```

Pause for Yasir to commit.

---

### Task 1.4: Install and configure Biome (lint + format)

**Files:**
- Create: `biome.json`
- Modify: `package.json` (add scripts)

- [ ] **Step 1: Install Biome**

```sh
pnpm add -D @biomejs/biome@latest
```

- [ ] **Step 2: Initialize config**

```sh
pnpm biome init
```
This creates a default `biome.json`.

- [ ] **Step 3: Replace `biome.json` with project config**

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
  "files": {
    "ignoreUnknown": true,
    "ignore": ["node_modules", ".next", "sanity/dist", "sanity/types.gen.ts", "public", "docs"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "trailingCommas": "all",
      "semicolons": "always"
    }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": {
        "useImportType": "error",
        "useNodejsImportProtocol": "error"
      },
      "correctness": {
        "noUnusedImports": "error",
        "noUnusedVariables": "error"
      }
    }
  }
}
```

- [ ] **Step 4: Add scripts to `package.json`**

In `package.json` `"scripts"`:
```json
{
  "lint": "biome check .",
  "lint:fix": "biome check --write .",
  "format": "biome format --write ."
}
```

- [ ] **Step 5: Verify Biome runs**

```sh
pnpm lint
```
Expected: passes (or shows a small number of issues from the scaffold; if so, run `pnpm lint:fix`).

- [ ] **Step 6: Stage. Suggested commit message:**

```sh
git add biome.json package.json
```
```
chore(lint): adopt Biome (replaces ESLint + Prettier)

Faster, single-tool lint + format. Mirrors Vercel's house style.
```

Pause for Yasir to commit.

---

### Task 1.5: Install Vitest for unit tests

**Files:**
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Modify: `package.json` (add scripts)
- Create: `tests/smoke.test.ts` (initial smoke test)

- [ ] **Step 1: Install Vitest + adapters**

```sh
pnpm add -D vitest @vitest/ui @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    include: ["tests/**/*.test.{ts,tsx}", "app/**/*.test.{ts,tsx}", "lib/**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next", "tests/e2e/**"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

- [ ] **Step 3: Create `tests/setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Add scripts to `package.json`**

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:ui": "vitest --ui"
}
```

- [ ] **Step 5: Write the failing smoke test**

Create `tests/smoke.test.ts`:
```ts
import { describe, it, expect } from "vitest";

describe("smoke", () => {
  it("vitest is wired up", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 6: Run the test**

```sh
pnpm test
```
Expected: `1 passed`.

- [ ] **Step 7: Stage. Suggested commit message:**

```sh
git add vitest.config.ts tests package.json
```
```
test: add Vitest + RTL setup with smoke test
```

Pause for Yasir to commit.

---

### Task 1.6: Install Playwright for e2e

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/homepage.spec.ts`
- Modify: `package.json` (add scripts)
- Modify: `.gitignore` (add Playwright caches)

- [ ] **Step 1: Install Playwright**

```sh
pnpm add -D @playwright/test
pnpm exec playwright install --with-deps chromium
```

- [ ] **Step 2: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
```

- [ ] **Step 3: Write the failing e2e**

Create `tests/e2e/homepage.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("home page renders", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/yasir|portfolio|next/i);
});
```

- [ ] **Step 4: Add scripts to `package.json`**

```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

- [ ] **Step 5: Append to `.gitignore`**

```
# Playwright
/test-results
/playwright-report
/playwright/.cache
```

- [ ] **Step 6: Run the e2e**

```sh
pnpm test:e2e
```
Expected: passes against the default Next.js scaffold home page (it has a Next.js-related title).

- [ ] **Step 7: Stage. Suggested commit message:**

```sh
git add playwright.config.ts tests/e2e package.json .gitignore
```
```
test: add Playwright e2e with homepage smoke test
```

Pause for Yasir to commit.

---

### Task 1.7: Establish project folder structure

Set up the canonical folder layout we will populate in subsequent tasks/plans. Touch a `.gitkeep` in empty dirs so they commit.

**Files:**
- Create: `components/.gitkeep`
- Create: `lib/.gitkeep`
- Create: `lib/sanity/.gitkeep`
- Create: `sanity/.gitkeep`
- Create: `sanity/schemas/.gitkeep`

- [ ] **Step 1: Create directories**

```sh
mkdir -p components lib/sanity sanity/schemas
touch components/.gitkeep lib/.gitkeep lib/sanity/.gitkeep sanity/.gitkeep sanity/schemas/.gitkeep
```

- [ ] **Step 2: Stage. Suggested commit message:**

```sh
git add -A
```
```
chore: scaffold project folder structure

components/ for React components
lib/ for utilities and adapters
lib/sanity/ for Sanity client and queries
sanity/ for Studio config and schemas
```

Pause for Yasir to commit.

---

## Phase 2 — Sanity Setup

### Task 2.1: Initialize Sanity v3 project

**Files:**
- Create: `sanity/sanity.config.ts`
- Create: `sanity/sanity.cli.ts`
- Create: `sanity/env.ts`
- Create: `app/studio/[[...tool]]/page.tsx`
- Create: `app/studio/[[...tool]]/Studio.tsx`
- Modify: `next.config.ts`
- Create: `.env.local` (NOT committed)

- [ ] **Step 1: Install Sanity packages**

```sh
pnpm add sanity@latest next-sanity@latest @sanity/vision@latest @sanity/image-url@latest
pnpm add -D @sanity/codegen@latest
```

- [ ] **Step 2: Log in to Sanity + create a project (interactive)**

```sh
pnpm dlx sanity@latest init --no-typescript
```

When prompted:
- "Select project to use" → **Create new project**
- Project name → `yasirgaji-portfolio`
- Use default dataset → **Yes** (`production`)
- Project output path → press Enter to accept current dir (`.`) — but say **No** when it asks to add boilerplate, because we will write the config files manually
- If it created any files we didn't want (e.g. `sanity.config.ts` at repo root), `rm` them.

Record the **project ID** and **dataset name** it printed. We will plug these into `.env.local` next.

- [ ] **Step 3: Create `.env.local`** (NOT committed)

```sh
cat > .env.local <<EOF
NEXT_PUBLIC_SANITY_PROJECT_ID=YOUR_PROJECT_ID_HERE
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-05-13
SANITY_API_READ_TOKEN=
EOF
```
Replace `YOUR_PROJECT_ID_HERE` with the project ID from Step 2.

(Read token is empty for now — we will use the public CDN for reads. Token will be added later if/when we need to read drafts.)

- [ ] **Step 4: Create `sanity/env.ts`**

```ts
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-13";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET",
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID",
);

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) throw new Error(errorMessage);
  return v;
}
```

- [ ] **Step 5: Create `sanity/sanity.config.ts`** (placeholder schema list)

```ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./env";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: [] },
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
});
```

- [ ] **Step 6: Create `sanity/sanity.cli.ts`**

```ts
import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./env";

export default defineCliConfig({ api: { projectId, dataset } });
```

- [ ] **Step 7: Create the embedded Studio route**

`app/studio/[[...tool]]/Studio.tsx`:
```tsx
"use client";
import { NextStudio } from "next-sanity/studio";
import config from "@/sanity/sanity.config";

export default function Studio() {
  return <NextStudio config={config} />;
}
```

`app/studio/[[...tool]]/page.tsx`:
```tsx
import Studio from "./Studio";

export const metadata = {
  title: "Studio · yasirgaji.com",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return <Studio />;
}
```

- [ ] **Step 8: Update `next.config.ts`** to allow Studio's `experimental.taint` (if a warning appears) and to set image domain for Sanity CDN:

```ts
import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
};

export default config;
```

- [ ] **Step 9: Verify Studio renders**

```sh
pnpm dev
```
Open http://localhost:3000/studio — Sanity Studio should load. Empty schema (nothing to edit yet) is expected.

- [ ] **Step 10: Stage. Suggested commit message:**

```sh
git add sanity app next.config.ts package.json pnpm-lock.yaml
# .env.local should NOT be staged (it's in .gitignore)
git status  # double-check .env.local is not staged
```
```
feat(sanity): bootstrap Sanity v3 with embedded Studio at /studio

Project ID + dataset wired via env. Studio mounts at /studio.
Schemas added in subsequent tasks.
```

Pause for Yasir to commit.

---

### Task 2.2: Schema — `siteSettings` (singleton)

**Files:**
- Create: `sanity/schemas/siteSettings.ts`
- Modify: `sanity/schemas/index.ts` (create)
- Modify: `sanity/sanity.config.ts`
- Test: `tests/sanity/siteSettings.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/sanity/siteSettings.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import siteSettings from "@/sanity/schemas/siteSettings";

describe("schema: siteSettings", () => {
  it("is a document type named 'siteSettings'", () => {
    expect(siteSettings.name).toBe("siteSettings");
    expect(siteSettings.type).toBe("document");
  });

  it("declares core fields", () => {
    const fieldNames = (siteSettings.fields ?? []).map((f) => f.name);
    expect(fieldNames).toEqual(
      expect.arrayContaining([
        "bio",
        "location",
        "availability",
        "socials",
        "calcomUrl",
        "cvPdfUrl",
        "resumeAsOf",
      ]),
    );
  });
});
```

- [ ] **Step 2: Run the test**

```sh
pnpm test tests/sanity/siteSettings.test.ts
```
Expected: FAIL — `Cannot find module '@/sanity/schemas/siteSettings'`.

- [ ] **Step 3: Implement the schema**

`sanity/schemas/siteSettings.ts`:
```ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  // Singleton: see structure builder customization for hiding the "+ create" button.
  fields: [
    defineField({ name: "bio", title: "Bio", type: "text", rows: 4 }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({
      name: "availability",
      title: "Availability",
      type: "string",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Open to conversations", value: "open-to-conversations" },
          { title: "Not looking", value: "not-looking" },
        ],
        layout: "radio",
      },
      initialValue: "available",
    }),
    defineField({
      name: "socials",
      title: "Socials",
      type: "object",
      fields: [
        defineField({ name: "github", type: "url" }),
        defineField({ name: "linkedin", type: "url" }),
        defineField({ name: "medium", type: "url" }),
        defineField({ name: "twitter", type: "url" }),
        defineField({ name: "email", type: "email" }),
      ],
    }),
    defineField({ name: "calcomUrl", title: "Cal.com booking URL", type: "url" }),
    defineField({ name: "cvPdfUrl", title: "Generated CV PDF URL", type: "url", readOnly: true }),
    defineField({ name: "resumeAsOf", title: "Resume as of (build date)", type: "date", readOnly: true }),
  ],
});
```

- [ ] **Step 4: Create `sanity/schemas/index.ts`**

```ts
import siteSettings from "./siteSettings";

export const schemaTypes = [siteSettings];
```

- [ ] **Step 5: Wire into `sanity.config.ts`**

In `sanity/sanity.config.ts`, replace `schema: { types: [] }` with:
```ts
import { schemaTypes } from "./schemas";
// ...
schema: { types: schemaTypes },
```

- [ ] **Step 6: Run the test**

```sh
pnpm test tests/sanity/siteSettings.test.ts
```
Expected: PASS.

- [ ] **Step 7: Verify in Studio**

```sh
pnpm dev
```
Open http://localhost:3000/studio — "Site Settings" should appear in the navigation. Click it, fill in `bio` ("Senior Software Engineer..."), `location` ("Lagos, Nigeria · Remote / Global Operations"), `availability` (Available), socials (your URLs), `calcomUrl` (your Cal.com booking URL). **Publish** the document.

- [ ] **Step 8: Stage. Suggested commit message:**

```sh
git add sanity tests/sanity
```
```
feat(sanity): add siteSettings singleton schema
```

Pause for Yasir to commit.

---

### Task 2.3: Schema — `experience`

**Files:**
- Create: `sanity/schemas/experience.ts`
- Modify: `sanity/schemas/index.ts`
- Test: `tests/sanity/experience.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/sanity/experience.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import experience from "@/sanity/schemas/experience";

describe("schema: experience", () => {
  it("declares core fields", () => {
    const fieldNames = (experience.fields ?? []).map((f) => f.name);
    expect(fieldNames).toEqual(
      expect.arrayContaining([
        "company",
        "location",
        "title",
        "startDate",
        "endDate",
        "bullets",
        "stack",
        "order",
      ]),
    );
  });
});
```

- [ ] **Step 2: Run the test**

```sh
pnpm test tests/sanity/experience.test.ts
```
Expected: FAIL.

- [ ] **Step 3: Implement**

`sanity/schemas/experience.ts`:
```ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    defineField({ name: "company", type: "string", validation: (r) => r.required() }),
    defineField({ name: "location", type: "string" }),
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "startDate", type: "date", validation: (r) => r.required() }),
    defineField({ name: "endDate", type: "date" }),
    defineField({
      name: "bullets",
      title: "Bullets",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "stack",
      title: "Stack",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
    { title: "Most recent", name: "startDesc", by: [{ field: "startDate", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "company" },
  },
});
```

- [ ] **Step 4: Wire into `sanity/schemas/index.ts`**

```ts
import siteSettings from "./siteSettings";
import experience from "./experience";

export const schemaTypes = [siteSettings, experience];
```

- [ ] **Step 5: Run the test**

```sh
pnpm test tests/sanity/experience.test.ts
```
Expected: PASS.

- [ ] **Step 6: Stage. Suggested commit message:**

```sh
git add sanity tests/sanity
```
```
feat(sanity): add experience schema
```

Pause for Yasir to commit.

---

### Task 2.4: Schema — `skill`

**Files:**
- Create: `sanity/schemas/skill.ts`
- Modify: `sanity/schemas/index.ts`
- Test: `tests/sanity/skill.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/sanity/skill.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import skill from "@/sanity/schemas/skill";

describe("schema: skill", () => {
  it("declares core fields", () => {
    const fieldNames = (skill.fields ?? []).map((f) => f.name);
    expect(fieldNames).toEqual(
      expect.arrayContaining(["group", "name", "level", "order"]),
    );
  });
});
```

- [ ] **Step 2: Run** — expected FAIL.

```sh
pnpm test tests/sanity/skill.test.ts
```

- [ ] **Step 3: Implement** — `sanity/schemas/skill.ts`:

```ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "skill",
  type: "document",
  fields: [
    defineField({
      name: "group",
      type: "string",
      options: {
        list: [
          { title: "Languages", value: "languages" },
          { title: "Applied AI", value: "applied-ai" },
          { title: "Backend & Cloud", value: "backend-cloud" },
          { title: "Frontend", value: "frontend" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "level",
      type: "string",
      options: {
        list: [
          { title: "Core", value: "core" },
          { title: "Strong", value: "strong" },
          { title: "Familiar", value: "familiar" },
        ],
      },
      initialValue: "strong",
    }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  preview: {
    select: { title: "name", subtitle: "group" },
  },
});
```

- [ ] **Step 4: Wire into `sanity/schemas/index.ts`**

```ts
import siteSettings from "./siteSettings";
import experience from "./experience";
import skill from "./skill";

export const schemaTypes = [siteSettings, experience, skill];
```

- [ ] **Step 5: Run** — expected PASS.

```sh
pnpm test tests/sanity/skill.test.ts
```

- [ ] **Step 6: Stage. Suggested commit message:**

```sh
git add sanity tests/sanity
```
```
feat(sanity): add skill schema with curated groups
```

Pause for Yasir to commit.

---

### Task 2.5: Schema — `recommendation`

**Files:**
- Create: `sanity/schemas/recommendation.ts`
- Modify: `sanity/schemas/index.ts`
- Test: `tests/sanity/recommendation.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/sanity/recommendation.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import recommendation from "@/sanity/schemas/recommendation";

describe("schema: recommendation", () => {
  it("declares core fields", () => {
    const fieldNames = (recommendation.fields ?? []).map((f) => f.name);
    expect(fieldNames).toEqual(
      expect.arrayContaining([
        "name",
        "role",
        "company",
        "date",
        "quote",
        "linkedinUrl",
        "headshot",
        "isHeroQuote",
        "order",
      ]),
    );
  });
});
```

- [ ] **Step 2: Run** — expected FAIL.

- [ ] **Step 3: Implement** — `sanity/schemas/recommendation.ts`:

```ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "recommendation",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "company", type: "string" }),
    defineField({ name: "date", type: "date" }),
    defineField({ name: "quote", type: "text", rows: 5, validation: (r) => r.required() }),
    defineField({ name: "linkedinUrl", type: "url" }),
    defineField({ name: "headshot", type: "image", options: { hotspot: true } }),
    defineField({
      name: "isHeroQuote",
      title: "Use as hero quote? (only one)",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  preview: {
    select: { title: "name", subtitle: "role" },
  },
});
```

- [ ] **Step 4: Wire** into `sanity/schemas/index.ts`.

- [ ] **Step 5: Run** — expected PASS.

- [ ] **Step 6: Stage. Suggested commit message:**

```
feat(sanity): add recommendation schema
```

Pause for Yasir to commit.

---

### Task 2.6: Schema — `articleSeries`

(Needed before `article` because `article.series` references it.)

**Files:**
- Create: `sanity/schemas/articleSeries.ts`
- Modify: `sanity/schemas/index.ts`
- Test: `tests/sanity/articleSeries.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/sanity/articleSeries.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import series from "@/sanity/schemas/articleSeries";

describe("schema: articleSeries", () => {
  it("declares core fields", () => {
    const fieldNames = (series.fields ?? []).map((f) => f.name);
    expect(fieldNames).toEqual(
      expect.arrayContaining(["title", "slug", "description", "coverImage"]),
    );
  });
});
```

- [ ] **Step 2: Run** — expected FAIL.

- [ ] **Step 3: Implement** — `sanity/schemas/articleSeries.ts`:

```ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "articleSeries",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 80 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({ name: "coverImage", type: "image", options: { hotspot: true } }),
  ],
});
```

- [ ] **Step 4: Wire** into `sanity/schemas/index.ts`.

- [ ] **Step 5: Run** — expected PASS.

- [ ] **Step 6: Stage. Suggested commit message:**

```
feat(sanity): add articleSeries schema
```

Pause for Yasir to commit.

---

### Task 2.7: Schema — `article`

**Files:**
- Create: `sanity/schemas/article.ts`
- Modify: `sanity/schemas/index.ts`
- Test: `tests/sanity/article.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/sanity/article.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import article from "@/sanity/schemas/article";

describe("schema: article", () => {
  it("declares core fields", () => {
    const fieldNames = (article.fields ?? []).map((f) => f.name);
    expect(fieldNames).toEqual(
      expect.arrayContaining([
        "title",
        "slug",
        "excerpt",
        "body",
        "publishedAt",
        "series",
        "seriesOrder",
        "mediumUrl",
        "canonicalUrl",
        "coverImage",
        "readingTime",
        "tags",
      ]),
    );
  });
});
```

- [ ] **Step 2: Run** — expected FAIL.

- [ ] **Step 3: Implement** — `sanity/schemas/article.ts`:

```ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "article",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "excerpt", type: "text", rows: 3 }),
    defineField({
      name: "body",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
        {
          type: "object",
          name: "codeBlock",
          title: "Code block",
          fields: [
            { name: "language", type: "string" },
            { name: "code", type: "text", rows: 10 },
          ],
        },
      ],
    }),
    defineField({ name: "publishedAt", type: "datetime", validation: (r) => r.required() }),
    defineField({
      name: "series",
      type: "reference",
      to: [{ type: "articleSeries" }],
    }),
    defineField({ name: "seriesOrder", type: "number" }),
    defineField({ name: "mediumUrl", type: "url" }),
    defineField({ name: "canonicalUrl", type: "url" }),
    defineField({ name: "coverImage", type: "image", options: { hotspot: true } }),
    defineField({
      name: "readingTime",
      title: "Reading time (minutes, auto)",
      type: "number",
      readOnly: true,
    }),
    defineField({
      name: "tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
  ],
  orderings: [
    { title: "Newest", name: "newest", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "excerpt", media: "coverImage" },
  },
});
```

- [ ] **Step 4: Wire** into `sanity/schemas/index.ts`.

- [ ] **Step 5: Run** — expected PASS.

- [ ] **Step 6: Stage. Suggested commit message:**

```
feat(sanity): add article schema with code-block inline type
```

Pause for Yasir to commit.

---

### Task 2.8: Schema — `caseStudy`

**Files:**
- Create: `sanity/schemas/caseStudy.ts`
- Modify: `sanity/schemas/index.ts`
- Test: `tests/sanity/caseStudy.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/sanity/caseStudy.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import caseStudy from "@/sanity/schemas/caseStudy";

describe("schema: caseStudy", () => {
  it("declares core fields", () => {
    const fieldNames = (caseStudy.fields ?? []).map((f) => f.name);
    expect(fieldNames).toEqual(
      expect.arrayContaining([
        "title",
        "slug",
        "role",
        "sector",
        "company",
        "startDate",
        "endDate",
        "heroImage",
        "gallery",
        "stack",
        "problem",
        "architecture",
        "myRole",
        "outcome",
        "liveUrl",
        "relatedArticles",
        "isFeatured",
        "order",
      ]),
    );
  });
});
```

- [ ] **Step 2: Run** — expected FAIL.

- [ ] **Step 3: Implement** — `sanity/schemas/caseStudy.ts`:

```ts
import { defineType, defineField } from "sanity";

const portableTextBody = [
  { type: "block" },
  { type: "image", options: { hotspot: true } },
  {
    type: "object",
    name: "codeBlock",
    title: "Code block",
    fields: [
      { name: "language", type: "string" },
      { name: "code", type: "text", rows: 10 },
    ],
  },
];

export default defineType({
  name: "caseStudy",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "role", type: "string" }),
    defineField({
      name: "sector",
      type: "string",
      options: {
        list: [
          { title: "Applied AI", value: "applied-ai" },
          { title: "Backend", value: "backend" },
          { title: "Founder", value: "founder" },
          { title: "Mobile", value: "mobile" },
          { title: "Frontend", value: "frontend" },
        ],
      },
    }),
    defineField({ name: "company", type: "string" }),
    defineField({ name: "startDate", type: "date" }),
    defineField({ name: "endDate", type: "date" }),
    defineField({ name: "heroImage", type: "image", options: { hotspot: true } }),
    defineField({
      name: "gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "stack",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({ name: "problem", type: "array", of: portableTextBody }),
    defineField({ name: "architecture", type: "array", of: portableTextBody }),
    defineField({ name: "myRole", type: "array", of: portableTextBody }),
    defineField({ name: "outcome", type: "array", of: portableTextBody }),
    defineField({ name: "liveUrl", type: "url" }),
    defineField({
      name: "relatedArticles",
      type: "array",
      of: [{ type: "reference", to: [{ type: "article" }] }],
    }),
    defineField({ name: "isFeatured", type: "boolean", initialValue: false }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "role", media: "heroImage" },
  },
});
```

- [ ] **Step 4: Wire** into `sanity/schemas/index.ts`.

- [ ] **Step 5: Run** — expected PASS.

- [ ] **Step 6: Stage. Suggested commit message:**

```
feat(sanity): add caseStudy schema with structured PT sections
```

Pause for Yasir to commit.

---

### Task 2.9: Schema — `seoImage`

**Files:**
- Create: `sanity/schemas/seoImage.ts`
- Modify: `sanity/schemas/index.ts`
- Test: `tests/sanity/seoImage.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/sanity/seoImage.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import seoImage from "@/sanity/schemas/seoImage";

describe("schema: seoImage", () => {
  it("declares core fields", () => {
    const fieldNames = (seoImage.fields ?? []).map((f) => f.name);
    expect(fieldNames).toEqual(
      expect.arrayContaining(["forType", "forSlug", "image"]),
    );
  });
});
```

- [ ] **Step 2: Run** — expected FAIL.

- [ ] **Step 3: Implement** — `sanity/schemas/seoImage.ts`:

```ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "seoImage",
  type: "document",
  fields: [
    defineField({
      name: "forType",
      type: "string",
      options: {
        list: [
          { title: "Case study", value: "caseStudy" },
          { title: "Article", value: "article" },
          { title: "Page", value: "page" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "forSlug", type: "string", validation: (r) => r.required() }),
    defineField({ name: "image", type: "image", validation: (r) => r.required() }),
  ],
});
```

- [ ] **Step 4: Wire** into `sanity/schemas/index.ts`.

- [ ] **Step 5: Run** — expected PASS.

- [ ] **Step 6: Stage. Suggested commit message:**

```
feat(sanity): add seoImage schema for per-page OG overrides
```

Pause for Yasir to commit.

---

### Task 2.10: Sanity Studio polish — singleton + structure

Make `siteSettings` behave as a true singleton (no "+ new" option in the Studio), and group document types into a clean sidebar.

**Files:**
- Create: `sanity/structure.ts`
- Modify: `sanity/sanity.config.ts`

- [ ] **Step 1: Create `sanity/structure.ts`**

```ts
import type { StructureBuilder } from "sanity/structure";

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.documentTypeListItem("caseStudy").title("Case Studies"),
      S.documentTypeListItem("article").title("Articles"),
      S.documentTypeListItem("articleSeries").title("Article Series"),
      S.documentTypeListItem("recommendation").title("Recommendations"),
      S.documentTypeListItem("experience").title("Experience"),
      S.documentTypeListItem("skill").title("Skills"),
      S.divider(),
      S.documentTypeListItem("seoImage").title("SEO Images"),
    ]);
```

- [ ] **Step 2: Wire into `sanity/sanity.config.ts`**

```ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./env";
import { schemaTypes } from "./schemas";
import { structure } from "./structure";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => schemaType !== "siteSettings"),
  },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
```

- [ ] **Step 3: Verify in Studio**

```sh
pnpm dev
```
Open http://localhost:3000/studio — sidebar should show: Site Settings (single item), then Case Studies, Articles, etc. The `+ new` button for siteSettings should be gone.

- [ ] **Step 4: Stage. Suggested commit message:**

```
feat(sanity/studio): organize structure + singleton-ize siteSettings
```

Pause for Yasir to commit.

---

### Task 2.11: Type generation with `@sanity/codegen`

**Files:**
- Create: `sanity-typegen.json`
- Create: `lib/sanity/queries.ts` (initial: just one query)
- Generated: `sanity/types.gen.ts` (committed)
- Modify: `package.json` (add scripts)

- [ ] **Step 1: Create `sanity-typegen.json`**

```json
{
  "path": "./{app,components,lib,sanity}/**/*.{ts,tsx}",
  "schema": "./sanity/extract.json",
  "generates": "./sanity/types.gen.ts"
}
```

- [ ] **Step 2: Create initial query**

`lib/sanity/queries.ts`:
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

- [ ] **Step 3: Add scripts to `package.json`**

```json
{
  "typegen:extract": "sanity schema extract --workspace default --path sanity/extract.json --enforce-required-fields",
  "typegen": "pnpm typegen:extract && sanity typegen generate"
}
```

Note: depending on Sanity CLI version, `sanity schema extract` may need `--config sanity/sanity.cli.ts`. Adjust if needed.

- [ ] **Step 4: Run typegen**

```sh
pnpm typegen
```
Expected: `sanity/extract.json` and `sanity/types.gen.ts` written. Glance at `sanity/types.gen.ts` — should contain `SiteSettings`, `Experience`, `CaseStudy`, etc., and a `SiteSettingsQueryResult` type derived from the `siteSettingsQuery`.

- [ ] **Step 5: Stage. Suggested commit message:**

```
feat(sanity): add @sanity/codegen + first generated types

Generated types committed under sanity/types.gen.ts. Re-run `pnpm typegen`
after schema or query changes.
```

Pause for Yasir to commit.

---

### Task 2.12: Sanity client wrapper

**Files:**
- Create: `lib/sanity/client.ts`
- Create: `lib/sanity/image.ts`
- Test: `tests/sanity/client.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/sanity/client.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { client } from "@/lib/sanity/client";

describe("sanity client", () => {
  it("exposes a configured client", () => {
    expect(client).toBeDefined();
    expect(client.config().projectId).toBeTruthy();
    expect(client.config().dataset).toBe("production");
  });
});
```

- [ ] **Step 2: Run** — expected FAIL.

- [ ] **Step 3: Implement** — `lib/sanity/client.ts`:

```ts
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});
```

`lib/sanity/image.ts`:
```ts
import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { dataset, projectId } from "@/sanity/env";

const builder = createImageUrlBuilder({ projectId, dataset });

export const urlForImage = (src: SanityImageSource) => builder.image(src);
```

- [ ] **Step 4: Add the test's `.env.local` shim**

The Vitest run loads env from `process.env`. Ensure `tests/setup.ts` includes a guard to load `.env.local`:

Replace `tests/setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
import { config } from "dotenv";
config({ path: ".env.local" });
```

```sh
pnpm add -D dotenv
```

- [ ] **Step 5: Run** — expected PASS.

```sh
pnpm test tests/sanity/client.test.ts
```

- [ ] **Step 6: Stage. Suggested commit message:**

```
feat(sanity): add client wrapper + image URL builder
```

Pause for Yasir to commit.

---

### Task 2.13: Smoke route — `/test` reads from Sanity

End-to-end proof: the foundation can fetch `siteSettings` and render it.

**Files:**
- Create: `app/test/page.tsx`
- Test: `tests/e2e/sanity-smoke.spec.ts`

- [ ] **Step 1: Write the failing e2e**

`tests/e2e/sanity-smoke.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("/test renders siteSettings.location", async ({ page }) => {
  await page.goto("/test");
  await expect(page.getByTestId("location")).toContainText("Lagos");
});
```

- [ ] **Step 2: Run** — expected FAIL (route doesn't exist).

```sh
pnpm test:e2e tests/e2e/sanity-smoke.spec.ts
```

- [ ] **Step 3: Implement** — `app/test/page.tsx`:

```tsx
import { client } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import type { SiteSettingsQueryResult } from "@/sanity/types.gen";

export default async function TestPage() {
  const data = (await client.fetch(siteSettingsQuery)) as SiteSettingsQueryResult;
  return (
    <main style={{ padding: 24, fontFamily: "var(--font-body)" }}>
      <h1>Sanity smoke test</h1>
      <p data-testid="location">{data?.location ?? "no location set"}</p>
      <p data-testid="bio">{data?.bio ?? "no bio set"}</p>
    </main>
  );
}
```

- [ ] **Step 4: Verify locally**

Make sure Sanity Studio has `siteSettings.location = "Lagos, Nigeria · Remote / Global Operations"` published (from Task 2.2 Step 7). Then:

```sh
pnpm dev
```
Open http://localhost:3000/test — should render the bio and location.

- [ ] **Step 5: Run the e2e** — expected PASS.

```sh
pnpm test:e2e tests/e2e/sanity-smoke.spec.ts
```

- [ ] **Step 6: Stage. Suggested commit message:**

```
feat(test): add /test route proving end-to-end Sanity wiring
```

Pause for Yasir to commit.

---

## Phase 3 — Vercel Project Link + Preview Deployment

### Task 3.1: Link the repo to a Vercel project

**Files:**
- Create: `.vercel/project.json` (auto-generated by `vercel link`, gitignored)
- Modify: `.gitignore` (add `.vercel`)

- [ ] **Step 1: Ensure `.gitignore` ignores Vercel**

Append to `.gitignore`:
```
# Vercel
.vercel
```

- [ ] **Step 2: Run `vercel link`**

```sh
vercel link
```
When prompted:
- Set up "~/Downloads/Yasir-Gaji"? **Y**
- Which scope? Your personal account (or team if applicable)
- Link to existing project? **N** (create new)
- Project name → `yasirgaji-portfolio`
- Code directory → `./` (current)
- Override settings? **N**

`vercel` writes `.vercel/project.json` with the project ID + org ID.

- [ ] **Step 3: Stage. Suggested commit message:**

```sh
git add .gitignore
```
```
chore(vercel): ignore .vercel project metadata
```

Pause for Yasir to commit.

---

### Task 3.2: Push Sanity env vars to Vercel

- [ ] **Step 1: Push each env var to Vercel (Development, Preview, Production)**

```sh
echo "$NEXT_PUBLIC_SANITY_PROJECT_ID_value" | vercel env add NEXT_PUBLIC_SANITY_PROJECT_ID production
# Repeat for preview + development, and for the other env vars.
```

Easier interactive flow:
```sh
vercel env add NEXT_PUBLIC_SANITY_PROJECT_ID
vercel env add NEXT_PUBLIC_SANITY_DATASET
vercel env add NEXT_PUBLIC_SANITY_API_VERSION
```

For each: when prompted, choose **Production, Preview, Development** (use spacebar to select all three) and paste the value from `.env.local`.

- [ ] **Step 2: Pull env vars back to verify**

```sh
vercel env pull .vercel/.env.local
diff .env.local .vercel/.env.local
```
Expected: the three NEXT_PUBLIC_SANITY_* match across files. (`SANITY_API_READ_TOKEN` may be missing — that's fine; we haven't created one yet.)

No commit needed.

---

### Task 3.3: First preview deployment

- [ ] **Step 1: Deploy a preview**

```sh
vercel
```
This deploys to a preview URL like `https://yasirgaji-portfolio-xxxxxx.vercel.app`.

- [ ] **Step 2: Verify the preview URL**

Open the preview URL in a browser and visit `/test` — should render the bio and location from Sanity, same as local.

Also visit `/studio` — the Sanity Studio should load on the preview (read-only browsing OK; auth happens client-side).

- [ ] **Step 3: Push `version-2` to origin (if not already)**

```sh
git push origin version-2
```

GitHub + Vercel: once the repo is connected (do this via the Vercel dashboard if not auto-done), pushes to `version-2` will auto-build preview deployments. Confirm in the Vercel dashboard.

No commit step — this is the deploy verification.

---

## Plan 01 Self-Review Checklist

Before declaring Plan 01 done:

- [ ] Local `pnpm dev` works; http://localhost:3000/test renders Sanity data
- [ ] Local `pnpm dev` Studio works at http://localhost:3000/studio
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes (all 7 unit tests: 1 smoke + 6 schemas + 1 client)
- [ ] `pnpm test:e2e` passes (2 e2e: homepage + sanity-smoke)
- [ ] `pnpm build` produces no errors
- [ ] Preview deployment at `https://yasirgaji-portfolio-*.vercel.app/test` renders Sanity data
- [ ] All commits are on `version-2`
- [ ] `main` and `version-1` are untouched
- [ ] Remote `version2` (no hyphen) is deleted

---

## What this plan does NOT do (deferred to subsequent plans)

- Editorial mode UI (Plan 02)
- IDE mode + toggle (Plan 03)
- RAG demo (Plan 04)
- PDF generation, OG images, SEO, content migration, DNS cutover (Plan 05)
- Any case-study or article content beyond seed data needed for testing
- Pinecone, Upstash Redis, Gemini, Cal.com integrations (Plan 04 + 05)

---

**End of Plan 01.** Ready for Plan 02 once Yasir has run through and confirmed the foundation is solid.
