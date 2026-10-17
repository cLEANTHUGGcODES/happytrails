import Link from "next/link";
import { planningResources } from "@/lib/planning-resources";
import styles from "./planning-links.module.css";

export function PlanningLinks({ slugs }: { slugs: string[] }) {
  const resources = planningResources.filter((resource) => slugs.includes(resource.slug));
  return <aside className={`container ${styles.related}`} aria-label="Helpful planning guides">
    <p className="eyebrow">Put the details together</p>
    <h2>A little help <em>with the planning.</em></h2>
    <div className={styles.links}>
      {resources.map((resource) => <Link key={resource.slug} href={`/planning/${resource.slug}`}>
        <strong>{resource.title} <span aria-hidden="true">↗</span></strong>
        <span>{resource.summary}</span>
      </Link>)}
    </div>
  </aside>;
}
