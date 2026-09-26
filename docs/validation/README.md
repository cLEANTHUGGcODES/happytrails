# Validation record

Validated against the local production build on September 26, 2026, after the design and content-density revision.

## Application checks

- `npm run build`: passed; Next.js 16.3.6, React 19.3.0, Node 22.19.0. TypeScript passed in the build.
- `npm run lint`: passed without warnings.
- Browser acceptance suite: **33 passed in 27.1 seconds**, including eight automated WCAG A/AA scans. The full suite was rerun after the final navigation/footer polish.
- Inquiry unit suite: 17 passed during the initial implementation using a mocked email provider. Email delivery logic was not changed by this design revision.
- Responsive homepage widths: 360, 390, 430, 768, 1440, and 1920 pixels. All seven principal pages were inspected and measured at 390 and 1440 pixels after fonts and images loaded; none had horizontal overflow.
- Independent inner-page visual review covered Venue, Pricing, Story, Vendors, and Contact. Introductions, photo crops, spacing, pricing visibility, and contact/map access were checked.
- Gallery was independently checked at 360/390/768/1440: all 15 photos loaded, captions remained readable in the two-column phone grid, filtering narrowed the Barn category to four photos, and keyboard navigation, Escape, and focus restoration worked. The tour shortcut landed on the visible player section.
- The suite also covers menu keyboard behavior, deferred video loading, inquiry validation/error handling, JavaScript-disabled form fallback, public route/image loading, and the map download.
- All three map-app links retain the full destination `5281 FM 55, Blooming Grove, TX 76626`. Waze query/navigation parameters and button layout were checked during its implementation; no physical-phone app handoff or driven route has been tested.
- Source photos and videos remain unchanged. The original public photo collection and every owner-brief amenity remain represented.
- See the [design review](../design-review.md) for benchmark sources, before/after heights, and visual comparisons.

## Current local Lighthouse results

Lighthouse 13.5.0 against `next start`. Mobile uses the simulated mobile profile; desktop uses its desktop preset. Reports were run separately after the final build and browser suite. These are local laboratory measurements, not field results or a complete accessibility certification.

| Profile | Performance | Accessibility | Best practices | SEO | LCP | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | 92 | 100 | 100 | 100 | 3.4 s | 0 |
| Desktop | 100 | 100 | 100 | 100 | 0.7 s | 0 |

Current reports: [mobile JSON](design-lighthouse-mobile.json), [desktop JSON](design-lighthouse-desktop.json). The original `lighthouse-mobile.json` and `lighthouse-desktop.json` are retained as the initial-build baseline. Performance scores match that baseline; its mobile LCP was 3.3 seconds, compared with 3.4 seconds in the current run. Small changes of this size should not be treated as a field-performance conclusion.

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
