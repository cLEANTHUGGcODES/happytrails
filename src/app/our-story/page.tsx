import type { Metadata } from "next";
import { ContentImage } from "@/components/content-image";
import { PageIntro, ContactCta } from "@/components/ui";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Jennifer & Randy’s Story",
  description:
    "Meet Jennifer and Randy, the hosts behind Happy Trails, and discover how their family property in Blooming Grove became a place for celebrations.",
  path: "/our-story",
});

export default function StoryPage() {
  return (
    <>
      <PageIntro breadcrumb={{ label: "Our Story", path: "/our-story" }}
        eyebrow="The heart behind the place"
        title={
          <>
            Some trails lead
            <br />
            <em>back to each other.</em>
          </>
        }
      >
        <p>
          A family property. A second chance at love. And a shared dream of bringing people
          together.
        </p>
      </PageIntro>
      <section className="container story-page-grid">
        <div>
          <div className="story-page-photo" data-motion="image">
            <ContentImage
              slot="story"
              fill
              priority
              sizes="(max-width:760px) 100vw, 50vw"
              className="cover"
            />
          </div>
          <p className="story-photo-caption">
            Good company, happy memories, and a celebration in the barn.
          </p>
        </div>
        <div className="story-prose" data-motion="reveal">
          <p className="lead">
            Established in 2025, Happy Trails began with a simple thing: a love of making people feel welcome.
          </p>
          <p>
            In the summer of 1998, the Hebert family bought 22 acres in Blooming Grove. The rolling
            land and sweeping views made it a special place from the start. Over the years, Jennifer
            Hebert hosted family and friends here, filling the property with gatherings and good memories.
          </p>
          <p>
            Friends encouraged her to turn that gift for entertaining into a venue. Then life
            brought an unexpected new chapter.
          </p>
          <p>
            Forty-three years after an early marriage, Jennifer and Randy Shaw’s paths crossed again.
            Reunited, they began hosting gatherings together, and the idea of Happy Trails grew into
            something real.
          </p>
          <p>
            In 2026, they married again. After their church ceremony, they celebrated with a
            reception in the newly renovated barn. It was a fitting beginning for a place created to
            hold other people’s happiest days.
          </p>
          <p>
            Today, they look forward to welcoming you—whether you’re planning a wedding, a birthday,
            a family reunion, or simply a reason to bring everyone together.
          </p>
          <blockquote className="story-inline-quote">
            “May your path lead you to Happy Trails.”
          </blockquote>
          <p className="signature">Jennifer & Randy</p>
          <p className="eyebrow story-hosts-label">
            Your hosts at Happy Trails
          </p>
        </div>
      </section>
      <ContactCta />
    </>
  );
}
