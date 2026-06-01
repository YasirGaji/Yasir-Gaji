import { GitBranch, Wifi } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export function StatusBar() {
  return (
    <footer className="flex h-6 items-center gap-4 bg-bg-ide-statusbar px-3 text-xs text-white">
      <span className="flex items-center gap-1">
        <GitBranch className="size-3" />
        version-2
      </span>
      <span className="flex items-center gap-1">
        <Wifi className="size-3" />
        Live
      </span>
      <span>UTF-8</span>
      <span>TSX</span>
      <span>Prettier</span>
      <div className="ml-auto">
        <ModeToggle className="h-6 px-2 text-white hover:bg-white/10" />
      </div>
    </footer>
  );
}
