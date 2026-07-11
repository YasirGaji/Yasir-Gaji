import type { Metadata } from "next";
import { NextStudio, metadata as studioMetadata } from "next-sanity/studio";
import config from "../../../sanity.config";

// Dynamic so the root layout's host-based chrome-removal (mode-shell.tsx)
// can read the request host. Studio is a client-side app, so the SSR cost
// is just the shell HTML.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...studioMetadata,
  // `absolute` bypasses the root layout's title template ("%s · Yasir Gaji").
  title: { absolute: "Studio · Yasir Gaji" },
  description: "Sanity Studio — content management for yasirgaji.com",
};

export { viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
