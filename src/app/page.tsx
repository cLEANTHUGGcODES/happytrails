import { ContentImage } from "@/components/content-image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { ButtonLink, ContactCta } from "@/components/ui";
import { VideoTour } from "@/components/video-tour";
import { getUpdates, site, type MediaSlot } from "@/lib/content";
import { createPageMetadata, getSiteStructuredData } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const metadata = createPageMetadata({
  title: "Wedding & Event Venue in Blooming Grove, TX",
  description:
    "Celebrate at Happy Trails, a barn wedding and event venue on 22 acres in Blooming Grove, Texas. Space for approximately 75 guests. Request a tour.",
  path: "/",
});

const spaces = [
  {
    n: "01",
    title: "The Barn",
    copy: `A restored horse barn with a lit dance floor, custom wet bar, and covered outdoor seating. Happy Trails welcomes approximately ${site.guestCapacityEstimate} guests.`,
    slot: "barn" as MediaSlot,
    href: "/venue#the-barn",
    label: "1,800 square feet · The reception",
  },
  {
    n: "02",
    title: "The Great Outdoors",
    copy: "Rolling countryside, open views, and a portable arbor with benches for your ceremony.",
    slot: "grounds" as MediaSlot,
    href: "/venue#the-grounds",
    label: "22 acres · The setting",
  },
  {
    n: "03",
    title: "The Getting-Ready Spaces",
    copy: "A grain-bin bridal suite and Western-inspired bunkhouse, each with air conditioning and a bathroom.",
    slot: "bridalSuite" as MediaSlot,
    href: "/venue#getting-ready",
    label: "Two 400-square-foot spaces · Getting ready",
  },
];

