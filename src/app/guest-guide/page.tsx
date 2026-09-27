import Image from "next/image";
import Link from "next/link";
import { site, directions } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/ui";
import { ShareLink } from "@/components/share-link";
import { PrintButton } from "@/components/print-button";
import styles from "./page.module.css";

export const metadata = createPageMetadata({
  title: "Guest Arrival Guide & Directions",
  description: "Share directions to Happy Trails at 5281 FM 55 in Blooming Grove, Texas. Save the venue contact, open the correct map pin, or print a guest arrival guide.",
  path: "/guest-guide",
});

export default function GuestGuide() {
  return <div className={styles.page}>
    <PageIntro eyebrow="For the people making the trip" title={<>We’ll see you<br /><em>out our way.</em></>}
      breadcrumb={{ label: "Guest Arrival Guide", path: "/guest-guide" }}>
      <p>Headed to a celebration at Happy Trails? Keep the address and directions together, and check your invitation for your event’s date and arrival time.</p>
    </PageIntro>
    <section className={`container ${styles.layout}`} aria-label="Guest directions and arrival details">
      <div className={styles.details}>
        <h2>Happy Trails Shindigs & Events</h2>
        <address>{site.streetAddress}<br />Blooming Grove, TX {site.postalCode}</address>
        <p>Use one of these directions links for the venue’s confirmed map pin. An address search can place the destination incorrectly.</p>
        <nav className={styles.maps} aria-label="Guest driving directions">
          <a className="text-link" href={directions.google}>Google Maps ↗</a>
          <a className="text-link" href={directions.apple}>Apple Maps ↗</a>
          <a className="text-link" href={directions.waze}>Waze ↗</a>
        </nav>
        <h3>Before you head out</h3>
        <ul>
          <li>Confirm your event’s start time and arrival instructions with your host.</li>
          <li>Save these directions and the venue contact before the trip.</li>
          <li>Ask your host about parking, drop-off arrangements and any access needs.</li>
          <li>Check <a href="https://drivetexas.org/">DriveTexas</a> for current road conditions.</li>
        </ul>
        <p>Questions about the venue? Call <a href={site.phoneHref}>{site.phone}</a>. Venue tours should be arranged with Jennifer and Randy in advance.</p>
        <div className="referral-tools">
          <a className="text-link" href="/downloads/happy-trails.vcf" download>Save venue contact ↗</a>
          <ShareLink path="/guest-guide" title="Your visit to Happy Trails" label="Share with guests" />
          <PrintButton />
        </div>
        <div className={styles.eventNotes}>
          <h3>Your celebration</h3>
          <p>Event: <span /></p><p>Date & arrival time: <span /></p><p>Host’s notes: <span /></p>
        </div>
      </div>
      <figure className={styles.map}>
        <Image src="/images/happy-trails-map.webp" width={1310} height={1201} sizes="(max-width: 800px) 90vw, 48vw" priority
          alt="Illustrated map showing Happy Trails on FM 55 south of Blooming Grove and Highway 22" />
        <figcaption>Illustrated local guide. Use your map app for turn-by-turn directions. Road reference © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>.</figcaption>
        <p className={styles.printUrl}>Directions: www.happytrailsshindigs.com/guest-guide</p>
      </figure>
    </section>
    <div className={`container ${styles.more}`}><Link className="text-link" href="/planning#guest-resources">Lodging & dining resources ↗</Link></div>
  </div>;
}
