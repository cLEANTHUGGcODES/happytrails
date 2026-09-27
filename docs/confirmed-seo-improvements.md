# Fifteen confirmed SEO and referral improvements

September 27, 2026. This is a cumulative record of completed work across the SEO passes, not a claim of fifteen new backlinks or fifteen changes made in one turn. Live evidence is saved in `delivery/seo/confirmed-improvements/`; the earlier deployment and IndexNow receipt are in `delivery/seo/autonomous-pass/`.

| # | Completed improvement | Verification / scope |
| --- | --- | --- |
| 1 | Consolidated canonical URLs on the HTTPS www domain | Public pages declare their intended canonical; apex and HTTP requests permanently redirect. |
| 2 | Added unique page titles and descriptions | The eight indexable pages have distinct metadata, with venue type and location where relevant. |
| 3 | Added accurate business and website structured data | Server HTML includes linked `LocalBusiness` / `EventVenue` and `WebSite` records with owner-confirmed identity, address, coordinates, hours and profiles. Delivery does not imply rich-result acceptance. |
| 4 | Completed social sharing cards | Each public page supplies its own Open Graph and Twitter title, description, image and URL. |
| 5 | Published a curated page sitemap and crawler reference | Eight indexable pages are advertised in `sitemap.xml`, referenced from `robots.txt`; empty news and artificial modification dates are excluded. |
| 6 | Added all gallery photographs to the image sitemap | All 21 distinct gallery images are represented. |
| 7 | Protected search results from empty and nonproduction pages | Empty news, the animation preview and Vercel aliases carry noindex. Missing routes return genuine 404 responses. |
| 8 | Made property videos discoverable in server HTML | Native video elements, source files and optimized posters are present before JavaScript. Playback remains on demand. |
| 9 | Added compatible brand icons | Stable 96px PNG favicon and 180px Apple touch icon are live and linked in metadata. |
| 10 | Improved visible local context | The Venue introduction identifies a barn wedding/event venue in Blooming Grove, Texas; the homepage tagline connects naturally to the celebrations paragraph. |
| 11 | Improved contextual links and accessible navigation | Pricing FAQs link to directions, getting-ready spaces and vendor help. Venue-card names use their headings, and gallery button names now describe the photographs instead of repeating poetic captions. |
| 12 | Linked the official business profiles from the website | Google and Yelp profiles are accessible from the footer and Contact. These are outbound identity/reference links, not earned backlinks. |
| 13 | Corrected the public GitHub reference | Repository website field points to the canonical domain; description and README identify the real business and relevant visitor destinations. |
| 14 | Implemented and used verified IndexNow notifications | Initial eight-page submission received HTTP 202. After the fact sheet was published, the changed Venue and Pricing pages were submitted and accepted with HTTP 200 at 22:28 UTC. The reusable CLI checks ownership, live status, canonicals and indexing directives before posting. No confirmed indexing is claimed. |
| 15 | Published a shareable venue fact sheet | A one-page branded PDF with a real venue photo, selectable text, clickable links and a tested directions QR code is linked from Venue and Pricing. It is a referral resource, not an independently earned backlink. |

## New referral resource

Public file: `/downloads/happy-trails-venue-fact-sheet.pdf`. It uses the current verified name, address, approximate guest estimate, property sizes, wedding starting price and contact information. No rental inclusions, overnight lodging, availability, reviews or partnerships were invented.

Regenerate after reviewing the facts and supplying the actual review date:

```sh
npx tsx scripts/export-venue-sheet.ts YYYY-MM-DD
```

The manual exporter uses the installed Playwright/Sharp packages, local licensed website fonts and `uv` with Segno 1.6.6 for the QR. It does not run during the website build. `PLAYWRIGHT_CHROMIUM_EXECUTABLE` can select an existing Chromium installation. Originals remain unchanged. Review the output for one-page fit, text accuracy, links and QR readability before replacing the published file.

The PDF carries `X-Robots-Tag: noindex, follow` because it is a dated printable snapshot; visitors should find the current website pages in search. It remains accessible for downloading and sharing. Google documents HTTP-header controls for PDFs in its [robots directive guidance](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag).

## Results that remain unconfirmed

This record does not establish rankings, Google's indexing state, rich-result acceptance or fifteen referring domains. Blooming Grove and Visit Corsicana submissions remain subject to publisher review. Search Console still requires owner MFA access. IndexNow's HTTP 200 confirms acceptance of the latest submission, not indexing, as described in the [official FAQ](https://www.indexnow.org/faq).

Directory status is recorded separately in `delivery/local-listings/`. Eventective's single free-profile request returned HTTP 204 but remained at Saving; one normal sign-in attempt then failed. No account, public listing or backlink was confirmed, and the attempt was stopped without resubmission. Pending or unconfirmed listing submissions are not counted as published backlinks.

## Verification for the new changes

The production build and scoped ESLint passed. All 51 selected browser checks passed across the initial run and a targeted rerun of three tests that started before the local server was ready. Additional checks verified PDF delivery, its noindex header, matching file hash, download behavior, and visible links without horizontal overflow on Venue and Pricing at 320, 390, 768 and 1440 pixels. All 21 gallery photo buttons expose their descriptive image alternatives.

The PDF is one Letter page, approximately 855 KB, with selectable text, document tags and working links. Its directions QR was decoded from the rendered PDF and matches the Contact directions section. The actual PDF and mobile page previews were visually reviewed; this does not establish formal PDF/UA certification or physical-device testing.
