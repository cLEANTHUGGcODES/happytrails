/** Regenerate after reviewing the facts: npx tsx scripts/export-venue-sheet.ts YYYY-MM-DD */
import { execFileSync } from "node:child_process";
import { mkdir, readFile, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";
import { site } from "../src/lib/content";

async function main() {
  const root = resolve(__dirname, "..");
  const reviewed = process.argv[2];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(reviewed ?? "") || Number.isNaN(Date.parse(reviewed))) {
    throw new Error("Supply the date on which the venue facts were reviewed: YYYY-MM-DD.");
  }
  const date = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(reviewed));
  const escapeHtml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
  const dataUrl = async (path: string, type: string) => `data:${type};base64,${(await readFile(join(root, path))).toString("base64")}`;
  // Print-sized exports keep the PDF light; original website images are unchanged.
  const printImage = async (path: string, format: "png" | "jpeg", width: number) => {
    const image = sharp(join(root, path)).resize({ width, withoutEnlargement: true });
    const bytes = await (format === "jpeg" ? image.jpeg({ quality: 88 }) : image.png()).toBuffer();
    return `data:image/${format};base64,${bytes.toString("base64")}`;
  };
  const [logo, photo, display, italic, body] = await Promise.all([
    printImage("public/images/logo.png", "png", 600),
    printImage("public/images/barn-wide.webp", "jpeg", 1600),
    dataUrl("src/app/fonts/cormorant-roman.woff2", "font/woff2"),
    dataUrl("src/app/fonts/cormorant-italic.woff2", "font/woff2"),
    dataUrl("src/app/fonts/manrope.woff2", "font/woff2"),
  ]);
  const directionsUrl = `${site.url}/contact#directions`;
  // Segno is used only by this manual export command, never by the website build.
  const qr = execFileSync("uv", ["run", "--with", "segno==1.6.6", "python", "-c",
    "import segno, sys; print(segno.make_qr(sys.argv[1], error='m').svg_data_uri(scale=4, border=4))", directionsUrl,
  ], { encoding: "utf8" }).trim();

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(site.name)} — Venue Fact Sheet</title><style>
  @font-face{font-family:Display;src:url('${display}');font-weight:300 700}
  @font-face{font-family:Display;src:url('${italic}');font-style:italic;font-weight:300 700}
  @font-face{font-family:Body;src:url('${body}');font-weight:200 800}
  @page{size:letter;margin:0}*{box-sizing:border-box}html,body{margin:0}body{width:816px;color:#2d241e;background:#fcfaf5;font:13px/1.6 Body,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  main{padding:36px 44px 24px;min-height:1056px}a{color:inherit;text-underline-offset:3px}h1,h2,p{margin:0}header{display:flex;align-items:center;justify-content:space-between;gap:36px;margin-bottom:20px}.logo{width:158px;height:79px;object-fit:contain}h1{font:500 37px/.98 Display,serif;max-width:420px}h1 em{color:#8e302c;font-weight:400}.eyebrow{font-size:9px;text-transform:uppercase;letter-spacing:1.6px;margin-bottom:9px}.photo{display:block;width:100%;height:240px;object-fit:cover;object-position:50% 58%}.name{margin:13px 0 0;font-size:11px;letter-spacing:.3px;color:#685f54}.facts{display:grid;grid-template-columns:1fr 1fr 1fr;border-bottom:1px solid #dcd3c4;margin-bottom:22px;padding:18px 0}.fact{padding-left:26px;border-left:1px solid #dcd3c4}.fact:first-child{padding-left:0;border-left:0}.number{font:500 39px/1 Display,serif;color:#8e302c}.number small{font-size:23px}.label{font-size:10px;margin-top:6px}.columns{display:grid;grid-template-columns:1fr 1fr;gap:38px}h2{font:500 29px/1.1 Display,serif;margin-bottom:10px}.columns p{font-size:12px;color:#51483f}.columns a{display:inline-block;font-size:10px;margin-top:10px}.pricing{margin-top:20px;padding:14px 0;border-top:1px solid #dcd3c4;border-bottom:1px solid #dcd3c4;display:flex;gap:24px;align-items:center}.price{white-space:nowrap;font:500 27px/1.2 Display,serif;color:#8e302c}.pricing p{font-size:10px;line-height:1.55}.contact{display:grid;grid-template-columns:1fr 108px;gap:22px;background:#8e302c;color:#fcfaf5;margin-top:22px;padding:22px 24px}.contact h2{font-size:28px;margin-bottom:8px}.contact p{font-size:11px}.contact a{font-weight:500}.contact .website{display:inline-block;margin-top:8px;font-size:12px}.qr{display:block;width:96px;height:96px;background:white}.scan{text-align:center;font-size:9px!important;margin-top:6px}.footnote{font-size:8px;color:#685f54;margin-top:12px;display:flex;justify-content:space-between;gap:20px}.footnote span:last-child{text-align:right}
  </style></head><body><main>
  <header><img class="logo" src="${logo}" alt="${escapeHtml(site.name)}"><div><p class="eyebrow">Blooming Grove, Texas · Venue overview</p><h1>Barn weddings.<br><em>A big Texas welcome.</em></h1></div></header>
  <img class="photo" src="${photo}" alt="Reception tables, timber rafters and a checkered dance floor inside the Happy Trails barn">
  <p class="name">${escapeHtml(site.name)} · A little place. A lot of heart.</p>
  <section class="facts" aria-label="Venue at a glance"><div class="fact"><p class="number">22</p><p class="label">ACRES OF COUNTRYSIDE</p></div><div class="fact"><p class="number"><small>Approx.</small> ${site.guestCapacityEstimate}</p><p class="label">GUESTS</p></div><div class="fact"><p class="number">1,800 <small>sq. ft.</small></p><p class="label">RENOVATED EVENT BARN</p></div></section>
  <section class="columns"><div><h2>Bring your people.</h2><p>Gather for a wedding, birthday or family reunion in rural Navarro County. Explore the barn, covered outdoor seating, dance floor, and grounds with a portable ceremony arbor and benches.</p><a href="${site.url}/gallery">View photographs &amp; property tours</a></div><div><h2>Make room for the day.</h2><p>A 400-square-foot grain-bin bridal suite and a 400-square-foot Western-inspired bunkhouse offer places to get ready. Both have air conditioning and a bathroom.</p><a href="${site.url}/venue">Explore the spaces &amp; amenities</a></div></section>
  <section class="pricing" aria-label="Starting wedding price"><div class="price">Weddings from $3,000</div><p>Tell Jennifer and Randy about your plans for a tailored quote.<br>Ask about pricing for birthdays, reunions and other gatherings.</p></section>
  <section class="contact"><div><h2>Come see it for yourself.</h2><p><strong>Jennifer &amp; Randy Shaw</strong><br><a href="${directionsUrl}">${escapeHtml(site.fullAddress)}</a><br><a href="${site.phoneHref}">${site.phone}</a> · <a href="mailto:${site.email}">${site.email}</a></p><a class="website" href="${site.url}/">happytrailsshindigs.com</a></div><div><a href="${directionsUrl}" aria-label="Map and driving directions"><img class="qr" src="${escapeHtml(qr)}" alt="QR code for Happy Trails map and driving directions"></a><p class="scan">MAP &amp; DIRECTIONS</p></div></section>
  <p class="footnote"><span>Venue details reviewed ${date}.</span><span>Contact us to arrange a visit and confirm current pricing and rental inclusions.</span></p>
  </main></body></html>`;

  const directory = join(root, "public/downloads");
  const previews = join(root, "delivery/seo/confirmed-improvements");
  await Promise.all([mkdir(directory, { recursive: true }), mkdir(previews, { recursive: true })]);
  const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE });
  try {
    const page = await browser.newPage({ viewport: { width: 816, height: 1056 } });
    await page.setContent(html);
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all(Array.from(document.images, (img) => img.decode())); });
    const height = await page.locator("main").evaluate((element) => element.getBoundingClientRect().height);
    if (height > 1056) throw new Error(`Fact sheet overflows one Letter page: ${height}px`);
    const destination = join(directory, "happy-trails-venue-fact-sheet.pdf");
    await page.pdf({ path: destination, format: "Letter", printBackground: true, preferCSSPageSize: true, tagged: true, outline: true });
    await page.screenshot({ path: join(previews, "venue-fact-sheet.png"), fullPage: true });
    console.log(`Exported ${destination} (${(await stat(destination)).size} bytes); reviewed ${reviewed}.`);
  } finally {
    await browser.close();
  }
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