export default async function HomePage() {
  const updates = await getUpdates();
  return (
    <>
      <JsonLd data={getSiteStructuredData()} />
      <section className="hero" aria-labelledby="hero-title" data-motion-hero>
        <div className="hero-photo">
          <ContentImage
            slot="hero"
            fill
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
            className="cover"
          />
        </div>
        <div className="hero-shade" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">
              <MapPin size={14} aria-hidden="true" /> Blooming Grove, Texas
            </p>
            <h1 id="hero-title">
              Big skies.
              <br />
              Full hearts.
              <br />
              <em>Happy trails.</em>
            </h1>
            <p className="hero-description">
              A family-owned wedding and event venue on 22 acres of Texas countryside. A place for
              your people, and a day that feels like you.
            </p>
            <div className="hero-actions">
              <Link className="button button-light" href="/contact" prefetch={false}>
                Request a Tour <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link className="text-link" href="/gallery">
                Take a Look Around <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <span className="hero-photo-caption">The ceremony lawn, just before sunset.</span>
        </div>
      </section>
      <dl className="venue-facts container" aria-label="Happy Trails at a glance">
        <div>
          <dt>The setting</dt>
          <dd>
            22 <span>acres</span>
          </dd>
        </div>
        <div>
          <dt>The barn</dt>
          <dd>
            1,800 <span>sq ft</span>
          </dd>
        </div>
        <div>
          <dt>Approximately</dt>
          <dd>
            {site.guestCapacityEstimate} <span>guests</span>
          </dd>
        </div>
        <div>
          <dt>Weddings from</dt>
          <dd>$3,000</dd>
        </div>
      </dl>
      <section className="section spaces-section" aria-labelledby="spaces-heading">
        <div className="container">
          <div className="section-heading spaces-heading" data-motion="reveal">
            <div>
              <p className="eyebrow">Welcome to Happy Trails</p>
              <h2 id="spaces-heading">
                Spaces for <em>your story.</em>
              </h2>
            </div>
            <div className="spaces-intro">
              <p>
                From getting ready to the last dance, get to know the places that make a day here
                your own.
              </p>
              <Link className="text-link" href="/venue">
                Explore the Venue <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="space-grid">
            {spaces.map((space) => (
              <Link
                href={space.href}
                key={space.n}
                className="space-card"
                aria-labelledby={`space-title-${space.n}`}
              >
                <div className="space-image" data-motion="image">
                  <ContentImage
                    slot={space.slot}
                    fill
                    sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    className="cover"
                  />
                  <span className="space-number" aria-hidden="true">{space.n}</span>
                  <span className="space-arrow">
                    <ArrowUpRight size={22} aria-hidden="true" />
                  </span>
                </div>
                <p className="eyebrow">{space.label}</p>
                <h3 id={`space-title-${space.n}`}>{space.title}</h3>
                <p>{space.copy}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section
        className="section container celebration-section"
        aria-labelledby="celebration-heading"
      >
        <div className="celebration-images">
          <div className="celebration-main" data-motion="image">
            <ContentImage
              slot="celebration"
              fill
              sizes="(max-width: 760px) 90vw, 43vw"
              className="cover"
            />
          </div>
          <div className="celebration-inset" data-motion="image">
            <ContentImage
              slot="firstDance"
              fill
              sizes="(max-width: 760px) 40vw, 20vw"
              className="cover"
            />
          </div>
          <span className="photo-scribble">the good stuff.</span>
        </div>
        <div className="celebration-copy" data-motion="reveal">
          <p className="eyebrow">Weddings. Reunions. Just-because gatherings.</p>
          <h2 id="celebration-heading">
            The best memories <br />
            are the ones <br />
            <em>you feel.</em>
          </h2>
          <p>
            Gather beneath big Texas skies, celebrate in the barn, and head home with full hearts.
            Happy Trails welcomes wedding receptions, milestone birthdays, and long-awaited family
            reunions.
          </p>
          <ul className="celebration-types" aria-label="Celebrations at Happy Trails">
            <li>Weddings</li>
            <li>Birthdays</li>
            <li>Family reunions</li>
          </ul>
          <ButtonLink href="/gallery" secondary>
            Explore the Gallery
          </ButtonLink>
        </div>
      </section>
      <section className="investment-band">
        <div className="container investment-inner">
          <div data-motion="reveal">
            <p className="eyebrow">Start planning your celebration</p>
            <h2>
              Weddings <em>from $3,000.</em>
            </h2>
            <p>
              Tell us what you have in mind. Other parties and gatherings are quoted for your
              particular plans.
            </p>
          </div>
          <div className="planning-links">
            <Link href="/pricing">
              <span>
                <strong>Pricing & FAQs</strong>
                <small>Starting prices, amenities, and useful details.</small>
              </span>
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
            <Link href="/vendors">
              <span>
                <strong>A little local help</strong>
                <small>Ask us about finding vendors for your event.</small>
              </span>
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
            <Link href="/contact#directions" prefetch={false}>
              <span>
                <strong>Find your way here</strong>
                <small>{site.fullAddress}</small>
              </span>
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section className="section container story-preview">
        <div className="story-intro" data-motion="reveal">
          <p className="eyebrow">The heart behind Happy Trails</p>
          <h2>
            A place built on
            <br />
            <em>a love story.</em>
          </h2>
          <p>
            After 43 years, Jennifer and Randy found their way back to each other. A shared love of
            bringing people together became something more: a place to celebrate life’s happiest
            chapters.
          </p>
          <Link className="text-link" href="/our-story">
            Meet Jennifer & Randy <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="story-tour">
          <VideoTour />
        </div>
      </section>
      {updates.length > 0 && (
        <section className="section container">
          <div className="section-heading" data-motion="reveal">
            <div>
              <p className="eyebrow">A little news from Happy Trails</p>
              <h2>
                What’s <em>happening.</em>
              </h2>
            </div>
            <Link className="text-link" href="/news">
              All Updates <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="news-grid">
            {updates.slice(0, 3).map((post) => (
              <article key={post.id}>
                <p className="eyebrow">
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "UTC",
                  })}
                </p>
                <h3>
                  <Link href={`/news/${post.slug}`}>{post.title}</Link>
                </h3>
                <p>{post.summary}</p>
              </article>
            ))}
          </div>
        </section>
      )}
      <ContactCta />
    </>
  );
}
