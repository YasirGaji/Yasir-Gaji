import type { SchemaTypeDefinition } from "sanity";
import experience from "./experience";
import siteSettings from "./siteSettings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteSettings, experience],
};
