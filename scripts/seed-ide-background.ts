/**
 * One-time seed: upload public/bg.png to Sanity as the ideBackground
 * asset on the siteSettings singleton.
 *
 * Usage:
 *   pnpm sanity exec scripts/seed-ide-background.ts --with-user-token
 *
 * Idempotent — re-runs replace the existing asset reference.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getCliClient } from "sanity/cli";

async function main() {
  const client = getCliClient();

  const filePath = resolve(process.cwd(), "public/bg.png");
  const buffer = readFileSync(filePath);

  console.log(`Uploading ${filePath} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)...`);

  const asset = await client.assets.upload("image", buffer, {
    filename: "ide-background.png",
    contentType: "image/png",
  });

  console.log(`Uploaded asset: ${asset._id}`);

  await client
    .patch("siteSettings")
    .set({
      ideBackground: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      },
    })
    .commit();

  console.log("Patched siteSettings.ideBackground");
  console.log(`Public URL: ${asset.url}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
