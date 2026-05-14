import { defineField, defineType } from "sanity";

export default defineType({
  name: "seoImage",
  title: "SEO Image",
  type: "document",
  fields: [
    defineField({
      name: "forType",
      type: "string",
      options: {
        list: [
          { title: "Case study", value: "caseStudy" },
          { title: "Article", value: "article" },
          { title: "Page", value: "page" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "forSlug", type: "string", validation: (r) => r.required() }),
    defineField({ name: "image", type: "image", validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: "forType", subtitle: "forSlug", media: "image" },
  },
});
