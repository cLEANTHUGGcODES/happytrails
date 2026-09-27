import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ContentImage } from "@/components/content-image";
import { ContactCta, PageIntro } from "@/components/ui";
import { PrintButton } from "@/components/print-button";
import { ShareLink } from "@/components/share-link";
import { planningGuides, visitorResources } from "@/lib/planning-content";
import { createPageMetadata } from "@/lib/seo";
import styles from "./planning.module.css";

export const metadata = createPageMetadata({
  title: "Wedding & Event Planning Guide in Blooming Grove",
  description:
    "Plan your Happy Trails visit with practical tour, guest-list, getting-ready, vendor, budget, and family gathering checklists, plus guest travel resources.",
  path: "/planning",
});

export default function PlanningPage() {
  return (
    <div className={styles.page}>
      <PageIntro
        eyebrow="A few plans. A lot to look forward to."
        title={<>Start with <em>what matters.</em></>}
        breadcrumb={{ label: "Planning Guide", path: "/planning" }}
      >
        <p>
          Practical prompts for your wedding, birthday, or family gathering at Happy Trails in
          Blooming Grove, Texas. Bring your ideas; use these guides to work through the details.
        </p>
      </PageIntro>
      <div className={`container ${styles.guide}`}>
        <div className={styles.tools}>
          <ShareLink path="/planning" title="Planning your celebration at Happy Trails" label="Share the planning guide" />
          <PrintButton label="Print the checklists" />
        </div>
        <nav className={styles.jumpnav} aria-label="Planning guide sections">
          {planningGuides.map((guide, index) => (
            <a href={`#${guide.id}`} key={guide.id}>
              <span className={styles.number} aria-hidden="true">0{index + 1}</span>
              {guide.label}
              <ArrowDown size={14} aria-hidden="true" />
            </a>
          ))}
        </nav>
        <figure className={styles.setting}>
          <div className={styles.photo}>
            <ContentImage slot="barn" fill sizes="(max-width:760px) 100vw, 90vw" className="cover" />
          </div>
          <figcaption>A look around the barn is a good place to begin.</figcaption>
        </figure>
        {planningGuides.map((guide, index) => (
          <section
            className={styles.guideSection}
            id={guide.id}
            aria-labelledby={`${guide.id}-title`}
            key={guide.id}
          >
            <div className={styles.sectionIntro}>
              <p className="eyebrow">0{index + 1} / {guide.label}</p>
              <h2 id={`${guide.id}-title`}>{guide.title}</h2>
              <p>{guide.intro}</p>
              <Link className="text-link" href={guide.link.href} prefetch={false}>
                {guide.link.label}<ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
            <div className={styles.checklist}>
              <ol>
                {guide.steps.map((step, stepIndex) => (
                  <li key={step.title}>
                    <span className={styles.stepNumber} aria-hidden="true">{stepIndex + 1}</span>
                    <div><h3>{step.title}</h3><p>{step.copy}</p></div>
                  </li>
                ))}
              </ol>
              <p className={styles.takeaway}><strong>Keep it together.</strong> {guide.takeaway}</p>
            </div>
          </section>
        ))}
        <section className={styles.travel} id="guest-resources" aria-labelledby="guest-resources-title">
          <div className={styles.travelHeading}>
            <div>
              <p className="eyebrow">For the journey here</p>
              <h2 id="guest-resources-title">Help your guests <em>make a plan.</em></h2>
            </div>
            <Link className="text-link" href="/guest-guide" prefetch={false}>
              Share the guest arrival guide<ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className={styles.resourceGrid}>
            {visitorResources.map((resource) => (
              <article key={resource.href}>
                <p className="eyebrow">{resource.source}</p>
                <h3>
                  <a href={resource.href}>
                    {resource.title}<ArrowUpRight size={18} aria-hidden="true" />
                  </a>
                </h3>
                <p>{resource.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
      <div className={styles.tourCta}><ContactCta /></div>
    </div>
  );
}
