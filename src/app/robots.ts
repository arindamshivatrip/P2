import type { MetadataRoute } from "next";
import { siteMeta } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  const base = siteMeta.url.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${base}/sitemap.xml`
  };
}
