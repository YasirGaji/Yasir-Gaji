import { defineArrayMember, defineField, defineType } from "sanity";

const portableTextBody = [
  defineArrayMember({ type: "block" }),
  defineArrayMember({ type: "image", options: { hotspot: true } }),
  defineArrayMember({
    type: "object",
    name: "codeBlock",
    title: "Code block",
    fields: [
      { name: "language", type: "string" },
      { name: "code", type: "text", rows: 10 },
    ],
  }),
];

export default defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "role", type: "string" }),
    defineField({
      name: "sector",
      type: "string",
      options: {
        list: [
          { title: "Applied AI", value: "applied-ai" },
          { title: "Backend", value: "backend" },
          { title: "Full-stack", value: "fullstack" },
          { title: "Founder", value: "founder" },
          { title: "Mobile", value: "mobile" },
          { title: "Frontend", value: "frontend" },
        ],
      },
    }),
    defineField({ name: "company", type: "string" }),
    defineField({ name: "startDate", type: "date" }),
    defineField({ name: "endDate", type: "date" }),
    defineField({ name: "heroImage", type: "image", options: { hotspot: true } }),
    defineField({
      name: "gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "stack",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({ name: "problem", type: "array", of: portableTextBody }),
    defineField({ name: "architecture", type: "array", of: portableTextBody }),
    defineField({ name: "myRole", type: "array", of: portableTextBody }),
    defineField({ name: "outcome", type: "array", of: portableTextBody }),
    defineField({ name: "liveUrl", type: "url" }),
    defineField({
      name: "relatedArticles",
      type: "array",
      of: [{ type: "reference", to: [{ type: "article" }] }],
    }),
    defineField({ name: "isFeatured", type: "boolean", initialValue: false }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title", subtitle: "role", media: "heroImage" },
  },
});
