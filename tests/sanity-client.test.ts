import { describe, expect, it } from "vitest";
import { client } from "@/sanity/lib/client";

describe("sanity client", () => {
  it("has a configured projectId", () => {
    const cfg = client.config();
    expect(cfg.projectId).toBeTruthy();
    expect(typeof cfg.projectId).toBe("string");
  });

  it("uses the production dataset", () => {
    const cfg = client.config();
    expect(cfg.dataset).toBe("production");
  });

  it("uses the published perspective", () => {
    const cfg = client.config();
    expect(cfg.perspective).toBe("published");
  });
});
