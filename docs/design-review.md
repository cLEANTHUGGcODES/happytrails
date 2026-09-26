# Design and content-density review

Review started September 26, 2026 in response to the owner's concern that the site felt too white and empty. The aim is a more engaging wedding and event venue website on desktop and mobile: stronger photography, easier comparison of spaces, useful planning information, and less scrolling through repeated introductory copy.

This document records the benchmark findings, baseline, and implementation direction. Final measurements and validation results appear below. Local checks do not establish deployment or owner acceptance.

## Benchmark method

Three current official venue websites were examined for section order, photography, information density, navigation, and inquiry actions:

| Reference | Pages reviewed | Useful observations |
| --- | --- | --- |
| Cedar Lakes Estate | [Homepage](https://www.cedarlakesestate.com/) and [Weddings](https://www.cedarlakesestate.com/weddings) | Large property imagery, distinct background colors, photographs paired with named spaces and concrete characteristics, family story, property map, and contextual planning links. |
| Camp Lucy | [Weddings](https://www.camplucy.com/weddings/) and [Wedding venues](https://www.camplucy.com/weddings/venues/) | A visual wedding introduction, a composition of event photographs, a clear account of the experience, practical FAQs, and planning actions. |
| The Addison Grove | [Homepage](https://www.theaddisongrove.com/) and [Venue experience](https://www.theaddisongrove.com/the-addison-grove-experience) | Venue specifications near photographs, prominent tour inquiries, image categories for different parts of an event, and a mix of pale, sage, and dark sections. |

The research combined the pages' published content with browser inspection at 1440-pixel desktop and 390-pixel mobile widths. Additional mobile views used an emulated phone user agent and touch configuration. This is browser emulation, not a physical iPhone or Android test. Competitor reference screenshots were temporary local research artifacts and are not included in this repository; third-party photography was not copied into the application.

Some initial full-page reference screenshots omitted content that appeared only after scrolling or contained unloaded embedded galleries. Follow-up viewport screenshots were used to inspect those sections. Consequently, competitor page heights and apparent blank areas in those initial captures were not used as comparative quality scores.

These sites are useful established design references, not an objective ranking of the world's best venues. Their property sizes, accommodation offerings, service models, reviews, and awards differ from Happy Trails. The review borrows presentation patterns, not their business claims or visual assets.

## Findings and decisions

The central issue is the relationship between useful content and the space around it. Large margins can support an elegant photograph or a clear decision. Repeating them around short, similar introductions makes the page feel sparse without helping the visitor.

The reviewed sites most consistently combine emotional imagery with information about a specific place or event. The design direction for Happy Trails follows that pattern:

| Finding | Decision for Happy Trails |
| --- | --- |
| Strong venue photography establishes a sense of place immediately. | Use a broad photo-led hero with a concise wedding and event introduction, location, and tour action. Preserve a readable text treatment across image crops and screen sizes. |
| Useful specifications make a short section feel substantial. | Place four confirmed facts near the beginning: 22 acres, a 1,800-square-foot barn, two getting-ready spaces, and weddings starting at $3,000. |
| Several introductions can repeat the same emotional promise. | Consolidate the welcome and spaces introduction, and give space cards practical information alongside their warmer copy. |
| Different backgrounds help distinguish the next part of the story. | Use restrained cream, sage, and espresso sections with real imagery. Tighten section boundaries rather than filling gaps with ornament. |
| Visitors need practical next steps as well as a gallery. | Bring Pricing, Vendors, and Directions into the homepage planning journey. Keep tour and inquiry links near the information that motivates them. |
| Interior pages should get to their main purpose promptly. | Use a more compact split page introduction, venue section anchors, quick contact links, and an owner-story quotation within the reading flow. |
| A full-height closing invitation adds substantial scroll without adding much information. | Use a compact dark closing call to action with clear contact choices. |
| A single-column photo grid can become unusually long on a phone. | Use two mobile gallery columns with a visible tour shortcut; retain full-size viewing through the accessible lightbox. |

The homepage sequence should help a visitor understand the venue, see its spaces, imagine a celebration, assess starting price and planning options, meet the hosts, and find the next action. It should not become longer merely to add more section headings.

## Baseline measurements

The local implementation was measured before this design revision. Values below are document or component heights in CSS pixels, not loading times or accessibility scores. Desktop viewport width was 1440 pixels; mobile width was 390 pixels.

| Page or component | Desktop height | Mobile height |
| --- | ---: | ---: |
| Homepage | 5,034 px | 6,048 px |
| Venue page | 5,456 px | 5,514 px |
| Gallery page | 4,476 px | 7,757 px |
| Shared page introduction | 432 px | Not recorded |
| Shared closing call to action | 498 px | Not recorded |

The original common desktop section padding was 108 pixels above and below a section. These baseline measurements identify where excessive spacing may accumulate. A shorter page is not automatically a better page: the comparison must also confirm that content, image access, and useful actions remain available.

## Content and image guardrails

- The team's Word brief and subsequent owner corrections remain the source of venue facts. The [team brief audit](team-brief-audit.md) tracks requirement coverage; `ideas.md` does not independently establish venue policies or specifications.
- Use the existing venue photographs and documented video stills. Preserve their subject and source meaning. The AI-labelled portrait remains excluded from the published photo collection.
- Label getting-ready rooms as getting-ready spaces; the brief does not establish an overnight accommodation offering. Two such spaces does not imply two accommodation units or a sleeping capacity.
- Keep the wedding price qualified as **starting at $3,000**. Listing amenities near pricing must not imply that every amenity or service is included in every booking.
- Retain the confirmed address, illustrated location guide, and Google Maps, Apple Maps, and Waze directions. The illustration supports finding the area; map applications provide turn-by-turn routing.
- Do not invent testimonials, awards, guest capacity, included catering, vendor policies, guaranteed weather alternatives, availability, travel times, or exclusive-use terms to imitate a larger venue.
- Keep all six requested public-site destinations discoverable: About/Our Story, Amenities/The Venue, Gallery, Vendors, Pricing, and Contact. Preserve the separately requested public News structure without fabricating posts.

## Readability and interaction guardrails

- Reduce padding before reducing body text size. Maintain comfortable line lengths, readable contrast, visible focus styles, and generous touch targets.
- On mobile, ensure that a visitor encounters a meaningful image, fact, or action regularly without turning every image into a screen-height obstacle. Check text wrapping and photo crops at narrow widths as well as desktop.
- Preserve semantic headings, image alternatives, keyboard navigation, menu focus handling, gallery controls, and form labels. Links styled as cards must keep a clear destination.
- Keep the full-size gallery and property tours available. A denser thumbnail layout must not prevent seeing photo details; the tour shortcut must lead to the existing player.
- Retain reduced-motion support and load property videos only after the visitor requests playback. Added visual emphasis must not depend on autoplay video or animation.
- Check that the photo hero remains legible and meaningful while its image loads, and that changing its crop does not hide the relevant venue subject.

## Validation approach

Compare the revised local pages with the recorded baseline at the same viewport widths. Inspect the rendered results after images have loaded, including the homepage, venue, gallery, pricing, story, vendors, and contact. Confirm that smaller gaps have not created crowded text, cropped controls, overlapping sections, or horizontal overflow.

Functional verification should cover navigation, venue anchors, the gallery filters and lightbox, the tour shortcut and playback, inquiry behavior, and the directions links using owner-confirmed coordinates. Build, lint, applicable automated tests, and browser accessibility checks provide supporting evidence. None of those substitutes for physical-device testing, deployed performance measurements, or the owner's design approval.



## Implemented result

The final local production build uses a photographic hero, a compact four-fact summary, factual space cards, a consolidated welcome, and a planning section linking pricing, local vendors, and directions. The common introduction now pairs its title with introductory copy on desktop. The closing invitation is a compact espresso section. The Venue jump links form a two-column phone grid. News navigation appears once an approved update exists; the public news routes and content data adapter remain in place for the future admin portal.

| Page | Desktop before → after | Mobile before → after |
| --- | ---: | ---: |
| Home | 5,034 → 3,890 px (23% shorter) | 6,048 → 5,142 px (15% shorter) |
| Venue | 5,456 → 4,304 px (21% shorter) | 5,514 → 5,196 px (6% shorter) |
| Gallery | 4,476 → 4,002 px (11% shorter) | 7,757 → 3,757 px (52% shorter) |
| Pricing | 2,649 → 2,126 px (20% shorter) | 3,366 → 3,000 px (11% shorter) |
| Our Story | 2,413 → 1,781 px (26% shorter) | 2,805 → 2,475 px (12% shorter) |
| Vendors | 2,257 → 1,603 px (29% shorter) | 2,506 → 2,133 px (15% shorter) |
| Contact | 2,907 → 2,734 px (6% shorter) | 4,124 → 3,935 px (5% shorter) |

A typical desktop page introduction changed from 432 to 267 pixels, and the shared closing invitation from 498 to 294 pixels. These numbers measure document/component height, not a percentage of blank pixels removed. Mobile Gallery retains all 15 photographs; its reduction comes primarily from two-column thumbnails, with the lightbox preserving full-size viewing. All original owner-brief amenities remain on Venue.

## Completed checks

- Final production build and lint passed; TypeScript passed in the build.
- Final local Lighthouse: desktop 100 performance, mobile 92; accessibility, best practices, and SEO 100 in both profiles. Mobile LCP is 3.4 seconds, still above the 2.5-second target. See the validation record for reports and measurement limits.
- All 33 browser tests passed, including eight automated WCAG A/AA scans, six homepage widths, photo filters/lightbox, mobile menu focus, deferred video loading, and inquiry error behavior.
- Independently inspected Venue, Pricing, Story, Vendors, and Contact at desktop and phone widths. No clipped headings, overlapping content, broken photographs, or horizontal overflow were found.
- Independently reviewed the Gallery at 360/390/768/1440 pixels: all 15 photos loaded, captions remained readable, filters/lightbox worked, and the tour shortcut reached the player.
- Measured all seven principal pages at 1440 and 390 pixels after loading fonts and photographs: no horizontal overflow. The original photos, venue facts, and full photo collection are retained.
- Inquiry delivery, deployment, physical-device checks, and Supabase administration remain outside this local design verification.

## Review the changes

- [Homepage before — desktop](previews/before-home-desktop.png) / [after — desktop](previews/home-desktop.png)
- [Homepage before — phone](previews/before-home-mobile.png) / [after — phone](previews/home-mobile.png)
- [Gallery on a phone](previews/gallery-mobile.png)
- [Pricing](previews/pricing-desktop.png) / [Venue](previews/venue-desktop.png) / [Contact](previews/contact-mobile.png)
- [Current validation and performance record](validation/README.md)

## Remaining visual opportunity

Dedicated photographs of the bridal suite and bunkhouse would improve the finish further. Their current images are genuine frames from the supplied property video and are visibly softer than the still photographs, especially on desktop. They were retained as truthful views of the spaces. Future owner-approved testimonials and real published updates would add useful evidence; they are not replaced with invented content.
