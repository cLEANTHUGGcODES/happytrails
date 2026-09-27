import { appendFile, mkdir, writeFile } from "node:fs/promises";
import { basename, dirname } from "node:path";
import { SITE_URL } from "../src/lib/site-url";
import { assertIndexablePage, sitemapPageUrls } from "./submit-indexnow";

type Fetcher = typeof fetch;
type Finding = { url: string; message: string; source?: string };
type Resource = { url: string; kind: "page" | "asset"; status: number | null; redirectedTo?: string };
type Page = Resource & { title: string; description: string; h1: string };
type Link = { source: string; url: string; fragment: string };
export type AuditReport = {
  checkedAt: string;
  site: string;
  fetchedFrom: string;
  sitemapPages: number;
  pages: Page[];
  resources: Resource[];
  internalLinks: number;
  fragmentsChecked: number;
  skippedExternal: number;
  errors: Finding[];
  warnings: Finding[];
  passed: boolean;
};

function decode(value: string): string {
  const named: Record<string, string> = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (_, entity: string) => {
    if (!entity.startsWith("#")) return named[entity.toLowerCase()];
    const point = entity[1].toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
    return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : "\ufffd";
  });
}

/** Inspect server HTML, excluding raw script/style text and comments, without a browser install. */
function inspectHtml(html: string) {
  const markup = html.replace(/<!--[\s\S]*?-->|<(script|style)\b((?:"[^"]*"|'[^']*'|[^'">])*)>[\s\S]*?<\/\1\s*>/gi,
    (tag, name: string, attrs: string) => name ? `<${name}${attrs}></${name}>` : "");
  const tags = Array.from(markup.matchAll(/<([a-z][\w:-]*)\b((?:"[^"]*"|'[^']*'|[^'">])*)>/gi), (match) => ({
    name: match[1].toLowerCase(),
    attrs: Object.fromEntries(Array.from(match[2].matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g), (attr) => [
      attr[1].toLowerCase(), decode(attr[2] ?? attr[3] ?? attr[4]),
    ])),
  }));
  const textOf = (tag: string) => Array.from(markup.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}\\s*>`, "gi")),
    (match) => decode(match[1].replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim());
  const ids = new Set(tags.flatMap(({ name, attrs }) => [attrs.id, name === "a" ? attrs.name : undefined].filter(Boolean)));
  const links = tags.filter(({ name, attrs }) => name === "a" && attrs.href).map(({ attrs }) => attrs.href);
  const assets: string[] = [];
  for (const { name, attrs } of tags) {
    if (["img", "source", "video", "audio", "script"].includes(name) && attrs.src) assets.push(attrs.src);
    if (name === "video" && attrs.poster) assets.push(attrs.poster);
    if (["img", "source"].includes(name) && attrs.srcset && !attrs.srcset.startsWith("data:")) {
      assets.push(...attrs.srcset.split(",").map((candidate) => candidate.trim().split(/\s+/)[0]));
    }
    if (name === "link" && /(^|\s)(stylesheet|icon|preload|modulepreload)(\s|$)/i.test(attrs.rel ?? "") && attrs.href) assets.push(attrs.href);
  }
  return {
    ids, links, assets,
    titles: textOf("title"), headings: textOf("h1"),
    descriptions: tags.filter(({ name, attrs }) => name === "meta" && attrs.name?.toLowerCase() === "description").map(({ attrs }) => attrs.content?.trim() ?? ""),
  };
}

function localOrigin(input = SITE_URL): string {
  const url = new URL(input);
  if (url.username || url.password || url.search || url.hash || url.pathname !== "/" ||
    (url.origin !== SITE_URL && !(url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)))) {
    throw new Error("The fetch origin must be the canonical site or an HTTP loopback server, without a path.");
  }
  return url.origin;
}

async function limitedMap<T>(items: T[], task: (item: T) => Promise<void>) {
  let index = 0;
  await Promise.all(Array.from({ length: Math.min(4, items.length) }, async () => {
    while (index < items.length) await task(items[index++]);
  }));
}

export async function auditSite(options: { baseUrl?: string } = {}, fetcher: Fetcher = fetch): Promise<AuditReport> {
  const origin = localOrigin(options.baseUrl);
  const report: AuditReport = {
    checkedAt: new Date().toISOString(), site: SITE_URL, fetchedFrom: origin,
    sitemapPages: 0, pages: [], resources: [], internalLinks: 0, fragmentsChecked: 0,
    skippedExternal: 0, errors: [], warnings: [], passed: false,
  };
  const fail = (url: string, message: string, source?: string) => report.errors.push({ url, message, ...(source ? { source } : {}) });
  const ownUrl = (input: string, source: string): URL | undefined => {
    let url: URL;
    try { url = new URL(input, source); } catch { fail(source, `Invalid URL: ${input}`); return; }
    if (!["http:", "https:"].includes(url.protocol)) return;
    if (url.origin !== SITE_URL || url.username || url.password) { report.skippedExternal++; return; }
    return url;
  };
  const request = async (url: string, method: "GET" | "HEAD" = "GET", range = false) => {
    const target = new URL(url);
    // All redirect targets pass the same origin check before reaching this function.
    if (target.origin !== SITE_URL) throw new Error("Refusing to request a different origin.");
    return fetcher(`${origin}${target.pathname}${target.search}`, {
      method, redirect: "manual", signal: AbortSignal.timeout(15_000),
      headers: { "User-Agent": "HappyTrails-SiteHealth/1.0", ...(range ? { Range: "bytes=0-1023" } : {}) },
    });
  };
  const readText = async (response: Response) => {
    const reader = response.body?.getReader();
    if (!reader) return "";
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > 2_000_000) throw new Error("HTML/XML exceeds the 2 MB audit limit.");
        chunks.push(value);
      }
    } finally { await reader.cancel(); }
    return Buffer.concat(chunks).toString("utf8");
  };
  const htmlByUrl = new Map<string, ReturnType<typeof inspectHtml>>();
  const pageUrls = new Set<string>();
  const assetUrls = new Set<string>();
  const links: Link[] = [];
  let sitemap: string;
  try {
    const response = await request(`${SITE_URL}/sitemap.xml`);
    if (response.status !== 200 || !/^(application|text)\/xml\b/i.test(response.headers.get("content-type") ?? "")) {
      await response.body?.cancel();
      throw new Error(`Sitemap must return HTTP 200 XML; received ${response.status}.`);
    }
    sitemap = await readText(response);
    for (const url of sitemapPageUrls(sitemap)) pageUrls.add(url);
    report.sitemapPages = pageUrls.size;
    for (const match of sitemap.matchAll(/<image:loc>([\s\S]*?)<\/image:loc>/g)) {
      const url = ownUrl(decode(match[1].trim()), `${SITE_URL}/`);
      if (url) { url.hash = ""; assetUrls.add(url.href); }
    }
  } catch (error) {
    fail(`${SITE_URL}/sitemap.xml`, error instanceof Error ? error.message : String(error));
    return report;
  }

  await limitedMap([...pageUrls], async (url) => {
    const page: Page = { url, kind: "page", status: null, title: "", description: "", h1: "" };
    report.pages.push(page);
    try {
      const response = await request(url);
      page.status = response.status;
      if (response.status !== 200 || !/^text\/html\b/i.test(response.headers.get("content-type") ?? "")) {
        await response.body?.cancel();
        throw new Error(`Sitemap page must return HTTP 200 HTML without redirects; received ${response.status}.`);
      }
      const html = await readText(response);
      try { assertIndexablePage(url, html, response.headers); }
      catch (error) { fail(url, error instanceof Error ? error.message : String(error)); }
      const parsed = inspectHtml(html);
      htmlByUrl.set(url, parsed);
      page.title = parsed.titles[0] ?? "";
      page.description = parsed.descriptions[0] ?? "";
      page.h1 = parsed.headings[0] ?? "";
      for (const [label, values] of [["title", parsed.titles], ["description", parsed.descriptions], ["H1", parsed.headings]] as const) {
        if (values.length !== 1 || !values[0]) fail(url, `Expected one nonempty ${label}; found ${values.length}.`);
      }
      for (const href of parsed.links) {
        if (!href.trim() || href === "#") continue;
        const target = ownUrl(href, url);
        if (!target) continue;
        const fragment = target.hash.slice(1);
        target.hash = "";
        links.push({ source: url, url: target.href, fragment });
      }
      for (const href of parsed.assets) {
        const target = ownUrl(href, url);
        if (target) { target.hash = ""; assetUrls.add(target.href); }
      }
    } catch (error) { fail(url, error instanceof Error ? error.message : String(error)); }
  });

  for (const property of ["title", "description", "h1"] as const) {
    const used = new Map<string, string>();
    for (const page of report.pages) {
      const value = page[property].toLowerCase();
      if (!value) continue;
      const previous = used.get(value);
      if (previous) fail(page.url, `Duplicate ${property} also used at ${previous}.`);
      else used.set(value, page.url);
    }
  }
  report.internalLinks = links.length;
  const destinations = new Map<string, "page" | "asset">();
  for (const url of assetUrls) if (!pageUrls.has(url)) destinations.set(url, "asset");
  for (const { url } of links) if (!pageUrls.has(url) && !destinations.has(url)) {
    destinations.set(url, /\.[a-z\d]{1,8}$/i.test(new URL(url).pathname) && !/\.html?$/i.test(new URL(url).pathname) ? "asset" : "page");
  }
  if (destinations.size > 500) {
    fail(SITE_URL, "More than 500 linked destinations; inspect the change before increasing the audit limit.");
  } else await limitedMap([...destinations], async ([url, kind]) => {
    const resource: Resource = { url, kind, status: null };
    report.resources.push(resource);
    try {
      let target = url;
      for (let hop = 0; hop < 5; hop++) {
        let response = await request(target, kind === "asset" ? "HEAD" : "GET");
        if (kind === "asset" && [405, 501].includes(response.status)) {
          await response.body?.cancel();
          response = await request(target, "GET", true);
        }
        resource.status = response.status;
        if ([301, 302, 303, 307, 308].includes(response.status)) {
          const location = response.headers.get("location");
          await response.body?.cancel();
          const next = location ? new URL(location, target) : undefined;
          if (!next || next.origin !== SITE_URL || next.username || next.password) throw new Error("Redirect leaves the canonical site or lacks a valid location; it was not followed.");
          next.hash = "";
          target = next.href;
          resource.redirectedTo = target;
          continue;
        }
        if (response.status !== 200 && !(kind === "asset" && response.status === 206)) {
          await response.body?.cancel();
          throw new Error(`Linked ${kind} returned HTTP ${response.status}.`);
        }
        if (kind === "page") {
          if (!/^text\/html\b/i.test(response.headers.get("content-type") ?? "")) {
            await response.body?.cancel();
            throw new Error("Linked page did not return HTML.");
          }
          htmlByUrl.set(url, inspectHtml(await readText(response)));
        } else await response.body?.cancel(); // Never read video, image, or download bodies.
        if (resource.redirectedTo) report.warnings.push({ url, message: `Redirects to ${resource.redirectedTo}.` });
        return;
      }
      throw new Error("Too many internal redirects.");
    } catch (error) { fail(url, error instanceof Error ? error.message : String(error), links.find((link) => link.url === url)?.source); }
  });

  const checkedFragments = new Set<string>();
  for (const link of links) {
    if (!link.fragment || checkedFragments.has(`${link.url}#${link.fragment}`)) continue;
    checkedFragments.add(`${link.url}#${link.fragment}`);
    const target = htmlByUrl.get(link.url);
    if (!target) continue; // File fragments and failed page fetches have no HTML IDs to inspect.
    const anchor = link.fragment.split(":~:text=")[0];
    if (!anchor) continue; // Browser text fragments need rendered text, not an element ID.
    report.fragmentsChecked++;
    let id: string;
    try { id = decodeURIComponent(anchor); } catch { id = anchor; }
    // #top is the HTML-defined document-top fragment when no matching element exists.
    if (id.toLowerCase() !== "top" && !target.ids.has(id)) fail(`${link.url}#${link.fragment}`, "Linked fragment has no matching server-rendered id or named anchor.", link.source);
  }
  report.pages.sort((a, b) => a.url.localeCompare(b.url));
  report.resources.sort((a, b) => a.url.localeCompare(b.url));
  report.errors.sort((a, b) => a.url.localeCompare(b.url));
  report.passed = report.errors.length === 0;
  return report;
}

