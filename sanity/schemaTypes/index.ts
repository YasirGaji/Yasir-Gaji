import type { SchemaTypeDefinition } from "sanity";
import siteSettings from "./siteSettings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteSettings],
};
