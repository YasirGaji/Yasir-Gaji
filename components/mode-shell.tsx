import { headers } from "next/headers";
import Image from "next/image";
import { IDEShell } from "@/components/ide";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { getModeFromCookie } from "@/lib/mode-cookie";

export async function ModeShell({ children }: { children: React.ReactNode }) {
  const [mode, headersList] = await Promise.all([getModeFromCookie(), headers()]);

  // Studio subdomain: render bare, no portfolio chrome.
  // The proxy rewrites studio.yasirgaji.com/* to /studio/* internally,
  // but the original host header survives the rewrite.
  const host = headersList.get("host") ?? "";
  if (host.startsWith("studio.")) {
    return <>{children}</>;
  }

  if (mode === "ide") {
    return <IDEShell>{children}</IDEShell>;
  }
  return (
    <>
      <SiteNav />
      <main className="flex-1">
        {/* Decorative dotted-globe backdrop, pinned to the viewport so the
            page scrolls over it. Inverted in light mode so the light dots
            stay visible on the off-white background. */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 -z-10 select-none overflow-hidden"
        >
          <Image
            src="/Globe.png"
            alt=""
            width={1134}
            height={446}
            sizes="100vw"
            className="h-auto w-full opacity-20 invert mask-[linear-gradient(to_bottom,black_35%,transparent)] dark-editorial:opacity-15 dark-editorial:invert-0"
          />
        </div>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
