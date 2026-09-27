import { site } from "@/lib/content";

export const dynamic = "force-static";

const escape = (value: string) => value.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");

function fold(line: string) {
  let result = "";
  let bytes = 0;
  for (const character of line) {
    const size = Buffer.byteLength(character, "utf8");
    if (bytes + size > 75) { result += "\r\n "; bytes = 1; }
    result += character;
    bytes += size;
  }
  return result;
}

export function GET() {
  const fields = [
    "BEGIN:VCARD", "VERSION:3.0", `FN:${escape(site.name)}`,
    `N:;${escape(site.name)};;;`, `ORG:${escape(site.name)}`,
    `TEL;TYPE=WORK,VOICE:${site.phoneHref.replace("tel:", "")}`,
    `EMAIL;TYPE=WORK:${site.email}`,
    `ADR;TYPE=WORK:;;${escape(site.streetAddress)};Blooming Grove;TX;${site.postalCode};United States`,
    `URL:${site.url}/`, `GEO:${site.coordinates.latitude};${site.coordinates.longitude}`,
    "END:VCARD",
  ];
  return new Response(`${fields.map(fold).join("\r\n")}\r\n`, { headers: {
    "Content-Type": "text/vcard; charset=utf-8",
    "Content-Disposition": 'attachment; filename="Happy-Trails.vcf"',
    "X-Robots-Tag": "noindex, follow",
  } });
}
