import type { Metadata } from "next";
import Link from "next/link";
import { Download, Flower2, Plus } from "lucide-react";
import { ButtonLink, PageIntro, ContactCta } from "@/components/ui";
import { Horseshoe } from "@/components/horseshoe";
import { faqs } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Wedding Venue Pricing & FAQs",
  description:
    "Weddings at Happy Trails in Blooming Grove, Texas, start at $3,000. Find venue answers and ask about pricing for birthdays, reunions, and other events.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <PageIntro breadcrumb={{ label: "Pricing & FAQs", path: "/pricing" }}
        eyebrow="Make room for what matters"
        title={
          <>
            Wedding pricing
            <br />
            <em>& celebrations.</em>
          </>
        }
      >
        <p>
          Whether you’re planning your wedding or gathering your favorite people for another
          milestone, we’d love to hear your ideas.
        </p>
        <a className="text-link" href="/downloads/happy-trails-venue-fact-sheet.pdf" download>
          Download the venue fact sheet (PDF) <Download size={16} aria-hidden="true" />
        </a>
      </PageIntro>
      <section className="container pricing-section" aria-label="Event pricing">
        <article className="pricing-card featured" data-motion="reveal">
          <div className="pricing-ornament pricing-flowers" aria-hidden="true">
            <Flower2 className="pricing-flower-small" size={22} strokeWidth={1.25} />
            <Flower2 size={37} strokeWidth={1} />
            <Flower2 className="pricing-flower-small" size={24} strokeWidth={1.25} />
          </div>
          <p className="eyebrow">For your next chapter</p>
          <h2>Weddings</h2>
          <p className="pricing-price">
            <small>Starting at</small>$3,000
          </p>
          <p>
            Your love story, your people, and a setting full of Texas character. Let’s talk about
            your plans and put together the details for your day.
          </p>
          <Link className="button button-light" href="/contact">
            Tell Us About Your Day <span aria-hidden="true">↗</span>
          </Link>
        </article>
        <article className="pricing-card" data-motion="reveal">
          <Horseshoe className="pricing-ornament" width={37} height={37} />
          <p className="eyebrow">For all the good things in life</p>
          <h2>Other celebrations</h2>
          <p className="pricing-price pricing-quote">
            A quote for <em>your occasion.</em>
          </p>
          <p>
            Milestone birthdays, family reunions, and just-because gatherings. Pricing is based on
            what your event needs.
          </p>
          <p>
            Tell us what you’re celebrating, your preferred date, and a little about the day you
            imagine. We’ll take it from there.
          </p>
          <ButtonLink href="/contact" secondary>
            Let’s Talk About It
          </ButtonLink>
        </article>
      </section>
      <div className="subtle-background">
        <section className="section container faq-section" aria-labelledby="faq-title">
          <div data-motion="reveal">
            <p className="eyebrow">A few things you might be wondering</p>
            <h2 id="faq-title">
              Good questions.
              <br />
              <em>A warm welcome.</em>
            </h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>
                  {faq.question}
                  <Plus size={17} aria-hidden="true" />
                </summary>
                <p>{faq.answer}</p>
                {"relatedLink" in faq && (
                  <Link className="text-link" href={faq.relatedLink.href} prefetch={false}>
                    {faq.relatedLink.label}
                  </Link>
                )}
              </details>
            ))}
          </div>
        </section>
      </div>
      <ContactCta />
    </>
  );
}
