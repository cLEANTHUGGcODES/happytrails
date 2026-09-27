import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  assertIndexablePage,
  INDEXNOW_ENDPOINT,
  INDEXNOW_KEY,
  INDEXNOW_KEY_URL,
  normalizePublicUrl,
  sitemapPageUrls,
  submitIndexNow,
} from "../scripts/submit-indexnow";
import { SITE_URL } from "../src/lib/site-url";

const home = `${SITE_URL}/`;
const venue = `${SITE_URL}/venue`;
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url><loc>${home}</loc><image:image><image:loc>${SITE_URL}/images/barn.webp</image:loc></image:image></url>
  <url><loc>${venue}</loc></url>
</urlset>`;

function pageHtml(url: string, extra = "") {
  return `<html><head><link rel="canonical" href="${url}"><meta name="robots" content="index, follow">${extra}</head><body>Happy Trails</body></html>`;
}

type Reply = { body: string; status?: number; type?: string; headers?: Record<string, string> };
function fixture(overrides: Record<string, Partial<Reply>> = {}, submissionStatus = 200, retryAfter?: string) {
  const calls: { url: string; init?: RequestInit }[] = [];
  const replies: Record<string, Reply> = {
    [`${SITE_URL}/sitemap.xml`]: { body: sitemap, type: "application/xml; charset=utf-8" },
    [INDEXNOW_KEY_URL]: { body: `${INDEXNOW_KEY}\n`, type: "text/plain; charset=utf-8" },
    [home]: { body: pageHtml(SITE_URL), type: "text/html; charset=utf-8" },
    [venue]: { body: pageHtml(venue), type: "text/html; charset=utf-8" },
  };
  const fetcher: typeof fetch = async (input, init) => {
    const url = input instanceof Request ? input.url : String(input);
    calls.push({ url, init });
    assert.equal(init?.redirect, "manual", "preflight and submission must not follow redirects");
    if (url === INDEXNOW_ENDPOINT) {
      assert.equal(init?.method, "POST");
      return new Response(null, {
        status: submissionStatus,
        headers: retryAfter ? { "Retry-After": retryAfter } : undefined,
      });
    }
    const reply = { ...replies[url], ...overrides[url] };
    assert.equal(typeof reply.body, "string", `Unexpected request: ${url}`);
    return new Response(reply.body, {
      status: reply.status ?? 200,
      headers: { "Content-Type": reply.type ?? "text/html", ...reply.headers },
    });
  };
  return { fetcher, calls, posts: () => calls.filter((call) => call.init?.method === "POST") };
}

test("ownership file contains the public token and URLs stay on the canonical origin", () => {
  assert.match(INDEXNOW_KEY, /^[0-9a-f]{32}$/);
  assert.equal(readFileSync(`public/${INDEXNOW_KEY}.txt`, "utf8").trim(), INDEXNOW_KEY);
  assert.equal(normalizePublicUrl(SITE_URL), home);
  assert.equal(normalizePublicUrl("/venue"), venue);
  for (const url of [
    "http://www.happytrailsshindigs.com/", "https://happytrailsshindigs.com/",
    "https://unrelated.example/", "https://user@www.happytrailsshindigs.com/",
    "/venue?tracking=1", "/venue#the-barn", "/api/inquiries", "/admin", "/preview/horse",
  ]) assert.throws(() => normalizePublicUrl(url), url);
});

test("sitemap selection includes page locs only and rejects empty or foreign URLs", () => {
  assert.deepEqual(sitemapPageUrls(sitemap), [home, venue]);
  assert.throws(() => sitemapPageUrls("<html>Not a sitemap</html>"));
  assert.throws(() => sitemapPageUrls('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>'));
  assert.throws(() => sitemapPageUrls(sitemap.replace(venue, "https://example.com/venue")));
});

test("default dry run validates the live key and all selected pages without posting", async () => {
  const mock = fixture();
  const result = await submitIndexNow({ paths: [], all: true }, mock.fetcher);
  assert.equal(result.status, "dry-run");
  assert.equal(result.httpStatus, null);
  assert.deepEqual(result.urlList, [home, venue]);
  assert.equal(mock.posts().length, 0);
  assert.ok(mock.calls.some((call) => call.url === INDEXNOW_KEY_URL));
  assert.ok(mock.calls.some((call) => call.url === venue));
});

test("explicit submission sends one deduplicated batch and distinguishes 200 from 202", async (t) => {
  for (const status of [200, 202]) {
    await t.test(`HTTP ${status}`, async () => {
      const mock = fixture({}, status);
      const result = await submitIndexNow({ paths: ["/", SITE_URL, "/venue"], submit: true }, mock.fetcher);
      assert.equal(result.httpStatus, status);
      assert.equal(result.status, status === 200 ? "submitted" : "pending-key-validation");
      assert.equal(mock.posts().length, 1);
      assert.deepEqual(JSON.parse(String(mock.posts()[0].init?.body)), {
        host: "www.happytrailsshindigs.com",
        key: INDEXNOW_KEY,
        keyLocation: INDEXNOW_KEY_URL,
        urlList: [home, venue],
      });
    });
  }
});

test("failed preflight never posts even when --submit is requested", async (t) => {
  const cases: { name: string; overrides: Record<string, Partial<Reply>> }[] = [
    { name: "key mismatch", overrides: { [INDEXNOW_KEY_URL]: { body: "another-key" } } },
    { name: "key redirect", overrides: { [INDEXNOW_KEY_URL]: { status: 308, headers: { location: home } } } },
    { name: "page redirect", overrides: { [venue]: { status: 301, headers: { location: home } } } },
    { name: "missing page", overrides: { [venue]: { status: 404 } } },
    { name: "wrong content type", overrides: { [venue]: { type: "application/json" } } },
    { name: "wrong canonical", overrides: { [venue]: { body: pageHtml(home) } } },
    { name: "duplicate canonical", overrides: { [venue]: { body: pageHtml(venue, `<link rel="canonical" href="${venue}">`) } } },
    { name: "noindex meta", overrides: { [venue]: { body: pageHtml(venue, '<meta content="noindex,follow" name="robots">') } } },
    { name: "bingbot none", overrides: { [venue]: { body: pageHtml(venue, "<meta name='bingbot' content='none'>") } } },
    { name: "noindex header", overrides: { [venue]: { headers: { "X-Robots-Tag": "noindex, nofollow" } } } },
  ];
  for (const { name, overrides } of cases) {
    await t.test(name, async () => {
      const mock = fixture(overrides);
      await assert.rejects(submitIndexNow({ paths: ["/venue"], submit: true }, mock.fetcher));
      assert.equal(mock.posts().length, 0);
    });
  }
});

test("unpublished pages and ambiguous full-site selection cannot be submitted", async () => {
  for (const options of [
    { paths: ["/news"], submit: true },
    { paths: [], submit: true },
    { paths: ["/venue"], all: true, submit: true },
    { paths: ["https://example.com/"], submit: true },
  ]) {
    const mock = fixture();
    await assert.rejects(submitIndexNow(options, mock.fetcher));
    assert.equal(mock.posts().length, 0);
  }
});

test("metadata-looking text inside scripts and comments is not treated as a robots directive", () => {
  assert.doesNotThrow(() => assertIndexablePage(venue, pageHtml(venue,
    '<script>const example = \'<meta name="robots" content="noindex">\';</script><!-- <link rel="canonical" href="https://example.com/"> -->',
  ), new Headers()));
});

test("rejected and rate-limited submissions are reported without automatic retries", async (t) => {
  for (const status of [403, 422, 429, 500]) {
    await t.test(`HTTP ${status}`, async () => {
      const mock = fixture({}, status, status === 429 ? "600" : undefined);
      await assert.rejects(
        submitIndexNow({ paths: ["/venue"], submit: true }, mock.fetcher),
        status === 429 ? /HTTP 429.*Retry-After: 600/ : new RegExp(`HTTP ${status}`),
      );
      assert.equal(mock.posts().length, 1);
    });
  }
});
