# Scroll motion

The motion takes its visual cue from GreenSock's [layered section demo](https://codepen.io/GreenSock/pen/XWzRraJ): framed photographs open and settle into place as visitors move down the page. Happy Trails uses native scrolling and GSAP ScrollTrigger to fit the site's varied section lengths and practical planning content.

The owner specifically requested **no staggered text**. Headings and copy remain intact; selected editorial blocks move together at full opacity. There is no letter, word, or line splitting.

## Placement

- Home: gentle desktop hero-photo movement, framed space-card photographs, the celebration collage, and whole-block entrances for planning and story copy.
- Venue, Story, and Vendors: framed photographs and adjacent editorial blocks.
- Pricing and shared page components: whole-block entrances for below-the-fold copy.
- Navigation, inquiry fields, gallery controls, directions links, and CTA actions remain directly available. The header and gallery/lightbox containers are not transformed.

## Behavior

- Content is visible in server-rendered HTML and remains readable with JavaScript disabled. Content already visible when motion initializes stays visible immediately.
- Photo entrances use a modest vertical mask and image movement. Phones use shorter, smaller movements; desktop alone receives hero parallax.
- Entrances complete once while scrolling a page. Keyboard focus and fragment navigation immediately finish relevant entrances.
- Live `prefers-reduced-motion` changes revert GSAP motion. The existing reduced-motion CSS also disables smooth anchor scrolling.
- Route changes clean up animations, event listeners, and observers. Gallery filtering, FAQ expansion, and font loading refresh the scroll positions after active scrolling has settled.
- The root HTML declares `data-scroll-behavior="smooth"` so Next.js can coordinate cross-page fragment navigation with the existing smooth-scroll CSS. See [Next.js smooth-scroll integration](https://nextjs.org/docs/messages/missing-data-scroll-behavior).
- Image transforms are released after the entrance so existing hover behavior remains available.

Implementation lives in `src/components/scroll-animations.tsx`, with opt-in `data-motion="image"` and `data-motion="reveal"` annotations on the existing markup. `useGSAP` owns cleanup; `gsap.matchMedia` owns responsive and reduced-motion conditions. See the official [React integration](https://gsap.com/resources/React/), [matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/), and [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) documentation.

The regression cases in `tests/scroll-motion.spec.ts` exercise native scrolling, reduced motion, no JavaScript, keyboard focus, fragment navigation, route history, gallery filtering, and FAQ expansion. See the [validation record](validation/README.md) for completed checks.
