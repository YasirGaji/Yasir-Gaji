# Portfolio v2 — Plan 03: IDE Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Commit handling for this project:** Yasir runs every `git commit` himself. Commit steps stage the relevant files with `git add` and provide a suggested commit message, then **pause** for Yasir to execute the commit. Do not run `git commit` on his behalf. (See memory: `feedback-commits`.)

**Goal:** Add the second visual mode from spec § 6.3 — a VS-Code-like chrome that wraps the same content as editorial mode in a "Dark 2026" themed IDE shell. Toggle between editorial and IDE in the nav (desktop only — mobile is editorial-locked). Persist the choice via cookie. Use the View Transitions API for the swap.

**Architecture:** A single `data-mode` attribute on `<html>` (already in place from Plan 02 T1.1, set to `editorial` by default) is now driven by a `mode` cookie. A new `<ModeShell>` component reads the mode and renders either the existing editorial chrome (current SiteNav + main + SiteFooter) or the new IDE chrome (macOS title bar + Activity Bar + Explorer sidebar + Editor area with the page content inside + Status Bar + Terminal panel placeholder). The page content (server components fetching from Sanity) is shared — only the framing changes. Mode toggle button lives in the nav (editorial) or status bar (IDE). Mobile (`< 1024px`) forces editorial regardless of cookie via a one-line guard in the layout.

**Tech Stack:** Next.js 16 App Router (already in place), Tailwind v4 with our existing IDE token palette (`--color-bg-ide-editor`, `--color-bg-ide-sidebar`, etc. already in `app/globals.css` from Plan 01 T1.3), View Transitions API via `next-view-transitions`. No new heavyweight dependencies — the chrome is hand-rolled with Tailwind utilities + a small number of custom SVG icons.

**Plan output (end state):** A working `/` (and every other route) that, when the user clicks the editorial↔IDE toggle, re-renders the page inside a VS Code chrome with the same content. Cookie persists the choice. Mobile silently stays editorial. View Transitions API gives a smooth cross-fade between modes.

**NOT in this plan (deferred):**
- Real AI demo inside the terminal panel (Plan 04 — RAG demo)
- Pixel-perfect Material Icon Theme SVGs for every file type (we'll use a small Lucide set + 4-5 hand-picked SVGs for top-level file/folder icons; full Material Icon Theme is a v2.1 polish)
- Full Shiki Dark 2026 grammar (we already use `github-dark-dimmed` from Plan 02 T2.2 — close enough for v2 launch)
- Light 2026 variant of IDE mode (spec § 6.3 explicitly defers this to v2.1)

---

## Pre-flight

- [ ] On branch `version-2`, working tree clean
- [ ] `pnpm dev` boots locally with no errors
- [ ] Plan 02 Phase 7 push has triggered a successful preview build at `yasir-gaji-git-version-2-yasirgajis-projects.vercel.app`

---

## Phase 1 — Mode infrastructure

### Task 1.1: Mode cookie helper

**Files:**
- Create: `lib/mode-cookie.ts`

```ts
import { cookies } from "next/headers";

export const MODE_COOKIE = "mode";
export type Mode = "editorial" | "ide";

export async function getModeFromCookie(): Promise<Mode> {
  const store = await cookies();
  const value = store.get(MODE_COOKIE)?.value;
  return value === "ide" ? "ide" : "editorial";
}
```

Note: defaults to `editorial`. Unlike theme (which can be null for system-pref), mode always resolves to a concrete value because the visual chrome is wholly different per mode.

- [ ] **Step 1: Stage + commit message**

```sh
git add lib/mode-cookie.ts
```

```
feat(mode): cookie helper for editorial/IDE mode persistence
```

Pause for Yasir to commit.

---

### Task 1.2: Mode toggle component (client)

**Files:**
- Create: `components/mode-toggle.tsx`

```tsx
"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Mode = "editorial" | "ide";

function readInitialMode(): Mode {
  if (typeof document === "undefined") return "editorial";
  const attr = document.documentElement.getAttribute("data-mode") as Mode | null;
  return attr === "ide" ? "ide" : "editorial";
}

export function ModeToggle({ className }: { className?: string }) {
  const [mode, setMode] = useState<Mode>("editorial");
  const [, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    setMode(readInitialMode());
  }, []);

  const flip = () => {
    const next: Mode = mode === "editorial" ? "ide" : "editorial";
    document.cookie = `mode=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

    // Apply attribute immediately for instant visual feedback
    document.documentElement.setAttribute("data-mode", next);
    setMode(next);

    // Re-fetch the server-rendered shell so the chrome swaps
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={flip}
      aria-label={`Switch to ${mode === "editorial" ? "IDE" : "editorial"} mode`}
      className={className}
    >
      {mode === "editorial" ? "IDE" : "Editorial"}
    </Button>
  );
}
```

Note on motion: View Transitions API integration in Task 1.5 (we wrap the `flip` callback with `document.startViewTransition` then). For now this gives a hard swap that we can soften later.

- [ ] **Step 1: Stage + commit message**

```sh
git add components/mode-toggle.tsx
```

```
feat(mode): client toggle for editorial/IDE mode

