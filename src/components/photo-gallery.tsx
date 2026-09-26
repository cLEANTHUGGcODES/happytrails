"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { LightboxExternalProps } from "yet-another-react-lightbox";
import type { MediaItem } from "@/lib/content";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import styles from "./photo-gallery.module.css";

const Lightbox = dynamic<LightboxExternalProps>(
  async () => {
    const [lightbox, captions, fullscreen, thumbnails, zoom] = await Promise.all([
      import("yet-another-react-lightbox"),
      import("yet-another-react-lightbox/plugins/captions"),
      import("yet-another-react-lightbox/plugins/fullscreen"),
      import("yet-another-react-lightbox/plugins/thumbnails"),
      import("yet-another-react-lightbox/plugins/zoom"),
    ]);
    const GalleryLightbox = lightbox.default;
    const plugins = [captions.default, fullscreen.default, thumbnails.default, zoom.default];

    return function LoadedLightbox(props: LightboxExternalProps) {
      return <GalleryLightbox {...props} plugins={plugins} />;
    };
  },
  {
    ssr: false,
    loading: () => (
      <div className={styles.loading} role="status">
        Opening photos…
      </div>
    ),
  },
);

const categoryOrder: MediaItem["category"][] = [
  "The Barn",
  "The Grounds",
  "Celebrations",
  "Getting Ready",
];

export function PhotoGallery({ items }: { items: MediaItem[] }) {
  const [category, setCategory] = useState("All photos");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [hasOpened, setHasOpened] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(250);
  const opener = useRef<HTMLButtonElement | null>(null);

  const categories = categoryOrder.filter((value) => items.some((item) => item.category === value));
  const filtered = useMemo(
    () => items.filter((item) => category === "All photos" || item.category === category),
    [items, category],
  );
  const slides = useMemo(
    () =>
      filtered.map((item) => ({
        src: item.src,
        alt: item.alt,
        width: item.width,
        height: item.height,
        title: item.caption,
        description: item.category,
      })),
    [filtered],
  );

  function openPhoto(index: number, button: HTMLButtonElement) {
    opener.current = button;
    setAnimationDuration(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 250);
    setHasOpened(true);
    setActiveIndex(index);
  }

  if (items.length === 0) {
    return <p className={styles.empty}>More moments from Happy Trails are on their way.</p>;
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.galleryHeader}>
        <div className={styles.filters} role="group" aria-label="Filter photographs">
          {["All photos", ...categories].map((value) => (
            <button
              key={value}
              type="button"
              className={styles.filter}
              aria-pressed={category === value}
              onClick={() => setCategory(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <p className={styles.count} aria-live="polite" aria-atomic="true">
          {filtered.length} {filtered.length === 1 ? "photograph" : "photographs"}
        </p>
      </div>

      <div className={styles.grid}>
        {filtered.map((item, index) => (
          <figure className={styles.item} key={item.id}>
            <button
              type="button"
              className={styles.photoButton}
              aria-label={`Open photograph: ${item.caption}`}
              aria-haspopup="dialog"
              onClick={(event) => openPhoto(index, event.currentTarget)}
            >
              <Image
                className={styles.photo}
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 639px) calc((100vw - 52px) / 2), (max-width: 1023px) 46vw, 30vw"
                style={{ objectPosition: item.position || "center" }}
              />
              <span className={styles.expand} aria-hidden="true">
                <ArrowUpRight size={21} strokeWidth={1.5} />
              </span>
            </button>
            <figcaption className={styles.caption}>
              <span className={styles.captionText}>{item.caption}</span>
              <span className={styles.category}>{item.category}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {hasOpened && (
        <Lightbox
          open={activeIndex >= 0}
          close={() => setActiveIndex(-1)}
          index={Math.max(0, activeIndex)}
          slides={slides}
          carousel={{ finite: true, preload: 1 }}
          animation={{ fade: animationDuration, swipe: animationDuration, zoom: animationDuration }}
          controller={{ closeOnBackdropClick: true }}
          captions={{ descriptionTextAlign: "center", descriptionMaxLines: 2 }}
          thumbnails={{ width: 80, height: 60, borderRadius: 0, gap: 10 }}
          styles={{
            container: { backgroundColor: "rgba(31, 26, 22, 0.98)" },
            thumbnailsContainer: { backgroundColor: "rgba(31, 26, 22, 0.98)" },
          }}
          on={{ exited: () => opener.current?.focus({ preventScroll: true }) }}
        />
      )}
    </div>
  );
}
