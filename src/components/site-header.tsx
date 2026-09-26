"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [
  { href: "/venue", label: "The Venue" },
  { href: "/gallery", label: "Gallery" },
  { href: "/our-story", label: "Our Story" },
  { href: "/vendors", label: "Vendors" },
  { href: "/pricing", label: "Pricing & FAQs" },
];

export function SiteHeader() {
  const path = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const close = () => dialog.current?.close();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="Happy Trails, home">
          <Image
            src="/images/logo.png"
            alt="Happy Trails Shindigs & Events"
            width={184}
            height={92}
            loading="eager"
          />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} aria-current={path === href ? "page" : undefined}>
              {label}
            </Link>
          ))}
        </nav>
        <Link className="button button-solid header-cta" href="/contact" prefetch={false}>
          Request a Tour <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
        <button
          className="menu-toggle"
          ref={toggle}
          onClick={() => dialog.current?.showModal()}
          aria-label="Open navigation"
          aria-haspopup="dialog"
        >
          <Menu size={25} />
        </button>
      </div>
      <dialog
        ref={dialog}
        className="mobile-menu"
        aria-labelledby="menu-title"
        onClose={() => toggle.current?.focus()}
        onClick={(event) => {
          if (event.target === dialog.current) close();
        }}
      >
        <div className="mobile-menu-inner">
          <div className="mobile-menu-top">
            <span id="menu-title" className="eyebrow">
              Find your happy place
            </span>
            <button className="icon-button" onClick={close} aria-label="Close navigation">
              <X />
            </button>
          </div>
          <nav aria-label="Mobile navigation">
            {[
              { href: "/", label: "Home" },
              ...links,
              { href: "/contact", label: "Get in Touch" },
            ].map(({ href, label }, index) => (
              <Link
                onClick={close}
                href={href}
                key={href}
                aria-current={path === href ? "page" : undefined}
              >
                <span className="menu-number">0{index + 1}</span>
                {label}
                <ArrowUpRight size={20} aria-hidden="true" />
              </Link>
            ))}
          </nav>
          <p>
            Good company. Open skies.
            <br />A little Texas magic.
          </p>
          <a className="text-link" href="tel:+19035524248">
            903-552-4248 <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </dialog>
    </header>
  );
}
