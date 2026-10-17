import { getBusinessStructuredData } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

export function GET() {
  return Response.json({
    "@context": "https://schema.org",
    ...getBusinessStructuredData(),
    mainEntityOfPage: absoluteUrl("/venue-info"),
  }, { headers: {
    "Content-Disposition": 'attachment; filename="happy-trails-venue-reference.json"',
    "X-Robots-Tag": "noindex, follow",
  } });
}
