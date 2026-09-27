# SEO validation — September 27, 2026

See the [implementation review and primary sources](../seo-review.md). Checks used the production build on an isolated local server at port 3001; the owner's development server on port 3000 was kept available.

## Application and crawler checks

- Production build and TypeScript: passed after the final video-poster optimization.
- ESLint: passed for the application, then the new tests and final changed video/test files. `git diff --check` passed.
- Unit tests: **27 passed**, including 9 new SEO regressions. Coverage includes canonical and sharing URLs, owner-confirmed structured data, article fallbacks, JSON-LD script escaping, and the existing inquiry-delivery contract with mocked delivery.
- All **61 browser scenarios passed across the full run and focused corrections**. The first full run passed 59; the remaining two needed test-only fixes for Next.js's equivalent root URL formatting and its built-in live-region announcer. Both subsequently passed. After the final poster change, all 4 SEO scenarios and the video discovery/playback/retry scenario passed again: **5/5**.
- Server HTML checks cover all 8 indexable public pages: unique titles and descriptions, one H1, their own canonical URL, complete Open Graph and Twitter cards, and no unintended `noindex`.
- Home JSON-LD parses without JavaScript; its business and website identities agree. Contact visibly matches the supplied address, email, hours and profile links.
- Sitemap XML parses and contains exactly the 8 published public pages plus 21 distinct gallery image URLs. Empty News, previews and nonexistent articles are absent. No artificial modification dates are emitted.
- Empty News and the animation preview advertise `noindex`. Missing pages and missing articles return 404 plus `noindex`. Robots.txt advertises the public sitemap while leaving these HTML directives crawlable.
- Request-host checks confirm Vercel aliases receive `X-Robots-Tag: noindex, nofollow`; the public `www` host does not.
- Video source, optimized poster and `preload="none"` are in server HTML. No MP4 request occurs before playback. The test simulates failed playback, verifies a focused retry, and confirms controls, focus and a video request after retry.
- Existing responsive, navigation, gallery, motion, inquiry and automated WCAG A/AA checks passed. Contact was also visually reviewed at 390px and 1440px with no horizontal overflow or browser exceptions. Mobile evidence is Chromium emulation, not physical-device validation.
- Browser form requests were intercepted. Unit delivery uses mocks. No real inquiry was sent during these checks.

## Mobile laboratory measurement

Lighthouse 13.5.0, simulated mobile profile, local production server. Final measurement after optimizing the native video poster:

| Performance | Accessibility | Best practices | SEO | LCP | CLS | Total blocking time |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 92 | 100 | 100 | 100 | 3.3 s | 0 | 100 ms |

[Compact machine-readable result](seo-lighthouse-mobile-summary.json). The initial native poster fetched the full source image; using the optimized poster reduced the reported image-delivery waste from about 116 KiB to 16 KiB. Individual lab scores vary and do not establish real-user Core Web Vitals. Mobile LCP is still above the 2.5-second good threshold; monitor deployed performance and real visitor data through Search Console before claiming a field-performance result.

Search Console verification, sitemap submission through the owner's account, Google's selected canonical, live Rich Results Test acceptance, and indexing results remain account-side checks. Valid local HTML and structured-data tests do not establish Google's acceptance or rankings.
