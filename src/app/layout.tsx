import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollAnimations } from "@/components/scroll-animations";
import "./globals.css";

const display = localFont({
  src: [
    { path: "./fonts/cormorant-roman.woff2", style: "normal", weight: "300 700" },
    { path: "./fonts/cormorant-italic.woff2", style: "italic", weight: "300 700" },
  ],
  variable: "--font-display",
  display: "swap",
});
const body = localFont({
  src: "./fonts/manrope.woff2",
  weight: "200 800",
  variable: "--font-body",
  display: "swap",
});
const url = process.env.NEXT_PUBLIC_SITE_URL || "https://happytrailsshindigs.com";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: "Happy Trails | Weddings & Celebrations in Blooming Grove, TX",
    template: "%s | Happy Trails",
  },
  description:
    "A rustic barn, open Texas skies, and room to make memories. Discover Happy Trails Shindigs & Events, a 22-acre wedding and event venue in Blooming Grove, Texas.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Happy Trails Shindigs & Events",
    images: [
      {
        url: "/images/ceremony-sunset.webp",
        width: 1448,
        height: 1086,
        alt: "An outdoor ceremony arbor and benches beneath a Texas sunset at Happy Trails",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = { themeColor: "#f7f2e8" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable}`}
    >
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <ScrollAnimations>{children}</ScrollAnimations>
        <SiteFooter />
      </body>
    </html>
  );
}
