import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { ViewTransitions } from "next-view-transitions";
import { MobileModeGuard } from "@/components/mobile-mode-guard";
import { ModeShell } from "@/components/mode-shell";
import { getModeFromCookie } from "@/lib/mode-cookie";
import { getThemeFromCookie } from "@/lib/theme-cookie";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Yasir Gaji — Senior Software Engineer",
    template: "%s · Yasir Gaji",
  },
  description:
    "Senior Software Engineer architecting agentic LLM workflows and event-driven systems.",
  metadataBase: new URL("https://yasirgaji.com"),
};

// Pre-paint theme init: when no cookie is set, decide theme from the OS.
// Default is dark; only OS-light explicitly opts the user into light.
// Runs synchronously before paint so the data-theme attribute is always
// present by the time CSS variants evaluate.
const themeInitScript = `(function(){var t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.setAttribute('data-theme',t);if(t==='dark')document.documentElement.classList.add('dark');})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [theme, mode] = await Promise.all([getThemeFromCookie(), getModeFromCookie()]);
  const fontVars = `${GeistSans.variable} ${GeistMono.variable}`;
  const className = `${fontVars} h-full antialiased${theme === "dark" ? " dark" : ""}`;

  return (
    <ViewTransitions>
      <html
        lang="en"
        data-mode={mode}
        {...(theme ? { "data-theme": theme } : {})}
        className={className}
      >
        <head>
          {theme ? null : (
            // biome-ignore lint/security/noDangerouslySetInnerHtml: pre-paint theme init
            <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
          )}
        </head>
        <body className="min-h-full flex flex-col">
          <MobileModeGuard />
          <ModeShell>{children}</ModeShell>
        </body>
      </html>
    </ViewTransitions>
  );
}
