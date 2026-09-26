import type { MetadataRoute } from "next";
import { getUpdates } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://happytrailsshindigs.com";
  const pages = [
    "",
    "/venue",
    "/gallery",
    "/vendors",
    "/pricing",
    "/our-story",
    "/contact",
    "/news",
    "/privacy",
  ];
  return [
    ...pages.map((path) => ({
      url: `${base}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...(await getUpdates()).map((post) => ({
      url: `${base}/news/${post.slug}`,
      lastModified: post.publishedAt,
      priority: 0.6,
    })),
  ];
}
