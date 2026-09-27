# Gallery interaction direction

Reference reviewed on September 26, 2026: [Filip Z's grid-to-slider CodePen](https://codepen.io/filipz/pen/xbbEbrg). The useful idea is continuity: a selected photograph grows from its place in a grid into a larger viewing experience, with thumbnails keeping the collection close at hand. The demo uses a two-stage height/width expansion and a Grid/Slider switch.

## Adaptation for Happy Trails

- Keep all 21 venue photographs and the existing category filters. Both browsing modes must use the same filtered collection and remember the selected photograph by ID.
- Offer clearly labeled Grid and Slideshow controls in the gallery. Keep the slideshow within the page so the venue information, videos, navigation, and footer remain reachable through ordinary scrolling.
- Use a restrained GSAP transition between the chosen grid photograph and the larger image. Keep captions together and readable; no staggered letters, words, or lines.
- Preserve the warm cream, wine, and espresso palette, existing display/body fonts, and real photograph captions. A modest counter and thumbnail strip provide orientation without adding decorative copy.
- Provide explicit previous/next buttons and a separate enlarge action. Retain the current lightbox's zoom, fullscreen, keyboard navigation, thumbnails, and focus restoration.
- Preserve each complete photograph in the main slideshow where practical, especially portrait images. Cover crops remain suitable for grid thumbnails. Do not stretch a photo during a transition.
- Do not import the demo's fake loading counter, fixed full-page layout, image flashing, or staged text transitions.

## Interaction and accessibility requirements

- Grid is the initial view; all photographs remain discoverable before any interaction. Filters retain pressed states and their live result count.
- Use native buttons with visible focus and comfortable touch targets. Expose the selected mode and active thumbnail programmatically.
- Keep keyboard focus on a stable control when changing modes or filters. When a grid button disappears, deliberately transfer focus to the corresponding slideshow control; returning to the grid should restore the related photograph or mode control.
- Keep slideshow arrow-key handling local to its focused region. Preserve vertical touch scrolling; horizontal swipes may change photographs without preventing page scrolling.
- Make the thumbnail strip horizontally scrollable on narrow screens; do not shrink all 21 thumbnails into the viewport. Controls and captions must fit at 360px width and in landscape orientation.
- Honor reduced motion at load and when the preference changes. The modes and filters must still work with transitions disabled. Avoid autoplay.

## Implementation notes

[GSAP Flip](https://gsap.com/docs/v3/Plugins/Flip/) records an element's geometry before a layout change and animates to the resulting geometry. Capture before React changes the layout, then animate after commit. A dedicated transition layer avoids moving React-owned image nodes between parents. Keep transforms on a wrapper separate from CSS image hover transforms.

[GSAP's React guidance](https://gsap.com/resources/React/) documents automatic cleanup through `useGSAP` and `gsap.context`. Click-created animations need `contextSafe` or explicit cleanup. Settle and clear active animations on unmount, resize, rapid mode/filter changes, and reduced-motion changes. Do not leave a hidden grid, stale fixed layer, or disabled controls after an interruption. Layout changes must also allow the site's existing ScrollTrigger measurements to refresh.

[Yet Another React Lightbox](https://yet-another-react-lightbox.com/documentation) supports slide-index tracking through its view callback. Synchronize the selected ID/index when browsing the enlarged view so reopening does not jump back to an unrelated photo. Its [Inline plugin](https://yet-another-react-lightbox.com/plugins/inline) is an option for an embedded carousel, but any implementation must preserve the current modal's zoom and fullscreen functionality.

## Delivered implementation

`PhotoGallery` keeps the grid and slideshow in the same filtered collection. A photograph's ID follows it through filtering, thumbnail navigation, and the enlarged lightbox. Returning to the grid restores focus to the last viewed photograph. Arrow, Home, End, and Escape keys operate only when focus is within the slideshow image, navigation, or thumbnails. Touch gestures advance horizontally while CSS preserves vertical page scrolling and pinch zoom.

`useGalleryMotion` uses GSAP Flip with a temporary decorative image layer. Expansion takes 0.65 seconds on desktop and 0.42 seconds on phones; changing slides uses a 0.45-second image reveal. Captions do not animate. The hook explicitly removes pending load listeners, animation styles, and the temporary layer on interruption or unmount. Scrolling during expansion immediately restores the real photograph, so the animation cannot trail behind the page.

The selected slideshow photograph uses the existing prepared WebP directly, avoiding another large image transformation when expanding a thumbnail. Grid images and thumbnail images retain responsive Next.js optimization and lazy loading. Portrait and landscape photographs use `object-fit: contain` within the espresso frame; grid thumbnails retain their established crops.

Reduced motion skips gallery transitions and disables lightbox animation, including when the preference changes during a visit. The gallery has no autoplay or new dependencies.

Seven gallery regression tests cover selection continuity, scoped keyboard controls, filter changes, pointer gestures, live reduced motion, rapid input, resizing, history, and scroll interruption. The selected slideshow also receives an automated accessibility scan. See the [validation report](validation/README.md) for results and the [desktop](previews/gallery-slideshow-desktop.png) / [phone](previews/gallery-slideshow-mobile.png) previews.