export function formatSummary(report: AuditReport): string {
  const safe = (value: string) => value.replace(/[\r\n|`<>]/g, " ");
  const lines = [
    `# Happy Trails site health: ${report.passed ? "PASS" : "FAIL"}`,
    "", `Checked ${report.checkedAt}; fetched from ${report.fetchedFrom}.`, "",
    `- Sitemap pages: ${report.pages.length}/${report.sitemapPages}`,
    `- Internal link references: ${report.internalLinks}; unique HTML fragments checked: ${report.fragmentsChecked}`,
    `- Additional page/asset destinations: ${report.resources.length}`,
    `- Errors: ${report.errors.length}; redirect warnings: ${report.warnings.length}`,
    `- External references skipped: ${report.skippedExternal}`, "",
  ];
  for (const [heading, findings] of [["Errors", report.errors], ["Warnings", report.warnings]] as const) {
    if (!findings.length) continue;
    lines.push(`## ${heading}`, "");
    for (const finding of findings) lines.push(`- ${safe(finding.url)} — ${safe(finding.message)}${finding.source ? ` (linked from ${safe(finding.source)})` : ""}`);
    lines.push("");
  }
  lines.push("Checks server HTML and same-origin resources only. This does not establish search indexing, rankings, browser behavior, or external listing status.", "");
  return lines.join("\n");
}

async function main(args: string[]) {
  let baseUrl: string | undefined;
  let output = "test-results/site-health/report.json";
  for (let index = 0; index < args.length; index++) {
    if (args[index] === "--help") {
      console.log("Usage: npm run seo:audit -- [--base-url http://127.0.0.1:3000] [--output test-results/site-health/report.json]\nDefault target: the canonical live site. Local checks retain production canonical expectations. No external hosts are crawled.");
      return;
    }
    if (["--base-url", "--output"].includes(args[index]) && args[index + 1] && !args[index + 1].startsWith("--")) {
      if (args[index] === "--base-url") baseUrl = args[++index];
      else output = args[++index];
    } else throw new Error(`Unknown option or missing value: ${args[index]}`);
  }
  if (!output.endsWith(".json")) throw new Error("--output must name a .json file.");
  const report = await auditSite({ baseUrl });
  const summary = formatSummary(report);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
  await writeFile(output.replace(/\.json$/, ".md"), summary);
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, summary);
  console.log(summary);
  console.log(`JSON report: ${output}`);
  if (!report.passed) process.exitCode = 1;
}

if (basename(process.argv[1] ?? "") === "audit-live-site.ts") {
  void main(process.argv.slice(2)).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
