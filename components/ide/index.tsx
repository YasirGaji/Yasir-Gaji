import { ActivityBar } from "./activity-bar";
import { Editor } from "./editor";
import { Explorer } from "./explorer";
import { StatusBar } from "./status-bar";
import { Terminal } from "./terminal";
import { TitleBar } from "./title-bar";

export function IDEShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex h-dvh w-full items-stretch justify-center overflow-hidden bg-[url('/bg.png')] bg-cover bg-center p-3 sm:p-6 md:p-10"
      style={{ backgroundColor: "var(--color-bg-ide-activity)" }}
    >
      <div className="flex h-full w-full max-w-350 flex-col overflow-hidden rounded-xl border border-bg-ide-activity bg-bg-ide-editor text-fg-ide-default shadow-2xl">
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
