import Link from "next/link";
import { ArrowUpRight, Download } from "lucide-react";
import { ContentImage } from "@/components/content-image";
import { PageIntro } from "@/components/ui";
import { ShareLink } from "@/components/share-link";
import { site } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";
import styles from "./venue-info.module.css";

export const metadata = createPageMetadata({
  title: "Venue Information & Referral Resources",
  description:
    "Find Happy Trails venue facts, ready-to-use descriptions, official links, and the downloadable fact sheet for referrals and event planning in Blooming Grove.",
  path: "/venue-info",
});

const descriptions = [
  {
    title: "A short introduction",
    copy: `${site.name} is a wedding and event venue on 22 acres in Blooming Grove, Texas, welcoming approximately ${site.guestCapacityEstimate} guests for weddings, birthdays, family reunions, and other gatherings.`,
  },
  {
    title: "A little more detail",
    copy: `${site.name} is a family-owned wedding and event venue on 22 acres in Blooming Grove, Texas. The property welcomes approximately ${site.guestCapacityEstimate} guests and features a renovated 1,800-square-foot horse barn, covered outdoor seating, a dance floor with lighting, and a custom wet bar. A grain-bin bridal suite and Western-inspired bunkhouse provide separate getting-ready spaces. Weddings start at $3,000; pricing for other celebrations is based on the event’s needs. Contact Jennifer and Randy to arrange a tour and discuss your plans.`,
  },
] as const;

const facts = [
  ["Business name", site.name],
  ["Location", `${site.fullAddress} · Navarro County`],
  ["Property", "22 acres"],
  ["Guest estimate", `Approximately ${site.guestCapacityEstimate} guests; discuss the layout for your event`],
  ["The barn", "Renovated 1,800-square-foot horse barn"],
  ["Getting ready", "400-square-foot bridal suite and 400-square-foot bunkhouse; both have air conditioning and a bathroom"],
  ["Celebrations", "Weddings, birthdays, family reunions, and other gatherings"],
  ["Wedding pricing", "Starting at $3,000; request a quote for your plans"],
  ["Other event pricing", "Quoted according to the event’s needs"],
  ["Hosts", "Jennifer & Randy"],
  ["Business hours", `${site.businessHours.label}. Contact us to arrange a visit.`],
] as const;

const officialLinks = [
  { label: "Official website", path: "/" },
  { label: "Venue spaces & amenities", path: "/venue" },
  { label: "Photographs & property tour", path: "/gallery" },
  { label: "Pricing & FAQs", path: "/pricing" },
  { label: "Planning guides", path: "/planning" },
  { label: "Guest arrival guide", path: "/guest-guide" },
  { label: "Map & directions", path: "/contact#directions" },
] as const;

export default function VenueInfoPage() {
  return (
    <>
      <PageIntro
        eyebrow="A handy reference"
        title={<>Happy Trails, <em>at a glance.</em></>}
        breadcrumb={{ label: "Venue Information", path: "/venue-info" }}
      >
        <p>
          Introducing the venue to a couple, a family, or a planning team? Use these descriptions,
          property facts, and official links to pass the details along.
        </p>
      </PageIntro>
      <div className={`container ${styles.resources}`}>
        <div className={styles.opening}>
          <figure className={styles.figure}>
            <div className={styles.photo}>
              <ContentImage slot="barn" fill sizes="(max-width:760px) 100vw, 45vw" className="cover" />
            </div>
            <figcaption>The renovated barn at Happy Trails.</figcaption>
          </figure>
          <section className={styles.download} aria-labelledby="fact-sheet-title">
            <p className="eyebrow">Save it. Share it. Keep it handy.</p>
            <h2 id="fact-sheet-title">The venue <em>fact sheet.</em></h2>
            <p>
              A one-page introduction with a property photograph, venue details, contact links,
              and a directions QR code. Useful to save, print, or send with a referral.
            </p>
            <a className="button button-solid" href="/downloads/happy-trails-venue-fact-sheet.pdf" download>
              Download the fact sheet <Download size={17} aria-hidden="true" />
            </a>
            <p className={styles.fileNote}>PDF · One page · About 855 KB</p>
            <ShareLink path="/venue-info" title="Happy Trails venue information" label="Share these venue details" />
          </section>
        </div>
        <section className={styles.section} id="descriptions" aria-labelledby="descriptions-title">
          <div className={styles.sectionHeading}>
            <p className="eyebrow">Words to pass along</p>
            <h2 id="descriptions-title">A ready-to-use <em>introduction.</em></h2>
            <p>
              Choose the length that fits your message. Link to the official website so readers
              can explore the property and contact the venue directly.
            </p>
          </div>
          <div className={styles.descriptions}>
            {descriptions.map((description) => (
              <article key={description.title}>
                <h3>{description.title}</h3>
                <p>{description.copy}</p>
              </article>
            ))}
          </div>
        </section>
        <section className={styles.section} id="venue-facts" aria-labelledby="venue-facts-title">
          <div className={styles.sectionHeading}>
            <p className="eyebrow">The details in one place</p>
            <h2 id="venue-facts-title">Know the <em>place.</em></h2>
            <p>
              Confirm availability, the layout, rental terms, and the items included in a quote
              with Jennifer and Randy for the particular event.
            </p>
          </div>
          <dl className={styles.facts}>
            {facts.map(([label, value]) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        </section>
        <section className={styles.section} id="official-links" aria-labelledby="official-links-title">
          <div className={styles.sectionHeading}>
            <p className="eyebrow">Point people our way</p>
            <h2 id="official-links-title">The links <em>you need.</em></h2>
          </div>
          <ul className={styles.linkList}>
            {officialLinks.map((link) => (
              <li key={link.path}>
                <Link href={link.path} prefetch={false}>
                  <span>{link.label}<small>{site.url}{link.path === "/" ? "" : link.path}</small></span>
                  <ArrowUpRight size={19} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className={styles.contact} aria-labelledby="reference-contact-title">
          <div>
            <p className="eyebrow">A person at the other end</p>
            <h2 id="reference-contact-title">Need a detail <em>or a photograph?</em></h2>
            <p>
              Contact Jennifer and Randy for current event details, a publication question, or
              permission and credit information before republishing photographs. The gallery is
              available to view, and the fact sheet is ready to share.
            </p>
          </div>
          <div className={styles.contactLinks}>
            <a href="/downloads/happy-trails.vcf" download>Save the venue contact</a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={site.phoneHref}>{site.phone}</a>
            <Link href="/contact#directions" prefetch={false}>{site.fullAddress}<ArrowUpRight size={15} aria-hidden="true" /></Link>
          </div>
        </section>
      </div>
    </>
  );
}
