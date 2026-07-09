import type { Metadata } from "next";
import { siteMeta } from "@/data/site";

type PageMetadataInput = {
  /** Segment for the <title> template (e.g. "Work"), or a full title when `absolute` is set. */
  title: string;
  description: string;
  /** Canonical path, e.g. "/work". Resolved against metadataBase for absolute URLs. */
  path: string;
  /** OG/Twitter image path. Falls back to the sitewide default. */
  image?: string;
  imageAlt?: string;
  /** Use `title` verbatim (no "%s — Arindam Tripathi" template). For the homepage. */
  absolute?: boolean;
};

/**
 * Builds a complete, consistent Metadata object (title, description, canonical,
 * OpenGraph, Twitter) for a page. Relative `path`/`image` values are resolved
 * against `metadataBase` (set in the root layout) into absolute URLs.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  absolute = false
}: PageMetadataInput): Metadata {
  const ogImage = image ?? siteMeta.ogImage;
  const fullTitle = absolute ? title : `${title} — ${siteMeta.name}`;

  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: siteMeta.name,
      url: path,
      title: fullTitle,
      description,
      images: [{ url: ogImage, alt: imageAlt ?? siteMeta.ogImageAlt }]
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage]
    }
  };
}

const absoluteUrl = (path: string): string =>
  path.startsWith("http") ? path : `${siteMeta.url.replace(/\/$/, "")}${path}`;

/**
 * Picks a project's OG image, but only when a real (non-placeholder) asset
 * exists on disk. Returns undefined so callers fall back to the sitewide
 * default rather than sharing a generic placeholder card.
 */
export function projectOgImage(
  availability: { coverImage: boolean; thumbnail: boolean },
  project: { coverImage?: string; thumbnail?: string }
): string | undefined {
  const isReal = (path?: string): path is string =>
    typeof path === "string" && !path.includes("placeholder");

  if (availability.coverImage && isReal(project.coverImage)) {
    return project.coverImage;
  }
  if (availability.thumbnail && isReal(project.thumbnail)) {
    return project.thumbnail;
  }
  return undefined;
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteMeta.formalName,
    url: siteMeta.url,
    jobTitle: "HCI graduate student and product systems builder",
    description: siteMeta.description,
    image: absoluteUrl(siteMeta.ogImage),
    sameAs: siteMeta.sameAs,
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "University of Maryland"
    }
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteMeta.name,
    url: siteMeta.url,
    description: siteMeta.description
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}