Writes the mode cookie, applies data-mode for instant visual feedback,
then router.refresh() to swap the server-rendered chrome.
```

Pause for Yasir to commit.

---

### Task 1.3: ModeShell — the layout split

**Files:**
- Create: `components/mode-shell.tsx`
- Create: `components/ide/index.tsx` (re-export hub for IDE chrome pieces — populated in Phase 2)
- Modify: `app/layout.tsx` (use `ModeShell` instead of direct `SiteNav` + `<main>` + `SiteFooter`)

The shell decides which chrome wraps the page content based on the resolved mode.

`components/mode-shell.tsx`:

```tsx
import { getModeFromCookie } from "@/lib/mode-cookie";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { IDEShell } from "@/components/ide";

export async function ModeShell({ children }: { children: React.ReactNode }) {
  const mode = await getModeFromCookie();
  if (mode === "ide") {
    return <IDEShell>{children}</IDEShell>;
  }
  return (
    <>
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
```

`components/ide/index.tsx` (placeholder — fleshed out in Task 2.1):

```tsx
export function IDEShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-bg-ide-editor font-mono text-fg-ide-default">
      <div className="border-b border-bg-ide-activity p-3 text-sm">[IDE mode — chrome WIP]</div>
      <main className="flex-1 p-6">{children}</main>
      <div className="border-t border-bg-ide-activity p-2 text-xs">[status bar WIP]</div>
    </div>
  );
}
```

`app/layout.tsx` — replace the body section:

```tsx
import { ModeShell } from "@/components/mode-shell";
import { getModeFromCookie } from "@/lib/mode-cookie";

// inside RootLayout (already async):
const [theme, mode] = await Promise.all([getThemeFromCookie(), getModeFromCookie()]);

return (
  <html
    lang="en"
    data-mode={mode}
    {...(theme ? { "data-theme": theme } : {})}
    className={className}
  >
    <body className="min-h-full flex flex-col">
      <ModeShell>{children}</ModeShell>
    </body>
  </html>
);
```

- [ ] **Step 1: Verify**

```sh
pnpm exec tsc --noEmit
pnpm lint
```

Open `/` in dev — should still render the editorial layout. Open DevTools, set the `mode=ide` cookie manually for `localhost:3000`, refresh — should see the placeholder IDE chrome.

- [ ] **Step 2: Stage + commit message**

```sh
git add components/mode-shell.tsx components/ide/index.tsx app/layout.tsx
```

```
feat(mode): ModeShell wrapper switches editorial/IDE chrome

