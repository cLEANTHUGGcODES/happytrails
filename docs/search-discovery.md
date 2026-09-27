# Search discovery and local visibility — September 27, 2026

This pass covers work that can be completed without the owner's account verification or additional business facts. It builds on the [technical SEO review](seo-review.md) and [Seobility review](seo-seobility-review.md).

## Completed changes

- The Venue introduction now identifies Happy Trails as a barn wedding and event venue in Blooming Grove, Texas. It uses the existing 22-acre property and approximate 75-guest facts rather than creating repetitive city landing pages.
- Three Pricing FAQs now link directly to the existing directions, getting-ready spaces and vendor-help pages. The links remain inside the relevant accessible accordion answers.
- The public GitHub repository's website field now points to the canonical Happy Trails domain instead of the Vercel alias. Its description identifies the business and location. The README includes the official website and useful visitor destinations. These are maintained business references, not a claim of an independently earned editorial backlink.
- Added a hosted IndexNow ownership file and a validated submission command. IndexNow accepts notifications for participating search engines, including Bing; this does not verify Google Search Console, create a Bing Places listing, or guarantee indexing.

## Notify search engines after meaningful content changes

Deploy first, then preview an explicit set of changed pages:

```sh
npm run seo:notify -- /venue /pricing
```

Submit that set only after checking it:

```sh
npm run seo:notify -- --submit /venue /pricing
```

The command defaults to a dry run. It checks the public ownership file and the selected live pages before making a submission. It rejects redirects, noncanonical URLs and pages excluded from indexing. It sends notifications to one IndexNow endpoint; participating engines share notifications. No browser-side request, public submission endpoint, scheduled resubmission or build-time POST is added.

An explicit `--all` option is reserved for a justified initial notification or changes affecting every public page. Avoid resubmitting unchanged pages or cosmetic changes. The original eight public pages were recently updated with the business-profile footer links; the initial submission receipt is stored locally under `delivery/seo/autonomous-pass/`. A 200 response means the submission was accepted; a 202 response means it was received with key validation pending. Neither proves that the pages are indexed.

Future Supabase publishing can integrate this notification at the successful publish step. Deleted/redirected-page notification is outside this command's current indexable-page checks and should be handled explicitly if routes are retired.

## Listings reviewed and deliberately left alone

| Opportunity | Finding / disposition |
| --- | --- |
| Blooming Grove / Blackland TX | Existing submission received; no published Happy Trails listing found in the current directory. Await editorial review rather than submitting again. |
| Visit Corsicana | Existing eligibility inquiry was accepted. No approved listing established. Await the publisher's response. |
| City of Blooming Grove | Official Local Businesses page contains no listings or listing form. Eligibility and process are unpublished; no unsolicited general-contact request sent. |
| Corsicana / Navarro County Chamber | Paid membership application, plus information not currently supplied. Skipped. |
| Eventective / PartySlate | Relevant potential venue profiles. The inspected registration paths did not establish the publication flow: PartySlate's company search remained at Loading, and Eventective's body signup links exposed no destination. Email verification before publication was not confirmed, so account creation alone is not treated as an owner blocker. No profile was created or backlink claimed. |
| WeddingAvailability | Venue-domain email claim process; geographic eligibility not established. Skipped. |
| Google Search Console / Bing Places / Apple Business | Owner account access or verification remains outstanding. No new sign-in prompt or MFA request was initiated. |
| Vendor referrals / editorial features | Actual collaborators and permission to contact them have not been supplied. No invented partnerships, reviews or outreach messages. |

No paid links, bulk directory submissions, duplicate business profiles, fake reviews or generic location pages were added. No new directory backlink was confirmed during this pass. Current submission records remain in `delivery/local-listings/`.

## Evidence and limits

Deployment, browser checks and the IndexNow acknowledgement are recorded locally under `delivery/seo/autonomous-pass/`. Search queries did not establish a complete backlink inventory or Google's indexing state. Public Google and Yelp pages could not be fully read by the research tool; existing owner-supplied profile URLs were retained.

The production build, TypeScript and scoped ESLint checks passed. All 44 existing SEO, public-page, accessibility and scroll-animation browser checks passed, along with 24 mocked IndexNow checks and nine structured-data/metadata unit checks. Additional review checked all nine public pages, 26 unique internal destinations including fragments, the new FAQ links at 320/390/768/1440 pixels, and keyboard navigation to the directions section. No real inquiry emails were sent during testing.

The changes improve relevant page context, visitor navigation and submission readiness. Ranking gains, accepted rich results and new directory publications require evidence from the relevant search engine or publisher.

## Primary sources

- [IndexNow protocol](https://www.indexnow.org/documentation) and [submission guidance](https://www.indexnow.org/faq).
- [Google link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) and [helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
- [Blooming Grove directory](https://bloominggrovetx.com/businesses/) and [city Local Businesses page](https://www.ci.blooming-grove.tx.us/local-businesses).
- [Visit Corsicana venues](https://visitcorsicana.com/event-venues/) and [Chamber application](https://www.corsicana.org/member/newmemberapp/).
- [Eventective registration](https://www.eventective.com/addlisting), [free-profile limitations](https://support.eventective.com/hc/en-us/articles/30455780412948-Why-should-I-upgrade-my-free-venue-profile), and [PartySlate free-profile entry](https://pro.partyslate.com/view/apply).
- [WeddingAvailability claim process](https://www.weddingavailability.com/list-your-venue).
