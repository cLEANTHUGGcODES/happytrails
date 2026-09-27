#!/usr/bin/env python3
"""Build browser-ready media without changing any original asset.

Run from any directory:
  uv run --with pillow --with pillow-heif --with imageio-ffmpeg scripts/prepare_media.py
Use --images-only to skip the two video encodes.
"""

from __future__ import annotations

import argparse
import io
from pathlib import Path
import subprocess

import imageio_ffmpeg
from PIL import Image, ImageOps
import pillow_heif


ROOT = Path(__file__).resolve().parents[1]
IMAGE_DIR = ROOT / "public" / "images"
VIDEO_DIR = ROOT / "public" / "videos"
IMAGE_SOURCES = {
    "ceremony-sunset": "arbor and benches sunset.PNG",
    "barn-tables": "IMG_5659.HEIC",
    "barn-wide": "IMG_5660.HEIC",
    "barn-bar": "IMG_5658.HEIC",
    "barn-details": "IMG_5656.HEIC",
    "barn-dance-floor": "IMG_5657.HEIC",
    "barn-reception-view": "IMG_5661.HEIC",
    "barn-bar-view": "IMG_5662.HEIC",
    "barn-reception-tables": "IMG_5663.HEIC",
    "celebration": "IMG_6415.jpeg",
    "first-dance": "IMG_6330.jpeg",
    "reception-bar-guests": "IMG_6307.jpeg",
    "wedding-dance-floor": "IMG_6465.jpeg",
    "the-hosts": "IMG_6447.jpeg",
    "hospitality": "IMG_6424.jpeg",
    "evening-dance": "IMG_6502.jpeg",
    "food-and-friends": "IMG_6114.jpeg",
    "parking": "HT parking edit1.jpg",
}


def webp(image: Image.Image, name: str) -> None:
    image = ImageOps.exif_transpose(image).convert("RGB")
    image.thumbnail((2400, 2400), Image.Resampling.LANCZOS)
    # Construct a fresh image so original EXIF / GPS / camera metadata is stripped.
    clean = Image.frombytes("RGB", image.size, image.tobytes())
    target = IMAGE_DIR / f"{name}.webp"
    clean.save(target, "WEBP", quality=86, method=6)
    print(f"{target.relative_to(ROOT)}: {clean.width}x{clean.height}, {target.stat().st_size:,} bytes", flush=True)


def frame(source: str, seconds: float, name: str, crop: tuple[int, int, int, int] | None = None) -> None:
    data = subprocess.check_output([
        imageio_ffmpeg.get_ffmpeg_exe(), "-hide_banner", "-loglevel", "error",
        "-ss", str(seconds), "-i", str(ROOT / source), "-frames:v", "1",
        "-f", "image2pipe", "-vcodec", "png", "-",
    ])
    with Image.open(io.BytesIO(data)) as image:
        webp(image.crop(crop) if crop else image, name)


def encode(source: str, name: str) -> None:
    target = VIDEO_DIR / f"{name}.mp4"
    subprocess.run([
        imageio_ffmpeg.get_ffmpeg_exe(), "-hide_banner", "-loglevel", "error", "-y",
        "-i", str(ROOT / source), "-map", "0:v:0", "-map", "0:a:0?",
        "-vf", "scale=-2:720", "-c:v", "libx264", "-crf", "26", "-preset", "medium",
        "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k",
        "-map_metadata", "-1", "-movflags", "+faststart", str(target),
    ], check=True)
    print(f"{target.relative_to(ROOT)}: {target.stat().st_size:,} bytes", flush=True)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--images-only", action="store_true")
    args = parser.parse_args()
    pillow_heif.register_heif_opener()
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    VIDEO_DIR.mkdir(parents=True, exist_ok=True)
    for name, source in IMAGE_SOURCES.items():
        with Image.open(ROOT / source) as image:
            webp(image, name)
    with Image.open(ROOT / "HT Logo.PNG") as image:
        oriented = ImageOps.exif_transpose(image).convert("RGBA")
        logo = Image.frombytes("RGBA", oriented.size, oriented.tobytes())
        logo.save(IMAGE_DIR / "logo.png", "PNG", optimize=True)
    # Clean drone frame between the title sequence and the close-up of the owners.
    frame("HT Video 1.mp4", 8.4, "exterior-wide")
    frame("HT Video 1.mp4", 8.4, "tour-poster")
    # 68s is a clean exterior view; 30s contains baked-in title lettering.
    frame("HT Video 1.mp4", 68, "bunkhouse")
    frame("HT Video 1.mp4", 56.2, "bridal-suite")
    if not args.images_only:
        encode("ht video short version.mp4", "property-tour")
        encode("HT Video 1.mp4", "full-property-tour")


if __name__ == "__main__":
    main()
