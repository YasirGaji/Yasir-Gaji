import type { StructureBuilder } from "sanity/structure";

// Custom Studio sidebar: singleton-style Site Settings pinned at top,
// then grouped document types.
// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.documentTypeListItem("caseStudy").title("Case Studies"),
      S.documentTypeListItem("article").title("Articles"),
      S.documentTypeListItem("articleSeries").title("Article Series"),
      S.documentTypeListItem("recommendation").title("Recommendations"),
      S.documentTypeListItem("experience").title("Experience"),
      S.documentTypeListItem("skill").title("Skills"),
      S.divider(),
      S.documentTypeListItem("seoImage").title("SEO Images"),
    ]);
