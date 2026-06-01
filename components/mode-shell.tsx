import { IDEShell } from "@/components/ide";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { getModeFromCookie } from "@/lib/mode-cookie";

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
