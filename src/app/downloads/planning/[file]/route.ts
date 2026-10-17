import { makePlanningCsv, planningDownloads } from "@/lib/planning-downloads";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return planningDownloads.map(({ slug }) => ({ file: slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const csv = makePlanningCsv(file);
  if (!csv) return new Response("Worksheet not found", { status: 404 });
  return new Response(csv, { headers: {
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": `attachment; filename="happy-trails-${file}"`,
    "X-Robots-Tag": "noindex, follow",
  } });
}
