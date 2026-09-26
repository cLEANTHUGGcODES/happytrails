import type { Metadata } from "next";
import Link from "next/link";
import { Flower2 } from "lucide-react";
import { ButtonLink, PageIntro } from "@/components/ui";
import { getUpdates } from "@/lib/content";

export const metadata: Metadata = {
  title: "News & Updates",
  description: "The latest from Happy Trails Shindigs & Events in Blooming Grove, Texas.",
  alternates: { canonical: "/news" },
};

export default async function NewsPage() {
  const posts = await getUpdates();
  return (
    <>
      <PageIntro
        eyebrow="Notes from Happy Trails"
        title={
          <>
            Around <em>here.</em>
          </>
        }
      >
        <p>Little updates, upcoming happenings, and more from our corner of the countryside.</p>
      </PageIntro>
      <div className="container">
        {posts.length ? (
          <div className="news-grid">
            {posts.map((post) => (
              <article key={post.id}>
                <p className="eyebrow">
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "UTC",
                  })}
                </p>
                <h2>
                  <Link href={`/news/${post.slug}`}>{post.title}</Link>
                </h2>
                <p>{post.summary}</p>
                <Link className="text-link" href={`/news/${post.slug}`}>
                  Read the story <span aria-hidden="true">↗</span>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="news-empty">
            <Flower2 size={44} strokeWidth={1} aria-hidden="true" />
            <h2>
              Good things <em>take a little time.</em>
            </h2>
            <p>
              We’ll share news and happenings here as they come along. In the meantime, get to know
              the place and picture your day at Happy Trails.
            </p>
            <ButtonLink href="/gallery" secondary>
              Take a Look Around
            </ButtonLink>
          </div>
        )}
      </div>
    </>
  );
}
