import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { ShareLink } from "@/components/share-link";
import { ContactCta } from "@/components/ui";
import { VideoTour } from "@/components/video-tour";
import { createPageMetadata } from "@/lib/seo";
import { getTourStructuredData, propertyTours } from "@/lib/tour-content";
import styles from "./page.module.css";

export const metadata = createPageMetadata({
  title: "Property Video Tour in Blooming Grove, TX",
  description:
    "Watch a video tour of Happy Trails in Blooming Grove, Texas. Explore the barn, grounds, bridal suite, and bunkhouse, then arrange an in-person venue visit.",
  path: "/tour",
  image: {
    src: "/images/tour-poster.webp",
    width: 1920,
    height: 1080,
    alt: "The barn, grain-bin bridal suite, and bunkhouse at Happy Trails in Blooming Grove, Texas",
  },
});

export default function TourPage() {
  const [fullTour, shortTour] = propertyTours;

  return (
    <>
      <JsonLd data={getTourStructuredData()} />
      <div className={`container ${styles.page}`}>
        <header className={styles.intro}>
          <Breadcrumbs label="Property Tour" path="/tour" pageSchema={false} />
          <p className="eyebrow">Blooming Grove, Texas</p>
          <h1>A look around <em>Happy Trails.</em></h1>
          <p className={styles.lead}>
            Take a video tour of our wedding and event venue before you visit. Press play to
            explore the property, then imagine your people here.
          </p>
        </header>

        <section id={fullTour.id} className={styles.mainTour} aria-labelledby="full-tour-heading">
          <div className={styles.videoHeading}>
            <h2 id="full-tour-heading">The full property tour</h2>
            <p>{fullTour.durationLabel}</p>
          </div>
          <VideoTour full posterSizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) calc(100vw - 64px), (max-width: 1162px) calc(100vw - 112px), 1050px" />
          <p className={styles.summary}>{fullTour.description}</p>
          <div className={styles.tourLinks}>
            <a className="text-link" href={fullTour.src}>Open the full video ↗</a>
            <ShareLink path="/tour" title="Take a video tour of Happy Trails" label="Share this tour" />
          </div>
        </section>

        <section className={styles.spaces} aria-labelledby="spaces-heading">
          <div>
            <p className="eyebrow">Get to know the place</p>
            <h2 id="spaces-heading">Room for <em>your kind of day.</em></h2>
            <p>
              Happy Trails sits on 22 acres in rural Navarro County. A renovated
              1,800-square-foot barn, outdoor gathering spaces, and two getting-ready spaces
              give you plenty to talk through on an in-person visit.
            </p>
          </div>
          <ul className={styles.details}>
            <li>
              <h3>The barn & grounds</h3>
              <p>
                Explore the barn, covered outdoor seating, and dance floor, along with
                tables, chairs, and the custom bar.
              </p>
              <Link className="text-link" href="/venue">Venue spaces & amenities ↗</Link>
            </li>
            <li>
              <h3>Getting ready</h3>
              <p>
                The grain-bin bridal suite and Western-inspired bunkhouse each offer
                400 square feet, air conditioning, and a bathroom.
              </p>
              <Link className="text-link" href="/venue#getting-ready">Bridal suite & bunkhouse ↗</Link>
            </li>
            <li>
              <h3>A closer look</h3>
              <p>See photographs of the property and celebrations, or review pricing and common questions.</p>
              <div className={styles.inlineLinks}>
                <Link className="text-link" href="/gallery">Venue photographs ↗</Link>
                <Link className="text-link" href="/pricing">Pricing & FAQs ↗</Link>
              </div>
            </li>
          </ul>
        </section>

        <section id={shortTour.id} className={styles.shortTour} aria-labelledby="short-tour-heading">
          <div className={styles.shortCopy}>
            <p className="eyebrow">A little Texas hospitality</p>
            <h2 id="short-tour-heading">The quick <em>look around.</em></h2>
            <p>{shortTour.description}</p>
            <p className={styles.duration}>{shortTour.durationLabel}</p>
            <a className="text-link" href={shortTour.src}>Open the short video ↗</a>
          </div>
          <VideoTour posterSizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) calc(59.375vw - 40px), (max-width: 1440px) calc(59.375vw - 70px), 785px" />
        </section>
      </div>
      <ContactCta />
    </>
  );
}
