import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Breadcrumbs } from "./breadcrumbs";

export function ButtonLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      className={`button ${secondary ? "button-outline" : "button-solid"}`}
      href={href}
      prefetch={href === "/contact" ? false : undefined}
    >
      {children}
      <ArrowUpRight size={18} aria-hidden="true" />
    </Link>
  );
}

export function PageIntro({
  eyebrow,
  title,
  children,
  breadcrumb,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  breadcrumb?: { label: string; path: string };
}) {
  return (
    <div className="page-intro container" data-motion="reveal">
      {breadcrumb && <Breadcrumbs {...breadcrumb} />}
      <p className="eyebrow">
        <span className="tiny-line" />
        {eyebrow}
      </p>
      <h1>{title}</h1>
      {children && <div className="intro-copy">{children}</div>}
    </div>
  );
}

export function ContactCta() {
  return (
    <section className="contact-cta" aria-labelledby="cta-heading">
      <div className="container cta-inner">
        <div className="cta-copy" data-motion="reveal">
          <p className="eyebrow">See Happy Trails for yourself</p>
          <h2 id="cta-heading">
            Come for a tour.
            <br />
            <em>Picture your day.</em>
          </h2>
          <p>
            Walk the barn, explore the grounds, and talk through your plans with Jennifer and Randy.
          </p>
        </div>
        <div className="cta-actions">
          <Link className="button button-light" href="/contact" prefetch={false}>
            Let’s Plan a Visit <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
          <Link className="cta-location" href="/contact#directions" prefetch={false}>
            Blooming Grove, Texas · Map & Directions <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
