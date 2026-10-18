import { SaxesParser, type SaxesTagNS } from "saxes";

const sitemapNamespace = "http://www.sitemaps.org/schemas/sitemap/0.9";

/** Validate the entire XML document, including image/video extensions, before using URLs. */
export function parseSitemapPageLocations(xml: string): string[] {
  const parser = new SaxesParser({ xmlns: true });
  const stack: SaxesTagNS[] = [];
  const locations: string[] = [];
  let pageLocations: string[] = [];
  let locationText = "";
  const isLocation = () => stack.length === 3 && stack[2].local === "loc" && stack[2].uri === sitemapNamespace;

  parser.on("doctype", () => { throw new Error("Sitemaps must not contain a DOCTYPE."); });
  parser.on("opentag", (tag) => {
    if (!stack.length && (tag.local !== "urlset" || tag.uri !== sitemapNamespace)) {
      throw new Error("The live sitemap is not a URL sitemap in the sitemap namespace.");
    }
    if (stack.length === 1) {
      if (tag.local !== "url" || tag.uri !== sitemapNamespace) throw new Error("A sitemap may only contain url entries.");
      pageLocations = [];
    }
    if (isLocation()) throw new Error("Sitemap loc values must contain text, not nested markup.");
    stack.push(tag);
    if (isLocation()) locationText = "";
  });
  const text = (value: string) => { if (isLocation()) locationText += value; };
  parser.on("text", text);
  parser.on("cdata", text);
  parser.on("closetag", () => {
    if (isLocation()) pageLocations.push(locationText.trim());
    if (stack.length === 2) {
      if (pageLocations.length !== 1 || !pageLocations[0]) throw new Error("Each sitemap page must have exactly one nonempty loc.");
      locations.push(pageLocations[0]);
    }
    stack.pop();
  });
  // Saxes throws on malformed XML, undefined entities and unbound namespace prefixes.
  parser.write(xml).close();
  if (!locations.length) throw new Error("The live sitemap contains no page URLs.");
  return locations;
}
