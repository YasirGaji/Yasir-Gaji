import { defineLive } from "next-sanity/live";
import { client } from "./client";

// Use `<SanityLive />` in app/layout.tsx and call `sanityFetch` in server
// components to opt into auto-updating content.
// https://github.com/sanity-io/next-sanity#live-content-api
export const { sanityFetch, SanityLive } = defineLive({ client });
