import { defineQuery } from "next-sanity";

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    bio,
    location,
    availability,
    socials,
    calcomUrl
  }
`);
