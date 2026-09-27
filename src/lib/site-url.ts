/** The public domain, including in preview builds. Never derive canonical URLs from request hosts. */
export const SITE_URL = "https://www.happytrailsshindigs.com";

export function absoluteUrl(path = "/"): string {
  return new URL(path, `${SITE_URL}/`).href;
}
