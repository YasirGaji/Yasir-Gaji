import { cookies } from "next/headers";

export const MODE_COOKIE = "mode";
export type Mode = "editorial" | "ide";

export async function getModeFromCookie(): Promise<Mode> {
  const store = await cookies();
  const value = store.get(MODE_COOKIE)?.value;
  return value === "ide" ? "ide" : "editorial";
}
