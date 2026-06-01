"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function MobileModeGuard() {
  const router = useRouter();

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const enforce = () => {
      const isMobile = mq.matches;
      const currentMode = document.documentElement.getAttribute("data-mode");
      if (isMobile && currentMode === "ide") {
        document.cookie = `mode=editorial; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
        document.documentElement.setAttribute("data-mode", "editorial");
        router.refresh();
      }
    };
    enforce();
    mq.addEventListener("change", enforce);
    return () => mq.removeEventListener("change", enforce);
  }, [router]);

  return null;
}
