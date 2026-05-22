import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import { MobileModeGuard } from "@/components/mobile-mode-guard";
import { ModeShell } from "@/components/mode-shell";
import { getModeFromCookie } from "@/lib/mode-cookie";
import { getThemeFromCookie } from "@/lib/theme-cookie";
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [theme, mode] = await Promise.all([getThemeFromCookie(), getModeFromCookie()]);
  const fontVars = `${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`;
  const className = `${fontVars} h-full antialiased${theme === "dark" ? " dark" : ""}`;

  return (
    <ViewTransitions>
      <html
        lang="en"
        data-mode={mode}
        {...(theme ? { "data-theme": theme } : {})}
        className={className}
      >
        <body className="min-h-full flex flex-col">
          <MobileModeGuard />
          <ModeShell>{children}</ModeShell>
        </body>
      </html>
    </ViewTransitions>
  );
}
