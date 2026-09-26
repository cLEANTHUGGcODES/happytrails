import type { Metadata } from "next";
import { ArrowDown } from "lucide-react";
import { PageIntro, ContactCta } from "@/components/ui";
import { PhotoGallery } from "@/components/photo-gallery";
import { VideoTour } from "@/components/video-tour";
import { getGallery } from "@/lib/content";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Take a look around Happy Trails. Explore our rustic barn, sunset ceremony setting, getting-ready spaces, and real celebrations.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const items = await getGallery();
  return (
    <>
      <PageIntro
        eyebrow="A glimpse of the good life"
        title={
          <>
            Picture yourself <em>here.</em>
          </>
        }
      >
        <p>
          The setting, the little details, and the moments that make it all worthwhile. Take a look
          around our happy place.
        </p>
        <a className="text-link" href="#property-tour">
          Watch the property tour <ArrowDown size={16} aria-hidden="true" />
        </a>
      </PageIntro>
      <div className="container gallery-collection">
        <PhotoGallery items={items} />
      </div>
      <section className="section container gallery-tour" id="property-tour">
        <p className="eyebrow">There’s more around the corner</p>
        <h2>
          Come along <em>for a tour.</em>
        </h2>
        <VideoTour full />
      </section>
      <ContactCta />
    </>
  );
}
