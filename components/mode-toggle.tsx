"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

type Mode = "editorial" | "ide";

function readInitialMode(): Mode {
  if (typeof document === "undefined") return "editorial";
  const attr = document.documentElement.getAttribute("data-mode") as Mode | null;
  return attr === "ide" ? "ide" : "editorial";
}

export function ModeToggle({ className }: { className?: string }) {
  const [mode, setMode] = useState<Mode>("editorial");
  const [, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    setMode(readInitialMode());
  }, []);

  const flip = () => {
    const next: Mode = mode === "editorial" ? "ide" : "editorial";
    document.cookie = `mode=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

    const apply = () => {
      document.documentElement.setAttribute("data-mode", next);
      setMode(next);
      startTransition(() => {
        router.refresh();
      });
    };

    if (typeof document.startViewTransition === "function") {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={flip}
      aria-label={`Switch to ${mode === "editorial" ? "IDE" : "editorial"} mode`}
      className={className}
    >
      {mode === "editorial" ? "IDE" : "Editorial"}
    </Button>
  );
}
