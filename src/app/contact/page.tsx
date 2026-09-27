import { Mail, MapPin, Phone } from "lucide-react";
import { ContentImage } from "@/components/content-image";
import { PageIntro } from "@/components/ui";
import { InquiryForm } from "@/components/inquiry-form";
import { VenueLocation } from "@/components/venue-location";
import { site } from "@/lib/content";
import { createPageMetadata, getBusinessStructuredData } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const metadata = createPageMetadata({
  title: "Contact & Venue Tours in Blooming Grove",
  description:
    "Visit Happy Trails in Blooming Grove, Texas. Request a venue tour or tell Jennifer and Randy about your wedding, party, or family gathering.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", ...getBusinessStructuredData() }} />
      <PageIntro
        eyebrow="Every good day starts with hello"
        title={
          <>
            Let’s make
            <br />
            <em>something memorable.</em>
          </>
        }
      >
        <p>
          Tell us a little about your celebration or request a visit. We’ll be in touch to talk
          through the details.
        </p>
      </PageIntro>
      <nav className="container contact-quicklinks" aria-label="Quick contact and directions">
        <a href={site.phoneHref}>
          <Phone size={17} aria-hidden="true" />
          Call Us
        </a>
        <a href={`mailto:${site.email}`}>
          <Mail size={17} aria-hidden="true" />
          Email Us
        </a>
        <a href="#directions">
          <MapPin size={17} aria-hidden="true" />
          Map & Directions
        </a>
      </nav>
      <div className="container contact-layout">
        <aside className="contact-aside" aria-label="Venue contact details">
          <div className="contact-detail">
            <p className="eyebrow">Give us a call</p>
            <a href={site.phoneHref}>{site.phone}</a>
          </div>
          <div className="contact-detail">
            <p className="eyebrow">Drop us a note</p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
          <div className="contact-detail">
            <p className="eyebrow">Our little corner of Texas</p>
            <p>
              {site.streetAddress}
              <br />
              Blooming Grove, TX {site.postalCode}
            </p>
            <a className="text-link" href="#directions">
              View Map & Directions ↗
            </a>
          </div>
          <div className="contact-detail">
            <p className="eyebrow">Business hours</p>
            <p>{site.businessHours.label}</p>
            <p>Contact us to arrange your visit.</p>
          </div>
          <div className="contact-detail">
            <p className="eyebrow">Find us online</p>
            <p><a href={site.profiles.google}>Google Business Profile</a></p>
            <p><a href={site.profiles.yelp}>Happy Trails on Yelp</a></p>
          </div>
          <div className="contact-photo">
            <ContentImage
              slot="hero"
              fill
              sizes="(max-width:760px) 100vw, 30vw"
              className="cover"
            />
          </div>
        </aside>
        <InquiryForm guestCapacityEstimate={site.guestCapacityEstimate} />
      </div>
      <VenueLocation />
    </>
  );
}
