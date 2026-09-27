import assert from "node:assert/strict";
import test from "node:test";
import { auditSite, formatSummary } from "../scripts/audit-live-site";
import { SITE_URL } from "../src/lib/site-url";

const home = `${SITE_URL}/`;
const venue = `${SITE_URL}/venue`;
const sitemap = `<urlset xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url><loc>${SITE_URL}</loc><image:image><image:loc>${SITE_URL}/images/barn.webp</image:loc></image:image></url>
  <url><loc>${venue}</loc></url>
</urlset>`;

function page(url: string, title: string, content = "", head = "") {
  return `<html><head><title>${title}</title><meta name="description" content="${title} description">
    <link rel="canonical" href="${url}">${head}</head><body><h1>${title}</h1>${content}</body></html>`;
}

type Reply = { body?: string; status?: number; type?: string; headers?: Record<string, string> };
function fixture(overrides: Record<string, Reply> = {}, base = SITE_URL) {
  const calls: { url: string; method: string; range: string | null }[] = [];
  const replies: Record<string, Reply> = {
    "/sitemap.xml": { body: sitemap, type: "application/xml" },
    "/": { body: page(SITE_URL, "Happy Trails", `
      <a href="/venue#the%20barn">Venue</a><a href="/news">News</a>
      <a href="/downloads/venue.pdf#page=1">Fact sheet</a><a href="#">Placeholder</a>
      <a href="#top">Top</a><a href="#:~:text=Happy">Text fragment</a>
      <a href="https://example.com/directory">External directory</a><a href="mailto:admin@example.com">Email</a>
      <button data-url="#client-only">Open photos</button>
      <img src="/images/barn.webp"><video src="/videos/tour.mp4"></video>
      <script>const ignored = '<a href="/never-fetch">fake</a><h1>Fake heading</h1>';</script>
      <!-- <a href="/comment-link">fake</a> -->`) },
    "/venue": { body: page(venue, "The venue", '<section id="the barn"><a href="/">Home</a></section>') },
    "/news": { body: page(`${SITE_URL}/news`, "News", "", '<meta name="robots" content="noindex">') },
    "/images/barn.webp": { type: "image/webp" },
    "/videos/tour.mp4": { type: "video/mp4" },
    "/downloads/venue.pdf": { type: "application/pdf", headers: { "X-Robots-Tag": "noindex, follow" } },
    ...overrides,
  };
  const fetcher: typeof fetch = async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    assert.equal(url.origin, base, "The audit must never fetch an external host.");
    assert.equal(init?.redirect, "manual", "External redirects must not be automatically followed.");
    const path = `${url.pathname}${url.search}`;
    const reply = replies[path];
    assert.ok(reply, `Unexpected URL: ${path}`);
    const method = init?.method ?? "GET";
    calls.push({ url: url.href, method, range: new Headers(init?.headers).get("range") });
    return new Response(method === "HEAD" ? null : reply.body ?? "asset", {
      status: reply.status ?? 200,
      headers: { "Content-Type": reply.type ?? "text/html", ...reply.headers },
    });
  };
  return { fetcher, calls };
}

test("audits sitemap pages, internal anchors and assets without external requests or video downloads", async () => {
  const mock = fixture();
  const result = await auditSite({}, mock.fetcher);
  assert.deepEqual(result.errors, []);
  assert.equal(result.passed, true);
  assert.equal(result.sitemapPages, 2, "Image sitemap locs must not be treated as pages.");
  assert.equal(result.pages.length, 2);
  assert.equal(result.fragmentsChecked, 2);
  assert.equal(result.skippedExternal, 1);
  assert.equal(mock.calls.filter((call) => call.url.endsWith("/images/barn.webp")).length, 1, "Repeated resources are fetched once.");
  assert.equal(mock.calls.find((call) => call.url.endsWith(".mp4"))?.method, "HEAD");
  assert.equal(mock.calls.find((call) => call.url.endsWith(".pdf"))?.method, "HEAD");
  assert.match(formatSummary(result), /site health: PASS/);
});

test("broken destinations and missing server anchors fail with the referring page", async () => {
  const mock = fixture({
    "/venue": { body: page(venue, "The venue", '<section id="renamed">Venue</section>') },
    "/downloads/venue.pdf": { status: 404 },
  });
  const result = await auditSite({}, mock.fetcher);
  assert.equal(result.passed, false);
  assert.ok(result.errors.some((error) => error.url === `${venue}#the%20barn` && error.source === home));
  assert.ok(result.errors.some((error) => error.url.endsWith(".pdf") && /HTTP 404/.test(error.message) && error.source === home));
  assert.match(formatSummary(result), /site health: FAIL/);
});

