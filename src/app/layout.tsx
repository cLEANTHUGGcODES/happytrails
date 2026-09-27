import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollAnimations } from "@/components/scroll-animations";
import { SITE_URL } from "@/lib/site-url";
import { createPageMetadata } from "@/lib/seo";
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
export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Wedding & Event Venue in Blooming Grove, TX",
    description:
      "Celebrate at Happy Trails, a barn wedding and event venue on 22 acres in Blooming Grove, Texas. Space for approximately 75 guests. Request a tour.",
    path: "/",
  }),
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "96x96" }],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
  // Individual routes supply their own canonical; never inherit the homepage canonical on a 404.
  alternates: undefined,
  robots: process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production"
    ? { index: false, follow: false }
    : { index: true, follow: true, "max-image-preview": "large" },
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
