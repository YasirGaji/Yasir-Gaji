import { ActivityBar } from "./activity-bar";
import { Editor } from "./editor";
import { Explorer } from "./explorer";
import { StatusBar } from "./status-bar";
import { Terminal } from "./terminal";
import { TitleBar } from "./title-bar";

export function IDEShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-bg-ide-editor text-fg-ide-default">
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
