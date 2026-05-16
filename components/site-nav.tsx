import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-line-editorial-light)] bg-[var(--color-bg-editorial-light)]/80 backdrop-blur dark-editorial:border-[var(--color-line-editorial-dark)] dark-editorial:bg-[var(--color-bg-editorial-dark)]/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-medium">
          Yasir Gaji
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:underline underline-offset-4">
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
