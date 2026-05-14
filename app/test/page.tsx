import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

export default async function TestPage() {
  const data = await client.fetch(siteSettingsQuery);
  return (
    <main style={{ padding: 24, fontFamily: "var(--font-body)", maxWidth: 720 }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Sanity smoke test</h1>
      <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 16px" }}>
        <dt>Location</dt>
        <dd data-testid="location">{data?.location ?? "no location set"}</dd>
        <dt>Bio</dt>
        <dd data-testid="bio">{data?.bio ?? "no bio set"}</dd>
        <dt>Availability</dt>
        <dd data-testid="availability">{data?.availability ?? "no availability set"}</dd>
      </dl>
    </main>
  );
}
