# Happy Trails location map

The owner supplied **5281 FM 55, Blooming Grove, TX** in this conversation on September 26, 2026. That address drives public contact details, FAQ, footer, and structured venue address. The owner subsequently corrected the navigation pin to **32.068833597034164, -96.69761704124728**. Google Maps, Apple Maps, and Waze directions now use those exact coordinates through `src/lib/content.ts`, avoiding the incorrect address lookup. Structured venue data also includes the confirmed coordinates.

## Published assets

- `public/images/happy-trails-map.webp`: optimized website illustration, 1310 × 1201 pixels, approximately 191 KB.
- `public/images/happy-trails-map.png`: full-quality downloadable illustration, approximately 2.2 MB. Loaded only when opened or downloaded; the page uses responsive WebP through Next Image.
- `src/components/venue-location.tsx`: accessible location section with text address, three map-app links, full-size image view, download, and attribution.

## Geographic reference

- Owner-provided street address is the source of truth. ZIP 76626 was corroborated by public address matching.
- The original ArcGIS World Geocoding Service match was longitude -96.697523564425 / latitude 32.069630390997. This is superseded for navigation by the owner's exact coordinates above. The existing illustration was generated from that earlier reference, approximately 89 metres north of the corrected point, and remains an approximate local orientation guide; its artwork has not been repositioned. It does not identify a surveyed driveway entrance.
- `roads.json` preserves the OpenStreetMap road geometry retrieved via Overpass on September 26, 2026. Query: `[out:json][timeout:25];way[highway][ref~"^(FM 55|22|31|TX 22|TX 31)$"](32.00,-96.83,32.14,-96.59);out geom;`.
- `location-reference.svg` is the geographically positioned composition used for image generation. It shows FM 55 and Highway 22 around Blooming Grove; bounds are west -96.738, east -96.667, south 32.047, north 32.113. North is up.
- [OpenStreetMap attribution and license](https://www.openstreetmap.org/copyright) are linked beside the published map. The generated illustration preserves the principal road relationships and venue position from that reference, with decorative trees, fields, and a barn illustration. It is a local orientation guide, not a surveyed site plan or turn-by-turn navigation map.

## Image generation

Created using the built-in imagegen tool and the geographic reference above. Direction: warm ivory paper, muted sage watercolor fields, espresso labels, burgundy venue marker, restrained Texas wedding-stationery illustration. The illustration is stored in the project, independent of the tool's output directory. Its optimized WebP was encoded with Sharp at quality 90 without changing the composition.

Checked the generated labels and relative road/pin positions against the reference. The visible caption sends visitors to their map app for turn-by-turn directions; the address is also accessible as ordinary text outside the illustration. No third-party map iframe or geolocation permission is needed to view the Contact page.

All three links pass the same URL-encoded latitude/longitude pair: Google uses `destination` with `api=1&travelmode=driving` ([Google Maps URLs](https://developers.google.com/maps/documentation/urls/get-started)), Apple uses `daddr` with `dirflg=d` ([Apple Map Links](https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html)), and Waze uses `ll` with `navigate=yes` ([Waze deep links](https://developers.google.com/waze/deeplinks)). App handoff depends on the visitor’s device configuration; the website remains available when the app is not installed.
