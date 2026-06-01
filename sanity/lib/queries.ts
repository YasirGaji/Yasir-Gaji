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

export const heroQuoteQuery = defineQuery(`
  *[_type == "recommendation" && isHeroQuote == true][0] {
    _id,
    name,
    role,
    company,
    quote,
    linkedinUrl,
    headshot { asset->{_id, url} }
  }
`);

export const homeFeaturedQuery = defineQuery(`
  *[_type == "caseStudy" && isFeatured == true] | order(order asc)[0...3] {
    _id,
    title,
    slug,
    role,
    sector,
    company,
    heroImage { asset->{_id, url} },
    stack
  }
`);

export const homeLatestArticlesQuery = defineQuery(`
  *[_type == "article"] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    coverImage { asset->{_id, url} },
    series->{title, slug}
  }
`);

export const allCaseStudiesQuery = defineQuery(`
  *[_type == "caseStudy"] | order(order asc, startDate desc) {
    _id,
    title,
    slug,
    role,
    sector,
    company,
    heroImage { asset->{_id, url} },
    stack,
    startDate,
    endDate
  }
`);

export const caseStudyBySlugQuery = defineQuery(`
  *[_type == "caseStudy" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    role,
    sector,
    company,
    startDate,
    endDate,
    heroImage { asset->{_id, url} },
    gallery[] { asset->{_id, url} },
    stack,
    problem,
    architecture,
    myRole,
    outcome,
    liveUrl,
    "relatedArticles": relatedArticles[]->{
      _id, title, slug, excerpt, publishedAt
    }
  }
`);

export const allCaseStudySlugsQuery = defineQuery(`
  *[_type == "caseStudy" && defined(slug.current)][].slug.current
`);

export const allArticlesQuery = defineQuery(`
  *[_type == "article"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    coverImage { asset->{_id, url} },
    series->{title, slug},
    seriesOrder,
    tags
  }
`);

export const articleSeriesAllQuery = defineQuery(`
  *[_type == "articleSeries"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    coverImage { asset->{_id, url} },
    "articles": *[_type == "article" && references(^._id)] | order(seriesOrder asc, publishedAt asc) {
      _id, title, slug, excerpt, publishedAt
    }
  }
`);

export const articleBySlugQuery = defineQuery(`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    body,
    publishedAt,
    mediumUrl,
    canonicalUrl,
    coverImage { asset->{_id, url} },
    series->{title, slug},
    seriesOrder,
    tags,
    readingTime
  }
`);

export const allArticleSlugsQuery = defineQuery(`
  *[_type == "article" && defined(slug.current)][].slug.current
`);

export const aboutQuery = defineQuery(`
  {
    "settings": *[_type == "siteSettings" && _id == "siteSettings"][0]{
      bio, location, availability, socials, calcomUrl
    },
    "recommendations": *[_type == "recommendation"] | order(order asc, date desc) {
      _id, name, role, company, date, quote, linkedinUrl,
      headshot { asset->{_id, url} }
    }
  }
`);

export const resumeQuery = defineQuery(`
  {
    "settings": *[_type == "siteSettings" && _id == "siteSettings"][0]{
      bio, location, availability, socials, calcomUrl
    },
    "experience": *[_type == "experience"] | order(order asc, startDate desc) {
      _id, company, location, title, startDate, endDate, bullets, stack
    },
    "skills": *[_type == "skill"] | order(group asc, order asc) {
      _id, group, name, level
    }
  }
`);
