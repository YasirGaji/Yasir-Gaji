import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

// Dynamic so the root layout's host-based chrome-removal (mode-shell.tsx)
// can read the request host. Studio is a client-side app, so the SSR cost
// is just the shell HTML.
export const dynamic = "force-dynamic";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
