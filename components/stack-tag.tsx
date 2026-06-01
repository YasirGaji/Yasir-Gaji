export function StackTag({ children }: { children: React.ReactNode }) {
  return (
    <li className="rounded-full border border-line-editorial-light px-3 py-1 font-mono text-xs dark-editorial:border-line-editorial-dark">
      {children}
    </li>
  );
}
