import type { Metadata } from "next";
import { ContentImage } from "@/components/content-image";
import { Check } from "lucide-react";
import { PageIntro, ContactCta, ButtonLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "The Venue",
  description:
    "Explore our 1,800-square-foot rustic barn, open grounds, bunkhouse, and grain-bin bridal suite on 22 acres in Blooming Grove, Texas.",
  alternates: { canonical: "/venue" },
};

function Amenities({ items }: { items: string[] }) {
  return (
    <ul className="amenity-list">
      {items.map((item) => (
        <li key={item}>
          <Check size={14} aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function VenuePage() {
  return (
    <>
      <PageIntro
        eyebrow="Welcome to our little corner of Texas"
        title={
          <>
            A place to gather.
            <br />
            <em>Room to make it yours.</em>
          </>
        }
      >
        <p>
          Twenty-two acres, a barn full of character, and open countryside. Come see where your
          celebration could take you.
        </p>
      </PageIntro>
      <nav className="container venue-jumpnav" aria-label="Explore the venue spaces">
        <a href="#the-barn">The Barn</a>
        <a href="#the-grounds">The Grounds</a>
        <a href="#getting-ready">Bridal Suite</a>
        <a href="#the-bunkhouse">The Bunkhouse</a>
      </nav>
      <div className="container wide-photo" data-motion="image">
        <ContentImage slot="grounds" fill sizes="100vw" priority className="cover" />
      </div>
      <section id="the-barn" className="section container venue-story">
        <div className="venue-story-image" data-motion="image">
          <ContentImage slot="barn" fill sizes="(max-width:760px) 100vw, 50vw" className="cover" />
        </div>
        <div className="venue-story-copy" data-motion="reveal">
          <p className="eyebrow">01 / The heart of the celebration</p>
          <h2>
            The Barn.
            <br />
            <em>Let the good times in.</em>
          </h2>
          <p>
            Once a horse barn, now a place for your favorite people. Our renovated 1,800-square-foot
            barn keeps its warm timber character, with space to dine, dance, and settle into a
            memorable evening.
          </p>
          <Amenities
            items={[
              "Dance floor with lighting",
              "Covered outdoor seating",
              "Custom double-tier wet bar with over 30 linear feet of bar top and countertop",
              "Wi-Fi with internet access",
              "TV and soundbar",
              "Tables, chairs, and linens",
            ]}
          />
        </div>
      </section>
      <div className="subtle-background">
        <section id="the-grounds" className="section container venue-story venue-story-reverse">
          <div className="venue-story-copy" data-motion="reveal">
            <p className="eyebrow">02 / Under a big Texas sky</p>
            <h2>
              Open air.
              <br />
              <em>Endless possibility.</em>
            </h2>
            <p>
              Rolling land and beautiful views make a special setting for the moments you’ll
              remember. A portable arbor and benches offer options for an outdoor ceremony, with the
              barn and covered seating close by.
            </p>
            <Amenities
              items={[
                "22 acres of countryside",
                "Portable arbor and benches",
                "Ample parking",
                "Views across the property",
              ]}
            />
            <p>
              We’ll walk you through the spaces and talk about how they can work for your plans.
            </p>
          </div>
          <div className="venue-story-image" data-motion="image">
            <ContentImage
              slot="hero"
              fill
              sizes="(max-width:760px) 100vw, 50vw"
              className="cover"
            />
          </div>
        </section>
      </div>
      <section id="getting-ready" className="section container venue-story">
        <div className="venue-story-image" data-motion="image">
          <ContentImage
            slot="bridalSuite"
            fill
            sizes="(max-width:760px) 100vw, 50vw"
            className="cover"
          />
        </div>
        <div className="venue-story-copy" data-motion="reveal">
          <p className="eyebrow">03 / The moments before</p>
          <h2>
            A little calm.
            <br />
            <em>A little anticipation.</em>
          </h2>
          <p>
            Our 400-square-foot grain bin has a second life as a bridal suite. Vintage details, a
            loft with views, and a place to get ready make it a distinctive part of the property.
          </p>
          <Amenities
            items={[
              "Air-conditioned bridal suite",
              "Bathroom",
              "Loft with views",
              "400 square feet",
            ]}
          />
        </div>
      </section>
      <div className="subtle-background">
        <section id="the-bunkhouse" className="section container venue-story venue-story-reverse">
          <div className="venue-story-copy" data-motion="reveal">
            <p className="eyebrow">04 / Kick your boots off</p>
            <h2>
              The Bunkhouse.
              <br />
              <em>Make yourself at home.</em>
            </h2>
            <p>
              A Western-inspired, 400-square-foot space for the groomsmen, with a large porch that
              invites you to sit a while. It’s a comfortable place to gather before the celebration
              begins.
            </p>
            <Amenities
              items={["Air conditioning", "Mini kitchen", "Bathroom", "Large porch"]}
            />
          </div>
          <div className="venue-story-image" data-motion="image">
            <ContentImage
              slot="bunkhouse"
              fill
              sizes="(max-width:760px) 100vw, 50vw"
              className="cover"
            />
          </div>
        </section>
      </div>
      <section className="section container welcome-section">
        <div data-motion="reveal">
          <p className="eyebrow">Bring your plans. We’ll bring the welcome.</p>
          <h2>
            Every gathering
            <br />
            <em>starts somewhere.</em>
          </h2>
        </div>
        <div className="welcome-copy" data-motion="reveal">
          <p>
            Planning a wedding, birthday, family reunion, or something else worth celebrating? Tell
            us what you have in mind. We can also help you find local vendors for your event’s
            needs.
          </p>
          <p>
            Amenities are listed to help you explore the property. We’ll discuss the details and
            pricing for your particular celebration when you get in touch.
          </p>
          <div className="venue-planning-action">
            <ButtonLink href="/vendors" secondary>
              Help Finding Vendors
            </ButtonLink>
          </div>
        </div>
      </section>
      <ContactCta />
    </>
  );
}
