"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema as schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

// Prod (studio.yasirgaji.com): basePath "/" so URLs read studio.yasirgaji.com/desk
// instead of /studio/desk. proxy.ts rewrites the bare path to /studio/* internally.
// Dev (localhost): basePath "/studio" so localhost:3000/studio works without
// /etc/hosts edits.
const basePath = process.env.NODE_ENV === "production" ? "/" : "/studio";

export default defineConfig({
  basePath,
  projectId,
  dataset,
  schema: {
    types: schemaTypes.types,
    // Prevent users from creating multiple siteSettings docs.
    templates: (templates) => templates.filter(({ schemaType }) => schemaType !== "siteSettings"),
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
