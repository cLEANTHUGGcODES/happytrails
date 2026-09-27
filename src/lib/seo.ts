import type { Metadata } from "next";
import { site, type MediaItem, type NewsPost } from "./content";
import { absoluteUrl } from "./site-url";

type SocialImage = Pick<MediaItem, "src" | "width" | "height" | "alt">;

export const defaultSocialImage: SocialImage = {
  src: "/images/ceremony-sunset.webp",
  width: 1448,
  height: 1086,
  alt: "An outdoor ceremony arbor and benches beneath a Texas sunset at Happy Trails",
};

type PageMetadata = {
  title: string;
  description: string;
  path: string;
  image?: SocialImage;
  type?: "website" | "article";
  publishedTime?: string;
};

/** Nested metadata is replaced by Next.js, so every page supplies a complete sharing card. */
export function createPageMetadata({
  title,
  description,
  path,
  image = defaultSocialImage,
  type = "website",
  publishedTime,
}: PageMetadata): Metadata {
  const fullTitle = `${title} | ${site.shortName}`;
  const socialImage = {
    url: absoluteUrl(image.src),
    width: image.width,
    height: image.height,
    alt: image.alt,
  };
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title: fullTitle,
      description,
      url: absoluteUrl(path),
      siteName: site.name,
      locale: "en_US",
      type,
      images: [socialImage],
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [socialImage],
    },
  };
}

export function getBusinessStructuredData() {
  return {
    "@type": ["LocalBusiness", "EventVenue"],
    "@id": absoluteUrl("/#venue"),
    name: site.name,
    alternateName: site.shortName,
    url: absoluteUrl("/"),
    description:
      "A wedding and event venue on 22 acres in Blooming Grove, Texas, with a renovated 1,800-square-foot barn and space for approximately 75 guests.",
    telephone: site.phoneHref.replace("tel:", ""),
    email: site.email,
    logo: absoluteUrl("/images/logo.png"),
    image: [
      absoluteUrl(defaultSocialImage.src),
      absoluteUrl("/images/barn-wide.webp"),
      absoluteUrl("/images/exterior-wide.webp"),
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: site.streetAddress,
      addressLocality: "Blooming Grove",
      addressRegion: "TX",
      postalCode: site.postalCode,
      addressCountry: "US",
    },
    geo: { "@type": "GeoCoordinates", ...site.coordinates },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.coordinates.latitude},${site.coordinates.longitude}`)}`,
    sameAs: Object.values(site.profiles),
    openingHoursSpecification: [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [...site.businessHours.days],
      opens: site.businessHours.opens,
      closes: site.businessHours.closes,
    }],
  };
}

export function getSiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      getBusinessStructuredData(),
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        url: absoluteUrl("/"),
        name: site.name,
        alternateName: site.shortName,
        inLanguage: "en-US",
        publisher: { "@id": absoluteUrl("/#venue") },
      },
    ],
  };
}

export function getArticleStructuredData(post: NewsPost) {
  const image = post.coverImage ?? defaultSocialImage;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": absoluteUrl(`/news/${post.slug}#article`),
    url: absoluteUrl(`/news/${post.slug}`),
    mainEntityOfPage: absoluteUrl(`/news/${post.slug}`),
    headline: post.title,
    description: post.summary,
    datePublished: post.publishedAt,
    image: absoluteUrl(image.src),
    articleBody: post.body.join("\n\n"),
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      "@id": absoluteUrl("/#venue"),
      name: site.name,
      url: absoluteUrl("/"),
      logo: { "@type": "ImageObject", url: absoluteUrl("/images/logo.png") },
    },
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
