import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUpdate, getUpdates } from "@/lib/content";
import { PageIntro } from "@/components/ui";
import { JsonLd } from "@/components/json-ld";
import { createPageMetadata, getArticleStructuredData } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() {
  return (await getUpdates()).map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getUpdate(slug);
  if (!post) notFound();
  return createPageMetadata({
    title: post.title,
    description: post.summary,
    path: `/news/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt,
    image: post.coverImage ?? undefined,
  });
}
export default async function NewsArticle({ params }: Props) {
  const { slug } = await params;
  const post = await getUpdate(slug);
  if (!post) notFound();
  return (
    <>
      <JsonLd data={getArticleStructuredData(post)} />
      <PageIntro
        eyebrow={new Date(post.publishedAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        })}
        title={post.title}
      >
        <p>{post.summary}</p>
      </PageIntro>
      <article className="container article-body">
        {post.coverImage && (
          <Image
            src={post.coverImage.src}
            width={post.coverImage.width}
            height={post.coverImage.height}
            alt={post.coverImage.alt}
            sizes="(max-width:760px) 100vw, 740px"
            priority
          />
        )}
        {post.body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
        <Link href="/news" className="text-link" style={{ marginTop: 35 }}>
          ← Back to all updates
        </Link>
      </article>
    </>
  );
}
