import type { MetadataRoute } from "next";
import { source } from "@/lib/source";

const SITE_URL = "https://docs.browsergateway.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  const docsEntries: MetadataRoute.Sitemap = source.getPages().map((page) => ({
    url: `${SITE_URL}${page.url}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: page.slugs.length === 0 ? 0.9 : 0.7,
  }));

  return [...staticEntries, ...docsEntries];
}
