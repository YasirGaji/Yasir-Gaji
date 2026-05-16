import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
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
  const theme = await getThemeFromCookie();
  const fontVars = `${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`;
  const className = `${fontVars} h-full antialiased${theme === "dark" ? " dark" : ""}`;

  return (
    <html
      lang="en"
      data-mode="editorial"
      {...(theme ? { "data-theme": theme } : {})}
      className={className}
    >
      <body className="min-h-full flex flex-col">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
