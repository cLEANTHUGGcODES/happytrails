"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  GalleryHorizontalEnd,
  LayoutGrid,
  Maximize2,
} from "lucide-react";
import {
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { flushSync } from "react-dom";
import type { LightboxExternalProps } from "yet-another-react-lightbox";
import type { MediaItem } from "@/lib/content";
import { useGalleryMotion, type GalleryView } from "./use-gallery-motion";
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

const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
const reducedMotionSnapshot = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const reducedMotionServerSnapshot = () => true;
const subscribeToMotion = (notify: () => void) => {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  preference.addEventListener("change", notify);
  return () => preference.removeEventListener("change", notify);
};

export function PhotoGallery({ items }: { items: MediaItem[] }) {
  const hydrated = useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot);
  const reducedMotion = useSyncExternalStore(
    subscribeToMotion,
    reducedMotionSnapshot,
    reducedMotionServerSnapshot,
  );
  const collectionId = useId();
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const thumbnailStrip = useRef<HTMLDivElement>(null);
  const photoButtons = useRef(new Map<string, HTMLButtonElement>());
  const thumbnailButtons = useRef(new Map<string, HTMLButtonElement>());
  const gesture = useRef<{ x: number; y: number; time: number; pointerId: number } | null>(null);
  const suppressClickUntil = useRef(0);
  const motion = useGalleryMotion();
  const [category, setCategory] = useState("All photos");
  const [view, setView] = useState<GalleryView>("grid");
  const [selectedId, setSelectedId] = useState(items[0]?.id);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [hasOpened, setHasOpened] = useState(false);
  const animationDuration = reducedMotion ? 0 : 250;

  const categories = categoryOrder.filter((value) => items.some((item) => item.category === value));
  const filtered = useMemo(
    () => items.filter((item) => category === "All photos" || item.category === category),
    [items, category],
  );
  const selectedIndex = Math.max(
    0,
    filtered.findIndex((item) => item.id === selectedId),
  );
  const selected = filtered[selectedIndex];
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

  function revealThumbnail(id: string) {
    const strip = thumbnailStrip.current;
    const button = thumbnailButtons.current.get(id);
    if (!strip || !button) return;
    const offset = button.getBoundingClientRect().left - strip.getBoundingClientRect().left;
    strip.scrollTo({
      left: strip.scrollLeft + offset - (strip.clientWidth - button.clientWidth) / 2,
      behavior: "instant",
    });
  }

  function changeView(nextView: GalleryView, item = selected) {
    if (!item || (nextView === view && item.id === selected?.id)) return;
    motion.transition(
      photoButtons.current.get(item.id) || null,
      item,
      view,
      nextView,
      () => {
        flushSync(() => {
          setSelectedId(item.id);
          setView(nextView);
        });
        const button = photoButtons.current.get(item.id);
        if (nextView === "slideshow" && root.current) {
          const header = document.querySelector("header");
          const headerHeight =
            header && ["fixed", "sticky"].includes(getComputedStyle(header).position)
              ? header.getBoundingClientRect().height
              : 0;
          window.scrollTo({
            top: window.scrollY + root.current.getBoundingClientRect().top - headerHeight - 16,
            behavior: "instant",
          });
          revealThumbnail(item.id);
        } else {
          button?.scrollIntoView({ block: "center", behavior: "instant" });
        }
        button?.focus({ preventScroll: true });
      },
      () => photoButtons.current.get(item.id) || null,
    );
  }

  function showSlide(index: number) {
    const item = filtered[index];
    if (!item || index === selectedIndex) return;
    const focusPhoto = photoButtons.current.get(selected.id) === document.activeElement;
    const focusThumbnail = thumbnailStrip.current?.contains(document.activeElement);
    motion.finish();
    flushSync(() => setSelectedId(item.id));
    motion.reveal(photoButtons.current.get(item.id) || null, Math.sign(index - selectedIndex));
    revealThumbnail(item.id);
    if (focusPhoto) photoButtons.current.get(item.id)?.focus({ preventScroll: true });
    else if (focusThumbnail) thumbnailButtons.current.get(item.id)?.focus({ preventScroll: true });
  }

  function selectCategory(nextCategory: string) {
    if (category === nextCategory) return;
    motion.finish();
    const nextItems = items.filter(
      (item) => nextCategory === "All photos" || item.category === nextCategory,
    );
    const nextSelected = nextItems.find((item) => item.id === selected?.id) || nextItems[0];
    flushSync(() => {
      setCategory(nextCategory);
      setSelectedId(nextSelected?.id);
    });
    if (view === "slideshow" && nextSelected) {
      motion.reveal(photoButtons.current.get(nextSelected.id) || null, 1);
      revealThumbnail(nextSelected.id);
    }
  }

  function openPhoto(index: number) {
    motion.finish();
    setHasOpened(true);
    setLightboxIndex(index);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (
      view !== "slideshow" ||
      lightboxIndex >= 0 ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    )
      return;
    const target = event.target as HTMLElement;
    if (!stage.current?.contains(target) && !thumbnailStrip.current?.contains(target)) return;
    if (["ArrowLeft", "ArrowRight", "Home", "End", "Escape"].includes(event.key))
      event.preventDefault();
    if (event.key === "Escape") changeView("grid");
    else if (event.key === "ArrowLeft") showSlide(selectedIndex - 1);
    else if (event.key === "ArrowRight") showSlide(selectedIndex + 1);
    else if (event.key === "Home") showSlide(0);
    else if (event.key === "End") showSlide(filtered.length - 1);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (view !== "slideshow" || event.pointerType === "mouse" || !event.isPrimary) return;
    gesture.current = {
      x: event.clientX,
      y: event.clientY,
      time: event.timeStamp,
      pointerId: event.pointerId,
    };
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = gesture.current;
    gesture.current = null;
    if (!start || start.pointerId !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (
      Math.abs(dx) > 50 &&
      Math.abs(dx) > Math.abs(dy) * 1.5 &&
      event.timeStamp - start.time < 800
    ) {
      suppressClickUntil.current = event.timeStamp + 400;
      showSlide(selectedIndex + (dx < 0 ? 1 : -1));
    }
  }

  if (items.length === 0) {
    return <p className={styles.empty}>More moments from Happy Trails are on their way.</p>;
  }

  return (
    <div className={styles.gallery} ref={root} onKeyDown={onKeyDown}>
      <div className={styles.galleryHeader}>
        <div className={styles.filters} role="group" aria-label="Filter photographs">
          {["All photos", ...categories].map((value) => (
            <button
              key={value}
              type="button"
              className={styles.filter}
              aria-pressed={category === value}
              disabled={!hydrated}
              onClick={() => selectCategory(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <div className={styles.viewSwitch} role="group" aria-label="Gallery view">
          <button
            type="button"
            aria-pressed={view === "grid"}
            aria-controls={collectionId}
            disabled={!hydrated}
            onClick={() => changeView("grid")}
          >
            <LayoutGrid size={16} aria-hidden="true" /> Grid
          </button>
          <button
            type="button"
            aria-pressed={view === "slideshow"}
            aria-controls={collectionId}
            disabled={!hydrated}
            onClick={() => changeView("slideshow")}
          >
            <GalleryHorizontalEnd size={17} aria-hidden="true" /> Slideshow
          </button>
        </div>
      </div>
      <div className={styles.collectionMeta}>
        <p className={styles.count} aria-live="polite" aria-atomic="true" data-gallery-count>
          {filtered.length} {filtered.length === 1 ? "photograph" : "photographs"}
        </p>
        <p>
          {view === "grid"
            ? "Choose a photo. Stay a little while."
            : "A closer look at Happy Trails."}
        </p>
      </div>

      <div
        id={collectionId}
        role={view === "slideshow" ? "region" : undefined}
        aria-label={view === "slideshow" ? "Happy Trails photo slideshow" : undefined}
        aria-roledescription={view === "slideshow" ? "carousel" : undefined}
      >
        <div
          className={view === "grid" ? styles.grid : styles.slideshow}
          ref={stage}
          data-gallery-stage
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            gesture.current = null;
          }}
        >
          {filtered.map((item, index) => (
            <figure
              className={styles.item}
              key={item.id}
              hidden={view === "slideshow" && index !== selectedIndex}
            >
              <button
                ref={(button) => {
                  if (button) photoButtons.current.set(item.id, button);
                  else photoButtons.current.delete(item.id);
                }}
                type="button"
                className={styles.photoButton}
                aria-label={`${view === "grid" ? "Open" : "Enlarge"} photograph: ${item.caption}`}
                aria-haspopup={view === "slideshow" ? "dialog" : undefined}
                disabled={!hydrated}
                onClick={(event) => {
                  if (event.timeStamp < suppressClickUntil.current) return;
                  if (view === "grid") changeView("slideshow", item);
                  else openPhoto(index);
                }}
              >
                <Image
                  className={styles.photo}
                  src={item.src}
                  alt={item.alt}
                  fill
                  unoptimized={view === "slideshow" && index === selectedIndex}
                  sizes={
                    view === "slideshow" && index === selectedIndex
                      ? "(max-width: 760px) 100vw, 90vw"
                      : "(max-width: 639px) calc((100vw - 52px) / 2), (max-width: 1023px) 46vw, 30vw"
                  }
                  style={{ objectPosition: view === "grid" ? item.position || "center" : "center" }}
                />
                <span className={styles.expand} aria-hidden="true">
                  {view === "grid" ? (
                    <ArrowUpRight size={21} strokeWidth={1.5} />
                  ) : (
                    <>
                      <Maximize2 size={17} /> <span>Enlarge photo</span>
                    </>
                  )}
                </span>
              </button>
              <figcaption className={styles.caption}>
                <span className={styles.captionText}>{item.caption}</span>
                <span className={styles.category}>{item.category}</span>
              </figcaption>
            </figure>
          ))}
          {view === "slideshow" && (
            <div className={styles.slideControls}>
              <button
                type="button"
                aria-label="Previous photograph"
                aria-disabled={selectedIndex === 0}
                onClick={() => showSlide(selectedIndex - 1)}
              >
                <ArrowLeft size={20} aria-hidden="true" />
              </button>
              <p role="status" aria-live="polite" aria-atomic="true">
                <span className={styles.srOnly}>Photograph </span>
                {selectedIndex + 1} <span className={styles.divider}>/</span> {filtered.length}
              </p>
              <button
                type="button"
                aria-label="Next photograph"
                aria-disabled={selectedIndex === filtered.length - 1}
                onClick={() => showSlide(selectedIndex + 1)}
              >
                <ArrowRight size={20} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        {view === "slideshow" && (
          <div
            className={styles.thumbnailStrip}
            ref={thumbnailStrip}
            role="group"
            aria-label="Slideshow thumbnails"
          >
            {filtered.map((item, index) => (
              <button
                type="button"
                key={item.id}
                ref={(button) => {
                  if (button) thumbnailButtons.current.set(item.id, button);
                  else thumbnailButtons.current.delete(item.id);
                }}
                className={styles.thumbnail}
                aria-label={`Show photograph ${index + 1}: ${item.caption}`}
                aria-current={index === selectedIndex ? "true" : undefined}
                onClick={() => showSlide(index)}
              >
                <Image
                  src={item.src}
                  alt=""
                  fill
                  sizes="84px"
                  className={styles.thumbnailImage}
                  style={{ objectPosition: item.position || "center" }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {hasOpened && (
        <Lightbox
          open={lightboxIndex >= 0}
          close={() => setLightboxIndex(-1)}
          index={Math.max(0, lightboxIndex)}
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
          on={{
            view: ({ index }) => {
              if (lightboxIndex >= 0 && filtered[index]) {
                setSelectedId(filtered[index].id);
                setLightboxIndex(index);
                revealThumbnail(filtered[index].id);
              }
            },
            exited: () => photoButtons.current.get(selected.id)?.focus({ preventScroll: true }),
          }}
        />
      )}
    </div>
  );
}
