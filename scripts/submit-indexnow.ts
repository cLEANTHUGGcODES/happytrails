import { basename } from "node:path";
import { SITE_URL } from "../src/lib/site-url";

// Public ownership token, deliberately served at /<key>.txt. It grants no account access.
export const INDEXNOW_KEY = "970656216a8295b8f73c67f37c081a89";
export const INDEXNOW_KEY_URL = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

type Options = { paths: string[]; all?: boolean; submit?: boolean };
type Fetcher = typeof fetch;

function decodeEntities(value: string): string {
  const named: Record<string, string> = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">" };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (_, entity: string) => {
    if (entity.startsWith("#")) {
      return String.fromCodePoint(
        entity[1].toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : Number(entity.slice(1)),
      );
    }
    return named[entity.toLowerCase()];
  });
}

export function normalizePublicUrl(input: string): string {
  const url = new URL(input, `${SITE_URL}/`);
  if (url.origin !== SITE_URL || url.username || url.password || url.search || url.hash) {
    throw new Error(`Only canonical HTTPS www URLs without query strings or fragments are allowed: ${input}`);
  }
  if (/^\/(api|admin|preview)(\/|$)/i.test(decodeURIComponent(url.pathname))) {
    throw new Error(`Private or preview paths cannot be submitted: ${input}`);
  }
  return url.href;
}

/** Reads our Next-generated URL sitemap; image:loc entries are deliberately excluded. */
export function sitemapPageUrls(xml: string): string[] {
  const source = xml.replace(/<!--[\s\S]*?-->/g, "");
  if (!/<urlset\b/.test(source) || !/<\/urlset>\s*$/.test(source)) {
    throw new Error("The live sitemap is not a URL sitemap.");
  }
  const urls = Array.from(source.matchAll(/<url(?:\s[^>]*)?>([\s\S]*?)<\/url>/g), (entry) => {
    const locations = Array.from(entry[1].matchAll(/<loc(?:\s[^>]*)?>([\s\S]*?)<\/loc>/g));
    if (locations.length !== 1) throw new Error("Each sitemap page must have exactly one loc.");
    return normalizePublicUrl(decodeEntities(locations[0][1].trim()));
  });
  if (!urls.length) throw new Error("The live sitemap contains no page URLs.");
  return [...new Set(urls)];
}

function attributes(tag: string): Record<string, string> {
  return Object.fromEntries(
    Array.from(tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g), (match) => [
      match[1].toLowerCase(),
      decodeEntities(match[2] ?? match[3] ?? match[4]),
    ]),
  );
}

export function assertIndexablePage(url: string, html: string, headers: Headers): void {
  if (/\b(noindex|none)\b/i.test(headers.get("x-robots-tag") ?? "")) {
    throw new Error(`Page has a noindex response header: ${url}`);
  }
  // Ignore embedded scripts, styles and comments when examining actual metadata tags.
  const markup = html.replace(/<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  const tags = Array.from(markup.matchAll(/<(meta|link)\b[^>]*>/gi), (match) => ({
    tag: match[1].toLowerCase(),
    attrs: attributes(match[0]),
  }));
  for (const { tag, attrs } of tags) {
    if (tag === "meta" && /^(robots|googlebot|bingbot)$/i.test(attrs.name ?? "") && /\b(noindex|none)\b/i.test(attrs.content ?? "")) {
      throw new Error(`Page has a noindex robots meta tag: ${url}`);
    }
  }
  const canonicals = tags.filter(({ tag, attrs }) => tag === "link" && /(^|\s)canonical(\s|$)/i.test(attrs.rel ?? ""));
  if (canonicals.length !== 1 || !canonicals[0].attrs.href || normalizePublicUrl(canonicals[0].attrs.href) !== url) {
    throw new Error(`Page must declare exactly one self-referencing canonical: ${url}`);
  }
}

async function readLive(url: string, contentType: RegExp, fetcher: Fetcher) {
  const response = await fetcher(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(15_000),
    headers: { "User-Agent": "HappyTrails-IndexNow-Preflight/1.0" },
  });
  if (response.status !== 200 || response.redirected || (response.url && response.url !== url)) {
    throw new Error(`Expected HTTP 200 without redirects at ${url}; received ${response.status}.`);
  }
  if (!contentType.test(response.headers.get("content-type") ?? "")) {
    throw new Error(`Unexpected content type at ${url}.`);
  }
  return { text: await response.text(), headers: response.headers };
}

export async function submitIndexNow(options: Options, fetcher: Fetcher = fetch) {
  if (options.all ? options.paths.length > 0 : options.paths.length === 0) {
    throw new Error("Provide changed page paths or --all, but not both.");
  }
  const requested = options.paths.map(normalizePublicUrl);
  const sitemap = await readLive(`${SITE_URL}/sitemap.xml`, /^(application|text)\/xml\b/i, fetcher);
  const published = sitemapPageUrls(sitemap.text);
  const urls = options.all ? published : [...new Set(requested)];
  for (const url of urls) {
    if (!published.includes(url)) throw new Error(`Page is absent from the live sitemap: ${url}`);
  }
  if (urls.length > 10_000) throw new Error("IndexNow permits at most 10,000 URLs per request.");

  const keyFile = await readLive(INDEXNOW_KEY_URL, /^text\/plain\b/i, fetcher);
  if (keyFile.text.trim() !== INDEXNOW_KEY) throw new Error("The live IndexNow ownership key does not match.");
  await Promise.all(urls.map(async (url) => {
    const page = await readLive(url, /^text\/html\b/i, fetcher);
    assertIndexablePage(url, page.text, page.headers);
  }));

  const report = { urlList: urls, keyLocation: INDEXNOW_KEY_URL };
  if (!options.submit) return { ...report, status: "dry-run" as const, httpStatus: null };
  const response = await fetcher(INDEXNOW_ENDPOINT, {
    method: "POST",
    redirect: "manual",
    signal: AbortSignal.timeout(15_000),
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(SITE_URL).host, key: INDEXNOW_KEY, ...report }),
  });
  if (response.status === 200 || response.status === 202) {
    return {
      ...report,
      status: response.status === 200 ? "submitted" as const : "pending-key-validation" as const,
      httpStatus: response.status,
    };
  }
  const retryAfter = response.headers.get("retry-after");
  throw new Error(
    `IndexNow returned HTTP ${response.status}; no automatic retry was made.${retryAfter ? ` Retry-After: ${retryAfter}.` : ""}`,
  );
}

async function main(args: string[]) {
  if (args.includes("--help")) {
    console.log("Usage: npx tsx scripts/submit-indexnow.ts [--submit] / /venue\n       npx tsx scripts/submit-indexnow.ts [--submit] --all\nDry run is the default. Submit only newly added or meaningfully updated pages; --all is for an intentional full-site update. Acceptance does not establish crawling or indexing.");
    return;
  }
  for (const arg of args) {
    if (arg.startsWith("--") && !["--submit", "--all"].includes(arg)) throw new Error(`Unknown option: ${arg}`);
  }
  const result = await submitIndexNow({
    paths: args.filter((arg) => !arg.startsWith("--")),
    all: args.includes("--all"),
    submit: args.includes("--submit"),
  });
  console.log(JSON.stringify({ ...result, checkedAt: new Date().toISOString(), note: "Submission is a change notification, not confirmation of crawling or indexing." }, null, 2));
}

// Importing helpers in tests must never perform network requests.
if (basename(process.argv[1] ?? "") === "submit-indexnow.ts") {
  void main(process.argv.slice(2)).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
