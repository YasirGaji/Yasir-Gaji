import { getWindowStateFromCookie } from "@/lib/window-state-cookie";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { ideBackgroundQuery } from "@/sanity/lib/queries";
import { ActivityBar } from "./activity-bar";
import { Editor } from "./editor";
import { Explorer } from "./explorer";
import { StatusBar } from "./status-bar";
import { Terminal } from "./terminal";
import { TitleBar } from "./title-bar";

export async function IDEShell({ children }: { children: React.ReactNode }) {
  const [windowState, bg] = await Promise.all([
    getWindowStateFromCookie(),
    client.fetch(ideBackgroundQuery),
  ]);
  const isMax = windowState === "maximized";

  const bgUrl = bg?.asset ? urlForImage(bg).width(2560).auto("format").url() : null;

  const outerClasses = [
    "flex h-dvh w-full items-stretch justify-center overflow-hidden bg-cover bg-center",
    isMax ? "p-0" : "p-3 sm:p-6 md:p-10",
  ].join(" ");

  const innerClasses = [
    "flex h-full w-full flex-col overflow-hidden bg-bg-ide-editor text-fg-ide-default",
    isMax ? "max-w-none border-0" : "max-w-350 rounded-xl border border-bg-ide-activity shadow-2xl",
  ].join(" ");

  const outerStyle = isMax
    ? undefined
    : {
        backgroundColor: "var(--color-bg-ide-activity)",
        ...(bgUrl ? { backgroundImage: `url(${bgUrl})` } : {}),
      };

  return (
    <div className={outerClasses} style={outerStyle}>
      <div className={innerClasses}>
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
    </div>
  );
}
