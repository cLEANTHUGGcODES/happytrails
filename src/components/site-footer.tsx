import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getUpdates, site } from "@/lib/content";
import { Horseshoe } from "@/components/horseshoe";
import styles from "./site-footer.module.css";

function TexasFlag() {
  return (
    <svg
      className={styles.flag}
      viewBox="0 0 36 24"
      role="img"
      aria-label="Texas flag"
      focusable="false"
    >
      <path fill="#fff" d="M0 0h36v24H0z" />
      <path fill="#bf0a30" d="M12 12h24v12H12z" />
      <path fill="#002868" d="M0 0h12v24H0z" />
      <path
        fill="#fff"
        d="m6 7.5 1.06 3.26h3.43l-2.77 2.01 1.06 3.26L6 14.02l-2.78 2.01 1.06-3.26-2.77-2.01h3.43L6 7.5Z"
      />
    </svg>
  );
}

export async function SiteFooter() {
  const hasUpdates = (await getUpdates()).length > 0;
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.main}`}>
        <div className={styles.brand}>
          <Link className={styles.logo} href="/" aria-label="Happy Trails, home">
            <Image
              src="/images/logo.png"
              alt="Happy Trails Shindigs & Events"
              width={200}
              height={100}
            />
          </Link>
          <div className={styles.sentiment}>
            <Horseshoe />
            <p>
              A little place.
              <br />A lot of heart.
            </p>
          </div>
        </div>
        <div className={styles.explore}>
          <h2 className={styles.label}>Come on in</h2>
          <nav className={styles.links} aria-label="Footer navigation">
            <Link href="/venue">The Venue</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/our-story">Our Story</Link>
            <Link href="/vendors">Vendors</Link>
            <Link href="/pricing">Pricing & FAQs</Link>
            <Link href="/contact" prefetch={false}>
              Contact
            </Link>
            {hasUpdates && <Link href="/news">News & Updates</Link>}
          </nav>
        </div>
        <div>
          <h2 className={styles.label}>Out our way</h2>
          <address className={styles.address}>
            <Link href="/contact#directions" prefetch={false}>
              {site.streetAddress}
              <br />
              Blooming Grove, TX
              <br />
              {site.postalCode}
            </Link>
          </address>
          <Link className={styles.directions} href="/contact#directions" prefetch={false}>
            Map & directions <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className={styles.contact}>
          <h2 className={styles.label}>Let’s make a memory</h2>
          <a className={styles.phone} href={site.phoneHref}>
            {site.phone}
          </a>
          <a className={styles.email} href={`mailto:${site.email}`}>
            {site.email.split("@")[0]}@<wbr />
            {site.email.split("@")[1]}
          </a>
          <Link className={styles.tour} href="/contact" prefetch={false}>
            Request a tour <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
          <nav className={styles.profiles} aria-label="Happy Trails business profiles">
            <a href={site.profiles.google}>Google profile</a>
            <a href={site.profiles.yelp}>Yelp</a>
          </nav>
        </div>
      </div>
      <div className={`container ${styles.bottom}`}>
        <p>© {new Date().getFullYear()} Happy Trails Shindigs & Events</p>
        <p className={styles.texas}>
          <TexasFlag /> Made for gathering. Rooted in Texas.
        </p>
        <Link href="/privacy">Privacy</Link>
      </div>
    </footer>
  );
}
