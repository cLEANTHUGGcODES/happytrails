# Happy Trails media and content inventory

The original root assets are retained unchanged in the owner's local workspace and excluded from Git. The gallery publishes all 18 original venue/event photographs plus three clearly identified stills from the supplied property tours, for 21 images in total. The logo is used separately as branding; the AI-labelled portrait remains excluded.

## Rebuild derivatives

The prepared files in `public/` are included in the repository; a normal website build does not run this script or require Python. To recreate derivatives, first restore the original source assets listed below to the project root, then run:

```bash
uv run --with pillow --with pillow-heif --with imageio-ffmpeg scripts/prepare_media.py
```

Use `--images-only` to skip video encoding. The script writes only to `public/images` and `public/videos`. It normalizes orientation, removes source EXIF and GPS metadata, fits photographs within 2,400 × 2,400 pixels without upscaling, and exports WebP at quality 86. The original transparent logo is preserved as an optimized RGBA PNG. Videos are encoded as 1,280 × 720 H.264/AAC MP4, CRF 26, with the `moov` atom before media data for progressive playback.

## Published images

| Output in `public/images` | Source                         | Dimensions  | Purpose                                                       |
| ------------------------- | ------------------------------ | ----------- | ------------------------------------------------------------- |
| `logo.png`                | `HT Logo.PNG`                  | 1774 × 887  | Existing red-and-black logo; use on a light background        |
| `ceremony-sunset.webp`    | `arbor and benches sunset.PNG` | 1448 × 1086 | Ceremony hero and grounds gallery                             |
| `barn-tables.webp`        | `IMG_5659.HEIC`                | 2400 × 1800 | Reception tables                                              |
| `barn-wide.webp`          | `IMG_5660.HEIC`                | 2400 × 1800 | Wide barn interior                                            |
| `barn-bar.webp`           | `IMG_5658.HEIC`                | 2400 × 1800 | Bar and dance floor                                           |
| `barn-details.webp`       | `IMG_5656.HEIC`                | 2400 × 1800 | Barn seating detail                                           |
| `barn-dance-floor.webp`   | `IMG_5657.HEIC`                | 2400 × 1800 | Dance floor and reception tables                              |
| `barn-reception-view.webp` | `IMG_5661.HEIC`               | 2400 × 1800 | Reception tables beneath exposed beams                        |
| `barn-bar-view.webp`      | `IMG_5662.HEIC`                | 2400 × 1800 | View across the barn from behind the bar                       |
| `barn-reception-tables.webp` | `IMG_5663.HEIC`             | 2400 × 1800 | Another view of reception place settings                       |
| `celebration.webp`        | `IMG_6415.jpeg`                | 2400 × 1600 | Guests dancing                                                |
| `first-dance.webp`        | `IMG_6330.jpeg`                | 1892 × 2400 | Bride and groom dancing                                       |
| `reception-bar-guests.webp` | `IMG_6307.jpeg`              | 2400 × 1600 | Two guests at the bar                                          |
| `wedding-dance-floor.webp` | `IMG_6465.jpeg`               | 2400 × 1600 | Wedding dance-floor moment                                    |
| `the-hosts.webp`          | `IMG_6447.jpeg`                | 2400 × 1600 | Four-person reception group; caption describes the group      |
| `hospitality.webp`        | `IMG_6424.jpeg`                | 2400 × 1600 | Reception at the bar                                          |
| `evening-dance.webp`      | `IMG_6502.jpeg`                | 2400 × 1600 | Dancing beneath string lights                                 |
| `food-and-friends.webp`   | `IMG_6114.jpeg`                | 2400 × 1600 | Example reception food display; no catering inclusion implied |
| `parking.webp`            | `HT parking edit1.jpg`         | 983 × 553   | Parking context; retain modest display size                   |
| `exterior-wide.webp`      | Full tour, 8.4 seconds         | 1920 × 1080 | Clean drone view of the property and grounds                  |
| `tour-poster.webp`        | Full tour, 8.4 seconds         | 1920 × 1080 | Poster matching exterior view                                 |
| `bunkhouse.webp`          | Full tour, 68 seconds          | 1920 × 1080 | Clean exterior frame without baked-in title text              |
| `bridal-suite.webp`       | Full tour, 56.2 seconds        | 1920 × 1080 | Interior suite frame with vintage furnishings                 |

The exterior frame retains the full 16:9 source image. It comes from the brief clean drone sequence after the opening logo and before the close-up of the owners; no title overlays or foreground people are present. Suite frames are limited by the source video’s motion and compression, and dedicated still photographs should replace them when available.

The owner requested complete photo coverage after the initial curated gallery. The six previously omitted photographs (`IMG_5657`, `IMG_5661`, `IMG_5662`, `IMG_5663`, `IMG_6307`, and `IMG_6465`) are now included. The owner confirmed that the reference to “6545” meant `IMG_6465.jpeg`. The 20 original still assets comprise eight HEIC photographs, eight reception JPEGs, a parking JPG, a sunset PNG, the transparent logo, and the AI-labelled PNG. There are no exact SHA-256 duplicates among those originals. All 18 venue/event photo sources map to gallery entries; the three additional gallery items are the exterior, bunkhouse, and bridal-suite video stills. The identical exterior and tour-poster derivatives appear only once in the gallery.

## Videos

| Output in `public/videos` | Source                       | Duration | Bytes      |
| ------------------------- | ---------------------------- | -------- | ---------- |
| `property-tour.mp4`       | `ht video short version.mp4` | 44.14 s  | 9,165,302  |
| `full-property-tour.mp4`  | `HT Video 1.mp4`             | 82.57 s  | 14,881,097 |

Combined video output is 24,046,399 bytes, below the 30 MB target; originals total 101,673,485 bytes. Keep playback user-initiated with `preload="none"` so video weight is not part of initial page loading. Original editing, title overlays, and audio are retained. Both outputs were inspected for H.264 `yuv420p`, AAC audio, 30 fps, and fast-start MP4 structure.

## Business content provenance

`Happy Trails Web menue doc.docx` is the initial source for the owner story, location, contact information, venue sizes, amenities, vendor assistance, and starting wedding price. `src/lib/content.ts` provides stable `MediaItem` and `NewsPost` interfaces, asynchronous read functions, descriptive alt text, and the initial site information and FAQs. News intentionally starts empty: there are no invented announcements or publish dates.

Subsequent owner confirmations supply the exact address and an estimated capacity of approximately 75 guests. These details are stored in `site` in `src/lib/content.ts`; the capacity is an estimate, not an exact maximum. The owner's estimate supersedes the unapproved 125-guest suggestion in `ideas.md`.

Do not infer availability, booking terms, catering/alcohol rules, or package inclusions. The bridal and groomsmen quarters are described as preparation spaces; overnight accommodation is not established by the brief. Exact owner identities should not be inferred from a group photograph. The supplied filename `the-hosts.webp` is retained for the implementation contract, but its alt text and gallery caption identify only a reception group.

The remaining written inputs (`ideas.md`, `modernbuild.md`, and `photogallery.md`) establish visual and interaction direction. They are design references, not additional business facts.
