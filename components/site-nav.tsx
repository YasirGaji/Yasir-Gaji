import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "./mode-toggle";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line-editorial-light bg-bg-editorial-light/80 backdrop-blur dark-editorial:border-line-editorial-dark dark-editorial:bg-bg-editorial-dark/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-mono text-base font-medium tracking-tight">
          [yg]
        </Link>

        {/* Desktop nav + toggles */}
        <div className="hidden items-center gap-8 text-sm md:flex">
          <nav className="flex items-center gap-6">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:underline underline-offset-4">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="h-5 w-px bg-line-editorial-light dark-editorial:bg-line-editorial-dark" />
          <div className="flex items-center gap-1">
            <ModeToggle />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger
              render={
                <Button type="button" variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-mono text-base">[yg]</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1 px-4 text-base">
                {links.map((l) => (
                  <SheetClose
                    key={l.href}
                    render={
                      <Link
                        href={l.href}
                        className="rounded-md px-3 py-2 hover:bg-line-editorial-light dark-editorial:hover:bg-line-editorial-dark"
                      >
                        {l.label}
                      </Link>
                    }
                  />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
