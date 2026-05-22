export function TitleBar() {
  return (
    <div className="flex h-7 select-none items-center bg-bg-ide-activity px-3 text-xs text-fg-ide-comment">
      <div className="flex gap-1.5">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
      </div>
      <div className="ml-auto mr-auto">yasirgaji.com — Visual Studio Code</div>
    </div>
  );
}
