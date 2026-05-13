import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  // Singleton — see sanity.config.ts for the template filter that prevents
  // multiple instances, and sanity/structure.ts for the sidebar pin.
  fields: [
    defineField({ name: "bio", title: "Bio", type: "text", rows: 4 }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({
      name: "availability",
      title: "Availability",
      type: "string",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Open to conversations", value: "open-to-conversations" },
          { title: "Not looking", value: "not-looking" },
        ],
        layout: "radio",
      },
      initialValue: "available",
    }),
    defineField({
      name: "socials",
      title: "Socials",
      type: "object",
      fields: [
        defineField({ name: "github", type: "url" }),
        defineField({ name: "linkedin", type: "url" }),
        defineField({ name: "medium", type: "url" }),
        defineField({ name: "twitter", type: "url" }),
        defineField({ name: "email", type: "email" }),
      ],
    }),
    defineField({ name: "calcomUrl", title: "Cal.com booking URL", type: "url" }),
    defineField({
      name: "cvPdfUrl",
      title: "Generated CV PDF URL",
      type: "url",
      readOnly: true,
    }),
    defineField({
      name: "resumeAsOf",
      title: "Resume as of (build date)",
      type: "date",
      readOnly: true,
    }),
  ],
});
