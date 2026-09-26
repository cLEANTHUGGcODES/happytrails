# Validation record

Validated against the local production build on September 26, 2026, after the design revision and GSAP scroll-animation implementation.

## Application checks

- `npm run build`: passed; Next.js 16.3.6, React 19.3.0, Node 22.19.0. TypeScript passed in the build.
- `npm run lint`: passed without warnings.
- Browser acceptance suite: **40 passed in 30.3 seconds**, including eight automated WCAG A/AA scans. The final run includes seven additional motion checks: persistent photo reveals, live reduced-motion changes, no-JavaScript readability, keyboard focus, cross-page fragment links, gallery filtering/history, and FAQ expansion.
- Inquiry unit suite: **18 passed** after the Vercel readiness check added exact-origin support for `VERCEL_PROJECT_PRODUCTION_URL`. Delivery remains mocked; the regression check also rejects unrelated and lookalike origins.
- Responsive homepage widths: 360, 390, 430, 768, 1440, and 1920 pixels. All seven principal pages were inspected and measured at 390 and 1440 pixels after fonts and images loaded; none had horizontal overflow.
- Independent inner-page visual review covered Venue, Pricing, Story, Vendors, and Contact. Introductions, photo crops, spacing, pricing visibility, and contact/map access were checked.
- Gallery was independently checked at 360/390/768/1440: all 15 photos loaded, captions remained readable in the two-column phone grid, filtering narrowed the Barn category to four photos, and keyboard navigation, Escape, and focus restoration worked. The tour shortcut landed on the visible player section.
- The suite also covers menu keyboard behavior, deferred video loading, inquiry validation/error handling, JavaScript-disabled form fallback, public route/image loading, and the map download.
- All three map-app links now use the owner's corrected coordinates, **32.068833597034164, -96.69761704124728**, while the venue address remains visible. The targeted directions/browser test passed after the correction; no physical-phone app handoff or driven route has been tested.
- Source photos and videos remain unchanged. The original public photo collection and every owner-brief amenity remain represented.
- See the [design review](../design-review.md) for benchmark sources, before/after heights, and visual comparisons.
- GSAP motion uses intact text blocks with no stagger or splitting. A final visual scroll review at 1440 pixels and a touch-enabled 390-pixel viewport found no browser errors or horizontal overflow; visible photo frames completed their reveals. See [scroll motion](../scroll-motion.md) for behavior and implementation.
- GitHub/Vercel preparation: a clean export of the committed files passed `npm ci`, `npm run build` (including TypeScript), and `npm run lint`. Original source media, local dependencies, and real environment files were absent from that export; prepared public media and local fonts are included in the repository.

## Local Lighthouse results

Lighthouse 13.5.0 against `next start`. Mobile uses the simulated mobile profile; desktop uses its desktop preset. The latest mobile check ran after the scroll-animation build and browser suite. Desktop was measured during the preceding design revision. These are local laboratory measurements, not field results or a complete accessibility certification.

| Build / profile | Performance | Accessibility | Best practices | SEO | LCP | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| GSAP revision / mobile | 91 | 100 | 100 | 100 | 3.5 s | 0 |
| Design revision / mobile | 92 | 100 | 100 | 100 | 3.4 s | 0 |
| Design revision / desktop | 100 | 100 | 100 | 100 | 0.7 s | 0 |

Latest report: [GSAP mobile JSON](scroll-lighthouse-mobile.json), with 30 ms total blocking time. Earlier design reports: [mobile JSON](design-lighthouse-mobile.json), [desktop JSON](design-lighthouse-desktop.json). The original `lighthouse-mobile.json` and `lighthouse-desktop.json` are retained as the initial-build baseline. Small score/timing differences between individual local runs should not be treated as a field-performance conclusion.

Mobile LCP remains above the 2.5-second target. The hero image is eager/high priority, fonts are local, videos load on request, and smaller phone gallery thumbnails now use appropriate responsive image sizes. Further performance tuning must be assessed on the deployed origin and physical phones.

## Remaining launch verification

- Vercel project/domain and DNS/HTTPS are not connected in this workspace.
- Resend credentials and verified sender are not configured. No real inquiry email was sent.
- Configure the production WAF rule documented in `../inquiries.md`, then verify actual mailbox receipt with a deliberate owner-approved test.
- Test physical iPhone Safari and Android Chrome. Current mobile evidence is Chromium viewport/device emulation.
- Measure production Core Web Vitals; real visitor INP is not established by these laboratory tests.
- Verify supplied-video audio and prepare appropriate captions/descriptions before claiming full prerecorded-media accessibility.
- Supabase authentication, storage, and editing remain the agreed second phase.

## Visual previews

- [Desktop homepage](../previews/home-desktop.png) / [phone homepage](../previews/home-mobile.png)
- [Previous desktop homepage](../previews/before-home-desktop.png) / [previous phone homepage](../previews/before-home-mobile.png)
- [Desktop gallery](../previews/gallery-desktop.png) / [phone gallery](../previews/gallery-mobile.png)
- [Desktop Venue](../previews/venue-desktop.png) / [phone Venue](../previews/venue-mobile.png)
- [Desktop Pricing](../previews/pricing-desktop.png) / [phone Pricing](../previews/pricing-mobile.png)
- [Desktop Story](../previews/our-story-desktop.png) / [phone Story](../previews/our-story-mobile.png)
- [Desktop Vendors](../previews/vendors-desktop.png) / [phone Vendors](../previews/vendors-mobile.png)
- [Desktop Contact](../previews/contact-desktop.png) / [phone Contact](../previews/contact-mobile.png)