test("page noindex, canonical, heading and metadata regressions fail", async (t) => {
  const cases: { name: string; reply: Reply; expected: RegExp }[] = [
    { name: "noindex header", reply: { headers: { "X-Robots-Tag": "noindex" }, body: page(venue, "The venue") }, expected: /noindex/ },
    { name: "noindex meta", reply: { body: page(venue, "The venue", "", '<meta name="robots" content="noindex">') }, expected: /noindex/ },
    { name: "wrong canonical", reply: { body: page(home, "The venue") }, expected: /canonical/ },
    { name: "duplicate canonical", reply: { body: page(venue, "The venue", "", `<link rel="canonical" href="${venue}">`) }, expected: /canonical/ },
    { name: "duplicate H1", reply: { body: page(venue, "The venue", "<h1>Another heading</h1>") }, expected: /one nonempty H1/ },
    { name: "empty title", reply: { body: page(venue, "The venue").replace("<title>The venue</title>", "<title> </title>") }, expected: /one nonempty title/ },
    { name: "missing description", reply: { body: page(venue, "The venue").replace(/<meta name="description"[^>]+>/, "") }, expected: /one nonempty description/ },
    { name: "duplicate page title", reply: { body: page(venue, "Happy Trails") }, expected: /Duplicate title/ },
    { name: "sitemap redirect", reply: { status: 308, headers: { location: home } }, expected: /without redirects/ },
  ];
  for (const { name, reply, expected } of cases) await t.test(name, async () => {
    const result = await auditSite({}, fixture({ "/venue": reply }).fetcher);
    assert.equal(result.passed, false);
    assert.ok(result.errors.some((error) => expected.test(error.message)), JSON.stringify(result.errors));
  });
});

test("internal redirects are warnings while external redirects are not followed", async () => {
  const internal = await auditSite({}, fixture({
    "/news": { status: 307, headers: { location: "/venue" } },
  }).fetcher);
  assert.equal(internal.passed, true);
  assert.ok(internal.warnings.some((warning) => /Redirects to/.test(warning.message)));
  const external = await auditSite({}, fixture({
    "/news": { status: 302, headers: { location: "https://example.com/listing" } },
  }).fetcher);
  assert.equal(external.passed, false);
  assert.ok(external.errors.some((error) => /was not followed/.test(error.message)));
});

test("HEAD fallback sends a byte range and cancels rather than reading the asset", async () => {
  const mock = fixture();
  let cancelled = false;
  const fetcher: typeof fetch = async (input, init) => {
    if (String(input).endsWith(".mp4")) {
      if (init?.method === "HEAD") return new Response(null, { status: 405 });
      assert.equal(new Headers(init?.headers).get("range"), "bytes=0-1023");
      return new Response(new ReadableStream({ cancel() { cancelled = true; } }), { status: 206, headers: { "Content-Type": "video/mp4" } });
    }
    return mock.fetcher(input, init);
  };
  const result = await auditSite({}, fetcher);
  assert.equal(result.passed, true);
  assert.equal(cancelled, true);
});

test("local requests retain public canonical expectations and arbitrary origins are rejected", async () => {
  const baseUrl = "http://127.0.0.1:3000";
  const result = await auditSite({ baseUrl }, fixture({}, baseUrl).fetcher);
  assert.equal(result.passed, true);
  assert.equal(result.fetchedFrom, baseUrl);
  for (const base of ["https://example.com", "http://192.168.1.10", "http://localhost:3000/path", "http://user@localhost:3000"]) {
    await assert.rejects(auditSite({ baseUrl: base }, fixture().fetcher), /fetch origin/);
  }
});

test("invalid or foreign sitemaps produce a failed machine report", async () => {
  for (const body of ["<urlset></urlset>", sitemap.replace(venue, "https://example.com/venue")]) {
    const result = await auditSite({}, fixture({ "/sitemap.xml": { body, type: "application/xml" } }).fetcher);
    assert.equal(result.passed, false);
    assert.equal(result.errors.length, 1);
    assert.equal(result.errors[0].url, `${SITE_URL}/sitemap.xml`);
  }
});

test("encoded HTML attributes are decoded without losing IDs containing greater-than signs", async () => {
  const result = await auditSite({}, fixture({
    "/": { body: page(SITE_URL, "Happy Trails", '<a href="/venue?view=all&amp;sort=first#one%3Etwo">View</a>') },
    "/venue?view=all&sort=first": { body: page(venue, "The venue", '<section id="one>two">Details</section>') },
  }).fetcher);
  assert.equal(result.passed, true);
  assert.equal(result.fragmentsChecked, 1);
});
