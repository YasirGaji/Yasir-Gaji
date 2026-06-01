import { defineField, defineType } from "sanity";

export default defineType({
  name: "skill",
  title: "Skill",
  type: "document",
  fields: [
    defineField({
      name: "group",
      type: "string",
      options: {
        list: [
          { title: "Languages", value: "languages" },
          { title: "Applied AI", value: "applied-ai" },
          { title: "Backend & Cloud", value: "backend-cloud" },
          { title: "Frontend", value: "frontend" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "level",
      type: "string",
      options: {
        list: [
          { title: "Core", value: "core" },
          { title: "Strong", value: "strong" },
          { title: "Familiar", value: "familiar" },
        ],
      },
      initialValue: "strong",
    }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  preview: {
    select: { title: "name", subtitle: "group" },
  },
});
