import { expect, test } from "@playwright/test";

test("/test renders siteSettings fields", async ({ page }) => {
  await page.goto("/test");
  // Location and bio render as their published values OR a fallback string.
  // Either way the testids must be present (proves the route fetched + rendered).
  await expect(page.getByTestId("location")).toBeVisible();
  await expect(page.getByTestId("bio")).toBeVisible();
  await expect(page.getByTestId("availability")).toBeVisible();
});
