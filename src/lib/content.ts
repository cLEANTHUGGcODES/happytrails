import { SITE_URL } from "./site-url";

/** Stable public content contract. Replace the local reads with Supabase in phase two. */
export type MediaItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: "The Barn" | "The Grounds" | "Celebrations" | "Getting Ready";
  width: number;
  height: number;
  featured?: boolean;
  position?: string;
};

export type NewsPost = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  coverImage: MediaItem | null;
  body: string[];
};

export const site = {
  name: "Happy Trails Shindigs & Events",
  shortName: "Happy Trails",
  phone: "903-552-4248",
  phoneHref: "tel:+19035524248",
  email: "admin@happytrailsshindigs.com",
  location: "Blooming Grove, Texas",
  streetAddress: "5281 FM 55",
  postalCode: "76626",
  fullAddress: "5281 FM 55, Blooming Grove, TX 76626",
  // Owner-provided estimate, not a strict booking or occupancy limit.
  guestCapacityEstimate: 75,
  // Owner-confirmed destination; address lookup places the map pin incorrectly.
  coordinates: {
    latitude: 32.068833597034164,
    longitude: -96.69761704124728,
  },
  url: SITE_URL,
  // Owner-confirmed September 27, 2026. Sunday has not been supplied.
  businessHours: {
    label: "Monday–Saturday, 10 a.m.–10 p.m.",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "10:00",
    closes: "22:00",
  },
  // Public profiles supplied by the owner; directory applications are not published profiles.
  profiles: {
    google: "https://share.google/9rQF96KgYlFHWrYcA",
    yelp: "https://www.yelp.com/biz/happy-trails-shindigs-and-events-blooming-grove",
  },
} as const;

const encodedCoordinates = encodeURIComponent(
  `${site.coordinates.latitude},${site.coordinates.longitude}`,
);
export const directions = {
  google: `https://www.google.com/maps/dir/?api=1&destination=${encodedCoordinates}&travelmode=driving`,
  apple: `https://maps.apple.com/?daddr=${encodedCoordinates}&dirflg=d`,
  waze: `https://waze.com/ul?ll=${encodedCoordinates}&navigate=yes`,
} as const;

// Sources: Happy Trails Web menue doc.docx and subsequent owner confirmations.
// Guest capacity is approximate; package inclusions are not inferred.
export const faqs = [
  {
    question: "Where is Happy Trails?",
    answer:
      "Find us at 5281 FM 55, Blooming Grove, TX 76626, on 22 acres in rural Navarro County. The property is south of Blooming Grove, between I-35E and I-45, near State Highways 22 and 31. Get in touch to arrange a visit.",
    relatedLink: { href: "/contact#directions", label: "Map & driving directions" },
  },
  {
    question: "What does a wedding at Happy Trails cost?",
    answer:
      "Weddings start at $3,000. Contact Jennifer and Randy to talk through your plans and receive pricing for your celebration.",
  },
  {
    question: "How many guests can Happy Trails accommodate?",
    answer: `Happy Trails can accommodate approximately ${site.guestCapacityEstimate} guests. Tell Jennifer and Randy about your guest list and plans when you get in touch.`,
  },
  {
    question: "Can we host something other than a wedding?",
    answer:
      "Yes. Happy Trails welcomes birthday parties, family reunions, and other gatherings. Pricing for parties and functions is based on your needs; contact us to discuss your event.",
  },
  {
    question: "Are there places to get ready?",
    answer:
      "The property has a 400-square-foot, Western-inspired bunkhouse for groomsmen, with air conditioning, a mini kitchen, a bathroom, and a large porch. The 400-square-foot grain-bin bridal suite has air conditioning, a bathroom, and a loft with views.",
    relatedLink: {
      href: "/venue#getting-ready",
      label: "Explore the bridal suite and bunkhouse",
    },
  },
  {
    question: "What amenities are available?",
    answer:
      "The venue has a renovated 1,800-square-foot barn, covered outdoor seating, a dance floor with lighting, Wi-Fi, a custom double-tier wet bar with over 30 linear feet of bar top and countertop, a large-screen TV with a soundbar, tables, chairs, linens, ample parking, and a portable arbor with benches. We will help you understand how the spaces can work for your event.",
  },
  {
    question: "Can you help us find local vendors?",
    answer:
      "Depending on what your event needs, Jennifer and Randy can assist you with locating local vendors.",
    relatedLink: { href: "/vendors", label: "Help finding local vendors" },
  },
] as const;

