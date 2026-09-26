import type { Metadata } from "next";
import { ContentImage } from "@/components/content-image";
import { ButtonLink, ContactCta, PageIntro } from "@/components/ui";
import styles from "./vendors.module.css";

export const metadata: Metadata = {
  title: "Local Vendors",
  description:
    "Planning your celebration at Happy Trails? Depending on your needs, Jennifer and Randy can help you locate local vendors in the Blooming Grove area.",
  alternates: { canonical: "/vendors" },
};

const conversationStarters = [
  {
    title: "The occasion",
    detail: "A wedding, a birthday, a family reunion—what brings your people together?",
  },
  {
    title: "The help you need",
    detail: "Which parts of your celebration would you like local help with?",
  },
  {
    title: "Your plans so far",
    detail: "Share your preferred date, estimated guest count, and plans so far.",
  },
];

export default function VendorsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Local vendors"
        title={
          <>
            Your vision.
            <br />
            <em>A little local help.</em>
          </>
        }
      >
        <p>
          Every gathering has its own details. Depending on what yours needs, Jennifer and Randy
          can assist you with locating local vendors.
        </p>
      </PageIntro>
      <section className={`container ${styles.localHelp}`} aria-labelledby="local-help-heading">
        <figure className={styles.figure}>
          <div className={styles.photo} data-motion="image">
            <ContentImage
              slot="barn"
              fill
              priority
              sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 44vw, 600px"
              className="cover"
            />
          </div>
          <figcaption>The barn, ready for a gathering.</figcaption>
        </figure>
        <div className={styles.copy} data-motion="reveal">
          <p className="eyebrow">Start with what matters to you</p>
          <h2 id="local-help-heading">
            What would you
            <br />
            <em>like help with?</em>
          </h2>
          <ol className={styles.details}>
            {conversationStarters.map(({ title, detail }, index) => (
              <li key={title}>
                <span className={styles.number} aria-hidden="true">
                  0{index + 1}
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <ButtonLink href="/contact">Ask About Local Vendors</ButtonLink>
        </div>
      </section>
      <ContactCta />
    </>
  );
}
