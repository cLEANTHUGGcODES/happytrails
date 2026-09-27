import type { Metadata } from "next";
import { PageIntro } from "@/components/ui";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy & Inquiry Information",
  description:
    "Learn how Happy Trails uses your contact and event inquiry details, which services support the website, and how to ask about your information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageIntro breadcrumb={{ label: "Privacy", path: "/privacy" }}
        eyebrow="Your information"
        title={
          <>
            A note on <em>privacy.</em>
          </>
        }
      />
      <div className="container legal-copy">
        <p>
          When you send an inquiry to Happy Trails Shindigs & Events, you share the contact and
          event details you enter in the form. We use those details to respond to your request and
          discuss your celebration.
        </p>
        <h2>Inquiry information</h2>
        <p>
          The form asks for your name, email address, and celebration type. You may also share a
          phone number, preferred date, estimated guest count, a message, and how you heard about us.
          That optional referral answer helps us understand which listings and recommendations are useful. Your inquiry is
          delivered to our email inbox through our email delivery provider, Resend. It is not a
          confirmed booking.
        </p>
        <h2>Website services</h2>
        <p>
          Our website is hosted on Vercel. Hosting and email services may process technical
          information, such as request details and delivery status, to operate and protect the
          website. This website does not have customer accounts or collect payment information.
        </p>
        <h2>Getting in touch</h2>
        <p>
          For questions about information you have shared, or to request its correction or deletion,
          email <a href="mailto:admin@happytrailsshindigs.com">admin@happytrailsshindigs.com</a> or
          call <a href="tel:+19035524248">903-552-4248</a>.
        </p>
      </div>
    </>
  );
}