ModeShell reads the mode cookie server-side and renders the
appropriate chrome around page content. IDE chrome is placeholder
this commit — real implementation in Phase 2.
```

Pause for Yasir to commit.

---

### Task 1.4: Mobile fallback (force editorial below 1024px)

`<html data-mode>` is server-rendered from the cookie. We can't know viewport size on the server. Solution: client-side guard that, if the viewport is < 1024px AND the cookie says `ide`, immediately rewrites `data-mode="editorial"` and triggers a refresh so the server re-renders editorial chrome.

**Files:**
- Create: `components/mobile-mode-guard.tsx`
- Modify: `app/layout.tsx` (mount the guard once near root)

`components/mobile-mode-guard.tsx`:

```tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function MobileModeGuard() {
  const router = useRouter();
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const enforce = () => {
      const isMobile = mq.matches;
      const currentMode = document.documentElement.getAttribute("data-mode");
      if (isMobile && currentMode === "ide") {
        document.cookie = `mode=editorial; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
        document.documentElement.setAttribute("data-mode", "editorial");
        router.refresh();
      }
    };
    enforce();
    mq.addEventListener("change", enforce);
    return () => mq.removeEventListener("change", enforce);
  }, [router]);
  return null;
}
```

Mount in `app/layout.tsx` just inside `<body>`:

```tsx
<body className="min-h-full flex flex-col">
  <MobileModeGuard />
  <ModeShell>{children}</ModeShell>
</body>
```

- [ ] **Step 1: Verify**

In dev, resize browser to < 1024px width with `mode=ide` cookie set — page should snap to editorial. Resize back up — stays editorial unless you click the toggle (because cookie was overwritten to editorial).

- [ ] **Step 2: Stage + commit message**

```sh
git add components/mobile-mode-guard.tsx app/layout.tsx
```

```
feat(mode): mobile force-editorial guard

Below 1024px, IDE mode is unreadable, so we silently overwrite to
editorial. Runs on mount and on viewport-resize crossings of the
1024px breakpoint.
```

Pause for Yasir to commit.

---

### Task 1.5: View Transitions API for smooth mode flip

**Files:**
- Install: `next-view-transitions`
- Modify: `app/layout.tsx` (wrap with `<ViewTransitions>` provider)
- Modify: `components/mode-toggle.tsx` (wrap the flip in `document.startViewTransition`)

```sh
pnpm add next-view-transitions
```

In `app/layout.tsx`:

```tsx
import { ViewTransitions } from "next-view-transitions";

// wrap the entire return:
return (
  <ViewTransitions>
    <html ...>
      <body ...>
        <MobileModeGuard />
        <ModeShell>{children}</ModeShell>
      </body>
    </html>
  </ViewTransitions>
);
```

In `components/mode-toggle.tsx`, update `flip`:

```tsx
const flip = () => {
  const next: Mode = mode === "editorial" ? "ide" : "editorial";
  document.cookie = `mode=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

  const apply = () => {
    document.documentElement.setAttribute("data-mode", next);
    setMode(next);
    startTransition(() => router.refresh());
  };

  if (typeof document.startViewTransition === "function") {
    document.startViewTransition(apply);
  } else {
    apply();
  }
};
```

Also add a small CSS rule in `app/globals.css` to make the transition feel smooth:

```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 250ms;
}
```

- [ ] **Step 1: Verify**

In Chrome (or any browser with View Transitions API), click the toggle — should see a brief cross-fade instead of an instant repaint. On unsupported browsers it falls back to instant.

- [ ] **Step 2: Stage + commit message**

```sh
git add app/layout.tsx components/mode-toggle.tsx app/globals.css package.json pnpm-lock.yaml
```

```
feat(mode): View Transitions API for mode flip
```

Pause for Yasir to commit.

---

## Phase 2 — IDE chrome

Replace the placeholder `IDEShell` from Task 1.3 with the real VS Code-like chrome. The shell is composed of 5 panels — title bar, activity bar, sidebar (file tree), editor (page content), status bar — plus a collapsible terminal panel that's currently empty (Plan 04 fills it with the RAG demo).

### Task 2.1: macOS-style window title bar

**Files:**
- Create: `components/ide/title-bar.tsx`

```tsx
export function TitleBar() {
  return (
    <div className="flex h-7 select-none items-center bg-bg-ide-activity px-3 text-xs text-fg-ide-comment">
      <div className="flex gap-1.5">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
      </div>
      <div className="ml-auto mr-auto">yasirgaji.com — Visual Studio Code</div>
    </div>
  );
}
```

The three dot colors are the actual macOS Big Sur/Sonoma colors. Decorative — no click handlers; just looks like an IDE.

- [ ] **Step 1: Stage + commit message**

```sh
git add components/ide/title-bar.tsx
```

```
feat(ide): macOS window title bar component
```

Pause for Yasir to commit.

---

### Task 2.2: Activity Bar (vertical left rail)

**Files:**
- Create: `components/ide/activity-bar.tsx`

Material Icon Theme has many icons; we ship 6 hand-picked ones via Lucide (which is already installed via shadcn deps).

```tsx
import {
  FileCode,
  Search,
  GitBranch,
  Play,
  Package,
  Settings,
} from "lucide-react";

const items = [
  { icon: FileCode, label: "Explorer", active: true },
  { icon: Search, label: "Search", active: false },
  { icon: GitBranch, label: "Source Control", active: false },
  { icon: Play, label: "Run", active: false },
  { icon: Package, label: "Extensions", active: false },
];

export function ActivityBar() {
  return (
    <nav
      aria-label="Activity bar"
      className="flex w-12 shrink-0 flex-col items-center gap-1 bg-bg-ide-activity py-2"
    >
      {items.map(({ icon: Icon, label, active }) => (
        <button
          key={label}
          type="button"
          title={label}
          aria-label={label}
          className={`flex size-10 items-center justify-center rounded text-fg-ide-comment hover:text-fg-ide-default ${
            active
              ? "border-l-2 border-fg-ide-default text-fg-ide-default"
              : ""
          }`}
        >
          <Icon className="size-5" />
        </button>
      ))}
      <div className="mt-auto">
        <button
          type="button"
          title="Settings"
          aria-label="Settings"
          className="flex size-10 items-center justify-center text-fg-ide-comment hover:text-fg-ide-default"
        >
          <Settings className="size-5" />
        </button>
      </div>
    </nav>
  );
}
```

- [ ] **Stage + commit message**

```sh
git add components/ide/activity-bar.tsx
```

```
feat(ide): vertical Activity Bar with Lucide icons
```

Pause for Yasir to commit.

---

### Task 2.3: Explorer sidebar (file tree)

**Files:**
- Create: `components/ide/explorer.tsx`

The site's pages render as a folder tree:

```
yasirgaji-portfolio/
├── app/
│   ├── page.tsx      → /
│   ├── about/
│   │   └── page.tsx  → /about
│   ├── work/
│   │   ├── page.tsx  → /work
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── writing/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── contact/page.tsx
│   └── resume/page.tsx
```

Each leaf is a `<Link>` to the corresponding URL. The currently-active file (matching `usePathname`) is highlighted.

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, File, Folder } from "lucide-react";
import { useState } from "react";

type Node =
  | { type: "file"; name: string; href: string }
  | { type: "folder"; name: string; children: Node[] };

const tree: Node[] = [
  {
    type: "folder",
    name: "app",
    children: [
      { type: "file", name: "page.tsx", href: "/" },
      {
        type: "folder",
        name: "about",
        children: [{ type: "file", name: "page.tsx", href: "/about" }],
      },
      {
        type: "folder",
        name: "work",
        children: [{ type: "file", name: "page.tsx", href: "/work" }],
      },
      {
        type: "folder",
        name: "writing",
        children: [{ type: "file", name: "page.tsx", href: "/writing" }],
      },
      {
        type: "folder",
        name: "contact",
        children: [{ type: "file", name: "page.tsx", href: "/contact" }],
      },
      {
        type: "folder",
        name: "resume",
        children: [{ type: "file", name: "page.tsx", href: "/resume" }],
      },
    ],
  },
];

function FileLeaf({ node, active }: { node: Extract<Node, { type: "file" }>; active: boolean }) {
  return (
    <Link
      href={node.href}
      className={`flex items-center gap-2 py-0.5 pl-6 pr-2 text-sm hover:bg-bg-ide-activity ${
        active ? "bg-bg-ide-activity text-fg-ide-default" : "text-fg-ide-comment"
      }`}
    >
      <File className="size-4 text-fg-ide-comment" />
      <span>{node.name}</span>
    </Link>
  );
}

function FolderNode({ node, pathname }: { node: Extract<Node, { type: "folder" }>; pathname: string }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-1 py-0.5 pl-2 pr-2 text-sm text-fg-ide-comment hover:bg-bg-ide-activity"
      >
        {open ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
        <Folder className="size-4 text-fg-ide-comment" />
        <span>{node.name}</span>
      </button>
      {open && (
        <div className="ml-2">
          {node.children.map((child, i) =>
            child.type === "file" ? (
              <FileLeaf key={i} node={child} active={pathname === child.href} />
            ) : (
              <FolderNode key={i} node={child} pathname={pathname} />
            ),
          )}
        </div>
      )}
    </div>
  );
}

export function Explorer() {
  const pathname = usePathname();
  return (
    <aside
      aria-label="Explorer"
      className="hidden w-56 shrink-0 flex-col bg-bg-ide-sidebar pt-2 text-fg-ide-default lg:flex"
    >
      <div className="px-3 pb-2 text-xs uppercase tracking-wide text-fg-ide-comment">
        Explorer
      </div>
      <div className="flex-1 overflow-y-auto pb-2">
        {tree.map((node, i) =>
          node.type === "folder" ? (
            <FolderNode key={i} node={node} pathname={pathname} />
          ) : null,
        )}
      </div>
    </aside>
  );
}
```

- [ ] **Stage + commit message**

```sh
git add components/ide/explorer.tsx
```

```
feat(ide): Explorer sidebar with collapsible file tree
```

Pause for Yasir to commit.

---

### Task 2.4: Editor area (file tabs + breadcrumbs + content)

**Files:**
- Create: `components/ide/editor.tsx`

Wraps the children with file-tab + breadcrumb decoration. The tab/breadcrumb labels derive from the current route via `usePathname`.

```tsx
"use client";

import { usePathname } from "next/navigation";

function routeToTab(pathname: string): { tab: string; breadcrumb: string[] } {
  // /work/[slug] → tab "page.tsx", breadcrumb ["app", "work", "[slug]", "page.tsx"]
  const segments = pathname === "/" ? [""] : pathname.split("/").filter(Boolean);
  const breadcrumb = ["app", ...segments, "page.tsx"];
  return { tab: "page.tsx", breadcrumb };
}

export function Editor({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { tab, breadcrumb } = routeToTab(pathname);

  return (
    <section className="flex flex-1 flex-col overflow-hidden">
      <div className="flex h-9 items-center border-b border-bg-ide-activity bg-bg-ide-sidebar text-xs">
        <div className="flex h-full items-center gap-2 border-r border-bg-ide-activity bg-bg-ide-editor px-3 text-fg-ide-default">
          <span className="text-fg-ide-string">{tab}</span>
        </div>
      </div>
      <div className="border-b border-bg-ide-activity bg-bg-ide-editor px-4 py-1 text-xs text-fg-ide-comment">
        {breadcrumb.join(" / ")}
      </div>
      <div className="flex-1 overflow-y-auto bg-bg-ide-editor px-8 py-8 text-fg-ide-default">
        {children}
      </div>
    </section>
  );
}
```

- [ ] **Stage + commit message**

```sh
git add components/ide/editor.tsx
```

```
feat(ide): Editor area with file tab and breadcrumb
```

Pause for Yasir to commit.

---

### Task 2.5: Status bar (bottom)

**Files:**
- Create: `components/ide/status-bar.tsx`

```tsx
import { ModeToggle } from "@/components/mode-toggle";
import { GitBranch, Wifi } from "lucide-react";

export function StatusBar() {
  return (
    <footer className="flex h-6 items-center gap-4 bg-bg-ide-statusbar px-3 text-xs text-white">
      <span className="flex items-center gap-1">
        <GitBranch className="size-3" />
        version-2
      </span>
      <span className="flex items-center gap-1">
        <Wifi className="size-3" />
        Live
      </span>
      <span>UTF-8</span>
      <span>TSX</span>
      <span>Prettier</span>
      <div className="ml-auto">
        <ModeToggle className="h-6 px-2 text-white hover:bg-white/10" />
      </div>
    </footer>
  );
}
```

The mode toggle is mounted INSIDE the IDE status bar (so users can switch back to editorial without leaving IDE chrome). In editorial mode it's in the top nav (already added by Plan 02 T1.4) — but we'll need to add it there in Task 3.1 below.

- [ ] **Stage + commit message**

```sh
git add components/ide/status-bar.tsx
```

```
feat(ide): status bar with branch/encoding/language/mode toggle
```

Pause for Yasir to commit.

---

### Task 2.6: Terminal panel (placeholder for Plan 04 AI demo)

**Files:**
- Create: `components/ide/terminal.tsx`

For Plan 03, a static REPL-style frame with a placeholder prompt. Plan 04 will hook in the AI demo here.

```tsx
export function Terminal() {
  return (
    <div className="hidden border-t border-bg-ide-activity bg-bg-ide-editor lg:block">
      <div className="flex items-center border-b border-bg-ide-activity px-3 py-1 text-xs text-fg-ide-comment">
        <span className="text-fg-ide-default">TERMINAL</span>
      </div>
      <div className="h-32 overflow-y-auto px-3 py-2 font-mono text-xs">
        <p className="text-fg-ide-comment">
          # Ask anything about Yasir's work. AI demo lands in Plan 04.
        </p>
        <p className="mt-1">
          <span className="text-fg-ide-keyword">$</span>{" "}
          <span className="text-fg-ide-default">_</span>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Stage + commit message**

```sh
git add components/ide/terminal.tsx
```

```
feat(ide): terminal panel placeholder

Real RAG-driven chat goes here in Plan 04.
```

Pause for Yasir to commit.

---

### Task 2.7: Assemble the IDE shell

Replace the placeholder `IDEShell` in `components/ide/index.tsx` with the real composition.

**Files:**
- Modify: `components/ide/index.tsx`

```tsx
import { TitleBar } from "./title-bar";
import { ActivityBar } from "./activity-bar";
import { Explorer } from "./explorer";
import { Editor } from "./editor";
import { Terminal } from "./terminal";
import { StatusBar } from "./status-bar";

export function IDEShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-bg-ide-editor text-fg-ide-default">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <ActivityBar />
        <Explorer />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Editor>{children}</Editor>
          <Terminal />
        </div>
      </div>
      <StatusBar />
    </div>
  );
}
```

- [ ] **Step 1: Verify**

```sh
pnpm exec tsc --noEmit
pnpm lint
```

Set `mode=ide` cookie via DevTools, reload `/` — should see full VS Code chrome with the home page content rendered inside the editor area. Test:
- Click an Explorer entry — page navigates
- Click the StatusBar mode toggle (says "Editorial") — should swap back to editorial chrome
- Resize to < 1024px — should auto-snap to editorial

- [ ] **Step 2: Stage + commit message**

```sh
git add components/ide/index.tsx
```

```
feat(ide): assemble full IDE shell

