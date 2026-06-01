import { headers } from "next/headers";
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
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
