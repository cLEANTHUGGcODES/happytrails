# Website SEO review — September 27, 2026

Public origin: **https://www.happytrailsshindigs.com**. This review covers the website; it does not represent Search Console ownership verification, indexing acceptance, ranking results, or directory approval.

## Changes

- Centralized the public HTTPS `www` origin for canonical links, sharing cards, structured data, and the sitemap. Existing apex/HTTP redirects already point to this domain. Each public page has its own title, description, canonical, Open Graph URL and complete social card; Privacy no longer inherits the homepage description.
- Added a linked `LocalBusiness` / `EventVenue` and `WebSite` graph on Home, with matching business information on Contact. It includes the supplied address, exact map coordinates, telephone, email, real venue photographs, and owner-supplied Google and Yelp profiles. JSON-LD output escapes `<` to prevent future editor content from closing its script element.
- Added visible Monday–Saturday, 10 a.m.–10 p.m. hours and profile links to Contact. Sunday has not been supplied and is omitted. Approximately 75 guests remains an estimate; no strict occupancy limit, rating, review, or reservation policy was inferred.
- Included all 21 gallery photographs in the image sitemap. Only published pages appear. Static pages no longer carry ignored `priority` / `changefreq` values or artificial build-time modification dates.
- The empty News index is `noindex, follow` and excluded from the sitemap. Publishing the first approved update through the existing content reader makes it indexable and adds it to the sitemap. Actual news articles receive article sharing metadata and `BlogPosting` data using the supplied title, body, image and publication date. No author or update date is fabricated.
- Kept the animation preview `noindex, nofollow`, and missing pages/articles return 404 with `noindex`. The root layout no longer gives unknown routes the homepage canonical.
- Added `X-Robots-Tag: noindex, nofollow` on Vercel aliases and nonproduction Vercel environments. Canonical links still point to the public domain. Preview protection remains an access-control setting; robots rules are not authentication.
- Property tour video elements, sources and posters now exist in the initial HTML. Playback remains explicit with `preload="none"`, and failed playback offers a retry. The native poster uses Next.js image optimization because browsers fetch posters even when video preloading is disabled. The responsive play overlay remains. This improves discovery without turning the gallery into a dedicated video watch page or promising video-rich-result eligibility.

## Preserved foundations

The public pages retain readable server HTML, one main heading per page, descriptive image alternatives, internal navigation, a mobile layout, local fonts, responsive modern image formats, and native links to pricing, contact and directions. The audit found no broken links among the checked public routes/fragments or missing assets among 28 media references. No location doorway pages, hidden keywords, invented testimonials, or keyword repetition were added.

## Current guidance applied

Reviewed Google's primary documentation and the installed Next.js 16.3.6 metadata, JSON-LD, robots, sitemap and header documentation before implementation:

- [Canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [title links](https://developers.google.com/search/docs/appearance/title-link), and [snippets](https://developers.google.com/search/docs/appearance/snippet).
- [Local business structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business), [site names](https://developers.google.com/search/docs/appearance/site-names), and [article data](https://developers.google.com/search/docs/appearance/structured-data/article).
- [Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [image sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps), and [video discovery](https://developers.google.com/search/docs/appearance/video).
- [Page experience](https://developers.google.com/search/docs/appearance/page-experience) and [Google's AI optimization guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide). No special `llms.txt` file is needed for Google Search visibility.
- [Search documentation updates](https://developers.google.com/search/updates): FAQ rich results were retired May 7, 2026. The helpful visible FAQs remain; no FAQ-rich-result claim or unnecessary FAQ markup was added.

The Yelp URL was supplied by the owner. Yelp blocked automated reading, so the listing's field contents were not independently reverified during this website review. The Google share URL was also owner supplied. Pending local-directory requests were not treated as published profiles.

The owner deferred optional phone/email obfuscation during this review. Direct business contact links and accurate contact structured data remain. The inquiry form retains its existing validation, hidden spam-trap field, and submission-timing checks; no claim is made that these prevent scraping of public contact information.

## Account work remaining

1. Verify the `happytrailsshindigs.com` domain property in Google Search Console using the token issued to the owner's account. Add only the issued DNS verification record; preserve website and Workspace DNS records.
2. Submit **https://www.happytrailsshindigs.com/sitemap.xml** in that property. Use URL Inspection for Home, Venue, Gallery, Pricing and Contact, and review Google's selected canonical and rendered page. A robots.txt sitemap reference already advertises the sitemap independently.
3. Check indexing, search queries and Core Web Vitals after Google recrawls and there is enough real visitor data. Automated build/browser checks and lab measurements do not establish indexing, rankings, physical-device behavior or field performance.
4. Keep public listings and the website aligned when hours, contact details or venue facts change. Continue publishing useful real event photographs and approved updates; an editor/login remains the separate planned Supabase phase.

Validation results for this implementation are recorded in [the SEO validation file](validation/seo-validation.md).
