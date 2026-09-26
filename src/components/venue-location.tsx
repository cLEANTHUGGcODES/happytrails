import Image from "next/image";
import { ArrowUpRight, Download, MapPin } from "lucide-react";
import { directions, site } from "@/lib/content";
import styles from "./venue-location.module.css";

export function VenueLocation() {
  return (
    <section id="directions" className={styles.section} aria-labelledby="directions-heading">
      <div className={`container ${styles.layout}`}>
        <div className={styles.copy}>
          <p className="eyebrow">A little country. A warm welcome.</p>
          <h2 id="directions-heading">
            All roads lead to<br /><em>a good time.</em>
          </h2>
          <p>
            Find our little corner of Texas just south of Blooming Grove, on FM 55.
            We’d love to welcome you for a look around.
          </p>
          <address className={styles.address}>
            <MapPin size={21} strokeWidth={1.5} aria-hidden="true" />
            <span><strong>{site.name}</strong><br />{site.streetAddress}<br />Blooming Grove, TX {site.postalCode}</span>
          </address>
          <div className={styles.actions}>
            <a className="button button-solid" href={directions.google} target="_blank" rel="noopener noreferrer">
              Google Maps <ArrowUpRight size={17} aria-hidden="true" />
              <span className="sr-only"> driving directions (opens a new tab)</span>
            </a>
            <a className="button button-outline" href={directions.apple} target="_blank" rel="noopener noreferrer">
              Apple Maps <ArrowUpRight size={17} aria-hidden="true" />
              <span className="sr-only"> driving directions (opens a new tab)</span>
            </a>
            <a className="button button-outline" href={directions.waze} target="_blank" rel="noopener noreferrer">
              Waze <ArrowUpRight size={17} aria-hidden="true" />
              <span className="sr-only"> driving directions (opens a new tab)</span>
            </a>
          </div>
          <p className={styles.visitNote}>
            Planning a visit? Give us a call at <a href={site.phoneHref}>{site.phone}</a> or
            send an inquiry above to arrange a time.
          </p>
        </div>
        <figure className={styles.figure}>
          <a className={styles.mapLink} href="/images/happy-trails-map.png" target="_blank" rel="noopener noreferrer"
            aria-label="View the illustrated Happy Trails map at full size (opens a new tab)">
            <Image src="/images/happy-trails-map.webp" alt="Illustrated local map: Highway 22 passes through Blooming Grove. Follow FM 55 south toward Happy Trails at 5281 FM 55. North is at the top."
              width={1310} height={1201} sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 52vw, 760px" />
          </a>
          <figcaption className={styles.caption}>
            <span>Illustrated local guide. Use your map app for turn-by-turn directions.</span>
            <a href="/images/happy-trails-map.png" download="Happy-Trails-Location-Map.png"><Download size={14} aria-hidden="true" /> Save the map</a>
          </figcaption>
          <p className={styles.attribution}>
            Road reference © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors<span className="sr-only"> (opens a new tab)</span></a>.
          </p>
        </figure>
      </div>
    </section>
  );
}
