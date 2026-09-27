import type { MetadataRoute } from "next";
import { getGallery, getUpdates } from "@/lib/content";
import { absoluteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, images] = await Promise.all([getUpdates(), getGallery()]);
  const pages = [
    "",
    "/venue",
    "/gallery",
    "/vendors",
    "/pricing",
    "/our-story",
    "/contact",
    "/planning",
    "/venue-info",
    "/guest-guide",
    ...(posts.length ? ["/news"] : []),
    "/privacy",
  ];
  return [
    ...pages.map((path) => ({
      url: absoluteUrl(path || "/"),
      ...(path === "/gallery" ? { images: images.map((image) => absoluteUrl(image.src)) } : {}),
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/news/${post.slug}`),
      lastModified: post.publishedAt,
      ...(post.coverImage ? { images: [absoluteUrl(post.coverImage.src)] } : {}),
    })),
  ];
}
