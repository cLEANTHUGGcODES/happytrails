import type { MetadataRoute } from "next";
import { site } from "./content";
import { absoluteUrl } from "./site-url";

// Both public MP4s first appeared in commit 76252eae53089d5688d94945c39fdf42b37c57cc
// on September 26, 2026. This is their publication in the public website repository,
// not a claimed filming date. The media preparation script strips creation tags.
// FFprobe on October 17, 2026 measured 82.570000s and 44.140998s, both 1280 × 720.
export const propertyTours = [
  {
    id: "full-tour",
    title: "Full Happy Trails property tour",
    description:
      "Explore Happy Trails Shindigs & Events in Blooming Grove, Texas, with views of the barn, grounds, grain-bin bridal suite, and bunkhouse.",
    src: "/videos/full-property-tour.mp4",
    poster: "/images/tour-poster.webp",
    durationSeconds: 82.57,
    duration: "PT1M22.57S",
    durationLabel: "1 minute 23 seconds",
    uploadDate: "2026-09-26",
    width: 1280,
    height: 720,
  },
  {
    id: "short-tour",
    title: "A short look around Happy Trails",
    description:
      "A short property tour of Happy Trails Shindigs & Events, a wedding and event venue in Blooming Grove, Texas.",
    src: "/videos/property-tour.mp4",
    poster: "/images/tour-poster.webp",
    durationSeconds: 44.140998,
    duration: "PT44.140998S",
    durationLabel: "44 seconds",
    uploadDate: "2026-09-26",
    width: 1280,
    height: 720,
  },
] as const;

export function getTourStructuredData() {
  const pageId = absoluteUrl("/tour#webpage");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": pageId,
        url: absoluteUrl("/tour"),
        name: `Property Video Tour | ${site.shortName}`,
        isPartOf: { "@id": absoluteUrl("/#website") },
        about: { "@id": absoluteUrl("/#venue") },
        mainEntity: { "@id": absoluteUrl(`/tour#${propertyTours[0].id}`) },
      },
      ...propertyTours.map((tour) => ({
        "@type": "VideoObject",
        "@id": absoluteUrl(`/tour#${tour.id}`),
        name: tour.title,
        description: tour.description,
        thumbnailUrl: absoluteUrl(tour.poster),
        contentUrl: absoluteUrl(tour.src),
        url: absoluteUrl(`/tour#${tour.id}`),
        uploadDate: tour.uploadDate,
        duration: tour.duration,
        width: tour.width,
        height: tour.height,
        isAccessibleForFree: true,
        about: { "@id": absoluteUrl("/#venue") },
        publisher: { "@id": absoluteUrl("/#venue") },
        isPartOf: { "@id": pageId },
      })),
    ],
  };
}

export function getTourSitemapVideos(): NonNullable<MetadataRoute.Sitemap[number]["videos"]> {
  // Next's sitemap serializer inserts video text verbatim, including ampersands.
  const xmlText = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return propertyTours.map((tour) => ({
    title: xmlText(tour.title),
    description: xmlText(tour.description),
    thumbnail_loc: absoluteUrl(tour.poster),
    content_loc: absoluteUrl(tour.src),
    duration: Math.round(tour.durationSeconds),
    publication_date: tour.uploadDate,
    requires_subscription: "no",
    live: "no",
  }));
}
