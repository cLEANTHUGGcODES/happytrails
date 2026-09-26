# Happy Trails Shindigs & Events

A Next.js website for the Happy Trails wedding and event venue in Blooming Grove, Texas. This is the public-website release: the Supabase owner dashboard is the planned second phase.

Repository: [cLEANTHUGGcODES/happytrails](https://github.com/cLEANTHUGGcODES/happytrails). Production branch: `main`.

[Desktop preview](docs/previews/home-desktop.png) · [Phone preview](docs/previews/home-mobile.png) · [Team brief audit](docs/team-brief-audit.md) · [Validation record](docs/validation/README.md) · [Design review and comparison](docs/design-review.md)

## Run locally

Use Node.js 22.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production preview:

```sh
npm run build
npm run start
```

## What is included

- Responsive Home, Venue, Gallery, Vendors, Pricing & FAQs, Our Story, News, Contact, and Privacy pages.
- Fifteen curated photographs with category filters, captions, swipe/keyboard navigation, zoom, thumbnails, and fullscreen viewing.
- Two optimized, on-demand property tours; originals remain untouched in the workspace root.
- A dedicated Vendors page in desktop, mobile, and footer navigation, offering help finding local vendors.
- The supplied address, 5281 FM 55, Blooming Grove, TX 76626, with an illustrated location map, downloadable map, and Google Maps, Apple Maps, and Waze driving directions on Contact.
- An inquiry form and Resend delivery endpoint with server validation, idempotent retries, and honest failure handling.
- Local fonts, responsive images, page metadata, social previews, structured venue data, robots.txt, and a sitemap.
- Typed media, featured-image slots, and news readers that can later be backed by Supabase.

No placeholder news, invented reviews, unverified capacity claims, live availability calendar, or admin login are published in this release.

## Email setup

Copy `.env.example` to `.env.local` and fill in `RESEND_API_KEY` and a verified sender address in `INQUIRY_FROM_EMAIL`. The default recipient is `admin@happytrailsshindigs.com`.

The form deliberately reports a delivery error if email configuration is missing. Telephone and direct email links work independently. Browser tests intercept delivery and unit tests use mocks: automated verification never sends real inquiries.

See [the inquiry guide](docs/inquiries.md) for domain verification, preview environments, and the production rate-limit rule.

## Deploy to Vercel

1. Import `cLEANTHUGGcODES/happytrails` into a Vercel Pro project, using `main` as the production branch. Select the Next.js framework, repository root (`./`), and Node.js 22.x. Keep the default output directory; use `npm ci` to install and `npm run build` to build.
2. Set the email variables from `.env.example` in production. Use separate test email credentials or leave delivery unconfigured in preview environments.
3. Set `NEXT_PUBLIC_SITE_URL` to the production HTTPS origin; it defaults to `https://happytrailsshindigs.com`. Vercel supplies the allowed deployment URL variables automatically.
4. Configure the Vercel WAF rule described in `docs/inquiries.md`. Configure Deployment Protection for preview deployments.
5. Review a preview, connect the custom domain, and verify DNS and HTTPS. Send a deliberate test inquiry and confirm receipt in the actual owner mailbox before directing visitors to the form.

The original root-level media and planning documents stay in the local workspace and are excluded from Git by `.gitignore` and deployments by `.vercelignore`. Only prepared media in `public/` is served. Build output, dependencies, and real environment files are also excluded from Git; `.env.example` is the blank configuration template. No Vercel account, project, domain, or email-provider connection is embedded in the repository.

## Content and photographs

`src/lib/content.ts` is the content boundary. `getGallery()`, `getSiteMedia()`, `getUpdates()`, and `getUpdate()` isolate the local data source. Featured page images refer to named slots, so those selections can later be managed without editing page components.

To add an approved update during this first phase, add a `NewsPost` to `newsSeed` and redeploy. The news index, article route, homepage teaser, metadata, and sitemap then populate from the same reader. The initial news collection is intentionally empty.

See [the asset register](docs/assets.md) for source-to-output mappings, dimensions, media preparation, and photography limitations. See [the map provenance](docs/maps/README.md) for the illustrated location guide and reference data. Venue copy follows the Word brief and subsequent owner-supplied details, including the exact address. Capacity, alcohol/vendor policies, rental terms, and package inclusions still require owner-provided details.

The [team brief audit](docs/team-brief-audit.md) records coverage of all six requested sections and the resolved map, Vendors-navigation, and bar-dimension gaps. This is content coverage, separate from deployment, real inquiry delivery, and owner acceptance.

## Verification

```sh
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```

The browser suite starts a production server (or reuses one already on port 3000). It tests the public routes and images, six viewport widths, gallery interaction, keyboard navigation, inquiry failure states, and automated accessibility rules. An optional `PLAYWRIGHT_CHROMIUM_EXECUTABLE` environment variable supports an existing browser installation.

Automated browser sizes emulate device layouts. Actual iPhone Safari and Android Chrome checks, production mail receipt, DNS, and real visitor performance remain deployment checks, not claims established by a local build.

## Next phase

See [the Supabase handoff](docs/supabase-phase-two.md) for the agreed owner-dashboard scope. This release deliberately has no simulated login or temporary browser-only content editor.
