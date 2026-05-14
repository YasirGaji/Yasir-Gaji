import { defineField, defineType } from "sanity";

export default defineType({
  name: "recommendation",
  title: "Recommendation",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "company", type: "string" }),
    defineField({ name: "date", type: "date" }),
    defineField({ name: "quote", type: "text", rows: 5, validation: (r) => r.required() }),
    defineField({ name: "linkedinUrl", type: "url" }),
    defineField({ name: "headshot", type: "image", options: { hotspot: true } }),
    defineField({
      name: "isHeroQuote",
      title: "Use as hero quote? (only one)",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "headshot" },
  },
});
