"use client";

import { usePathname } from "next/navigation";

function routeToTab(pathname: string): { tab: string; breadcrumb: string[] } {
  const segments = pathname === "/" ? [] : pathname.split("/").filter(Boolean);
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
