import type { SchemaTypeDefinition } from "sanity";
import article from "./article";
import articleSeries from "./articleSeries";
import caseStudy from "./caseStudy";
import experience from "./experience";
import recommendation from "./recommendation";
import seoImage from "./seoImage";
import siteSettings from "./siteSettings";
import skill from "./skill";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    siteSettings,
    caseStudy,
    article,
    articleSeries,
    recommendation,
    experience,
    skill,
    seoImage,
  ],
};
