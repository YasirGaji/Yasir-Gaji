export function Terminal() {
  return (
    <div className="hidden border-t border-bg-ide-activity bg-bg-ide-editor lg:block">
      <div className="flex items-center border-b border-bg-ide-activity px-3 py-1 text-xs text-fg-ide-comment">
        <span className="text-fg-ide-default">TERMINAL</span>
      </div>
      <div className="h-32 overflow-y-auto px-3 py-2 font-mono text-xs">
        <p className="text-fg-ide-comment">
          # Ask anything about Yasir's work. AI demo lands in Plan 04.
        </p>
        <p className="mt-1">
          <span className="text-fg-ide-keyword">$</span>{" "}
          <span className="text-fg-ide-default">_</span>
        </p>
      </div>
    </div>
  );
}
