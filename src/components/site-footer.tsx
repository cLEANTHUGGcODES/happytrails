import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";
import { getUpdates, site } from "@/lib/content";

export async function SiteFooter() {
  const hasUpdates = (await getUpdates()).length > 0;
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Link href="/" aria-label="Happy Trails, home">
            <Image
              src="/images/logo.png"
              alt="Happy Trails Shindigs & Events"
              width={200}
              height={100}
            />
          </Link>
          <p>
            A little place. A lot of heart.
            <br />
            <Link href="/contact#directions" prefetch={false}>
              {site.streetAddress}
              <br />
              Blooming Grove, TX {site.postalCode}
            </Link>
          </p>
        </div>
        <div>
          <h2 className="eyebrow">Come on in</h2>
          <nav className="footer-links" aria-label="Footer navigation">
            <Link href="/venue">The Venue</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/our-story">Our Story</Link>
            <Link href="/vendors">Vendors</Link>
            <Link href="/pricing">Pricing & FAQs</Link>
            {hasUpdates && <Link href="/news">News & Updates</Link>}
          </nav>
        </div>
        <div className="footer-contact">
          <h2 className="eyebrow">Let’s make a memory</h2>
          <a href="tel:+19035524248">903-552-4248</a>
          <a href="mailto:admin@happytrailsshindigs.com">admin@happytrailsshindigs.com</a>
          <Link className="text-link" href="/contact" prefetch={false}>
            Request a Tour <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Happy Trails Shindigs & Events</p>
        <p>
          Made for gathering. <Heart size={12} aria-hidden="true" /> Rooted in Texas.
        </p>
        <Link href="/privacy">Privacy</Link>
      </div>
    </footer>
  );
}