const gallerySeed: readonly MediaItem[] = [
  {
    id: "ceremony-sunset",
    src: "/images/ceremony-sunset.webp",
    alt: "A wooden ceremony arbor and rows of benches on the lawn beneath a pink and orange Texas sunset",
    caption: "A little room for a big moment.",
    category: "The Grounds",
    width: 1448,
    height: 1086,
    featured: true,
    position: "50% 50%",
  },
  {
    id: "barn-tables",
    src: "/images/barn-tables.webp",
    alt: "Tables set with white linens inside the timber barn, with the custom bar beyond",
    caption: "Set the table. Gather your people.",
    category: "The Barn",
    width: 2400,
    height: 1800,
    featured: true,
  },
  {
    id: "celebration",
    src: "/images/celebration.webp",
    alt: "Wedding guests dancing together on the barn’s checkered dance floor",
    caption: "The kind of evening you keep talking about.",
    category: "Celebrations",
    width: 2400,
    height: 1600,
    featured: true,
    position: "50% 55%",
  },
  {
    id: "barn-wide",
    src: "/images/barn-wide.webp",
    alt: "A wide view of the rustic barn with reception tables, exposed rafters, and a checkered dance floor",
    caption: "Rustic charm, with room to make it yours.",
    category: "The Barn",
    width: 2400,
    height: 1800,
    featured: true,
  },
  {
    id: "first-dance",
    src: "/images/first-dance.webp",
    alt: "A bride and groom sharing a dance beneath the barn’s wooden rafters",
    caption: "One dance. A whole new chapter.",
    category: "Celebrations",
    width: 1892,
    height: 2400,
    featured: true,
    position: "50% 55%",
  },
  {
    id: "wedding-dance-floor",
    src: "/images/wedding-dance-floor.webp",
    alt: "A bride and a man in a vest dancing on the checkered floor, with wedding guests nearby",
    caption: "A dance to remember.",
    category: "Celebrations",
    width: 2400,
    height: 1600,
  },
  {
    id: "exterior-wide",
    src: "/images/exterior-wide.webp",
    alt: "The barn, grain-bin suite, and bunkhouse around a green lawn and gravel drive",
    caption: "A view across Happy Trails. Still from our property tour.",
    category: "The Grounds",
    width: 1920,
    height: 1080,
  },
  {
    id: "barn-bar",
    src: "/images/barn-bar.webp",
    alt: "The custom wooden bar and dining tables beside the barn’s checkered dance floor",
    caption: "A gathering place at the heart of the barn.",
    category: "The Barn",
    width: 2400,
    height: 1800,
  },
  {
    id: "barn-details",
    src: "/images/barn-details.webp",
    alt: "White-linen reception tables and wooden chairs beneath the barn’s exposed roof beams",
    caption: "Warm wood, simple details, your celebration.",
    category: "The Barn",
    width: 2400,
    height: 1800,
  },
  {
    id: "bunkhouse",
    src: "/images/bunkhouse.webp",
    alt: "The Western-inspired bunkhouse and its covered porch, with two people seated outside",
    caption: "The bunkhouse porch. Still from our property tour.",
    category: "Getting Ready",
    width: 1920,
    height: 1080,
    featured: true,
  },
  {
    id: "bridal-suite",
    src: "/images/bridal-suite.webp",
    alt: "The grain-bin bridal suite with corrugated metal walls, vintage furnishings, and a decorative folding screen",
    caption: "Something a little unexpected. Still from our property tour.",
    category: "Getting Ready",
    width: 1920,
    height: 1080,
  },
  {
    id: "the-hosts",
    src: "/images/the-hosts.webp",
    alt: "Four people, including a bride and groom, posing together at the Happy Trails bar",
    caption: "Good company at the Happy Trails bar.",
    category: "Celebrations",
    width: 2400,
    height: 1600,
  },
  {
    id: "hospitality",
    src: "/images/hospitality.webp",
    alt: "Two smiling women standing beside the wooden bar beneath the Happy Trails sign",
    caption: "A warm welcome, a familiar smile.",
    category: "Celebrations",
    width: 2400,
    height: 1600,
  },
  {
    id: "reception-bar-guests",
    src: "/images/reception-bar-guests.webp",
    alt: "Two women posing with drinks behind the rustic wooden bar and its Western decorations",
    caption: "Good company behind the bar.",
    category: "Celebrations",
    width: 2400,
    height: 1600,
  },
  {
    id: "evening-dance",
    src: "/images/evening-dance.webp",
    alt: "A bride and wedding guests dancing in the barn under warm string lights",
    caption: "Keep the good times going.",
    category: "Celebrations",
    width: 2400,
    height: 1600,
  },
  {
    id: "food-and-friends",
    src: "/images/food-and-friends.webp",
    alt: "A colorful reception spread of fruit, cheese, and snacks arranged inside the barn",
    caption: "A reception full of thoughtful touches.",
    category: "Celebrations",
    width: 2400,
    height: 1600,
  },
  {
    id: "barn-dance-floor",
    src: "/images/barn-dance-floor.webp",
    alt: "The barn’s checkered dance floor beside reception tables and wooden walls",
    caption: "Room for a little two-step.",
    category: "The Barn",
    width: 2400,
    height: 1800,
  },
  {
    id: "barn-reception-view",
    src: "/images/barn-reception-view.webp",
    alt: "Round reception tables set with white linens beneath exposed wooden beams",
    caption: "A place for everyone to gather.",
    category: "The Barn",
    width: 2400,
    height: 1800,
  },
  {
    id: "barn-bar-view",
    src: "/images/barn-bar-view.webp",
    alt: "A view from behind the barn bar across the checkered dance floor and reception tables",
    caption: "A look across the barn.",
    category: "The Barn",
    width: 2400,
    height: 1800,
  },
  {
    id: "barn-reception-tables",
    src: "/images/barn-reception-tables.webp",
    alt: "Rows of reception tables with white linens, place settings, and wooden chairs inside the barn",
    caption: "The tables are set.",
    category: "The Barn",
    width: 2400,
    height: 1800,
  },
  {
    id: "parking",
    src: "/images/parking.webp",
    alt: "An aerial view of the gravel parking area beside the barn and grain-bin suite",
    caption: "Arrive, settle in, and enjoy the day.",
    category: "The Grounds",
    width: 983,
    height: 553,
  },
];

