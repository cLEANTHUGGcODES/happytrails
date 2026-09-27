// Run with: node scripts/export-icons.mjs
// Use the installed Georgia Italic font, or set HAPPY_TRAILS_GEORGIA_FONT to its path.
// The font is used locally for rendering and is not distributed with the website.
import { existsSync } from "node:fs";
import { copyFile, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const fontPath = [
  process.env.HAPPY_TRAILS_GEORGIA_FONT,
  "/mnt/c/Windows/Fonts/georgiai.ttf",
  "/System/Library/Fonts/Supplemental/Georgia Italic.ttf",
  join(process.env.WINDIR || "C:\\Windows", "Fonts", "georgiai.ttf"),
].find((path) => path && existsSync(path));

if (!fontPath) {
  throw new Error("Set HAPPY_TRAILS_GEORGIA_FONT to an installed Georgia Italic font file.");
}

const workDirectory = await mkdtemp(join(tmpdir(), "happy-trails-icons-"));
const escapeXml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;");

try {
  await copyFile(fontPath, join(workDirectory, "georgia-italic.ttf"));
  const fontConfig = join(workDirectory, "fonts.conf");
  await writeFile(
    fontConfig,
    `<?xml version="1.0"?>\n<!DOCTYPE fontconfig SYSTEM "fonts.dtd">\n<fontconfig><dir>${escapeXml(workDirectory)}</dir><cachedir>${escapeXml(workDirectory)}</cachedir></fontconfig>\n`,
  );
  process.env.FONTCONFIG_FILE = fontConfig;

  const { default: sharp } = await import("sharp");
  const source = await readFile(join(projectRoot, "src/app/icon.svg"));
  const exports = [
    { file: "favicon.png", size: 96, opaque: false },
    { file: "apple-touch-icon.png", size: 180, opaque: true },
  ];

  for (const { file, size, opaque } of exports) {
    // Rasterize above target resolution so the small letterforms stay smooth.
    let output = sharp(source, { density: 288 }).resize(size, size);
    if (opaque) output = output.flatten({ background: "#8e302c" });
    const destination = join(projectRoot, "public", file);
    await output.png({ compressionLevel: 9 }).toFile(destination);
    const metadata = await sharp(destination).metadata();
    console.log(`${file}: ${metadata.width}x${metadata.height}, alpha=${metadata.hasAlpha}`);
  }
} finally {
  await rm(workDirectory, { recursive: true, force: true });
}
