export function IDEShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-bg-ide-editor font-mono text-fg-ide-default">
      <div className="border-b border-bg-ide-activity p-3 text-sm">
        [IDE mode — chrome WIP, Phase 2]
      </div>
      <main className="flex-1 p-6">{children}</main>
      <div className="border-t border-bg-ide-activity p-2 text-xs">[status bar WIP]</div>
    </div>
  );
}
