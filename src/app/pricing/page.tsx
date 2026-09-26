import type { Metadata } from "next";
import Link from "next/link";
import { Flower2, Plus, Sun } from "lucide-react";
import { ButtonLink, PageIntro, ContactCta } from "@/components/ui";
import { faqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Pricing & FAQs",
  description:
    "Weddings at Happy Trails start at $3,000. Explore venue details and get in touch for birthday, family reunion, and special-event pricing.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <PageIntro
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
      </PageIntro>
      <section className="container pricing-section" aria-label="Event pricing">
        <article className="pricing-card featured" data-motion="reveal">
          <Flower2 size={37} strokeWidth={1} aria-hidden="true" />
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
          <Sun size={37} strokeWidth={1} aria-hidden="true" />
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
              </details>
            ))}
          </div>
        </section>
      </div>
      <ContactCta />
    </>
  );
}
