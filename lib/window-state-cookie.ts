import { cookies } from "next/headers";

export const WINDOW_STATE_COOKIE = "window-state";
export type WindowState = "minimized" | "maximized";

export async function getWindowStateFromCookie(): Promise<WindowState> {
  const store = await cookies();
  const value = store.get(WINDOW_STATE_COOKIE)?.value;
  return value === "maximized" ? "maximized" : "minimized";
}
