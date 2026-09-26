import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContentImage } from "@/components/content-image";
import { PageIntro } from "@/components/ui";
import { InquiryForm } from "@/components/inquiry-form";
import { VenueLocation } from "@/components/venue-location";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Request a Tour",
  description:
    "Visit Happy Trails in Blooming Grove, Texas. Request a venue tour or tell Jennifer and Randy about your wedding, party, or family gathering.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
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
            <a href="tel:+19035524248">903-552-4248</a>
          </div>
          <div className="contact-detail">
            <p className="eyebrow">Drop us a note</p>
            <a href="mailto:admin@happytrailsshindigs.com">admin@happytrailsshindigs.com</a>
          </div>
          <div className="contact-detail">
            <p className="eyebrow">Our little corner of Texas</p>
            <p>
              {site.streetAddress}
              <br />
              Blooming Grove, TX {site.postalCode}
            </p>
            <a className="text-link" href="#directions">View Map & Directions ↗</a>
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
        <InquiryForm />
      </div>
      <VenueLocation />
    </>
  );
}
