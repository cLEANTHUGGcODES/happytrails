import Link from "next/link";
import { JsonLd } from "./json-ld";
import { absoluteUrl } from "@/lib/site-url";
import { getWebPageStructuredData } from "@/lib/seo";

export function Breadcrumbs({ label, path, pageSchema = true }: { label: string; path: string; pageSchema?: boolean }) {
  return (
    <>
      {pageSchema && <JsonLd data={getWebPageStructuredData(label, path)} />}
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{label}</span>
      </nav>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: label, item: absoluteUrl(path) },
        ],
      }} />
    </>
  );
}