TitleBar · ActivityBar · Explorer · Editor · Terminal · StatusBar.
Page content renders inside the Editor area.
```

Pause for Yasir to commit.

---

## Phase 3 — Polish + tie-up

### Task 3.1: Add `ModeToggle` to the editorial nav

The mode toggle is in the IDE status bar (Task 2.5). It also needs to be in the editorial nav so users can switch INTO IDE mode from editorial.

**Files:**
- Modify: `components/site-nav.tsx`

Add the import + place it next to the theme toggle:

```tsx
import { ModeToggle } from "./mode-toggle";
import { ThemeToggle } from "./theme-toggle";

// inside the nav's right side:
<nav className="flex items-center gap-6 text-sm">
  {links.map((l) => ( /* unchanged */ ))}
  <ModeToggle />
  <ThemeToggle />
</nav>
```

- [ ] **Stage + commit message**

```sh
git add components/site-nav.tsx
```

```
feat(nav): expose mode toggle in editorial nav
```

Pause for Yasir to commit.

---

### Task 3.2: IDE content typography

Inside the Editor area, our prose currently uses the editorial font stack because the page components apply `font-display` / `font-body` directly. Override at the IDE-mode level so all text inside `[data-mode="ide"]` uses mono.

**Files:**
- Modify: `app/globals.css`

Add to the `@layer base` block, after the existing `data-mode="ide"` rule:

```css
html[data-mode="ide"] .font-display,
html[data-mode="ide"] .font-body {
  font-family: var(--font-mono);
}
```

This is a blunt instrument that gives the IDE mode a uniformly mono feel without rewriting every component. We can refine if specific elements look bad — for v2 launch this is the right ratio of effort to payoff.

- [ ] **Stage + commit message**

```sh
git add app/globals.css
```

```
feat(ide): force mono typography inside IDE mode
```

Pause for Yasir to commit.

---

### Task 3.3: Suppress editorial nav/footer when in IDE mode

Already handled by `ModeShell` — it picks IDE chrome OR editorial chrome, not both. Just verify in dev that switching to IDE doesn't show a leftover top nav or footer.

- [ ] **Step 1: Verify only**

Set `mode=ide` cookie, reload `/`. Confirm:
- No `SiteNav` at the top
- No `SiteFooter` at the bottom
- VS Code chrome is the only chrome present

No commit needed if the verification passes (it should — this is just confirming what `ModeShell` already does).

---

## Phase 4 — Local smoke + preview deploy

### Task 4.1: Full local check

```sh
pnpm exec tsc --noEmit
pnpm lint
pnpm test
pnpm exec next build
```

All four must pass. The `next build` step is the strongest signal — it'll catch any server-only/client-only boundary violations in the new IDE components.

### Task 4.2: Manual smoke

`pnpm dev` → http://localhost:3000

- [ ] `/` renders editorial (default)
- [ ] Click "IDE" in nav — full VS Code chrome appears
- [ ] Click an Explorer entry — page changes, chrome persists
- [ ] Click "Editorial" in the status bar — back to editorial
- [ ] Resize to < 1024px — auto-snaps to editorial
- [ ] Resize back up — stays editorial (user has to opt back in)
- [ ] All editorial pages still render correctly when in editorial mode

### Task 4.3: Preview deploy

```sh
git push origin version-2
```

Vercel rebuilds. Visit the preview URL. Confirm IDE mode toggles correctly in production environment (some quirks only surface in deployed builds — particularly cookie behavior and View Transitions).

---

## Plan 03 Self-Review Checklist

- [ ] Mode cookie persists across reloads
- [ ] Toggle in editorial nav switches → IDE
- [ ] Toggle in IDE status bar switches → editorial
- [ ] Mobile (< 1024px) forces editorial
- [ ] View Transitions API gives smooth swap on supported browsers; fallback is instant
- [ ] Editorial mode looks identical to before this plan (regression check)
- [ ] IDE mode shows: title bar, activity bar, file tree, editor with tab + breadcrumb, terminal placeholder, status bar
- [ ] Clicking Explorer files navigates routes
- [ ] `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm test`, `pnpm build` all pass
- [ ] Preview deploy is green
- [ ] All commits on `version-2`

---

## What this plan does NOT do (deferred)

- Real AI demo in Terminal (Plan 04)
- Pixel-perfect Material Icon Theme — uses Lucide subset (v2.1 polish)
- Light 2026 IDE variant (v2.1 polish — spec § 6.3 explicitly defers)
- Per-route file-tree expansion (the Explorer currently shows all pages collapsed/expanded by user; could auto-expand to the current route in v2.1)
- Resizable Explorer / Terminal panels — fixed sizes for now (v2.1 polish)

---

**End of Plan 03.** Ready for Plan 04 (RAG AI demo) once Yasir confirms the preview deploy looks right.
