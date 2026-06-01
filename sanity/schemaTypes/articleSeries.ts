import { defineField, defineType } from "sanity";

export default defineType({
  name: "articleSeries",
  title: "Article Series",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 80 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({ name: "coverImage", type: "image", options: { hotspot: true } }),
  ],
  preview: {
    select: { title: "title", subtitle: "description", media: "coverImage" },
  },
});
