"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

const ONE_YEAR = 60 * 60 * 24 * 365;

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
}

function withViewTransition(fn: () => void) {
  if (typeof document.startViewTransition === "function") {
    document.startViewTransition(fn);
  } else {
    fn();
  }
}

export function TitleBar() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const close = () => {
    setCookie("mode", "editorial");
    withViewTransition(() => {
      document.documentElement.setAttribute("data-mode", "editorial");
      startTransition(() => router.refresh());
    });
  };

  const minimize = () => {
    setCookie("window-state", "minimized");
    withViewTransition(() => {
      startTransition(() => router.refresh());
    });
  };

  const maximize = () => {
    setCookie("window-state", "maximized");
    withViewTransition(() => {
      startTransition(() => router.refresh());
    });
  };

  return (
    <div className="flex h-7 select-none items-center bg-bg-ide-activity px-3 text-xs text-fg-ide-comment">
      <div className="flex gap-1.5">
        <button
          type="button"
          aria-label="Close — back to editorial"
          title="Close"
          onClick={close}
          className="size-3 rounded-full bg-[#ff5f57] transition hover:opacity-80"
        />
        <button
          type="button"
          aria-label="Minimize window"
          title="Minimize"
          onClick={minimize}
          className="size-3 rounded-full bg-[#febc2e] transition hover:opacity-80"
        />
        <button
          type="button"
          aria-label="Maximize window"
          title="Maximize"
          onClick={maximize}
          className="size-3 rounded-full bg-[#28c840] transition hover:opacity-80"
        />
      </div>
      <div className="ml-auto mr-auto">yasirgaji.com</div>
    </div>
  );
}