// Publish only owner-approved updates. Empty is intentional; no placeholder announcements.
const newsSeed: readonly NewsPost[] = [];

export async function getGallery(): Promise<MediaItem[]> {
  return gallerySeed.map((item) => ({ ...item }));
}

export async function getFeaturedMedia(): Promise<MediaItem[]> {
  return (await getGallery()).filter((item) => item.featured);
}

// Stable display slots let a later admin change featured images without changing page code.
const mediaSlots = {
  hero: "ceremony-sunset",
  barn: "barn-wide",
  grounds: "exterior-wide",
  bridalSuite: "bridal-suite",
  bunkhouse: "bunkhouse",
  celebration: "celebration",
  firstDance: "first-dance",
  story: "the-hosts",
} as const;
export type MediaSlot = keyof typeof mediaSlots;

export async function getSiteMedia(slot: MediaSlot): Promise<MediaItem> {
  const item = (await getGallery()).find((media) => media.id === mediaSlots[slot]);
  if (!item) throw new Error(`Missing website media for slot: ${slot}`);
  return item;
}

export async function getUpdates(): Promise<NewsPost[]> {
  return newsSeed.map((post) => ({ ...post, body: [...post.body] }));
}

export async function getUpdate(slug: string): Promise<NewsPost | undefined> {
  return (await getUpdates()).find((post) => post.slug === slug);
}
