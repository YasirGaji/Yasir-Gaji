import { FileCode, GitBranch, Package, Play, Search, Settings } from "lucide-react";

const items = [
  { icon: FileCode, label: "Explorer", active: true },
  { icon: Search, label: "Search", active: false },
  { icon: GitBranch, label: "Source Control", active: false },
  { icon: Play, label: "Run", active: false },
  { icon: Package, label: "Extensions", active: false },
];

export function ActivityBar() {
  return (
    <nav
      aria-label="Activity bar"
      className="flex w-12 shrink-0 flex-col items-center gap-1 bg-bg-ide-activity py-2"
    >
      {items.map(({ icon: Icon, label, active }) => (
        <button
          key={label}
          type="button"
          title={label}
          aria-label={label}
          className={`flex size-10 items-center justify-center rounded text-fg-ide-comment hover:text-fg-ide-default ${
            active ? "border-l-2 border-fg-ide-default text-fg-ide-default" : ""
          }`}
        >
          <Icon className="size-5" />
        </button>
      ))}
      <div className="mt-auto">
        <button
          type="button"
          title="Settings"
          aria-label="Settings"
          className="flex size-10 items-center justify-center text-fg-ide-comment hover:text-fg-ide-default"
        >
          <Settings className="size-5" />
        </button>
      </div>
    </nav>
  );
}
