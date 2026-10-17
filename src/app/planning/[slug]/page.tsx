import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { PrintButton } from "@/components/print-button";
import { ShareLink } from "@/components/share-link";
import { ContactCta, PageIntro } from "@/components/ui";
import { site } from "@/lib/content";
import { getPlanningResource, getPlanningResourceStructuredData, planningResources } from "@/lib/planning-resources";
import { createPageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site-url";
import styles from "./page.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return planningResources.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resource = getPlanningResource((await params).slug);
  if (!resource) notFound();
  return createPageMetadata({
    title: resource.title,
    description: resource.description,
    path: `/planning/${resource.slug}`,
    type: "article",
  });
}

export default async function PlanningResourcePage({ params }: Props) {
  const resource = getPlanningResource((await params).slug);
  if (!resource) notFound();
  const path = `/planning/${resource.slug}`;

  return (
    <div className={styles.page}>
      <JsonLd data={getPlanningResourceStructuredData(resource)} />
      <div className={`container ${styles.breadcrumbWrap}`}>
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">/</span>
          <Link href="/planning">Planning Guide</Link><span aria-hidden="true">/</span>
          <span aria-current="page">{resource.title}</span>
        </nav>
      </div>
      <PageIntro eyebrow="Make room for the details" title={resource.title}>
        <p>{resource.summary}</p>
      </PageIntro>
      <article className={`container ${styles.article}`} aria-label={resource.title}>
        <div className={styles.tools}>
          <p>From {site.shortName} · Blooming Grove, Texas</p>
          <div>
            <ShareLink path={path} title={resource.title} label="Share this guide" />
            <PrintButton label="Print / save PDF" />
          </div>
        </div>
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <nav aria-label="On this page">
              <p className="eyebrow">In this guide</p>
              <ol>
                {resource.sections.map((section, index) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}><span aria-hidden="true">0{index + 1}</span>{section.title}</a>
                  </li>
                ))}
              </ol>
              <a className={styles.worksheetJump} href={resource.schedule ? "#example-timeline" : "#your-notes"}>
                {resource.schedule ? "Edit the example timeline" : "Make your notes"}<ArrowDown size={14} aria-hidden="true" />
              </a>
            </nav>
          </aside>
          <div className={styles.content}>
            <p className={styles.introduction}>{resource.introduction}</p>
            {resource.sections.map((section, index) => (
              <section className={styles.section} id={section.id} aria-labelledby={`${section.id}-title`} key={section.id}>
                <p className={styles.sectionNumber} aria-hidden="true">0{index + 1}</p>
                <h2 id={`${section.id}-title`}>{section.title}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.checklist && <ul className={styles.checklist}>{section.checklist.map((item) => <li key={item}>{item}</li>)}</ul>}
                {section.source && <p className={styles.source}><a href={section.source.href}>{section.source.label}<ArrowUpRight size={14} aria-hidden="true" /></a></p>}
              </section>
            ))}
            {resource.schedule && (
              <section className={styles.worksheet} id="example-timeline" aria-labelledby="example-timeline-title">
                <p className="eyebrow">An example to make your own</p>
                <h2 id="example-timeline-title">Illustrative afternoon timeline</h2>
                <p>These sample times are not venue booking hours. Enter your own agreed times, then print or save a PDF. Entries are not sent to Happy Trails or saved by the website; keep a copy before leaving this page.</p>
                <div className={styles.schedule}>
                  {resource.schedule.map((row, index) => (
                    <div className={styles.scheduleRow} key={row.activity}>
                      <div><span className={styles.exampleTime}>Example: {row.time}</span><h3>{row.activity}</h3><p>{row.note}</p></div>
                      <label htmlFor={`time-${index}`}>Your time<input id={`time-${index}`} name={`time-${index}`} type="text" maxLength={40} placeholder="To confirm" autoComplete="off" /></label>
                    </div>
                  ))}
                </div>
              </section>
            )}
            <section className={styles.worksheet} id="your-notes" aria-labelledby="your-notes-title">
              <p className="eyebrow">Bring this to the conversation</p>
              <h2 id="your-notes-title">{resource.worksheet.title}</h2>
              <p>Fill in the notes below and print or save a PDF. Your entries stay in this open page; they are not submitted to the venue or saved by the website.</p>
              {resource.download && <p className={styles.download}><a className="text-link" href={resource.download.href} download>{resource.download.label}<ArrowDown size={15} aria-hidden="true" /></a></p>}
              <div className={styles.noteFields}>
                {resource.worksheet.fields.map((field, index) => (
                  <label htmlFor={`note-${index}`} key={field}>{field}<input id={`note-${index}`} name={`note-${index}`} type="text" maxLength={110} autoComplete="off" /></label>
                ))}
              </div>
            </section>
            <p className={styles.takeaway}>{resource.takeaway}</p>
            <p className={styles.printUrl}>Keep this guide: {absoluteUrl(path)}</p>
            <nav className={styles.nextSteps} aria-label="Continue planning">
              <p className="eyebrow">Keep planning</p>
              {resource.links.map((link) => <Link className="text-link" href={link.href} prefetch={false} key={link.href}>{link.label}<ArrowUpRight size={15} aria-hidden="true" /></Link>)}
              <Link className="text-link" href="/planning">All planning guides<ArrowUpRight size={15} aria-hidden="true" /></Link>
            </nav>
          </div>
        </div>
      </article>
      <div className={styles.cta}><ContactCta /></div>
    </div>
  );
}
